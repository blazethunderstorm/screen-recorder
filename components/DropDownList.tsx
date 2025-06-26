"use client";

import { useState, useRef, useEffect } from "react";
import { Check } from "lucide-react";

interface DropdownListProps {
  options: string[];
  selectedOption: string;
  onOptionSelect: (option: string) => void;
  triggerElement: React.ReactNode;
}

const DropDownList = ({
  options,
  selectedOption,
  onOptionSelect,
  triggerElement,
}: DropdownListProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleOptionClick = (option: string) => {
    onOptionSelect(option);
    setIsOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Close dropdown on escape key
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <div 
        className="cursor-pointer" 
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsOpen(!isOpen);
          }
        }}
        tabIndex={0}
        role="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        {triggerElement}
      </div>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-52 bg-gray-800 border border-gray-600 rounded-xl shadow-2xl z-50 py-2 animate-in fade-in-0 zoom-in-95 duration-200 backdrop-blur-sm">
          <div className="max-h-64 overflow-y-auto">
            {options.map((option, index) => (
              <div
                key={option}
                className="flex items-center justify-between px-4 py-3 text-sm text-gray-300 hover:bg-gray-700 hover:text-white cursor-pointer transition-all duration-150 group first:rounded-t-xl last:rounded-b-xl"
                onClick={() => handleOptionClick(option)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleOptionClick(option);
                  }
                }}
                tabIndex={0}
                role="option"
                aria-selected={selectedOption === option}
              >
                <span className="font-medium group-hover:translate-x-1 transition-transform duration-150">
                  {option}
                </span>
                {selectedOption === option && (
                  <Check 
                    size={16} 
                    className="text-blue-400 animate-in fade-in-0 zoom-in-75 duration-200" 
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DropDownList;