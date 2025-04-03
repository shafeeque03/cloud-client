import React, { useState } from 'react';
import { Folder, File, Grid, List, Search, Upload, MoreVertical, Download, Trash, Share } from 'lucide-react';

// Main Home Component
const Home = () => {
  const [view, setView] = useState('grid'); // 'grid' or 'list'
  const [selectedItem, setSelectedItem] = useState(null);
  
  const folders = [
    { id: 1, name: 'Documents', items: 15, lastModified: '2025-03-28' },
    { id: 2, name: 'Images', items: 42, lastModified: '2025-04-01' },
    { id: 3, name: 'Videos', items: 8, lastModified: '2025-03-15' },
    { id: 4, name: 'Projects', items: 23, lastModified: '2025-04-02' }
  ];
  
  const files = [
    { id: 1, name: 'Report.pdf', size: '2.4 MB', type: 'pdf', lastModified: '2025-04-01' },
    { id: 2, name: 'Presentation.pptx', size: '5.7 MB', type: 'pptx', lastModified: '2025-03-29' },
    { id: 3, name: 'Budget.xlsx', size: '1.2 MB', type: 'xlsx', lastModified: '2025-03-30' },
    { id: 4, name: 'Profile.jpg', size: '0.8 MB', type: 'jpg', lastModified: '2025-04-02' },
    { id: 5, name: 'Notes.txt', size: '0.1 MB', type: 'txt', lastModified: '2025-04-03' }
  ];

  const handleItemClick = (item) => {
    setSelectedItem(selectedItem === item ? null : item);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">My Cloud Storage</h1>
          <div className="flex space-x-4">
            <button 
              className={`p-2 rounded ${view === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-500'}`}
              onClick={() => setView('grid')}
            >
              <Grid size={20} />
            </button>
            <button 
              className={`p-2 rounded ${view === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-500'}`}
              onClick={() => setView('list')}
            >
              <List size={20} />
            </button>
          </div>
        </div>
        
        <SearchBar />
        
        <div className="mt-8">
          <h2 className="text-lg font-medium text-gray-700 mb-4">Folders</h2>
          {view === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {folders.map(folder => (
                <FolderCard 
                  key={folder.id} 
                  folder={folder} 
                  isSelected={selectedItem === folder}
                  onClick={() => handleItemClick(folder)}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {folders.map(folder => (
                    <tr 
                      key={folder.id}
                      className={`${selectedItem === folder ? 'bg-blue-50' : ''} hover:bg-gray-50`}
                      onClick={() => handleItemClick(folder)}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <Folder className="h-5 w-5 text-blue-500 mr-3" />
                          <span className="font-medium text-gray-900">{folder.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{folder.items} items</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{folder.lastModified}</td>
                      <td className="px-6 py-4 text-right text-sm font-medium">
                        <button className="text-gray-500 hover:text-gray-700">
                          <MoreVertical size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        
        <div className="mt-8">
          <h2 className="text-lg font-medium text-gray-700 mb-4">Recent Files</h2>
          {view === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {files.map(file => (
                <FileCard 
                  key={file.id} 
                  file={file} 
                  isSelected={selectedItem === file}
                  onClick={() => handleItemClick(file)}
                />
              ))}
            </div>
          ) : (
            <FileTable 
              files={files} 
              selectedItem={selectedItem}
              onItemClick={handleItemClick}
            />
          )}
        </div>
        
        {selectedItem && <ItemActions item={selectedItem} />}
      </div>
    </div>
  );
};

// Navbar Component
const Navbar = () => {
  return (
    <nav className="bg-white shadow">
      <div className="container mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <div className="h-8 w-8 bg-blue-500 rounded-md flex items-center justify-center">
                <span className="text-white font-bold">CS</span>
              </div>
              <span className="ml-2 text-lg font-medium text-gray-900">CloudStore</span>
            </div>
          </div>
          <div className="flex items-center">
            <button className="ml-4 px-4 py-2 rounded-md bg-blue-500 text-white flex items-center">
              <Upload size={16} className="mr-2" />
              <span>Upload</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

// Search Bar Component
const SearchBar = () => {
  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-gray-400" />
      </div>
      <input
        type="text"
        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        placeholder="Search files and folders..."
      />
    </div>
  );
};

// Folder Card Component
const FolderCard = ({ folder, isSelected, onClick }) => {
  return (
    <div 
      className={`bg-white p-4 rounded-lg shadow cursor-pointer transition duration-200 ${isSelected ? 'ring-2 ring-blue-500' : 'hover:shadow-md'}`}
      onClick={onClick}
    >
      <div className="flex items-center mb-3">
        <Folder className="h-10 w-10 text-blue-500" />
        <div className="ml-3">
          <h3 className="font-medium text-gray-900">{folder.name}</h3>
          <p className="text-sm text-gray-500">{folder.items} items</p>
        </div>
      </div>
      <div className="text-xs text-gray-500">Date: {folder.lastModified}</div>
    </div>
  );
};

// File Card Component
const FileCard = ({ file, isSelected, onClick }) => {
  const getFileIcon = (type) => {
    switch (type) {
      case 'pdf':
        return <File className="h-10 w-10 text-red-500" />;
      case 'pptx':
        return <File className="h-10 w-10 text-orange-500" />;
      case 'xlsx':
        return <File className="h-10 w-10 text-green-500" />;
      case 'jpg':
      case 'png':
        return <File className="h-10 w-10 text-purple-500" />;
      default:
        return <File className="h-10 w-10 text-gray-500" />;
    }
  };

  return (
    <div 
      className={`bg-white p-4 rounded-lg shadow cursor-pointer transition duration-200 ${isSelected ? 'ring-2 ring-blue-500' : 'hover:shadow-md'}`}
      onClick={onClick}
    >
      <div className="flex items-center mb-3">
        {getFileIcon(file.type)}
        <div className="ml-3">
          <h3 className="font-medium text-gray-900">{file.name}</h3>
          <p className="text-sm text-gray-500">{file.size}</p>
        </div>
      </div>
      <div className="text-xs text-gray-500">Date: {file.lastModified}</div>
    </div>
  );
};

// File Table Component
const FileTable = ({ files, selectedItem, onItemClick }) => {
  const getFileIcon = (type) => {
    switch (type) {
      case 'pdf':
        return <File className="h-5 w-5 text-red-500" />;
      case 'pptx':
        return <File className="h-5 w-5 text-orange-500" />;
      case 'xlsx':
        return <File className="h-5 w-5 text-green-500" />;
      case 'jpg':
      case 'png':
        return <File className="h-5 w-5 text-purple-500" />;
      default:
        return <File className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-auto">
      <table className="min-w-full">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {files.map(file => (
            <tr 
              key={file.id}
              className={`${selectedItem === file ? 'bg-blue-50' : ''} hover:bg-gray-50`}
              onClick={() => onItemClick(file)}
            >
              <td className="px-6 py-4">
                <div className="flex items-center">
                  {getFileIcon(file.type)}
                  <span className="ml-3 font-medium text-gray-900">{file.name}</span>
                </div>
              </td>
              <td className="px-6 py-4 text-sm text-gray-500">{file.size}</td>
              <td className="px-6 py-4 text-sm text-gray-500">{file.lastModified}</td>
              <td className="px-6 py-4 text-right text-sm font-medium">
                <button className="text-gray-500 hover:text-gray-700">
                  <MoreVertical size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Item Actions Component (appears when an item is selected)
const ItemActions = ({ item }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-md p-4 border-t border-gray-200">
      <div className="container mx-auto">
        <div className="flex justify-between items-center">
          <div className="font-medium text-gray-900">
            Selected: {item.name}
          </div>
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