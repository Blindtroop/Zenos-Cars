import React, { useEffect, useState } from "react";
import { db } from "../firebase/config";
import { collection, onSnapshot } from "firebase/firestore";
import CardComponent from '../card/card';
import useDebounce from '../../Hooks/use-debounce';

const Home = () => {
  const [cards, setCards] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCards, setFilteredCards] = useState([]);
  const [error, setError] = useState(null);
  const [countryFilter, setCountryFilter] = useState(""); // Changed from 'filter'
  const [countries, setCountries] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [debouncedQuery] = useDebounce(searchQuery, 500);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "cards"), (snapshot) => {
      const cardData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCards(cardData);
      setFilteredCards(cardData);
    }, (error) => {
      console.error("Error fetching cards: ", error);
      setError("Failed to fetch cards. Please try again later.");
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("https://restcountries.com/v3.1/all");
        const data = await response.json();
        // Sort countries alphabetically
        const sortedCountries = data
          .map((country) => country.name.common)
          .sort((a, b) => a.localeCompare(b));
        setCountries(sortedCountries);
      } catch (error) {
        console.error("Error fetching countries:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCountries();
  }, []);

  useEffect(() => {
    const filtered = cards.filter((card) => {
      // Search across all fields without case conversion
      const searchMatches = (
        (card.title && card.title.includes(debouncedQuery)) ||
        (card.country && card.country.includes(debouncedQuery)) ||
        (card.description && card.description.includes(debouncedQuery))
      );

      // Country filter with partial matching
      const countryMatches = countryFilter 
        ? (card.country && card.country.includes(countryFilter))
        : true;

      return searchMatches && countryMatches;
    });

    setFilteredCards(filtered);
  }, [debouncedQuery, countryFilter, cards]);

  return (
    <div className="p-6 bg-custom-gray pt-20">
      <h2 className="text-2xl font-bold text-custom-dark-gray mb-6 text-center">Our Collection</h2>
      
      {/* Search Bar */}
      <div className="flex justify-center mb-4">
        <input
          type="text"
          placeholder="Search for cars..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-1/2 px-4 py-2 rounded-lg border-2 border-custom-blue focus:outline-none focus:ring-2 focus:ring-custom-blue"
        />
      </div>

      {/* Country Filter with datalist */}
      <div className="flex justify-center mb-4">
        <input
          type="text"
          placeholder="Filter by country..."
          value={countryFilter}
          onChange={(e) => setCountryFilter(e.target.value)}
          list="countries-list"
          className="w-1/2 px-4 py-2 rounded-lg border-2 border-custom-blue focus:outline-none focus:ring-2 focus:ring-custom-blue"
        />
        <datalist id="countries-list">
          {countries.map((country, index) => (
            <option key={index} value={country} />
          ))}
        </datalist>
      </div>

      {error && (
        <div className="text-center text-red-600 font-bold mb-4">
          {error}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCards.length > 0 ? (
          filteredCards.map((card) => (
            <CardComponent key={card.id} cardData={card} />
          ))
        ) : (
          searchQuery && (
            <p className="text-center text-custom-dark-gray text-xl mt-4">
              Sorry, we can't find cars that match "{searchQuery}".
            </p>
          )
        )}
      </div>
    </div>
  );
};

export default Home;