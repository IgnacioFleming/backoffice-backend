export const recalculateSaleCostAndItemsHelper = async (connection, sale_id) => {
  const [[{ total_cost, total_quantity }]] = await connection.execute("SELECT sum(order_cost) as total_cost, sum(quantity) as total_quantity FROM orders WHERE sale_id = ?", [sale_id]);
  const [result] = await connection.execute("UPDATE sales SET sale_cost = ?,items_quantity = ? WHERE id = ?", [total_cost, total_quantity, sale_id]);
  return result;
};
