'use client';

import Header from "@/components/Header";
import { Play, Eye, Clock, MoreVertical, Share2, Download, Trash2, ExternalLink } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

const VideoCard = ({ video, onDelete, onShare }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const router = useRouter();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this video?')) return;
    
    try {
      const response = await fetch(`/api/videos/${video.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        onDelete(video.id);
        setShowDropdown(false);
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Failed to delete video');
      }
    } catch (error) {
      console.error('Error deleting video:', error);
      alert('Error deleting video');
    }
  };

  const handleShare = async () => {
    const videoUrl = `${window.location.origin}/video/${video.id}`;
    
    try {
      await navigator.clipboard.writeText(videoUrl);
      alert('Video link copied to clipboard!');
    } catch (error) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = videoUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('Video link copied to clipboard!');
    }
    
    setShowDropdown(false);
  };

  const handleDownload = async () => {
    if (video.videoUrl) {
      try {
        // For direct download without opening new page
        const response = await fetch(video.videoUrl);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `${video.title}.mp4`;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Clean up the blob URL
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error('Download failed:', error);
        // Fallback to opening in new tab if direct download fails
        window.open(video.videoUrl, '_blank');
      }
    }
    setShowDropdown(false);
  };

  const handlePlayVideo = () => {
    router.push(`/video/${video.id}`);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date';
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return `${Math.ceil(diffDays / 30)} months ago`;
  };

  const formatDuration = (seconds) => {
    if (!seconds) return 'N/A';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Use backend data structure
  const displayVideo = {
    id: video.id,
    title: video.title,
    duration: video.duration,
    views: video.views || 0,
    thumbnail: video.thumbnailUrl || "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400",
    author: {
      name: video.user?.name || 'Unknown User',
      avatar: video.user?.image || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
    },
    date: video.createdAt,
    videoUrl: video.videoUrl,
    visibility: video.visibility
  };

  return (
    <div className="group relative bg-slate-800/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-slate-700/50 hover:border-pink-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-pink-500/10 min-h-[420px]">
      
      {/* Video Thumbnail */}
      <div className="relative aspect-video overflow-hidden">
        <img 
          src={displayVideo.thumbnail} 
          alt={displayVideo.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        {/* Play button */}
        <button
          onClick={handlePlayVideo}
          className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 bg-black/20 backdrop-blur-sm"
        >
          <div className="w-20 h-20 bg-pink-500/90 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white/30 hover:scale-110 hover:bg-pink-500 transition-all duration-300 shadow-lg">
            <Play className="w-8 h-8 text-white ml-1" fill="white" />
          </div>
        </button>
        
        {/* Duration */}
        <div className="absolute bottom-3 right-3 bg-black/80 backdrop-blur-sm px-3 py-1.5 rounded-lg text-sm font-medium text-white border border-white/10">
          {typeof displayVideo.duration === 'string' ? displayVideo.duration : formatDuration(displayVideo.duration)}
        </div>
        
        {/* Visibility Badge */}
        {displayVideo.visibility === 'private' && (
          <div className="absolute top-3 left-3 bg-red-500/90 backdrop-blur-sm px-3 py-1.5 rounded-lg text-sm font-medium text-white border border-red-400/30">
            Private
          </div>
        )}
        
        {/* Menu Dropdown */}
        <div className="absolute top-3 right-3 z-10" ref={dropdownRef}>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setShowDropdown(!showDropdown);
            }}
            className="w-10 h-10 bg-black/70 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20 hover:bg-black/90 hover:border-white/40 transition-all duration-200 opacity-0 group-hover:opacity-100"
          >
            <MoreVertical className="w-5 h-5 text-white" />
          </button>
          
          {/* Dropdown Menu - Positioned inside card, above button */}
          {showDropdown && (
            <div className="absolute top-12 right-0 w-48 bg-slate-900 backdrop-blur-xl rounded-xl border border-slate-700 shadow-2xl z-[100] overflow-hidden">
              <div className="p-2">
                <button 
                  onClick={handleShare}
                  className="w-full flex items-center space-x-3 px-4 py-3 text-white hover:bg-slate-800 rounded-lg transition-colors text-sm font-medium"
                >
                  <Share2 className="w-4 h-4 text-blue-400" />
                  <span>Share Video</span>
                </button>
                <button 
                  onClick={handleDownload}
                  className="w-full flex items-center space-x-3 px-4 py-3 text-white hover:bg-slate-800 rounded-lg transition-colors text-sm font-medium"
                >
                  <Download className="w-4 h-4 text-green-400" />
                  <span>Download</span>
                </button>
                <button 
                  onClick={handlePlayVideo}
                  className="w-full flex items-center space-x-3 px-4 py-3 text-white hover:bg-slate-800 rounded-lg transition-colors text-sm font-medium"
                >
                  <ExternalLink className="w-4 h-4 text-purple-400" />
                  <span>Open Video</span>
                </button>
                <div className="my-1 h-px bg-slate-700"></div>
                <button 
                  onClick={handleDelete}
                  className="w-full flex items-center space-x-3 px-4 py-3 text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-lg transition-colors text-sm font-medium"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Card Content */}
      <div className="p-5">
        {/* Author Profile */}
        <div className="flex items-center space-x-3 mb-4">
          <img 
            src={displayVideo.author.avatar} 
            alt={displayVideo.author.name}
            className="w-9 h-9 rounded-full border-2 border-white/20 object-cover"
          />
          <div className="flex-1 min-w-0">
            <p className="text-white font-medium text-sm truncate">{displayVideo.author.name}</p>
            <p className="text-gray-400 text-xs">{formatDate(displayVideo.date)}</p>
          </div>
        </div>
        
        <h3 
          className="text-lg font-semibold text-white mb-4 line-clamp-2 group-hover:text-pink-300 transition-colors cursor-pointer leading-relaxed" 
          onClick={handlePlayVideo}
        >
          {displayVideo.title}
        </h3>
        
        <div className="flex items-center justify-between text-gray-400 text-sm">
          <div className="flex items-center space-x-2">
            <Eye className="w-4 h-4" />
            <span>{typeof displayVideo.views === 'number' ? displayVideo.views.toLocaleString() : displayVideo.views} views</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4" />
            <span>{typeof displayVideo.duration === 'string' ? displayVideo.duration : formatDuration(displayVideo.duration)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const Page = ({ searchParams }) => {
  const { query, filter, page } = searchParams || {};
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState({
    total: 0,
    limit: 10,
    offset: 0,
    hasMore: false
  });

  const fetchVideos = async (offset = 0) => {
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch(`/api/videos?limit=10&offset=${offset}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch videos');
      }
      
      const data = await response.json();
      
      if (offset === 0) {
        setVideos(data.videos || []);
      } else {
        setVideos(prev => [...prev, ...(data.videos || [])]);
      }
      
      setPagination(data.pagination || {
        total: data.videos?.length || 0,
        limit: 10,
        offset: 0,
        hasMore: false
      });
    } catch (err) {
      console.error('Error fetching videos:', err);
      setError('Failed to load videos. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const handleDeleteVideo = (videoId) => {
    setVideos(videos.filter(video => video.id !== videoId));
    setPagination(prev => ({
      ...prev,
      total: prev.total - 1
    }));
  };

  const handleShareVideo = (video) => {
    // Share functionality handled in VideoCard
  };

  const handleLoadMore = () => {
    fetchVideos(pagination.offset + pagination.limit);
  };

  if (loading && videos.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <div className="text-white text-xl">Loading videos...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <main className="wrapper page">
        <Header subHeader="Public Library" title="All Videos" />
        
        {/* Content Section */}
        <div className="px-6 py-12">
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-center">
              <p>{error}</p>
              <button 
                onClick={() => fetchVideos()}
                className="mt-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors"
              >
                Try Again
              </button>
            </div>
          )}
          
          {/* Header */}
          <div className="mb-12 text-center">
            <h1 className="text-5xl font-bold text-white mb-4 bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
              Your Videos
            </h1>
            <p className="text-gray-400 text-lg">
              {pagination.total} recordings ready to share
            </p>
          </div>
          
          {/* Video Grid */}
          {videos.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8">
                {videos.map((video) => (
                  <VideoCard 
                    key={video.id} 
                    video={video} 
                    onDelete={handleDeleteVideo}
                    onShare={handleShareVideo}
                  />
                ))}
              </div>
              
              {/* Load More Button */}
              {pagination.hasMore && (
                <div className="text-center mt-12">
                  <button
                    onClick={handleLoadMore}
                    disabled={loading}
                    className="px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl hover:from-pink-600 hover:to-purple-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-lg hover:shadow-pink-500/25"
                  >
                    {loading ? 'Loading...' : 'Load More Videos'}
                  </button>
                </div>
              )}
            </>
          ) : !loading ? (
            <div className="text-center py-24">
              <div className="mb-6">
                <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-700">
                  <Play className="w-12 h-12 text-gray-400" />
                </div>
              </div>
              <h3 className="text-2xl font-semibold text-white mb-2">No videos found</h3>
              <p className="text-gray-400 text-lg mb-6">Upload your first video to get started!</p>
              <button 
                onClick={() => window.location.href = '/upload'}
                className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl hover:from-pink-600 hover:to-purple-600 transition-all duration-300 font-medium shadow-lg hover:shadow-pink-500/25"
              >
                Upload Video
              </button>
            </div>
          ) : null}
        </div>
      </main>
    </div>
  );
};

export default Page;