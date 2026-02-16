import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ExternalLink, Check, Clock, Globe } from 'lucide-react';
import { getArticles, markRead } from '../api';
import clsx from 'clsx';
import { formatDistanceToNow } from 'date-fns'; // Actually I didn't install date-fns. I'll use native Intl.RelativeTimeFormat or simple logic.

const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    return Math.floor(seconds) + " seconds ago";
};

const ArticleList = ({ feedId, categoryId }) => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);

    const loadArticles = async (reset = false) => {
        setLoading(true);
        try {
            const offset = reset ? 0 : page * 50;
            const newArticles = await getArticles({
                feed_id: feedId,
                category_id: categoryId,
                offset,
                limit: 50
            });

            if (reset) {
                setArticles(newArticles);
                setPage(1);
            } else {
                setArticles(prev => [...prev, ...newArticles]);
                setPage(prev => prev + 1);
            }
            if (newArticles.length < 50) setHasMore(false);
            else setHasMore(true);

        } catch (e) {
            console.error("Failed to load articles", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadArticles(true);
    }, [feedId, categoryId]);

    const handleMarkRead = async (id) => {
        try {
            await markRead(id);
            setArticles(prev => prev.map(a => a.id === id ? { ...a, is_read: 1 } : a));
        } catch (e) { console.error(e); }
    };

    return (
        <div className="space-y-6 max-w-4xl mx-auto pb-10">
            {articles.map(article => (
                <article
                    key={article.id}
                    className={clsx(
                        "bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow p-6 group",
                        article.is_read ? "opacity-60 bg-gray-50" : "opacity-100"
                    )}
                >
                    <div className="flex justify-between items-start mb-2">
                        <div className="text-sm text-gray-500 flex items-center gap-2">
                            <span className="font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full text-xs">
                                {article.feed_title || 'Unknown Feed'}
                            </span>
                            <span className="flex items-center gap-1">
                                <Clock size={12} />
                                {timeAgo(article.pubDate)}
                            </span>
                        </div>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            {!article.is_read && (
                                <button
                                    onClick={() => handleMarkRead(article.id)}
                                    className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-full transition-colors"
                                    title="Mark as Read"
                                >
                                    <Check size={18} />
                                </button>
                            )}
                            <a
                                href={article.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                                title="Open Original"
                            >
                                <ExternalLink size={18} />
                            </a>
                        </div>
                    </div>

                    <h2 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors">
                        <a href={article.link} target="_blank" rel="noopener noreferrer">
                            {article.title}
                        </a>
                    </h2>

                    <div
                        className="text-gray-600 leading-relaxed line-clamp-3 mb-4 prose prose-sm max-w-none"
                        dangerouslySetInnerHTML={{ __html: article.contentSnippet || article.content }}
                    />

                    {/* Footer / Read More */}

                </article>
            ))}

            {loading && (
                <div className="flex justify-center p-8">
                    <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            )}

            {!loading && hasMore && (
                <div className="text-center pt-4">
                    <button
                        onClick={() => loadArticles(false)}
                        className="px-6 py-2 bg-white border border-gray-200 text-gray-600 rounded-full hover:bg-gray-50 hover:border-gray-300 transition-all font-medium text-sm shadow-sm"
                    >
                        Load More Articles
                    </button>
                </div>
            )}

            {!loading && articles.length === 0 && (
                <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
                    <div className="text-gray-400 mb-2">
                        <Globe size={48} className="mx-auto opacity-20" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">No articles found</h3>
                    <p className="text-gray-500">Try adding some feeds or selecting a different category.</p>
                </div>
            )}
        </div>
    );
};

export default ArticleList;
