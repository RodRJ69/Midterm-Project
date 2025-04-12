import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/Footer";

const Home = () => {
  const [countries, setCountries] = useState([]);
  const [groupedCountries, setGroupedCountries] = useState({});
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState("All");
  const [regions, setRegions] = useState(["All"]);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [currentFlagIndex, setCurrentFlagIndex] = useState(0); // State for flag carousel
  const countriesPerPage = 12;

  // Fetch countries on mount
  useEffect(() => {
    axios
      .get("https://countries-api-abhishek.vercel.app/countries")
      .then((response) => {
        const data = response.data?.data || [];

        // Filter out invalid data (missing region or name)
        const validCountries = data.filter(
          (c) => c.region && c.name && typeof c.name === "string"
        );

        setCountries(validCountries);

        // Group countries by region
        const grouped = validCountries.reduce((acc, c) => {
          const reg = c.region?.trim() || "Unknown";
          if (!acc[reg]) acc[reg] = [];
          acc[reg].push(c);
          return acc;
        }, {});

        setGroupedCountries(grouped);

        // Get unique, trimmed regions
        const uniqueRegions = Array.from(
          new Set(validCountries.map((c) => c.region.trim()))
        ).sort();

        setRegions(["All", ...uniqueRegions]);
      })
      .catch((err) => {
        console.error("Fetch Error:", err);
        setError("Failed to fetch countries. Please try again.");
      });
  }, []);

  // Filtering logic
  const filterCountries = useCallback(() => {
    const trimmedQuery = query.trim().toLowerCase();

    // Filter countries based on region and search query
    const filtered = countries.filter((country) => {
      const name = country.name?.toLowerCase() || "";
      const countryRegion = country.region?.trim().toLowerCase() || "";
      const regionMatch = region === "All" || countryRegion === region.toLowerCase();
      const nameMatch = name.includes(trimmedQuery);
      return regionMatch && nameMatch;
    });

    // Remove duplicates by using a Set (this assumes country names are unique identifiers)
    const uniqueCountries = Array.from(new Set(filtered.map((c) => c.name)))
      .map((name) => filtered.find((c) => c.name === name));

    if (uniqueCountries.length > 0) {
      setFilteredCountries(uniqueCountries);
      setError("");
    } else {
      setFilteredCountries([]);
      setError("No countries found matching the selected region and search query.");
    }

    // Reset to page 1 on new search/filter
    setCurrentPage(1);
  }, [countries, query, region]);

  // Auto filter when any dependency changes
  useEffect(() => {
    if (countries.length > 0) {
      filterCountries();
    }
  }, [query, region, countries, filterCountries]);

  // Paginate countries
  const paginateCountries = (countriesToPaginate) => {
    const startIndex = (currentPage - 1) * countriesPerPage;
    const endIndex = startIndex + countriesPerPage;
    return countriesToPaginate.slice(startIndex, endIndex);
  };

  // Automatically navigate flags every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFlagIndex((prevIndex) => (prevIndex + 1) % countries.length);
    }, 3000); // 3 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, [countries.length]);

  // Handlers
  const handleQueryChange = (e) => setQuery(e.target.value);
  const handleRegionChange = (e) => setRegion(e.target.value);
  const handleSearchClick = () => filterCountries();
  const handlePageChange = (pageNum) => setCurrentPage(pageNum);

  // Get paginated countries
  const paginatedCountries = paginateCountries(filteredCountries);

  return (
    <div className="p-6 bg-black min-h-screen text-white"> {/* Updated background color and text color */}
      <Header />
  
      {/* Search & Filter Section */}
      <div className="flex justify-center items-center min-h-[20vh]">
        <div className="flex flex-col md:flex-row gap-4 mb-6 w-full md:w-2/3">
          <input
            type="text"
            placeholder="Search by country name"
            value={query}
            onChange={handleQueryChange}
            className="border p-3 rounded text-gray-700 w-full"
          />
          <select
            value={region}
            onChange={handleRegionChange}
            className="border p-3 rounded text-gray-700 w-full"
          >
            {regions.map((reg) => (
              <option key={reg} value={reg}>
                {reg}
              </option>
            ))}
          </select>
          <button
            onClick={handleSearchClick}
            className="bg-orange-500 text-white p-3 rounded w-full md:w-auto hover:bg-orange-600" // Updated button color
          >
            Search
          </button>
        </div>
      </div>
  
      {/* Flag Carousel */}
      {countries.length > 0 && (
        <div className="flex flex-col items-center mb-6">
          <div className="flex flex-col items-center">
            <img
              src={countries[currentFlagIndex].flag}
              alt={`Flag of ${countries[currentFlagIndex].name}`}
              className="w-40 h-24 object-contain mb-2"
            />
            <p className="text-lg font-semibold">{countries[currentFlagIndex].name}</p>
          </div>
        </div>
      )}
  
      {/* Error Message */}
      {error && (
        <div className="text-red-500 text-center mb-4">
          <p>{error}</p>
        </div>
      )}
  
      {/* Grouped Countries by Region */}
      <div>
        {Object.keys(groupedCountries).map((regionName) => {
          const countriesInRegion = groupedCountries[regionName];
          const filteredRegionCountries = countriesInRegion.filter(
            (c) => filteredCountries.includes(c)
          );
  
          if (filteredRegionCountries.length === 0) return null; // Skip empty regions
  
          return (
            <div key={regionName} className="my-6">
              <h2 className="text-xl font-bold">{regionName}</h2>
  
              {/* Countries Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {paginateCountries(filteredRegionCountries).map((c) => (
                  <Link
                    to={`/country/${c.name}`}
                    key={c.name}
                    className="border bg-white p-4 rounded-lg hover:shadow-lg transition duration-300 ease-in-out"
                  >
                    <div className="flex flex-col items-center">
                      <img
                        src={c.flag}
                        alt={`Flag of ${c.name}`}
                        className="w-16 h-10 object-contain mb-2"
                      />
                      <h4 className="text-lg font-semibold text-center text-black">
                        {c.name}
                      </h4>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </div>
  
      {/* Pagination Controls */}
      <div className="flex justify-center mt-6">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="bg-orange-500 text-white p-2 rounded-l-md hover:bg-orange-600 disabled:opacity-50"
        >
          Previous
        </button>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={paginatedCountries.length < countriesPerPage}
          className="bg-orange-500 text-white p-2 rounded-r-md hover:bg-orange-600 disabled:opacity-50"
        >
          Next
        </button>
      </div>
  
      <Footer />
    </div>
  );
};

export default Home;