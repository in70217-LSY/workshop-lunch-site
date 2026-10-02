export async function onRequestGet({ env }) {
  try {
    const [total, mains, drinks] = await Promise.all([
      env.DB.prepare("SELECT COUNT(*) AS count FROM orders").first(),
      env.DB.prepare("SELECT main AS item, COUNT(*) AS count FROM orders GROUP BY main").all(),
      env.DB.prepare("SELECT drink AS item, COUNT(*) AS count FROM orders GROUP BY drink").all(),
    ]);
    return Response.json({
      total: total.count,
      mains: Object.fromEntries(mains.results.map(row => [row.item, row.count])),
      drinks: Object.fromEntries(drinks.results.map(row => [row.item, row.count])),
    }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return Response.json({ error: "目前無法載入統計。" }, { status: 503 });
  }
}
