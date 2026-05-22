import { useNavigate } from 'react-router-dom';

export default function Search() {
  const navigate = useNavigate();
  
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && e.target.value.trim()) {
      navigate(`/?search=${e.target.value}`);
    }
  };
  
  return (
    <label className="search">
      <input 
        type="text" 
        className="input input-search" 
        placeholder="Поиск блюд и ресторанов"
        onKeyDown={handleKeyDown}
      />
    </label>
  );
}