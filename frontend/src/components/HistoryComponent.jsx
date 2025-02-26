import React, { useState, useRef, useEffect } from "react";
import { MoreVertical, Pencil, Share2, Trash2 } from "lucide-react";
import { motion } from "framer-motion";

const HistoryComponent = ({ title, items, onRename, onShare, onDelete }) => {
  const [menuOpen, setMenuOpen] = useState(null);
  const menuRefs = useRef({});

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuOpen !== null && menuRefs.current[menuOpen] && !menuRefs.current[menuOpen].contains(event.target)) {
        setMenuOpen(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  return (
    <div className="mb-4">
      <p className="text-gray-400 text-sm">{title}</p>
      {items.length > 0 ? (
        items.map((item, index) => (
          <div
            key={index}
            className="relative flex justify-between items-center px-2 py-1 text-white cursor-pointer hover:bg-gray-800 rounded-md group"
          >
            <span>{item}</span>

            {/* Three-dot menu button */}
            <button
              className="opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => {
                e.stopPropagation(); // Prevent event bubbling
                setMenuOpen(menuOpen === index ? null : index);
              }}
            >
              <MoreVertical size={16} />
            </button>

            {/* Dropdown Menu */}
            {menuOpen === index && (
              <motion.div
                ref={(el) => (menuRefs.current[index] = el)} // Store each menu ref separately
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="absolute right-0 top-6 bg-[#282828] shadow-lg rounded-md w-36 text-sm z-50"
              >
                <button
                  className="flex items-center gap-2 w-full text-left px-3 py-2 hover:bg-gray-700"
                  onClick={() => {
                    onRename(item);
                    setMenuOpen(null);
                  }}
                >
                  <Pencil size={16} /> Rename
                </button>
                <button
                  className="flex items-center gap-2 w-full text-left px-3 py-2 hover:bg-gray-700"
                  onClick={() => {
                    onShare(item);
                    setMenuOpen(null);
                  }}
                >
                  <Share2 size={16} /> Share
                </button>
                <button
                  className="flex items-center gap-2 w-full text-left px-3 py-2 text-red-400 hover:bg-gray-700"
                  onClick={() => {
                    onDelete(item);
                    setMenuOpen(null);
                  }}
                >
                  <Trash2 size={16} /> Delete
                </button>
              </motion.div>
            )}
          </div>
        ))
      ) : (
        <p className="text-gray-500 text-sm italic px-2 py-1">No history</p>
      )}
    </div>
  );
};

export default HistoryComponent;
