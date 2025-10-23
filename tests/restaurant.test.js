import request from "supertest";
import app from "../src/app.js";
import User from "../src/db/models/user.js";
import Restaurant from "../src/db/models/restaurant.js";
import Menu from "../src/db/models/menu.js";
import bcrypt from "bcrypt";
import mongoose from "mongoose";

describe("Restaurants", () => {
  let adminToken, restaurantId;

  beforeAll(async () => {
    // Nettoyer la base
    await User.deleteMany({});
    await Restaurant.deleteMany({});
    await Menu.deleteMany({});

    // Création admin
    const hashAdmin = await bcrypt.hash("adminpass", 10);
    await User.create({
      email: "admin_restos@example.com", // email unique
      username: "AdminRestos",
      password: hashAdmin,
      role: "admin"
    });

    // Connexion admin
    const resAdmin = await request(app).post("/auth/login").send({
      email: "admin_restos@example.com",
      password: "adminpass"
    });
    adminToken = resAdmin.body.token;
  });

  it("GET /restaurants - liste publique", async () => {
    const res = await request(app).get("/restaurants");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("POST /restaurants - admin crée un restaurant", async () => {
    const res = await request(app)
      .post("/restaurants")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ name: "Pizza Palace", address: "123 Rue" });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("_id");
    restaurantId = res.body._id;
  });

  it("PATCH /restaurants/:id - admin met à jour un restaurant", async () => {
    const res = await request(app)
      .patch(`/restaurants/${restaurantId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ name: "Pizza Palace Updated" });

    expect(res.status).toBe(200);
    expect(res.body.name).toBe("Pizza Palace Updated");
  });

  it("DELETE /restaurants/:id - admin supprime un restaurant", async () => {
    const res = await request(app)
      .delete(`/restaurants/${restaurantId}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).toBe(204);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });
});