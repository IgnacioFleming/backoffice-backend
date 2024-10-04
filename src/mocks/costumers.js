import { fakerES as faker } from "@faker-js/faker";

export const generateMockedCostumers = async (quantity = 1) => {
  const costumers = [];
  for (let index = 0; index < quantity; index++) {
    costumers.push({
      name: faker.company.name(),
      account_number: faker.number.int({ min: 10000, max: 100000 }),

      logo: faker.image.url(),
    });
  }
  return costumers;
};
