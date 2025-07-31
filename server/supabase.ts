// import { createClient } from '@supabase/supabase-js';

// const supabaseUrl = process.env.SUPABASE_URL!;
// const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!;

// export const supabase = createClient(supabaseUrl, supabaseAnonKey);
// Test script to verify Supabase connection
import { createClient } from "@supabase/supabase-js";
// import 'dotenv/config';
import dotenv from "dotenv";
dotenv.config(); // ✅ Load variables from .env file

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// import dotenv from "dotenv";
// dotenv.config(); // ✅ Load variables from .env file

// // import { createClient } from "@supabase/supabase-js";

// const supabaseUrl = process.env.SUPABASE_URL;
// const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

// if (!supabaseUrl || !supabaseAnonKey) {
//   console.error(
//     "❌ Missing Supabase URL or Anon Key in environment variables.",
//   );
//   process.exit(1);
// }

// const supabase = createClient(supabaseUrl, supabaseAnonKey);

// // Test connection
// (async () => {
//   const { data, error } = await supabase
//     .from("your_table_name")
//     .select("*")
//     .limit(1);
//   if (error) {
//     console.error("❌ Supabase error:", error);
//   } else {
//     console.log("✅ Supabase connected successfully. Sample data:", data);
//   }
// })();
