import { supabase } from "@/integrations/supabase/client";

const PRODUCTS = [
  { product_name: "Sony WH-1000XM5 Headphones", category: "Electronics", price: 399.00 },
  { product_name: "Nike Air Zoom Pegasus 40", category: "Footwear", price: 130.00 },
  { product_name: "Instant Pot Duo 7-in-1", category: "Home", price: 89.99 },
  { product_name: "Apple AirTag (4-pack)", category: "Electronics", price: 99.00 },
  { product_name: "Levi's 501 Original Jeans", category: "Apparel", price: 69.50 },
  { product_name: "Kindle Paperwhite 16GB", category: "Electronics", price: 149.99 },
];

export async function seedDemoOrders(userId: string) {
  const { count } = await supabase.from("orders").select("*", { count: "exact", head: true }).eq("user_id", userId);
  if ((count ?? 0) > 0) return;
  const rows = PRODUCTS.map((p, i) => ({
    user_id: userId,
    order_number: `ORD-${1000 + i}`,
    ...p,
    status: i === 0 ? "delivered" : i === 1 ? "delivered" : "delivered",
    ordered_at: new Date(Date.now() - i * 86400000 * 4).toISOString(),
  }));
  await supabase.from("orders").insert(rows);
}
