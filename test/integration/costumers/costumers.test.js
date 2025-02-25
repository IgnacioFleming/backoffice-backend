import request from "supertest";
import app, { server } from "../../../src/app.js";
import config from "../../../src/config/config.js";
import { connectionOptions } from "../../../src/config/dbconfig-mysql.js";
import { costumers } from "./costumers.mock.js";
import mysql from "mysql2/promise";
import { ERRORS } from "../../../src/utils/errors/errorTypes.js";

describe("costumers", () => {
  const agent = request.agent(app);
  const rootPath = "/api/costumers";
  const pool = mysql.createPool(connectionOptions);
  beforeAll(async () => {
    await agent.post("/api/sessions/login").send({ username: config.admin_keys.admin_username, password: config.admin_keys.admin_pwd });
    await pool.query("SET FOREIGN_KEY_CHECKS = 0;");
    await pool.query("TRUNCATE TABLE costumers;");
    await pool.query(" SET FOREIGN_KEY_CHECKS = 1;");
    for (let costumer of costumers) {
      const res = await agent.post(rootPath).send(costumer);
    }
  });

  describe("getCostumers", () => {
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

  describe("createCostumer", () => {
    const costumer = {
      name: "create test costumer 1",
      account_number: 10,
    };
    test("should respond with status 200 and have a payload property with an id", async () => {
      const res = await agent.post(rootPath).send(costumer);
      expect(res.statusCode).toBe(200);
      expect(res.body.payload).toHaveProperty("insertId");
    });
    test("should throw an error if there is a missing property and respond with status 400", async () => {
      const costumerWithoutProperty = { name: "create test product 2" };
      const res = await agent.post(rootPath).send(costumerWithoutProperty);
      expect(res.statusCode).toBe(400);
      expect(res.body.name).toBe(ERRORS.INVALID_BODY.name);
    });
  });
  describe("updateCostumer", () => {
    const id = 1;
    test("should respond with status 200 and have changed the property name", async () => {
      const updateCostumer = { ...costumers[0], name: "updated name" };
      const res = await agent.put(`${rootPath}/${id}`).send(updateCostumer);
      expect(res.statusCode).toBe(200);
      expect(res.body.payload.name).toEqual(updateCostumer.name);
    });

    test("should throw a not found error if id does not exists", async () => {
      const updateCostumer = { ...costumers[0], name: "updated name 2" };
      const costumersQuantity = await pool.query("SELECT COUNT(id) FROM costumers;");
      const res = await agent.put(`${rootPath}/${costumersQuantity + 1}`).send(updateCostumer);
      expect(res.statusCode).toBe(404);
      expect(res.body.name).toBe(ERRORS.NOT_FOUND.name);
    });
  });

  describe("deleteCostumer", () => {
    test("should delete product with status 200 and add a deleted_at value", async () => {
      const id = 1;
      const res = await agent.delete(`${rootPath}/${id}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.payload.affectedRows).toBe(1);
      const [[{ deleted_at }]] = await pool.execute("SELECT deleted_at FROM costumers WHERE id = ?", [id]);
      expect(deleted_at).toBeDefined();
    });

    test("should throw a not_found error and status 400 if id does not match any existing costumer", async () => {
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
    await pool.end();
  });
});
