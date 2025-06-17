"use client"
import React, { useState, useRef, useEffect } from 'react';
import { Upload, Play, Image, Eye, EyeOff, X, Check } from 'lucide-react';

const ScreenProUpload = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    visibility: 'public'
  });
  const [videoFile, setVideoFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [videoDuration, setVideoDuration] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  const videoInputRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 100 * 1024 * 1024) { // 100MB limit
        setError('Video file must be less than 100MB');
        return;
      }
      
      setVideoFile(file);
      const url = URL.createObjectURL(file);
      setVideoPreview(url);
      
      // Get video duration
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.onloadedmetadata = () => {
        setVideoDuration(Math.round(video.duration));
        URL.revokeObjectURL(video.src);
      };
      video.src = url;
    }
  };

  const resetVideo = () => {
    setVideoFile(null);
    setVideoPreview(null);
    setVideoDuration(null);
    if (videoInputRef.current) videoInputRef.current.value = '';
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSubmit = async () => {
    if (!videoFile) {
      setError('Please upload a video file.');
      return;
    }
    
    if (!formData.title || !formData.description) {
      setError('Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);
    setError('');
    setSuccess('');
    setUploadProgress(0);
    
    try {
      // Step 1: Upload video file to get video URL and thumbnail
      const uploadFormData = new FormData();
      uploadFormData.append('video', videoFile);
      
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json();
        throw new Error(errorData.error || 'Failed to upload video');
      }

      const uploadResult = await uploadResponse.json();

      // Step 2: Create video record in database
      const videoData = {
        title: formData.title,
        description: formData.description,
        videoUrl: uploadResult.videoUrl,
        videoId: uploadResult.videoId,
        thumbnailUrl: uploadResult.thumbnailUrl,
        visibility: formData.visibility,
        duration: videoDuration
      };

      const createResponse = await fetch('/api/videos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(videoData),
      });

      if (!createResponse.ok) {
        const errorData = await createResponse.json();
        throw new Error(errorData.error || 'Failed to create video record');
      }

      const createdVideo = await createResponse.json();
      
      setSuccess('Video uploaded successfully!');
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        visibility: 'public'
      });
      resetVideo();
      
    } catch (err) {
      setError(err.message || 'Upload failed. Please try again.');
    } finally {
      setIsSubmitting(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">
      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">Upload a video</h2>
          <p className="text-slate-400">Share your videos with the world</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-green-400">
            {success}
          </div>
        )}

        <div className="space-y-6">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
            {/* Title */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter a clear and concise video title"
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isSubmitting}
              />
            </div>

            {/* Description */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Briefly describe what this video is about"
                rows={4}
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                disabled={isSubmitting}
              />
            </div>

            {/* Video Upload */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Video *
              </label>
              {!videoFile ? (
                <div 
                  className="border-2 border-dashed border-slate-600 rounded-xl p-8 text-center hover:border-blue-500 transition-colors cursor-pointer"
                  onClick={() => videoInputRef.current?.click()}
                >
                  <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-300 mb-2">Click to upload video</p>
                  <p className="text-sm text-slate-400">MP4, WebM, AVI up to 100MB</p>
                  <input
                    ref={videoInputRef}
                    type="file"
                    accept="video/*"
                    onChange={handleVideoChange}
                    className="hidden"
                    disabled={isSubmitting}
                  />
                </div>
              ) : (
                <div className="border border-slate-600 rounded-xl p-4 bg-slate-700/30">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Play className="w-5 h-5 text-blue-400" />
                      <div>
                        <p className="text-white font-medium">{videoFile.name}</p>
                        <p className="text-sm text-slate-400">
                          {(videoFile.size / (1024 * 1024)).toFixed(1)} MB
                          {videoDuration && ` • ${formatDuration(videoDuration)}`}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={resetVideo}
                      className="text-slate-400 hover:text-red-400 transition-colors"
                      disabled={isSubmitting}
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  {videoPreview && (
                    <video
                      src={videoPreview}
                      controls
                      className="w-full max-w-md rounded-lg"
                    />
                  )}
                </div>
              )}
            </div>

            {/* Visibility */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Visibility
              </label>
              <select
                name="visibility"
                value={formData.visibility}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isSubmitting}
              >
                <option value="public">🌍 Public</option>
                <option value="private">🔒 Private</option>
              </select>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting || !videoFile}
                className="px-8 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl font-medium hover:from-red-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Uploading... {uploadProgress}%
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    Upload Video
                  </>
                )}
              </button>
            </div>

            {/* Progress Bar */}
            {isSubmitting && (
              <div className="mt-4">
                <div className="bg-slate-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-red-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScreenProUpload;