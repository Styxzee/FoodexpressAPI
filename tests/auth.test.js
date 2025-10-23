import request from "supertest";
import app from "../src/app.js";
import User from "../src/db/models/user.js";
import Restaurant from "../src/db/models/restaurant.js";
import Menu from "../src/db/models/menu.js";
import bcrypt from "bcrypt";
import mongoose from "mongoose";

describe("Auth", () => {
  beforeAll(async () => {
    // Nettoyer la base
    await User.deleteMany({});
    await Restaurant.deleteMany({});
    await Menu.deleteMany({});

    // Création d’un utilisateur
    const hashPass = await bcrypt.hash("userpass", 10);
    await User.create({
      email: "authuser@example.com",
      username: "AuthUser",
      password: hashPass,
      role: "user"
    });
  });

  it("POST /auth/login - connexion réussie", async () => {
    const res = await request(app).post("/auth/login").send({
      email: "authuser@example.com",
      password: "userpass"
    });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
  });

  it("POST /auth/login - mauvais mot de passe", async () => {
    const res = await request(app).post("/auth/login").send({
      email: "authuser@example.com",
      password: "wrongpass"
    });

    
    expect([400, 401]).toContain(res.status);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });
});