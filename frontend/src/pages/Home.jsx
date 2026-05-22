import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Promo from '../components/Promo';
import RestaurantCard from '../components/RestaurantCard';
import ModalCart from '../components/ModalCart';
import Search from '../components/Search';

export default function Home() {
  const [restaurants, setRestaurants] = useState([]);
  const [searchParams] = useSearchParams();
  const query = searchParams.get('search');

  useEffect(() => {
    const url = query
      ? `http://localhost:3000/api/partners/search/${query}`
      : 'http://localhost:3000/api/partners';
      
    fetch(url)
      .then(res => res.json())
      .then(setRestaurants);
  }, [query]);

  return (
    <>
      <Header />
      <main className="main">
        <div className="container">
          <Promo />
          <section className="restaurants">
            <div className="section-heading">
              <h2 className="section-title">Рестораны</h2>
              <Search />
            </div>
            <div className="cards cards-restaurants">
              {restaurants.map(r => (
                <RestaurantCard key={r.id} r={r} />
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