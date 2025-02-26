import React, { useState } from "react";
import {
  Avatar,
  NewChatIcon,
  OldNotesIcon,
  BarIcon,
  HistoryDropDown
} from "./index";

const Header = () => {
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  const historyData = {
    Today: ["Avatar Click Popup Feature"],
    Yesterday: ["Email to Reset Password", "Responsive Change Password"],
    "Previous 7 Days": [
      "Response Timing Request",
      "Search Bar Code React",
      "Replicate Page Functionality",
    ],
    Older: ["Using SVG in Projects", "Old UI Designs"],
  };

  return (
    <div className="p-2 flex justify-between items-center relative">
      <div className="flex items-center gap-2">
        <div className="sm:hidden">
          <button onClick={() => setIsHistoryOpen(!isHistoryOpen)}>
            <BarIcon />
          </button>
          {isHistoryOpen && (
            <HistoryDropDown
              onClose={() => setIsHistoryOpen(false)}
              historyData={historyData}
            />
          )}
        </div>
        <div className="hidden sm:flex gap-2 relative">
          <button onClick={() => setIsHistoryOpen(!isHistoryOpen)}>
            <OldNotesIcon />
          </button>
          {isHistoryOpen && (
            <HistoryDropDown
              onClose={() => setIsHistoryOpen(false)}
              historyData={historyData}
            />
          )}
          <NewChatIcon />
        </div>
      </div>
      <h2 className="text-[#9e9898] text-2xl font-medium absolute left-1/2 transform -translate-x-1/2 sm:static sm:translate-x-0">
        ClassGPT
      </h2>
      <div className="flex items-center">
        <Avatar />
      </div>
    </div>
  );
};

export default Header;
