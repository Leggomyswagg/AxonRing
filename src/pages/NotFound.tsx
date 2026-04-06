import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="text-center p-12">
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-rose-500 to-amber-500 flex items-center justify-center">
          <div className="w-10 h-10 rounded-full border-3 border-white" />
        </div>
        <h1 className="text-7xl font-bold text-white mb-4">404</h1>
        <p className="text-xl text-zinc-400 mb-8">This page doesn't exist</p>
        <Link to="/" className="px-8 py-4 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white font-semibold rounded-xl transition-all inline-block">
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
