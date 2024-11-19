import { costumerSchema } from "../../src/schemas/costumer.js";
import { productSchema } from "../../src/schemas/product.js";
import controllerHandlers from "../../src/utils/controllerHandlers.js";
import { destroyFile } from "../../src/utils/utils.js";
import CustomError from "../../src/utils/errors/customError.js";
import { ERRORS } from "../../src/utils/errors/errorTypes.js";

jest.mock("../../src/utils/utils.js", () => ({
  destroyFile: jest.fn(),
}));

const mockReq = { body: {} };

describe("validateBody", () => {
  const mockBody = {
    name: "Tool",
    price: 100,
    cost: 10,
    stock: 50,
    category: "tools",
    description: "description",
    thumbnail: "http://tool.jpg",
    thumbnail_public_id: "ABC123",
  };
  test("should validate the body correctly and not throwing an error", async () => {
    const result = await controllerHandlers.validateBody(mockBody, productSchema);

    expect(result).toEqual({
      validatedBody: { id: 1, ...mockBody },
    });
    expect(destroyFile).not.toHaveBeenCalled();
    expect(result).not.toMatchObject(new Error());
  });
  test("should throw an INVALID_BODY error and call destroy file", async () => {
    await expect(controllerHandlers.validateBody(mockBody, costumerSchema)).rejects.toBeInstanceOf(CustomError);
    await expect(controllerHandlers.validateBody(mockBody, costumerSchema)).rejects.toMatchObject({ name: ERRORS.INVALID_BODY.name });
    expect(destroyFile).toHaveBeenCalledWith("ABC123");
    expect(destroyFile).toHaveBeenCalledTimes(2);
  });
  test("should throw an UNHANDLED Error and call destroy file", async () => {
    await expect(controllerHandlers.validateBody(mockBody)).rejects.toBeInstanceOf(CustomError);
    await expect(controllerHandlers.validateBody(mockBody)).rejects.toMatchObject({ name: ERRORS.UNHANDLED.name });
    expect(destroyFile).toHaveBeenCalledWith("ABC123");
    expect(destroyFile).toHaveBeenCalledTimes(4);
  });
});

describe("costumersBodyHandler", () => {
  const successMockReq = {
    body: {
      name: "Costumer",
      account_number: 1,
      logo: "http://tool.jpg",
      logo_public_id: "ABC123",
    },
  };
  const expectedBody = {
    name: expect.any(String),
    account_number: expect.any(Number),
    logo: expect.any(String),
    logo_public_id: expect.any(String),
  };
  test("normalize req.body", () => {
    expect(controllerHandlers.costumersBodyHandler(successMockReq)).toMatchObject(expectedBody);
  });

  test("empty req.body must not match and must be null", () => {
    expect(controllerHandlers.costumersBodyHandler(mockReq)).not.toEqual(expectedBody);
    expect(controllerHandlers.costumersBodyHandler(mockReq)).toBeNull();
  });
});

describe("productsBodyHandler", () => {
  const successMockReq = {
    body: {
      name: "Tool",
      price: 100,
      cost: 10,
      stock: 50,
      category: "tools",
      description: "description",
      thumbnail: "tool.jpg",
      thumbnail_public_id: "ABC123",
    },
  };
  const expectedBody = {
    name: expect.any(String),
    price: expect.any(Number),
    cost: expect.any(Number),
    stock: expect.any(Number),
    category: expect.any(String),
    description: expect.any(String),
    thumbnail: expect.any(String),
    thumbnail_public_id: expect.any(String),
  };
  test("normalize req.body", () => {
    expect(controllerHandlers.productsBodyHandler(successMockReq)).toMatchObject(expectedBody);
  });

  test("empty req.body must not match and must be null", () => {
    expect(controllerHandlers.productsBodyHandler(mockReq)).not.toEqual(expectedBody);
    expect(controllerHandlers.productsBodyHandler(mockReq)).toBeNull();
  });
});

describe("paymentsBodyHandler", () => {
  const successMockReq = {
    body: {
      costumer_id: 1,
      payment_amount: 1.5,
    },
  };
  const expectedBody = {
    costumer_id: expect.any(Number),
    payment_amount: expect.any(Number),
  };
  test("normalize req.body", () => {
    expect(controllerHandlers.paymentsBodyHandler(successMockReq)).toMatchObject(expectedBody);
  });

  test("empty req.body must not match and must be null", () => {
    expect(controllerHandlers.paymentsBodyHandler(mockReq)).not.toEqual(expectedBody);
    expect(controllerHandlers.paymentsBodyHandler(mockReq)).toBeNull();
  });
});

describe("salesBodyHandler", () => {
  const successMockReq = {
    body: {
      costumer_id: 1,
      items_quantity: 15,
      total_amount: 100.1,
      sale_cost: 50.5,
      products: [
        {
          product_id: 1,
          quanity: 15,
          amount: 100.1,
        },
      ],
    },
  };
  const expectedBody = {
    costumer_id: expect.any(Number),
    items_quantity: expect.any(Number),
    total_amount: expect.any(Number),
    sale_cost: expect.any(Number),
    products: expect.any(Array),
  };
  test("normalize req.body", () => {
    expect(controllerHandlers.salesBodyHandler(successMockReq)).toMatchObject(expectedBody);
  });

  test("empty req.body must not match and must be null", () => {
    expect(controllerHandlers.salesBodyHandler(mockReq)).not.toEqual(expectedBody);
    expect(controllerHandlers.salesBodyHandler(mockReq)).toBeNull();
  });
});
