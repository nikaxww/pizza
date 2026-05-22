import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import ModalAuth from './ModalAuth';

export default function Header() {
  const { user, isCartOpen, setIsCartOpen, logout } = useCart();

  const openAuth = () => {
    const event = new CustomEvent('openAuthModal');
    window.dispatchEvent(event);
  };

  return (
    <>
      <header className="header">
        <Link to="/" className="logo">
          <img src="/img/icon/logo.svg" alt="Logo" />
        </Link>
        
        <label className="address">
          <input type="text" className="input input-address" placeholder="Адрес доставки" />
        </label>
        
        <div className="buttons">
          {user && <span className="user-name">{user.full_name}</span>}
          
          {!user ? (
            <button className="button button-primary button-auth" onClick={openAuth}>
              <span className="button-auth-svg"></span>
              <span className="button-text">Войти</span>
            </button>
          ) : (
            <button className="button button-primary button-out" onClick={logout}>
              <span className="button-text">Выйти</span>
              <span className="button-out-svg"></span>
            </button>
          )}
          
          <button className="button button-cart" onClick={() => setIsCartOpen(true)}>
            <span className="button-cart-svg"></span>
            <span className="button-text">Корзина</span>
          </button>
        </div>
      </header>

      <ModalAuth />
    </>
  );
}