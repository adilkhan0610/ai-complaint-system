"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function SignupPage() {
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user"); // user | admin
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!firstName || !lastName || !email || !password) {
      alert("Please fill all fields");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
          role: role,
        },
      },
    });

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Signup successful. Please login.");
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center page-enter">
      <div className="bg-slate-900 p-10 rounded-2xl w-[420px] shadow-xl">

        <h2 className="text-2xl font-bold text-center mb-6 text-cyan-400">
          Signup
        </h2>

        <input
          type="text"
          placeholder="First Name"
          className="w-full mb-4 p-3 rounded bg-white text-black"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />

        <input
          type="text"
          placeholder="Last Name"
          className="w-full mb-4 p-3 rounded bg-white text-black"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-4 p-3 rounded bg-white text-black"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          className="w-full mb-2 p-3 rounded bg-white text-black"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <div className="flex items-center gap-2 mb-4 text-gray-300 text-sm">
          <input
            type="checkbox"
            className="w-4 h-4"
            checked={showPassword}
            onChange={() => setShowPassword(!showPassword)}
          />
          <span>Show Password</span>
        </div>

        {/* ROLE SELECTION */}
        <div className="mb-6">
          <p className="text-gray-300 text-sm mb-2">Signup as</p>
          <select
            className="w-full p-3 rounded bg-white text-black"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <button
          onClick={handleSignup}
          disabled={loading}
          className="w-full bg-cyan-500 hover:bg-cyan-600 text-black py-3 rounded-lg font-semibold transition"
        >
          {loading ? "Signing up..." : "Sign Up"}
        </button>

        <p className="text-center text-gray-400 text-sm mt-5">
          Already have an account?{" "}
          <a href="/login" className="text-cyan-400 hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
