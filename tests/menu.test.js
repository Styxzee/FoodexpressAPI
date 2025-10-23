import request from "supertest";
import app from "../src/app.js";
import User from "../src/db/models/user.js";
import Restaurant from "../src/db/models/restaurant.js";
import Menu from "../src/db/models/menu.js";
import bcrypt from "bcrypt";
import mongoose from "mongoose";

describe("Menus", () => {
  let adminToken, menuId, restaurantId;

  beforeAll(async () => {
    // Nettoyer la base
    await User.deleteMany({});
    await Restaurant.deleteMany({});
    await Menu.deleteMany({});

    // Création admin
    const hashAdmin = await bcrypt.hash("adminpass", 10);
    await User.create({
      email: "admin_menus@example.com", // email unique
      username: "AdminMenus",
      password: hashAdmin,
      role: "admin"
    });

    // Connexion admin
    const resAdmin = await request(app).post("/auth/login").send({
      email: "admin_menus@example.com",
      password: "adminpass"
    });
    adminToken = resAdmin.body.token;

    // Création d’un restaurant
    const resResto = await request(app)
      .post("/restaurants")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        name: "Test Resto",
        address: "123 Rue",
        phone: "0102030405",
        opening_hours: "Lun-Dim 11:00-23:00"
      });

    restaurantId = resResto.body._id;
  });

  it("GET /menus - liste publique", async () => {
    const res = await request(app).get("/menus");
    expect(res.status).toBe(200);
  });

  it("POST /menus - admin crée un menu", async () => {
    const res = await request(app)
      .post("/menus")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        restaurant_id: restaurantId, // obligatoire
        name: "Menu 1",
        description: "Un menu de test",
        price: 12,
        category: "Pizza"
      });

    expect(res.status).toBe(201);
    menuId = res.body._id;
  });

  it("PATCH /menus/:id - admin met à jour un menu", async () => {
    const res = await request(app)
      .patch(`/menus/${menuId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ price: 15 });

    expect(res.status).toBe(200);
    expect(res.body.price).toBe(15);
  });

  it("DELETE /menus/:id - admin supprime un menu", async () => {
    const res = await request(app)
      .delete(`/menus/${menuId}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.status).toBe(204);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });
});