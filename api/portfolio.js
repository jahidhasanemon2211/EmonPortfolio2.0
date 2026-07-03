import { createClient } from 'redis';

let client;
async function getRedisClient() {
  if (!client) {
    client = createClient({
      url: process.env.REDIS_URL
    });
    client.on('error', (err) => console.error('Redis Client Error', err));
    await client.connect();
  }
  return client;
}

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const redisUrl = process.env.REDIS_URL;

  // Fallback so the website loads even if Redis isn't configured yet
  if (!redisUrl) {
    if (req.method === 'GET') {
      return res.status(200).json({ data: null, warning: "REDIS_URL not configured" });
    }
    if (req.method === 'POST') {
      const { password } = req.body;
      const expectedPassword = process.env.ADMIN_PASSWORD || "Xpon@Olt9417#";
      if (password !== expectedPassword) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      return res.status(500).json({ error: "Redis database not linked. Please connect a database in Vercel." });
    }
  }

  try {
    const redis = await getRedisClient();

    if (req.method === 'GET') {
      const data = await redis.get("portfolio:data");
      return res.status(200).json({ data: data ? JSON.parse(data) : null });
    }

    if (req.method === 'POST') {
      const { data, password } = req.body;
      const expectedPassword = process.env.ADMIN_PASSWORD || "Xpon@Olt9417#";

      if (password !== expectedPassword) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      await redis.set("portfolio:data", JSON.stringify(data));
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error("API error:", error);
    return res.status(500).json({ error: error.message });
  }
}
