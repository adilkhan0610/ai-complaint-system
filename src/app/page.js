"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

export default function HomePage() {
  const [counts, setCounts] = useState({
    open: 0,
    inProgress: 0,
    resolved: 0,
  });

  useEffect(() => {
    fetchCounts();
  }, []);

  const fetchCounts = async () => {
    const { data, error } = await supabase
      .from("complaints")
      .select("status");

    if (error) {
      console.error("Error fetching complaint counts", error);
      return;
    }

    setCounts({
      open: data.filter((c) => c.status === "OPEN").length,
      inProgress: data.filter((c) => c.status === "IN_PROGRESS").length,
      resolved: data.filter((c) => c.status === "RESOLVED").length,
    });
  };

  return (
    <div className="min-h-screen bg-black text-white page-enter">
      {/* HERO SECTION */}
      <section className="flex flex-col items-center justify-center text-center px-6 py-28">
        <h1 className="text-5xl font-extrabold mb-6 text-cyan-400">
          Smart Complaint Resolution System
        </h1>

        <p className="text-lg max-w-3xl mb-10 text-gray-300">
          A centralized platform to raise, track, and resolve complaints with
          transparency, evidence, and administrative control.
        </p>

        {/* LOGIN BUTTONS */}
        <div className="flex gap-6 mb-14">
          <Link
            href="/login?role=user"
            className="bg-cyan-500 text-black px-8 py-3 rounded-lg font-semibold hover:bg-cyan-600 transition"
          >
            Login as User
          </Link>

          <Link
            href="/login?role=admin"
            className="border border-cyan-400 px-8 py-3 rounded-lg hover:bg-cyan-400 hover:text-black transition"
          >
            Login as Admin
          </Link>
        </div>

        
      </section>

      {/* WHY SECTION */}
      <section className="bg-slate-950 py-24 px-6">
        <h2 className="text-4xl font-bold text-center mb-16 text-cyan-400">
          Why This System?
        </h2>

        <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          <FeatureCard
            title="Transparent Tracking"
            desc="Users can see real-time status updates and full history of complaints."
          />
          <FeatureCard
            title="Evidence-Based Complaints"
            desc="Upload real images to support complaints and improve resolution accuracy."
          />
          <FeatureCard
            title="Admin Control Panel"
            desc="Admins can analyze, prioritize, and resolve complaints efficiently."
          />
          <FeatureCard
            title="Role-Based Access"
            desc="Separate dashboards for users and administrators."
          />
          <FeatureCard
            title="Analytics & Insights"
            desc="Live complaint statistics help in faster decision making."
          />
          <FeatureCard
            title="Scalable Design"
            desc="Can scale from society to campus to city-level systems."
          />
        </div>
      </section>

      {/* FOOTER */}
      <footer className="text-center py-8 text-gray-400 text-sm">
        © 2026 Smart Complaint Resolution System  
        <br />
        Designed to improve transparency and accountability in complaint handling.
      </footer>
    </div>
  );
}

/* ---------------- COMPONENTS ---------------- */

function StatusCard({ title, count, bg }) {
  return (
    <div
      className={`${bg} text-black p-6 rounded-xl shadow-md flex flex-col items-center`}
    >
      <p className="text-lg font-semibold">{title}</p>
      <p className="text-4xl font-extrabold mt-2">{count}</p>
    </div>
  );
}

function FeatureCard({ title, desc }) {
  return (
    <div className="bg-slate-900 p-8 rounded-2xl shadow-lg hover:-translate-y-1 transition">
      <h3 className="text-xl font-semibold mb-3 text-cyan-400">
        {title}
      </h3>
      <p className="text-gray-400">{desc}</p>
    </div>
  );
}
