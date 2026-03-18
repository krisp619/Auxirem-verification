import React, { useState } from "react";
import logo from "../assets/auxirem-logo.png";
import { Menu, X } from "lucide-react";

const Navbar: React.FC = () => {

  const [open, setOpen] = useState(false);

  return (
    <nav className="w-full bg-white shadow-md sticky top-0 z-50">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">

        <div className="flex items-center justify-between h-[70px]">

          {/* Logo */}
          <div className="flex items-center">
            <img src={logo} alt="Auxirem" className="h-10" />
          </div>

          {/* Desktop Menu */}
          <ul className="hidden md:flex items-center gap-8 font-medium text-gray-700">

            <li className="cursor-pointer hover:text-blue-600">Home</li>
            <li className="cursor-pointer hover:text-blue-600">About</li>
            <li className="cursor-pointer hover:text-blue-600">Services</li>
            <li className="cursor-pointer hover:text-blue-600">
              Courses ▾
            </li>
            <li className="cursor-pointer hover:text-blue-600">Portfolio</li>

          </ul>

          {/* Desktop Button */}
          <div className="hidden md:block">
            <button className="px-5 py-2 rounded-lg text-white font-semibold bg-gradient-to-r from-blue-500 to-purple-600">
              Build with us
            </button>
          </div>

          {/* Mobile Menu Icon */}
          <div className="md:hidden">

            <button onClick={() => setOpen(!open)}>
              {open ? <X size={26} /> : <Menu size={26} />}
            </button>

          </div>

        </div>

      </div>

      {/* Mobile Menu */}
      {open && (

        <div className="md:hidden bg-white shadow-lg border-t">

          <ul className="flex flex-col items-center gap-6 py-6 font-medium text-gray-700">

            <li className="cursor-pointer">Home</li>
            <li className="cursor-pointer">About</li>
            <li className="cursor-pointer">Services</li>
            <li className="cursor-pointer">Courses ▾</li>
            <li className="cursor-pointer">Portfolio</li>

            <button className="px-6 py-2 rounded-lg text-white font-semibold bg-gradient-to-r from-blue-500 to-purple-600">
              Build with us
            </button>

          </ul>

        </div>

      )}

    </nav>
  );
};

export default Navbar;