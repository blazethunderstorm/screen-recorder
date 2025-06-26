"use client"
import React, { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Upload, Search, Video, MoreVertical } from 'lucide-react'

// Simple DropDown component
const DropDown = ({ options, selected, onSelect, trigger }) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  return (
    <div className="relative" ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
        {trigger}
      </div>
      
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-48 bg-slate-800/90 backdrop-blur-md border border-slate-600/50 rounded-lg shadow-xl z-50">
          {options.map((option) => (
            <div
              key={option}
              onClick={() => {
                onSelect(option)
                setIsOpen(false)
              }}
              className="px-4 py-2 text-sm text-white hover:bg-slate-700 cursor-pointer first:rounded-t-lg last:rounded-b-lg"
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function Header({ 
  subHeader = "Content Creator", 
  title = "Video Dashboard", 
  userImg 
}) {
  const router = useRouter()
  const [selectedFilter, setSelectedFilter] = useState('All Videos')
  const [searchValue, setSearchValue] = useState('')
  
  const filterOptions = ['All Videos', 'Recent Videos', 'Favorites', 'Shared', 'Archive']

  return (
    <div className="bg-transparent">
      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          {/* Left - User Info */}
          <div className="flex items-center space-x-4">
{/* Profile Picture - Only show if userImg is provided */}
            {userImg && (
              <div className="relative">
                <img
                  src={userImg}
                  alt="Profile"
                  className="w-12 h-12 rounded-full object-cover border-2 border-slate-600"
                />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-slate-900"></div>
              </div>
            )}

            {/* User Details */}
            <div>
              <p className="text-sm text-slate-400">{subHeader}</p>
              <h1 className="text-2xl font-bold text-white">{title}</h1>
            </div>
          </div>

          {/* Right - Action Buttons */}
          <div className="flex items-center space-x-3">
            {/* Record Video */}
            <button 
              onClick={() => router.push('/record')}
              className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
            >
              <Video size={16} />
              <span>Record Video</span>
            </button>

            {/* Upload Video */}
            <button 
              onClick={() => router.push('/upload')}
              className="flex items-center space-x-2 px-4 py-2 border border-slate-600/50 text-slate-300 hover:text-white hover:border-slate-500/70 hover:bg-slate-800/30 rounded-lg font-medium transition-all duration-200 backdrop-blur-sm"
            >
              <Upload size={16} />
              <span>Upload Video</span>
            </button>

            {/* Filter Dropdown */}
            <DropDown
              options={filterOptions}
              selected={selectedFilter}
              onSelect={setSelectedFilter}
              trigger={
                <div className="flex items-center space-x-2 px-4 py-2 border border-slate-600/50 text-slate-300 hover:text-white hover:border-slate-500/70 hover:bg-slate-800/30 rounded-lg font-medium transition-all duration-200 backdrop-blur-sm">
                  <span>{selectedFilter}</span>
                  <MoreVertical size={16} />
                </div>
              }
            />
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div className="border-t border-slate-800/30">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="relative max-w-md">
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search for videos, tags, folders..."
              className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 backdrop-blur-sm"
            />
          </div>
        </div>
      </div>
    </div>
  )
}