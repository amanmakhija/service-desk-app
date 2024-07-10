# Support Desk App

It is a MERN Stack Support Desk Application for creating, managing, and deleting tickets. It also has an admin dashboard accessible by Super Admins only. The application have 3 types of users - Users, Admins, and Super Admins.

Super Admins can promote a user or demote an admin using the dashboard.

## Usage

### Set Environment Variables

Rename the .envexample to .env and add your [MongoDB](https://www.mongodb.com/) database URI and your JWT secret

### Install backend dependencies

```bash
npm install
```

### Install client dependencies

```bash
cd frontend
npm install
```

### Run app in development (frontend & backend)

```bash
npm run dev
```
