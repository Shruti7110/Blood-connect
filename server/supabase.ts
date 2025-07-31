import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("❌ Missing Supabase URL or Anon Key in environment variables.");
  throw new Error("Supabase configuration is incomplete");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Test connection on startup
(async () => {
  try {
    const { data, error, count } = await supabase
      .from("users")
      .select("count", { count: "exact" });

    if (error) {
      console.error("❌ Supabase connection failed:", error.message);
    } else {
      console.log("✅ Supabase connected successfully!");
      console.log("Total users in database:", count);
    }
  } catch (err) {
    console.error("❌ Supabase connection error:", err);
  }
})();