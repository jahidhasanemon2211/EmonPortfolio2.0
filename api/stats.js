// api/stats.js
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

  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;

  if (!url || !token) {
    return res.status(200).json({
      totalVisitors: 0,
      onlineVisitors: 0,
      warning: "KV not configured"
    });
  }

  try {
    const pipelineUrl = `${url}/pipeline`;
    const response = await fetch(pipelineUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify([
        ["SCARD", "visitor:total:all"],
        ["KEYS", "visitor:online:*"]
      ])
    });

    if (!response.ok) {
      throw new Error(`KV pipeline failed: ${response.statusText}`);
    }

    const results = await response.json();
    const totalVisitors = results[0]?.result || 0;
    const onlineKeys = results[1]?.result || [];
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
