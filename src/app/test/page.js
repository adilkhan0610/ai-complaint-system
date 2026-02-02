"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function TestPage() {
  const [data, setData] = useState([]);

  useEffect(() => {
    supabase
      .from("complaints")
      .select("*")
      .then((res) => {
        console.log("TEST FETCH:", res);
        setData(res.data || []);
      });
  }, []);

  return (
    <pre className="text-white p-6">
      {JSON.stringify(data, null, 2)}
    </pre>
  );
}
