import React, { useState } from "react";
import { Header, SearchBar } from "../components/index";

const Home = () => {
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (query) => {
    setSearchQuery(query);
    setIsSearching(query.length > 0);
  };

  return (
    <div className="w-screen h-screen bg-[#212121] flex flex-col items-center justify-center text-gray-200 relative transition-all duration-500">
      <div className="absolute top-0 left-0 w-full">
        <Header />
      </div>

      {!isSearching && (
        <h1 className="text-3xl md:text-4xl font-semibold mb-6 transition-all duration-500">
          Create Notes
        </h1>
      )}

      <div
        className={`w-full max-w-xl transition-transform duration-500 ease-in-out ${
          isSearching ? "absolute bottom-5" : "relative translate-y-0"
        }`}
      >
        <SearchBar
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          onSearch={() => handleSearch(searchQuery)}
        />
      </div>
    </div>
  );
};

export default Home;
