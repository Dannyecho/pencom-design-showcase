"use client";

import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "@/lib/router";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu, X, ChevronDown, Shield, Search,
  Building2, ClipboardList, Users, BookOpen, Scale, Mail,
  Home, ArrowRightLeft, UserCircle, TrendingUp, FileCheck,
  UserPlus, Heart, Download, Calculator, Landmark,
  Phone, HelpCircle
} from "lucide-react";
import { navItems } from "@/lib/data";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import ReportGovBadge from "@/components/ReportGovBadge";
import NoticesBell from "@/components/NoticesBell";

const iconMap: Record<string, React.ReactNode> = {
  Home: <Home className="w-4 h-4" />,
  Building2: <Building2 className="w-4 h-4" />,
  ClipboardList: <ClipboardList className="w-4 h-4" />,
  Users: <Users className="w-4 h-4" />,
  BookOpen: <BookOpen className="w-4 h-4" />,
  Scale: <Scale className="w-4 h-4" />,
  Mail: <Mail className="w-4 h-4" />,
  ArrowRightLeft: <ArrowRightLeft className="w-4 h-4" />,
  UserCircle: <UserCircle className="w-4 h-4" />,
  TrendingUp: <TrendingUp className="w-4 h-4" />,
  FileCheck: <FileCheck className="w-4 h-4" />,
  UserPlus: <UserPlus className="w-4 h-4" />,
  Heart: <Heart className="w-4 h-4" />,
  Download: <Download className="w-4 h-4" />,
  Calculator: <Calculator className="w-4 h-4" />,
  Landmark: <Landmark className="w-4 h-4" />,
  Phone: <Phone className="w-4 h-4" />,
  HelpCircle: <HelpCircle className="w-4 h-4" />,
  Search: <Search className="w-4 h-4" />,
};

/** Menu link: router link inside this app, plain link for pages outside it (the v2 site at ./v2/). */
function NavLink({ to, plain, ...rest }: { to: string; plain?: boolean } & React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  return plain ? <a href={to} {...rest} /> : <Link to={to} {...rest} />;
}

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeMega, setActiveMega] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const megaRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setActiveMega(null);
  }, [location.pathname]);

  const hasMega = (label: string) => {
    const item = navItems.find((n) => n.label === label);
    return item?.megaMenu?.columns && item.megaMenu.columns.length > 0;
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Top bar */}
      <div className="bg-[#0A4A13] text-white text-xs">
        <div className="max-w-7xl mx-auto px-4 py-1.5 flex justify-between items-center">
          <div className="flex gap-4 whitespace-nowrap">
            <span className="opacity-80">Federal Republic of Nigeria</span>
            <span className="hidden opacity-50 sm:inline">|</span>
            <Link to="/connect#zonal-offices" className="hidden opacity-80 hover:opacity-100 transition-opacity sm:inline">
              Zonal Offices
            </Link>
          </div>
          <div className="flex gap-4 items-center">
            <span className="hidden md:inline-flex"><ReportGovBadge compact /></span>
            <Link to="/connect#contact" className="opacity-80 hover:opacity-100 transition-opacity flex items-center gap-1 whitespace-nowrap">
              <Phone className="w-3 h-3" aria-hidden="true" /> <span className="hidden sm:inline">09-4611300</span><span className="sr-only sm:hidden">09-4611300</span>
            </Link>
            <LanguageSwitcher />
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="opacity-80 hover:opacity-100 transition-opacity"
              aria-label="Search"
            >
              <Search className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <nav
        className={`transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-md shadow-md"
            : "bg-white"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 shrink-0" aria-label="PenCom Home">
              <img
                src="/pencom-logo.png"
                alt="PenCom Logo"
                className="h-11 w-auto object-contain"
                onError={(e) => {
                  // Fallback to icon if image fails
                  const target = e.currentTarget;
                  target.style.display = 'none';
                  const fallback = target.nextElementSibling as HTMLElement;
                  if (fallback) fallback.style.display = 'flex';
                }}
              />
              <div
                className="hidden w-10 h-10 rounded-lg bg-gradient-to-br from-[#117F21] to-[#0A4A13] items-center justify-center"
                style={{ display: 'none' }}
              >
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div className="hidden sm:block">
                <div className="text-sm font-bold text-[#565455] leading-tight">PenCom</div>
                <div className="text-[10px] text-gray-500 leading-tight">National Pension Commission</div>
              </div>
            </Link>

            {/* Desktop nav */}
            <div className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => hasMega(item.label) && setActiveMega(item.label)}
                  onMouseLeave={() => setActiveMega(null)}
                >
                  <Link
                    to={item.href}
                    className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      location.pathname === item.href || (item.href !== "/" && location.pathname.startsWith(`${item.href}/`)) || (item as { match?: string[] }).match?.includes(location.pathname)
                        ? "text-[#117F21] bg-[#E8F5E9]"
                        : "text-gray-700 hover:text-[#117F21] hover:bg-[#F5F5F5]"
                    }`}
                  >
                    {item.label}
                    {hasMega(item.label) && (
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform ${activeMega === item.label ? "rotate-180" : ""}`} />
                    )}
                  </Link>

                  {/* Mega Menu */}
                  <AnimatePresence>
                    {activeMega === item.label && item.megaMenu && (
                      <motion.div
                        ref={megaRef}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.2 }}
                        className={`absolute top-full pt-2 ${item.megaMenu.columns.length === 1 ? "left-0" : "left-1/2 -translate-x-1/2"}`}
                      >
                        <div className={`bg-white rounded-xl shadow-xl border border-gray-100 ${item.megaMenu.columns.length === 1 ? "p-3 w-[22rem]" : "p-6 min-w-[640px]"}`}>
                          <div className="grid gap-6" style={{ gridTemplateColumns: `repeat(${item.megaMenu.columns.length}, minmax(0, 1fr))` }}>
                            {item.megaMenu.columns.map((col) => (
                              <div key={col.title}>
                                <h4 className="text-xs font-semibold text-[#117F21] uppercase tracking-wider mb-3">
                                  {col.title}
                                </h4>
                                <ul className="space-y-1.5">
                                  {col.links.map((link) => (
                                    <li key={link.label}>
                                      <NavLink
                                        to={link.href}
                                        plain={(link as { plain?: boolean }).plain}
                                        aria-current={location.pathname === link.href ? "page" : undefined}
                                        className={`text-sm rounded-md px-2 py-1.5 block transition-colors ${
                                          location.pathname === link.href ? "bg-[#E8F5E9] text-[#117F21]" : "text-gray-600 hover:text-[#117F21] hover:bg-[#F5F5F5]"
                                        }`}
                                      >
                                        <span className={(link as { note?: string }).note ? "font-semibold" : undefined}>{link.label}</span>
                                        {(link as { note?: string }).note && (
                                          <span className="mt-0.5 block text-xs font-normal leading-snug text-gray-500">{(link as { note?: string }).note}</span>
                                        )}
                                      </NavLink>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-2">
              <NoticesBell />
              <Link
                to="/services"
                className="hidden md:inline-flex items-center gap-2 px-4 py-2 bg-[#117F21] text-white text-sm font-semibold rounded-lg hover:bg-[#0A4A13] transition-colors"
              >
                <Shield className="w-4 h-4" />
                e-Services
              </Link>
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100"
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Search overlay */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white border-b shadow-lg"
          >
            <div className="max-w-7xl mx-auto px-4 py-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search pension services, forms, FAQs..."
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-[#117F21] focus:ring-2 focus:ring-[#117F21]/20 outline-none text-base"
                  autoFocus
                />
                <button
                  onClick={() => setSearchOpen(false)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-t shadow-xl max-h-[80vh] overflow-y-auto"
          >
            <div className="px-4 py-4 space-y-1">
              {navItems.map((item) => (
                <div key={item.label}>
                  <Link
                    to={item.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      location.pathname === item.href || (item.href !== "/" && location.pathname.startsWith(`${item.href}/`)) || (item as { match?: string[] }).match?.includes(location.pathname)
                        ? "text-[#117F21] bg-[#E8F5E9]"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {iconMap[item.icon] || <Shield className="w-4 h-4" />}
                    {item.label}
                  </Link>
                  {item.megaMenu && (
                    <div className="ml-8 mt-1 space-y-1">
                      {item.megaMenu.columns.map((col) =>
                        col.links.slice(0, item.megaMenu!.columns.length === 1 ? undefined : 3).map((link) => (
                          <NavLink
                            key={link.label}
                            to={link.href}
                            plain={(link as { plain?: boolean }).plain}
                            aria-current={location.pathname === link.href ? "page" : undefined}
                            className={`block px-3 py-2 text-sm rounded-md ${location.pathname === link.href ? "font-semibold text-[#117F21]" : "text-gray-500 hover:text-[#117F21]"}`}
                          >
                            {link.label}
                          </NavLink>
                        ))
                      )}
                    </div>
                  )}
                </div>
              ))}
              <div className="pt-4 border-t mt-4">
                <Link
                  to="/services"
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-[#117F21] text-white font-semibold rounded-lg"
                >
                  <Shield className="w-5 h-5" />
                  Access e-Services
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
