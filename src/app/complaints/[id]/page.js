"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function ComplaintDetail() {
  const { id } = useParams();
  const [complaint, setComplaint] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComplaint();
  }, [id]);

  const fetchComplaint = async () => {
    const { data } = await supabase
      .from("complaints")
      .select("*")
      .eq("id", id)
      .single();

    const { data: historyData } = await supabase
      .from("complaint_status_history")
      .select("*")
      .eq("complaint_id", id)
      .order("changed_at");

    setComplaint(data);
    setHistory(historyData || []);
    setLoading(false);
  };

  if (loading) {
    return <p className="p-10 text-white">Loading...</p>;
  }

  if (!complaint) {
    return <p className="p-10 text-white">Complaint not found</p>;
  }

  return (
    <div className="page-enter min-h-screen bg-black p-10 text-white">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-cyan-400 mb-4">
            {complaint.title}
          </h1>

          <p className="text-gray-300 mb-4">
            {complaint.description}
          </p>

          {complaint.image_url && (
            <img
              src={complaint.image_url}
              alt="Complaint"
              className="rounded-xl mb-6 max-h-96 object-cover"
            />
          )}

          <div className="mb-6">
            <span className="inline-block px-4 py-1 rounded-full bg-cyan-500 text-black">
              {complaint.status}
            </span>
          </div>

          {/* 🔥 STATUS HISTORY TIMELINE */}
          <h2 className="text-xl font-semibold text-cyan-400 mb-4">
            Status History
          </h2>

          {history.length === 0 ? (
            <p className="text-gray-400">No status updates yet</p>
          ) : (
            <div className="border-l-2 border-cyan-500 pl-6">
              {history.map((h) => (
                <div key={h.id} className="mb-4">
                  <p className="text-cyan-400 font-medium">
                    {h.status}
                  </p>
                  <p className="text-gray-500 text-sm">
                    {new Date(h.changed_at).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
  );
}
