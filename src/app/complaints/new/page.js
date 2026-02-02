"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function RaiseComplaint() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("General");
  const [priority, setPriority] = useState("Low");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const submitComplaint = async () => {
    // basic validation
    if (!title?.trim() || !description?.trim()) {
      alert('Please provide title and description');
      return;
    }

    setLoading(true);

    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user || null;
    // log auth state for debugging
    console.log('Auth user:', user);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      console.log('Auth session:', sessionData?.session || null);
    } catch (e) {
      console.warn('Could not get session:', e);
    }

    let imageUrl = null;

    if (image) {
      const fileName = `${Date.now()}-${image.name}`;
      const { error: uploadError } = await supabase.storage
        .from("complaint-images")
        .upload(fileName, image);

      if (uploadError) {
        console.error('Image upload error', uploadError);
        alert('Failed to upload image: ' + (uploadError.message || uploadError));
        setLoading(false);
        return;
      }

      imageUrl = supabase.storage
        .from("complaint-images")
        .getPublicUrl(fileName).data.publicUrl;
    }

    // Build payload conditionally to avoid inserting unknown columns
    const payload = {
      title,
      description,
      category,
      priority,
      status: "OPEN",
      user_id: user?.id || null,
      user_email: user?.email || null,
    };

    if (imageUrl) payload.image_url = imageUrl;

    try {
      const res = await supabase.from("complaints").insert(payload).select('*');
      setLoading(false);
      console.log('Insert response:', res);
      const { data, error } = res;
      if (error) {
        console.error('Insert error full:', error, 'user:', user, 'payload:', payload);
        alert('Failed to create complaint: ' + (error.message || JSON.stringify(error)));
        return;
      }

      if (!data || (Array.isArray(data) && data.length === 0)) {
        console.warn('Insert succeeded but no data returned', res);
      }

      alert('Complaint raised successfully');
      router.push('/dashboard');
    } catch (err) {
      setLoading(false);
      console.error('Exception during insert:', err, 'user:', user, 'payload:', payload);
      alert('An unexpected error occurred while creating the complaint. Check console for details.');
    }
  };

  return (
    <div className="min-h-screen bg-[#0b1220] text-blue-100 flex justify-center items-center p-6">
      <div className="w-full max-w-xl bg-[#0f1a2b] p-8 rounded-xl shadow-lg border border-blue-900">
        <h1 className="text-2xl font-semibold text-blue-400 mb-6 text-center">
          Raise Complaint
        </h1>

        {/* Title */}
        <input
          className="w-full mb-4 p-3 rounded-md bg-[#081425] 
                     border border-blue-800 text-blue-100
                     placeholder-blue-400
                     focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Complaint Title"
          onChange={(e) => setTitle(e.target.value)}
        />

        {/* Description */}
        <textarea
          className="w-full mb-4 p-3 rounded-md bg-[#081425] 
                     border border-blue-800 text-blue-100
                     placeholder-blue-400
                     focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Describe your complaint"
          rows={4}
          onChange={(e) => setDescription(e.target.value)}
        />

        {/* Category */}
        <select
          className="w-full mb-4 p-3 rounded-md bg-[#081425] 
                     border border-blue-800 text-blue-100
                     focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) => setCategory(e.target.value)}
        >
          <option>General</option>
          <option>Water</option>
          <option>Electricity</option>
          <option>Road</option>
          <option>Sanitation</option>
          <option>Internet</option>
        </select>

        {/* Priority */}
        <select
          className="w-full mb-4 p-3 rounded-md bg-[#081425] 
                     border border-blue-800 text-blue-100
                     focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) => setPriority(e.target.value)}
        >
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>

        {/* Image */}
        <input
          type="file"
          className="w-full mb-6 text-blue-300 file:bg-blue-600
                     file:text-black file:px-4 file:py-2
                     file:rounded-md file:border-none
                     hover:file:bg-blue-500"
          onChange={(e) => setImage(e.target.files[0])}
        />

        {/* Submit Button */}
        <button
          onClick={submitComplaint}
          disabled={loading}
          className="w-full bg-blue-500 hover:bg-blue-400
                     text-black font-semibold
                     px-6 py-3 rounded-md
                     transition duration-200"
        >
          {loading ? "Submitting..." : "Submit Complaint"}
        </button>
      </div>
    </div>
  );
}