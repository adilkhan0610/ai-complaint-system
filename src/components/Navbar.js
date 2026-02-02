"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

const ADMIN_EMAIL = "adminweb@gmail.com";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data?.user || null);
    });
  }, []);

  const getHomeLink = () => {
    if (!user) return "/";
    if (user.email === ADMIN_EMAIL) return "/admin";
    return "/dashboard";
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.push("/");
  };

  return (
    <nav className="bg-black border-b border-slate-800 px-6 py-4 flex justify-between items-center">
      {/* LOGO */}
      <Link href={getHomeLink()}>
        <span className="text-xl font-bold text-cyan-400 cursor-pointer">
          ComplaintAI
        </span>
      </Link>

      {/* NAV LINKS */}
      <div className="flex gap-6 items-center text-gray-300">
        {user && user.email !== ADMIN_EMAIL && (
          <>
            <Link href="/dashboard" className="hover:text-cyan-400">
              Dashboard
            </Link>
            <Link href="/complaints/new" className="hover:text-cyan-400">
              Raise Complaint
            </Link>
          </>
        )}

        {user && user.email === ADMIN_EMAIL && (
          <Link href="/admin" className="hover:text-cyan-400">
            Admin
          </Link>
        )}

        {!user && pathname !== "/dashboard" && pathname !== "/" && pathname !== "/login" && pathname !== "/signup" && (
          <Link href="/login" className="hover:text-cyan-400">
            Login
          </Link>
        )}

        {user && (
          <button
            onClick={handleLogout}
            className="ml-2 inline-flex items-center gap-2 rounded-md bg-gradient-to-r from-cyan-400 to-blue-500 px-3 py-1 text-sm font-semibold text-white shadow-lg transform transition duration-200 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-cyan-300"
            aria-label="Logout"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8v8" className="hidden" />
            </svg>
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}
