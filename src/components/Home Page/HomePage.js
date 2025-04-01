// HomePage.js
import React from 'react';
import Hero from '../hero/hero';
import Home from '../Home/Home';
import SearchFilter from '../filter/filter'; // Adjust the path if needed

const HomePage = () => {
  return (
    <div>
      <Hero />
      <SearchFilter /> {/* Add Search and Filter Component */}
      <Home />
    </div>
  );
};

export default HomePage;
