import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';

export default function ModalAuth() {
  const { login } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const handler = () => setIsOpen(true);
    window.addEventListener('openAuthModal', handler);
    return () => window.removeEventListener('openAuthModal', handler);
  }, []);

  const close = () => {
    setIsOpen(false);
    setIsRegister(false);
    setError('');
  };

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    const fd = new FormData(e.target);
    const data = {
      full_name: fd.get('full_name'),
      email: fd.get('email'),
      phone: fd.get('phone'),
      address: fd.get('address'),
      login: fd.get('login'),
      password: fd.get('password')
    };

    const url = isRegister 
      ? 'http://localhost:3000/api/users/register' 
      : 'http://localhost:3000/api/users/login';

    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    .then(res => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    })
    .then(result => {
      if (isRegister) {
        if (result.id) {
          alert('✅ Регистрация успешна! Теперь войдите.');
          setIsRegister(false);
          e.target.reset();
        } else {
          setError(result.message || 'Ошибка регистрации');
        }
      } else {
        if (result.user) {
          login(result.user);
          close();
          e.target.reset();
        } else {
          setError(result.message || 'Неверный логин или пароль');
        }
      }
    })
    .catch(err => {
      console.error('Auth error:', err);
      setError(err.message || 'Ошибка соединения');
    });
  };

  return (
    <div className="modal-auth is-open">
      <div className="modal-dialog modal-dialog-auth">
        <button className="close-auth" onClick={close}>&times;</button>
        <form onSubmit={handleSubmit}>
          <fieldset className="modal-body">
            <legend className="modal-title">
              {isRegister ? 'Регистрация' : 'Авторизация'}
            </legend>
            
            {isRegister && (
              <>
                <label className="label-auth">
                  <span>Имя</span>
                  <input name="full_name" type="text" required />
                </label>
                <label className="label-auth">
                  <span>Email</span>
                  <input name="email" type="email" required />
                </label>
                <label className="label-auth">
                  <span>Телефон</span>
                  <input name="phone" type="tel" required />
                </label>
                <label className="label-auth">
                  <span>Адрес</span>
                  <input name="address" type="text" required />
                </label>
              </>
            )}
            
            <label className="label-auth">
              <span>Логин</span>
              <input name="login" type="text" required />
            </label>
            <label className="label-auth">
              <span>Пароль</span>
              <input name="password" type="password" required />
            </label>
            
            {error && <p style={{color: '#e74c3c', fontSize: '14px', margin: '10px 0'}}>{error}</p>}
          </fieldset>
          
          <div className="modal-footer">
            <button className="button button-primary" type="submit">
              {isRegister ? 'Зарегистрироваться' : 'Войти'}
            </button>
            <button 
              type="button" 
              className="button clear-cart"
              onClick={() => {
                setIsRegister(!isRegister);
                setError('');
              }}
              style={{marginLeft: '10px'}}
            >
              {isRegister ? 'Уже есть аккаунт?' : 'Нет аккаунта?'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}