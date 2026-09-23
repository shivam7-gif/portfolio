import React, { useState, useRef, useEffect } from "react";

// Real icons from assets
import githubIcon from "../assets/icons/Github.png";
import searchGlassIcon from "../assets/icons/Google_Search_glass.png";
import lockSslIcon from "../assets/icons/Lock_ssl.png";
import portfolioIcon from "../assets/icons/Portfolio.png";
import youtubeIcon from "../assets/icons/youtube_logo.png";
import reactIcon from "../assets/react.svg";

export const CHROME_ICON = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><circle cx="24" cy="24" r="23" fill="%23ffffff"/><path fill="%23EA4335" d="M24 5c6.5 0 12.3 3.3 15.7 8.3L26.3 24H12.2C13.5 12.8 24 5 24 5z"/><path fill="%2334A853" d="M24 43c-6.8 0-12.7-3.6-16-9.1l13.4-10.7 7.1 12.3C26.9 42.4 25.5 43 24 43z"/><path fill="%23FBBC05" d="M43 24c0 7.5-4.2 13.9-10.4 17.2l-7.1-12.3 14.1-1.2C41.8 26.5 43 24 43 24z"/><circle cx="24" cy="24" r="9.5" fill="%23ffffff"/><circle cx="24" cy="24" r="7.5" fill="%231a73e8"/></svg>`;

interface ChromeTab {
  id: string;
  title: string;
  url: string;
  history: string[];
  historyIndex: number;
}

interface Bookmark {
  title: string;
  url: string;
  iconImg?: string;
  iconSvg?: React.ReactNode;
}

export interface YouTubeVideo {
  id: string;
  title: string;
  channel: string;
  views: string;
  timeAgo: string;
  duration: string;
  category: "Coding" | "Lo-Fi" | "Tech" | "Music" | "Retro";
  description: string;
}

export const youtubeVideos: YouTubeVideo[] = [
  {
    id: "jfKfPfyJRdk",
    title: "lofi hip hop radio - beats to relax/study to",
    channel: "Lofi Girl",
    views: "89M views",
    timeAgo: "Live now",
    duration: "LIVE",
    category: "Lo-Fi",
    description: "Peaceful lofi hip hop beats to study, code, and relax. Welcome to the official stream.",
  },
  {
    id: "5qap5aO4i9A",
    title: "synthwave radio - chill electronic beats to chill/game to",
    channel: "Lofi Girl",
    views: "18M views",
    timeAgo: "Live now",
    duration: "LIVE",
    category: "Lo-Fi",
    description: "Retro 80s synthwave & chillsynth radio for late night coding sessions.",
  },
  {
    id: "SqcY0GlETPk",
    title: "React in 100 Seconds",
    channel: "Fireship",
    views: "1.9M views",
    timeAgo: "2 years ago",
    duration: "2:24",
    category: "Coding",
    description: "What is React? Learn the fundamentals of React JS in just 100 seconds.",
  },
  {
    id: "DHjqpvDnNGE",
    title: "Windows XP in 2024: The Operating System That Refused to Die",
    channel: "Michael MJD",
    views: "1.2M views",
    timeAgo: "1 year ago",
    duration: "18:42",
    category: "Retro",
    description: "Exploring why Windows XP remains one of the most beloved and iconic operating systems of all time.",
  },
  {
    id: "PkZNo7MFNFg",
    title: "JavaScript Tutorial for Beginners: Learn JavaScript in 1 Hour",
    channel: "Programming with Mosh",
    views: "7.1M views",
    timeAgo: "4 years ago",
    duration: "48:16",
    category: "Coding",
    description: "Watch this JavaScript tutorial for beginners to learn JavaScript basics from scratch.",
  },
  {
    id: "fBNz5xF-Kx4",
    title: "Node.js in 100 Seconds",
    channel: "Fireship",
    views: "1.4M views",
    timeAgo: "3 years ago",
    duration: "2:27",
    category: "Coding",
    description: "Node.js is an open-source, cross-platform JavaScript runtime environment.",
  },
  {
    id: "dQw4w9WgXcQ",
    title: "Rick Astley - Never Gonna Give You Up (Official Music Video)",
    channel: "Rick Astley",
    views: "1.5B views",
    timeAgo: "14 years ago",
    duration: "3:32",
    category: "Music",
    description: "The official video for Never Gonna Give You Up by Rick Astley.",
  },
  {
    id: "7S_tz1z_5bA",
    title: "I Tried Coding on Windows XP in 2024",
    channel: "Tristan",
    views: "430K views",
    timeAgo: "8 months ago",
    duration: "14:15",
    category: "Retro",
    description: "Can you still write code, build apps, and browse the web on Windows XP today?",
  },
];

const defaultBookmarks: Bookmark[] = [
  { title: "Google", url: "https://www.google.com", iconImg: searchGlassIcon },
  { title: "YouTube", url: "https://www.youtube.com", iconImg: youtubeIcon },
  { title: "GitHub", url: "https://github.com/shivam7-gif", iconImg: githubIcon },
  {
    title: "Wikipedia",
    url: "https://en.m.wikipedia.org",
    iconSvg: (
      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.09 13.06L8.85 3H6.01L1.24 16.58h2.38l1.32-3.79h4.63l.79 3.79h2.37l-3.23-7.52 3.03-7.06h-2.38l-2.06 4.06zm-4.14 1.76l1.65-4.73 1.07 4.73H7.95zm14.81-11.82h-2.73l-3.71 10.3-3.69-10.3h-2.61l4.89 13.58h2.95l4.89-13.58z" />
      </svg>
    ),
  },
  { title: "Portfolio", url: "https://shivam-portfolio.local", iconImg: portfolioIcon },
  { title: "React Docs", url: "https://react.dev", iconImg: reactIcon },
];

export default function ChromeBrowser() {
  const [tabs, setTabs] = useState<ChromeTab[]>([
    {
      id: "tab-1",
      title: "Google",
      url: "https://www.google.com",
      history: ["https://www.google.com"],
      historyIndex: 0,
    },
  ]);
  const [activeTabId, setActiveTabId] = useState("tab-1");
  const [inputUrl, setInputUrl] = useState("https://www.google.com");
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(defaultBookmarks);
  const [isLoading, setIsLoading] = useState(false);

  // Search states
  const [homeSearchQuery, setHomeSearchQuery] = useState("");
  const [ytSearchQuery, setYtSearchQuery] = useState("");
  const [ytCategory, setYtCategory] = useState<string>("All");
  const [searchTab, setSearchTab] = useState<"All" | "Videos" | "Images" | "News">("All");

  // YouTube interaction states
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [likesCount, setLikesCount] = useState(42800);
  const [hasLiked, setHasLiked] = useState(false);
  const [userComment, setUserComment] = useState("");
  const [comments, setComments] = useState<string[]>([
    "Windows XP + Chrome + Lofi beats is the greatest aesthetic ever created!",
    "This portfolio is insane! Great work Shivam!",
    "Brings back so much nostalgia while being super smooth to use.",
  ]);

  const tabCounter = useRef(2);
  const activeTab = tabs.find((t) => t.id === activeTabId) || tabs[0];

  useEffect(() => {
    if (activeTab) {
      setInputUrl(activeTab.url);
    }
  }, [activeTab?.url, activeTab?.id]);

  const navigateTo = (target: string) => {
    if (!target.trim()) return;

    let destination = target.trim();

    if (destination.toLowerCase() === "youtube" || destination.toLowerCase() === "yt") {
      destination = "https://www.youtube.com";
    } else if (destination.toLowerCase() === "google") {
      destination = "https://www.google.com";
    } else if (destination.toLowerCase() === "github") {
      destination = "https://github.com/shivam7-gif";
    } else {
      const isUrl =
        destination.startsWith("http://") ||
        destination.startsWith("https://") ||
        (destination.includes(".") && !destination.includes(" "));

      if (!isUrl) {
        destination = `https://www.google.com/search?q=${encodeURIComponent(destination)}`;
      } else if (!destination.startsWith("http://") && !destination.startsWith("https://")) {
        destination = `https://${destination}`;
      }
    }

    // Determine tab title
    let title = "Web Page";
    if (destination.includes("youtube.com/watch")) {
      try {
        const u = new URL(destination);
        const vId = u.searchParams.get("v");
        const found = youtubeVideos.find((v) => v.id === vId);
        title = found ? `${found.title} - YouTube` : "YouTube Video";
      } catch {
        title = "YouTube Video";
      }
    } else if (destination.includes("youtube.com/results")) {
      try {
        const q = new URL(destination).searchParams.get("search_query") || "Search";
        title = `${q} - YouTube`;
      } catch {
        title = "YouTube Search";
      }
    } else if (destination.includes("youtube.com")) {
      title = "YouTube";
    } else if (destination.includes("google.com/search")) {
      try {
        const q = new URL(destination).searchParams.get("q") || "Search";
        title = `${q} - Google Search`;
      } catch {
        title = "Google Search";
      }
    } else if (destination.includes("google.com")) {
      title = "Google";
    } else if (destination.includes("wikipedia.org")) {
      title = "Wikipedia, the free encyclopedia";
    } else if (destination.includes("github.com")) {
      title = "GitHub - Shivam";
    } else if (destination.includes("shivam-portfolio.local")) {
      title = "Shivam Rawat - Portfolio";
    } else {
      try {
        title = new URL(destination).hostname;
      } catch {
        title = destination;
      }
    }

    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 300);

    setTabs((prev) =>
      prev.map((tab) => {
        if (tab.id === activeTabId) {
          const newHistory = tab.history.slice(0, tab.historyIndex + 1);
          newHistory.push(destination);
          return {
            ...tab,
            url: destination,
            title,
            history: newHistory,
            historyIndex: newHistory.length - 1,
          };
        }
        return tab;
      })
    );
  };

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigateTo(inputUrl);
  };

  const addTab = () => {
    const newId = `tab-${tabCounter.current++}`;
    const newTab: ChromeTab = {
      id: newId,
      title: "New Tab",
      url: "https://www.google.com",
      history: ["https://www.google.com"],
      historyIndex: 0,
    };
    setTabs((prev) => [...prev, newTab]);
    setActiveTabId(newId);
    setInputUrl("https://www.google.com");
  };

  const closeTab = (tabId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (tabs.length === 1) {
      setTabs([
        {
          id: `tab-${tabCounter.current++}`,
          title: "New Tab",
          url: "https://www.google.com",
          history: ["https://www.google.com"],
          historyIndex: 0,
        },
      ]);
      return;
    }

    const filtered = tabs.filter((t) => t.id !== tabId);
    setTabs(filtered);
    if (activeTabId === tabId) {
      const nextActive = filtered[filtered.length - 1];
      setActiveTabId(nextActive.id);
      setInputUrl(nextActive.url);
    }
  };

  const goBack = () => {
    if (!activeTab || activeTab.historyIndex <= 0) return;
    const newIndex = activeTab.historyIndex - 1;
    const prevUrl = activeTab.history[newIndex];
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 250);

    setTabs((prev) =>
      prev.map((t) => (t.id === activeTabId ? { ...t, url: prevUrl, historyIndex: newIndex } : t))
    );
  };

  const goForward = () => {
    if (!activeTab || activeTab.historyIndex >= activeTab.history.length - 1) return;
    const newIndex = activeTab.historyIndex + 1;
    const nextUrl = activeTab.history[newIndex];
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 250);

    setTabs((prev) =>
      prev.map((t) => (t.id === activeTabId ? { ...t, url: nextUrl, historyIndex: newIndex } : t))
    );
  };

  const reload = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 350);
  };

  const goHome = () => {
    navigateTo("https://www.google.com");
  };

  const toggleBookmark = () => {
    const isBm = bookmarks.some((b) => b.url === activeTab.url);
    if (isBm) {
      setBookmarks((prev) => prev.filter((b) => b.url !== activeTab.url));
    } else {
      setBookmarks((prev) => [
        ...prev,
        {
          title: activeTab.title,
          url: activeTab.url,
          iconImg: activeTab.url.includes("youtube.com")
            ? youtubeIcon
            : activeTab.url.includes("github.com")
            ? githubIcon
            : searchGlassIcon,
        },
      ]);
    }
  };

  // URL classifications
  const isGoogleHome =
    activeTab.url === "https://www.google.com" || activeTab.url === "https://google.com";
  const isGoogleSearch = activeTab.url.includes("google.com/search");
  const searchQuery = isGoogleSearch
    ? (() => {
        try {
          return new URL(activeTab.url).searchParams.get("q") || "";
        } catch {
          return "";
        }
      })()
    : "";

  const isYouTube = activeTab.url.includes("youtube.com");
  const isYouTubeWatch = isYouTube && activeTab.url.includes("/watch");
  const isYouTubeSearch = isYouTube && activeTab.url.includes("/results");

  const currentVideoId = isYouTubeWatch
    ? (() => {
        try {
          return new URL(activeTab.url).searchParams.get("v") || "jfKfPfyJRdk";
        } catch {
          return "jfKfPfyJRdk";
        }
      })()
    : null;

  const currentVideo = currentVideoId
    ? youtubeVideos.find((v) => v.id === currentVideoId) || {
        id: currentVideoId,
        title: "Selected YouTube Video",
        channel: "YouTube Creator",
        views: "1.2M views",
        timeAgo: "Recently uploaded",
        duration: "10:00",
        category: "Coding" as const,
        description: "Enjoy watching this video directly inside the Windows XP Google Chrome browser.",
      }
    : null;

  const ytSearchTerm = isYouTubeSearch
    ? (() => {
        try {
          return new URL(activeTab.url).searchParams.get("search_query") || "";
        } catch {
          return "";
        }
      })()
    : "";

  const displayedVideos = youtubeVideos.filter((video) => {
    if (isYouTubeSearch && ytSearchTerm) {
      const q = ytSearchTerm.toLowerCase();
      return (
        video.title.toLowerCase().includes(q) ||
        video.channel.toLowerCase().includes(q) ||
        video.category.toLowerCase().includes(q)
      );
    }
    if (ytCategory !== "All") {
      return video.category === ytCategory;
    }
    return true;
  });

  const isBookmarked = bookmarks.some((b) => b.url === activeTab?.url);

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userComment.trim()) return;
    setComments((prev) => [userComment.trim(), ...prev]);
    setUserComment("");
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#F1F3F4] text-[#202124] select-none font-sans overflow-hidden">
      {/* 1. Chrome Tab Strip */}
      <div className="h-10 bg-[#DEE1E6] flex items-end px-2 pt-1 gap-1 overflow-x-auto border-b border-[#CBCDD0]">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTabId;
          const isYt = tab.url.includes("youtube.com");
          return (
            <div
              key={tab.id}
              onClick={() => {
                setActiveTabId(tab.id);
                setInputUrl(tab.url);
              }}
              className={`group relative h-9 max-w-[210px] min-w-[130px] px-3 rounded-t-lg flex items-center justify-between text-xs font-medium cursor-pointer transition-colors ${
                isActive
                  ? "bg-white text-[#1A73E8] shadow-sm font-semibold"
                  : "bg-[#DEE1E6] hover:bg-[#E8EAED] text-[#5F6368]"
              }`}
            >
              <div className="flex items-center gap-2 truncate">
                {isYt ? (
                  <img src={youtubeIcon} alt="" className="w-4 h-3 object-contain shrink-0" />
                ) : (
                  <img src={CHROME_ICON} alt="" className="w-3.5 h-3.5 shrink-0" />
                )}
                <span className="truncate">{tab.title}</span>
              </div>
              <button
                onClick={(e) => closeTab(tab.id, e)}
                className="w-4 h-4 ml-1 rounded-full hover:bg-neutral-300 flex items-center justify-center text-neutral-500 hover:text-black opacity-70 group-hover:opacity-100"
              >
                <svg className="w-2 h-2" viewBox="0 0 10 10" stroke="currentColor" strokeWidth="1.5">
                  <path d="M1 1L9 9M9 1L1 9" />
                </svg>
              </button>
            </div>
          );
        })}

        {/* Add Tab Button */}
        <button
          onClick={addTab}
          className="w-7 h-7 mb-1 rounded-full hover:bg-[#CDD1D6] flex items-center justify-center text-neutral-600 font-bold text-base transition-colors cursor-pointer"
          title="New Tab"
        >
          <svg className="w-3 h-3" viewBox="0 0 12 12" fill="currentColor">
            <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {/* 2. Navigation & Omnibox Bar */}
      <div className="h-11 bg-white border-b border-[#E0E2E5] px-3 flex items-center gap-2">
        <div className="flex items-center gap-1">
          <button
            onClick={goBack}
            disabled={!activeTab || activeTab.historyIndex <= 0}
            className="w-7 h-7 rounded-full flex items-center justify-center text-neutral-700 hover:bg-neutral-100 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
            title="Back"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="currentColor">
              <path d="M11 2L5 8l6 6" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            onClick={goForward}
            disabled={!activeTab || activeTab.historyIndex >= activeTab.history.length - 1}
            className="w-7 h-7 rounded-full flex items-center justify-center text-neutral-700 hover:bg-neutral-100 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
            title="Forward"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="currentColor">
              <path d="M5 2l6 6-6 6" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            onClick={reload}
            className={`w-7 h-7 rounded-full flex items-center justify-center text-neutral-700 hover:bg-neutral-100 cursor-pointer ${
              isLoading ? "animate-spin" : ""
            }`}
            title="Reload"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M13.6 8A5.6 5.6 0 118 2.4c2.2 0 4.1 1.2 5 3M14 2v4h-4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            onClick={goHome}
            className="w-7 h-7 rounded-full flex items-center justify-center text-neutral-700 hover:bg-neutral-100 cursor-pointer"
            title="Home"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 2.5L2 7.5V14h4v-4h4v4h4V7.5L8 2.5z" />
            </svg>
          </button>
        </div>

        {/* Omnibox / Address Bar */}
        <form onSubmit={handleAddressSubmit} className="flex-1">
          <div className="h-8 bg-[#F1F3F4] hover:bg-[#E8EAED] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#1A73E8] rounded-full px-3 flex items-center gap-2 border border-transparent focus-within:border-transparent transition-all">
            {/* Real SSL Lock Icon */}
            <img src={lockSslIcon} alt="SSL" className="w-3.5 h-3.5 object-contain" />
            <input
              type="text"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              className="flex-1 bg-transparent text-xs text-[#202124] outline-none"
              placeholder="Search Google, YouTube, or type a URL"
            />
            <button
              type="button"
              onClick={toggleBookmark}
              className={`text-xs cursor-pointer flex items-center ${
                isBookmarked ? "text-amber-500" : "text-neutral-400 hover:text-neutral-600"
              }`}
              title="Bookmark this tab"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill={isBookmarked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.2">
                <path d="M8 1.5l2 4 4.5.7-3.2 3.2.8 4.6L8 11.8 3.9 14l.8-4.6L1.5 6.2l4.5-.7 2-4z" />
              </svg>
            </button>
          </div>
        </form>

        {/* User profile / Menu */}
        <div className="flex items-center gap-1.5 text-xs text-neutral-600">
          <div className="w-6 h-6 rounded-full bg-[#1A73E8] text-white flex items-center justify-center font-bold text-[10px]">
            S
          </div>
          <button
            onClick={() => alert("Google Chrome v126.0 (Windows XP Edition)")}
            className="w-7 h-7 rounded-full hover:bg-neutral-100 flex items-center justify-center cursor-pointer text-neutral-700"
          >
            <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
              <circle cx="8" cy="3" r="1.5" />
              <circle cx="8" cy="8" r="1.5" />
              <circle cx="8" cy="13" r="1.5" />
            </svg>
          </button>
        </div>
      </div>

      {/* 3. Bookmarks Bar with Real Icons */}
      <div className="h-7 bg-white border-b border-[#E8EAED] px-3 flex items-center gap-3 overflow-x-auto text-[11px] text-[#3C4043]">
        {bookmarks.map((bm, index) => (
          <button
            key={index}
            onClick={() => navigateTo(bm.url)}
            className="flex items-center gap-1.5 px-2 py-0.5 rounded hover:bg-[#F1F3F4] whitespace-nowrap transition-colors cursor-pointer"
          >
            {bm.iconImg ? (
              <img src={bm.iconImg} alt="" className="w-3.5 h-3.5 object-contain" />
            ) : bm.iconSvg ? (
              bm.iconSvg
            ) : (
              <img src={CHROME_ICON} alt="" className="w-3.5 h-3.5 object-contain" />
            )}
            <span>{bm.title}</span>
          </button>
        ))}
      </div>

      {/* 4. Web Engine / Page View Content */}
      <div className="flex-1 bg-white overflow-auto relative">
        {isLoading && (
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-[#1A73E8] animate-pulse z-20" />
        )}

        {/* ------------------------------------------------------------- */}
        {/* VIEW 1: YOUTUBE APPLICATION (Home, Search, & Playable Watch)  */}
        {/* ------------------------------------------------------------- */}
        {isYouTube && (
          <div className="min-h-full flex flex-col bg-[#0F0F0F] text-white select-auto font-sans">
            {/* YouTube Navbar */}
            <div className="h-14 border-b border-[#272727] px-4 flex items-center justify-between sticky top-0 bg-[#0F0F0F] z-10 select-none">
              {/* Real YouTube Logo from assets */}
              <div
                onClick={() => navigateTo("https://www.youtube.com")}
                className="flex items-center gap-2 cursor-pointer"
              >
                <img src={youtubeIcon} alt="YouTube" className="h-5 object-contain" />
                <span className="font-['Clash_Display',sans-serif] font-bold text-lg tracking-tighter">
                  YouTube
                </span>
                <span className="text-[10px] text-neutral-400 self-start ml-0.5">IN</span>
              </div>

              {/* YouTube Search Bar */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (ytSearchQuery.trim()) {
                    navigateTo(
                      `https://www.youtube.com/results?search_query=${encodeURIComponent(
                        ytSearchQuery
                      )}`
                    );
                  }
                }}
                className="flex items-center max-w-lg w-full mx-4"
              >
                <div className="flex-1 flex items-center bg-[#121212] border border-[#303030] focus-within:border-[#1C62D6] rounded-l-full px-4 h-9">
                  <input
                    type="text"
                    value={ytSearchQuery}
                    onChange={(e) => setYtSearchQuery(e.target.value)}
                    placeholder="Search YouTube videos..."
                    className="w-full bg-transparent text-sm text-white outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="h-9 px-5 bg-[#222222] hover:bg-[#272727] border border-l-0 border-[#303030] rounded-r-full text-neutral-300 flex items-center justify-center cursor-pointer"
                  title="Search"
                >
                  <img src={searchGlassIcon} alt="Search" className="w-3.5 h-3.5 object-contain brightness-90" />
                </button>
              </form>

              {/* Profile icon */}
              <div className="flex items-center gap-3 text-sm">
                <button className="text-neutral-300 hover:text-white cursor-pointer" title="Notifications">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
                  </svg>
                </button>
                <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center font-bold text-xs">
                  S
                </div>
              </div>
            </div>

            {/* WATCH PAGE (Playable Embedded Video + Sidebar) */}
            {isYouTubeWatch && currentVideo ? (
              <div className="p-4 md:p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto w-full">
                {/* Main Player & Details */}
                <div className="lg:col-span-2 space-y-4">
                  <div className="w-full aspect-video rounded-xl overflow-hidden bg-black shadow-2xl border border-neutral-800">
                    <iframe
                      src={`https://www.youtube-nocookie.com/embed/${currentVideo.id}?autoplay=1&rel=0`}
                      title={currentVideo.title}
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  </div>

                  <h1 className="text-xl font-bold leading-snug">{currentVideo.title}</h1>

                  {/* Channel & Action Buttons */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#272727]">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center font-bold text-sm">
                        {currentVideo.channel.slice(0, 1)}
                      </div>
                      <div>
                        <h3 className="font-bold text-sm">{currentVideo.channel}</h3>
                        <span className="text-xs text-neutral-400">1.8M subscribers</span>
                      </div>
                      <button
                        onClick={() => setIsSubscribed((p) => !p)}
                        className={`ml-3 px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                          isSubscribed
                            ? "bg-[#272727] text-white hover:bg-[#3f3f3f]"
                            : "bg-white text-black hover:bg-neutral-200"
                        }`}
                      >
                        {isSubscribed ? "Subscribed ✓" : "Subscribe"}
                      </button>
                    </div>

                    {/* Actions: Like, Share, Download (Clean SVG icons) */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setHasLiked((p) => !p);
                          setLikesCount((prev) => (hasLiked ? prev - 1 : prev + 1));
                        }}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold cursor-pointer ${
                          hasLiked ? "bg-[#3F3F3F] text-blue-400" : "bg-[#272727] hover:bg-[#3F3F3F]"
                        }`}
                      >
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z" />
                        </svg>
                        <span>{likesCount.toLocaleString()}</span>
                      </button>
                      <button
                        onClick={() => alert("Link copied to clipboard!")}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-[#272727] hover:bg-[#3F3F3F] rounded-full text-xs font-semibold cursor-pointer"
                      >
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z" />
                        </svg>
                        <span>Share</span>
                      </button>
                      <button
                        onClick={() => alert("Video downloaded to C:\\Downloads!")}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-[#272727] hover:bg-[#3F3F3F] rounded-full text-xs font-semibold cursor-pointer"
                      >
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" />
                        </svg>
                        <span>Download</span>
                      </button>
                    </div>
                  </div>

                  {/* Video Description Box */}
                  <div className="bg-[#272727] p-3 rounded-xl text-xs space-y-2">
                    <div className="font-semibold text-neutral-300 flex items-center gap-2">
                      <span>{currentVideo.views}</span>
                      <span>•</span>
                      <span>{currentVideo.timeAgo}</span>
                      <span>•</span>
                      <span className="text-[#3EA6FF]">#{currentVideo.category}</span>
                    </div>
                    <p className="text-neutral-200 leading-relaxed">{currentVideo.description}</p>
                  </div>

                  {/* Interactive Comments Section */}
                  <div className="pt-4 space-y-4">
                    <h3 className="font-bold text-base">{comments.length + 42} Comments</h3>

                    <form onSubmit={handlePostComment} className="flex gap-3 items-start">
                      <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center font-bold text-xs shrink-0">
                        S
                      </div>
                      <div className="flex-1 space-y-2">
                        <input
                          type="text"
                          value={userComment}
                          onChange={(e) => setUserComment(e.target.value)}
                          placeholder="Add a comment..."
                          className="w-full bg-transparent border-b border-[#303030] focus:border-white outline-none text-xs pb-1"
                        />
                        {userComment && (
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => setUserComment("")}
                              className="px-3 py-1 text-xs hover:bg-[#272727] rounded-full"
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              className="px-3 py-1 bg-[#3EA6FF] text-black text-xs font-bold rounded-full cursor-pointer"
                            >
                              Comment
                            </button>
                          </div>
                        )}
                      </div>
                    </form>

                    <div className="space-y-3 pt-2">
                      {comments.map((comm, idx) => (
                        <div key={idx} className="flex gap-3 text-xs">
                          <div className="w-7 h-7 rounded-full bg-neutral-700 flex items-center justify-center font-bold text-[10px] shrink-0">
                            U{idx + 1}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-neutral-300">
                                @developer_{idx + 1}
                              </span>
                              <span className="text-[10px] text-neutral-500">2 hours ago</span>
                            </div>
                            <p className="text-neutral-200 mt-0.5">{comm}</p>
                            <div className="flex items-center gap-3 mt-1 text-[11px] text-neutral-400">
                              <span className="cursor-pointer hover:text-white flex items-center gap-1">
                                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                                  <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z" />
                                </svg>
                                14
                              </span>
                              <span className="cursor-pointer hover:text-white">Reply</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Sidebar: Recommended Related Videos */}
                <div className="space-y-3">
                  <h4 className="font-bold text-sm text-neutral-300">Related Videos</h4>
                  <div className="space-y-2.5">
                    {youtubeVideos
                      .filter((v) => v.id !== currentVideo.id)
                      .map((video) => (
                        <div
                          key={video.id}
                          onClick={() => navigateTo(`https://www.youtube.com/watch?v=${video.id}`)}
                          className="flex gap-2.5 group cursor-pointer p-1 rounded-lg hover:bg-[#272727] transition-colors"
                        >
                          <div className="relative w-36 aspect-video bg-neutral-800 rounded-lg overflow-hidden shrink-0">
                            <img
                              src={`https://img.youtube.com/vi/${video.id}/mqdefault.jpg`}
                              alt={video.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                            <span className="absolute bottom-1 right-1 bg-black/80 px-1 py-0.5 rounded text-[10px] font-mono">
                              {video.duration}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h5 className="text-xs font-semibold leading-tight line-clamp-2 group-hover:text-[#3EA6FF]">
                              {video.title}
                            </h5>
                            <span className="text-[11px] text-neutral-400 block mt-1">
                              {video.channel}
                            </span>
                            <span className="text-[10px] text-neutral-500 block">
                              {video.views} • {video.timeAgo}
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            ) : (
              /* YOUTUBE HOME / SEARCH FEED */
              <div className="p-4 md:p-6 space-y-4 max-w-7xl mx-auto w-full">
                <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                  {["All", "Coding", "Lo-Fi", "Retro", "Music"].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setYtCategory(cat)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors ${
                        ytCategory === cat
                          ? "bg-white text-black"
                          : "bg-[#272727] text-neutral-300 hover:bg-[#3F3F3F]"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {isYouTubeSearch && (
                  <div className="text-sm font-semibold text-neutral-400 py-1">
                    Results for "{ytSearchTerm}"
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pt-2">
                  {displayedVideos.map((video) => (
                    <div
                      key={video.id}
                      onClick={() => navigateTo(`https://www.youtube.com/watch?v=${video.id}`)}
                      className="flex flex-col gap-2 group cursor-pointer"
                    >
                      <div className="relative aspect-video rounded-xl overflow-hidden bg-neutral-900 shadow-md">
                        <img
                          src={`https://img.youtube.com/vi/${video.id}/hqdefault.jpg`}
                          alt={video.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        />
                        <span className="absolute bottom-1.5 right-1.5 bg-black/80 px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold">
                          {video.duration}
                        </span>
                      </div>

                      <div className="flex gap-2.5 pt-1">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-red-600 to-amber-500 flex items-center justify-center font-bold text-xs shrink-0">
                          {video.channel.slice(0, 1)}
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold leading-snug line-clamp-2 group-hover:text-[#3EA6FF]">
                            {video.title}
                          </h4>
                          <span className="text-[11px] text-neutral-400 block mt-1">
                            {video.channel}
                          </span>
                          <span className="text-[10px] text-neutral-500 block">
                            {video.views} • {video.timeAgo}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* VIEW 2: GOOGLE HOME VIEW                                      */}
        {/* ------------------------------------------------------------- */}
        {isGoogleHome && (
          <div className="min-h-full flex flex-col items-center justify-center p-6 bg-white">
            <div className="text-6xl font-bold tracking-tight mb-7 flex items-center select-none">
              <span className="text-[#4285F4]">G</span>
              <span className="text-[#EA4335]">o</span>
              <span className="text-[#FBBC05]">o</span>
              <span className="text-[#4285F4]">g</span>
              <span className="text-[#34A853]">l</span>
              <span className="text-[#EA4335]">e</span>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (homeSearchQuery.trim()) navigateTo(homeSearchQuery);
              }}
              className="w-full max-w-xl mb-6"
            >
              <div className="h-12 bg-white rounded-full px-5 flex items-center gap-3 shadow-[0_1px_6px_rgba(32,33,36,0.28)] hover:shadow-[0_2px_8px_rgba(32,33,36,0.38)] transition-shadow">
                <img src={searchGlassIcon} alt="Search" className="w-4 h-4 object-contain" />
                <input
                  type="text"
                  value={homeSearchQuery}
                  onChange={(e) => setHomeSearchQuery(e.target.value)}
                  placeholder="Search Google, YouTube, or type a URL"
                  className="flex-1 text-sm outline-none"
                  autoFocus
                />
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#1A73E8] hover:bg-[#1557b0] text-white text-xs font-semibold rounded-full shadow-sm cursor-pointer"
                >
                  Search
                </button>
              </div>
            </form>

            {/* Quick Speed Dial Shortcuts (Real icons from assets!) */}
            <div className="grid grid-cols-4 gap-4 max-w-md w-full">
              {[
                { title: "YouTube", url: "https://www.youtube.com", icon: youtubeIcon },
                { title: "GitHub", url: "https://github.com/shivam7-gif", icon: githubIcon },
                { title: "Portfolio", url: "https://shivam-portfolio.local", icon: portfolioIcon },
                { title: "React", url: "https://react.dev", icon: reactIcon },
              ].map((shortcut, i) => (
                <button
                  key={i}
                  onClick={() => navigateTo(shortcut.url)}
                  className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-neutral-100 transition-colors cursor-pointer"
                >
                  <div className="w-12 h-12 rounded-full bg-[#F1F3F4] flex items-center justify-center p-2.5 shadow-inner">
                    <img src={shortcut.icon} alt={shortcut.title} className="w-full h-full object-contain" />
                  </div>
                  <span className="text-xs text-[#3C4043] font-medium">{shortcut.title}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* VIEW 3: ENHANCED GOOGLE SEARCH RESULTS                        */}
        {/* ------------------------------------------------------------- */}
        {isGoogleSearch && (
          <div className="p-6 max-w-4xl space-y-6">
            <div className="border-b border-neutral-200 pb-3 flex items-center justify-between">
              <span className="text-xs text-neutral-500">
                About 2,340,000 results (0.19 seconds) for <strong>{searchQuery}</strong>
              </span>
              <div className="flex gap-4 text-xs font-semibold">
                {(["All", "Videos", "Images", "News"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setSearchTab(tab)}
                    className={`pb-1 cursor-pointer transition-colors ${
                      searchTab === tab
                        ? "text-[#1A73E8] border-b-2 border-[#1A73E8]"
                        : "text-neutral-600 hover:text-neutral-900"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {searchTab === "Videos" ? (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-neutral-700 flex items-center gap-2">
                  <img src={youtubeIcon} alt="YouTube" className="h-4 object-contain" />
                  <span>Video results from YouTube</span>
                </h3>
                <div className="space-y-3">
                  {youtubeVideos.map((video) => (
                    <div
                      key={video.id}
                      onClick={() => navigateTo(`https://www.youtube.com/watch?v=${video.id}`)}
                      className="flex gap-4 p-3 rounded-xl border border-neutral-200 hover:border-[#1A73E8] hover:shadow-md transition-all cursor-pointer bg-white"
                    >
                      <div className="relative w-44 aspect-video rounded-lg overflow-hidden bg-black shrink-0">
                        <img
                          src={`https://img.youtube.com/vi/${video.id}/mqdefault.jpg`}
                          alt={video.title}
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute bottom-1 right-1 bg-black/80 px-1 py-0.5 rounded text-[10px] text-white font-mono">
                          {video.duration}
                        </span>
                      </div>
                      <div className="flex-1 space-y-1">
                        <h4 className="font-bold text-sm text-[#1A0DAB] hover:underline">
                          {video.title}
                        </h4>
                        <p className="text-xs text-neutral-600 line-clamp-2">{video.description}</p>
                        <div className="text-[11px] text-neutral-500 flex items-center gap-2 pt-1">
                          <span className="font-semibold text-neutral-700">{video.channel}</span>
                          <span>•</span>
                          <span>YouTube</span>
                          <span>•</span>
                          <span>{video.views}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : searchTab === "Images" ? (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {youtubeVideos.map((v) => (
                  <div
                    key={v.id}
                    onClick={() => navigateTo(`https://www.youtube.com/watch?v=${v.id}`)}
                    className="aspect-video rounded-lg overflow-hidden border border-neutral-200 hover:shadow-lg transition-shadow cursor-pointer bg-neutral-100"
                  >
                    <img
                      src={`https://img.youtube.com/vi/${v.id}/hqdefault.jpg`}
                      alt={v.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                {/* Embedded Video Carousel directly in Google Search */}
                <div className="p-3 bg-[#F8F9FA] rounded-xl border border-neutral-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-neutral-700 flex items-center gap-1.5">
                      <img src={youtubeIcon} alt="YouTube" className="h-3.5 object-contain" />
                      <span>Top Videos for {searchQuery}</span>
                    </span>
                    <button
                      onClick={() => setSearchTab("Videos")}
                      className="text-xs text-[#1A73E8] hover:underline font-semibold"
                    >
                      View all videos &rarr;
                    </button>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {youtubeVideos.slice(0, 3).map((v) => (
                      <div
                        key={v.id}
                        onClick={() => navigateTo(`https://www.youtube.com/watch?v=${v.id}`)}
                        className="group cursor-pointer bg-white p-2 rounded-lg border border-neutral-200 hover:border-[#1A73E8] transition-all"
                      >
                        <div className="relative aspect-video rounded overflow-hidden bg-black mb-1.5">
                          <img
                            src={`https://img.youtube.com/vi/${v.id}/mqdefault.jpg`}
                            alt={v.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                          <span className="absolute bottom-1 right-1 bg-black/80 px-1 text-[9px] text-white font-mono rounded">
                            {v.duration}
                          </span>
                        </div>
                        <h5 className="text-xs font-bold line-clamp-1 group-hover:text-[#1A0DAB]">
                          {v.title}
                        </h5>
                        <span className="text-[10px] text-neutral-500 block">{v.channel}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Organic Search Results */}
                <div className="space-y-5">
                  <div className="space-y-1">
                    <span className="text-xs text-neutral-500">https://shivam-portfolio.local</span>
                    <h3
                      onClick={() => navigateTo("https://shivam-portfolio.local")}
                      className="text-lg font-medium text-[#1A0DAB] hover:underline cursor-pointer"
                    >
                      Shivam Rawat | Full Stack Software Engineer & Creative Developer
                    </h3>
                    <p className="text-xs text-[#4D5156] leading-relaxed">
                      Portfolio and interactive web applications engineered with React, TypeScript, and
                      modern styling. Featuring the authentic Windows XP OS simulation with full YouTube
                      watching and Chrome search.
                    </p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-xs text-neutral-500">https://www.youtube.com</span>
                    <h3
                      onClick={() => navigateTo("https://www.youtube.com")}
                      className="text-lg font-medium text-[#1A0DAB] hover:underline cursor-pointer flex items-center gap-1.5"
                    >
                      <img src={youtubeIcon} alt="" className="h-3.5 object-contain" />
                      <span>YouTube - Watch, Stream, and Listen</span>
                    </h3>
                    <p className="text-xs text-[#4D5156] leading-relaxed">
                      Enjoy the videos and music you love, upload original content, and share it all with
                      friends, family, and the world on YouTube.
                    </p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-xs text-neutral-500">https://github.com/shivam7-gif</span>
                    <h3
                      onClick={() => navigateTo("https://github.com/shivam7-gif")}
                      className="text-lg font-medium text-[#1A0DAB] hover:underline cursor-pointer flex items-center gap-1.5"
                    >
                      <img src={githubIcon} alt="" className="w-4 h-4 object-contain" />
                      <span>shivam7-gif (Shivam) • GitHub</span>
                    </h3>
                    <p className="text-xs text-[#4D5156] leading-relaxed">
                      Open source repositories, frontend engineering experiments, and web architecture
                      projects built with Vite and React.
                    </p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-xs text-neutral-500">
                      https://en.m.wikipedia.org/wiki/Windows_XP
                    </span>
                    <h3
                      onClick={() => navigateTo("https://en.m.wikipedia.org/wiki/Windows_XP")}
                      className="text-lg font-medium text-[#1A0DAB] hover:underline cursor-pointer"
                    >
                      Windows XP - Wikipedia
                    </h3>
                    <p className="text-xs text-[#4D5156] leading-relaxed">
                      Windows XP is a major release of the Windows NT operating system developed by
                      Microsoft. Known for its iconic Bliss wallpaper, Luna visual style, and memorable
                      startup sounds.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* VIEW 4: EXTERNAL / IFRAME WEB VIEW (Wikipedia, etc.)          */}
        {/* ------------------------------------------------------------- */}
        {!isGoogleHome && !isGoogleSearch && !isYouTube && (
          <div className="w-full h-full flex flex-col">
            {activeTab.url.includes("wikipedia.org") ? (
              <iframe
                src={activeTab.url}
                title="Wikipedia Web View"
                className="w-full h-full border-none"
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
              />
            ) : activeTab.url.includes("shivam-portfolio.local") ? (
              <div className="p-8 max-w-2xl mx-auto space-y-4 text-center">
                <div className="w-16 h-16 mx-auto rounded-xl bg-neutral-100 flex items-center justify-center p-3 border border-neutral-200 shadow-sm">
                  <img src={portfolioIcon} alt="Portfolio" className="w-full h-full object-contain" />
                </div>
                <h2 className="text-2xl font-bold text-neutral-800">Shivam's Portfolio Web View</h2>
                <p className="text-sm text-neutral-600">
                  Welcome to Shivam's web portfolio! You are browsing from inside the simulated Windows XP
                  Google Chrome browser with real YouTube playback.
                </p>
                <div className="flex justify-center gap-3 pt-4">
                  <button
                    onClick={() => navigateTo("https://www.youtube.com")}
                    className="px-4 py-2 bg-red-600 text-white rounded-md text-xs font-semibold hover:bg-red-700 cursor-pointer flex items-center gap-1.5"
                  >
                    <img src={youtubeIcon} alt="" className="h-3.5 object-contain" />
                    <span>Open YouTube</span>
                  </button>
                  <button
                    onClick={() => navigateTo("https://www.google.com")}
                    className="px-4 py-2 bg-[#1A73E8] text-white rounded-md text-xs font-semibold hover:bg-[#1557b0] cursor-pointer"
                  >
                    Back to Google
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#E8F0FE] text-[#1A73E8] flex items-center justify-center p-4">
                  <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="2" y1="12" x2="22" y2="12" />
                    <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-neutral-800">{activeTab.title}</h3>
                  <p className="text-xs text-neutral-500 font-mono mt-1">{activeTab.url}</p>
                </div>
                <p className="text-xs text-neutral-600 max-w-md">
                  External website security policies (such as <code>X-Frame-Options: SAMEORIGIN</code>) may
                  prevent direct embedded iframe rendering inside simulated environments.
                </p>
                <div className="flex gap-2 pt-2">
                  <a
                    href={activeTab.url}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 rounded bg-[#1A73E8] text-white text-xs font-semibold hover:bg-[#1557b0] shadow-sm flex items-center gap-1.5"
                  >
                    <span>Open in Real Browser Tab</span>
                    <span>↗</span>
                  </a>
                  <button
                    onClick={() => navigateTo("https://www.google.com")}
                    className="px-4 py-2 rounded bg-neutral-200 text-neutral-800 text-xs font-semibold hover:bg-neutral-300 cursor-pointer"
                  >
                    Back to Google
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
