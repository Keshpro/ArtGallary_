"use client";
import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  // Load cart items from localStorage on initial render
  useEffect(() => {
    const savedCart = localStorage.getItem("aggrani_cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // Sync cart items with localStorage whenever it changes
  const saveCart = (newCart) => {
    setCart(newCart);
    localStorage.setItem("aggrani_cart", JSON.stringify(newCart));
  };

  const addToCart = (art) => {
    const exists = cart.find((item) => item.id === art.id);
    if (exists) {
      alert(`${art.title} is already in your curation cart!`);
      return;
    }
    const newCart = [...cart, art];
    saveCart(newCart);
    alert(`${art.title} added to curation cart. 🪐`);
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