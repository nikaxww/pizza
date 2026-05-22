import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import ModalCart from '../components/ModalCart';

export default function Restaurant() {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:3000/api/partners/${id}`)
      .then(res => res.json())
      .then(setRestaurant);
      
    fetch(`http://localhost:3000/api/products/partner/${id}`)
      .then(res => res.json())
      .then(setProducts);
  }, [id]);

  if (!restaurant) return <div className="container" style={{padding: '40px'}}>Загрузка...</div>;

  return (
    <>
      <Header />
      <main className="main">
        <div className="container">
          <section className="menu">
            <div className="section-heading">
              <h2 className="section-title restaurant-title">{restaurant.name}</h2>
              <div className="card-info">
                <div className="rating">{restaurant.stars}</div>
                <div className="price">От {restaurant.price} ₽</div>
                <div className="category">{restaurant.kitchen}</div>
              </div>
            </div>
            <div className="cards cards-menu">
              {products.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        </div>
      </main>
      <Footer />
      <ModalCart />
    </>
  );
}