import { NextResponse } from "next/server";
import { google } from "googleapis";
import { Resend } from "resend";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

// [COMMENT]: 1. ඔයාගේ .env.local එකේ RESEND_API_KEY එක හරියටම තියෙන්න ඕනේ.
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
  try {
    const body = await request.json();
    const { customerName, customerEmail, customerPhone, customerAddress, artworks, totalPrice } = body;

    const cleanPrice = typeof totalPrice === "string" 
      ? parseFloat(totalPrice.replace(/,/g, "")) 
      : parseFloat(totalPrice);

    const orderedAt = new Date().toLocaleString("en-US", { timeZone: "Asia/Colombo" });

    const artworksListString = artworks.map(art => `- ${art.title} (LKR ${art.price})`).join("\n");
    const artworksHtmlList = artworks.map(art => `<li>${art.title} - LKR ${art.price?.toLocaleString()}</li>`).join("");

    // ==========================================
    // 1. GOOGLE SHEETS API SYNC
    // ==========================================
    // [COMMENT]: 2. .env.local එකේ GOOGLE_PRIVATE_KEY, GOOGLE_CLIENT_EMAIL, GOOGLE_SHEET_ID අනිවාර්යයෙන් තියෙන්න ඕනේ.
    const rawPrivateKey = process.env.GOOGLE_PRIVATE_KEY;
    const formattedPrivateKey = rawPrivateKey
      ? rawPrivateKey.replace(/^["']|["']$/g, "").replace(/\\n/g, "\n")
      : undefined;

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: formattedPrivateKey,
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheets = google.sheets({ version: "v4", auth });
    
    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: "Sheet1!A:G", 
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [
          [orderedAt, customerName, customerEmail, customerPhone, customerAddress, artworksListString, `LKR ${cleanPrice.toLocaleString()}`]
        ],
      },
    });

    // ==========================================
    // 2. FIREBASE FIRESTORE ORDER TRACKING SYNC
    // ==========================================
    // [COMMENT]: 3. Firebase ව්‍යාපෘතියේ db එක නිවැරදිව සෙට් කර තිබිය යුතුය.
    await addDoc(collection(db, "orders"), {
      customerName,
      customerEmail,
      customerPhone,
      customerAddress,
      artworks, 
      totalPrice: cleanPrice, 
      status: "Pending", 
      createdAt: serverTimestamp(),
    });

    // ==========================================
    // 3. TELEGRAM INSTANT NOTIFICATION ENGINE
    // ==========================================
    const botToken = "8042953758:AAEaS0hI4gwi4VYFV5xfDO4_OMPmhd132pM";
    const chatId = 8596657527;

    console.log("🚀 Telegram Triggering for ChatID:", chatId);

    const telegramMessage = `🚨 *NEW MASTERPIECE ORDER* 🚨\n\n` +
                            `👤 *Patron:* ${customerName}\n` +
                            `📞 *Phone:* ${customerPhone}\n` +
                            `✉️ *Email:* ${customerEmail}\n` +
                            `📍 *Address:* ${customerAddress}\n\n` +
                            `📦 *Acquired Artworks:*\n${artworksListString}\n\n` +
                            `💰 *Total Price:* LKR ${cleanPrice.toLocaleString()}\n\n` +
                            `🪐 _Automated via Aggrani Engine 2026_`;

    const tgResponse = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            chat_id: 8596657527,
            text: telegramMessage,
            parse_mode: "Markdown",
        }),
    });
      
    const tgResult = await tgResponse.json();
    console.log("📬 Telegram API Response:", tgResult);

    // ==========================================
    // 4. RESEND EMAIL ENGINE: ADMIN ALERT
    // ==========================================
    // [COMMENT]: 6. ඔයාගේ ඊමේල් එක හරියටම 'to' එකේ දාන්න.
    await resend.emails.send({
      from: "Aggrani Studio <onboarding@resend.dev>",
      to: "keshanebusiness@gmail.com", 
      subject: `🚨 New Acquisition Matrix Received - ${customerName}`,
      html: `...`, // (ඔයාගේ HTML කෝඩ් එක මෙතන තියෙනවා)
    });

    return NextResponse.json({ success: true, message: "Acquisition workflows executed successfully." }, { status: 200 });

  } catch (error) {
    console.error("Backend Checkout Critical Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}