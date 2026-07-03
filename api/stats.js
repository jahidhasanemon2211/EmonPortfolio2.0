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

  const password = req.query.password;
  const expectedPassword = process.env.ADMIN_PASSWORD || "Xpon@Olt9417#";

  if (password !== expectedPassword) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const redisUrl = process.env.REDIS_URL;
  if (!redisUrl) {
    return res.status(200).json({
      totalVisitors: 0,
      onlineVisitors: 0,
      warning: "REDIS_URL not configured"
    });
  }

  try {
    const redis = await getRedisClient();

    const [totalVisitors, onlineKeys] = await Promise.all([
      redis.sCard("visitor:total:all"),
      redis.keys("visitor:online:*")
    ]);

    const onlineVisitors = onlineKeys.length;

    return res.status(200).json({
      totalVisitors,
      onlineVisitors
    });
  } catch (error) {
    console.error("Stats API error:", error);
    return res.status(500).json({ error: error.message });
  }
}
