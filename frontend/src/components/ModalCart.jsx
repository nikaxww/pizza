import { useCart } from '../context/CartContext';

export default function ModalCart() {
  const { 
    cartItems, isCartOpen, setIsCartOpen, 
    updateQty, clearCart, total, user 
  } = useCart();

  const checkout = () => {
    if (!user) {
      alert('Пожалуйста, войдите в систему');
      return;
    }
    
    fetch('http://localhost:3000/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id_user: user.id,
        delivery_address: document.querySelector('.input-address')?.value || 'Адрес не указан',
        payment_method: 'карта',
        items: cartItems.map(i => ({
          id_product: i.id_product,
          price: i.price,
          quantity: i.quantity
        }))
      })
    })
    .then(res => res.json())
    .then(() => {
      clearCart();
      setIsCartOpen(false);
      alert('Заказ оформлен!');
    });
  };

  return (
    <div className={`modal modal-cart ${isCartOpen ? 'is-open' : ''}`}>
      <div className="modal-dialog">
        <div className="modal-header">
          <h3 className="modal-title">Корзина</h3>
          <button className="close" onClick={() => setIsCartOpen(false)}>&times;</button>
        </div>
        <div className="modal-body">
          {cartItems.length === 0 ? (
            <p>Корзина пуста</p>
          ) : (
            cartItems.map(item => (
              <div key={item.id} className="food-row">
                <span className="food-name">{item.name}</span>
                <strong className="food-price">{item.price} ₽</strong>
                <div className="food-counter">
                  <button 
                    className="counter-button"
                    onClick={() => updateQty(item.id, item.quantity - 1)}
                  >-</button>
                  <span className="counter">{item.quantity}</span>
                  <button 
                    className="counter-button"
                    onClick={() => updateQty(item.id, item.quantity + 1)}
                  >+</button>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="modal-footer">
          <span className="modal-pricetag">{total} ₽</span>
          <div className="footer-buttons">
            <button 
              className="button button-primary"
              onClick={checkout}
              disabled={cartItems.length === 0}
            >
              Оформить заказ
            </button>
            <button className="button clear-cart" onClick={() => setIsCartOpen(false)}>
              Отмена
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}