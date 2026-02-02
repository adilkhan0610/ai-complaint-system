"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

const STATUS_FLOW = ["OPEN", "IN_PROGRESS", "RESOLVED"];
const FILTERS = ["ALL", "OPEN", "IN_PROGRESS", "RESOLVED"];

export default function AdminDashboard() {
  const router = useRouter();

  const [complaints, setComplaints] = useState([]);
  const [expandedId, setExpandedId] = useState(null);

  // 🆕 SAFE STATES
  const [filter, setFilter] = useState("ALL");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchComplaints();
  }, []);

  /* ================= EXISTING FUNCTIONS (UNCHANGED) ================= */

  const fetchComplaints = async () => {
    const { data: userData } = await supabase.auth.getUser();

    if (userData?.user?.user_metadata?.role !== "admin") {
      router.push("/");
      return;
    }

    const { data } = await supabase
      .from("complaints")
      .select("*")
      .order("created_at", { ascending: false });

    setComplaints(data || []);
  };

  const logout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  const updateStatus = async (id, status) => {
    try {
      console.log("🔄 Starting update for ID:", id, "New Status:", status);

      // Step 1: Update the status
      const { data: updateData, error: updateError, count } = await supabase
        .from("complaints")
        .update({ status })
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

      setExpandedId(id);

    } catch (err) {
      console.error("❌ Exception:", err);
      alert("Error: " + err.message);
    }
  };

  /* ================= NEW FUNCTION (ADDED) ================= */

  const toggleStatus = async (id, currentStatus) => {
    const index = STATUS_FLOW.indexOf(currentStatus);
    const nextStatus =
      STATUS_FLOW[(index + 1) % STATUS_FLOW.length];

    await supabase
      .from("complaints")
      .update({ status: nextStatus })
      .eq("id", id);

    fetchComplaints();
  };

  /* ================= DERIVED DATA (SAFE) ================= */

  const filteredComplaints = useMemo(() => {
    return complaints
      .filter((c) =>
        filter === "ALL" ? true : c.status === filter
      )
      .filter((c) =>
        c.title.toLowerCase().includes(search.toLowerCase())
      );
  }, [complaints, filter, search]);

  const stats = useMemo(() => {
    return {
      total: complaints.length,
      open: complaints.filter((c) => c.status === "OPEN").length,
      progress: complaints.filter(
        (c) => c.status === "IN_PROGRESS"
      ).length,
      resolved: complaints.filter(
        (c) => c.status === "RESOLVED"
      ).length,
    };
  }, [complaints]);

  const statusColor = (status) => {
    if (status === "OPEN") return "text-red-400";
    if (status === "IN_PROGRESS") return "text-blue-400";
    if (status === "RESOLVED") return "text-green-400";
    return "text-gray-400";
  };

  return (
    <div className="min-h-screen bg-[#0b1220] text-blue-100">
      {/* HEADER */}
      <header className="border-b border-blue-900 px-8 py-4 flex justify-between">
        <h1 className="text-xl font-bold text-blue-400">
          Admin Dashboard
        </h1>
        <button
          onClick={logout}
          className="bg-red-500 hover:bg-red-400 px-4 py-2 rounded-md text-black font-semibold"
        >
          Logout
        </button>
      </header>

      <main className="p-10 space-y-8">
        {/* ================= STATS ================= */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="Total" value={stats.total} />
          <StatCard label="Open" value={stats.open} />
          <StatCard label="In Progress" value={stats.progress} />
          <StatCard label="Resolved" value={stats.resolved} />
        </div>

        {/* ================= FILTER + SEARCH ================= */}
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

                  {/* 🟢 FIXED BUTTONS (STOP PROPAGATION) */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleStatus(c.id, c.status);
                    }}
                    className="w-full bg-blue-500 text-black py-2 rounded-md font-semibold"
                  >
                    Toggle Status →
                  </button>

                  <div className="flex gap-2">
                    <StatusBtn
                      label="OPEN"
                      color="bg-red-400"
                      onClick={(e) => {
                        e.stopPropagation();
                        updateStatus(c.id, "OPEN");
                      }}
                    />
                    <StatusBtn
                      label="IN_PROGRESS"
                      color="bg-blue-400"
                      onClick={(e) => {
                        e.stopPropagation();
                        updateStatus(c.id, "IN_PROGRESS");
                      }}
                    />
                    <StatusBtn
                      label="RESOLVED"
                      color="bg-green-400"
                      onClick={(e) => {
                        e.stopPropagation();
                        updateStatus(c.id, "RESOLVED");
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

/* ================= EXISTING COMPONENT ================= */

function StatusBtn({ label, color, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`${color} text-black px-3 py-2 rounded-md font-semibold`}
    >
      {label}
    </button>
  );
}

/* ================= NEW COMPONENT ================= */

function StatCard({ label, value }) {
  return (
    <div className="bg-[#0f1a2b] border border-blue-900 rounded-lg p-4 text-center">
      <p className="text-sm text-blue-300">{label}</p>
      <p className="text-2xl font-bold text-blue-400">{value}</p>
    </div>
  );
}