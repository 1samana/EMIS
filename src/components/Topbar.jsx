import React, { useContext, useState } from "react";
import { FaBell, FaUserCircle, FaSearch } from "react-icons/fa";
import { AuthContext } from "../context/AuthContext";

const Topbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const { logoutUser } = useContext(AuthContext);

  const handleMenuToggle = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div className="flex justify-between items-center bg-white shadow px-6 py-4 ">
      <div className="relative flex items-center">
        <FaSearch className="absolute left-3 text-gray-400" />
        <input
          type="text"
          placeholder="Search"
          className="border rounded-md px-10 py-2 pl-10 focus:outline-none"
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
    href="/edit-profile"
    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
  >
    Edit Profile
  </a>
</li>
<li>
  <a
    href="/view-profile"
    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
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
  );
};

export default Topbar;
