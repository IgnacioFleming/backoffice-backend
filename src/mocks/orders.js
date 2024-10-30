import { fakerES as faker } from "@faker-js/faker";

export const generateMockedOrders = async (quantity = 1) => {
  const orders = [];
  for (let index = 0; index < quantity; index++) {
    orders.push({
      sale_id: faker.number.int({ max: 1000 }),
      quantity: faker.number.int({ max: 100 }),
      amount: faker.number.float({ min: 100, max: 10000, fractionDigits: 2 }),
    });
  }
  return orders;
};
