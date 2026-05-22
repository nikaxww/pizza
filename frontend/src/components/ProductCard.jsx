import { useCart } from '../context/CartContext';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  
  return (
    <div className="card">
    <img src={`/${product.image}`} alt={product.name} className="card-image" />
      <div className="card-text">
        <div className="card-heading">
          <h3 className="card-title card-title-reg">{product.name}</h3>
        </div>
        <div className="card-info">
          <div className="ingredients">{product.descriptions}</div>
        </div>
        <div className="card-buttons">
          <button 
            className="button button-primary button-add-cart"
            onClick={() => addToCart(product)}
          >
            <span className="button-card-text">В корзину</span>
            <span className="button-cart-svg"></span>
          </button>
          <strong className="card-price-bold">{product.price} ₽</strong>
        </div>
      </div>
    </div>
  );
}