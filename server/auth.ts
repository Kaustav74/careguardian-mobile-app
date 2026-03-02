import crypto from "node:crypto";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { eq } from "drizzle-orm";
import { db } from "./db";
import { users } from "@shared/schema";

export type SessionUser = { id: number; username: string; role: "user" | "hospital" | "ambulance"; fullName: string };

const scryptAsync = (password: string, salt: string) =>
  new Promise<Buffer>((resolve, reject) => {
    crypto.scrypt(password, salt, 64, (err, key) => (err ? reject(err) : resolve(key)));
  });

export async function hashPassword(password: string) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = (await scryptAsync(password, salt)).toString("hex");
  return `${salt}.${hash}`;
}

export async function verifyPassword(password: string, stored: string) {
  const [salt, hash] = stored.split(".");
  const key = await scryptAsync(password, salt);
  return crypto.timingSafeEqual(Buffer.from(hash, "hex"), key);
}

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const [user] = await db.select().from(users).where(eq(users.username, username));
      if (!user) return done(null, false);
      const valid = await verifyPassword(password, user.passwordHash);
      if (!valid) return done(null, false);
      return done(null, { id: user.id, username: user.username, role: user.role, fullName: user.fullName } as SessionUser);
    } catch (error) {
      return done(error as Error);
    }
  })
);

passport.serializeUser((user, done) => done(null, (user as SessionUser).id));
passport.deserializeUser(async (id: number, done) => {
  try {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    if (!user) return done(null, false);
    return done(null, { id: user.id, username: user.username, role: user.role, fullName: user.fullName } as SessionUser);
  } catch (error) {
    done(error as Error);
  }
});

export default passport;
