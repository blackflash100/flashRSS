import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import ArticleList from './components/ArticleList';
import * as api from './api';
import { Menu, X } from 'lucide-react';
import clsx from 'clsx';

function App() {
  const [categories, setCategories] = useState([]);
  const [feeds, setFeeds] = useState([]);
  const [selectedFeed, setSelectedFeed] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');
  const [showStarred, setShowStarred] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [cats, fds] = await Promise.all([api.getCategories(), api.getFeeds()]);
      setCategories(cats);
      setFeeds(fds);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSelectFeed = (feed) => {
    setSelectedFeed(feed);
    setSelectedCategory(null);
    setShowStarred(false);
    if (window.innerWidth < 768) setIsSidebarOpen(false);
  };

  const handleSelectCategory = (cat) => {
    setSelectedCategory(cat);
    setSelectedFeed(null);
    setShowStarred(false);
    if (window.innerWidth < 768) setIsSidebarOpen(false);
  };

  const handleSelectStarred = () => {
    setShowStarred(true);
    setSelectedFeed(null);
    setSelectedCategory(null);
    if (window.innerWidth < 768) setIsSidebarOpen(false);
  };

  const handleSelectAll = () => {
    setShowStarred(false);
    setSelectedFeed(null);
    setSelectedCategory(null);
    if (window.innerWidth < 768) setIsSidebarOpen(false);
  };

  const handleDeleteFeed = async (id) => {
    if (!confirm("Are you sure you want to delete this feed? All articles will be removed.")) {
      return;
    }
    try {
      await api.deleteFeed(id);
      if (selectedFeed?.id === id) setSelectedFeed(null);
      loadData();
    } catch (e) {
      alert("Failed to delete feed.");
    }
  };

  return (
    <div className={clsx(
      "flex h-screen font-sans overflow-hidden transition-colors duration-300",
      isDarkMode ? "bg-gray-950 text-gray-100" : "bg-gray-50 text-gray-900"
    )}>
      {isSidebarOpen && window.innerWidth < 768 && (
        <div
          className="fixed inset-0 bg-black/50 z-20 backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <div
        className={clsx(
          "fixed inset-y-0 left-0 z-30 transform transition-transform duration-300 md:relative md:translate-x-0 w-72 bg-gray-900 border-r border-gray-800",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <Sidebar
          categories={categories}
          feeds={feeds}
          selectedFeed={selectedFeed}
          selectedCategory={selectedCategory}
          showStarred={showStarred}
          onSelectFeed={handleSelectFeed}
          onSelectCategory={handleSelectCategory}
          onSelectStarred={handleSelectStarred}
          onSelectAll={handleSelectAll}
          onDeleteFeed={handleDeleteFeed}
          onAddFeed={async (url, catId) => {
            await api.addFeed(url, catId);
            loadData();
          }}
          onAddCategory={async (name) => {
            await api.addCategory(name);
            loadData();
          }}
          onRefresh={async () => {
            await api.refreshFeeds();
            loadData();
          }}
          isDarkMode={isDarkMode}
          toggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        />
      </div>

      <div className="flex-1 flex flex-col h-full overflow-hidden w-full relative">
        <header className={clsx(
          "flex items-center justify-between p-4 border-b transition-colors",
          isDarkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"
        )}>
          <div className="flex items-center">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className={clsx(
                "p-2 -ml-2 rounded-lg md:hidden",
                isDarkMode ? "text-gray-400 hover:bg-gray-800" : "text-gray-600 hover:bg-gray-100"
              )}
            >
              <Menu size={24} />
            </button>
            <h1 className={clsx(
              "ml-4 font-bold text-lg truncate",
              isDarkMode ? "text-white" : "text-gray-800"
            )}>
              {showStarred ? "Starred Articles" : selectedFeed ? selectedFeed.title : selectedCategory ? selectedCategory.name : "All Articles"}
            </h1>
          </div>

          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={clsx(
              "p-2 rounded-full transition-colors flex items-center justify-center w-10 h-10",
              isDarkMode ? "bg-gray-800 text-yellow-400 hover:bg-gray-700" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            )}
          >
            {isDarkMode ? "🌙" : "☀️"}
          </button>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
          <div className="max-w-4xl mx-auto">
            <div className={clsx(
              "hidden md:flex justify-between items-end mb-8 border-b pb-4 transition-colors",
              isDarkMode ? "border-gray-800" : "border-gray-200"
            )}>
              <div>
                <h1 className={clsx(
                  "text-3xl font-bold tracking-tight",
                  isDarkMode ? "text-white" : "text-gray-900"
                )}>
                  {showStarred ? "Starred Articles" : selectedFeed ? selectedFeed.title : selectedCategory ? selectedCategory.name : "All Articles"}
                </h1>
                <p className="text-gray-500 mt-1 text-sm">
                  {selectedFeed ? selectedFeed.url : showStarred ? "Your favorite articles saved for later" : "Latest updates from your subscriptions"}
                </p>
              </div>
            </div>

            <ArticleList
              key={`${selectedFeed?.id}-${selectedCategory?.id}-${showStarred}`}
              feedId={selectedFeed?.id}
              categoryId={selectedCategory?.id}
              starred={showStarred}
              isDarkMode={isDarkMode}
            />
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
