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
        if (!credentials?.email || !credentials?.password) return null;

        await dbConnect();

        let user = null;
        const type = credentials.type as string;

        if (type === 'admin') {
          user = await Admin.findOne({ email: credentials.email });
          if (user && await bcrypt.compare(credentials.password as string, user.passwordHash)) {
            return {
              id: user._id.toString(),
              name: user.name,
              email: user.email,
              role: user.role,
            };
          }
        } else {
          user = await Employee.findOne({ email: credentials.email });
          if (user && await bcrypt.compare(credentials.password as string, user.passwordHash)) {
            return {
              id: user._id.toString(),
              name: `${user.firstName} ${user.lastName}`,
              email: user.email,
              role: 'Employee',
            };
          }
        }

        return null;
      },
    }),
  ],
});
