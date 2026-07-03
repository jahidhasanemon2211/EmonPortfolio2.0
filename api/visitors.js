// api/visitors.js
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

  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;

  if (!url || !token) {
    return res.status(200).json({ success: true, warning: "KV not configured" });
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
        ["SADD", "visitor:total:all", sessionId],
        ["SETEX", `visitor:online:${sessionId}`, "60", "1"]
      ])
    });

    if (!response.ok) {
      throw new Error(`KV pipeline failed: ${response.statusText}`);
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Visitors heartbeat error:", error);
    return res.status(500).json({ error: error.message });
  }
}
