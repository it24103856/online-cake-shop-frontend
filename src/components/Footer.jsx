import React from 'react';
import { MapPin, Phone, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-16 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">

        {/* 1. About section */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            Crave<span className="text-[#00AEEF]">Luxury</span>
          </h2>
          <p className="text-sm leading-7 text-gray-400">
            Your ultimate travel companion, providing the best destinations and luxury experiences across Sri Lanka.
          </p>
        </div>

        {/* 2. Quick Links */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>Quick Links</h3>
          <ul className="space-y-3 text-sm">
            {[
              { to: "/", label: "Home" },
              { to: "/cakes", label: "Cakes" },
              { to: "/about", label: "About Us" },
              { to: "/contact", label: "Contact" },
            ].map((link) => (
              <li key={link.to}>
                <Link to={link.to} className="hover:text-[#00AEEF] transition-all duration-500">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* 3. Contact Info */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>Contact Us</h3>
          <ul className="space-y-4 text-sm">
            <li className="flex items-center gap-3">
              <MapPin size={16} className="text-[#00AEEF] flex-shrink-0" />
              No. 123, Galle Road, Colombo, Sri Lanka
            </li>
            <li className="flex items-center gap-3">
              <Phone size={16} className="text-[#00AEEF] flex-shrink-0" />
              +94 77 123 4567
            </li>
            <li className="flex items-center gap-3">
              <Mail size={16} className="text-[#00AEEF] flex-shrink-0" />
              travelease@gmail.com
            </li>
          </ul>
        </div>

        {/* 4. Newsletter */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>Newsletter</h3>
          <p className="text-sm mb-4 text-gray-400">Join us to discover our latest travel packages.</p>
          <div className="flex overflow-hidden rounded-full border border-gray-700">
            <input
              type="email"
              placeholder="Your Email"
              className="w-full px-5 py-3 bg-transparent text-white outline-none text-sm placeholder:text-gray-500"
            />
            <button className="bg-[#00AEEF] hover:bg-[#0096CE] text-white px-6 py-3 transition-all duration-500 font-bold uppercase text-[10px] tracking-widest whitespace-nowrap">
              Join
            </button>
          </div>
        </div>
      </div>

      {/* Copyright Bottom Bar */}
      <div className="border-t border-gray-800 mt-12 pt-8 text-center text-sm text-gray-500">
        <p>© 2026 TravelEase Project. All Rights Reserved.</p>
      </div>
    </footer>
  );
}