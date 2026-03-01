import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, Filter, SlidersHorizontal, Grid, List, Tag, ChevronDown, X, ShoppingBag } from "lucide-react";
import { PRODUCTS, BRANDS, CATEGORIES, CONDITIONS, type Product } from "../data/products";

type SortOption = "name-asc" | "name-desc" | "price-asc" | "price-desc" | "newest";
type ViewMode = "grid" | "list";

function ProductCard({ product, mode }: { product: Product; mode: ViewMode }) {
  const isGrid = mode === "grid";
  return (
    <motion.div
      className={`group relative overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-1 ${
        isGrid ? "flex flex-col" : "flex flex-row items-center gap-5 p-4"
      }`}
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.07)",
      }}
      whileHover={{ borderColor: "rgba(124,58,237,0.4)" }}
      layout
    >
      {/* Glow on hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 30% 30%, rgba(124,58,237,0.08), transparent 60%)" }}
      />

      {/* Image */}
      <div
        className={`relative overflow-hidden ${
          isGrid ? "aspect-square rounded-t-2xl" : "w-24 h-24 rounded-xl shrink-0"
        }`}
        style={{ background: "rgba(255,255,255,0.04)" }}
      >
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {product.badge && (
          <div
            className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-lg text-xs font-bold text-white"
            style={{
              background:
                product.badge === "New"
                  ? "linear-gradient(135deg, #f97316, #c2410c)"
                  : product.badge === "Sale"
                  ? "linear-gradient(135deg, #dc2626, #ea580c)"
                  : product.badge === "Refurbished"
                  ? "linear-gradient(135deg, #059669, #0891b2)"
                  : "rgba(124,58,237,0.8)",
              fontFamily: "Space Grotesk, sans-serif",
            }}
          >
            {product.badge}
          </div>
        )}
        {!product.inStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white/70 text-xs font-semibold" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className={isGrid ? "p-5 flex flex-col flex-1" : "flex-1"}>
        <p className="text-white/40 text-xs mb-1" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
          {product.brand} · {product.category}
        </p>
        <h3
          className="text-white font-semibold mb-1 line-clamp-2"
          style={{ fontFamily: "Space Grotesk, sans-serif", fontSize: isGrid ? 15 : 16 }}
        >
          {product.name}
        </h3>
        {product.storage && (
          <span
            className="inline-block text-xs px-2.5 py-1 rounded-lg mb-2 w-fit"
            style={{
              background: "rgba(124,58,237,0.12)",
              border: "1px solid rgba(124,58,237,0.2)",
              color: "#a78bfa",
              fontFamily: "Space Grotesk, sans-serif",
            }}
          >
            {product.storage}
          </span>
        )}
        {isGrid && (
          <p
            className="text-white/40 text-xs leading-relaxed mb-3 flex-1 line-clamp-2"
            style={{ fontFamily: "Space Grotesk, sans-serif" }}
          >
            {product.description}
          </p>
        )}
        <div className="flex items-center justify-between mt-auto pt-2">
          <div className="flex items-center gap-2">
            <span
              className="text-white font-bold text-lg"
              style={{ fontFamily: "Space Grotesk, sans-serif" }}
            >
              £{product.price.toLocaleString()}
            </span>
            {product.originalPrice && (
              <span
                className="text-white/30 text-sm line-through"
                style={{ fontFamily: "Space Grotesk, sans-serif" }}
              >
                £{product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>
          <div
            className="px-2.5 py-1 rounded-lg text-xs font-medium"
            style={{
              background:
                product.condition === "New"
                  ? "rgba(16,185,129,0.12)"
                  : product.condition === "Refurbished"
                  ? "rgba(59,130,246,0.12)"
                  : "rgba(245,158,11,0.12)",
              color:
                product.condition === "New"
                  ? "#34d399"
                  : product.condition === "Refurbished"
                  ? "#60a5fa"
                  : "#fbbf24",
              fontFamily: "Space Grotesk, sans-serif",
            }}
          >
            {product.condition}
          </div>
        </div>

        {/* Enquire button */}
        <button
          className="mt-3 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white transition-all opacity-0 group-hover:opacity-100 hover:scale-105"
          style={{
            background: "linear-gradient(135deg, #7c3aed, #06b6d4)",
            fontFamily: "Space Grotesk, sans-serif",
          }}
          onClick={() => window.open(`https://wa.me/447762121336?text=Hi%20Virk%20Tech%2C%20I%27m%20interested%20in%20the%20${encodeURIComponent(product.name)}%20(£${product.price})`, "_blank")}
        >
          <ShoppingBag className="w-4 h-4" />
          Enquire
        </button>
      </div>
    </motion.div>
  );
}

export function Products() {
  const [search, setSearch] = useState("");
  const [brand, setBrand] = useState("All");
  const [category, setCategory] = useState("All");
  const [condition, setCondition] = useState("All");
  const [sort, setSort] = useState<SortOption>("newest");
  const [view, setView] = useState<ViewMode>("grid");
  const [priceMax, setPriceMax] = useState(2500);
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    let p = PRODUCTS.filter((product) => {
      if (search && !product.name.toLowerCase().includes(search.toLowerCase()) &&
          !product.brand.toLowerCase().includes(search.toLowerCase())) return false;
      if (brand !== "All" && product.brand !== brand) return false;
      if (category !== "All" && product.category !== category) return false;
      if (condition !== "All" && product.condition !== condition) return false;
      if (product.price > priceMax) return false;
      return true;
    });

    switch (sort) {
      case "price-asc": p = p.sort((a, b) => a.price - b.price); break;
      case "price-desc": p = p.sort((a, b) => b.price - a.price); break;
      case "name-asc": p = p.sort((a, b) => a.name.localeCompare(b.name)); break;
      case "name-desc": p = p.sort((a, b) => b.name.localeCompare(a.name)); break;
      default: break;
    }
    return p;
  }, [search, brand, category, condition, sort, priceMax]);

  const activeFiltersCount = [brand !== "All", category !== "All", condition !== "All", priceMax < 2500].filter(Boolean).length;

  return (
    <div style={{ background: "transparent", minHeight: "100vh" }}>
      {/* Hero */}
      <div
        className="relative pt-32 pb-16 px-4 text-center overflow-hidden"
        style={{ background: "linear-gradient(180deg, rgba(6,182,212,0.07) 0%, transparent 100%)" }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(6,182,212,0.12), transparent 60%)" }}
        />
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold mb-6"
            style={{
              background: "rgba(6,182,212,0.12)", border: "1px solid rgba(6,182,212,0.35)",
              color: "#67e8f9", fontFamily: "Space Grotesk, sans-serif",
            }}
          >
            <Tag className="w-3.5 h-3.5" />
            ALL PRODUCTS
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold text-white mb-4" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
            Shop Our{" "}
            <span className="text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(135deg, #fb923c, #fdba74)" }}>
              Collection
            </span>
          </h1>
          <p className="text-white/50 text-lg max-w-xl mx-auto" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
            {PRODUCTS.length} products — smartphones, tablets, laptops, and accessories at competitive prices.
          </p>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-24">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl text-white text-sm outline-none"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                fontFamily: "Space Grotesk, sans-serif",
              }}
            />
            {search && (
              <button className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white" onClick={() => setSearch("")}>
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* Filter toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold transition-all"
              style={{
                background: showFilters || activeFiltersCount > 0 ? "rgba(124,58,237,0.2)" : "rgba(255,255,255,0.05)",
                border: showFilters || activeFiltersCount > 0 ? "1px solid rgba(249,115,22,0.4)" : "1px solid rgba(255,255,255,0.1)",
                color: activeFiltersCount > 0 ? "#fb923c" : "rgba(255,255,255,0.6)",
                fontFamily: "Space Grotesk, sans-serif",
              }}
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
              {activeFiltersCount > 0 && (
                <span
                  className="w-5 h-5 rounded-full text-xs flex items-center justify-center font-bold"
                  style={{ background: "#f97316" }}
                >
                  {activeFiltersCount}
                </span>
              )}
            </button>

            {/* Sort */}
            <div className="relative">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortOption)}
                className="pl-4 pr-8 py-3 rounded-xl text-sm font-semibold text-white appearance-none outline-none cursor-pointer"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  fontFamily: "Space Grotesk, sans-serif",
                  colorScheme: "dark",
                }}
              >
                <option value="newest">Newest</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name-asc">Name: A–Z</option>
                <option value="name-desc">Name: Z–A</option>
              </select>
            </div>

            {/* View mode */}
            <div
              className="flex rounded-xl overflow-hidden"
              style={{ border: "1px solid rgba(255,255,255,0.1)" }}
            >
              {(["grid", "list"] as ViewMode[]).map((v) => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  className="p-3 transition-all"
                  style={{
                    background: view === v ? "rgba(124,58,237,0.3)" : "rgba(255,255,255,0.03)",
                    color: view === v ? "white" : "rgba(255,255,255,0.4)",
                  }}
                >
                  {v === "grid" ? <Grid className="w-4 h-4" /> : <List className="w-4 h-4" />}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Filters Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div
                className="rounded-2xl p-6 mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
                style={{
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.07)",
                }}
              >
                {/* Brand */}
                <div>
                  <label className="text-white/50 text-xs uppercase tracking-widest mb-2 block" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
                    Brand
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {BRANDS.map((b) => (
                      <button
                        key={b}
                        onClick={() => setBrand(b)}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                        style={{
                          background: brand === b ? "rgba(124,58,237,0.3)" : "rgba(255,255,255,0.05)",
                          border: brand === b ? "1px solid rgba(124,58,237,0.5)" : "1px solid rgba(255,255,255,0.08)",
                          color: brand === b ? "white" : "rgba(255,255,255,0.5)",
                          fontFamily: "Space Grotesk, sans-serif",
                        }}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Category */}
                <div>
                  <label className="text-white/50 text-xs uppercase tracking-widest mb-2 block" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
                    Category
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map((c) => (
                      <button
                        key={c}
                        onClick={() => setCategory(c)}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                        style={{
                          background: category === c ? "rgba(6,182,212,0.25)" : "rgba(255,255,255,0.05)",
                          border: category === c ? "1px solid rgba(6,182,212,0.4)" : "1px solid rgba(255,255,255,0.08)",
                          color: category === c ? "white" : "rgba(255,255,255,0.5)",
                          fontFamily: "Space Grotesk, sans-serif",
                        }}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Condition */}
                <div>
                  <label className="text-white/50 text-xs uppercase tracking-widest mb-2 block" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
                    Condition
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {CONDITIONS.map((c) => (
                      <button
                        key={c}
                        onClick={() => setCondition(c)}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                        style={{
                          background: condition === c ? "rgba(168,85,247,0.25)" : "rgba(255,255,255,0.05)",
                          border: condition === c ? "1px solid rgba(168,85,247,0.4)" : "1px solid rgba(255,255,255,0.08)",
                          color: condition === c ? "white" : "rgba(255,255,255,0.5)",
                          fontFamily: "Space Grotesk, sans-serif",
                        }}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <label className="text-white/50 text-xs uppercase tracking-widest mb-2 block" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
                    Max Price: £{priceMax.toLocaleString()}
                  </label>
                  <input
                    type="range"
                    min={50}
                    max={2500}
                    step={50}
                    value={priceMax}
                    onChange={(e) => setPriceMax(Number(e.target.value))}
                    className="w-full accent-orange-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-white/30 text-xs mt-1" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
                    <span>£50</span><span>£2,500</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results count */}
        <div className="flex items-center justify-between mb-5">
          <p className="text-white/40 text-sm" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
            Showing <span className="text-white font-semibold">{filtered.length}</span> products
          </p>
          {activeFiltersCount > 0 && (
            <button
              onClick={() => { setBrand("All"); setCategory("All"); setCondition("All"); setPriceMax(2500); }}
              className="text-violet-400 hover:text-white text-sm flex items-center gap-1 transition-colors"
              style={{ fontFamily: "Space Grotesk, sans-serif" }}
            >
              <X className="w-3.5 h-3.5" />
              Clear filters
            </button>
          )}
        </div>

        {/* Product Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-white/30 text-lg" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
              No products match your filters.
            </p>
            <button
              onClick={() => { setSearch(""); setBrand("All"); setCategory("All"); setCondition("All"); setPriceMax(2500); }}
              className="mt-4 text-sm transition-colors hover:text-white"
              style={{ fontFamily: "Space Grotesk, sans-serif", color: "#fb923c" }}
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <motion.div
            className={
              view === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
                : "flex flex-col gap-4"
            }
            layout
          >
            <AnimatePresence>
              {filtered.map((product) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <ProductCard product={product} mode={view} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
}