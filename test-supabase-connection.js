// Test script to verify Supabase connection
import { createClient } from "@supabase/supabase-js";
// import 'dotenv/config';
import dotenv from "dotenv";
dotenv.config(); // ✅ Load variables from .env file

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

console.log("Testing Supabase Connection...");
console.log("SUPABASE_URL:", supabaseUrl ? "Set" : "Not set");
console.log("SUPABASE_ANON_KEY:", supabaseAnonKey ? "Set" : "Not set");

if (supabaseUrl && supabaseAnonKey) {
  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  try {
    // Test connection by trying to fetch from users table
    const { data, error, count } = await supabase
      .from("users")
      .select("count", { count: "exact" });

    if (error) {
      console.error("Connection failed:", error.message);
    } else {
      console.log("✅ Supabase connection successful!");
      console.log("Total users in database:", count);

      // Test fetching some sample data
      const { data: users, error: usersError } = await supabase
        .from("users")
        .select("id, email, role, name")
        .limit(3);

      if (usersError) {
        console.error("Error fetching users:", usersError.message);
      } else {
        console.log("Sample users:", users);
      }
    }
  } catch (err) {
    console.error("Connection error:", err);
  }
} else {
  console.error("❌ Supabase environment variables not properly configured");
}
