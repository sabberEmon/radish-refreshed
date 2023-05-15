import NextAuth from "next-auth";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import EmailProvider from "next-auth/providers/email";
import MongoClientPromise from "../../../lib/mongodb";
import axios from "axios";
import { createTransport } from "nodemailer";

const ONE_DAY = 1 * 24 * 60 * 60;
const THIRTY_MINUTES = 30 * 60;

export default NextAuth({
  pages: {
    signIn: "/login",
    verifyRequest: "/verify-request",
  },
  secret: process.env.JWT_SECRET,
  session: {
    strategy: "jwt",
    maxAge: ONE_DAY,
    updateAge: THIRTY_MINUTES,
  },
  adapter: MongoDBAdapter(MongoClientPromise),
  providers: [
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: process.env.EMAIL_SERVER_PORT,
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
      sendVerificationRequest: async ({
        identifier: email,
        url,
        provider: { server, from },
      }) => {
        const response = await axios.get(
          `${process.env.API_BASE_URL}/api/admin/auth/whitelist`
        );

        const admins = response.data.admins.map((admin) => admin.email);

        const { host } = new URL(url);
        // Place your whitelisted emails below
        if (!admins.includes(email)) {
          throw new Error("Email not authorized to login");
        }
        const transport = createTransport(server);
        const result = await transport.sendMail({
          to: email,
          from: from,
          subject: `Login to ${host}`,
          text: text({ url, host }),
          html: html({ url, host, email }),
        });
        const failed = result.rejected.concat(result.pending).filter(Boolean);
        if (failed.length) {
          throw new Error(`Email(s) (${failed.join(", ")}) could not be sent`);
        }
      },
    }),
  ],
});

function html({ url, host, email }) {
  const escapedEmail = `${email.replace(/\./g, "&#8203;.")}`;
  const escapedHost = `${host.replace(/\./g, "&#8203;.")}`;
  //  email template here
  return `
      <body>
        <h1>Your magic link! 🪄</h1>
        <p>
          <a href="${url}">Login to ${escapedHost}</a>
      </body>
  `;
}

// Fallback for non-HTML email clients
function text({ url, host }) {
  return `Login to ${host}\n${url}\n\n`;
}
