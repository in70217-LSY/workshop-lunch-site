const MAINS = new Set(["大麥克", "勁辣雞腿堡", "麥克雞塊", "麥香魚"]);
const DRINKS = new Set(["可樂", "無糖綠茶"]);

export async function onRequestPost({ request, env }) {
  try {
    const body = await request.json();
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const main = body.main;
    const drink = body.drink;
    if (!name || [...name].length > 30 || !MAINS.has(main) || !DRINKS.has(drink)) {
      return Response.json({ error: "請填寫姓名並選擇一份主餐和一種飲料。" }, { status: 400 });
    }
    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();
    await env.DB.prepare(
      "INSERT INTO orders (id, name, main, drink, created_at) VALUES (?, ?, ?, ?, ?)"
    ).bind(id, name, main, drink, createdAt).run();
    return Response.json({ id, name, main, drink, createdAt }, { status: 201 });
  } catch {
    return Response.json({ error: "目前無法儲存訂單，請稍後再試。" }, { status: 500 });
  }
}
