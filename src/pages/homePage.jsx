import React from "react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import { ArrowUpRight, Star, ShoppingBag, UtensilsCrossed, Quote, Cake, Sparkles, Gift, CupSoda } from "lucide-react";

export default function HomePage() {
  // Cake collections
  const cakeCategories = [
    {
      id: "wedding",
      name: "Wedding Cakes",
      count: "12 designs",
      img: "/wedding.jpg",
      price: "from $180",
    },
    {
      id: "artisan",
      name: "Artisan Cakes",
      count: "24 designs",
      img: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=1000&auto=format&fit=crop",
      price: "from $65",
    },
    {
      id: "luxury",
      name: "Luxury Range",
      count: "08 designs",
      img: "/cupcake.jpg",
      price: "from $250",
    },
  ];

  // Accessories
  const accessories = [
    {
      id: "topper-1",
      name: "Gold Leaf Topper",
      price: "$24",
      img: "/gold.jpg",
    },
    {
      id: "stand-1",
      name: "Marble Cake Stand",
      price: "$48",
      img: "/stand.jpg",
    },
    {
      id: "box-1",
      name: "Luxury Gift Box",
      price: "$32",
      img: "/box.jpg",
    },
    {
      id: "cutter-1",
      name: "Custom Cake Cutter",
      price: "$19",
      img: "/cutter.jpg",
    },
  ];

  const testimonials = [
    {
      id: 1,
      name: "Sophia Sterling",
      text: "The wedding cake was a masterpiece of both design and flavor. Truly the highlight of our reception.",
      rating: 5,
    },
    {
      id: 2,
      name: "Julian Voss",
      text: "I've never tasted chocolate this refined. The attention to detail in their luxury range is unmatched.",
      rating: 5,
    },
  ];

  return (
    <>
      <main className="w-full min-h-screen bg-white text-[#1A1A1A] ">
        {/* ========== 1. HERO SECTION ========== */}
        <section className="relative w-full h-[90vh] flex items-center justify-center overflow-hidden px-6 bg-gradient-to-br from-amber-50/80 via-white to-rose-50/80">
          <div className="absolute inset-0 z-0">
            <img
              src="/hompage.jpg"
              className="w-full h-full object-cover opacity-30"
              alt="Luxury Cake"
            />
          </div>
          <div className="relative z-10 text-center w-full max-w-7xl mx-auto">
            <span className="inline-block bg-black/10 backdrop-blur-sm px-6 py-2 rounded-full text-[11px] font-semibold tracking-wider text-black/70 mb-6">
              ✨ Artisanal Cakes & Accessories ✨
            </span>
            <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter leading-[1.1] mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
              Sweet <span className="text-rose-500">Moments</span> <br />
              Crafted with Love
            </h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-10">
              From elegant wedding cakes to bespoke cake toppers and stands – everything you need to create unforgettable celebrations.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/Cakes" className="px-8 py-4 bg-[#1A1A1A] text-white font-bold uppercase text-xs tracking-widest rounded-full hover:bg-rose-500 transition-all shadow-lg">
                Shop Cakes
              </Link>
              <Link to="/Accessories" className="px-8 py-4 border-2 border-[#1A1A1A] text-[#1A1A1A] font-bold uppercase text-xs tracking-widest rounded-full hover:bg-[#1A1A1A] hover:text-white transition-all">
                Explore Accessories
              </Link>
            </div>
          </div>
        </section>

        {/* ========== 2. FEATURED CAKES (with unique background) ========== */}
        <section className="py-32 px-6 bg-[#FDF8F0]">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
              <p className="uppercase text-[11px] tracking-[0.4em] font-semibold text-rose-400 mb-4">Signature Collections</p>
              <h2 className="text-5xl md:text-6xl font-black italic tracking-tighter" style={{ fontFamily: "'Playfair Display', serif" }}>
                Our <span className="text-rose-500">Cakes</span>
              </h2>
              <div className="w-24 h-0.5 bg-rose-300 mx-auto mt-6"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {cakeCategories.map((cake) => (
                <Link key={cake.id} to={`/category/${cake.id}`} className="group relative">
                  <div className="relative w-full aspect-[4/5] overflow-hidden rounded-3xl bg-white shadow-xl transition-all duration-500 group-hover:shadow-2xl group-hover:-translate-y-2">
                    <img
                      src={cake.img}
                      alt={cake.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                      <div className="text-white">
                        <p className="text-sm font-semibold">{cake.count}</p>
                        <p className="text-2xl font-bold">{cake.price}</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 text-center">
                    <h3 className="text-2xl font-bold italic">{cake.name}</h3>
                    <p className="text-rose-500 text-sm uppercase tracking-wider mt-1">{cake.count}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ========== 3. ACCESSORIES SECTION (with light pattern background) ========== */}
        <section className="py-32 px-6 bg-[#F9F9F9] relative overflow-hidden">
          {/* Decorative pattern */}
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/diamond-upholstery.png')" }}></div>
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="text-center mb-20">
              <p className="uppercase text-[11px] tracking-[0.4em] font-semibold text-amber-600 mb-4">Complete Your Celebration</p>
              <h2 className="text-5xl md:text-6xl font-black italic tracking-tighter" style={{ fontFamily: "'Playfair Display', serif" }}>
                Cake <span className="text-amber-600">Accessories</span>
              </h2>
              <div className="w-24 h-0.5 bg-amber-400 mx-auto mt-6"></div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {accessories.map((item) => (
                <div key={item.id} className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300">
                  <div className="relative w-full aspect-square overflow-hidden">
                    <img
                      src={item.img}
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-bold">
                      {item.price}
                    </div>
                  </div>
                  <div className="p-5 text-center">
                    <h3 className="font-bold text-lg">{item.name}</h3>
                    <button className="mt-3 text-sm font-semibold text-amber-600 hover:text-amber-800 transition-colors">
                      Add to Cart →
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-12">
              <Link to="/accessories" className="inline-block px-8 py-3 border-2 border-amber-600 text-amber-700 font-semibold rounded-full hover:bg-amber-600 hover:text-white transition-all">
                View All Accessories
              </Link>
            </div>
          </div>
        </section>

        {/* ========== 4. OUR STORY (with rich background) ========== */}
        <section className="py-32 px-6 bg-gradient-to-br from-[#1A1A1A] to-[#2C2C2C] text-white rounded-t-[4rem]">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16">
            <div className="flex-1 space-y-6">
              <p className="uppercase text-[10px] tracking-[0.5em] font-bold text-rose-400">Our Philosophy</p>
              <h2 className="text-5xl md:text-6xl font-black italic tracking-tighter leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
                Crafted with <br /> Heart & <span className="text-rose-400">Legacy</span>
              </h2>
              <p className="text-gray-300 text-lg leading-relaxed">
                What started in a small family kitchen has evolved into a sanctuary for sugar art and cake design. We don't just bake; we architect memories using the finest ingredients and pair them with exquisite accessories to make every moment unforgettable.
              </p>
              <Link to="/about" className="inline-flex items-center gap-2 text-rose-400 font-semibold border-b border-rose-400 pb-1 hover:gap-3 transition-all">
                Discover the Journey <ArrowUpRight size={16} />
              </Link>
            </div>
            <div className="flex-1">
              <img
                src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=1000&auto=format&fit=crop"
                className="rounded-3xl w-full aspect-square object-cover shadow-2xl"
                alt="Our Story"
              />
            </div>
          </div>
        </section>

        {/* ========== 5. TESTIMONIALS (soft gradient background) ========== */}
        <section className="py-28 px-6 bg-gradient-to-t from-amber-50 to-white">
          <div className="max-w-4xl mx-auto text-center">
            <Quote size={44} className="mx-auto mb-8 text-rose-300" />
            <div className="space-y-16">
              {testimonials.map((t) => (
                <div key={t.id}>
                  <p className="text-2xl md:text-3xl font-medium italic leading-relaxed text-gray-700" style={{ fontFamily: "'Playfair Display', serif" }}>
                    "{t.text}"
                  </p>
                  <div className="flex items-center justify-center gap-3 mt-6">
                    <div className="h-px w-8 bg-rose-200"></div>
                    <span className="text-sm font-black uppercase tracking-wider text-gray-500">{t.name}</span>
                    <div className="h-px w-8 bg-rose-200"></div>
                  </div>
                  <div className="flex justify-center gap-1 mt-3 text-amber-400">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} size={16} fill="currentColor" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}