import React, { useState, useEffect } from 'react';
import { ExternalLink, Check, Clock, Globe, Star } from 'lucide-react';
import { getArticles, markRead, toggleStar } from '../api';
import clsx from 'clsx';

const ArticleList = ({ feedId, categoryId, starred, isDarkMode }) => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);

    const loadArticles = async (reset = false) => {
        if (loading && !reset) return;
        setLoading(true);
        try {
            const offset = reset ? 0 : page * 50;
            const newArticles = await getArticles({
                feed_id: feedId,
                category_id: categoryId,
                starred: starred ? 'true' : undefined,
                offset,
                limit: 50
            });

            const list = Array.isArray(newArticles) ? newArticles : [];

            if (reset) {
                setArticles(list);
                setPage(1);
            } else {
                setArticles(prev => [...prev, ...list]);
                setPage(prev => prev + 1);
            }
            if (list.length < 50) setHasMore(false);
            else setHasMore(true);

        } catch (e) {
            console.error("Failed to load articles", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadArticles(true);
    }, [feedId, categoryId, starred]);

    const handleMarkRead = async (id) => {
        try {
            await markRead(id);
            setArticles(prev => prev.map(a => a.id === id ? { ...a, is_read: 1 } : a));
        } catch (e) { console.error(e); }
    };

    const handleToggleStar = async (id, currentStatus) => {
        try {
            const newStatus = !currentStatus;
            await toggleStar(id, newStatus);
            setArticles(prev => prev.map(a => a.id === id ? { ...a, is_starred: newStatus ? 1 : 0 } : a));
        } catch (e) { console.error(e); }
    };

    const timeAgo = (date) => {
        if (!date) return '';
        const seconds = Math.floor((new Date() - new Date(date)) / 1000);
        let interval = seconds / 31536000;
        if (interval > 1) return Math.floor(interval) + "y";
        interval = seconds / 2592000;
        if (interval > 1) return Math.floor(interval) + "mo";
        interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + "d";
        interval = seconds / 3600;
        if (interval > 1) return Math.floor(interval) + "h";
        interval = seconds / 60;
        if (interval > 1) return Math.floor(interval) + "m";
        return Math.floor(seconds) + "s";
    };

    return (
        <div className="space-y-4 pb-10">
            {articles.map((article, index) => (
                <article
                    key={`${article.id}-${index}`}
                    className={clsx(
                        "rounded-xl shadow-sm border transition-all p-5 group flex flex-col gap-3",
                        isDarkMode ? "bg-gray-900 border-gray-800 hover:border-gray-700" : "bg-white border-gray-200 hover:border-blue-200",
                        article.is_read ? "opacity-60" : "opacity-100"
                    )}
                >
                    <div className="flex justify-between items-start gap-4">
                        <div className="flex-1 min-w-0">
                            <h2 className={clsx(
                                "text-lg font-bold leading-tight mb-2 group-hover:text-blue-500 transition-colors",
                                isDarkMode ? (article.is_read ? "text-gray-400" : "text-gray-100") : (article.is_read ? "text-gray-500" : "text-gray-900")
                            )}>
                                <a href={article.link} target="_blank" rel="noopener noreferrer">
                                    {article.title}
                                </a>
                            </h2>
                            <div className="text-sm text-gray-500 flex items-center gap-3">
                                <span className={clsx(
                                    "font-bold text-[10px] px-2 py-0.5 rounded uppercase tracking-wider",
                                    isDarkMode ? "bg-gray-800 text-gray-400" : "bg-blue-50 text-blue-600"
                                )}>
                                    {article.feed_title || 'Feed'}
                                </span>
                                <span className="flex items-center gap-1 text-xs opacity-70">
                                    <Clock size={12} />
                                    {timeAgo(article.pubDate)}
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                                onClick={() => handleToggleStar(article.id, article.is_starred)}
                                className={clsx(
                                    "p-2 rounded-lg transition-colors",
                                    article.is_starred ? "text-amber-500 bg-amber-500/10" : "text-gray-400 hover:text-amber-500 hover:bg-amber-500/10"
                                )}
                                title={article.is_starred ? "Unstar" : "Star"}
                            >
                                <Star size={18} className={article.is_starred ? "fill-current" : ""} />
                            </button>

                            <a
                                href={article.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-500/10 rounded-lg transition-colors"
                            >
                                <ExternalLink size={18} />
                            </a>

                            {!article.is_read && (
                                <button
                                    onClick={() => handleMarkRead(article.id)}
                                    className="p-2 text-gray-400 hover:text-emerald-500 hover:bg-emerald-500/10 rounded-lg transition-colors"
                                >
                                    <Check size={18} />
                                </button>
                            )}
                        </div>
                    </div>

                    {article.contentSnippet && (
                        <p
                            className={clsx(
                                "text-sm line-clamp-2 leading-relaxed opacity-70",
                                isDarkMode ? "text-gray-400" : "text-gray-600"
                            )}
                            dangerouslySetInnerHTML={{ __html: article.contentSnippet.replace(/<[^>]+>/g, '') }}
                        />
                    )}
                </article>
            ))}

            {loading && (
                <div className="flex justify-center p-8">
                    <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            )}

            {!loading && hasMore && articles.length > 0 && (
                <div className="flex justify-center pt-4">
                    <button
                        onClick={() => loadArticles(false)}
                        className={clsx(
                            "px-6 py-2 rounded-full transition-all font-bold text-sm shadow-sm border",
                            isDarkMode ? "bg-gray-900 border-gray-800 text-gray-400 hover:border-gray-700" : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                        )}
                    >
                        Load More Articles
                    </button>
                </div>
            )}

            {!loading && articles.length === 0 && (
                <div className={clsx(
                    "flex flex-col items-center justify-center py-20 rounded-2xl border-2 border-dashed m-4",
                    isDarkMode ? "bg-gray-900/50 border-gray-800" : "bg-gray-50 border-gray-200"
                )}>
                    <Globe size={48} className="text-gray-300 mb-4 opacity-20" />
                    <h3 className={clsx("text-lg font-bold", isDarkMode ? "text-gray-500" : "text-gray-400")}>No articles found</h3>
                    <p className="text-gray-500 text-sm mt-1">Try refreshing or adding more feeds.</p>
                </div>
            )}
        </div>
    );
};

export default ArticleList;
