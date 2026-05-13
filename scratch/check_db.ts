import dbConnect from "../src/lib/mongodb";
import Admin from "../src/models/Admin";
import Employee from "../src/models/Employee";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

async function check() {
  try {
    await dbConnect();
    console.log("Connected to MongoDB");
    
    const admins = await Admin.find({});
    console.log(`Found ${admins.length} admins`);
    admins.forEach(a => console.log(`- ${a.email} (${a.role})`));
    
    const employees = await Employee.find({});
    console.log(`Found ${employees.length} employees`);
    employees.forEach(e => console.log(`- ${e.email}`));
    
    process.exit(0);
  } catch (err) {
    console.error("Error:", err);
    process.exit(1);
  }
}

check();
