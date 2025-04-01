import { useState, useEffect } from "react";
import { db } from "../firebase/config"; // Adjust the import based on your Firebase config
import { collection, getDocs } from "firebase/firestore";

const SearchFilter = () => {
  const [cars, setCars] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCars, setFilteredCars] = useState([]);

  // Fetching cars from Firestore
  useEffect(() => {
    const fetchCars = async () => {
      try {
        const carCollection = collection(db, "cards"); // Fetching from "cards" collection
        const carSnapshot = await getDocs(carCollection);
        const carList = carSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setCars(carList);
        console.log("Fetched Cars:", carList);  // Log fetched cars for debugging
      } catch (error) {
        console.error("Error fetching cars:", error);
      }
    };

    fetchCars();
  }, []);

  // Handling search query and filtering cars
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredCars([]); // Reset when query is empty
      return;
    }

    const lowerCaseQuery = searchQuery.toLowerCase();
    console.log("Searching for:", lowerCaseQuery);  // Log search query for debugging

    // Filter cars based on the search query (title, country, or description)
    const results = cars.filter(car =>
      car.title.toLowerCase().includes(lowerCaseQuery) || // Search by title
      car.country.toLowerCase().includes(lowerCaseQuery) || // Search by country
      car.description.toLowerCase().includes(lowerCaseQuery) // Search by description
    );
    
    console.log("Filtered Results:", results);  // Log filtered results for debugging
    setFilteredCars(results);
  }, [searchQuery, cars]);

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {/* Search bar */}
      <input
        type="text"
        placeholder="Search for cars..."
        value={searchQuery}
        onChange={e => setSearchQuery(e.target.value)}
        className="w-full px-4 py-2 rounded-lg border-2 border-custom-blue focus:outline-none focus:ring-2 focus:ring-custom-blue mb-4"
      />

      {/* Displaying filtered cars */}
      <div className="car-list grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredCars.length > 0 ? (
          filteredCars.map(car => (
            <div key={car.id} className="car-card bg-white p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
              <img src={car.imgSrc} alt={car.title} className="w-full h-40 object-cover rounded-md mb-4" />
              <h3 className="text-custom-blue text-xl font-semibold">{car.title}</h3>
              <p className="text-custom-dark-gray mt-2">Country: {car.country}</p>
              <p className="text-custom-dark-gray mt-1">Description: {car.description}</p>
              <p className="text-custom-dark-gray mt-2">Price: ${car.price}</p>
            </div>
          ))
        ) : (
          searchQuery && (
            <p className="text-center text-custom-dark-gray text-xl mt-4">
              Sorry, we can't find "{searchQuery}".
            </p>
          )
        )}
      </div>
    </div>
  );
};

export default SearchFilter;
