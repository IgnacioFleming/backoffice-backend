import request from "supertest";
import app, { server } from "../../../src/app.js";
import config from "../../../src/config/config.js";
import { products } from "./products.mock.js";
import mysql from "mysql2/promise";
import { ERRORS } from "../../../src/utils/errors/errorTypes.js";
import { connectionOptions } from "../../../src/config/dbconfig-mysql.js";

describe("products", () => {
  const agent = request.agent(app);
  const rootPath = "/api/products";
  const pool = mysql.createPool(connectionOptions);
  beforeAll(async () => {
    await agent.post("/api/sessions/login").send({ username: config.admin_keys.admin_username, password: config.admin_keys.admin_pwd });
    await pool.query("SET FOREIGN_KEY_CHECKS = 0;");
    await pool.query("TRUNCATE TABLE costumers;");
    await pool.query(" SET FOREIGN_KEY_CHECKS = 1;");
    for (let product of products) {
      await agent.post(rootPath).send(product);
    }
  });

  describe("getProducts", () => {
    beforeAll(async () => {
      await pool.query("SET FOREIGN_KEY_CHECKS = 0;");
      await pool.query("TRUNCATE TABLE products;");
      await pool.query(" SET FOREIGN_KEY_CHECKS = 1;");
      products.forEach(async (product) => await agent.post(rootPath).send(product));
    });

    test("should respond with statusCode 200", async () => {
      const res = await agent.get(rootPath);
      expect(res.statusCode).toBe(200);
    });

    test("should respond with a json body", async () => {
      const res = await agent.get(rootPath);
      expect(res.headers["content-type"]).toMatch(/application\/json/);
    });

    test("should respond a payload property that has an array", async () => {
      const res = await agent.get(rootPath);
      expect(res.body).toHaveProperty("payload");
      expect(res.body.payload).toEqual(expect.any(Array));
    });
  });

  describe("getProductById", () => {
    test("should respond with statusCode 200 and an Object in payload property", async () => {
      const id = 1;
      const res = await agent.get(`${rootPath}/${id}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.payload).toEqual(expect.any(Object));
    });
    test("should respond with an object with the same id that was sent on request", async () => {
      const id = 1;
      const res = await agent.get(`${rootPath}/${id}`);
      expect(res.body.payload.id).toBe(id);
    });
    test("should throw a Not Found error if the product does not exist", async () => {
      const id = 3;
      const res = await agent.get(`${rootPath}/${id}`);
      expect(res.statusCode).toBe(404);
      expect(res.body.name).toEqual(ERRORS.NOT_FOUND.name);
    });
  });

  describe("createProduct", () => {
    const product = {
      name: "create test product",
      price: 200,
      cost: 100,
      stock: 10,
      category: "test category",
      description: "test description",
    };
    test("should respond with status 200 and have a payload property with an id", async () => {
      const res = await agent.post(rootPath).send(product);
      expect(res.statusCode).toBe(200);
      expect(res.body.payload).toHaveProperty("insertId");
    });
    test("should throw an error if there is a missing property and respond with status 400", async () => {
      const productWithoutProperty = { ...product, name: "create test product 2" };
      delete productWithoutProperty.price;
      const res = await agent.post(rootPath).send(productWithoutProperty);
      expect(res.statusCode).toBe(400);
      expect(res.body.name).toBe(ERRORS.INVALID_BODY.name);
    });
  });
  describe("updateProduct", () => {
    const id = 1;
    const updateProduct = { ...products[0], name: "updated name" };
    test("should respond with status 200 and have a payload property with an id", async () => {
      const res = await agent.put(`${rootPath}/${id}`).send(updateProduct);
      expect(res.statusCode).toBe(200);
      expect(res.body.payload.affectedRows).toBe(1);
      const updatedProduct = await agent.get(`${rootPath}/${id}`);
      expect(updatedProduct.body.payload.name).toEqual(updateProduct.name);
    });
    test("should throw an error if there is a missing property and respond with status 400", async () => {
      const updateBody = { name: "update name" };
      const res = await agent.put(`${rootPath}/${id}`).send(updateBody);
      expect(res.statusCode).toBe(400);
      expect(res.body.name).toBe(ERRORS.INVALID_BODY.name);
    });
    test("should throw a not found error if id does not exists", async () => {
      const productsQuantity = await pool.query("SELECT COUNT(id) FROM products;");
      const res = await agent.put(`${rootPath}/${productsQuantity + 1}`).send(updateProduct);
      expect(res.statusCode).toBe(404);
      expect(res.body.name).toBe(ERRORS.NOT_FOUND.name);
    });
  });

  describe("deleteProduct", () => {
    test("should delete product with status 200 and add a deleted_at value", async () => {
      const id = 1;
      const res = await agent.delete(`${rootPath}/${id}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.payload.affectedRows).toBe(1);
      const [[{ deleted_at }]] = await pool.execute("SELECT deleted_at FROM products WHERE id = ?", [id]);
      expect(deleted_at).toBeDefined();
    });

    test("should throw a not_found error and status 400 if id does not match any existing product", async () => {
      const id = 100;
      const res = await agent.delete(`${rootPath}/${id}`);
      expect(res.statusCode).toBe(404);
      expect(res.body.name).toBe(ERRORS.NOT_FOUND.name);
    });
  });

  afterAll(async () => {
    await new Promise((resolve, reject) => {
      server.close((err) => {
        if (err) return reject();
        resolve();
      });
    });
    pool.end();
  });
});
