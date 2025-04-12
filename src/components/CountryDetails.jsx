import React from "react";

const CountryDetails = ({ country }) => {
  if (!country) return null;

  const {
    name,
    flag, // Now assuming flags is a direct URL string, like "https://flagcdn.com/af.svg"
    capital,
    region,
    subregion,
    population,
    area,
    languages,
    currencies,
    borders,
  } = country;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">{name?.common || name}</h1>
      <div className="flex flex-col md:flex-row gap-6">
        <img
          src={flag} // Default URL for flag if `flags` is unavailable
          alt={`Flag of ${name?.common || name}`}
          className="w-40 h-auto rounded shadow"
        />
        <div>
          <p><strong>Capital:</strong> {capital || "N/A"}</p>
          <p><strong>Region:</strong> {region || "N/A"}</p>
          <p><strong>Subregion:</strong> {subregion || "N/A"}</p>
          <p><strong>Population:</strong> {population?.toLocaleString() || "N/A"}</p>
          <p><strong>Area:</strong> {area ? `${area.toLocaleString()} km²` : "N/A"}</p>
          <p>
            <strong>Languages:</strong>{" "}
            {languages ? Object.values(languages).join(", ") : "N/A"}
          </p>
          <p>
            <strong>Currency:</strong>{" "}
            {currencies ? Object.values(currencies)[0]?.name : "N/A"}
          </p>
        </div>
      </div>

      {/* Borders Section */}
      <div className="mt-6">
        <h2 className="font-semibold text-xl">Border Countries:</h2>
        {borders && borders.length > 0 ? (
          <ul className="list-disc list-inside mt-2">
            {borders.map((border, idx) => (
              <li key={idx}>{border}</li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No bordering countries.</p>
        )}
      </div>
    </div>
  );
};

export default CountryDetails;
