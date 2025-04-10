import React from 'react';
import ListingCard from '../components/ListingCard';

function Marketplace() {
  // Sample products data
  const products = [
    {
      id: 1,
      title: "Vintage Denim Jacket",
      brand: "Levi's",
      price: 120,
      originalPrice: 180,
      size: "M",
      condition: "Used - Excellent",
      images: ["https://images.unsplash.com/photo-1551537482-f2075a1d41f2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"],
      likes: 5,
      isNew: false,
      location: "New York"
    },
    {
      id: 2,
      title: "Air Jordan 1 Retro High",
      brand: "Nike",
      price: 220,
      size: "US 10",
      condition: "New",
      images: ["https://images.unsplash.com/photo-1556906781-9a412961c28c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"],
      likes: 12,
      isNew: true,
      location: "Los Angeles"
    },
    {
      id: 3,
      title: "Logo Hoodie",
      brand: "Supreme",
      price: 160,
      originalPrice: 220,
      size: "L",
      condition: "Used - Good",
      images: ["https://images.unsplash.com/photo-1556172883-a4a48a5694a9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"],
      likes: 8,
      isNew: false,
      location: "Chicago"
    },
    {
      id: 4,
      title: "Wool Overcoat",
      brand: "Burberry",
      price: 450,
      size: "L",
      condition: "Used - Excellent",
      images: ["https://images.unsplash.com/photo-1539533018447-63fcce2678e3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"],
      likes: 3,
      isNew: false,
      location: "Boston"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Marketplace</h1>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {products.map(product => (
          <ListingCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

export default Marketplace; 