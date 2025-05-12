import { useNavigate } from 'react-router-dom';

function Offers() {
  const navigate = useNavigate();

  return (
    <div className="max-w-lg mx-auto mt-16 bg-white p-8 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Send an Offer</h2>
      <p className="mb-4">This is a placeholder for the offers page. You can add your offer form or logic here.</p>
      <button
        onClick={() => navigate(-1)}
        className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
      >
        Back
      </button>
    </div>
  );
}

export default Offers; 