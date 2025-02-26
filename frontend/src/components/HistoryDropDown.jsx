import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { NewChatIcon } from "./index";
import HistoryComponent from "./HistoryComponent";

const HistoryDropDown = ({ onClose, historyData, onRename, onShare, onDelete }) => {
  const sidebarRef = useRef(null);

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
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">History</h2>
        <button
          className="text-white px-3 py-1 rounded-md"
          onClick={(e) => {
            e.stopPropagation(); // Prevent unexpected sidebar close
            onClose();
          }}
        >
          <NewChatIcon />
        </button>
      </div>

      {/* History List */}
      <div className="flex-1 overflow-y-auto">
        {Object.entries(historyData).map(([category, items]) => (
          <HistoryComponent
            key={category}
            title={category}
            items={items}
            onRename={onRename}
            onShare={onShare}
            onDelete={onDelete}
          />
        ))}
      </div>

      {/* Close Button */}
      <button
        className="mt-4 text-sm text-gray-400 hover:text-white self-center"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
      >
        Close Sidebar
      </button>
    </motion.div>
  );
};

export default HistoryDropDown;
