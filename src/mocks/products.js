import { fakerES as faker } from "@faker-js/faker";

export const generateMockedProducts = async (quantity = 1) => {
  const products = [];
  for (let index = 0; index < quantity; index++) {
    products.push({
      name: faker.commerce.product(),
      price: parseFloat(faker.commerce.price()),
      stock: faker.number.int({ max: 100 }),
      category: faker.commerce.department(),
      description: faker.commerce.productDescription(),
      thumbnail: faker.image.url(),
    });
  }
  return products;
};
