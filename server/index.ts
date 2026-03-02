import express from "express";
import session from "express-session";
import connectPg from "connect-pg-simple";
import passport from "./auth";
import apiRouter from "./routes";
import { createServer as createViteServer } from "vite";

const app = express();
app.use(express.json());

const PgSession = connectPg(session);
app.use(
  session({
    store: new PgSession({
      conString: process.env.DATABASE_URL,
      tableName: "session"
    }),
    secret: process.env.SESSION_SECRET || "careguardian-dev-session",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 7 }
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/api", apiRouter);

const start = async () => {
  if (process.env.NODE_ENV === "development") {
    const vite = await createViteServer({
      root: "client",
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static("dist/public"));
    app.get("*", (_req, res) => res.sendFile("index.html", { root: "dist/public" }));
  }

  const port = 5000;
  app.listen(port, () => console.log(`CareGuardian server running on http://localhost:${port}`));
};

start();
