import { createContext, useContext, useState } from "react";
import { getCartItems } from "../services/cartService";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);

  const loadCartCount = async () => {
    try {
      const items = await getCartItems();

      const count = items.reduce(
        (total, item) => total + item.quantity,
        0
      );

      setCartCount(count);
    } catch (err) {
      console.log("Cart count error:", err);
      setCartCount(0);
    }
  };

  return (
    <CartContext.Provider value={{ cartCount, loadCartCount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
