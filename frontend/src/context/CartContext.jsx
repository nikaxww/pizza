import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [user, setUser] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  const handleLogout = () => {
    setUser(null);
    setCartItems([]);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.removeItem('cart'); 
  };

  const loadCart = (userId) => {
    fetch(`http://localhost:3000/api/basket/${userId}`)
      .then(res => res.json())
      .then(setCartItems);
  };

  const addToCart = (product) => {
    if (!user) {
      setIsAuthOpen(true);
      return;
    }
    fetch(`http://localhost:3000/api/basket`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id_user: user.id, id_product: product.id, quantity: 1 })
    })
    .then(() => loadCart(user.id));
  };

  const updateQty = (id, qty) => {
    const method = qty < 1 ? 'DELETE' : 'PUT';
    const url = `http://localhost:3000/api/basket/${id}`;
    const opts = { method };
    if (method === 'PUT') {
      opts.headers = { 'Content-Type': 'application/json' };
      opts.body = JSON.stringify({ quantity: qty });
    }
    fetch(url, opts)
      .then(() => loadCart(user.id));
  };

  const clearCart = () => {
    if (user?.id) {
      fetch(`http://localhost:3000/api/basket/user/${user.id}`, { method: 'DELETE' })
        .then(() => setCartItems([]));
    }
  };

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    loadCart(userData.id);
  };

  const logout = () => {
    setUser(null);
    setCartItems([]);
    localStorage.removeItem('user');
  };

  useEffect(() => {
    const saved = localStorage.getItem('user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setUser(parsed);
        loadCart(parsed.id);
      } catch (e) {
        console.error('Parse user error:', e);
        localStorage.removeItem('user');
      }
    }
  }, []);

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{
      cartItems, user, isCartOpen, isAuthOpen, total,
      setIsCartOpen, setIsAuthOpen, login, logout,
      addToCart, updateQty, clearCart, loadCart,
      handleLogout, 
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};