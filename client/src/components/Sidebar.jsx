import React, { useState } from 'react';
import { Plus, List, Folder, Rss, RotateCw, Check, X, Star, Trash2 } from 'lucide-react';

const Sidebar = ({
    categories,
    feeds,
    selectedFeed,
    selectedCategory,
    showStarred,
    onSelectFeed,
    onSelectCategory,
    onSelectStarred,
    onSelectAll,
    onDeleteFeed,
    onRefresh,
    onAddFeed,
    onAddCategory
}) => {
    const [showAddFeed, setShowAddFeed] = useState(false);
    const [showAddCategory, setShowAddCategory] = useState(false);
    const [newFeedUrl, setNewFeedUrl] = useState('');
    const [newCatName, setNewCatName] = useState('');
    const [selectedCatId, setSelectedCatId] = useState(categories[0]?.id || 1);

    const handleAddFeed = async () => {
        if (!newFeedUrl) return;
        try {
            await onAddFeed(newFeedUrl, selectedCatId);
            setNewFeedUrl('');
            setShowAddFeed(false);
        } catch (e) {
            alert("Failed to add feed. Check URL.");
        }
    };

    const handleAddCategory = async () => {
        if (!newCatName) return;
        try {
            await onAddCategory(newCatName);
            setNewCatName('');
            setShowAddCategory(false);
        } catch (e) {
            alert("Failed to add category.");
        }
    };

    return (
        <div className="w-full bg-gray-900 text-gray-100 flex flex-col h-full overflow-hidden border-r border-gray-800">
            <div className="p-5 border-b border-gray-800 flex justify-between items-center bg-gray-900 sticky top-0 z-10">
                <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                        <Rss size={18} className="text-white" />
                    </div>
                    <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">FlashRSS</h1>
                </div>
                <button onClick={onRefresh} className="p-1 hover:bg-gray-800 rounded transition-colors text-gray-400" title="Refresh Feeds">
                    <RotateCw size={18} />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-6">
                <div className="space-y-1">
                    <div
                        onClick={onSelectAll}
                        className={`flex items-center space-x-3 p-2 rounded-lg cursor-pointer transition-colors ${!selectedCategory && !selectedFeed && !showStarred ? 'bg-blue-600 text-white' : 'hover:bg-gray-800 text-gray-400'}`}
                    >
                        <List size={20} />
                        <span className="font-medium">All Articles</span>
                    </div>

                    <div
                        onClick={onSelectStarred}
                        className={`flex items-center space-x-3 p-2 rounded-lg cursor-pointer transition-colors ${showStarred ? 'bg-amber-500 text-white' : 'hover:bg-gray-800 text-gray-400'}`}
                    >
                        <Star size={20} className={showStarred ? "fill-current" : ""} />
                        <span className="font-medium">Starred</span>
                    </div>
                </div>

                <div className="space-y-4">
                    <h2 className="px-2 text-xs font-bold text-gray-500 uppercase tracking-widest">Feeds</h2>
                    {categories.map(cat => (
                        <div key={cat.id} className="space-y-1">
                            <div
                                onClick={() => onSelectCategory(cat)}
                                className={`flex items-center space-x-2 p-2 rounded cursor-pointer transition-colors ${selectedCategory?.id === cat.id ? 'text-white' : 'text-gray-500 hover:text-white'}`}
                            >
                                <Folder size={16} />
                                <span className="text-sm font-semibold truncate flex-1 uppercase tracking-tighter">{cat.name}</span>
                            </div>
                            <div className="ml-4 space-y-0.5">
                                {feeds.filter(f => f.category_id === cat.id).map(feed => (
                                    <div
                                        key={feed.id}
                                        className={`group flex items-center space-x-2 p-2 rounded cursor-pointer transition-colors text-sm ${selectedFeed?.id === feed.id ? 'bg-gray-800 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
                                    >
                                        <div className="flex-1 flex items-center space-x-2 min-w-0" onClick={() => onSelectFeed(feed)}>
                                            <img src={`https://www.google.com/s2/favicons?domain=${new URL(feed.url).hostname}`} alt="" className="w-4 h-4 rounded-sm shrink-0" />
                                            <span className="truncate">{feed.title || feed.url}</span>
                                        </div>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onDeleteFeed(feed.id);
                                            }}
                                            className="relative z-10 p-1 px-2 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-md transition-all opacity-60 hover:opacity-100 group-hover:opacity-100"
                                            title="Delete Feed"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="pt-4 space-y-2">
                    {!showAddFeed ? (
                        <button
                            onClick={() => setShowAddFeed(true)}
                            className="w-full flex items-center justify-center space-x-2 p-2 rounded border border-gray-700 hover:bg-gray-800 text-gray-400 text-sm transition-colors"
                        >
                            <Plus size={16} />
                            <span>Add Feed</span>
                        </button>
                    ) : (
                        <div className="bg-gray-800 p-3 rounded space-y-2 animate-in fade-in zoom-in duration-200">
                            <input
                                type="url"
                                placeholder="Feed URL"
                                className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-sm text-white focus:outline-none focus:border-blue-500"
                                value={newFeedUrl}
                                onChange={(e) => setNewFeedUrl(e.target.value)}
                            />
                            <select
                                className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-sm text-white"
                                value={selectedCatId}
                                onChange={(e) => setSelectedCatId(e.target.value)}
                            >
                                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                            <div className="flex space-x-2">
                                <button onClick={handleAddFeed} className="flex-1 bg-blue-600 hover:bg-blue-500 py-1 rounded text-white text-sm">Add</button>
                                <button onClick={() => setShowAddFeed(false)} className="px-2 hover:bg-gray-700 rounded text-gray-400"><X size={14} /></button>
                            </div>
                        </div>
                    )}

                    {!showAddCategory ? (
                        <button
                            onClick={() => setShowAddCategory(true)}
                            className="w-full flex items-center justify-center space-x-2 p-2 rounded border border-gray-700 hover:bg-gray-800 text-gray-400 text-sm transition-colors"
                        >
                            <Folder size={16} />
                            <span>New Category</span>
                        </button>
                    ) : (
                        <div className="bg-gray-800 p-3 rounded space-y-2 animate-in fade-in zoom-in duration-200">
                            <input
                                type="text"
                                placeholder="Category Name"
                                className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-sm text-white focus:outline-none focus:border-blue-500"
                                value={newCatName}
                                onChange={(e) => setNewCatName(e.target.value)}
                            />
                            <div className="flex space-x-2">
                                <button onClick={handleAddCategory} className="flex-1 bg-green-600 hover:bg-green-500 py-1 rounded text-white text-sm">Create</button>
                                <button onClick={() => setShowAddCategory(false)} className="px-2 hover:bg-gray-700 rounded text-gray-400"><X size={14} /></button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="p-4 text-xs text-gray-600 border-t border-gray-800 text-center">
                v1.0.0 FlashRSS
            </div>
        </div>
    );
};

export default Sidebar;
