import React, { useState } from "react";
import { Upload, LogOut, User, ChevronDown } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { logoutUser, selectCurrentUser } from "../../redux/authSlice";

const Navbar = () => {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const user = useSelector(selectCurrentUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (error) {
      toast.error("Logout failed");
      console.error("Logout error:", error);
    }
  };

  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen);
  };

  return (
    <nav className="bg-white shadow">
      <div className="container mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <div className="h-8 w-8 bg-blue-500 rounded-md flex items-center justify-center">
                <span className="text-white font-bold">CS</span>
              </div>
              <span className="ml-2 text-lg font-medium text-gray-900">
                CloudStore
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button className="px-4 py-2 rounded-md bg-blue-500 text-white flex items-center hover:bg-blue-600 transition">
              <Upload size={16} className="mr-2" />
              <span>Upload</span>
            </button>

            {/* User Profile Menu */}
            <div className="relative ml-3">
              <div>
                <button
                  onClick={toggleUserMenu}
                  className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 px-3 py-2 bg-gray-100 hover:bg-gray-200"
                >
                  <User size={18} className="text-gray-600 mr-2" />
                  <span className="text-gray-700">{user?.name || "User"}</span>
                  <ChevronDown size={16} className="ml-1 text-gray-600" />
                </button>
              </div>

              {/* Dropdown Menu */}
              {userMenuOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                  <div className="py-1">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                    >
                      <LogOut size={16} className="mr-2 text-gray-500" />
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;