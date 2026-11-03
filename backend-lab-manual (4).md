# ZTAD Student Attendance System — Backend Lab Manual

This manual takes you from a computer with nothing installed to a working attendance
backend. You will build the **backend** of the ZTAD Student Attendance System with
Node.js, TypeScript, Express, PostgreSQL, and Drizzle, and test it with Postman.

## What you are building

At the end of this manual you will have a running API at `http://localhost:4000` that
provides:

- **Students** — a name, a track (`frontend` or `backend`), and a status
  (`active` or `inactive`). You can list, search, view, create, update, and delete
  students.
- **Attendance** — clock a student in and out, correct a record, and delete a record.
  Records are restricted by date, working days, and opening/closing times. The API also
  computes each student's status and daily total.
- **Settings** — configure the working days and the opening/closing times.
- **Deletion rules** — deleting a student also deletes that student's attendance records
  (cascade delete).
- **Data safety** — every request is validated, errors return a clear JSON message, and
  the database is created and updated with migrations and seed data.

You build it one small, verified step at a time. You do not copy a finished project.

## How to use this manual

Every step has the same shape:

- **What are we doing?** — one sentence describing the step.
- **Why do we need it?** — the reason it exists.
- **Type exactly** — the commands to run or the file to create, written out in full.
- **You should see** — the exact expected result.
- **STOP HERE** — if you did not get the expected result, stop and fix it before you
  continue. Jump to the troubleshooting note under the step, or to the troubleshooting
  appendix at the end.

Read every line. Do not skip a step. Do not continue past a step that does not produce the
expected result. The whole manual is built so that each step is only possible because the
previous step worked.

## The project folder

You will create this structure, and for this manual you work **only inside `backend/`**:

```text
Fullstack/
├── backend/     <- everything in this manual happens here
└── frontend/    <- created now, used in a later manual
```

The `frontend/` folder is created in Part 2 but left empty. A separate manual covers
building the React frontend that talks to this backend.

---

# Part 1 — Set up the tools

Part 1 installs and verifies the four tools you need: Node.js, PostgreSQL, DBeaver, and
Postman. No project exists yet.

---

## STEP 1 — Install Node.js

**What are we doing?**

Installing Node.js, the program that runs JavaScript and TypeScript outside the browser.

**Why do we need it?**

Your backend is a TypeScript program. Node.js is what executes it. It also installs
`npm`, the tool that downloads the libraries you will use.

**Read:** <https://nodejs.org/en/learn/getting-started/introduction-to-nodejs> — what
Node.js is and how it runs JavaScript outside the browser.

1. Open <https://nodejs.org> in your browser.
2. Download the **LTS** installer for Windows. Version **24 or newer** is required.
3. Run the installer and accept the default options.

**You should see**

The installer finishes without errors. You verify it in the next step.

**STOP HERE**

If the download or install fails, do not continue. The rest of the manual depends on it.

---

## STEP 2 — Verify Node.js and npm

**What are we doing?**

Confirming that Node.js and npm are installed and on your PATH.

**Why do we need it?**

If the versions do not print, your terminal cannot find Node, and nothing later will run.

1. Open **PowerShell** (press the Windows key, type `PowerShell`, press Enter).
2. Type exactly:

```powershell
node --version
```

**You should see**

```text
v24.x.x
```

3. Now type:

```powershell
npm --version
```

**You should see**

```text
11.x.x
```

**STOP HERE**

If you get `node : The term 'node' is not recognized`, close PowerShell, open it again,
and run the two commands. If it still fails, restart your computer and try again.

---

## STEP 3 — Install PostgreSQL

**What are we doing?**

Installing PostgreSQL, a relational database server.

**Why do we need it?**

Your API must remember students, attendance, and settings permanently. PostgreSQL stores
that data on your computer where it survives a restart, unlike browser storage.

**Read:** <https://www.postgresql.org/docs/current/tutorial.html> — the official
PostgreSQL tutorial. The first pages introduce the ideas STEP 8 builds on.

1. Open <https://www.postgresql.org/download/windows/>.
2. Click the installer for the latest version and download it.
3. Run the installer. Accept the default install location.
4. When it asks for a **password for the `postgres` user**, choose one you will remember.
   Write it down. You need it later in your `.env` file.
5. Keep the default **port: 5432**.
6. Finish the installation. You do **not** need to launch Stack Builder at the end.

**You should see**

PostgreSQL is installed. You verify it in the next step.

**STOP HERE**

If the installer fails, do not continue. The database is required for every later part.

---

## STEP 4 — Configure PostgreSQL

**What are we doing?**

Making the PostgreSQL tools (`psql`, `createdb`) available from any terminal.

**Why do we need it?**

You will create the database from PowerShell. If PowerShell cannot find the PostgreSQL
tools, the command fails with "not recognized".

PostgreSQL installs its tools under:

```text
C:\Program Files\PostgreSQL\<version>\bin
```

(`<version>` is a number like `17`.)

Add that folder to your PATH:

1. Open the Start menu and search for **"Edit the system environment variables"**.
2. Click **Environment Variables…**.
3. Under **User variables**, select `Path` and click **Edit…**.
4. Click **New** and paste the full `bin` path, for example:

```text
C:\Program Files\PostgreSQL\17\bin
```

5. Click OK on all three windows.
6. Close and reopen PowerShell.

**You should see**

In the new PowerShell, this prints a version:

```powershell
psql --version
```

```text
psql (PostgreSQL) 17.x
```

**STOP HERE**

If `psql` is still "not recognized", check the path you added matches the actual folder on
your machine, then reopen PowerShell.

---

## STEP 5 — Create the `attendance_db` database

**What are we doing?**

Creating the empty database your API will use.

**Why do we need it?**

PostgreSQL can hold many databases. Your app needs one of its own, named `attendance_db`.

In PowerShell, type exactly:

```powershell
createdb attendance_db
```

**You should see**

No output. `createdb` prints nothing when it succeeds.

To confirm it exists, type:

```powershell
psql -U postgres -c "SELECT datname FROM pg_database WHERE datname = 'attendance_db';"
```

**You should see**

```text
    datname
---------------
 attendance_db
(1 row)
```

When asked for a password, enter the `postgres` password you chose in STEP 3.

**STOP HERE**

If you see `database "attendance_db" already exists`, it was already created — continue.
If you see a connection error, your password or port is wrong. Retype the password, or
check that PostgreSQL is running (search Start menu for "pgAdmin" and open it, or check
"Services" for `postgresql-x64-<version>`).

---

## STEP 6 — Install DBeaver

**What are we doing?**

Installing DBeaver, a visual tool for looking inside PostgreSQL databases.

**Why do we need it?**

You will write data through the API, but you need to *see* the tables and rows directly to
understand what is really being stored. DBeaver shows you that.

**Read:** <https://dbeaver.io/docs/> — DBeaver's documentation, including how to connect
to PostgreSQL.

1. Open <https://dbeaver.io/download/>.
2. Download the **Community** edition installer for Windows.
3. Run the installer and accept the defaults.

**You should see**

DBeaver opens when you launch it.

---

## STEP 7 — Connect DBeaver to PostgreSQL

**What are we doing?**

Pointing DBeaver at your local PostgreSQL so it can show your database.

**Why do we need it?**

DBeaver is a viewer. It must be told where the database is and how to log in.

1. Open DBeaver.
2. Click the **New Database Connection** button (a plug icon with a `+`), or
   **Database → New Database Connection**.
3. Choose **PostgreSQL** and click **Next**.
4. Fill in:
   - **Host:** `localhost`
   - **Port:** `5432`
   - **Database:** `postgres`
   - **Username:** `postgres`
   - **Password:** the password you chose in STEP 3
5. Click **Test Connection…**.

**You should see**

```text
Connected
```

6. Click **Finish**. In the left "Database Navigator" panel, expand the connection and you
   should see a database named `attendance_db`.

**STOP HERE**

If the test fails, check the port (`5432`), the username (`postgres`), and the password.
If PostgreSQL is not running, start it (search Start menu for "Services", find
`postgresql-x64-<version>`, and click Start).

---

## STEP 8 — What the database is actually doing

**What are we doing?**

Learning the four ideas the whole project is built on.

**Why do we need it?**

Every later step assumes you know these. They are small; read them once.

A relational database stores data in **tables**. A table is like a spreadsheet:

- a **column** is one field (for example, a name),
- a **row** is one record (for example, one student),
- every table has a **primary key**: a column whose value is unique for every row, used to
  identify one row.

The project will have three tables:

| Table | What one row is | Primary key |
| --- | --- | --- |
| `students` | one student | `student_id` |
| `attendance` | one student's record for one day | `attendance_id` |
| `settings` | the single settings row | `id` |

Tables relate to each other with a **foreign key**. A foreign key is a column in one table
that points at the primary key of another table:

```text
students
  student_id   (primary key)
  full_names
  track
  status

attendance
  attendance_id  (primary key)
  student_id     (foreign key -> students.student_id)
  date
  clock_in
  clock_out
```

`attendance.student_id` points at `students.student_id`, so every attendance record
belongs to one student. Because of this link, the database can do the **cascade delete**:
when you delete a student, the database automatically deletes that student's attendance
rows too. You do not write that cleanup yourself.

You talk to the database with **SQL**, for example:

```sql
SELECT * FROM students;
```

You will not write much SQL by hand in this project. Drizzle writes it for you. But the
ideas above — table, row, column, primary key, foreign key — are what Drizzle is creating
for you under the hood.

---

## STEP 9 — Install and set up Postman

**What are we doing?**

Installing Postman, a tool for sending HTTP requests and reading the responses.

**Why do we need it?**

Your API has no web page yet. Postman is the client you will use to send requests to it
and check the JSON it returns. It is how you verify every step from here on.

**Read:** <https://learning.postman.com/docs/getting-started/introduction/> — Postman's
getting-started guide, which explains the request area you use in STEP 20.

1. Open <https://www.postman.com/downloads/>.
2. Download and install the desktop app for Windows.
3. Open Postman. Skip account creation if it lets you, or create a free account.
4. You land on a screen with a request area: a method dropdown (GET, POST, …), a URL box,
   and a **Send** button. You use it in STEP 20.

**You should see**

Postman opens with the request area visible.

---

You have finished Part 1. You now have Node.js, PostgreSQL, DBeaver, and Postman installed
and verified.

---

# Part 2 — Your first server

Part 2 creates the project folder and a running Express server that answers one request.
You do not touch the database yet.

---

## STEP 10 — Create the project folder

**What are we doing?**

Creating the `Fullstack` folder with a `backend` folder and an empty `frontend` folder.

**Why do we need it?**

The whole project lives under one folder. You build the backend now and the frontend in a
later manual, so both folders are created up front.

1. Open PowerShell.
2. Navigate to where you keep your projects, then type:

```powershell
mkdir Fullstack
cd Fullstack
mkdir backend
mkdir frontend
```

3. Open the `backend` folder in VS Code:

```powershell
code backend
```

(If `code` is not recognized, open VS Code, then **File → Open Folder…** and choose the
`backend` folder.)

**You should see**

VS Code opens with an empty `backend` folder. You work only in this folder for the rest of
the manual.

---

## STEP 11 — Run `npm init`

**What are we doing?**

Creating the `package.json` file that describes your project.

**Why do we need it?**

`package.json` is the project's identity card. It holds the project name, the scripts you
can run, and the list of libraries the project depends on. Every Node project starts here.

**Read:** <https://docs.npmjs.com/cli/v11/commands/npm-init> — what `npm init` actually
writes into `package.json`.

1. In VS Code, open the terminal: **Terminal → New Terminal**.
2. The terminal opens inside the `backend` folder. Type:

```powershell
npm init -y
```

**You should see**

A file named `package.json` appears in the Explorer, and the terminal prints something like:

```text
Wrote to ...\backend\package.json:
{
  "name": "backend",
  "version": "1.0.0",
  ...
}
```

---

## STEP 12 — What `package.json` does

**What are we doing?**

Reading the file `npm init` just created.

**Why do we need it?**

You will edit this file in every remaining part. Know what each section is for.

**Read:** <https://docs.npmjs.com/cli/v11/configuring-npm/package-json> — the official
explanation of every field in `package.json`.

Open `package.json`. It looks like:

```json
{
  "name": "backend",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC"
}
```

Three sections matter for this project:

- **`scripts`** — shortcuts for commands. `npm run <name>` runs the value. You will add
  `dev`, `build`, and `start` here.
- **`dependencies`** — libraries the running app needs (Express, Drizzle, …). Added
  automatically when you run `npm install <package>`.
- **`devDependencies`** — libraries only needed while developing (TypeScript, tsx, …).
  Added with `npm install -D <package>`.

There is no `dependencies` section yet. `npm install` will create it.

---

## STEP 13 — Turn on ES modules

**What are we doing?**

Adding `"type": "module"` to `package.json`.

**Why do we need it?**

JavaScript has two module systems. This project uses the modern one, ES modules, so files
import each other with `import` and `export`. Setting `"type": "module"` tells Node to
treat every `.js` file as an ES module.

Open `package.json` and change it so the top looks exactly like this:

```json
{
  "name": "backend",
  "version": "1.0.0",
  "type": "module",
  "description": "Student attendance system backend (Express + TypeScript + Drizzle + Postgres)",
  "main": "dist/src/server.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC"
}
```

Save the file.

**You should see**

No visible change. The setting is read later when the server runs.

---

## STEP 14 — Install Express

**What are we doing?**

Installing Express, the library that handles HTTP requests and responses.

**Why do we need it?**

Node can talk HTTP by itself, but Express makes it simple: it gives you a way to say
"when a GET request arrives at `/health`, run this function and reply with this JSON."

**Read:** <https://expressjs.com/en/starter/hello-world.html> — Express's own first
example, and <https://expressjs.com/en/guide/routing.html> for how routes match URLs.

In the terminal, type:

```powershell
npm install express
```

**You should see**

The terminal downloads packages and ends with something like:

```text
added 65 packages in 3s
```

Open `package.json` again. A `"dependencies"` section now exists:

```json
"dependencies": {
  "express": "^4.21.1"
}
```

---

## STEP 15 — Install TypeScript, tsx, and the types

**What are we doing?**

Installing the tools that let you write and run TypeScript.

**Why do we need it?**

Three things are installed together, and they do three different jobs:

- **`typescript`** — the compiler that checks your types and turns `.ts` into `.js`.
- **`tsx`** — runs `.ts` files directly during development, with auto-restart on save.
- **`@types/node`** and **`@types/express`** — type descriptions of Node and Express, so the
  editor and compiler know their shapes.

**Read:** <https://tsx.is> — the tool that runs your `.ts` files directly during
development.

In the terminal, type:

```powershell
npm install -D typescript tsx @types/node @types/express
```

The `-D` flag means "developer dependency": needed to build and run during development, not
shipped to production.

**You should see**

A `"devDependencies"` section now appears in `package.json`:

```json
"devDependencies": {
  "@types/express": "^4.17.21",
  "@types/node": "^22.9.0",
  "tsx": "^4.19.2",
  "typescript": "^5.6.3"
}
```

---

## STEP 16 — Configure TypeScript

**What are we doing?**

Creating `tsconfig.json`, the file that tells TypeScript how to compile your code.

**Why do we need it?**

TypeScript needs to know which JavaScript features to target and how modules are resolved.
The settings below match the working project exactly.

Create a new file at the root of `backend` named `tsconfig.json` and type exactly:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "lib": ["ES2022"],
    "types": ["node"],
    "outDir": "dist",
    "rootDir": ".",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": false,
    "sourceMap": true,
    "noUnusedLocals": false,
    "noUnusedParameters": false
  },
  "include": ["src/**/*.ts", "drizzle.config.ts"],
  "exclude": ["node_modules", "dist"]
}
```

What the important lines mean:

- `"module": "NodeNext"` and `"moduleResolution": "NodeNext"` — use Node's modern module
  system. This is why relative imports must end in `.js` even in `.ts` files (you see this
  in the next step).
- `"esModuleInterop": true` — allows the default `import express from "express"` form.
- `"strict": true` — turns on full type checking.
- `"types": ["node"]` — loads Node's own type definitions (`@types/node`) explicitly, so
  `process.env`, `console`, and the other Node globals are typed everywhere. This matters
  because `drizzle.config.ts` (created in STEP 26) reads `process.env` and lives at the
  project root, outside `src/`.
- `"rootDir": "."` — the common root of everything the compiler compiles. Because
  `drizzle.config.ts` sits at the project root, that root is the project itself, **not**
  `src/`. One consequence you will see after `npm run build`: the compiled output mirrors
  the source folders, so `src/server.ts` becomes `dist/src/server.js`. That is why
  `package.json`'s `main` (STEP 13) and the `start` script (STEP 18) point at
  `dist/src/server.js`.
- `"include": ["src/**/*.ts", "drizzle.config.ts"]` — the compiler checks your
  application code **and** the Drizzle configuration, so `npm run build` also catches
  type errors in `drizzle.config.ts`.
- `"outDir": "dist"` — compiled output goes to `dist/`.

**Read:** <https://www.typescriptlang.org/tsconfig> — the reference for every option,
and <https://www.typescriptlang.org/docs/handbook/tsconfig-json.html> for how the file
itself works.

**You should see**

No visible change. The settings take effect the moment you create your first `.ts` file.

---

## STEP 17 — Create the Express application

**What are we doing?**

Creating the program that will listen for HTTP requests.

**Why do we need it?**

Postman needs somewhere to send its request. This file is that somewhere: an Express app
with one route, `/health`.

Create a folder named `src`, and inside it a file named `app.ts`. Type exactly:

```ts
import express from "express";

export const app = express();

app.get("/health", (_req, res) => {
  res.json({ message: "Welcome to the system" });
});
```

Read it line by line:

- `import express from "express";` — load Express.
- `export const app = express();` — create the app and export it so other files can use it.
- `app.get("/health", …)` — register a handler for `GET /health`.
- `res.json({ message: "Welcome to the system" })` — reply with that JSON.

**You should see**

No visible change yet. You start it in two steps.

---

## STEP 18 — Create the entry point and the scripts

**What are we doing?**

Creating `server.ts`, the file that starts the server, and adding run commands to
`package.json`.

**Why do we need it?**

`app.ts` defines the app. `server.ts` starts it listening on a port. Keeping them separate
lets tests import the app without starting a server. The scripts give you `npm run dev`.

Create a file in `src` named `server.ts`. Type exactly:

```ts
import { app } from "./app.js";

const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;

app.listen(PORT, () => {
  console.log(`Attendance API running on http://localhost:${PORT}`);
});
```

Notice the import says `"./app.js"` even though the file is `app.ts`. With NodeNext module
resolution this is required: relative imports use the compiled file name. Do not "fix" it.

Now open `package.json` and replace the whole `"scripts"` section with:

```json
"scripts": {
  "dev": "tsx watch src/server.ts",
  "build": "tsc -p tsconfig.json",
  "start": "node dist/src/server.js"
}
```

Your `package.json` now looks like:

```json
{
  "name": "backend",
  "version": "1.0.0",
  "type": "module",
  "description": "Student attendance system backend (Express + TypeScript + Drizzle + Postgres)",
  "main": "dist/src/server.js",
  "scripts": {
    "dev": "tsx watch src/server.ts",
    "build": "tsc -p tsconfig.json",
    "start": "node dist/src/server.js"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "express": "^4.21.1"
  },
  "devDependencies": {
    "@types/express": "^4.17.21",
    "@types/node": "^22.9.0",
    "tsx": "^4.19.2",
    "typescript": "^5.6.3"
  }
}
```

---

## STEP 19 — Start the server

**What are we doing?**

Running the server in development mode.

**Why do we need it?**

`npm run dev` runs `tsx watch src/server.ts`, which starts your server and restarts it
automatically whenever you save a file.

In the terminal, type:

```powershell
npm run dev
```

**You should see**

```text
Attendance API running on http://localhost:4000
```

The terminal stays open, with a prompt not returning. That means the server is running.

**STOP HERE**

If you see an error instead, read it fully. The most common causes:

- `Cannot find module 'express'` — you skipped STEP 14. Run `npm install express`.
- `Unknown file extension ".ts"` — `"type": "module"` is missing from `package.json`
  (STEP 13) or tsx is not installed (STEP 15).
- A port error like `EADDRINUSE` — another copy of the server is already running. Close it
  or press `Ctrl+C` in the terminal that is running it.

Leave the server running in its terminal. Open a **second** terminal for the commands that
come next.

---

## STEP 20 — Send your first request with Postman

**What are we doing?**

Sending a `GET` request to your running server and reading the response.

**Why do we need it?**

This confirms the whole chain works: your code, tsx, Express, and Postman.

1. Open Postman.
2. Set the method dropdown to **GET**.
3. In the URL box, type:

```text
http://localhost:4000/health
```

4. Click **Send**.

**You should see**

The response area shows status `200 OK` and this body:

```json
{
  "message": "Welcome to the system"
}
```

**STOP HERE**

If you do not get this exact response, do not continue. Check:

- The server terminal still says `Attendance API running on http://localhost:4000`.
- The method is `GET` and the URL has no typos.
- The response shows a status code. If it says "Could not get any response", the server is
  not running — go back to STEP 19.

---

You have finished Part 2. You have a running Express server and have proven Postman can
talk to it.

---

# Part 3 — Connect the database

Part 3 adds a real database. You install the database libraries one by one, define the
tables, and create them. You introduce each library only when it is needed.

---

## STEP 21 — Why you need four database libraries

**What are we doing?**

Learning the four libraries you are about to install and how they fit together.

**Why do we need it?**

Instead of one giant install, each library has one job. Here is the whole picture:

```text
Your TypeScript code
        |
        v
   Drizzle ORM   (drizzle-orm)  <- you write typed queries, e.g. db.select().from(students)
        |
        v
  postgres driver (postgres)    <- the low-level connection to the database
        |
        v
    PostgreSQL     (the server) <- actually stores the data
```

The four libraries:

| Package | Type | Job |
| --- | --- | --- |
| `dotenv` | dependency | reads your `.env` file so secrets and config stay out of code |
| `postgres` | dependency | the low-level driver that opens the connection to PostgreSQL |
| `drizzle-orm` | dependency | lets you write database operations in TypeScript instead of SQL strings |
| `drizzle-kit` | devDependency | generates SQL migrations from your schema and opens a table browser |

You install them in the next three steps, one at a time.

---

## STEP 22 — Install `dotenv` and create `.env`

**What are we doing?**

Installing `dotenv` and creating the `.env` file that holds your database connection.

**Why do we need it?**

The database password must not be written into your code. It lives in `.env`, a file that
is never committed, and `dotenv` loads it into `process.env` when the server starts.

**Read:** <https://www.npmjs.com/package/dotenv> — dotenv's README, including how the
`.env` file is loaded.

In the terminal, type:

```powershell
npm install dotenv
```

Create a file named `.env` in the `backend` folder (not inside `src`). Type exactly,
replacing `YOUR_PASSWORD` with the PostgreSQL password you chose in STEP 3:

```bash
# Local Postgres connection
# Create the db first: createdb attendance_db
DATABASE_URL=postgres://postgres:YOUR_PASSWORD@localhost:5432/attendance_db

PORT=4000
```

Create a second file named `.env.example` with the same content but the placeholder
password. It is the checked-in template:

```bash
# Local Postgres connection
# Create the db first: createdb attendance_db
DATABASE_URL=postgres://postgres:postgres@localhost:5432/attendance_db

PORT=4000
```

Create a file named `.gitignore` in the `backend` folder. Type exactly:

```text
node_modules
dist
.env
*.log
```

This stops `node_modules`, the compiled output, and your secrets from being committed.

Finally, open `src/server.ts` and add `dotenv` loading as the very first line:

```ts
import "dotenv/config";
import { app } from "./app.js";

const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;

app.listen(PORT, () => {
  console.log(`Attendance API running on http://localhost:${PORT}`);
});
```

**You should see**

No visible change. The `.env` values become available the next time the server restarts.

**STOP HERE**

Read the `DATABASE_URL` left to right and check yours matches: `postgres://` (the database
kind), `postgres` (the user), `:YOUR_PASSWORD`, `@localhost:5432` (where), `/attendance_db`
(which database). A typo here breaks every database step that follows.

---

## STEP 23 — Install `postgres` and `drizzle-orm`

**What are we doing?**

Installing the low-level database driver and the ORM that sits on top of it.

**Why do we need it?**

`postgres` opens the raw connection. `drizzle-orm` turns your TypeScript table definitions
into queries against that connection, so you write `db.select().from(students)` instead of
`SELECT * FROM students`.

**Read:** <https://orm.drizzle.team/docs/get-started-postgresql> — the official Drizzle +
PostgreSQL guide, which this project follows.

In the terminal, type:

```powershell
npm install postgres drizzle-orm
```

**You should see**

Both packages appear in `package.json` under `"dependencies"`.

---

## STEP 24 — Install `drizzle-kit`

**What are we doing?**

Installing Drizzle Kit, the command-line tool that generates migrations.

**Why do we need it?**

You will edit the schema in TypeScript. Drizzle Kit compares that schema to the database
and writes the SQL that makes the database match — those SQL files are your migrations.

**Read:** <https://orm.drizzle.team/docs/migrations> — how Drizzle Kit generates and
applies migrations.

In the terminal, type:

```powershell
npm install -D drizzle-kit
```

**You should see**

`drizzle-kit` appears in `package.json` under `"devDependencies"`.

---

## STEP 25 — Define the tables in the schema

**What are we doing?**

Creating `src/db/schema.ts`, the single source of truth for the three tables.

**Why do we need it?**

Everything else (migrations, queries, types) is generated from this one file. Define the
table once here, and Drizzle derives the rest.

Create a folder `src/db`, and inside it a file named `schema.ts`. Type exactly:

```ts
import { pgTable, uuid, text, date, jsonb, serial, pgEnum } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// The two "tracks" and "statuses" the frontend selects use.
export const trackEnum = pgEnum("track", ["frontend", "backend"]);
export const statusEnum = pgEnum("status", ["active", "inactive"]);

// One row per student.
export const students = pgTable("students", {
  studentId: uuid("student_id").primaryKey().defaultRandom(),
  fullNames: text("full_names").notNull(),
  track: trackEnum("track").notNull(),
  status: statusEnum("status").notNull().default("active"),
});

// One row per student per day.
export const attendance = pgTable("attendance", {
  attendanceId: uuid("attendance_id").primaryKey().defaultRandom(),
  studentId: uuid("student_id")
    .notNull()
    .references(() => students.studentId, { onDelete: "cascade" }),
  // Stored as YYYY-MM-DD.
  date: date("date", { mode: "string" }).notNull(),
  // Stored as HH:MM text, same format the <input type="time"> fields use.
  clockIn: text("clock_in").notNull(),
  clockOut: text("clock_out"),
});

// Always exactly one row (id = 1).
export const settings = pgTable("settings", {
  id: serial("id").primaryKey(),
  // 0 = Monday ... 6 = Sunday.
  workingDays: jsonb("working_days").$type<number[]>().notNull().default([0, 1, 2, 3, 4]),
  openingTime: text("opening_time").notNull().default("09:00"),
  closingTime: text("closing_time").notNull().default("17:00"),
});

export const studentsRelations = relations(students, ({ many }) => ({
  attendance: many(attendance),
}));

export const attendanceRelations = relations(attendance, ({ one }) => ({
  student: one(students, {
    fields: [attendance.studentId],
    references: [students.studentId],
  }),
}));

export type Student = typeof students.$inferSelect;
export type NewStudent = typeof students.$inferInsert;
export type AttendanceRecord = typeof attendance.$inferSelect;
export type NewAttendanceRecord = typeof attendance.$inferInsert;
export type Settings = typeof settings.$inferSelect;
```

Read the three ideas in it:

- `uuid(...).primaryKey().defaultRandom()` — the database generates a unique id for every
  new row. This replaces writing your own id generator.
- `.references(() => students.studentId, { onDelete: "cascade" })` — the foreign key. The
  `cascade` is what deletes a student's attendance automatically.
- `trackEnum` and `statusEnum` — the database refuses any value not in the list, so a
  student can only have track `frontend`/`backend` and status `active`/`inactive`.

**You should see**

No visible change yet. You generate the migration from this file next.

---

## STEP 26 — Configure Drizzle Kit

**What are we doing?**

Creating `drizzle.config.ts` and adding the database scripts to `package.json`.

**Why do we need it?**

Drizzle Kit needs to know where your schema is, where to put migrations, and how to reach
the database. The scripts give you short commands for it.

Create a file at the root of `backend` named `drizzle.config.ts`. Type exactly:

```ts
import "dotenv/config";
import type { Config } from "drizzle-kit";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set. Copy .env.example to .env first.");
}

export default {
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
} satisfies Config;
```

Now open `package.json` and replace the `"scripts"` section so it includes the database
commands:

```json
"scripts": {
  "dev": "tsx watch src/server.ts",
  "build": "tsc -p tsconfig.json",
  "start": "node dist/src/server.js",
  "db:generate": "drizzle-kit generate",
  "db:migrate": "tsx src/db/migrate.ts",
  "db:push": "drizzle-kit push",
  "db:studio": "drizzle-kit studio",
  "db:seed": "tsx src/db/seed.ts"
}
```

**You should see**

No visible change. The scripts are ready for the next steps.

---

## STEP 27 — Generate the migration

**What are we doing?**

Running `npm run db:generate` to turn your schema into a SQL migration file.

**Why do we need it?**

You never hand-write the SQL. Drizzle Kit reads `schema.ts`, compares it to the database,
and writes the SQL that creates the tables.

In the terminal, type:

```powershell
npm run db:generate
```

**You should see**

A new folder `drizzle/` appears, containing a file named like
`drizzle/0000_<random_name>.sql`, plus a `drizzle/meta/` folder. The random part of the
filename is different on every machine — that is normal.

---

## STEP 28 — Read the generated SQL

**What are we doing?**

Opening the generated migration and reading what Drizzle Kit wrote.

**Why do we need it?**

The SQL is the real thing the database will run. It is short, and it mirrors the schema
you wrote.

Open `drizzle/0000_<random_name>.sql`. It contains (abridged):

```sql
CREATE TYPE "public"."status" AS ENUM('active', 'inactive');
CREATE TYPE "public"."track" AS ENUM('frontend', 'backend');

CREATE TABLE IF NOT EXISTS "students" (
  "student_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "full_names" text NOT NULL,
  "track" "track" NOT NULL,
  "status" "status" DEFAULT 'active' NOT NULL
);

CREATE TABLE IF NOT EXISTS "attendance" (
  "attendance_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "student_id" uuid NOT NULL,
  "date" date NOT NULL,
  "clock_in" text NOT NULL,
  "clock_out" text
);

CREATE TABLE IF NOT EXISTS "settings" (
  "id" serial PRIMARY KEY NOT NULL,
  "working_days" jsonb DEFAULT '[0,1,2,3,4]'::jsonb NOT NULL,
  "opening_time" text DEFAULT '09:00' NOT NULL,
  "closing_time" text DEFAULT '17:00' NOT NULL
);

ALTER TABLE "attendance" ADD CONSTRAINT "attendance_student_id_students_student_id_fk"
  FOREIGN KEY ("student_id") REFERENCES "public"."students"("student_id")
  ON DELETE cascade ON UPDATE no action;
```

Spot `ON DELETE cascade` at the end — that one line is the whole "delete the student's
attendance too" feature.

**You should see**

The file exists and contains those `CREATE TABLE` statements. The tables are not created in
the database yet — generating a migration only writes the SQL file.

---

## STEP 29 — Run the migration

**What are we doing?**

Creating `src/db/migrate.ts` and running it to apply the SQL to your database.

**Why do we need it?**

Generating the SQL is only half the job. `migrate.ts` connects to your database and runs
the pending migration files against it.

Create a file `src/db/migrate.ts`. Type exactly:

```ts
import "dotenv/config";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

async function runMigrations() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("DATABASE_URL is not set. Copy .env.example to .env first.");
  }

  const migrationClient = postgres(connectionString, { max: 1 });
  const db = drizzle(migrationClient);

  console.log("Running migrations...");
  await migrate(db, { migrationsFolder: "./drizzle" });
  console.log("Migrations complete.");

  await migrationClient.end();
}

runMigrations().catch((error) => {
  console.error("Migration failed:", error);
  process.exit(1);
});
```

Now run it. In the terminal, type:

```powershell
npm run db:migrate
```

**You should see**

```text
Running migrations...
Migrations complete.
```

**STOP HERE**

If it prints `Migration failed:` followed by a connection error, your `DATABASE_URL` is
wrong or PostgreSQL is not running. Go back to STEP 22 and STEP 5. Do not continue.

---

## STEP 30 — Create the Drizzle client

**What are we doing?**

Creating `src/db/index.ts`, the shared database client every controller will import.

**Why do we need it?**

Your controllers will run queries like `db.select().from(students)`. That `db` object is
created once here — it opens the connection and attaches the schema.

Create a file `src/db/index.ts`. Type exactly:

```ts
import "dotenv/config";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema.js";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set. Copy .env.example to .env and fill it in.");
}

const client = postgres(connectionString);

export const db = drizzle(client, { schema });
```

Notice the import `./schema.js` — again the `.js` extension for a `.ts` file, required by
NodeNext.

**You should see**

No visible change. You import `db` from this file in every controller.

---

## STEP 31 — Seed the default settings

**What are we doing?**

Creating `src/db/seed.ts` and inserting the default settings row.

**Why do we need it?**

The app always needs one settings row (working days Mon–Fri, hours 09:00–17:00). The seed
script inserts it if it does not exist, so running it twice is harmless.

Create a file `src/db/seed.ts`. Type exactly:

```ts
import "dotenv/config";
import { db } from "./index.js";
import { settings } from "./schema.js";

async function seed() {
  const existing = await db.select().from(settings).limit(1);

  if (existing.length > 0) {
    console.log("Settings row already exists, nothing to seed.");
    process.exit(0);
  }

  await db.insert(settings).values({
    workingDays: [0, 1, 2, 3, 4],
    openingTime: "09:00",
    closingTime: "17:00",
  });

  console.log("Seeded default settings.");
  process.exit(0);
}

seed().catch((error) => {
  console.error("Seed failed:", error);
  process.exit(1);
});
```

Now run it. In the terminal, type:

```powershell
npm run db:seed
```

**You should see**

```text
Seeded default settings.
```

---

## STEP 32 — Verify the tables in DBeaver

**What are we doing?**

Looking at the tables you just created, in DBeaver.

**Why do we need it?**

Seeing the tables and rows with your own eyes confirms the migration and seed worked, and
shows you exactly what the API will store.

1. In DBeaver, in the Database Navigator, expand:
   `attendance_db` → **Schemas** → **public** → **Tables**.
2. Right-click **Tables** and choose **Refresh** if they do not appear.

**You should see**

Three tables: `students`, `attendance`, and `settings`.

3. Double-click the `settings` table and open the **Data** tab.

**You should see**

One row, with `id = 1`, `working_days = [0,1,2,3,4]`, `opening_time = 09:00`, and
`closing_time = 17:00`.

**STOP HERE**

If the tables are missing, your migration did not run — go back to STEP 29. If `settings`
is empty, your seed did not run — go back to STEP 31.

---

You have finished Part 3. The database exists, the three tables are created, and the
default settings row is in place.

---

# Part 4 — Build the API architecture

Part 4 builds the actual API. You create the folder structure, the business rules, the
validation, and your first complete feature (settings), then test it in Postman.

---

## STEP 33 — Why the folders exist

**What are we doing?**

Learning the job of each folder before creating the files.

**Why do we need it?**

A request passes through a fixed pipeline. Each folder is one station in that pipeline.

```text
src/
├── server.ts        <- starts the server (listen)
├── app.ts           <- the Express app: middleware, /api mount, error handlers
├── routes/          <- which URL calls which controller
├── controllers/     <- the request handlers that do the work
├── lib/             <- shared helpers: business rules + validation
└── db/              <- schema, client, migrations, seed
```

A request travels like this:

```text
Postman request
    -> server.ts (listening on port 4000)
    -> app.ts (cors, JSON body parsing)
    -> routes/ (match the URL to a handler)
    -> controllers/ (the handler: validate -> act -> respond)
    -> lib/ (Zod validation + business rules)
    -> db/ (Drizzle) -> PostgreSQL
    -> JSON response -> Postman
```

The rule that keeps this clean: **routes say *which* function, controllers say *what* it
does.** `routes/students.routes.ts` maps `GET /` to `getStudents`; the controller
`getStudents` contains the actual logic.

---

## STEP 34 — Create the business rules (`lib/utils.ts`)

**What are we doing?**

Creating `src/lib/utils.ts`, the functions that encode the attendance rules.

**Why do we need it?**

These functions — dates, working days, clock-in/out validation, daily totals, status — are
used by several controllers. They live in one file so every controller checks the rules the
same way.

Create a folder `src/lib`, and inside it a file named `utils.ts`. Type exactly:

```ts
import type { Settings } from "../db/schema.js";

export const DAY_NAMES = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

// YYYY-MM-DD for today.
export function today(): string {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

// getDay() gives 0 for Sunday, but working days start on Monday,
// so shift by six and wrap round with %.
export function weekdayNumber(date: string): number {
  const day = new Date(`${date}T00:00`).getDay();
  return (day + 6) % 7;
}

export function dayName(date: string): string {
  return DAY_NAMES[weekdayNumber(date)];
}

export function isWorkingDay(date: string, settings: Settings): boolean {
  return settings.workingDays.includes(weekdayNumber(date));
}

// "08:15" becomes 495, minutes since midnight.
export function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(":");
  return Number(hours) * 60 + Number(minutes);
}

// 510 becomes "8h 30m".
export function formatMinutes(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours}h ${minutes}m`;
}

// Clock out minus clock in. No clock out yet means no total.
export function dailyTotal(record: { clockIn: string; clockOut: string | null } | null): string {
  if (!record || !record.clockOut) {
    return "—";
  }

  return formatMinutes(timeToMinutes(record.clockOut) - timeToMinutes(record.clockIn));
}

// No record yet, still in, or done for the day.
export function attendanceStatus(record: { clockOut: string | null } | null): string {
  if (!record) {
    return "Not clocked in";
  }

  if (!record.clockOut) {
    return "Currently in";
  }

  return "Completed";
}

// The time rules every form checks. Returns "" if valid, else a message.
export function checkTimes(
  date: string,
  clockIn: string,
  clockOut: string | null | undefined,
  settings: Settings,
): string {
  if (!date) {
    return "Please pick a date first.";
  }

  const todayDate = today();

  if (date > todayDate) {
    return "You cannot record attendance for a future date.";
  }

  if (date < todayDate) {
    return "You cannot record attendance for a past date.";
  }

  if (!isWorkingDay(date, settings)) {
    return `${dayName(date)} is not a working day. You can change that in Settings.`;
  }

  if (!clockIn) {
    return "Please enter a clock-in time.";
  }

  if (clockIn < settings.openingTime || clockIn > settings.closingTime) {
    return `Clock-in must be between ${settings.openingTime} and ${settings.closingTime}.`;
  }

  if (clockOut) {
    if (clockOut > settings.closingTime) {
      return `Clock-out cannot be later than ${settings.closingTime}.`;
    }

    if (clockOut <= clockIn) {
      return "Clock-out must be later than the clock-in time.";
    }
  }

  return "";
}
```

Read `checkTimes` top to bottom: it returns an **empty string** when everything is valid,
or a human-readable **message** otherwise. The controllers will show that message to the
caller.

**You should see**

No visible change. You use these functions in the controllers.

---

## STEP 35 — Install Zod and create the validators

**What are we doing?**

Installing Zod and creating `src/lib/validators.ts`, the schemas that validate incoming
data.

**Why do we need it?**

A user can send anything in a request body. Zod describes what valid data looks like and
checks it. If the data fails, the controller replies `400` and refuses.

**Read:** <https://zod.dev> — Zod's documentation; its examples match the schemas you write
in this step.

In the terminal, type:

```powershell
npm install zod
```

Create a file `src/lib/validators.ts`. Type exactly:

```ts
import { z } from "zod";

// Mirrors the student form (fullNames, track, status).
export const studentSchema = z.object({
  fullNames: z.string().trim().min(1, "Please enter the student's name."),
  track: z.enum(["frontend", "backend"]),
  status: z.enum(["active", "inactive"]).default("active"),
});
export type StudentInput = z.infer<typeof studentSchema>;

export const studentUpdateSchema = studentSchema.partial();

// Mirrors the clock-in form.
export const clockInSchema = z.object({
  studentId: z.string().uuid(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD."),
  clockIn: z.string().regex(/^\d{2}:\d{2}$/, "Clock-in must be HH:MM."),
});
export type ClockInInput = z.infer<typeof clockInSchema>;

export const clockOutSchema = z.object({
  clockOut: z.string().regex(/^\d{2}:\d{2}$/, "Clock-out must be HH:MM."),
});
export type ClockOutInput = z.infer<typeof clockOutSchema>;

// Mirrors the correction dialog (clock-in + clock-out together).
export const correctionSchema = z.object({
  clockIn: z.string().regex(/^\d{2}:\d{2}$/, "Clock-in must be HH:MM."),
  clockOut: z.string().regex(/^\d{2}:\d{2}$/, "Clock-out must be HH:MM.").nullable().optional(),
});
export type CorrectionInput = z.infer<typeof correctionSchema>;

// Mirrors the settings form.
export const settingsSchema = z.object({
  workingDays: z.array(z.number().int().min(0).max(6)).min(1, "Pick at least one working day."),
  openingTime: z.string().regex(/^\d{2}:\d{2}$/, "Opening time must be HH:MM."),
  closingTime: z.string().regex(/^\d{2}:\d{2}$/, "Closing time must be HH:MM."),
});
export type SettingsInput = z.infer<typeof settingsSchema>;
```

Each schema mirrors one form in the app. `z.enum(...)` means "only these values".
`z.string().regex(...)` means "must match this pattern". `z.array(...).min(1)` means "at
least one working day".

**You should see**

No visible change. You call `safeParse` in the controllers.

---

## STEP 36 — Install CORS and allow cross-origin requests

**What are we doing?**

Installing the `cors` package and its types.

**Why do we need it?**

Browsers block a page on one port from reading a response on another port unless the
server allows it. Later, the React frontend will run on port `5173` while this API runs on
`4000`. The `cors` middleware adds the headers that say "the browser may read this."

**Read:** <https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS> — why browsers enforce
CORS at all, and what the headers mean.

In the terminal, type:

```powershell
npm install cors
npm install -D @types/cors
```

**You should see**

`cors` appears in `"dependencies"` and `@types/cors` in `"devDependencies"`.

---

## STEP 37 — Create the settings controller

**What are we doing?**

Creating `src/controllers/settings.controller.ts`, your first controller.

**Why do we need it?**

Settings is the simplest feature — one row, read it or update it — so it is the first
complete slice of the pipeline. Once this works, students and attendance follow the same
pattern.

Create a folder `src/controllers`, and inside it a file named `settings.controller.ts`.
Type exactly:

```ts
import type { Request, Response } from "express";
import { eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { settings } from "../db/schema.js";
import { settingsSchema } from "../lib/validators.js";
import type { Settings } from "../db/schema.js";

// There is always exactly one settings row (id = 1).
export async function getOrCreateSettings(): Promise<Settings> {
  const [existing] = await db.select().from(settings).limit(1);

  if (existing) {
    return existing;
  }

  const [created] = await db
    .insert(settings)
    .values({
      workingDays: [0, 1, 2, 3, 4],
      openingTime: "09:00",
      closingTime: "17:00",
    })
    .returning();

  return created;
}

// GET /api/settings
export async function getSettings(_req: Request, res: Response) {
  const current = await getOrCreateSettings();
  res.json(current);
}

// PUT /api/settings
export async function updateSettings(req: Request, res: Response) {
  const parsed = settingsSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0].message });
  }

  const current = await getOrCreateSettings();

  const [updated] = await db
    .update(settings)
    .set(parsed.data)
    .where(eq(settings.id, current.id))
    .returning();

  res.json(updated);
}
```

Read `updateSettings` as the pattern every write endpoint follows:

1. **Validate** — `settingsSchema.safeParse(req.body)`; if it fails, reply `400` and stop.
2. **Act** — update the database and get the changed row back with `.returning()`.
3. **Respond** — send the updated row as JSON.

`getOrCreateSettings()` returns the single settings row, creating it with defaults if it
does not exist yet.

**You should see**

No visible change. You wire this controller to a URL next.

---

## STEP 38 — Create the settings routes

**What are we doing?**

Creating `src/routes/settings.routes.ts`, the file that maps URLs to the settings
controller.

**Why do we need it?**

Routes are the wiring. They say which HTTP method and path calls which controller function.

Create a folder `src/routes`, and inside it a file named `settings.routes.ts`. Type exactly:

```ts
import { Router } from "express";
import { getSettings, updateSettings } from "../controllers/settings.controller.js";

export const settingsRouter = Router();

settingsRouter.get("/", getSettings);
settingsRouter.put("/", updateSettings);
```

**You should see**

No visible change. You combine the routers next.

---

## STEP 39 — Combine the routers

**What are we doing?**

Creating `src/routes/index.ts`, the router that mounts all feature routers under `/api`.

**Why do we need it?**

`app.ts` mounts one router. That one router mounts the feature routers, so the app stays
flat and the features stay separate.

Create a file `src/routes/index.ts`. Type exactly:

```ts
import { Router } from "express";
import { settingsRouter } from "./settings.routes.js";

export const apiRouter = Router();

apiRouter.use("/settings", settingsRouter);
```

Because `settingsRouter` has `get("/")` and `put("/")`, mounting it at `/settings` creates
`GET /api/settings` and `PUT /api/settings` (the `/api` prefix comes in the next step).

**You should see**

No visible change. You wire `apiRouter` into the app next.

---

## STEP 40 — Finish `app.ts`

**What are we doing?**

Replacing `app.ts` with the full version: CORS, JSON parsing, the `/api` mount, and the
404 and 500 handlers.

**Why do we need it?**

The minimal `app.ts` from Part 2 only had `/health`. The real app also parses JSON bodies,
allows CORS, routes `/api`, and answers nicely for unknown routes and server errors.

Open `src/app.ts` and replace its entire contents. Type exactly:

```ts
import express from "express";
import cors from "cors";
import type { Request, Response, NextFunction } from "express";
import { apiRouter } from "./routes/index.js";

export const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ message: "Welcome to the system" });
});

app.use("/api", apiRouter);

app.use((req: Request, res: Response) => {
  res.status(404).json({ error: `No route for ${req.method} ${req.path}` });
});

app.use((error: unknown, _req: Request, res: Response, _next: NextFunction) => {
  console.error(error);
  res.status(500).json({ error: "Something went wrong. Please try again." });
});
```

Read it as a pipeline: `cors()` adds CORS headers, `express.json()` parses `req.body`,
`/api` routes to your feature routers, the next handler catches unknown routes with `404`,
and the last one catches any thrown error with `500`.

**You should see**

The server restarts automatically (tsx watch). The terminal may reprint the startup line.

---

## STEP 41 — Test settings in Postman

**What are we doing?**

Reading and updating settings through the API.

**Why do we need it?**

This is the first end-to-end proof that the full pipeline works: Postman → route →
controller → Zod → Drizzle → PostgreSQL → JSON.

If the server stopped, start it again:

```powershell
npm run dev
```

**1. Read settings.** In Postman, `GET http://localhost:4000/api/settings`, then Send.

**You should see**

```json
{
  "id": 1,
  "workingDays": [0, 1, 2, 3, 4],
  "openingTime": "09:00",
  "closingTime": "17:00"
}
```

**2. Update settings.** Set the method to `PUT`, keep the URL, click the **Body** tab,
choose **raw** and **JSON**, and paste:

```json
{
  "workingDays": [0, 1, 2, 3, 4],
  "openingTime": "08:00",
  "closingTime": "18:00"
}
```

Click **Send**.

**You should see**

The same shape as before, now with `"openingTime": "08:00"` and `"closingTime": "18:00"`.

**3. Break a rule.** Change the body to have zero working days and Send again:

```json
{
  "workingDays": [],
  "openingTime": "08:00",
  "closingTime": "18:00"
}
```

**You should see**

Status `400 Bad Request` and:

```json
{
  "error": "Pick at least one working day."
}
```

**STOP HERE**

If the `GET` returns `404` with `No route for GET /api/settings`, your `app.ts` or
`routes/index.ts` is missing the mount — re-check STEP 39 and STEP 40. If the `PUT`
returns `400` when it should succeed, check the body is **raw → JSON**, not text.

Change settings back to `09:00`–`17:00` before continuing:

```json
{
  "workingDays": [0, 1, 2, 3, 4],
  "openingTime": "09:00",
  "closingTime": "17:00"
}
```

---

You have finished Part 4's first slice. The architecture is in place and one full feature
(settings) works end to end.

---

# Part 5 — Students and attendance

Part 5 builds the two remaining features. For each, you are shown the first endpoints in
full and then implement the rest yourself. Full reference solutions are in the Solutions
appendix at the end of the manual.

---

## STEP 42 — Create the students controller

**What are we doing?**

Creating `src/controllers/students.controller.ts`. You write the list and create endpoints
now, and implement the other three as an exercise.

**Why do we need it?**

Students are the core resource. Every attendance record points at a student.

Create a file `src/controllers/students.controller.ts`. Type exactly:

```ts
import type { Request, Response } from "express";
import { eq, ilike } from "drizzle-orm";
import { db } from "../db/index.js";
import { students } from "../db/schema.js";
import { studentSchema, studentUpdateSchema } from "../lib/validators.js";

// GET /api/students?search=jane
export async function getStudents(req: Request, res: Response) {
  const search = typeof req.query.search === "string" ? req.query.search.trim() : "";

  const rows = search
    ? await db.select().from(students).where(ilike(students.fullNames, `%${search}%`))
    : await db.select().from(students);

  res.json(rows);
}

// POST /api/students
export async function createStudent(req: Request, res: Response) {
  const parsed = studentSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0].message });
  }

  const [student] = await db.insert(students).values(parsed.data).returning();

  res.status(201).json(student);
}
```

Read `createStudent` — it is the same validate → act → respond pattern as `updateSettings`:

1. `studentSchema.safeParse(req.body)` validates the body.
2. `db.insert(students).values(parsed.data).returning()` inserts and returns the new row.
3. `res.status(201).json(student)` answers `201 Created` with the row.

`getStudents` returns every student, or, when `?search=` is present, only the students whose
name contains the search text (case-insensitive via `ilike`).

---

## EXERCISE 42 — Implement the other three student endpoints

Implement these three functions in the same file. The imports are already in place. The
full reference solution is in the Solutions appendix — write yours first, then compare.

**`getStudentById` — `GET /api/students/:id`**

Requirements:

- Use `eq(students.studentId, req.params.id)` to select one student.
- If no student is found, return `res.status(404).json({ error: "Student does not exist." })`.
- Otherwise return `res.json(student)`.

**`updateStudent` — `PUT /api/students/:id`**

Requirements:

- Validate `req.body` with `studentUpdateSchema.safeParse(req.body)`.
- If it fails, return `400` with `{ error: <first issue message> }`.
- Update with `db.update(students).set(parsed.data).where(eq(students.studentId, req.params.id)).returning()`.
- If the result is empty, return `404` with `{ error: "Student does not exist." }`.
- Otherwise return `res.json(student)`.

**`deleteStudent` — `DELETE /api/students/:id`**

Requirements:

- Delete with `db.delete(students).where(eq(students.studentId, req.params.id)).returning()`.
- If the result is empty, return `404` with `{ error: "Student does not exist." }`.
- Otherwise return `res.status(204).send()` (no body).

**Expected Postman responses** (you test them in STEP 44):

- `GET /api/students/:id` on a missing id → `404` `{ "error": "Student does not exist." }`
- `PUT /api/students/:id` with `{ "track": "frontend" }` → `200` with the updated student
- `DELETE /api/students/:id` → `204` with an empty body

---

## STEP 43 — Create the students routes

**What are we doing?**

Creating `src/routes/students.routes.ts`.

**Why do we need it?**

This maps the five student URLs to the five controller functions.

Create a file `src/routes/students.routes.ts`. Type exactly:

```ts
import { Router } from "express";
import {
  getStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
} from "../controllers/students.controller.js";

export const studentsRouter = Router();

studentsRouter.get("/", getStudents);
studentsRouter.get("/:id", getStudentById);
studentsRouter.post("/", createStudent);
studentsRouter.put("/:id", updateStudent);
studentsRouter.delete("/:id", deleteStudent);
```

`/:id` is a **route parameter** — `GET /api/students/abc` calls `getStudentById` with
`req.params.id === "abc"`.

**You should see**

No visible change yet. You mount it next.

---

## STEP 44 — Mount students and test every endpoint

**What are we doing?**

Adding students to `routes/index.ts` and exercising all five endpoints in Postman.

**Why do we need it?**

This proves students work end to end, including your three exercise functions.

Open `src/routes/index.ts` and add the students router. It now reads:

```ts
import { Router } from "express";
import { studentsRouter } from "./students.routes.js";
import { settingsRouter } from "./settings.routes.js";

export const apiRouter = Router();

apiRouter.use("/students", studentsRouter);
apiRouter.use("/settings", settingsRouter);
```

Now in Postman, work through these in order:

**1. Create a student.** `POST http://localhost:4000/api/students`, body raw → JSON:

```json
{
  "fullNames": "Ada Lovelace",
  "track": "backend",
  "status": "active"
}
```

**You should see** status `201` and a body with a `studentId` you did not choose (the
database generated it), plus the fields you sent. **Copy the `studentId`** — you use it
below.

**2. List students.** `GET http://localhost:4000/api/students`.

**You should see** an array containing your student.

**3. Search.** `GET http://localhost:4000/api/students?search=ada`.

**You should see** the array with Ada in it.

**4. Get one.** `GET http://localhost:4000/api/students/<studentId>`.

**You should see** the single student object.

**5. Update.** `PUT http://localhost:4000/api/students/<studentId>`, body raw → JSON:

```json
{
  "track": "frontend"
}
```

**You should see** the student with `"track": "frontend"`.

**6. Delete.** `DELETE http://localhost:4000/api/students/<studentId>`.

**You should see** status `204` with an empty body. Listing students again shows an empty
array.

**STOP HERE**

If any step returns `404` on a real id, re-check your `getStudentById`/`updateStudent`/
`deleteStudent` against the Solutions appendix. If the `POST` returns `400`, check the body
is raw → JSON.

---

## STEP 45 — Create the attendance controller

**What are we doing?**

Creating `src/controllers/attendance.controller.ts`. You write the register view and
clock-in now, and implement clock-out, correction, and removal as an exercise.

**Why do we need it?**

Attendance is the heart of the app: one record per student per day, with status and daily
total computed by the server.

Create a file `src/controllers/attendance.controller.ts`. Type exactly:

```ts
import type { Request, Response } from "express";
import { and, eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { attendance, students } from "../db/schema.js";
import { clockInSchema, clockOutSchema, correctionSchema } from "../lib/validators.js";
import { checkTimes, isWorkingDay, dayName, attendanceStatus, dailyTotal } from "../lib/utils.js";
import { getOrCreateSettings } from "./settings.controller.js";

// One record for one student on one day.
async function findRecord(studentId: string, date: string) {
  const [record] = await db
    .select()
    .from(attendance)
    .where(and(eq(attendance.studentId, studentId), eq(attendance.date, date)));

  return record ?? null;
}

// GET /api/attendance?date=YYYY-MM-DD&search=jane
export async function getAttendanceForDate(req: Request, res: Response) {
  const date = typeof req.query.date === "string" ? req.query.date : "";
  const search = typeof req.query.search === "string" ? req.query.search.trim().toLowerCase() : "";

  if (!date) {
    return res.status(400).json({ error: "Please pick a date first." });
  }

  const settings = await getOrCreateSettings();

  const activeStudents = await db.select().from(students).where(eq(students.status, "active"));
  const dayRecords = await db.select().from(attendance).where(eq(attendance.date, date));

  const filtered = search
    ? activeStudents.filter((student) =>
        `${student.fullNames} ${student.track}`.toLowerCase().includes(search),
      )
    : activeStudents;

  const rows = filtered.map((student) => {
    const record = dayRecords.find((r) => r.studentId === student.studentId) ?? null;

    return {
      student,
      record,
      status: attendanceStatus(record),
      total: dailyTotal(record),
    };
  });

  const stillIn = dayRecords.filter((record) => !record.clockOut);

  res.json({
    date,
    isWorkingDay: isWorkingDay(date, settings),
    dayName: dayName(date),
    notice: isWorkingDay(date, settings)
      ? `${dayRecords.length} clocked in on ${date}, ${stillIn.length} still in.`
      : `${dayName(date)} is not a working day, so nobody can be clocked in.`,
    rows,
  });
}

// POST /api/attendance/clock-in
export async function clockIn(req: Request, res: Response) {
  const parsed = clockInSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0].message });
  }

  const { studentId, date, clockIn: clockInTime } = parsed.data;

  const settings = await getOrCreateSettings();
  const error = checkTimes(date, clockInTime, null, settings);

  if (error) {
    return res.status(400).json({ error });
  }

  const existing = await findRecord(studentId, date);

  if (existing) {
    return res.status(409).json({ error: "This student is already clocked in for that date." });
  }

  const [record] = await db
    .insert(attendance)
    .values({ studentId, date, clockIn: clockInTime })
    .returning();

  res.status(201).json(record);
}
```

Read `getAttendanceForDate`: it returns **one row per active student**, and each row carries
the student, their record for that day (or `null`), a computed `status`, and a computed
`total`. Rows come from students; records are optional.

Read `clockIn`: it validates the body, then checks the time rules with `checkTimes`, then
refuses a second record for the same student and date with `409`.

---

## EXERCISE 45 — Implement clock-out, correction, and removal

Implement these three functions in the same file. The imports are already in place. Full
reference solutions are in the Solutions appendix.

**`clockOut` — `PUT /api/attendance/:id/clock-out`**

Requirements:

- Validate `req.body` with `clockOutSchema.safeParse(req.body)`; on failure return `400`.
- Find the record by `eq(attendance.attendanceId, req.params.id)`; if missing return `404`
  with `{ error: "Attendance record does not exist." }`.
- Call `checkTimes(existing.date, existing.clockIn, parsed.data.clockOut, settings)`; if it
  returns a message, return `400` with that message.
- Update `clockOut` on the record and return the updated record.

**`correctAttendance` — `PUT /api/attendance/:id`**

Requirements:

- Validate with `correctionSchema.safeParse`; on failure return `400`.
- Find the record; if missing return `404` with `{ error: "Attendance record does not exist." }`.
- Call `checkTimes(existing.date, parsed.data.clockIn, parsed.data.clockOut, settings)`; if
  it returns a message, return `400` with that message.
- Update both `clockIn` and `clockOut` (use `parsed.data.clockOut ?? null`) and return the
  record.

**`removeAttendance` — `DELETE /api/attendance/:id`**

Requirements:

- Delete by `eq(attendance.attendanceId, req.params.id)` with `.returning()`.
- If the result is empty, return `404` with `{ error: "Attendance record does not exist." }`.
- Otherwise return `res.status(204).send()`.

**Expected Postman responses** (you test them in STEP 47):

- A clock-out earlier than clock-in → `400` `{ "error": "Clock-out must be later than the clock-in time." }`
- A correction on a missing id → `404` `{ "error": "Attendance record does not exist." }`
- A removal → `204` with an empty body

---

## STEP 46 — Create the attendance routes

**What are we doing?**

Creating `src/routes/attendance.routes.ts`.

**Why do we need it?**

It maps the five attendance URLs to the five controller functions. Note the order: the
specific path `/clock-in` is declared before the parameter path `/:id`.

Create a file `src/routes/attendance.routes.ts`. Type exactly:

```ts
import { Router } from "express";
import {
  getAttendanceForDate,
  clockIn,
  clockOut,
  correctAttendance,
  removeAttendance,
} from "../controllers/attendance.controller.js";

export const attendanceRouter = Router();

attendanceRouter.get("/", getAttendanceForDate);
attendanceRouter.post("/clock-in", clockIn);
attendanceRouter.put("/:id/clock-out", clockOut);
attendanceRouter.put("/:id", correctAttendance);
attendanceRouter.delete("/:id", removeAttendance);
```

**You should see**

No visible change. You mount it next.

---

## STEP 47 — Mount attendance and test it

**What are we doing?**

Adding attendance to `routes/index.ts` and exercising the whole flow in Postman.

**Why do we need it?**

This is the final feature. When it works, the backend is complete.

Open `src/routes/index.ts`. It now reads:

```ts
import { Router } from "express";
import { studentsRouter } from "./students.routes.js";
import { attendanceRouter } from "./attendance.routes.js";
import { settingsRouter } from "./settings.routes.js";

export const apiRouter = Router();

apiRouter.use("/students", studentsRouter);
apiRouter.use("/attendance", attendanceRouter);
apiRouter.use("/settings", settingsRouter);
```

First create a student to clock in (if you deleted yours in STEP 44):

`POST http://localhost:4000/api/students` with body:

```json
{
  "fullNames": "Grace Hopper",
  "track": "frontend",
  "status": "active"
}
```

Copy the returned `studentId`.

Find today's date. In a PowerShell terminal, type:

```powershell
Get-Date -Format "yyyy-MM-dd"
```

**1. Clock in.** `POST http://localhost:4000/api/attendance/clock-in`, body raw → JSON
(use your real date and your `studentId`):

```json
{
  "studentId": "<your-studentId>",
  "date": "2026-08-04",
  "clockIn": "08:15"
}
```

**You should see** status `201` and a record with `"clockOut": null`. Copy the returned
`attendanceId`.

**2. View the register.** `GET http://localhost:4000/api/attendance?date=2026-08-04`.

**You should see** an object with `date`, `isWorkingDay`, `dayName`, `notice`, and `rows`.
Grace's row shows `"status": "Currently in"` and `"total": "—"`.

**3. Clock out.** `PUT http://localhost:4000/api/attendance/<attendanceId>/clock-out`, body:

```json
{
  "clockOut": "16:45"
}
```

**You should see** the record with `"clockOut": "16:45"`.

Re-open the register — Grace's row now shows `"status": "Completed"` and `"total": "8h 30m"`.

**4. Break a rule.** Clock out again with a time before the clock-in:

```json
{
  "clockOut": "07:00"
}
```

**You should see** status `400` and:

```json
{
  "error": "Clock-out must be later than the clock-in time."
}
```

**5. Correct the record.** `PUT http://localhost:4000/api/attendance/<attendanceId>`, body:

```json
{
  "clockIn": "09:00",
  "clockOut": "17:00"
}
```

**You should see** the record with the corrected times.

**6. Remove the record.** `DELETE http://localhost:4000/api/attendance/<attendanceId>`.

**You should see** status `204` with an empty body.

**STOP HERE**

If any step returns `404`, check the endpoint order in `attendance.routes.ts` and your
exercise functions against the Solutions appendix. If clock-in returns `400`, confirm the
date is today's date and the time is within `09:00`–`17:00`.

---

## STEP 48 — Verify the cascade delete

**What are we doing?**

Proving that deleting a student also deletes their attendance.

**Why do we need it?**

This is the `ON DELETE cascade` you wrote in the schema. There is no code for it in any
controller — the database does it.

1. Clock Grace in again for today (reuse STEP 47 step 1).
2. Confirm her row exists in the register.
3. Delete Grace: `DELETE http://localhost:4000/api/students/<grace-studentId>`.
4. Open the register again: `GET http://localhost:4000/api/attendance?date=2026-08-04`.

**You should see**

Grace's row is gone, and her attendance record is gone with it — because the foreign key
has `ON DELETE cascade`. You can also see this in DBeaver: the `attendance` table no longer
contains a row with her `student_id`.

**STOP HERE**

If the attendance rows remained after deleting the student, your schema's foreign key is
missing `onDelete: "cascade"`. Re-check STEP 25, regenerate and re-migrate.

---

You have finished Part 5. The full backend is complete: students, attendance, settings,
validation, cascade delete, migrations, and seed data.

---

# Part 6 — Solutions, checklist, and troubleshooting

---

## Solutions appendix

This is the complete, working code for the endpoints you implemented in EXERCISE 42 and
EXERCISE 45. Write your own first, then compare line by line. If a test failed, the
difference between yours and this is usually the bug.

### `src/controllers/students.controller.ts` (complete)

```ts
import type { Request, Response } from "express";
import { eq, ilike } from "drizzle-orm";
import { db } from "../db/index.js";
import { students } from "../db/schema.js";
import { studentSchema, studentUpdateSchema } from "../lib/validators.js";

// GET /api/students?search=jane
export async function getStudents(req: Request, res: Response) {
  const search = typeof req.query.search === "string" ? req.query.search.trim() : "";

  const rows = search
    ? await db.select().from(students).where(ilike(students.fullNames, `%${search}%`))
    : await db.select().from(students);

  res.json(rows);
}

// GET /api/students/:id
export async function getStudentById(req: Request, res: Response) {
  const [student] = await db
    .select()
    .from(students)
    .where(eq(students.studentId, req.params.id));

  if (!student) {
    return res.status(404).json({ error: "Student does not exist." });
  }

  res.json(student);
}

// POST /api/students
export async function createStudent(req: Request, res: Response) {
  const parsed = studentSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0].message });
  }

  const [student] = await db.insert(students).values(parsed.data).returning();

  res.status(201).json(student);
}

// PUT /api/students/:id
export async function updateStudent(req: Request, res: Response) {
  const parsed = studentUpdateSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0].message });
  }

  const [student] = await db
    .update(students)
    .set(parsed.data)
    .where(eq(students.studentId, req.params.id))
    .returning();

  if (!student) {
    return res.status(404).json({ error: "Student does not exist." });
  }

  res.json(student);
}

// DELETE /api/students/:id
export async function deleteStudent(req: Request, res: Response) {
  const [student] = await db
    .delete(students)
    .where(eq(students.studentId, req.params.id))
    .returning();

  if (!student) {
    return res.status(404).json({ error: "Student does not exist." });
  }

  res.status(204).send();
}
```

### `src/controllers/attendance.controller.ts` (complete)

```ts
import type { Request, Response } from "express";
import { and, eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { attendance, students } from "../db/schema.js";
import { clockInSchema, clockOutSchema, correctionSchema } from "../lib/validators.js";
import { checkTimes, isWorkingDay, dayName, attendanceStatus, dailyTotal } from "../lib/utils.js";
import { getOrCreateSettings } from "./settings.controller.js";

// One record for one student on one day.
async function findRecord(studentId: string, date: string) {
  const [record] = await db
    .select()
    .from(attendance)
    .where(and(eq(attendance.studentId, studentId), eq(attendance.date, date)));

  return record ?? null;
}

// GET /api/attendance?date=YYYY-MM-DD&search=jane
export async function getAttendanceForDate(req: Request, res: Response) {
  const date = typeof req.query.date === "string" ? req.query.date : "";
  const search = typeof req.query.search === "string" ? req.query.search.trim().toLowerCase() : "";

  if (!date) {
    return res.status(400).json({ error: "Please pick a date first." });
  }

  const settings = await getOrCreateSettings();

  const activeStudents = await db.select().from(students).where(eq(students.status, "active"));
  const dayRecords = await db.select().from(attendance).where(eq(attendance.date, date));

  const filtered = search
    ? activeStudents.filter((student) =>
        `${student.fullNames} ${student.track}`.toLowerCase().includes(search),
      )
    : activeStudents;

  const rows = filtered.map((student) => {
    const record = dayRecords.find((r) => r.studentId === student.studentId) ?? null;

    return {
      student,
      record,
      status: attendanceStatus(record),
      total: dailyTotal(record),
    };
  });

  const stillIn = dayRecords.filter((record) => !record.clockOut);

  res.json({
    date,
    isWorkingDay: isWorkingDay(date, settings),
    dayName: dayName(date),
    notice: isWorkingDay(date, settings)
      ? `${dayRecords.length} clocked in on ${date}, ${stillIn.length} still in.`
      : `${dayName(date)} is not a working day, so nobody can be clocked in.`,
    rows,
  });
}

// POST /api/attendance/clock-in
export async function clockIn(req: Request, res: Response) {
  const parsed = clockInSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0].message });
  }

  const { studentId, date, clockIn: clockInTime } = parsed.data;

  const settings = await getOrCreateSettings();
  const error = checkTimes(date, clockInTime, null, settings);

  if (error) {
    return res.status(400).json({ error });
  }

  const existing = await findRecord(studentId, date);

  if (existing) {
    return res.status(409).json({ error: "This student is already clocked in for that date." });
  }

  const [record] = await db
    .insert(attendance)
    .values({ studentId, date, clockIn: clockInTime })
    .returning();

  res.status(201).json(record);
}

// PUT /api/attendance/:id/clock-out
export async function clockOut(req: Request, res: Response) {
  const parsed = clockOutSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0].message });
  }

  const [existing] = await db
    .select()
    .from(attendance)
    .where(eq(attendance.attendanceId, req.params.id));

  if (!existing) {
    return res.status(404).json({ error: "Attendance record does not exist." });
  }

  const settings = await getOrCreateSettings();
  const error = checkTimes(existing.date, existing.clockIn, parsed.data.clockOut, settings);

  if (error) {
    return res.status(400).json({ error });
  }

  const [record] = await db
    .update(attendance)
    .set({ clockOut: parsed.data.clockOut })
    .where(eq(attendance.attendanceId, req.params.id))
    .returning();

  res.json(record);
}

// PUT /api/attendance/:id
export async function correctAttendance(req: Request, res: Response) {
  const parsed = correctionSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0].message });
  }

  const [existing] = await db
    .select()
    .from(attendance)
    .where(eq(attendance.attendanceId, req.params.id));

  if (!existing) {
    return res.status(404).json({ error: "Attendance record does not exist." });
  }

  const settings = await getOrCreateSettings();
  const error = checkTimes(existing.date, parsed.data.clockIn, parsed.data.clockOut, settings);

  if (error) {
    return res.status(400).json({ error });
  }

  const [record] = await db
    .update(attendance)
    .set({ clockIn: parsed.data.clockIn, clockOut: parsed.data.clockOut ?? null })
    .where(eq(attendance.attendanceId, req.params.id))
    .returning();

  res.json(record);
}

// DELETE /api/attendance/:id
export async function removeAttendance(req: Request, res: Response) {
  const [record] = await db
    .delete(attendance)
    .where(eq(attendance.attendanceId, req.params.id))
    .returning();

  if (!record) {
    return res.status(404).json({ error: "Attendance record does not exist." });
  }

  res.status(204).send();
}
```

---

## Final project structure

When you are done, your `backend` folder looks like this:

```text
backend/
├── .env                 # your secrets (never commit)
├── .env.example         # the template
├── .gitignore
├── drizzle.config.ts
├── package.json
├── tsconfig.json
├── drizzle/             # generated SQL migrations
│   └── 0000_<name>.sql
└── src/
    ├── server.ts
    ├── app.ts
    ├── controllers/
    │   ├── attendance.controller.ts
    │   ├── settings.controller.ts
    │   └── students.controller.ts
    ├── db/
    │   ├── index.ts
    │   ├── migrate.ts
    │   ├── schema.ts
    │   └── seed.ts
    ├── lib/
    │   ├── utils.ts
    │   └── validators.ts
    └── routes/
        ├── attendance.routes.ts
        ├── index.ts
        ├── settings.routes.ts
        └── students.routes.ts
```

Two notes about the folders **not** in this tree:

- `dist/` is created by `npm run build` and is never committed (it is in
  `.gitignore`). Because `tsconfig.json` uses `"rootDir": "."` and compiles
  `drizzle.config.ts` too, the output mirrors the source: `dist/src/server.js`,
  `dist/src/app.js`, the controllers and routes under `dist/src/...`, and a
  `dist/drizzle.config.js` at the top. `npm start` runs `node dist/src/server.js`.
- `drizzle/` holds the generated SQL migrations. The `.sql` files are read by Drizzle
  Kit directly — they are not TypeScript, so the compiler never touches them.

## The complete endpoint reference

| Method | Path | What it does | Success |
| --- | --- | --- | --- |
| `GET` | `/health` | welcome check | `200` |
| `GET` | `/api/students` | list students | `200` |
| `GET` | `/api/students?search=` | search by name | `200` |
| `GET` | `/api/students/:id` | one student | `200` / `404` |
| `POST` | `/api/students` | create student | `201` |
| `PUT` | `/api/students/:id` | update student | `200` / `404` |
| `DELETE` | `/api/students/:id` | delete student (+ attendance) | `204` / `404` |
| `GET` | `/api/attendance?date=` | the day's register | `200` / `400` |
| `POST` | `/api/attendance/clock-in` | clock in | `201` / `400` / `409` |
| `PUT` | `/api/attendance/:id/clock-out` | clock out | `200` / `400` / `404` |
| `PUT` | `/api/attendance/:id` | correct a record | `200` / `400` / `404` |
| `DELETE` | `/api/attendance/:id` | remove a record | `204` / `404` |
| `GET` | `/api/settings` | read settings | `200` |
| `PUT` | `/api/settings` | update settings | `200` / `400` |

## Final self-check

Before you call the backend done, every one of these must be true:

- [ ] `npm run dev` starts and prints `Attendance API running on http://localhost:4000`.
- [ ] `GET /health` returns `{ "message": "Welcome to the system" }`.
- [ ] You can create, list, search, view, update, and delete a student.
- [ ] You can clock a student in and out, correct a record, and remove a record.
- [ ] Clock-out before clock-in is refused with a `400`.
- [ ] A second clock-in for the same student and day is refused with a `409`.
- [ ] The register shows each active student with a computed status and daily total.
- [ ] The daily total matches your own calculation (`08:15` to `16:45` → `8h 30m`).
- [ ] Updating settings with zero working days is refused with a `400`.
- [ ] Deleting a student also removes their attendance (visible in the register and DBeaver).
- [ ] An unknown route returns `404` with a JSON error.
- [ ] No red errors appear in the server terminal while testing.

## Troubleshooting

| Symptom | Cause | Fix |
| --- | --- | --- |
| `node : The term 'node' is not recognized` | Node not installed or not on PATH | STEP 1–2 |
| `psql`/`createdb` not recognized | Postgres `bin` not on PATH | STEP 4 |
| `password authentication failed` | wrong password in `DATABASE_URL` | STEP 22 |
| `database "attendance_db" does not exist` | database not created | STEP 5 |
| `Migration failed:` connection error | Postgres not running or wrong URL | STEP 5, 22, 29 |
| `Cannot find module 'express'` | dependency not installed | STEP 14 |
| `Unknown file extension ".ts"` | `"type": "module"` missing | STEP 13 |
| `ERR_MODULE_NOT_FOUND ... ./app.js` | `.js` extension missing on a relative import | STEP 18, 30 |
| `EADDRINUSE :4000` | another server running | close the other terminal, or change `PORT` |
| `404 No route for GET /api/…` | router not mounted | STEP 39, 40, 44, 47 |
| `400` with a Zod message | body is not valid JSON or wrong shape | use Body → raw → JSON in Postman |
| `409` on clock-in | already clocked in for that date | one record per student/day |
| CORS error in browser (later) | `app.use(cors())` missing | STEP 36, 40 |
| Server error `500` | an exception was thrown — read the terminal stack trace | STEP 40 |
| `npm start` says `Cannot find module ... dist/server.js` | the build output lives in `dist/src/` because `tsconfig.json` sets `"rootDir": "."` | run `node dist/src/server.js`, or fix the `start` script and `main` in `package.json` (STEP 18) |
| `npm run build` puts files under `dist/src/` | expected — see STEP 16's `rootDir` explanation | nothing to fix |

---

*End of the backend lab manual. The backend is complete and verified. The next manual —
`frontend-lab-manual.md` — builds the React frontend that consumes these endpoints.
It assumes you finished this manual and starts from the JavaScript you need to know.*




