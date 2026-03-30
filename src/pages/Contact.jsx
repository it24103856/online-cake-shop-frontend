import React from 'react';
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';
import Footer from '../components/Footer';

export default function Contact() {
  return (
    <>
      <main className="w-full min-h-screen bg-[#FDF8F0] ">
        
        {/* 1. Hero Section */}
        <section className="relative h-[40vh] flex items-center justify-center bg-fixed bg-center bg-cover"
                 style={{ backgroundImage: "url('https://images.unsplash.com/photo-1535141192574-5d4897c12636?q=80&w=1976&auto=format&fit=crop')" }}>
          <div className="absolute inset-0 bg-black/50"></div>
          <div className="relative z-10 text-center text-white px-4">
            <p className="uppercase text-[11px] tracking-[0.4em] font-semibold text-white/70 mb-4">Get In Touch</p>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
              Contact <span className="italic text-rose-300">Us</span>
            </h1>
          </div>
        </section>

        {/* 2. Contact Content Section */}
        <section className="max-w-7xl mx-auto py-24 px-6">
          <div className="grid lg:grid-cols-3 gap-16">
            
            {/* Left Side: Contact Information */}
            <div className="space-y-12">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>Visit Our Bakery</h2>
                <p className="text-gray-500 leading-relaxed mb-8">
                  Stop by our boutique shop for a fresh tasting or discuss your dream wedding cake with our master bakers.
                </p>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-500 flex-shrink-0">
                      <MapPin size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm uppercase tracking-widest">Location</h4>
                      <p className="text-gray-500 text-sm mt-1">123 Cake Street, Colombo 07, Sri Lanka</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-500 flex-shrink-0">
                      <Phone size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm uppercase tracking-widest">Phone</h4>
                      <p className="text-gray-500 text-sm mt-1">+94 77 123 4567</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-500 flex-shrink-0">
                      <Mail size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm uppercase tracking-widest">Email</h4>
                      <p className="text-gray-500 text-sm mt-1">hello@yourcakeshop.com</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-500 flex-shrink-0">
                      <Clock size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm uppercase tracking-widest">Opening Hours</h4>
                      <p className="text-gray-500 text-sm mt-1">Mon - Sat: 9:00 AM - 8:00 PM</p>
                      <p className="text-gray-500 text-sm font-bold mt-1 text-rose-400">Sunday: Closed</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="pt-6 border-t border-gray-100">
                <h4 className="font-bold text-gray-900 text-[10px] uppercase tracking-[0.3em] mb-4">Follow Our Journey</h4>
                <div className="flex gap-4">
                </div>
              </div>
            </div>

            {/* Right Side: Contact Form */}
            <div className="lg:col-span-2 bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-neutral-100">
              <h3 className="text-3xl font-bold text-gray-900 mb-8" style={{ fontFamily: "'Playfair Display', serif" }}>Send Us a Message</h3>
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Full Name</label>
                    <input type="text" placeholder="John Doe" className="w-full px-6 py-4 bg-neutral-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-rose-100 transition-all text-sm" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Email Address</label>
                    <input type="email" placeholder="john@example.com" className="w-full px-6 py-4 bg-neutral-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-rose-100 transition-all text-sm" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Subject</label>
                  <input type="text" placeholder="Custom Cake Inquiry" className="w-full px-6 py-4 bg-neutral-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-rose-100 transition-all text-sm" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Your Message</label>
                  <textarea rows="5" placeholder="Tell us about your event..." className="w-full px-6 py-4 bg-neutral-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-rose-100 transition-all text-sm resize-none"></textarea>
                </div>
                <button className="w-full bg-neutral-900 hover:bg-rose-500 text-white py-5 rounded-2xl font-bold uppercase tracking-[0.2em] text-[11px] transition-all duration-500 shadow-xl flex items-center justify-center gap-3 group">
                  Send Message <Send size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </button>
              </form>
            </div>
          </div>
        </section>

        {/* 3. Google Maps Section */}
        <section className="w-full h-[500px] bg-gray-100 overflow-hidden">
          <iframe 
            title="Bakery Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126743.58585994468!2d79.78616429726563!3d6.921837399999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae253d10f7a70ad%3A0x396452990d412b35!2sColombo!5e0!3m2!1sen!2slk!4v1710345678910!5m2!1sen!2slk" 
            width="100%" 
            height="100%" 
            style={{ border: 0, filter: "grayscale(1) contrast(1.2) opacity(0.8)" }} 
            allowFullScreen="" 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade">
          </iframe>
        </section>
      </main>
      <Footer />
    </>
  );
}