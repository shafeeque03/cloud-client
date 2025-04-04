import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Folder as FolderIcon,
  File,
  Download,
  Trash,
  Plus,
  ArrowLeft,
  Edit
} from "lucide-react";
import toast from "react-hot-toast";
import { fetchChildFolders, createFolder, renameFolder } from "../api/api";
import Navbar from "../components/user/Navbar";

const Folder = () => {
  const { folderId } = useParams();
  const navigate = useNavigate();
  
  const [folders, setFolders] = useState([]);
  const [files, setFiles] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showAddFolderModal, setShowAddFolderModal] = useState(false);
  const [showRenameFolderModal, setShowRenameFolderModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [folderToRename, setFolderToRename] = useState(null);
  const [loading, setLoading] = useState(false);
  const mainContentRef = useRef(null);

  useEffect(() => {
    loadFolders();
    
    // Add event listener to handle clicks outside folders
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [folderId]);

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
      const response = await fetchChildFolders(folderId);
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
      await createFolder(newFolderName, folderId);
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

  const handleRenameFolder = async () => {
    if (!newFolderName.trim()) {
      toast.error("Please enter a folder name");
      return;
    }

    try {
      setLoading(true);
      await renameFolder(folderToRename._id, newFolderName);
      toast.success("Folder renamed successfully");
      setNewFolderName("");
      setShowRenameFolderModal(false);
      setFolderToRename(null);
      loadFolders(); // Refresh the folders list
    } catch (error) {
      toast.error("Failed to rename folder");
      console.error("Error renaming folder:", error);
    } finally {
      setLoading(false);
    }
  };

  const openRenameModal = (folder) => {
    setFolderToRename(folder);
    setNewFolderName(folder.name);
    setShowRenameFolderModal(true);
  };

  const handleItemClick = (item) => {
    setSelectedItem(selectedItem?._id === item._id ? null : item);
  };

  const handleFolderDoubleClick = (folder) => {
    navigate(`/folder/${folder._id}`);
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-6" ref={mainContentRef}>
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <button 
              onClick={handleGoBack} 
              className="p-2 mr-2 rounded-full hover:bg-gray-200 transition"
            >
              <ArrowLeft size={20} className="text-gray-700" />
            </button>
            <h1 className="text-2xl font-bold text-gray-800">Folder Contents</h1>
          </div>
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
            Files
          </h2>
          {files.length === 0 ? (
            <div className="text-center py-10 bg-white rounded-lg shadow">
              <p className="text-gray-500">No files available in this folder.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {files.map((file) => (
                <FileCard
                  key={file?._id}
                  file={file}
                  isSelected={selectedItem?._id === file?._id}
                  onClick={() => handleItemClick(file)}
                />
              ))}
            </div>
          )}
        </div>

        {selectedItem && (
  <ItemActions 
    item={selectedItem} 
    onRename={folders.some(folder => folder._id === selectedItem._id) ? () => openRenameModal(selectedItem) : null}
  />
)}
      </div>

      {/* Add Folder Modal */}
      {showAddFolderModal && (
        <AddFolderModal
          newFolderName={newFolderName}
          setNewFolderName={setNewFolderName}
          handleAddFolder={handleAddFolder}
          closeModal={() => setShowAddFolderModal(false)}
          loading={loading}
          title="Create New Folder"
          confirmText="Create"
        />
      )}

      {/* Rename Folder Modal */}
      {showRenameFolderModal && (
        <AddFolderModal
          newFolderName={newFolderName}
          setNewFolderName={setNewFolderName}
          handleAddFolder={handleRenameFolder}
          closeModal={() => setShowRenameFolderModal(false)}
          loading={loading}
          title="Rename Folder"
          confirmText="Rename"
        />
      )}
    </div>
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
        <FolderIcon className="h-10 w-10 text-blue-500" />
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
const ItemActions = ({ item, onRename }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-md p-4 border-t border-gray-200">
      <div className="container mx-auto">
        <div className="flex justify-between items-center">
          <div className="font-medium text-gray-900">Selected: {item.name}</div>
          <div className="flex space-x-4">
            {onRename && (
              <button 
                onClick={onRename} 
                className="p-2 text-blue-600 hover:text-blue-800 flex items-center"
              >
                <Edit size={18} className="mr-1" />
                <span>Rename</span>
              </button>
            )}
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

// Add/Rename Folder Modal Component
const AddFolderModal = ({
  newFolderName,
  setNewFolderName,
  handleAddFolder,
  closeModal,
  loading,
  title,
  confirmText
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md modal-content">
        <h3 className="text-xl font-medium text-gray-900 mb-4">
          {title}
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
                Processing...
              </>
            ) : (
              <>{confirmText}</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Folder;