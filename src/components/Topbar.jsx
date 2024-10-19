import React, { useContext, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { AuthContext } from "../context/AuthContext";
import ProfilePage from "../pagesTeacher/ProfilePage";

const Topbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const { logoutUser } = useContext(AuthContext);

  const handleMenuToggle = () => {
    setMenuOpen(!menuOpen);
  };

  const handleViewProfileToggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <div className="flex justify-between items-center bg-white shadow px-6 py-4 ">
        <div className="relative flex items-center">
          <FaSearch className="absolute left-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search"
            className="border rounded-md px-10 pl-10 py-2 focus:outline-none"
          />
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative">
            <button
              className="w-10 h-10 rounded-full focus:outline-none"
              onClick={handleMenuToggle}
            >
              <img
                src="https://randomuser.me/api/portraits/men/32.jpg"
                alt="User Avatar"
                className="w-full h-full rounded-full"
              />
            </button>
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md border border-gray-200">
                <ul className="py-1">
                  <li>
                    <a
                      onClick={handleViewProfileToggle}
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
                    >
                      View Profile
                    </a>
                  </li>
                  <li>
                    <a
                      onClick={logoutUser}
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
                    >
                      Logout
                    </a>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          {/* ProfilePage Content */}
          <div className="relative bg-white rounded-lg shadow-lg w-full max-w-3xl">
            {/* Close Button inside the popup */}
            <button
              onClick={handleViewProfileToggle}
              className="absolute top-2 right-4 text-gray-600 text-2xl hover:text-gray-900"
            >
              &times;
            </button>

            {/* ProfilePage Content */}
            <div className="p-4"> {/* Adjust padding here */}
              <ProfilePage closeModal={handleViewProfileToggle} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Topbar;
