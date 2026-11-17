import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { SplashScreen } from "@/components/screens/SplashScreen";
import { OnboardingScreen } from "@/components/screens/OnboardingScreen";
import { HomeScreen } from "@/components/screens/HomeScreen";
import { ProductsScreen } from "@/components/screens/ProductsScreen";
import { BookingsScreen } from "@/components/screens/BookingsScreen";
import { ProfileScreen } from "@/components/screens/ProfileScreen";
import { ProductDetailView } from "@/components/ProductDetailView";
import { Header } from "@/components/Header";
import { BottomNav, type NavTab } from "@/components/BottomNav";
import { CartSheet } from "@/components/CartSheet";
import { SupportModal } from "@/components/SupportModal";
import { DealerProfileModal } from "@/components/DealerProfileModal";
import { SearchModal } from "@/components/SearchModal";
import type { CartItem, Product } from "@/types";
import { PRODUCTS } from "@/data/mockData";

export function AppLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  // 1. Bi-Directional Route & History Synchronization:
  // When inside the iframe, update outer browser's address bar
  useEffect(() => {
    if (typeof window !== "undefined" && window.self !== window.top) {
      try {
        const fullPath = location.pathname + location.search;
        if (
          window.top &&
          window.top.location.pathname + window.top.location.search !== fullPath
        ) {
          window.top.history.replaceState(null, "", fullPath);
        }
      } catch {
        // Cross-origin safety guard
      }
    }
  }, [location.pathname, location.search]);

  // Handle incoming popstate events from parent window Back/Forward
  useEffect(() => {
    const handlePopState = () => {
      const currentPath = window.location.pathname + window.location.search;
      const reactPath = location.pathname + location.search;
      if (currentPath !== reactPath) {
        navigate(currentPath, { replace: true });
      }
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [location, navigate]);

  // Splash & Onboarding Stage (Always starts on splash when loaded or refreshed)
  const [stage, setStage] = useState<"splash" | "onboarding" | "app">("splash");

  // Determine active tab & selected product based on URL path
  const currentPath = location.pathname;

  let activeTab: NavTab = "Home";
  if (currentPath.startsWith("/products")) {
    activeTab = "Products";
  } else if (currentPath.startsWith("/bookings") || currentPath.startsWith("/orders")) {
    activeTab = "Bookings";
  } else if (currentPath.startsWith("/profile") || currentPath.startsWith("/support")) {
    activeTab = "Profile";
  }

  // Check if viewing a specific product (e.g. /product/rvc180ctd)
  const productMatch = currentPath.match(/^\/product\/([^/]+)/);
  const selectedProduct = productMatch
    ? PRODUCTS.find(
        (p) =>
          p.sku.toLowerCase() === productMatch[1].toLowerCase() ||
          p.id.toLowerCase() === productMatch[1].toLowerCase()
      ) || null
    : null;

  // Category filter passed from Home
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Cart state persisted with localStorage
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("accele_cart");
        if (saved) return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return [{ product: PRODUCTS[0], quantity: 1 }];
  });

  useEffect(() => {
    try {
      localStorage.setItem("accele_cart", JSON.stringify(cartItems));
    } catch {
      // storage quota / privacy
    }
  }, [cartItems]);

  // Modals state
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Cart operations
  const handleAddToCart = (product: Product) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.product.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveFromCart = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== id));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const handleCategorySelectFromHome = (categoryId: string) => {
    setSelectedCategory(categoryId);
    navigate("/products");
  };

  const handleTabChange = (tab: NavTab) => {
    switch (tab) {
      case "Home":
        navigate("/");
        break;
      case "Products":
        navigate("/products");
        break;
      case "Bookings":
        navigate("/bookings");
        break;
      case "Profile":
        navigate("/profile");
        break;
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="relative min-h-screen w-full bg-slate-50 text-slate-900 flex flex-col justify-between overflow-x-hidden selection:bg-[#f52538] selection:text-white font-sans">
      {/* 1. Splash Screen Mode */}
      {stage === "splash" && (
        <SplashScreen
          onComplete={() => setStage("onboarding")}
          soundEnabled={soundEnabled}
        />
      )}

      {/* 2. Onboarding Carousel Mode */}
      {stage === "onboarding" && (
        <OnboardingScreen
          onComplete={() => setStage("app")}
          soundEnabled={soundEnabled}
        />
      )}

      {/* 3. Main Native App Content */}
      {stage === "app" && (
        <div className="relative flex flex-col flex-1 min-h-full bg-slate-50 text-slate-900 animate-in fade-in duration-300">
          {/* Product Detail Overlay Route */}
          {selectedProduct ? (
            <ProductDetailView
              product={selectedProduct}
              onBack={() => navigate(-1)}
              onAddToCart={handleAddToCart}
              soundEnabled={soundEnabled}
              onOpenSupport={() => setIsSupportModalOpen(true)}
            />
          ) : (
            <>
              {/* Top Header (Shown on Home, Products, and Bookings; Profile has its own dedicated header matching design) */}
              {activeTab !== "Profile" && (
                <Header
                  cartCount={totalCartCount}
                  onOpenCart={() => setIsCartOpen(true)}
                  onOpenProfile={() => navigate("/profile")}
                  onOpenSearch={() => setIsSearchModalOpen(true)}
                />
              )}

              {/* View Router */}
              <main className="flex-1 bg-slate-50">
                {activeTab === "Home" && (
                  <HomeScreen
                    onOpenProduct={(prod) => navigate(`/product/${prod.sku}`)}
                    onSelectCategory={handleCategorySelectFromHome}
                    onOpenSupport={() => setIsSupportModalOpen(true)}
                    soundEnabled={soundEnabled}
                  />
                )}

                {activeTab === "Products" && (
                  <ProductsScreen
                    initialCategory={selectedCategory}
                    onOpenProduct={(prod) => navigate(`/product/${prod.sku}`)}
                    onAddToCart={handleAddToCart}
                    soundEnabled={soundEnabled}
                  />
                )}

                {activeTab === "Bookings" && (
                  <BookingsScreen
                    onOpenProduct={(prod) => navigate(`/product/${prod.sku}`)}
                    onAddToCart={handleAddToCart}
                    soundEnabled={soundEnabled}
                  />
                )}

                {activeTab === "Profile" && (
                  <ProfileScreen
                    onBack={() => navigate("/")}
                    onOpenCart={() => setIsCartOpen(true)}
                    cartCount={totalCartCount}
                    onOpenLiveChat={() => setIsSupportModalOpen(true)}
                    onOpenOrders={() => navigate("/bookings")}
                    soundEnabled={soundEnabled}
                    onToggleSound={() => setSoundEnabled(!soundEnabled)}
                    onSignOut={() => setIsProfileOpen(true)}
                  />
                )}
              </main>

              {/* Bottom Tab Bar */}
              <BottomNav active={activeTab} setActive={handleTabChange} activeOrderCount={2} />
            </>
          )}

          {/* Cart Sheet Modal */}
          <CartSheet
            isOpen={isCartOpen}
            onClose={() => setIsCartOpen(false)}
            items={cartItems}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveFromCart}
            onClearCart={handleClearCart}
            soundEnabled={soundEnabled}
          />

          {/* Bay Support Modal */}
          <SupportModal
            isOpen={isSupportModalOpen}
            onClose={() => setIsSupportModalOpen(false)}
            soundEnabled={soundEnabled}
          />

          {/* Dealer Profile Modal */}
          <DealerProfileModal
            isOpen={isProfileOpen}
            onClose={() => setIsProfileOpen(false)}
          />

          {/* Catalog Search Modal */}
          <SearchModal
            isOpen={isSearchModalOpen}
            onClose={() => setIsSearchModalOpen(false)}
            onSelectProduct={(prod) => navigate(`/product/${prod.sku}`)}
          />
        </div>
      )}
    </div>
  );
}
