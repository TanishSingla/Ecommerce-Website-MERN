import React, { useEffect, useState } from 'react'
import LoadingSpinner from './LoadingSpinner';
import toast from 'react-hot-toast';
import axios from '../lib/axios';
import ProductCard from './ProductCard';

const RecommendedProducts = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const res = await axios.get("/products/recommendations");
        setRecommendations(res.data.products);

      } catch (error) {
        toast.error(error.response.data.message || "An error occurred while fetching recommendations");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className='mt-8'>
      <h3 className='text-2xl font-semibold text-emerald-400'>People also bought</h3>
      <div className='mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg: grid-col-3 md:grid-cols-2'>
        {recommendations.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
}

export default RecommendedProducts
