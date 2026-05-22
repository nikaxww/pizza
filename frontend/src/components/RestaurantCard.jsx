import { Link } from 'react-router-dom';

export default function RestaurantCard({ r }) {
  return (
    <Link to={`/restaurant/${r.id}`} className="card card-restaurant">
      <img src={`/${r.image}`} alt={r.name} className="card-image" />
      <div className="card-text">
        <div className="card-heading">
          <h3 className="card-title">{r.name}</h3>
          <span className="card-tag tag">{r.time_of_delivery} мин</span>
        </div>
        <div className="card-info">
          <div className="rating">{r.stars}</div>
          <div className="price">От {r.price} ₽</div>
          <div className="category">{r.kitchen}</div>
        </div>
      </div>
    </Link>
  );
}