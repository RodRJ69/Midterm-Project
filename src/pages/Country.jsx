import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import CountryDetails from "../components/CountryDetails";
import Header from "../components/Header";
import Footer from "../components/Footer";

const Country = () => {
  const { name } = useParams(); // Get the country name from URL
  const navigate = useNavigate(); // Hook for navigation
  const [country, setCountry] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get(`https://countries-api-abhishek.vercel.app/countries/${encodeURIComponent(name)}`)
      .then((response) => {
        setCountry(response.data?.data || null);
        setError("");
      })
      .catch((err) => {
        console.error("Error fetching country:", err);
        setError("Failed to load country data.");
      });
  }, [name]);

  const handleGoHome = () => {
    navigate("/"); // Redirect to the homepage
  };

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50 p-4 text-red-600 font-semibold">
        {error}
      </div>
    );
  if (!country)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 text-gray-500 font-medium">
        Loading country details...
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header />
      <div className="flex-grow py-8 px-6">
        <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">{country.name}</h1>
          <CountryDetails country={country} />
          {/* Redirect button */}
          <div className="mt-6 text-center">
            <button
              onClick={handleGoHome}
              className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
            >
              Go to Home
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Country;
