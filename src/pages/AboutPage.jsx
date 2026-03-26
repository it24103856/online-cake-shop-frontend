import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShieldCheck, Users, Star, Utensils, Sparkles } from 'lucide-react';
import Footer from '../components/Footer';

export default function About() {
  return (
    <main className="w-full min-h-screen bg-[#FDFDFD] ">

      {/* 1. Hero Section with Luxury Cake Background */}
      <section className="relative h-[65vh] flex items-center justify-center bg-fixed bg-center bg-cover"
               style={{ backgroundImage: "url('https://images.unsplash.com/photo-1535141192574-5d4897c12636?q=80&w=1976&auto=format&fit=crop')" }}>
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative z-10 text-center text-white px-4 max-w-7xl mx-auto">
          <p className="uppercase text-[11px] tracking-[0.4em] font-semibold text-white/70 mb-4">The Art of Baking</p>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
            Our <span className="italic">Legacy</span>
          </h1>
          <p className="mt-4 text-lg md:text-xl font-light max-w-2xl mx-auto text-white/90">
            Handcrafting premium delights and sweet memories in Sri Lanka since 2020.
          </p>
        </div>
      </section>

      {/* 2. Who We Are Section */}
      <section className="max-w-7xl mx-auto py-24 px-4">
        <div className="grid md:grid-cols-2 gap-20 items-center">
          <div className="space-y-8">
            <div className="inline-block">
              <p className="uppercase text-[11px] tracking-[0.3em] font-semibold text-rose-500">Since Day One</p>
              <div className="w-12 h-[2px] bg-rose-500 mt-1"></div>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
              Baked with <span className="italic text-rose-500">Passion</span>, Served with Love
            </h2>
            <p className="text-gray-500 leading-relaxed text-lg italic">
              "We believe that every celebration, big or small, deserves a centerpiece that is as unique as the moment itself."
            </p>
            <p className="text-gray-500 leading-relaxed text-lg">
              At our boutique bakery, we don't just bake cakes; we create edible masterpieces. From the finest Belgian chocolate to organic local fruits, every ingredient is handpicked to ensure a symphony of flavors in every bite.
            </p>
            <div className="pt-4">
               <Link to="/contact" className="inline-block bg-neutral-900 hover:bg-rose-500 text-white px-12 py-5 rounded-full font-bold transition-all duration-500 shadow-xl uppercase text-[11px] tracking-widest hover:scale-105">
                 Talk To Our Baker
               </Link>
            </div>
          </div>
          <div className="relative">
            <img
              src="/about.jpg"
              alt="Baking Process"
              className="rounded-[18rem] shadow-2xl hover:brightness-110 transition-all duration-700 z-10 relative aspect-[4/5] object-cover"
            />
            {/* Decorative Circle */}
            <div className="absolute -top-10 -right-10 w-64 h-64 bg-rose-100 rounded-full -z-0 opacity-60 blur-3xl animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* 3. Why Choose Us (Icon Cards) */}
      <section className="bg-rose-50/30 py-24 px-4 border-y border-rose-100">
        <div className="max-w-7xl mx-auto text-center mb-16">
          <p className="uppercase text-[11px] tracking-[0.4em] font-semibold text-rose-500 mb-3">Our Quality</p>
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>
            The Secret <span className="italic">Ingredients</span>
          </h2>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          {[
            { icon: <Utensils size={28} />, title: "Premium Sourcing", desc: "We use only the world's finest cocoa and organic dairy." },
            { icon: <ShieldCheck size={28} />, title: "100% Fresh", desc: "Baked only after you order. No preservatives, ever." },
            { icon: <Sparkles size={28} />, title: "Custom Design", desc: "Your dream design turned into a delicious reality." },
            { icon: <Star size={28} />, title: "Award Winning", desc: "Rated as the best boutique bakery in the region." }
          ].map((item, index) => (
            <div key={index} className="bg-white p-12 rounded-[2.5rem] shadow-sm hover:shadow-2xl transition-all duration-500 border border-rose-50 text-center group">
              <div className="text-rose-400 mb-6 flex justify-center group-hover:rotate-[12deg] transition-transform duration-500">
                {item.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>{item.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Statistics Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
          {[
            { num: "50+", label: "Cake Flavors" },
            { num: "3.5k+", label: "Cakes Delivered" },
            { num: "100%", label: "Natural" },
            { num: "4.9", label: "Average Rating" },
          ].map((stat, i) => (
            <div key={i} className="group">
              <h4 className="text-5xl font-bold text-gray-900 group-hover:text-rose-500 transition-colors duration-500" style={{ fontFamily: "'Playfair Display', serif" }}>{stat.num}</h4>
              <div className="w-8 h-[2px] bg-rose-200 mx-auto my-3"></div>
              <p className="text-gray-400 uppercase tracking-[0.2em] text-[10px] font-bold">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}