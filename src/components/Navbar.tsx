import React from "react";
import { Link } from "react-router-dom";

const Navbar: React.FC = () => {
  return (
    <nav className="navbar flex justify-between items-center px-6 py-4 bg-[#181818] shadow-md">
      <Link to="/" className="flex items-center text-white font-bold text-xl">
        <span role="img" aria-label="film">🎬</span> FilmBox
      </Link>

      <div className="flex gap-3">
        <Link
          to="/"
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition"
        >
          Anasayfa
        </Link>
        <Link
          to="/search"
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition"
        >
          Film Arama
        </Link>
        <Link
          to="/favorites"
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition"
        >
          Favoriler
        </Link>
        <Link
          to="/notes"
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition"
        >
          Notlar
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
