import React, { useState, useEffect, useRef } from "react";
import {
  Folder,
  File,
  Search,
  Upload,
  Download,
  Trash,
  LogOut,
  User,
  ChevronDown,
  Plus,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutUser, selectCurrentUser } from "../redux/authSlice";
import toast from "react-hot-toast";
import { createFolder, fetchFolders } from "../api/api";

// Main Home Component
const Home = () => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [folders, setFolders] = useState([]);
  const [files, setFiles] = useState([]);
  const [showAddFolderModal, setShowAddFolderModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [loading, setLoading] = useState(false);
  const mainContentRef = useRef(null);

  const navigate = useNavigate();
  
  useEffect(() => {
    loadFolders();
    
    // Add event listener to handle clicks outside folders
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const handleOutsideClick = (event) => {
    // Check if the click is outside any folder card and the main content area was clicked
    if (mainContentRef.current && mainContentRef.current.contains(event.target)) {
      const isClickOnFolder = event.target.closest(".folder-card");
      const isClickOnFile = event.target.closest(".file-card");
      
      if (!isClickOnFolder && !isClickOnFile && !event.target.closest(".modal-content")) {
        setSelectedItem(null);
      }
    }
  };

  const loadFolders = async () => {
    try {
      setLoading(true);
      const response = await fetchFolders();
      setFolders(response.data);
    } catch (error) {
      toast.error("Failed to load folders");
      console.error("Error loading folders:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddFolder = async () => {
    if (!newFolderName.trim()) {
      toast.error("Please enter a folder name");
      return;
    }

    try {
      setLoading(true);
      await createFolder(newFolderName);
      toast.success("Folder created successfully");
      setNewFolderName("");
      setShowAddFolderModal(false);
      loadFolders(); // Refresh the folders list
    } catch (error) {
      toast.error("Failed to create folder");
      console.error("Error creating folder:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleItemClick = (item) => {
    setSelectedItem(selectedItem?._id === item._id ? null : item);
  };

  const handleFolderDoubleClick = (folder) => {
    navigate(`/folder/${folder._id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-6" ref={mainContentRef}>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">My Cloud Storage</h1>
          <div className="flex space-x-3">
            <button
              onClick={() => setShowAddFolderModal(true)}
              className="px-4 py-2 rounded-md bg-green-500 text-white flex items-center hover:bg-green-600 transition"
            >
              <Plus size={16} className="mr-2" />
              <span>Add Folder</span>
            </button>
          </div>
        </div>

        {/* <SearchBar /> */}

        <div className="mt-8">
          <h2 className="text-lg font-medium text-gray-700 mb-4">Folders</h2>
          {loading ? (
            <div className="text-center py-10">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-t-blue-500 border-blue-200"></div>
              <p className="mt-2 text-gray-600">Loading folders...</p>
            </div>
          ) : folders.length === 0 ? (
            <div className="text-center py-10 bg-white rounded-lg shadow">
              <p className="text-gray-500">
                No folders available. Create your first folder!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {folders.map((folder) => (
                <FolderCard
                  key={folder._id}
                  folder={folder}
                  isSelected={selectedItem?._id === folder._id}
                  onClick={() => handleItemClick(folder)}
                  onDoubleClick={() => handleFolderDoubleClick(folder)}
                />
              ))}
            </div>
          )}
        </div>

        <div className="mt-8">
          <h2 className="text-lg font-medium text-gray-700 mb-4">
            Recent Files
          </h2>
          {files.length === 0 ? (
            <div className="text-center py-10 bg-white rounded-lg shadow">
              <p className="text-gray-500">No files available.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {files.map((file) => (
                <FileCard
                  key={file._id}
                  file={file}
                  isSelected={selectedItem?._id === file._id}
                  onClick={() => handleItemClick(file)}
                />
              ))}
            </div>
          )}
        </div>

        {selectedItem && <ItemActions item={selectedItem} />}
      </div>

      {/* Add Folder Modal */}
      {showAddFolderModal && (
        <AddFolderModal
          newFolderName={newFolderName}
          setNewFolderName={setNewFolderName}
          handleAddFolder={handleAddFolder}
          closeModal={() => setShowAddFolderModal(false)}
          loading={loading}
        />
      )}
    </div>
  );
};

// Add Folder Modal Component
const AddFolderModal = ({
  newFolderName,
  setNewFolderName,
  handleAddFolder,
  closeModal,
  loading,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md modal-content">
        <h3 className="text-xl font-medium text-gray-900 mb-4">
          Create New Folder
        </h3>
        <div className="mb-4">
          <label
            htmlFor="folderName"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Folder Name
          </label>
          <input
            type="text"
            id="folderName"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter folder name"
            disabled={loading}
          />
        </div>
        <div className="flex justify-end space-x-3">
          <button
            onClick={closeModal}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleAddFolder}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition flex items-center"
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Creating...
              </>
            ) : (
              <>Create</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// Navbar Component with User Menu and Logout
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

// Folder Card Component
const FolderCard = ({ folder, isSelected, onClick, onDoubleClick }) => {
  const createdAt = new Date(folder.createdAt).toLocaleDateString();

  return (
    <div
      className={`folder-card bg-white p-4 rounded-lg shadow cursor-pointer transition duration-200 ${
        isSelected ? "ring-2 ring-blue-500" : "hover:shadow-md"
      }`}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
    >
      <div className="flex items-center mb-3">
        <Folder className="h-10 w-10 text-blue-500" />
        <div className="ml-3">
          <h3 className="font-medium text-gray-900">{folder.name}</h3>
        </div>
      </div>
      <div className="text-xs text-gray-500">Created: {createdAt}</div>
    </div>
  );
};

// File Card Component
const FileCard = ({ file, isSelected, onClick }) => {
  const getFileIcon = (type) => {
    switch (type) {
      case "pdf":
        return <File className="h-10 w-10 text-red-500" />;
      case "pptx":
        return <File className="h-10 w-10 text-orange-500" />;
      case "xlsx":
        return <File className="h-10 w-10 text-green-500" />;
      case "jpg":
      case "png":
        return <File className="h-10 w-10 text-purple-500" />;
      default:
        return <File className="h-10 w-10 text-gray-500" />;
    }
  };

  const createdAt = new Date(file.createdAt).toLocaleDateString();

  return (
    <div
      className={`file-card bg-white p-4 rounded-lg shadow cursor-pointer transition duration-200 ${
        isSelected ? "ring-2 ring-blue-500" : "hover:shadow-md"
      }`}
      onClick={onClick}
    >
      <div className="flex items-center mb-3">
        {getFileIcon(file.type)}
        <div className="ml-3">
          <h3 className="font-medium text-gray-900">{file.name}</h3>
          <p className="text-sm text-gray-500">{file.size}</p>
        </div>
      </div>
      <div className="text-xs text-gray-500">Created: {createdAt}</div>
    </div>
  );
};

// Item Actions Component (appears when an item is selected)
const ItemActions = ({ item }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-md p-4 border-t border-gray-200">
      <div className="container mx-auto">
        <div className="flex justify-between items-center">
          <div className="font-medium text-gray-900">Selected: {item.name}</div>
          <div className="flex space-x-4">
            <button className="p-2 text-gray-600 hover:text-gray-800 flex items-center">
              <Download size={18} className="mr-1" />
              <span>Download</span>
            </button>
            <button className="p-2 text-red-600 hover:text-red-800 flex items-center">
              <Trash size={18} className="mr-1" />
              <span>Delete</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;