import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/mongodb";
import Admin from "@/models/Admin";
import Employee from "@/models/Employee";
import { authConfig } from "./auth.config";

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        type: { label: "Type", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.log("Authorize: Missing email or password");
          return null;
        }

        try {
          console.log(`Authorize attempt: email=${credentials.email}, type=${credentials.type}`);
          await dbConnect();
          console.log("Authorize: Database connected");

          let user = null;
          const type = credentials.type as string;

          if (type === 'admin') {
            user = await Admin.findOne({ email: credentials.email });
            console.log(`Authorize: Admin found? ${!!user}`);
            if (user && await bcrypt.compare(credentials.password as string, user.passwordHash)) {
              console.log("Authorize: Admin login successful");
              return {
                id: user._id.toString(),
                name: user.name,
                email: user.email,
                role: user.role,
              };
            }
          } else {
            user = await Employee.findOne({ email: credentials.email });
            console.log(`Authorize: Employee found? ${!!user}`);
            if (user && await bcrypt.compare(credentials.password as string, user.passwordHash)) {
              console.log("Authorize: Employee login successful");
              return {
                id: user._id.toString(),
                name: `${user.firstName} ${user.lastName}`,
                email: user.email,
                role: 'Employee',
              };
            }
          }

          console.log("Authorize: Invalid credentials or user not found");
          return null;
        } catch (error) {
          console.error("Authorize error:", error);
          return null;
        }
      },
    }),
  ],
});
