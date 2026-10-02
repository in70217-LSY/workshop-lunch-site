async function validToken(candidate, expected) {
  if (!candidate || !expected) return false;
  const encoder = new TextEncoder();
  const [a, b] = await Promise.all([
    crypto.subtle.digest("SHA-256", encoder.encode(candidate)),
    crypto.subtle.digest("SHA-256", encoder.encode(expected)),
  ]);
  const left = new Uint8Array(a);
  const right = new Uint8Array(b);
  let difference = 0;
  for (let i = 0; i < left.length; i++) difference |= left[i] ^ right[i];
  return difference === 0;
}

export async function onRequestGet({ request, env }) {
  const authorization = request.headers.get("Authorization") || "";
  const match = authorization.match(/^Bearer\s+(.+)$/i);
  if (!await validToken(match?.[1], env.ADMIN_TOKEN)) {
    return Response.json({ error: "管理者驗證失敗。" }, { status: 401, headers: { "Cache-Control": "no-store" } });
  }
  try {
    const { results } = await env.DB.prepare(
      "SELECT id, name, main, drink, created_at FROM orders ORDER BY created_at DESC"
    ).all();
    return Response.json({ orders: results }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return Response.json({ error: "目前無法載入管理資料。" }, { status: 503 });
  }
}
