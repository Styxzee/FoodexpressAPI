import request from "supertest";
import app from "../src/app.js";
import User from "../src/db/models/user.js";
import Restaurant from "../src/db/models/restaurant.js";
import Menu from "../src/db/models/menu.js";
import bcrypt from "bcrypt";
import mongoose from "mongoose";

describe("Users", () => {
  let adminToken, userId;

  beforeAll(async () => {
    // Nettoyer la base
    await User.deleteMany({});
    await Restaurant.deleteMany({});
    await Menu.deleteMany({});

    // Création admin
    const hashAdmin = await bcrypt.hash("adminpass", 10);
    await User.create({
      email: "admin_users@example.com", // email unique
      username: "AdminUsers",
      password: hashAdmin,
      role: "admin"
    });

    // Connexion admin
    const resAdmin = await request(app).post("/auth/login").send({
      email: "admin_users@example.com",
      password: "adminpass"
    });
    adminToken = resAdmin.body.token;
  });

  it("POST /users - crée un utilisateur", async () => {
    const res = await request(app)
      .post("/users")
      .send({ email: "user1@example.com", username: "User1", password: "pass123" });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("_id");
    userId = res.body._id;
  });

  it("GET /users - admin liste les utilisateurs", async () => {
    const res = await request(app)
      .get("/users")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });
});