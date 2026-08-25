# 🏆 HARISS OfficeQuest V3

Plateforme de gamification pour la gestion de tâches en entreprise. Les employés complètent des **quêtes**, gagnent de l'**XP**, montent de **niveau** et grimpent dans le **classement** (leaderboard).

Stack technique : **Node.js · Express · Prisma · PostgreSQL · JWT · Vanilla JS/CSS**

---

## 📁 Structure du projet

```text
HARISS_OFFICEQUEST_V3/
│
├── public/                  # Frontend statique
│   ├── assets/
│   ├── images/
│   ├── css/style.css
│   ├── js/main.js           # Connexion / inscription
│   ├── js/dashboard.js      # Quêtes, XP, classement
│   ├── index.html           # Page de connexion / inscription
│   └── dashboard.html       # Tableau de bord
│
├── src/
│   ├── controllers/         # Logique des routes (auth, quest, user)
│   ├── routes/               # Définition des endpoints Express
│   ├── middleware/          # Auth JWT, upload, gestion des erreurs
│   ├── services/             # Logique métier (Prisma queries)
│   ├── utils/                 # Calcul de niveau, JWT, client Prisma
│   └── server.js             # Point d'entrée de l'application
│
├── prisma/
│   └── schema.prisma          # Modèles de base de données
│
├── uploads/                   # Fichiers uploadés (avatars) — ignoré par Git
│
├── package.json
├── package-lock.json
├── .gitignore
├── .env.example
├── render.yaml                # Configuration de déploiement Render
└── README.md
```

---

## 🚀 Installation et lancement (pas à pas)

### 1. Télécharger le projet
Téléchargez l'archive `HARISS_OFFICEQUEST_V3.zip`.

### 2. Extraire le projet
Extraire le dossier `HARISS_OFFICEQUEST_V3` où vous le souhaitez sur votre ordinateur.

### 3. Ouvrir dans VS Code
Ouvrez Visual Studio Code, puis :
`File → Open Folder → HARISS_OFFICEQUEST_V3`

### 4. Ouvrir le terminal
Dans VS Code : `Terminal → New Terminal`

### 5. Installer les dépendances
```bash
npm install
```

### 6. Configurer les variables d'environnement
Copiez le fichier `.env.example` en `.env` :

```bash
cp .env.example .env
```
*(sous Windows : `copy .env.example .env`)*

Ouvrez `.env` et complétez les valeurs, notamment :
- `DATABASE_URL` : votre chaîne de connexion PostgreSQL
- `JWT_SECRET` : une chaîne secrète longue et aléatoire

Vous avez besoin d'une base PostgreSQL. Options simples :
- Installer PostgreSQL localement ([postgresql.org](https://www.postgresql.org/download/))
- Utiliser une base gratuite hébergée (Render, Neon, Supabase...)

### 7. Configurer Prisma
Générer le client Prisma et appliquer les migrations :

```bash
npx prisma generate
npx prisma migrate dev --name init
```

Cette commande crée les tables `users`, `quests` et `completions` dans votre base de données.

*(Optionnel)* Pour visualiser vos données dans une interface graphique :
```bash
npx prisma studio
```

### 8. Lancer le projet en développement
```bash
npm run dev
```

Le serveur démarre sur `http://localhost:3000` (ou le port défini dans `.env`).

Pour un lancement en production :
```bash
npm start
```

### 9. Tester le site localement
Ouvrez votre navigateur sur `http://localhost:3000` :
- Créez un compte via l'onglet **Inscription**
- Connectez-vous
- Accédez au tableau de bord, complétez des quêtes, consultez le classement

> 💡 Pour devenir administrateur (et pouvoir créer des quêtes), modifiez le rôle de votre utilisateur en base via `npx prisma studio`, en passant le champ `role` de `EMPLOYEE` à `ADMIN`.

---

## 🔗 Endpoints API principaux

| Méthode | Route                        | Description                          | Accès          |
|---------|-------------------------------|---------------------------------------|----------------|
| POST    | `/api/auth/register`          | Créer un compte                       | Public         |
| POST    | `/api/auth/login`              | Se connecter                          | Public         |
| GET     | `/api/auth/me`                | Profil connecté                       | Authentifié    |
| GET     | `/api/quests`                  | Liste des quêtes                      | Authentifié    |
| POST    | `/api/quests`                  | Créer une quête                       | Admin          |
| PUT     | `/api/quests/:id`               | Modifier une quête                    | Admin          |
| DELETE  | `/api/quests/:id`                | Supprimer une quête                   | Admin          |
| POST    | `/api/quests/:id/complete`       | Compléter une quête (+ XP)            | Authentifié    |
| GET     | `/api/users/leaderboard`         | Classement des utilisateurs           | Authentifié    |
| GET     | `/api/users/:id`                  | Profil public d'un utilisateur        | Authentifié    |
| POST    | `/api/users/avatar`               | Upload d'un avatar                    | Authentifié    |
| GET     | `/api/health`                      | Vérification de l'état du serveur     | Public         |

---

## 📤 Préparation et envoi sur GitHub

Le projet est déjà prêt (`.gitignore`, `.env.example`). Ouvrez le terminal dans le dossier du projet et exécutez :

```bash
git init
git add .
git commit -m "Initial commit - HARISS OfficeQuest V3"
git branch -M main
git remote add origin URL_DU_REPOSITORY_GITHUB
git push -u origin main
```

Remplacez `URL_DU_REPOSITORY_GITHUB` par l'adresse de votre dépôt GitHub (ex. `https://github.com/votre-utilisateur/hariss-officequest-v3.git`).

⚠️ Le fichier `.env` n'est **jamais** envoyé sur GitHub grâce au `.gitignore`. Seul `.env.example` y figure.

---

## ☁️ Déploiement sur Render

1. Poussez le projet sur GitHub (voir ci-dessus).
2. Sur [render.com](https://render.com), cliquez sur **New → Blueprint**.
3. Connectez votre dépôt GitHub `HARISS_OFFICEQUEST_V3`.
4. Render détecte automatiquement le fichier `render.yaml` et configure :
   - Le service web Node.js
   - La base de données PostgreSQL
   - Les variables d'environnement (`JWT_SECRET` généré automatiquement, `DATABASE_URL` reliée à la base)
5. Cliquez sur **Apply** pour lancer le déploiement.
6. Une fois le déploiement terminé, votre application est accessible via l'URL fournie par Render (ex. `https://hariss-officequest-v3.onrender.com`).

Si vous préférez une configuration manuelle (sans Blueprint) :
- **Build Command** : `npm install && npx prisma generate && npx prisma migrate deploy`
- **Start Command** : `npm start`
- Ajoutez manuellement les variables d'environnement (`DATABASE_URL`, `JWT_SECRET`, `NODE_ENV=production`) dans l'onglet **Environment** de Render.

---

## ✅ Checklist de vérification avant livraison

- [x] Structure de dossiers complète et cohérente
- [x] Tous les fichiers nécessaires sont présents et reliés entre eux
- [x] Routes ↔ Contrôleurs ↔ Services ↔ Prisma cohérents
- [x] Authentification JWT fonctionnelle (register/login/me)
- [x] Système XP / niveaux fonctionnel (`levelCalculator.js`)
- [x] Frontend fonctionnel (connexion, dashboard, quêtes, classement)
- [x] `package.json` avec scripts `dev` et `start`
- [x] `.gitignore` présent et correct
- [x] `.env.example` présent, `.env` exclu de Git
- [x] `render.yaml` présent et prêt pour le déploiement
- [x] Aucun secret réel dans le code

---

## 🛠️ Commandes utiles récapitulatives

```bash
npm install                          # Installer les dépendances
npx prisma generate                  # Générer le client Prisma
npx prisma migrate dev --name init   # Créer/appliquer les migrations (dev)
npx prisma migrate deploy            # Appliquer les migrations (production)
npx prisma studio                    # Interface graphique de la base de données
npm run dev                          # Lancer en développement (avec nodemon)
npm start                            # Lancer en production
```

---

## 📄 Licence

Projet livré à titre de base de départ personnalisable — usage libre.
