import React, { useState, useEffect, useRef } from "react";

const Avatar = ({ name = "Unknown" }) => {
const [isOpen, setIsOpen] = useState(false);
const menuRef = useRef(null);

const getInitials = (name) => {
    const nameParts = name.trim().split(" ");
    if (nameParts.length === 1) return nameParts[0][0].toUpperCase();
    return (nameParts[0][0] + nameParts[1][0]).toUpperCase();
};

  // Background color selection
const colors = ["bg-blue-500", "bg-green-500", "bg-red-500", "bg-yellow-500", "bg-purple-500"];
const colorIndex = name.charCodeAt(0) % colors.length;
const bgColor = colors[colorIndex];

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("click", handleClickOutside);
    } else {
      document.removeEventListener("click", handleClickOutside);
    }

    return () => document.removeEventListener("click", handleClickOutside);
  }, [isOpen]);

  return (
    <div className="relative" ref={menuRef}>
      {/* Avatar Icon */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-10 h-10 flex items-center justify-center rounded-full text-white font-bold text-lg ${bgColor}`}
      >
        {getInitials(name)}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-[#303030] text-white shadow-lg rounded-lg py-2">
          <button className="block px-4 py-2 w-full text-left hover:bg-gray-700">Profile</button>
          <button className="block px-4 py-2 w-full text-left hover:bg-gray-700">Settings</button>
          <button className="block px-4 py-2 w-full text-left text-red-500 hover:bg-gray-700">
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default Avatar;
