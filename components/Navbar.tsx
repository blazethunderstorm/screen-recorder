"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";

const Navbar = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const user = session?.user;
  const loading = status === "loading";
  const [showDropdown, setShowDropdown] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut({
        callbackUrl: "/login",
        redirect: true
      });
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  const handleLogin = () => {
    router.push("/login");
  };

  if (loading) {
    return (
      <header className="sticky top-0 z-50 w-full border-b border-slate-700/50 bg-slate-900/95 backdrop-blur supports-[backdrop-filter]:bg-slate-900/60">
        <div className="container mx-auto px-4">
          <nav className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                  </svg>
                </div>
              </div>
              <h1 className="text-white text-2xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                Screen Pro
              </h1>
            </Link>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-slate-700 rounded-full animate-pulse"></div>
            </div>
          </nav>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-700/50 bg-slate-900/95 backdrop-blur supports-[backdrop-filter]:bg-slate-900/60">
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between h-16">
          {/* Logo and Title */}
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
              </div>
            </div>
            <h1 className="text-white text-2xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
              Screen Pro
            </h1>
          </Link>

          {/* User Section */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-800/60 transition-colors group"
              >
                <div className="relative">
                  <Image
                    src={user.image || "/assets/images/dummy.jpg"}
                    alt="User profile"
                    width={36}
                    height={36}
                    className="rounded-full border-2 border-slate-700 group-hover:border-slate-600 transition-colors"
                  />
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-slate-900 rounded-full"></div>
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-white text-sm font-medium">{user.name}</p>
                  <p className="text-slate-400 text-xs">{user.email}</p>
                </div>
                <svg 
                  className={`w-4 h-4 text-slate-400 transition-transform ${showDropdown ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {showDropdown && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-slate-800 border border-slate-700 rounded-lg shadow-xl py-2 z-50">
                  <div className="px-4 py-3 border-b border-slate-700">
                    <p className="text-white font-medium">{user.name}</p>
                    <p className="text-slate-400 text-sm">{user.email}</p>
                  </div>
                  
                  <button
                    onClick={() => {
                      router.push(`/profile/${user.id}`);
                      setShowDropdown(false);
                    }}
                    className="flex items-center gap-3 w-full px-4 py-2 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    View Profile
                  </button>
                  
                 
                  
                  <div className="border-t border-slate-700 mt-2 pt-2">
                    <button
                      onClick={() => {
                        handleSignOut();
                        setShowDropdown(false);
                      }}
                      className="flex items-center gap-3 w-full px-4 py-2 text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <button
                onClick={handleLogin}
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 border border-blue-500/20"
              >
                Sign In
              </button>
            </div>
          )}
        </nav>
      </div>

      {/* Click outside to close dropdown */}
      {showDropdown && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowDropdown(false)}
        />
      )}
    </header>
  );
};

export default Navbar;