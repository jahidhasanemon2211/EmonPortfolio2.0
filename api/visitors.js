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

  if (req.method !== 'POST') {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { sessionId } = req.body;
  if (!sessionId) {
    return res.status(400).json({ error: "sessionId is required" });
  }

  const redisUrl = process.env.REDIS_URL;
  if (!redisUrl) {
    return res.status(200).json({ success: true, warning: "REDIS_URL not configured" });
  }

  try {
    const redis = await getRedisClient();

    // Perform updates in parallel
    await Promise.all([
      redis.sAdd("visitor:total:all", sessionId),
      redis.set(`visitor:online:${sessionId}`, "1", { EX: 60 })
    ]);

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Visitors heartbeat error:", error);
    return res.status(500).json({ error: error.message });
  }
}
