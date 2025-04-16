"use client";
import { useState } from "react";
import Link from "next/link";
import { useUser } from "@/context/user-context";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { userData, isLoading, logout } = useUser();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  // Generate support URL based on user role
  const supportUrl = userData?.role === "customer" 
    ? `/support/${userData.id}` 
    : "/support";
    
  // Handle navigation with auth verification
  const handleNavigation = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    // Only for protected routes
    if (path.startsWith('/admin') || path.startsWith('/support')) {
      e.preventDefault();
      
      // Redirect based on user role for support routes
      if (path.startsWith('/support') && userData?.role === 'customer') {
        window.location.href = `/support/${userData.id}`;
      } else {
        // Force a hard navigation for other protected routes
        window.location.href = path;
      }
    }
  };

  return (
    <nav className="bg-white shadow-md dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center">
            <Link
              href="/"
              className="text-xl font-bold text-gray-800 dark:text-white"
            >
              TicketFlow
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden items-center space-x-6 md:flex">
            <Link
              href="/"
              className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
            >
              Home
            </Link>
            <Link
              href={supportUrl}
              className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
              onClick={(e) => handleNavigation(e, supportUrl)}
            >
              Support
            </Link>
            {userData?.role !== "customer" && (
              <Link
                href="/admin"
                className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                onClick={(e) => handleNavigation(e, "/admin")}
              >
                Admin
              </Link>
            )}
            {isLoading ? (
              <div className="h-10 w-20 animate-pulse rounded-md bg-gray-200 dark:bg-gray-700"></div>
            ) : userData ? (
              <button
                className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                onClick={handleLogout}
              >
                Logout
              </button>
            ) : (
              <Link
                href="/login"
                className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
              >
                Log In
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              type="button"
              className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="space-y-3 py-4 md:hidden">
            <Link
              href="/"
              className="block text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
            >
              Home
            </Link>
            <Link
              href={supportUrl}
              className="block text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
              onClick={(e) => handleNavigation(e, supportUrl)}
            >
              Support
            </Link>
            {userData?.role !== "customer" && (
              <Link
                href="/admin"
                className="block text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                onClick={(e) => handleNavigation(e, "/admin")}
              >
                Admin
              </Link>
            )}
            {isLoading ? (
              <div className="h-10 w-full animate-pulse rounded-md bg-gray-200 dark:bg-gray-700"></div>
            ) : userData ? (
              <button
                className="block w-full rounded-md bg-blue-600 px-4 py-2 text-center text-white hover:bg-blue-700"
                onClick={handleLogout}
              >
                Logout
              </button>
            ) : (
              <Link
                href="/login"
                className="block w-full rounded-md bg-blue-600 px-4 py-2 text-center text-white hover:bg-blue-700"
              >
                Log In
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
