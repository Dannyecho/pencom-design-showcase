"use client";

import { Link } from "@/lib/router";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Settings } from "lucide-react";

type ConsentState = "undecided" | "accepted" | "declined";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [showManage, setShowManage] = useState(false);
  const [, setConsent] = useState<ConsentState>("undecided");
  const [preferences, setPreferences] = useState({
    necessary: true,
    analytics: false,
    personalization: false,
    advertising: false,
  });

  useEffect(() => {
    // Check if user already made a choice
    const saved = localStorage.getItem("pencom-cookie-consent");
    if (!saved) {
      // Show after a short delay
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    }
    setConsent(saved as ConsentState);
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem("pencom-cookie-consent", "accepted");
    setConsent("accepted");
    setVisible(false);
    setShowManage(false);
  };

  const handleDeclineAll = () => {
    localStorage.setItem("pencom-cookie-consent", "declined");
    setConsent("declined");
    setVisible(false);
    setShowManage(false);
  };

  const handleSavePreferences = () => {
    localStorage.setItem("pencom-cookie-consent", "accepted");
    localStorage.setItem("pencom-cookie-preferences", JSON.stringify(preferences));
    setConsent("accepted");
    setVisible(false);
    setShowManage(false);
  };

  const handleClose = () => {
    // Closing without a choice just hides it for the session
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="fixed bottom-0 left-0 right-0 z-[100]"
        >
          <div className="bg-white border-t border-gray-200 shadow-[0_-4px_24px_rgba(0,0,0,0.12)]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5">
              {!showManage ? (
                <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6">
                  {/* Text content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-bold text-[#117F21]">
                        Cookies
                      </h3>
                      <button
                        onClick={handleClose}
                        className="md:hidden p-1 hover:bg-gray-100 rounded-full transition-colors"
                        aria-label="Close cookie consent"
                      >
                        <X className="w-5 h-5 text-gray-400" />
                      </button>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      At PenCom we use cookies to ensure that our website works
                      properly. We can also use cookies to improve and
                      personalise your experience, understand how you use our
                      website and for our advertising purposes. You can agree to
                      all cookies by clicking on{' '}
                      <span className="font-semibold">'Accept All'</span>, you
                      can also choose which cookies you want to agree by
                      selecting{' '}
                      <span className="font-semibold">'Manage cookies'</span>{' '}
                      or you can choose to{' '}
                      <span className="font-semibold">'Decline all'</span>{' '}
                      cookies.
                    </p>
                    <p className="text-sm mt-2">
                      <Link
                        to="/regulations#policies"
                        className="text-[#117F21] font-medium hover:underline"
                      >
                        See our Privacy & Cookie Policy
                      </Link>
                    </p>
                  </div>

                  {/* Buttons */}
                  <div className="flex flex-col gap-2 shrink-0 w-full md:w-auto">
                    {/* Close button - desktop only */}
                    <button
                      onClick={handleClose}
                      className="hidden md:block self-end p-1 hover:bg-gray-100 rounded-full transition-colors mb-1"
                      aria-label="Close cookie consent"
                    >
                      <X className="w-5 h-5 text-gray-400" />
                    </button>

                    <button
                      onClick={handleAcceptAll}
                      className="w-full md:w-44 px-6 py-2.5 bg-[#14892A] text-white text-sm font-semibold rounded hover:bg-[#105D1D] transition-colors"
                    >
                      ACCEPT ALL
                    </button>
                    <button
                      onClick={handleDeclineAll}
                      className="w-full md:w-44 px-6 py-2.5 border-2 border-[#14892A] text-[#117F21] text-sm font-semibold rounded hover:bg-[#E8F5E9] transition-colors"
                    >
                      DECLINE ALL
                    </button>
                    <button
                      onClick={() => setShowManage(true)}
                      className="w-full md:w-44 flex items-center justify-center gap-2 px-6 py-2 text-gray-500 text-sm font-medium rounded hover:bg-gray-100 transition-colors"
                    >
                      <Settings className="w-4 h-4" />
                      MANAGE COOKIES
                    </button>
                  </div>
                </div>
              ) : (
                /* Manage Cookies Panel */
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-[#117F21]">
                      Manage Cookies
                    </h3>
                    <button
                      onClick={() => setShowManage(false)}
                      className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <X className="w-5 h-5 text-gray-400" />
                    </button>
                  </div>

                  <div className="space-y-3 mb-6">
                    {/* Necessary - always on */}
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-sm text-gray-900">
                          Necessary
                        </p>
                        <p className="text-xs text-gray-500">
                          Required for the website to function
                        </p>
                      </div>
                      <div className="w-11 h-6 bg-[#14892A] rounded-full relative">
                        <div className="absolute right-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow" />
                      </div>
                    </div>

                    {/* Analytics */}
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-sm text-gray-900">
                          Analytics
                        </p>
                        <p className="text-xs text-gray-500">
                          Help us understand how you use our website
                        </p>
                      </div>
                      <button
                        onClick={() =>
                          setPreferences((p) => ({
                            ...p,
                            analytics: !p.analytics,
                          }))
                        }
                        className={`w-11 h-6 rounded-full relative transition-colors ${
                          preferences.analytics
                            ? "bg-[#14892A]"
                            : "bg-gray-300"
                        }`}
                      >
                        <div
                          className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                            preferences.analytics
                              ? "right-0.5"
                              : "left-0.5"
                          }`}
                        />
                      </button>
                    </div>

                    {/* Personalization */}
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-sm text-gray-900">
                          Personalisation
                        </p>
                        <p className="text-xs text-gray-500">
                          Allow us to personalise your experience
                        </p>
                      </div>
                      <button
                        onClick={() =>
                          setPreferences((p) => ({
                            ...p,
                            personalization: !p.personalization,
                          }))
                        }
                        className={`w-11 h-6 rounded-full relative transition-colors ${
                          preferences.personalization
                            ? "bg-[#14892A]"
                            : "bg-gray-300"
                        }`}
                      >
                        <div
                          className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                            preferences.personalization
                              ? "right-0.5"
                              : "left-0.5"
                          }`}
                        />
                      </button>
                    </div>

                    {/* Advertising */}
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-sm text-gray-900">
                          Advertising
                        </p>
                        <p className="text-xs text-gray-500">
                          Used to deliver relevant advertisements
                        </p>
                      </div>
                      <button
                        onClick={() =>
                          setPreferences((p) => ({
                            ...p,
                            advertising: !p.advertising,
                          }))
                        }
                        className={`w-11 h-6 rounded-full relative transition-colors ${
                          preferences.advertising
                            ? "bg-[#14892A]"
                            : "bg-gray-300"
                        }`}
                      >
                        <div
                          className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                            preferences.advertising
                              ? "right-0.5"
                              : "left-0.5"
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={handleSavePreferences}
                      className="px-6 py-2.5 bg-[#14892A] text-white text-sm font-semibold rounded hover:bg-[#105D1D] transition-colors"
                    >
                      Save Preferences
                    </button>
                    <button
                      onClick={handleAcceptAll}
                      className="px-6 py-2.5 border-2 border-[#14892A] text-[#117F21] text-sm font-semibold rounded hover:bg-[#E8F5E9] transition-colors"
                    >
                      Accept All
                    </button>
                    <button
                      onClick={handleDeclineAll}
                      className="px-6 py-2.5 text-gray-500 text-sm font-medium rounded hover:bg-gray-100 transition-colors"
                    >
                      Decline All
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
