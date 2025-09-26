import express from "express";
import path from "path";
import dotenv from "dotenv";
import fetch from "node-fetch";
import { fileURLToPath } from "url";
import { createMailbox } from "./src/mailcow.js";

dotenv.config();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
app.use(express.json());

// health
app.get("/api/health", (_req, res) => res.json({ ok: true }));

// register -> create mailbox via Mailcow API and return a token/key
app.post("/api/register", async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ ok: false, error: "email and password required" });
    const [localPart, domain] = String(email).split("@");
    if (!localPart || !domain) return res.status(400).json({ ok: false, error: "invalid email" });

    const result = await createMailbox({
      url: process.env.MAILCOW_URL,
      apiKey: process.env.MAILCOW_API_KEY,
      localPart, domain, password
    });

    // demo token — replace with your real token logic
    const token = Buffer.from(`${email}:${Date.now()}`).toString("base64");
    res.json({ ok: true, api_key: token, result });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

// login -> validate credentials (demo) and return key
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ ok: false, error: "email and password required" });

  // TODO: verify via IMAP/Dovecot or your directory. For now, accept and mint a token.
  const token = Buffer.from(`${email}:${Date.now()}`).toString("base64");
  res.json({ ok: true, api_key: token });
});

// (optional) serve static in dev if you prefer single process
app.use("/", express.static(path.join(__dirname, "../web/public")));

const PORT = process.env.PORT || process.env.PORTAL_AUTH_PORT || 8080;
app.listen(PORT, () => console.log(`Auth API on 0.0.0.0:${PORT}`));
