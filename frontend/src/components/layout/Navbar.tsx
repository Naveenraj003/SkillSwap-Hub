import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

const Navbar: React.FC = () => {
  const [open, setOpen] = useState(false);

  const navItems = (
    <>
      <Link
        to="/"
        className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
        onClick={() => setOpen(false)}
      >
        Home
      </Link>
      <Link
        to="/marketplace"
        className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
        onClick={() => setOpen(false)}
      >
        Marketplace
      </Link>
      <Link
        to="/HowItWorks"
        className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
        onClick={() => setOpen(false)}
      >
        How It Works
      </Link>
    </>
  );

  return (
    <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-md border-b border-gray-200">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-semibold text-indigo-600">
              SkillSwap Hub
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <div className="flex space-x-1 items-center">
              <Link to="/" className="px-3 py-2 text-sm text-gray-700 hover:text-indigo-600">
                Home
              </Link>
              <Link to="/marketplace" className="px-3 py-2 text-sm text-gray-700 hover:text-indigo-600">
                Marketplace
              </Link>
              <Link to="/HowItWorks" className="px-3 py-2 text-sm text-gray-700 hover:text-indigo-600">
                How It Works
              </Link>
            </div>

            <div className="flex items-center space-x-3">
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-medium text-gray-700 border border-transparent rounded hover:bg-gray-100"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded hover:bg-indigo-500"
              >
                Get Started
              </Link>
            </div>
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setOpen(!open)}
              aria-label="Toggle menu"
              className="p-2 rounded-md text-gray-700 hover:bg-gray-100"
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden px-2 pb-4">
          <div className="bg-white rounded-lg shadow-md p-3 space-y-1">
            {navItems}
            <div className="pt-2 border-t border-gray-100">
              <Link
                to="/login"
                className="block w-full text-center px-4 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
                onClick={() => setOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/register"
                className="mt-2 block w-full text-center px-4 py-2 rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500"
                onClick={() => setOpen(false)}
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
