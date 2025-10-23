Fonctionnalités
- Authentification JWT (connexion, inscription)
- Gestion des utilisateurs avec rôles (user, admin)
- CRUD complet sur les restaurants et menus (admin uniquement)
- Lecture publique des restaurants et menus avec tri et pagination
- Validation des entrées avec Joi
- Documentation Swagger
- Tests automatisés avec Jest

Installation

- Clonez le projet :
git clone https://github.com/votre-utilisateur/foodexpress.git
cd foodexpress
- Installez les dépendances :
npm install
- Créez un fichier .env à la racine :
PORT=3000
MONGODB_URI=mongodb://localhost:27017/foodexpress
JWT_SECRET=your_jwt_secret
Lancer les tests
npm test
Les tests couvrent :
- Authentification
- Accès restreint par rôle
- CRUD utilisateurs
- CRUD restaurants (admin)
- CRUD menus (admin)
Démarrage de l’API
npm start
L’API sera disponible sur :
http://localhost:3000

Authentification

- Création de compte : POST /auth/signup (public)
- Connexion : POST /auth/login → retourne un token JWT
- Les routes protégées nécessitent un header :
Authorization: Bearer <token>

Documentation Swagger

La documentation complète est disponible sur :
GET /docs
Swagger est généré à partir du fichier src/docs/openapi.yaml.

Structure du projet

src/
├── app.js                 # Configuration Express
├── db/
│   └── mongo.js           # Connexion MongoDB
├── routes/
│   ├── auth.router.js
│   ├── users.router.js
│   ├── restaurants.router.js
│   └── menus.router.js
├── middlewares/
│   ├── auth.js            # JWT + rôles
│   ├── validate.js        # Validation Joi
│   └── error.js           # Gestion des erreurs
├── docs/
│   └── openapi.yaml       # Documentation Swagger
└── tests/
└── *.test.js          # Tests Jest

Endpoints principaux

/auth
- POST /auth/signup → Créer un compte (public)
- POST /auth/login → Se connecter (public, retourne un JWT)
/users
- GET /users/:id → Voir son profil (auth, self/admin)
- PATCH /users/:id → Modifier son profil (auth, self/admin)
- DELETE /users/:id → Supprimer un utilisateur (admin)
/restaurants
- GET /restaurants → Lister avec tri/pagination (public)
- POST /restaurants → Créer un restaurant (admin)
- PATCH /restaurants/:id → Modifier un restaurant (admin)
- DELETE /restaurants/:id → Supprimer un restaurant (admin)
/menus
- GET /menus → Lister avec tri/pagination (public)
- POST /menus → Créer un menu (admin)
- PATCH /menus/:id → Modifier un menu (admin)
- DELETE /menus/:id → Supprimer un menu (admin)

Technologies utilisées

- Node.js + Express.js
- MongoDB + Mongoose
- JWT pour l’authentification
- Joi pour la validation
- Swagger pour la documentation
- Jest pour les tests

Projet réalisé par Kylian Guyomard
