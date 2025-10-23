import request from "supertest";
import bcrypt from "bcrypt";
import app from "../src/app.js";
import User from "../src/db/models/user.js";
import Restaurant from "../src/db/models/restaurant.js";
import Menu from "../src/db/models/menu.js";

let adminToken;
let restaurantId;
let menuId;

beforeAll(async () => {
  // Nettoyer la base
  await User.deleteMany({});
  await Restaurant.deleteMany({});
  await Menu.deleteMany({});

  // Créer un admin
  const hash = await bcrypt.hash("adminpass", 10);
  await User.create({
    email: "admin@example.com",
    username: "Admin",
    password: hash,
    role: "admin"
  });

  // Login admin pour récupérer le token
  const resLogin = await request(app).post("/auth/login").send({
    email: "admin@example.com",
    password: "adminpass"
  });
  adminToken = resLogin.body.token;

  // Créer un restaurant
  const resResto = await request(app)
    .post("/restaurants")
    .set("Authorization", `Bearer ${adminToken}`)
    .send({
      name: "Pizza Palace",
      address: "123 Rue de la République",
      phone: "+33 1 45 67 89 00",
      opening_hours: "Lun-Dim 11:00-23:00"
    });
  restaurantId = resResto.body.id;

  // Créer un menu lié à ce restaurant
  const resMenu = await request(app)
    .post("/menus")
    .set("Authorization", `Bearer ${adminToken}`)
    .send({
      restaurant_id: restaurantId,
      name: "Menu Margherita",
      description: "Pizza Margherita classique avec mozzarella et basilic",
      price: 9.5,
      category: "Pizza"
    });
  menuId = resMenu.body.id;
});

export { adminToken, restaurantId, menuId };