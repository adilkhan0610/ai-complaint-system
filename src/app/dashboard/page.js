"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function Dashboard() {
  const router = useRouter();
  const [complaints, setComplaints] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [expandedId, setExpandedId] = useState(null);
  const [statusDropdown, setStatusDropdown] = useState(null);

  const FILTERS = ["ALL", "OPEN", "IN_PROGRESS", "RESOLVED"];
  const STATUS_OPTIONS = ["OPEN", "IN_PROGRESS", "RESOLVED"];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, error } = await supabase
          .from("complaints")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          console.error("❌ Error fetching complaints:", error);
          return;
        }

        console.log("✅ Fetched complaints from DB:", data);
        setComplaints(data || []);
      } catch (err) {
        console.error("❌ Exception fetching:", err);
      }
    };

    fetchData();
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const filteredComplaints = complaints
    .filter((c) => (filter === "ALL" ? true : c.status === filter))
    .filter((c) =>
      c.title.toLowerCase().includes(search.toLowerCase())
    );

  const stats = {
    total: complaints.length,
    open: complaints.filter((c) => c.status === "OPEN").length,
    progress: complaints.filter((c) => c.status === "IN_PROGRESS").length,
    resolved: complaints.filter((c) => c.status === "RESOLVED").length,
  };

  const STATUS_FLOW = ["OPEN", "IN_PROGRESS", "RESOLVED"];

  const updateStatus = async (id, newStatus) => {
    try {
      console.log("🔄 Starting update for ID:", id, "New Status:", newStatus);

      // Step 1: Update the status
      const { data: updateData, error: updateError, count } = await supabase
        .from("complaints")
        .update({ status: newStatus })
        .eq("id", id);

      if (updateError) {
        console.error("❌ Update failed:", updateError);
        alert("Error updating status: " + updateError.message);
        return;
      }

      console.log("✅ Update successful - records affected:", count);

      // Step 2: Wait a moment then verify by fetching from DB
      await new Promise(resolve => setTimeout(resolve, 300));

      const { data: verifyData, error: verifyError } = await supabase
        .from("complaints")
        .select("*")
        .eq("id", id)
        .single();

      if (verifyError) {
        console.error("❌ Verification failed:", verifyError);
      } else {
        console.log("✅ Verified from DB - new status is:", verifyData.status);
      }

      // Step 3: Update local state with verified data
      setComplaints((prevComplaints) =>
        prevComplaints.map((complaint) =>
          complaint.id === id ? verifyData : complaint
        )
      );

      console.log("✅ Local state updated with DB data");

      setStatusDropdown(null);
      setExpandedId(id);

    } catch (err) {
      console.error("❌ Exception:", err);
      alert("Error: " + err.message);
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    const index = STATUS_FLOW.indexOf(currentStatus);
    const nextStatus = STATUS_FLOW[(index + 1) % STATUS_FLOW.length];

    await supabase
      .from("complaints")
      .update({ status: nextStatus })
      .eq("id", id);

    // Refresh complaints
    supabase
      .from("complaints")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => setComplaints(data || []));
  };

  const statusColor = (status) => {
    if (status === "OPEN") return "text-red-400";
    if (status === "IN_PROGRESS") return "text-blue-400";
    if (status === "RESOLVED") return "text-green-400";
    return "text-gray-400";
  };

  return (
    <div className="min-h-screen bg-[#0b1220] text-blue-100">
      {/* HEADER */}
      <header className="border-b border-blue-900 px-8 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-400">My Complaints</h1>
        <div className="flex gap-4">
          <Link
            href="/complaints/new"
            className="inline-block rounded-md bg-cyan-500 px-4 py-2 text-sm font-semibold text-black hover:bg-cyan-400"
          >
            Raise Complaint
          </Link>
          <button
            onClick={logout}
            className="bg-red-500 hover:bg-red-400 px-4 py-2 rounded-md text-black font-semibold"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="p-10 space-y-8">
        {/* ================= STATS ================= */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="Total" value={stats.total} />
          <StatCard label="Open" value={stats.open} />
          <StatCard label="In Progress" value={stats.progress} />
          <StatCard label="Resolved" value={stats.resolved} />
        </div>

        {/* ================= SEARCH + FILTER ================= */}
        <div className="flex flex-wrap gap-4 items-center">
          <input
            placeholder="Search by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-[#081425] border border-blue-800 px-4 py-2 rounded-md text-blue-100"
          />

          <div className="flex gap-2">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-md font-semibold ${
                  filter === f
                    ? "bg-blue-500 text-black"
                    : "bg-[#081425] text-blue-300"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* ================= CARDS GRID ================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredComplaints.map((c) => (
            <div
              key={c.id}
              onClick={() =>
                setExpandedId(expandedId === c.id ? null : c.id)
              }
              className="cursor-pointer bg-[#0f1a2b] border border-blue-900 rounded-xl p-6
                         transition hover:scale-[1.03] hover:shadow-xl"
            >
              <h3 className="text-lg text-blue-400 font-semibold">
                {c.title}
              </h3>

              <p className="text-sm text-blue-300">
                Category: {c.category}
              </p>

              <p className="text-sm text-blue-300">
                Priority: {c.priority}
              </p>

              <p className={`text-sm font-semibold ${statusColor(c.status)}`}>
                Status: {c.status}
              </p>

              {expandedId === c.id && (
                <div className="mt-4 space-y-4">
                  <p className="text-sm text-blue-200">
                    {c.description}
                  </p>

                  {c.image_url && (
                    <img
                      src={c.image_url}
                      className="rounded-lg max-h-40 w-full object-cover"
                    />
                  )}

                  <div className="relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setStatusDropdown(statusDropdown === c.id ? null : c.id);
                      }}
                      className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-black py-2 rounded-md font-semibold hover:from-blue-400 hover:to-blue-500 transition flex items-center justify-center gap-2"
                    >
                      Change Status
                      <span className={`transition-transform ${statusDropdown === c.id ? "rotate-180" : ""}`}>
                        ▼
                      </span>
                    </button>

                    {statusDropdown === c.id && (
                      <div
                        onClick={(e) => e.stopPropagation()}
                        className="absolute top-full mt-2 w-full bg-[#081425] border-2 border-blue-500 rounded-md shadow-lg z-10"
                      >
                        {STATUS_OPTIONS.map((status) => (
                          <button
                            key={status}
                            onClick={(e) => {
                              e.stopPropagation();
                              updateStatus(c.id, status);
                            }}
                            className={`w-full text-left px-4 py-3 font-semibold transition ${
                              c.status === status
                                ? "bg-blue-600 text-black"
                                : "text-blue-100 hover:bg-blue-700"
                            } ${status === "OPEN" ? "text-red-400 hover:bg-red-900" : status === "IN_PROGRESS" ? "text-blue-400 hover:bg-blue-800" : "text-green-400 hover:bg-green-900"}`}
                          >
                            {status === "OPEN" && "🔴 OPEN"}
                            {status === "IN_PROGRESS" && "🔵 IN PROGRESS"}
                            {status === "RESOLVED" && "🟢 RESOLVED"}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <Link
                    href={`/complaints/${c.id}`}
                    className="block w-full text-center bg-cyan-500 text-black py-2 rounded-md font-semibold hover:bg-cyan-400"
                  >
                    View Details
                  </Link>
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredComplaints.length === 0 && (
          <div className="text-center py-10">
            <p className="text-blue-300">No complaints yet</p>
          </div>
        )}
      </main>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="bg-[#0f1a2b] border border-blue-900 rounded-lg p-4 text-center">
      <p className="text-sm text-blue-300">{label}</p>
      <p className="text-2xl font-bold text-blue-400">{value}</p>
    </div>
  );
}
