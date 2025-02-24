import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { NewChatIcon } from "./index"

const HistroyDropDown = ({ onClose, historyData }) => {
  const sidebarRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  return (
    <motion.div
      ref={sidebarRef}
      initial={{ x: "-100%", opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: "-100%", opacity: 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="fixed left-0 top-0 h-full w-72 bg-[#171717] text-white shadow-lg p-4 z-50 flex flex-col"
    >
      {/* Header with New Chat Button */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">History</h2>
        <button 
          className="text-white px-3 py-1 rounded-md"
          onClick={onClose}
        >
          <NewChatIcon />
        </button>
      </div>

      {/* History List */}
      <div className="flex-1 overflow-y-auto">
        {Object.entries(historyData).map(([category, items]) => (
          <div key={category} className="mb-3">
            <p className="text-gray-400 text-sm">{category}</p>
            {items.length > 0 ? (
              items.map((item, index) => (
                <p key={index} className="px-2 py-1 text-white cursor-pointer hover:bg-gray-800 rounded-md">
                  {item}
                </p>
              ))
            ) : (
              <p className="text-gray-500 text-sm italic px-2 py-1">No history</p>
            )}
          </div>
        ))}
      </div>

      {/* Close Button */}
      <button 
        className="mt-4 text-sm text-gray-400 hover:text-white self-center"
        onClick={onClose}
      >
        Close Sidebar
      </button>
    </motion.div>
  );
};

export default HistroyDropDown;
