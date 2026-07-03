// api/portfolio.js
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

  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;

  // Fallback so the website loads even if KV isn't configured yet
  if (!url || !token) {
    if (req.method === 'GET') {
      return res.status(200).json({ data: null, warning: "KV not configured" });
    }
    if (req.method === 'POST') {
      const { password } = req.body;
      const expectedPassword = process.env.ADMIN_PASSWORD || "Xpon@Olt9417#";
      if (password !== expectedPassword) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      return res.status(500).json({ error: "KV database not linked. Please connect a KV database in Vercel." });
    }
  }

  const runKvCommand = async (command) => {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(command)
    });
    if (!response.ok) {
      throw new Error(`KV command failed: ${response.statusText}`);
    }
    const result = await response.json();
    return result.result;
  };

  try {
    if (req.method === 'GET') {
      const data = await runKvCommand(["GET", "portfolio:data"]);
      return res.status(200).json({ data: data ? JSON.parse(data) : null });
    }

    if (req.method === 'POST') {
      const { data, password } = req.body;
      const expectedPassword = process.env.ADMIN_PASSWORD || "Xpon@Olt9417#";

      if (password !== expectedPassword) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      await runKvCommand(["SET", "portfolio:data", JSON.stringify(data)]);
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error("API error:", error);
    return res.status(500).json({ error: error.message });
  }
}
