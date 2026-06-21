import { NextResponse } from "next/server";
import { google } from "googleapis";
import { Resend } from "resend";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

// Resend Email Engine Initialize කිරීම
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
  try {
    // Frontend Checkout Form එකෙන් එන ඩේටා කියවීම
    const body = await request.json();
    const { 
      customerName, 
      customerEmail, 
      customerPhone, 
      customerAddress, 
      artworkId,
      artworkTitle, 
      price 
    } = body;

    const orderedAt = new Date().toLocaleString("en-US", { timeZone: "Asia/Colombo" });

    // ==========================================
    // 1. GOOGLE SHEETS API SYNC
    // ==========================================
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        // Private Key එකේ තියෙන \n නිවැරදිව parse කරගැනීම
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheets = google.sheets({ version: "v4", auth });
    
    // Google Sheet එකේ අන්තිමටම අලුත් Row එකක් විදිහට ඩේටා ඇඩ් කිරීම
    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: "Sheet1!A:G", // ඔයාගේ ශීට් එකේ නම 'Sheet1' නම්
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [
          [orderedAt, customerName, customerEmail, customerPhone, customerAddress, artworkTitle, `LKR ${price}`]
        ],
      },
    });

    // ==========================================
    // 2. FIREBASE FIRESTORE ORDER TRACKING SYNC
    // ==========================================
    await addDoc(collection(db, "orders"), {
      customerName,
      customerEmail,
      customerPhone,
      customerAddress,
      artworkId,
      artworkTitle,
      price: parseFloat(price),
      status: "Pending", // Default Dashboard Status
      createdAt: serverTimestamp(),
    });

    // ==========================================
    // 3. RESEND EMAIL ENGINE: ADMIN ALERT
    // ==========================================
    await resend.emails.send({
      from: "KreativeLabs Art <onboarding@resend.dev>",
      to: "your-email@gmail.com", // ◀️ මෙතනට ඔයාගේ හෝ කලාකාරිනියගේ පුද්ගලික ඊමේල් එක දාන්න
      subject: `🚨 New Masterpiece Acquisition Request - ${artworkTitle}`,
      html: `
        <div style="font-family: sans-serif; background-color: #070708; color: #f4f4f5; padding: 30px; border-radius: 16px; max-width: 600px; margin: auto; border: 1px solid #27272a;">
          <h2 style="color: #f59e0b; font-size: 20px; font-weight: 900; letter-spacing: 1px; text-transform: uppercase; border-bottom: 1px solid #18181b; padding-bottom: 10px; margin-top: 0;">
            Acquisition Alert
          </h2>
          <p style="font-size: 14px; color: #a1a1aa;">A premium collector has just submitted an invoice to acquire a masterpiece.</p>
          
          <div style="background-color: #18181b; padding: 20px; border-radius: 12px; margin-top: 20px; border: 1px solid #27272a;">
            <h3 style="font-size: 11px; text-transform: uppercase; color: #f59e0b; margin-top: 0; tracking: 1px;">Artwork Details</h3>
            <p style="font-size: 14px; margin: 5px 0;"><strong>Title:</strong> ${artworkTitle}</p>
            <p style="font-size: 14px; margin: 5px 0;"><strong>Value:</strong> LKR ${price?.toLocaleString()}</p>
          </div>

          <div style="background-color: #18181b; padding: 20px; border-radius: 12px; margin-top: 20px; border: 1px solid #27272a;">
            <h3 style="font-size: 11px; text-transform: uppercase; color: #f59e0b; margin-top: 0; tracking: 1px;">Collector Shipping Matrix</h3>
            <p style="font-size: 14px; margin: 5px 0;"><strong>Name:</strong> ${customerName}</p>
            <p style="font-size: 14px; margin: 5px 0;"><strong>Email:</strong> ${customerEmail}</p>
            <p style="font-size: 14px; margin: 5px 0;"><strong>Phone:</strong> ${customerPhone}</p>
            <p style="font-size: 14px; margin: 5px 0;"><strong>Destination:</strong> ${customerAddress}</p>
          </div>

          <p style="font-size: 10px; color: #71717a; text-align: center; margin-top: 30px; letter-spacing: 1px; text-transform: uppercase;">
            Automated via KreativeLabs Design Engine &copy; 2026
          </p>
        </div>
      `,
    });

    // සාර්ථක වූ පසු Frontend එකට Success Response එකක් යැවීම
    return NextResponse.json({ success: true, message: "Acquisition workflows executed successfully." }, { status: 200 });

  } catch (error) {
    console.error("Backend Checkout Critical Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}