CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  main TEXT NOT NULL CHECK (main IN ('大麥克', '勁辣雞腿堡', '麥克雞塊', '麥香魚')),
  drink TEXT NOT NULL CHECK (drink IN ('可樂', '無糖綠茶')),
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS orders_created_at_idx ON orders(created_at);
