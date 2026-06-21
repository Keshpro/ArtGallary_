"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { useToast } from "./ToastContext"; // ◀️ නිවැරදිව ලින්ක් කර ඇති බව තහවුරු කරගන්න

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const { showToast } = useToast(); // 🔥 මෙතනදී Destructure එක සාර්ථකව සිදුවේ

  useEffect(() => {
    const savedCart = localStorage.getItem("aggrani_cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  const saveCart = (newCart) => {
    setCart(newCart);
    localStorage.setItem("aggrani_cart", JSON.stringify(newCart));
  };

  const addToCart = (art) => {
    const exists = cart.find((item) => item.id === art.id);
    if (exists) {
      // 🔄 පරණ alert වෙනුවට modern error toast එක
      showToast(`${art.title} is already in your curation cart!`, "error");
      return;
    }
    const newCart = [...cart, art];
    saveCart(newCart);
    // 🔄 පරණ alert වෙනුවට modern success toast එක
    showToast(`${art.title} added to curation cart. 🪐`, "success");
  };

  const removeFromCart = (id) => {
    const newCart = cart.filter((item) => item.id !== id);
    saveCart(newCart);
  };

  const clearCart = () => {
    saveCart([]);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);