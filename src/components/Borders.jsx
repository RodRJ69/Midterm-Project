import { Link } from 'react-router-dom';

const Borders = ({ borderCodes }) => {
  return (
    <div className="mt-4">
      <h3 className="text-lg font-semibold">Borders:</h3>
      <div className="flex gap-2 flex-wrap">
        {borderCodes.length === 0
          ? "No bordering countries."
          : borderCodes.map(code => (
            <Link to={`/country/${code}`} key={code} className="px-2 py-1 bg-blue-100 rounded hover:bg-blue-200">
              {code}
            </Link>
          ))}
      </div>
    </div>
  );
};

export default Borders;
