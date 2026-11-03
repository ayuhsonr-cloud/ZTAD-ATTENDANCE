# ZTAD Student Attendance System — Frontend Lab Manual

This manual takes you from a computer with a working backend to a complete React
frontend. You will build the **frontend** of the ZTAD Student Attendance System with
React, TypeScript, Vite, TanStack Query, and TanStack Router, and verify it in your
browser.

It is written for someone who finished the Backend Lab Manual and has never written
JavaScript or React before. Nothing is assumed: every idea is explained the first time
it appears, and you build the app one small, verified step at a time.

## What you are building

At the end of this manual you will have a web application running at
`http://localhost:5173` that talks to the API you built in the backend manual
(`http://localhost:4000`). It provides:

- **Students** — a page that lists students from the API, searches them, and adds,
  edits, and deletes them.
- **Attendance** — a daily register that shows every active student with their
  clock-in, clock-out, status, and daily total, and lets you clock in, clock out,
  correct, and remove records.
- **Settings** — a dialog that changes the working days and the opening/closing
  times, saved through the API.
- **Navigation** — a header with links that works on desktop and a slide-in menu on
  mobile.
- **Error handling** — backend error messages appear inside the form that caused
  them, without losing what you typed.

You build it one small, verified step at a time. You do not copy a finished project.

## How to use this manual

Every step has the same shape:

- **What are we doing?** — one sentence describing the step.
- **Why do we need it?** — the reason it exists.
- **Type exactly** — the commands to run or the file to create, written out in full.
- **You should see** — the exact expected result.
- **STOP HERE** — if you did not get the expected result, stop and fix it before you
  continue. Jump to the troubleshooting note under the step, or to the troubleshooting
  table at the end.

Read every line. Do not skip a step. Do not continue past a step that does not produce
the expected result. The whole manual is built so that each step is only possible
because the previous step worked.

Links to the official documentation appear throughout. Read the linked pages when a
step tells you to. They are short pages written for beginners, and they teach more than
a manual alone can.

## The project folder

You finished the backend manual, so your computer already has this structure:

```text
Fullstack/
├── backend/     <- your working API, built in the backend manual
└── frontend/    <- everything in this manual happens here
```

The `frontend/` folder is currently empty. You will fill it starting in Part 2.

The completed reference solution for everything you build lives in the repository next
to this manual, in the `frontend/` folder of the repo. When a step does not behave as
expected, compare your file with the matching reference file — the difference is
usually the bug.

## What you need before you start

- **Node.js and npm** — installed and verified in the backend manual (Part 1,
  STEP 1–2).
- **Your backend running** on `http://localhost:4000`. In one PowerShell window, start
  it now:

```powershell
cd Fullstack\backend
npm run dev
```

- **A browser** — Chrome or Edge, because their developer tools work the same way.
- **VS Code** — you already use it from the backend manual.

**STOP HERE**

If `npm run dev` in the backend does not print
`Attendance API running on http://localhost:4000`, fix that first — go back to the
backend manual. Nothing in this manual works without the API.

Now open a browser tab and go to `http://localhost:4000/health`.

**You should see**

```json
{ "message": "Welcome to the system" }
```

This is the same check you did in the backend manual (STEP 20). Leave the backend
running; every later step depends on it.

---

# Part 1 — JavaScript you need before React

Part 1 teaches the JavaScript you must understand to read and write the React code in
this manual. You type each example into the browser's developer console and see the
result immediately. No project files are involved.

---

## STEP 1 — What JavaScript is

**What are we doing?**

Learning where JavaScript runs and why you need it for a frontend.

**Why do we need it?**

You already used JavaScript without knowing it: every file in your backend is
JavaScript (or TypeScript), and `npm` itself is a JavaScript program. But that
JavaScript runs in **Node.js**, a program on your computer. Frontend JavaScript runs
inside the **browser** and is what makes a web page interactive. React is a library
written in JavaScript that helps you build pages. Before React makes sense, you need
the core language.

One fact makes this easier: JavaScript and TypeScript are the same language with one
addition. TypeScript is JavaScript plus **types** — annotations that let your editor
catch mistakes before the code runs. Every file you create in this manual is
TypeScript (`.tsx`), and the browser cannot run it directly. **Vite**, your build tool,
converts it to plain JavaScript first. In this part you learn the JavaScript rules;
STEP 7 explains the small TypeScript part.

**Read:** <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide> — the
"Introduction" section. Do not read the whole guide; this manual uses only a small
part of JavaScript, and it explains each piece as you need it.

---

## STEP 2 — Values, variables, and template literals

**What are we doing?**

Learning the three kinds of values the app uses and how to store them in variables.

**Why do we need it?**

React code is mostly variables holding values — a student, a list of students, a
search text — and expressions that combine them.

Open your browser, press `F12` (or `Ctrl+Shift+I`), and click the **Console** tab.
This is a JavaScript playground: type a line, press Enter, and see the result.

**Values** are the things JavaScript stores and passes around. The kinds you will meet
constantly:

| Kind | Examples | Used for |
| --- | --- | --- |
| number | `1`, `4000`, `15.5` | counts, times in minutes |
| string | `"Ada"`, `"backend"`, `"2026-08-04"` | text, names, dates, times |
| boolean | `true`, `false` | yes/no answers |
| `null` | `null` | "nothing here" — an empty attendance record |
| `undefined` | (a variable with no value yet) | |

**Variables** store values under a name. There are two ways to create one:

1. In the console, type exactly:

```js
const firstName = "Ada"
```

2. Now type:

```js
firstName
```

**You should see**

```text
"Ada"
```

`const` makes a variable that cannot be reassigned — you use it for almost everything.
The other keyword, `let`, makes a variable that can be changed later. Prefer `const`
and change it to `let` only when JavaScript complains.

3. Type exactly:

```js
let age = 36
age = 37
```

**You should see**

```text
37
```

`age` changed because it was declared with `let`. Try the same with `firstName`:

```js
firstName = "Grace"
```

**You should see** an error: `TypeError: Assignment to constant variable.` That is
TypeScript/JavaScript protecting you. `const` means "this name always means this
value".

**Template literals** build strings that contain values. They use backticks (`` ` ``)
instead of quotes, and `${...}` inserts a value:

1. Type exactly:

```js
const fullName = "Ada Lovelace"
const track = "backend"
`${fullName} studies ${track}.`
```

**You should see**

```text
"Ada Lovelace studies backend."
```

React uses this everywhere — including inside JSX, where `${...}` becomes `{...}`.
You see that in Part 2.

**Read:** <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/const>
and <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals>.

---

## STEP 3 — Functions

**What are we doing?**

Learning how to write and call functions, the way you name a reusable piece of work.

**Why do we need it?**

Every React component is a function, and every button click calls a function. You
already wrote functions in the backend manual without naming the concept — a
controller like `createStudent` is a function.

There are two ways to write a function. They do the same thing; the second one (the
**arrow function**) is what React code uses.

1. In the console, type exactly:

```js
function double(x) {
  return x * 2
}
```

2. Now type:

```js
double(21)
```

**You should see**

```text
42
```

3. The arrow version, typed exactly:

```js
const double = (x) => x * 2
```

4. Call it:

```js
double(21)
```

**You should see** the same `42`.

Read the arrow form left to right: `const double =` (a variable named `double`)
`(x)` (it takes one input, `x`) `=>` (arrow, "becomes") `x * 2` (the value it
returns). The `return` keyword is implicit when the body is a single expression.

A function can take any number of inputs and return any value. It can also be passed
to another function — this is the most important idea in React:

1. Type exactly:

```js
const sayHello = () => "Hello!"
```

2. Now type:

```js
[1, 2, 3].map(() => sayHello())
```

**You should see**

```text
["Hello!", "Hello!", "Hello!"]
```

`map` called your function once for every item. In React you pass functions the same
way: `onClick={() => ...}` means "when clicked, call this function". You see that in
STEP 13.

**Read:** <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions>.

---

## STEP 4 — Objects and arrays

**What are we doing?**

Learning the two container types the whole app is built on: objects and arrays.

**Why do we need it?**

Every response from your API is either an object (one student, the register) or an
array of objects (the student list). You will read these shapes constantly.

**Objects** group named values together. A student from your API is an object:

1. In the console, type exactly:

```js
const student = {
  fullNames: "Ada Lovelace",
  track: "backend",
  status: "active",
}
```

2. Read one field with a dot:

```js
student.fullNames
```

**You should see**

```text
"Ada Lovelace"
```

3. Change a field and read it back:

```js
student.track = "frontend"
student.track
```

**You should see**

```text
"frontend"
```

The field names match the JSON your API returns — `fullNames`, `track`, `status` are
exactly the keys you saw in Postman in the backend manual.

**Arrays** hold a list of values in order:

1. Type exactly:

```js
const tracks = ["frontend", "backend"]
```

2. Ask how many items:

```js
tracks.length
```

**You should see**

```text
2
```

3. Read the item at position 1 (counting starts at 0):

```js
tracks[1]
```

**You should see**

```text
"backend"
```

The three array functions you will use every day are `map` (transform each item),
`filter` (keep some items), and `find` (get one item). Type exactly:

```js
const students = [
  { fullNames: "Ada", track: "backend" },
  { fullNames: "Grace", track: "frontend" },
  { fullNames: "Alan", track: "frontend" },
]
```

Now each one, one at a time:

```js
students.map((s) => s.fullNames)
```

**You should see**

```text
["Ada", "Grace", "Alan"]
```

```js
students.filter((s) => s.track === "frontend")
```

**You should see**

```text
[ { fullNames: "Grace", track: "frontend" }, { fullNames: "Alan", track: "frontend" } ]
```

```js
students.find((s) => s.fullNames === "Grace")
```

**You should see**

```text
{ fullNames: "Grace", track: "frontend" }
```

`map` returns a new array with every item transformed; `filter` returns a new array
with only the items where the check is `true`; `find` returns the first matching item
or `undefined`. You use all three in the React pages.

**Read:** <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map>,
<https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter>,
and <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find>.

---

## STEP 5 — Promises, async/await, and fetch

**What are we doing?**

Learning how JavaScript talks to your API: requests, responses, and the `fetch`
function.

**Why do we need it?**

Your frontend needs the data that lives in PostgreSQL behind your Express API. A
request over the network takes time — often a few milliseconds, sometimes longer. If
the page froze while waiting, every click would feel broken. JavaScript solves this
with **promises**: a promise is "a value that will arrive later". `fetch` returns a
promise, and `await` waits for it without freezing the page.

This is the request your app makes hundreds of times:

1. Make sure the backend is running. Open a tab at `http://localhost:4000/health`
   (you did this in "What you need before you start"). Press `F12`, click the
   **Console** tab.
2. Type exactly:

```js
const response = await fetch("http://localhost:4000/api/students")
```

**You should see**

```text
Response { type: "basic", status: 200, ok: true, ... }
```

`response` is the HTTP response. `ok: true` means the request succeeded — this is the
same `200 OK` you saw in Postman.

3. The API returns JSON — a text format. Convert it into a JavaScript array:

```js
const data = await response.json()
```

4. Look at it:

```js
data
```

**You should see**

```text
[ { studentId: "...", fullNames: "...", track: "...", status: "..." }, ... ]
```

This is the array of students you created in the backend manual. If it is empty
`[]`, create a student in Postman (`POST /api/students`) and repeat step 2–4 — the
browser does not cache it, so you will see the new student immediately.

Read the two lines as one story: `fetch` goes to the URL and returns a promise; `await`
waits for the response; `response.json()` returns another promise that resolves to the
parsed JSON. An `async` function is a function that can use `await`:

```js
async function loadStudents() {
  const response = await fetch("http://localhost:4000/api/students")
  return response.json()
}
```

In the browser console `await` works at the top level, which is why step 2 worked.
Inside real code it must be inside an `async` function — your React pages use `async`
functions exactly like this.

**What about errors?** The API tells you the outcome with a status code. Your React
code checks `response.ok` (200–299 means success) and, when it fails, reads the
`{ "error": "..." }` body your backend sends — the same messages you saw in Postman,
like `"Clock-out must be later than the clock-in time."`. The frontend shows those
messages to the user.

**Read:** <https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API> and
<https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function>.

---

## STEP 6 — Modules: `import` and `export`

**What are we doing?**

Learning how files share code with each other.

**Why do we need it?**

A React app is many files. One file holds the API client, another the students page,
another a reusable modal. Modules are the rules for making one file's code available
to another. You already used them in the backend: `import { app } from "./app.js"`.

Two keywords do everything:

- `export` — "this file offers this value to other files".
- `import` — "bring a value from another file into this one".

1. In the console, type exactly:

```js
const api = { name: "students" }
export { api }
```

2. Now type:

```js
import { api } from "./step6-demo.js"
```

**You should see** the import succeed in the console (it returns nothing) — the
export in step 1 is what made step 2 possible.

You will read imports like this constantly in the app:

```ts
import { api } from '../../api/client'
import { ErrorBanner } from '../../components/ErrorBanner'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
```

Each line says: "bring the named values out of this module". The path `../../` means
"two folders up" — it is relative to the file doing the importing. Two naming rules:

- A **named export** (`export function api` or `export const x`) is imported with
  braces: `import { api } from ...`.
- A **default export** is imported without braces. This app uses named exports
  everywhere, so you can ignore default exports.

**Read:** <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules>.

---

## STEP 7 — TypeScript in one page

**What are we doing?**

Learning the TypeScript annotations you will write and read in every file.

**Why do we need it?**

Your backend manual already made you write TypeScript. This step names the pieces so
the React code does not look like a foreign language. TypeScript's whole job: you say
what kind of value something is, and the editor and `npm run typecheck` complain when
a value of the wrong kind is used. The rules run **before** the code runs — that is why
the backend manual's `npm run build` caught mistakes at compile time.

The pieces you need:

1. **Annotations** — a value's type written after a colon:

```ts
const fullNames: string = "Ada Lovelace"
const port: number = 4000
```

2. **Interfaces** — the shape of an object. This is exactly one of your API's
   students:

```ts
interface Student {
  studentId: string
  fullNames: string
  track: 'frontend' | 'backend'
  status: 'active' | 'inactive'
}
```

3. **Unions** — "one of these values". `'frontend' | 'backend'` means the track field
   may only be those two strings — the same restriction your backend's
   `trackEnum` enforces in PostgreSQL.

4. **`string | null`** — "a string, or nothing". Your attendance records have a
   `clockOut` that may be missing, so its type is `string | null`:

```ts
interface AttendanceRecord {
  attendanceId: string
  studentId: string
  date: string
  clockIn: string
  clockOut: string | null
}
```

5. **Arrays of a type** — `Student[]` means "an array whose items are `Student`
   objects". `AttendanceRow[]` is an array of register rows.

6. **Function types** — the inputs and output of a function:

```ts
function formatTime(minutes: number): string {
  return `${Math.floor(minutes / 60)}h ${minutes % 60}m`
}
```

`minutes: number` says "the input is a number"; `: string` after the `)` says "the
result is a string".

You never have to write types for everything. TypeScript can *infer* them: if you
write `const name = "Ada"`, it knows `name` is a string without being told. You write
annotations for the boundaries between files — function inputs, function outputs, and
the shapes of API data — and let inference handle the rest.

**Read:** <https://www.typescriptlang.org/docs/handbook/intro.html> (sections
"Interfaces" and "Union Types") and
<https://www.typescriptlang.org/docs/handbook/2/everyday-types.html>.

---

You have finished Part 1. You now know the JavaScript ideas the whole app is built on:
values and variables, template literals, functions (including arrow functions),
objects, arrays with `map`/`filter`/`find`, promises with `fetch` and `await`, modules,
and the TypeScript annotations you will see in every file. You can always come back to
this part; the console examples take a minute to re-run.

---

# Part 2 — Your first React app

Part 2 creates the empty frontend project, starts it, and teaches the four React ideas
you will use in every screen: JSX, components with props, state, and events. You
practice by editing a starter app and watching it update instantly in the browser.

---

## STEP 8 — Create the Vite project

**What are we doing?**

Creating the frontend project with the official Vite tool, then starting the
development server.

**Why do we need it?**

The backend manual built its `package.json` by hand because the backend is small. A
frontend needs many files — build configuration, TypeScript settings, the HTML page —
and the official Vite scaffolder creates them all correctly in one command. **Vite**
is your build tool: it runs the dev server, converts TypeScript and JSX into browser
JavaScript, and makes the production bundle.

Open a PowerShell window and type exactly:

```powershell
cd Fullstack\frontend
npm create vite@latest . -- --template react-ts --no-interactive
```

The parts of the command: `npm create vite@latest` downloads the latest scaffolder,
`.` means "put the project in the current folder", `--template react-ts` selects the
React + TypeScript template, and `--no-interactive` tells it not to ask questions.

**You should see**

```text
Scaffolding project in ...\Fullstack\frontend...
Done. Now run:

  pnpm install
  pnpm dev
```

The suggested commands may say `pnpm` or `npm` depending on your machine — ignore the
suggestion. This manual uses `npm`, which you already know from the backend.

Now install the dependencies:

```powershell
npm install
```

**You should see**

```text
added NNN packages in ...s
```

Finally, start the development server. It stays running, so leave this terminal open:

```powershell
npm run dev
```

**You should see**

```text
  VITE v8.2.2  ready in 300 ms

  ➜  Local:   http://localhost:5173/
```

Open `http://localhost:5173` in your browser.

**You should see** the Vite + React starter page: the React and Vite logos, a
"Get started" heading, and a **Count is 0** button.

**STOP HERE**

If the page does not open, read the terminal error. The most common causes:

- `EADDRINUSE` — port 5173 is already in use. Close whatever is using it, or restart
  the dev server.
- `Cannot find module ...` — the install did not finish. Run `npm install` again.

---

## STEP 9 — Read what Vite generated

**What are we doing?**

Learning what each generated file is for, so the rest of the manual can point at them.

**Why do we need it?**

You will edit most of these files. Knowing which file does what makes every later
instruction unambiguous.

In VS Code, open the `frontend` folder (**File → Open Folder…**). The Explorer shows:

```text
frontend/
├── .gitignore            <- files Git must never commit (node_modules, dist)
├── .oxlintrc.json        <- lint settings (we keep these)
├── README.md             <- documentation only; you can delete or keep it
├── index.html            <- the single HTML page the browser loads
├── package.json          <- the project identity card — you know this from the backend
├── tsconfig.json         <- TypeScript settings (we replace these three files later)
├── tsconfig.app.json
├── tsconfig.node.json
├── vite.config.ts        <- Vite settings (we change this later)
├── public/
│   ├── favicon.svg       <- the browser tab icon (we keep this)
│   └── icons.svg         <- starter icons (deleted later)
└── src/
    ├── main.tsx          <- the entry point: React starts here
    ├── App.tsx           <- the starter component (replaced in the next steps)
    ├── App.css           <- starter styles (deleted later)
    ├── index.css         <- starter styles (deleted later)
    ├── assets/           <- starter images (deleted later)
    └── vite-env.d.ts     <- TypeScript helper for Vite (keep it)
```

Open `index.html` and read it: the browser loads this one file, which contains a
`<div id="root"></div>` and a script tag pointing at `/src/main.tsx`. Everything
React renders goes *inside* that div.

Now open `src/main.tsx`:

```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

Read it as a story: `createRoot(...)` takes the empty `root` div, `.render(<App />)`
fills it with the `App` component, and `<StrictMode>` is a helper that runs your
components twice in development to surface bugs. **StrictMode exists only in
development; it does nothing in the production build.**

The last piece of magic: **hot reload**. Open `src/App.tsx`, find the `<h1>Get
started</h1>` line, change the text to `<h1>My attendance app</h1>`, and save the
file.

**You should see** the browser update instantly, without refreshing — this is Vite's
hot module replacement (HMR). Every file you edit from now on behaves this way.

---

## STEP 10 — JSX: the language of React screens

**What are we doing?**

Learning JSX, the HTML-like syntax inside React components.

**Why do we need it?**

A React component describes what the screen looks like by returning JSX. If you cannot
read JSX you cannot read a single screen of this app.

Replace the entire contents of `src/App.tsx` with this:

```tsx
const student = {
  fullNames: 'Ada Lovelace',
  track: 'backend',
}

export default function App() {
  return (
    <div>
      <h1>Hello from React</h1>
      <p>{student.fullNames} studies {student.track}.</p>
    </div>
  )
}
```

Save. **You should see** "Hello from React" and "Ada Lovelace studies backend." — the
name and track came from the JavaScript object, not from the HTML.

JSX looks like HTML but it is JavaScript. The rules that matter:

1. **Attributes use `className`, not `class`** — `class` is a JavaScript keyword.
   You will type `className="table-wrap"` constantly.
2. **Curly braces insert JavaScript values.** `{student.fullNames}` means "put the
   value of this expression here". Anything inside `{ }` is JavaScript: a variable,
   a function call, even `1 + 1`.
3. **One root element per component.** A component must return one element; if you
   want several siblings without a wrapper, use an empty fragment `<>...</>`.
4. **Void elements are self-closing.** `<input />`, `<img />`, never `<input></input>`.
5. **Lowercase tags are HTML, Capitalized tags are your components.** `<div>` is a
   browser element; `<StudentCard>` is a component you wrote. React treats the
   capital letter as the signal "this is a component".

**Read:** <https://react.dev/learn/writing-markup-with-jsx> — short, with live
examples.

---

## STEP 11 — Components and props

**What are we doing?**

Learning that a component is a function returning JSX, and that **props** are its
inputs.

**Why do we need it?**

Every screen in this app is a component (`StudentsPage`, `AttendancePage`,
`AppLayout`), and components pass data to each other through props. The same idea as
function parameters, but for screens.

Replace `src/App.tsx` with this:

```tsx
function StudentCard({ fullNames, track }: { fullNames: string; track: string }) {
  return (
    <p>{fullNames} studies {track}.</p>
  )
}

export default function App() {
  return (
    <div>
      <h1>Students</h1>
      <StudentCard fullNames="Ada Lovelace" track="backend" />
      <StudentCard fullNames="Grace Hopper" track="frontend" />
    </div>
  )
}
```

Save. **You should see** "Students" and two lines: Ada studies backend, Grace studies
frontend.

Read the pieces:

- `function StudentCard(...)` — a component is just a function that returns JSX. The
  capital `S` makes it a component.
- `{ fullNames, track }` — the function receives **one** argument, an object called
  **props**. Writing `{ fullNames, track }` in the parameter list unpacks the two
  fields from that object (this is called *destructuring* — a JavaScript feature you
  will see in every component).
- `: { fullNames: string; track: string }` — the TypeScript part: "the props object
  has a string `fullNames` and a string `track`". Type it wrong and `npm run
  typecheck` complains.
- `<StudentCard fullNames="..." track="..." />` — the caller supplies the props, the
  same way you pass arguments to a function.

Use one component twice and you get two cards. This is how the students table renders
one row component per student — with `map`, which you learned in Part 1.

**Read:** <https://react.dev/learn/passing-props-to-a-component>.

---

## STEP 12 — State with `useState`

**What are we doing?**

Learning React **state**: data a component remembers, and that makes the screen update
when it changes.

**Why do we need it?**

Your app must react to the user: the search box shows what you type, a dialog opens
and closes, a button says "Saving…" while it waits. None of that is possible with
plain variables — a plain variable changing does not redraw the screen. State does.

Replace `src/App.tsx` with this:

```tsx
import { useState } from 'react'

export default function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <h1>Counter</h1>
      <p>You clicked {count} times.</p>
      <button type="button" onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  )
}
```

Save. **You should see** "Counter", "You clicked 0 times.", and a button. Click the
button — the number increases on every click. (The starter page's "Count is 0" button
did exactly this; now you know why.)

Read the two lines that matter:

```tsx
const [count, setCount] = useState(0)
```

`useState` is a **hook** — a function React gives you that adds state to a component.
It returns an array of two things, which this line unpacks into two names:

- `count` — the current value (starts at `0`, the argument you passed).
- `setCount` — a function that *changes* the value.

The rule that makes React work: **whenever you call `setCount`, React runs your
component function again and redraws the screen with the new value.** That is why the
text updates. The JSX never changes — the value it reads changes.

One habit from the start: **never write `count = count + 1`.** Changing a variable
does not tell React to redraw. Only the `set` function does.

**Read:** <https://react.dev/learn/state-a-components-memory> and
<https://react.dev/reference/react/useState>.

---

## STEP 13 — Events and forms

**What are we doing?**

Learning how clicks and typing trigger code, and the two ways React forms read their
values.

**Why do we need it?**

Every button and every form in this app works through events. There are two kinds of
form inputs in React, and this app uses both:

- **Controlled inputs** — the input's value lives in state and changes as you type.
  Used for the search boxes and the date picker.
- **Uncontrolled inputs** — the browser owns the value; you read it when the form is
  submitted. Used for the add/edit forms.

**Events first.** Replace `src/App.tsx` with:

```tsx
import { useState } from 'react'

export default function App() {
  const [search, setSearch] = useState('')

  return (
    <div>
      <h1>Search</h1>
      <input
        type="search"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Type to search"
      />
      <p>You typed: {search}</p>
    </div>
  )
}
```

Save and type in the box. **You should see** "You typed: ..." update with every
keystroke.

Read the input line by line:

- `value={search}` — the box always shows whatever `search` currently is.
- `onChange={(event) => setSearch(event.target.value)}` — "when the user types, call
  this function with the event; `event.target.value` is the new text; store it in
  state".

Because the value comes from state and typing writes back into state, the box is
"controlled". This is exactly how the app's search boxes work.

**Forms.** Replace `src/App.tsx` with:

```tsx
import type { FormEvent } from 'react'

export default function App() {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const name = String(form.get('name') ?? '')
    alert(`Hello, ${name}`)
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Name
        <input name="name" defaultValue="" required />
      </label>
      <button type="submit">Submit</button>
    </form>
  )
}
```

Save, type a name, and click Submit. **You should see** an alert: "Hello, <your
name>." and — importantly — the page does **not** reload.

Read the pieces:

- `onSubmit={handleSubmit}` — runs when the form is submitted (Enter or the submit
  button).
- `event.preventDefault()` — stops the browser's default behaviour of reloading the
  page. Without this line, your app would flash and lose everything. Every form in
  this app starts with it.
- `new FormData(event.currentTarget)` — reads all the fields of the submitted form by
  their `name` attributes.
- `form.get('name')` — the value of the field named `name`. `?? ''` means "if it is
  missing, use an empty string".
- `defaultValue` — for an **uncontrolled** input: the starting value, owned by the
  browser from then on. This is why the edit forms in this app can prefill values.

**STOP HERE**

If clicking Submit reloads the page, you forgot `event.preventDefault()`.

**Read:** <https://react.dev/learn/responding-to-events> and
<https://react.dev/learn/forms>.

---

## STEP 14 — Lists with `map` and keys

**What are we doing?**

Learning the standard way to render a list of items, which every table in this app
uses.

**Why do we need it?**

The students table is one row per student; the attendance register is one row per
active student. Both are a list of objects turned into a list of JSX elements.

Replace `src/App.tsx` with:

```tsx
const students = [
  { studentId: '1', fullNames: 'Ada Lovelace' },
  { studentId: '2', fullNames: 'Grace Hopper' },
]

export default function App() {
  return (
    <ul>
      {students.map((student) => (
        <li key={student.studentId}>{student.fullNames}</li>
      ))}
    </ul>
  )
}
```

Save. **You should see** a bullet list with the two names.

Read the pattern — you will type it in every table:

```tsx
{students.map((student) => (
  <li key={student.studentId}>{student.fullNames}</li>
))}
```

- `students.map(...)` — `map` (from Part 1) runs once per student.
- The arrow function returns the JSX for one item — this is the "row component" idea
  from STEP 11, written inline.
- `key={student.studentId}` — React requires a unique `key` on each item so it can
  update lists efficiently when items change. Use the id from your data, never the
  position in the list.

**Read:** <https://react.dev/learn/rendering-lists>.

---

## STEP 15 — What you just learned, and where to look things up

**What are we doing?**

Naming the four ideas so you can recognise them in the real app, and collecting the
documentation links.

**Why do we need it?**

From Part 3 on you read complete files. When you meet a pattern you do not recognise,
this table tells you what it is and where the official explanation lives.

| Pattern | What it is | Where you will see it |
| --- | --- | --- |
| `return ( <div>...</div> )` | JSX — the screen description | every component |
| `function StudentsPage({ ... }: Props)` | a component and its props | every page |
| `const [open, setOpen] = useState(false)` | state — redraws when it changes | dialogs, menus, search |
| `onClick={() => ...}` / `onChange={...}` | events | every button and input |
| `onSubmit={handleSubmit}` + `preventDefault()` | form submission | every form |
| `value={search}` + `onChange` | controlled input | search boxes, date picker |
| `name="..."` + `FormData` + `form.get(...)` | uncontrolled form fields | add/edit forms |
| `{items.map((item) => <tr key={item.id}>...)}` | rendering a list | both tables |

The official React tutorial teaches exactly this material in order and is worth
reading once:

- <https://react.dev/learn> — start with "Describing the UI" and "Adding
  Interactivity".

---

You have finished Part 2. You have a running Vite + React project, you know what every
generated file does, and you have used JSX, components, props, state, events, forms,
and lists with your own hands. The next part throws the starter demo away and builds
the real application shell.

---

# Part 3 — The app shell

Part 3 turns the Vite starter into the real application: the two libraries that fetch
data and navigate, the configuration files, the styles, and the layout that wraps
every page. When this part ends you have a working shell with two empty pages and a
mobile menu.

---

## STEP 16 — The libraries that make this app work

**What are we doing?**

Learning what the two libraries you are about to install do, before you install them.

**Why do we need it?**

The backend manual installed libraries one at a time, each with one job. The frontend
works the same way:

| Library | Job | Docs |
| --- | --- | --- |
| **Vite** | dev server, TypeScript→JS conversion, production build | <https://vite.dev/guide/> |
| **React** | components, JSX, state — already installed by the template | <https://react.dev/learn> |
| **React Query** (`@tanstack/react-query`) | fetching data from your API, caching it, and refreshing it | <https://tanstack.com/query/latest/docs/framework/react/overview> |
| **TanStack Router** (`@tanstack/react-router`) | mapping URLs (like `/students`) to components | <https://tanstack.com/router/latest/docs/framework/react/overview> |

The two new ones deserve a sentence each:

- **React Query** — in the plain approach you would write `fetch` calls and then
  manually handle "loading…", errors, and keeping the screen fresh after every
  change. React Query does all of that. You describe the data you need with a
  `useQuery` call, and it fetches, caches, and re-renders for you.
- **TanStack Router** — the app has two pages (Attendance at `/`, Students at
  `/students`). The router maps each URL to its component and gives you the `Link`
  component for navigation.

---

## STEP 17 — Install the extra libraries

**What are we doing?**

Installing React Query and TanStack Router.

**Why do we need it?**

They are not part of the Vite template, so they must be added to `package.json`.

In the `frontend` terminal, type exactly:

```powershell
npm install @tanstack/react-query @tanstack/react-router
```

**You should see**

```text
added NNN packages in ...s
```

Open `package.json`. Under `"dependencies"` you now have:

```json
"dependencies": {
  "@tanstack/react-query": "^5.x.x",
  "@tanstack/react-router": "^1.x.x",
  "react": "^19.x.x",
  "react-dom": "^19.x.x"
}
```

The `^5` and `^1` are the major versions — the exact minor numbers depend on today's
latest release, which is fine.

---

## STEP 18 — The configuration files: scripts, TypeScript, lint

**What are we doing?**

Replacing the generated TypeScript setup with the project's single-file setup and
adding the `typecheck` script.

**Why do we need it?**

The template splits TypeScript settings across three files (`tsconfig.json`,
`tsconfig.app.json`, `tsconfig.node.json`) and builds with `tsc -b`. This project uses
one `tsconfig.json` and a `typecheck` script, matching the backend manual's habit of
simple, understandable configuration.

**1. The scripts.** Open `package.json` and replace the whole `"scripts"` section:

```json
"scripts": {
  "dev": "vite",
  "typecheck": "tsc --noEmit",
  "build": "npm run typecheck && vite build",
  "lint": "oxlint",
  "preview": "vite preview"
}
```

Save. The new ones:

- `typecheck` — checks every file's types without producing output. You run this
  constantly, exactly like `npm run build` in the backend caught your type mistakes.
- `build` — type-checks first, then makes the production bundle.

**2. The TypeScript settings.** Delete `tsconfig.app.json` and `tsconfig.node.json`.
Open `tsconfig.json` and replace its entire contents:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "useDefineForClassFields": true,
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "allowJs": false,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src", "vite.config.ts"]
}
```

The lines that matter:

- `"strict": true` — full type checking, the same strictness your backend used.
- `"jsx": "react-jsx"` — modern JSX; you do not need to `import React` in every file.
- `"moduleResolution": "Bundler"` — imports without file extensions, like
  `from './api/client'` (your backend needed `./client.js`; Vite does not).
- `"noEmit": true` — TypeScript only checks; Vite produces the JavaScript.
- `"noUnusedLocals"` / `"noUnusedParameters"` — unused variables are errors. If
  `typecheck` complains about an unused import, delete the import.

**3. The lint settings.** The template generated `.oxlintrc.json` with the React and
TypeScript rules this project needs. Leave it as it is — it is already correct.

**STOP HERE**

Run:

```powershell
npm run typecheck
```

**You should see** no output and the prompt returns. No output means no type errors.
(The starter `App.tsx` still type-checks under the new settings — it is replaced in
a few steps regardless.) If errors do appear, read them and fix the file they name
before continuing.

---

## STEP 19 — The Vite proxy

**What are we doing?**

Teaching the dev server to forward every `/api` request to your backend.

**Why do we need it?**

Your browser runs the frontend on port `5173`; your API runs on port `4000`. A
browser normally refuses to read a response from a different port (CORS). Your
backend already sends CORS headers, but there is a cleaner solution: the dev server
acts as a middleman. When the page asks for `/api/students`, Vite forwards the
request to `http://127.0.0.1:4000/api/students` and hands the response back. To the
browser it looks like one website.

Open `vite.config.ts` and replace its entire contents:

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:4000',
        changeOrigin: true,
      },
    },
  },
})
```

Save. Vite restarts automatically after a config change — the terminal reprints the
ready message. If it does not, press `Ctrl+C` and run `npm run dev` again.

**Read:** <https://vite.dev/config/server-options.html#server-proxy>.

---

## STEP 20 — `index.html`

**What are we doing?**

Replacing the starter page's HTML with the app's real one.

**Why do we need it?**

The title shown in the browser tab, the description, and the tab icon all live here.
The page itself is still just the empty `root` div — React fills it.

Open `index.html` and replace its entire contents:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="theme-color" content="#f5f7f5" />
    <meta name="description" content="Manage students and daily attendance." />
    <title>Student Attendance System</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

Save. **You should see** the browser tab title change to "Student Attendance System".
The rest of the file matches what Vite generated — the title, description, and
`theme-color` are new.

---

## STEP 21 — The styles

**What are we doing?**

Creating the two CSS files that give the app its design.

**Why do we need it?**

The starter's styles belong to its demo page. The real app needs its own design: a
header, buttons, tables, modals, and the rules that switch to the mobile menu on
small screens. The project splits the CSS into two files:

- `src/styles/base.css` — the design system: colours, spacing, the header, buttons,
  tables, forms, and the mobile rules.
- `src/styles/index.css` — imports `base.css` and adds the page-specific pieces
  (modals, search, loading states).

These files are long. Type them carefully — or copy them from the reference solution
in the repo (`frontend/src/styles/`). Either way the content must match exactly,
because the components you build later rely on these class names.

**1. Create the folder and the first file.** In VS Code, create a folder `styles`
inside `src`. Create the file `src/styles/base.css` and paste exactly:

```css
:root {
  color-scheme: light;
  --font-size-body: 14px;
  --color-ink: #17201d;
  --color-muted: #66706c;
  --color-canvas: #f5f7f5;
  --color-surface: #ffffff;
  --color-soft: #f0f3f1;
  --color-accent: #df5b2c;
  --radius-control: 10px;
  --radius-panel: 16px;
  --space-1: 0.5rem;
  --space-2: 0.75rem;
  --space-3: 1rem;
  --space-4: 1.5rem;
  --space-5: 2rem;
}

* {
  box-sizing: border-box;
  font-family:
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    Roboto,
    Oxygen,
    Ubuntu,
    Cantarell,
    "Open Sans",
    "Helvetica Neue",
    sans-serif;
}

body {
  margin: 0;
  color: var(--color-ink);
  background: var(--color-canvas);
  font-size: var(--font-size-body);
  line-height: 1.5;
}
button,
input,
select {
  font: inherit;
}
:focus-visible {
  outline: 0;
  box-shadow: none;
  filter: brightness(0.92);
}

.site-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
  padding: var(--space-3) max(var(--space-3), calc((100% - 1120px) / 2));
  background: var(--color-surface);
  box-shadow: 0 3px 18px rgb(23 32 29 / 0.04);
}
.brand {
  color: var(--color-ink);
  font-weight: 800;
  letter-spacing: 0.02em;
  text-decoration: none;
  text-transform: uppercase;
}
.desktop-nav {
  display: flex;
  gap: var(--space-1);
}
.desktop-nav a {
  min-height: 44px;
  display: inline-flex;
  align-items: center;
  padding: 0 var(--space-2);
  border-radius: var(--radius-control);
  color: var(--color-muted);
  text-decoration: none;
}
.desktop-nav a[aria-current="page"] {
  background: #fff1eb;
  color: var(--color-accent);
}
.navigation-trigger {
  display: none;
  width: 44px;
  padding: 0;
  place-items: center;
}
.navigation-trigger svg,
.sheet-close svg {
  width: 22px;
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
}

.page-shell {
  width: min(1120px, calc(100% - 2 * var(--space-3)));
  margin: 0 auto;
  padding: var(--space-5) 0;
}
.page-heading {
  margin-bottom: var(--space-4);
}
.page-heading h1,
.panel h2,
dialog h2 {
  margin: 0;
  letter-spacing: -0.025em;
}
.page-heading h1 {
  font-size: clamp(1.75rem, 4vw, 2.15rem);
}
.page-heading p:last-child,
.panel > p {
  color: var(--color-muted);
}
.panel {
  margin-bottom: var(--space-4);
  padding: var(--space-4);
  border-radius: var(--radius-panel);
  background: var(--color-surface);
  box-shadow:
    0 1px 2px rgb(23 32 29 / 0.04),
    0 12px 36px rgb(23 32 29 / 0.06);
}
.toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-3);
  margin-bottom: var(--space-3);
}
.toolbar-filters {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--space-3);
}
.toolbar-actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  margin-left: auto;
}
.inline-field {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  color: var(--color-ink);
}
.search-field {
  position: relative;
  display: inline-flex;
  align-items: center;
}
.search-icon {
  position: absolute;
  left: var(--space-2);
  width: 16px;
  height: 16px;
  color: var(--color-muted);
  pointer-events: none;
}
.search-field input {
  min-width: 15rem;
  padding-left: calc(2 * var(--space-2) + 16px);
}
button,
input,
select {
  min-height: 44px;
  border: 0;
  border-radius: var(--radius-control);
  padding: 0 var(--space-2);
  background: var(--color-soft);
  color: var(--color-ink);
}
button {
  background: var(--color-accent);
  color: white;
  cursor: pointer;
}
button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}
.secondary-button,
.table-action {
  background: #e9eeeb;
  color: var(--color-ink);
}
.danger-button {
  background: #b42318;
  color: white;
}
.table-action {
  min-height: 32px;
  margin-right: var(--space-1);
}

.table-wrap {
  overflow-x: auto;
  border-radius: 12px;
}
table {
  width: 100%;
  min-width: 760px;
  border-collapse: separate;
  border-spacing: 0 0.35rem;
  text-align: left;
}
caption {
  padding: 0 0 var(--space-2);
  color: var(--color-muted);
  font-weight: 600;
  text-align: left;
}
th,
td {
  padding: 0.8rem var(--space-2);
  border: 0;
  white-space: nowrap;
}
th {
  background: #edf2ee;
  color: #4f5c57;
  font-size: 0.78em;
  text-transform: uppercase;
  letter-spacing: 0.07em;
}
th:first-child,
tbody td:first-child {
  border-radius: 10px 0 0 10px;
}
th:last-child,
tbody td:last-child {
  border-radius: 0 10px 10px 0;
}
tbody td {
  background: #f8faf8;
}
tbody tr:hover td {
  background: #f0f4f1;
}
.table-empty {
  min-height: 220px;
  display: grid;
  place-items: center;
  align-content: center;
  gap: 0.45rem;
  padding: var(--space-5);
  border-radius: 12px;
  background: #f8faf8;
  text-align: center;
}
.table-wrap:has(tbody:not(:empty)) .table-empty {
  display: none;
}
.table-empty strong {
  font-size: 1.08rem;
}
.table-empty span {
  max-width: 430px;
  margin: 0;
  color: var(--color-muted);
}
.empty-state-action {
  min-height: 40px;
  display: inline-flex;
  align-items: center;
  margin-top: var(--space-2);
  padding: 0 var(--space-2);
  border-radius: var(--radius-control);
  background: #fff1eb;
  color: var(--color-accent);
  font-weight: 700;
  text-decoration: none;
}
.status-pill {
  display: inline-block;
  padding: 0.15rem var(--space-2);
  border-radius: 999px;
  background: #e6eee8;
  color: var(--color-ink);
  font-weight: 700;
}
.status-green {
  background-color: rgba(50, 198, 9, 0.31);
}

.status-red {
  background-color: rgba(228, 76, 16, 0.308);
}
.recovery-banner {
  margin-bottom: var(--space-3);
  padding: var(--space-3);
  border-radius: var(--radius-control);
  background: #fff1eb;
}

dialog {
  width: min(480px, calc(100% - 2 * var(--space-3)));
  padding: var(--space-4);
  border: 0;
  border-radius: var(--radius-panel);
  color: var(--color-ink);
  box-shadow: 0 24px 70px rgb(23 32 29 / 0.24);
}
dialog::backdrop {
  background: rgb(23 32 29 / 0.38);
}
dialog form {
  display: grid;
  gap: var(--space-3);
}
dialog label {
  display: grid;
  gap: var(--space-1);
}
.form-error {
  min-height: 1.5em;
  margin: 0;
  color: #b42318;
}
.dialog-actions {
  display: flex;
  justify-content: end;
  gap: var(--space-2);
  margin-top: var(--space-1);
}
.weekday-group {
  margin: 0;
  padding: var(--space-3);
  border: 0;
  border-radius: var(--radius-control);
  background: var(--color-soft);
}
.weekday-group legend {
  padding: 0 var(--space-1);
  color: var(--color-muted);
}
.weekday-group label {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  margin: 0 var(--space-2) var(--space-1) 0;
}

.navigation-sheet {
  inset: 0 0 0 auto;
  width: min(22rem, 86vw);
  max-width: none;
  height: 100dvh;
  max-height: none;
  margin: 0;
  padding: var(--space-4);
  border-radius: 18px 0 0 18px;
  background: var(--color-surface);
  transform: translateX(100%);
  transition: transform 180ms ease-out;
}
.navigation-sheet[open] {
  transform: translateX(0);
}
.navigation-sheet::backdrop {
  background: rgb(23 32 29 / 0.32);
}
.sheet-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-4);
}
.sheet-header strong {
  font-size: 1.05rem;
}
.sheet-close {
  width: 44px;
  padding: 0;
  display: grid;
  place-items: center;
  background: var(--color-soft);
  color: var(--color-ink);
}
.sheet-nav {
  display: grid;
  gap: var(--space-1);
}
.sheet-nav a {
  min-height: 48px;
  display: flex;
  align-items: center;
  padding: 0 var(--space-3);
  border-radius: var(--radius-control);
  color: var(--color-ink);
  font-weight: 650;
  text-decoration: none;
}
.sheet-nav a[aria-current="page"] {
  background: #fff1eb;
  color: var(--color-accent);
}

@starting-style {
  .navigation-sheet[open] {
    transform: translateX(100%);
  }
}
@media (prefers-reduced-motion: reduce) {
  .navigation-sheet {
    transition: none;
  }
}

@media (max-width: 760px) {
  .site-header {
    padding-block: var(--space-2);
  }
  .brand {
    max-width: calc(100% - 60px);
  }
  .desktop-nav {
    display: none;
  }
  .navigation-trigger {
    display: grid;
  }
  .page-shell {
    padding-top: var(--space-4);
  }
  .panel {
    padding: var(--space-3);
  }
  .toolbar,
  .toolbar-filters,
  .toolbar-actions {
    align-items: stretch;
    flex-direction: column;
  }
  .toolbar-filters .inline-field,
  .toolbar-filters .search-field {
    width: 100%;
  }
  .toolbar input,
  .toolbar button,
  .toolbar-actions {
    width: 100%;
  }
  .toolbar-filters .inline-field input {
    width: auto;
    flex: 1;
    min-width: 0;
  }
  .search-field input {
    min-width: 0;
  }
  .toolbar-actions {
    margin-left: 0;
  }
  .table-empty {
    padding-inline: var(--space-3);
  }
}
```

Read the top of the file: the `:root` block defines **CSS variables** — the palette
and spacing the whole app uses (`var(--color-accent)` is the orange used for buttons).
The last block, `@media (max-width: 760px)`, is the mobile rule: below 760 pixels the
desktop navigation is hidden and the hamburger button (`navigation-trigger`) appears.
Your `AppLayout` component works together with these rules.

**2. Create the second file.** Create `src/styles/index.css` and paste exactly:

```css
@import "./base.css";

:root {
  font-synthesis: none;
  text-rendering: optimizeLegibility;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.eyebrow {
  margin: 0 0 0.25rem;
  color: var(--color-accent);
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.notice {
  margin: 0 0 var(--space-3);
  padding: var(--space-2) var(--space-3);
  border: 1px solid #dce6df;
  border-radius: var(--radius-control);
  background: #f8faf8;
  color: var(--color-muted);
}

.recovery-banner {
  display: grid;
  gap: 0.2rem;
}

.loading-state {
  min-height: 220px;
  display: grid;
  place-items: center;
  margin: 0;
  border-radius: 12px;
  background: #f8faf8;
  color: var(--color-muted);
}

.capitalize {
  text-transform: capitalize;
}

.modal-backdrop {
  position: fixed;
  z-index: 100;
  inset: 0;
  display: grid;
  place-items: center;
  padding: var(--space-3);
  background: rgb(23 32 29 / 0.42);
}

.modal-card {
  width: min(520px, 100%);
  max-height: calc(100dvh - 2 * var(--space-3));
  overflow-y: auto;
  padding: var(--space-4);
  border-radius: var(--radius-panel);
  background: var(--color-surface);
  box-shadow: 0 24px 70px rgb(23 32 29 / 0.24);
}

.modal-heading {
  display: flex;
  align-items: start;
  justify-content: space-between;
  gap: var(--space-3);
  margin-bottom: var(--space-3);
}

.modal-heading h2,
.modal-heading p {
  margin: 0;
}

.modal-heading p {
  margin-top: 0.3rem;
  color: var(--color-muted);
}

.icon-button {
  min-width: 40px;
  min-height: 40px;
  padding: 0;
  background: var(--color-soft);
  color: var(--color-ink);
  font-size: 1.4rem;
}

.modal-form,
.form-field {
  display: grid;
  gap: var(--space-2);
}

.modal-form {
  gap: var(--space-3);
}

.form-field {
  color: var(--color-ink);
  font-weight: 650;
}

.form-field input,
.form-field select {
  width: 100%;
  font-weight: 400;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-3);
}

.weekday-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-1);
}

.weekday-grid label {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  margin: 0;
}

.weekday-grid input {
  min-height: 20px;
  accent-color: var(--color-accent);
}

.split-actions {
  align-items: center;
}

.action-spacer {
  flex: 1;
}

.confirmation-message,
.form-hint {
  margin: 0;
}

.form-hint {
  color: var(--color-muted);
}

.navigation-backdrop {
  position: fixed;
  z-index: 90;
  inset: 0;
  background: rgb(23 32 29 / 0.32);
}

.react-navigation-sheet {
  position: absolute;
  inset: 0 0 0 auto;
  display: block;
  transform: none;
}

@media (max-width: 560px) {
  .form-grid,
  .weekday-grid {
    grid-template-columns: 1fr 1fr;
  }

  .modal-card {
    padding: var(--space-3);
  }

  .split-actions {
    flex-wrap: wrap;
  }
}

@media (max-width: 760px) {
  .site-header {
    flex-wrap: wrap;
  }

  .desktop-nav {
    width: 100%;
    display: flex;
  }

  .desktop-nav a {
    flex: 1;
    justify-content: center;
  }
}
```

**3. Delete the starter stylesheet.** Delete `src/index.css` (the one Vite
generated). It is replaced by `src/styles/index.css`. There is no visible change yet —
the styles only load once `main.tsx` imports them, which happens in STEP 26.

---

## STEP 22 — Remove the starter demo

**What are we doing?**

Deleting the demo files the template created.

**Why do we need it?**

The demo `App.tsx`, its images, and its styles have no place in the real app, and its
name collides with the components you will create.

Delete these files and folders:

```text
src/App.tsx
src/App.css
src/index.css        (already deleted in STEP 21)
src/assets/          (the whole folder)
public/icons.svg
```

Keep `public/favicon.svg` and `src/vite-env.d.ts`.

**You should see** the browser show an error overlay: `main.tsx` still imports
`./App.tsx` and `./index.css`, which no longer exist. That is expected and temporary —
the next four steps create the real files and then replace `main.tsx`.

---

## STEP 23 — Create the two page stubs

**What are we doing?**

Creating placeholder versions of the two pages, so the router and layout have
something to show.

**Why do we need it?**

The router (STEP 25) must import the pages. Creating them first — even as stubs —
lets you verify navigation works before building the real content.

Create the folder `src/features/students`. Inside it create `StudentsPage.tsx` and
type exactly:

```tsx
export function StudentsPage() {
  return (
    <section className="page-heading">
      <p className="eyebrow">Roster</p>
      <h1>Students</h1>
      <p>Manage the students whose attendance is tracked.</p>
    </section>
  )
}
```

Create the folder `src/features/attendance`. Inside it create `AttendancePage.tsx`
and type exactly:

```tsx
export function AttendancePage() {
  return (
    <section className="page-heading">
      <p className="eyebrow">Daily register</p>
      <h1>Attendance</h1>
      <p>Record and review attendance for the selected date.</p>
    </section>
  )
}
```

Note the folder names: `features/students` and `features/attendance` — one folder per
feature, the same way the backend has one folder per resource. Each component is a
**named export** (`export function StudentsPage`), which is how every file in this
app exports.

---

## STEP 24 — `AppLayout.tsx`: the header and mobile menu

**What are we doing?**

Creating the layout component that wraps every page: the header with the brand and
navigation, plus the slide-in menu for small screens.

**Why do we need it?**

Every page shares the same header. Instead of repeating it in each page, one
`AppLayout` component renders the header and then renders the current page inside it.

Create `src/components/AppLayout.tsx` (create the `components` folder first) and type
exactly:

```tsx
import { useState, type MouseEvent } from 'react'
import { Link, Outlet } from '@tanstack/react-router'

export function AppLayout() {
  const [mobileNavigationOpen, setMobileNavigationOpen] = useState(false)

  function keepNavigationOpen(event: MouseEvent<HTMLElement>) {
    event.stopPropagation()
  }

  return (
    <>
      <header className="site-header">
        <Link className="brand" to="/">Student Attendance System</Link>
        <nav className="desktop-nav" aria-label="Primary navigation">
          <Link to="/" activeOptions={{ exact: true }} activeProps={{ 'aria-current': 'page' }}>
            Attendance
          </Link>
          <Link to="/students" activeProps={{ 'aria-current': 'page' }}>
            Students
          </Link>
        </nav>
        <button
          className="navigation-trigger"
          type="button"
          aria-label="Open navigation"
          aria-controls="mobile-navigation"
          aria-expanded={mobileNavigationOpen}
          onClick={() => setMobileNavigationOpen(true)}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        </button>
      </header>

      {mobileNavigationOpen ? (
        <div
          className="navigation-backdrop"
          role="presentation"
          onMouseDown={() => setMobileNavigationOpen(false)}
        >
          <aside
            id="mobile-navigation"
            className="navigation-sheet react-navigation-sheet"
            role="dialog"
            aria-modal="true"
            aria-labelledby="navigation-title"
            onMouseDown={keepNavigationOpen}
          >
            <div className="sheet-header">
              <strong id="navigation-title">Navigation</strong>
              <button
                className="sheet-close"
                type="button"
                aria-label="Close navigation"
                onClick={() => setMobileNavigationOpen(false)}
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="m6 6 12 12M18 6 6 18" />
                </svg>
              </button>
            </div>
            <nav className="sheet-nav" aria-label="Mobile navigation">
              <Link
                to="/"
                activeOptions={{ exact: true }}
                activeProps={{ 'aria-current': 'page' }}
                onClick={() => setMobileNavigationOpen(false)}
              >
                Attendance
              </Link>
              <Link
                to="/students"
                activeProps={{ 'aria-current': 'page' }}
                onClick={() => setMobileNavigationOpen(false)}
              >
                Students
              </Link>
            </nav>
          </aside>
        </div>
      ) : null}

      <main className="page-shell">
        <Outlet />
      </main>
    </>
  )
}
```

Read it top to bottom:

- `const [mobileNavigationOpen, setMobileNavigationOpen] = useState(false)` — state
  from STEP 12. `false` means the mobile menu is closed.
- The `<header>` always renders: the brand `Link`, the `desktop-nav` with two links,
  and the hamburger button. The CSS hides the desktop nav below 760 pixels (STEP 21)
  and shows the hamburger instead.
- `{mobileNavigationOpen ? ( ... ) : null}` — conditional rendering. When the state
  is `true`, React renders the backdrop and the menu sheet; when `false`, it renders
  `null` (nothing). This is the standard React way to show/hide something.
- The backdrop covers the whole screen. `onMouseDown={() => setMobileNavigationOpen(false)}`
  closes the menu when you click outside it.
- `keepNavigationOpen` calls `event.stopPropagation()` — clicking *inside* the sheet
  must not trigger the backdrop's close handler. This is the "stop the event from
  bubbling up" idea; you see the same pattern in the Modal component later.
- **`<Outlet />`** — the outlet is where the router renders the current page. The
  root route (STEP 25) uses `AppLayout` as its component, and every page appears
  *inside* this `<main>` — that is how the shared header wraps all pages.

The `Link` component comes from TanStack Router: `to="/students"` navigates without
reloading the page. `activeProps={{ 'aria-current': 'page' }}` marks the link of the
page you are on, which the CSS styles with an orange background.

---

## STEP 25 — `router.tsx`: the navigation map

**What are we doing?**

Creating the file that tells TanStack Router which URL shows which component.

**Why do we need it?**

The router is the map of the app: `/` shows the Attendance page, `/students` shows
the Students page, and every page renders inside `AppLayout`.

Create `src/router.tsx` and type exactly:

```tsx
import {
  createRootRoute,
  createRoute,
  createRouter,
} from '@tanstack/react-router'
import { AppLayout } from './components/AppLayout'
import { AttendancePage } from './features/attendance/AttendancePage'
import { StudentsPage } from './features/students/StudentsPage'

const rootRoute = createRootRoute({ component: AppLayout })

const attendanceRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: AttendancePage,
})

const studentsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/students',
  component: StudentsPage,
})

const routeTree = rootRoute.addChildren([attendanceRoute, studentsRoute])

export const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
```

Read the shape: a **root route** carries `AppLayout` (the shared frame), and two
child routes carry the pages. The `declare module` block at the end is TanStack
Router's way of making the router type-safe across the whole app — you can ignore its
mechanics.

**Read:** <https://tanstack.com/router/latest/docs/framework/react/overview>.

---

## STEP 26 — `main.tsx`: where React starts

**What are we doing?**

Replacing the starter entry point with the real one, which wires React, React Query,
and the router together.

**Why do we need it?**

`main.tsx` is the first file that runs. It creates the query client (React Query),
creates the root, and tells React to render the router inside two providers.

Open `src/main.tsx` and replace its entire contents:

```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from '@tanstack/react-router'
import { router } from './router'
import './styles/index.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 15_000,
    },
  },
})

const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('The root application element is missing.')
}

createRoot(rootElement).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>,
)
```

Read it as a pipeline:

- `new QueryClient(...)` — one shared cache for all data fetching. `retry: 1` means a
  failed request is tried once more; `staleTime: 15_000` means data younger than 15
  seconds is reused instead of refetched.
- `<QueryClientProvider client={queryClient}>` — makes the query client available to
  every component below it. Your pages call `useQuery` and React Query finds this
  client.
- `<RouterProvider router={router} />` — renders the router from STEP 25. The current
  URL decides which page appears inside `AppLayout`'s frame.
- `import './styles/index.css'` — loads the styles from STEP 21. (This is why Vite's
  `@import "./base.css"` inside it works — Vite bundles both.)

Save. **You should see** the error overlay disappear and the app appear: the header
"Student Attendance System" with the Attendance and Students links, and the
Attendance page's stub heading.

---

## STEP 27 — Checkpoint: the running shell

**What are we doing?**

Verifying that the shell works before building any real content.

**Why do we need it?**

The shell is the frame every later feature hangs on. If navigation is broken now, it
will be broken everywhere.

Check all of these in the browser at `http://localhost:5173`:

1. The header shows "Student Attendance System".
2. The URL is `/` and the page shows the "Attendance" stub heading.
3. Click **Students** — the URL becomes `/students` and the "Students" stub heading
   appears. The Students link is highlighted.
4. Click **Attendance** — you return to `/`, and that link is highlighted.
5. Open the browser's developer tools and switch to device mode (or resize the window
   so it is narrower than 760 pixels). The two nav links disappear and a hamburger
   button appears in the header.
6. Click the hamburger — a sheet slides in from the right with the two links and a
   close button.
7. Click a link inside the sheet — it navigates and the sheet closes. Click the
   backdrop — the sheet closes without navigating.

If a click does nothing, compare your `router.tsx`, `AppLayout.tsx`, and `main.tsx`
with the reference solution line by line — the difference is usually a typo in a
path or a prop name.

**STOP HERE**

Run one more check in the `frontend` terminal:

```powershell
npm run typecheck
```

**You should see** no output and the prompt returns. (An unused variable would appear
here — for example, a leftover import. Delete it and run again.)

---

You have finished Part 3. You have a running application shell with real navigation,
a working mobile menu, and the styles for everything that follows. From here on, every
step adds one real feature.

---

# Part 4 — Talking to your API

Part 4 builds the bridge between the React app and the API you made in the backend
manual: the date helpers, the TypeScript shapes of the API's data, the fetch client,
and three small reusable components.

---

## STEP 28 — The date helpers

**What are we doing?**

Creating two small functions that produce today's date and time in the exact formats
your API expects.

**Why do we need it?**

Your backend stores dates as `YYYY-MM-DD` and times as `HH:MM` — remember the
validators' regexes from the backend manual. The frontend needs those same formats for
the date picker's default value and the clock-in/clock-out defaults. Building them
once in a shared file keeps every page consistent.

Create `src/utils/dateTime.ts` (create the `utils` folder first) and type exactly:

```ts
export function getLocalDate(): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function getLocalTime(): string {
  const now = new Date()
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  return `${hours}:${minutes}`
}
```

Read `getLocalDate` line by line — it is the same date logic your backend's `today()`
uses:

- `new Date()` — the current moment.
- `now.getFullYear()` — the year as a number, like `2026`.
- `now.getMonth() + 1` — the month. `getMonth()` counts from 0 (January is 0), so you
  add 1 to get the real month.
- `String(...).padStart(2, '0')` — make it two characters, adding a leading zero:
  `8` becomes `"08"`.
- The template literal puts the three pieces together: `"2026-08-04"`.

Without `padStart`, the 4th of August would become `2026-8-4`, which your backend's
`^\d{4}-\d{2}-\d{2}$` validator would reject. Formatting is a contract, not a style
choice.

---

## STEP 29 — The API types

**What are we doing?**

Creating `src/api/types.ts`, the TypeScript shapes of everything the API sends and
receives.

**Why do we need it?**

Your editor and `npm run typecheck` need to know the shape of the JSON your API
returns. If you type `student.track` and the type says track does not exist, the
editor flags it immediately — before the browser ever runs. These interfaces are the
frontend mirror of your backend's Drizzle schema and Zod validators.

Create `src/api/types.ts` and type exactly:

```ts
export type Track = 'frontend' | 'backend'
export type StudentStatus = 'active' | 'inactive'

export interface Student {
  studentId: string
  fullNames: string
  track: Track
  status: StudentStatus
}

export interface AttendanceRecord {
  attendanceId: string
  studentId: string
  date: string
  clockIn: string
  clockOut: string | null
}

export interface AttendanceRow {
  student: Student
  record: AttendanceRecord | null
  status: 'Not clocked in' | 'Currently in' | 'Completed'
  total: string
}

export interface AttendanceResponse {
  date: string
  isWorkingDay: boolean
  dayName: string
  notice: string
  rows: AttendanceRow[]
}

export interface AttendanceSettings {
  id: number
  workingDays: number[]
  openingTime: string
  closingTime: string
}

export interface CreateStudentInput {
  fullNames: string
  track: Track
  status: StudentStatus
}

export type UpdateStudentInput = CreateStudentInput

export interface ClockInInput {
  studentId: string
  date: string
  clockIn: string
}

export interface AttendanceCorrectionInput {
  clockIn: string
  clockOut: string | null
}

export type SettingsInput = Omit<AttendanceSettings, 'id'>
```

Match each interface to the API you built:

- `Student` — one row of `GET /api/students` (your `students` table).
- `AttendanceRecord` — one row of the `attendance` table. Note `clockOut: string |
  null` — a record that is still open has no clock-out, exactly like the database.
- `AttendanceRow` — one row of the register as `GET /api/attendance?date=` returns it:
  the student, their record for that day (or `null`), the computed `status`, and the
  computed `total`.
- `AttendanceResponse` — the whole register response: the date, whether it is a
  working day, the day name, the notice sentence, and the `rows` array.
- `AttendanceSettings` — the single settings row (id 1).
- The `*Input` interfaces — the request bodies. `CreateStudentInput` mirrors your
  `studentSchema`; `ClockInInput` mirrors `clockInSchema`; `SettingsInput` is the
  settings row **without** the `id`, which is what `PUT /api/settings` accepts
  (`Omit` is TypeScript for "this type minus these fields").

**STOP HERE**

Run:

```powershell
npm run typecheck
```

**You should see** no output — the file compiles. (If it complains about an unused
something, check you typed every line exactly.)

---

## STEP 30 — The API client

**What are we doing?**

Creating `src/api/client.ts`, the single file that knows how to call every endpoint
of your API.

**Why do we need it?**

In the backend manual, controllers never called `fetch` — they went through Drizzle.
The frontend equivalent: components never call `fetch` directly. They call functions
on this `api` object, and this file owns the URL, the HTTP method, the body, and the
error handling. One change here (a new header, a new base URL) updates the whole app.

Create `src/api/client.ts` and type exactly:

```ts
import type {
  AttendanceCorrectionInput,
  AttendanceRecord,
  AttendanceResponse,
  AttendanceSettings,
  ClockInInput,
  CreateStudentInput,
  SettingsInput,
  Student,
  UpdateStudentInput,
} from './types'

const API_BASE_URL = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '')

interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown
}

export class ApiError extends Error {
  readonly status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { body, headers, ...requestOptions } = options
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...requestOptions,
    body: body === undefined ? undefined : JSON.stringify(body),
    headers: {
      ...(body === undefined ? {} : { 'Content-Type': 'application/json' }),
      ...headers,
    },
  })

  const payload = response.status === 204
    ? null
    : await response.json().catch(() => null) as unknown

  if (!response.ok) {
    const message = isErrorPayload(payload)
      ? payload.error
      : `The server returned ${response.status}.`
    throw new ApiError(message, response.status)
  }

  return payload as T
}

function isErrorPayload(payload: unknown): payload is { error: string } {
  return typeof payload === 'object'
    && payload !== null
    && 'error' in payload
    && typeof payload.error === 'string'
}

function queryString(values: Record<string, string | undefined>): string {
  const params = new URLSearchParams()

  Object.entries(values).forEach(([key, value]) => {
    if (value) params.set(key, value)
  })

  const query = params.toString()
  return query ? `?${query}` : ''
}

export const api = {
  getStudents(search = ''): Promise<Student[]> {
    return request(`/students${queryString({ search })}`)
  },

  createStudent(student: CreateStudentInput): Promise<Student> {
    return request('/students', { method: 'POST', body: student })
  },

  updateStudent(studentId: string, student: UpdateStudentInput): Promise<Student> {
    return request(`/students/${studentId}`, { method: 'PUT', body: student })
  },

  deleteStudent(studentId: string): Promise<void> {
    return request(`/students/${studentId}`, { method: 'DELETE' })
  },

  getAttendance(date: string, search = ''): Promise<AttendanceResponse> {
    return request(`/attendance${queryString({ date, search })}`)
  },

  clockIn(input: ClockInInput): Promise<AttendanceRecord> {
    return request('/attendance/clock-in', { method: 'POST', body: input })
  },

  clockOut(attendanceId: string, clockOut: string): Promise<AttendanceRecord> {
    return request(`/attendance/${attendanceId}/clock-out`, {
      method: 'PUT',
      body: { clockOut },
    })
  },

  correctAttendance(
    attendanceId: string,
    input: AttendanceCorrectionInput,
  ): Promise<AttendanceRecord> {
    return request(`/attendance/${attendanceId}`, { method: 'PUT', body: input })
  },

  removeAttendance(attendanceId: string): Promise<void> {
    return request(`/attendance/${attendanceId}`, { method: 'DELETE' })
  },

  getSettings(): Promise<AttendanceSettings> {
    return request('/settings')
  },

  updateSettings(settings: SettingsInput): Promise<AttendanceSettings> {
    return request('/settings', { method: 'PUT', body: settings })
  },
}
```

Read it in three layers:

**The base URL.** `import.meta.env.VITE_API_URL || '/api'` — Vite reads environment
variables starting with `VITE_` at build time. There is no `.env` file in the
frontend, so this is `/api`, and the proxy from STEP 19 forwards it to the backend.
Set `VITE_API_URL` later if the API ever moves.

**The `request` helper.** Every method funnels through it. Read it once and the whole
file makes sense:

1. `fetch(`${API_BASE_URL}${path}`, {...})` — send the request. If there is a body,
   it is converted with `JSON.stringify` (you send JSON, exactly like Postman's
   "raw → JSON").
2. `response.status === 204 ? null : await response.json()` — the API's delete
   endpoints answer `204 No Content`, which has no body. Trying to parse JSON from a
   204 would fail, so 204 becomes `null`.
3. `if (!response.ok)` — a status outside 200–299. Your backend answers with
   `{ "error": "..." }` for 400/404/409, and `isErrorPayload` pulls that message out.
   The helper throws an `ApiError` carrying the message **and** the status code.
4. Otherwise, the parsed JSON is returned, typed as `T`.

**The `api` object.** One method per endpoint — the table below maps them to the
backend manual's endpoint reference:

| This method | Calls | Backend route |
| --- | --- | --- |
| `getStudents(search)` | `GET /api/students?search=` | list / search students |
| `createStudent(student)` | `POST /api/students` | create student |
| `updateStudent(id, student)` | `PUT /api/students/:id` | update student |
| `deleteStudent(id)` | `DELETE /api/students/:id` | delete student (+ attendance) |
| `getAttendance(date, search)` | `GET /api/attendance?date=&search=` | the day's register |
| `clockIn(input)` | `POST /api/attendance/clock-in` | clock in |
| `clockOut(id, time)` | `PUT /api/attendance/:id/clock-out` | clock out |
| `correctAttendance(id, input)` | `PUT /api/attendance/:id` | correct a record |
| `removeAttendance(id)` | `DELETE /api/attendance/:id` | remove a record |
| `getSettings()` | `GET /api/settings` | read settings |
| `updateSettings(settings)` | `PUT /api/settings` | update settings |

When a page needs data, it calls one of these; when the backend rejects something, the
page receives an `ApiError` whose `message` is the exact sentence your backend
validator produced.

**Read:** <https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API> — you saw
`fetch` in Part 1; this step shows the full pattern.

---

## STEP 31 — The shared components

**What are we doing?**

Creating three small reusable components: the search icon, the error banner, and the
modal window.

**Why do we need it?**

Both pages use the same search icon, show backend errors the same way, and open
dialogs the same way. Each piece is built once in `src/components/` and reused.

**1. `src/components/SearchIcon.tsx`** — type exactly:

```tsx
export function SearchIcon() {
  return (
    <svg
      className="search-icon"
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-4-4" />
    </svg>
  )
}
```

This is a component with **no props** that returns a fixed magnifying-glass SVG. The
`aria-hidden="true"` tells screen readers to ignore the decoration. The CSS positions
it inside the search field (STEP 21's `.search-icon`).

**2. `src/components/ErrorBanner.tsx`** — type exactly:

```tsx
interface ErrorBannerProps {
  error: unknown
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Please try again.'
}

export function ErrorBanner({ error }: ErrorBannerProps) {
  if (!error) return null

  return (
    <div className="recovery-banner" role="alert">
      <strong>Something went wrong.</strong>
      <span>{getErrorMessage(error)}</span>
    </div>
  )
}
```

Read it:

- `error: unknown` — the prop is "some value that may or may not be an error".
- `if (!error) return null` — **conditional rendering** again: no error, no banner.
- `error instanceof Error ? error.message : 'Please try again.'` — your `ApiError`
  (STEP 30) is a kind of `Error`, so `instanceof Error` is true and the banner shows
  the backend's message, for example "Clock-out must be later than the clock-in
  time." For anything else it falls back to a generic sentence.
- `role="alert"` — tells screen readers to announce the banner.

**3. `src/components/Modal.tsx`** — type exactly:

```tsx
import { useId, type MouseEvent, type ReactNode } from 'react'

interface ModalProps {
  title: string
  description?: string
  onClose: () => void
  children: ReactNode
}

export function Modal({ title, description, onClose, children }: ModalProps) {
  const titleId = useId()

  function keepOpen(event: MouseEvent<HTMLElement>) {
    event.stopPropagation()
  }

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section
        className="modal-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onMouseDown={keepOpen}
      >
        <div className="modal-heading">
          <div>
            <h2 id={titleId}>{title}</h2>
            {description ? <p>{description}</p> : null}
          </div>
          <button className="icon-button" type="button" onClick={onClose} aria-label="Close dialog">
            ×
          </button>
        </div>
        {children}
      </section>
    </div>
  )
}
```

This is the most important shared component, so read it carefully:

- **Props** — `title` and `onClose` are required; `description` is optional (the `?`
  in `description?: string`); `children` is the special React prop holding whatever
  JSX the caller puts *between* the `<Modal>` tags. The callers pass the form.
- **Backdrop and card** — the outer div covers the whole screen (the CSS class
  `modal-backdrop` is `position: fixed; inset: 0`). The inner section is the white
  card. Clicking the backdrop calls `onClose`; clicking *inside* the card must not,
  so `keepOpen` stops the event from reaching the backdrop — the same
  `stopPropagation` trick as the mobile menu in STEP 24.
- **`useId()`** — generates a unique id for this modal instance, used to connect the
  heading to `aria-labelledby` so screen readers announce the title. Never hard-code
  ids in a component used several times on a page.
- The close button (×) also calls `onClose`.

The modal is a **controlled overlay**: the component itself renders nothing
permanently — its parent decides whether it exists at all with `{dialog ? <Modal/> :
null}`. You see that in the very next part.

---

You have finished Part 4. The app can now talk to your API with typed, tested shapes,
and it has the three shared building blocks every dialog and error message will use.

---

# Part 5 — The Students page

Part 5 builds the first real page: listing students from the API, searching them, and
adding, editing, and deleting them. Each step replaces `StudentsPage.tsx` with a more
complete version — type the whole file each time, exactly as written.

---

## STEP 32 — Fetch and display students

**What are we doing?**

Replacing the Students stub with a page that loads the students from your API and
shows them in a table, with a working search box.

**Why do we need it?**

This is the first real data flow: the page asks React Query for students, React Query
calls `api.getStudents`, the API reads PostgreSQL, and the table appears. When this
works, every other data fetch in the app uses the same pattern.

Open `src/features/students/StudentsPage.tsx` and replace its entire contents:

```tsx
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { api } from '../../api/client'
import { ErrorBanner } from '../../components/ErrorBanner'
import { SearchIcon } from '../../components/SearchIcon'

export function StudentsPage() {
  const [search, setSearch] = useState('')

  const students = useQuery({
    queryKey: ['students', search],
    queryFn: () => api.getStudents(search),
  })

  const rows = students.data ?? []

  return (
    <>
      <section className="page-heading">
        <p className="eyebrow">Roster</p>
        <h1>Students</h1>
        <p>Manage the students whose attendance is tracked.</p>
      </section>

      <ErrorBanner error={students.error} />

      <section className="panel" aria-label="Students">
        <div className="toolbar">
          <div className="toolbar-filters">
            <label className="search-field">
              <SearchIcon />
              <span className="sr-only">Search students</span>
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search students"
              />
            </label>
          </div>
        </div>

        {students.isPending ? <p className="loading-state">Loading students…</p> : null}
        {!students.isPending && !students.error ? (
          <div className="table-wrap" tabIndex={0}>
            <table>
              <caption>{rows.length} {rows.length === 1 ? 'student' : 'students'}</caption>
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Student</th>
                  <th scope="col">Track</th>
                  <th scope="col">Status</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((student, index) => (
                  <tr key={student.studentId}>
                    <td>{String(index + 1).padStart(3, '0')}</td>
                    <td>{student.fullNames}</td>
                    <td className="capitalize">{student.track}</td>
                    <td>
                      <span className={`status-pill ${student.status === 'active' ? 'status-green' : 'status-red'}`}>
                        {student.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {rows.length === 0 ? (
              <div className="table-empty">
                <strong>No students found</strong>
                <span>Add a student or clear the search to show the roster.</span>
              </div>
            ) : null}
          </div>
        ) : null}
      </section>
    </>
  )
}
```

Save, then open the browser at `http://localhost:5173/students`.

**You should see** a table of every student you created in the backend manual — name,
track, and a coloured status pill (green for active, red for inactive). Type in the
search box: **You should see** the table narrow to matching names as you type (the
search happens on the server, via `GET /api/students?search=`, exactly like the
backend manual's `ilike` query).

Read the data-fetching pattern, because it is the one you will reuse everywhere:

```tsx
const students = useQuery({
  queryKey: ['students', search],
  queryFn: () => api.getStudents(search),
})
```

- `queryKey` — an **array that names this piece of data**. `['students', search]`
  means "the student list for this search text". When `search` changes, React Query
  sees a different key and fetches again — that is what makes the search box work
  with no extra code.
- `queryFn` — the function that fetches. It calls your API client and returns the
  promise of `Student[]`.
- The return value, `students`, is an object with everything the render needs:
  - `students.data` — the fetched array, or `undefined` while loading.
  - `students.isPending` — `true` until the first response arrives.
  - `students.error` — the `ApiError` if the request failed.

The render uses those three: "Loading students…" while pending; the table when there
is data; the `ErrorBanner` when something failed. `const rows = students.data ?? []`
makes the empty case safe — before the first response, `data` is `undefined`, and
`?? []` turns that into an empty list.

The table body is STEP 14's list pattern: `rows.map(...)` turns each student into one
`<tr>`, with `key={student.studentId}`.

**STOP HERE**

If the page shows "Something went wrong" with a message, open the browser's Network
tab (F12 → Network) and reload: you should see `students` requests going to
`/api/students` with status 200. A status other than 200 usually means the backend is
not running (start it) or the proxy is missing (check STEP 19).

**Read:** <https://tanstack.com/query/latest/docs/framework/react/overview> — the
first example is exactly this pattern.

---

## STEP 33 — Add a student

**What are we doing?**

Adding the "Add student" button, a modal with the form, and the code that creates the
student in the API.

**Why do we need it?**

This step introduces the two patterns the whole app depends on: a **dialog controlled
by state**, and a **mutation** — the React Query word for "change data", as opposed
to `useQuery`'s "read data".

Replace the entire contents of `StudentsPage.tsx` with:

```tsx
import { useState, type FormEvent } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '../../api/client'
import type {
  CreateStudentInput,
  StudentStatus,
  Track,
} from '../../api/types'
import { ErrorBanner } from '../../components/ErrorBanner'
import { Modal } from '../../components/Modal'
import { SearchIcon } from '../../components/SearchIcon'

type StudentDialog = { type: 'add' }

export function StudentsPage() {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const [dialog, setDialog] = useState<StudentDialog | null>(null)

  const students = useQuery({
    queryKey: ['students', search],
    queryFn: () => api.getStudents(search),
  })

  const addStudent = useMutation({
    mutationFn: api.createStudent,
    onSuccess: async () => {
      setDialog(null)
      await queryClient.invalidateQueries({ queryKey: ['students'] })
    },
  })

  const rows = students.data ?? []

  function submitStudent(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const track = String(form.get('track'))
    const status = String(form.get('status'))

    if (!isTrack(track) || !isStudentStatus(status)) {
      return
    }

    const student: CreateStudentInput = {
      fullNames: String(form.get('fullNames') ?? '').trim(),
      track,
      status,
    }

    addStudent.mutate(student)
  }

  return (
    <>
      <section className="page-heading">
        <p className="eyebrow">Roster</p>
        <h1>Students</h1>
        <p>Manage the students whose attendance is tracked.</p>
      </section>

      <ErrorBanner error={students.error} />

      <section className="panel" aria-label="Students">
        <div className="toolbar">
          <div className="toolbar-filters">
            <label className="search-field">
              <SearchIcon />
              <span className="sr-only">Search students</span>
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search students"
              />
            </label>
          </div>
          <div className="toolbar-actions">
            <button type="button" onClick={() => setDialog({ type: 'add' })}>Add student</button>
          </div>
        </div>

        {students.isPending ? <p className="loading-state">Loading students…</p> : null}
        {!students.isPending && !students.error ? (
          <div className="table-wrap" tabIndex={0}>
            <table>
              <caption>{rows.length} {rows.length === 1 ? 'student' : 'students'}</caption>
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Student</th>
                  <th scope="col">Track</th>
                  <th scope="col">Status</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((student, index) => (
                  <tr key={student.studentId}>
                    <td>{String(index + 1).padStart(3, '0')}</td>
                    <td>{student.fullNames}</td>
                    <td className="capitalize">{student.track}</td>
                    <td>
                      <span className={`status-pill ${student.status === 'active' ? 'status-green' : 'status-red'}`}>
                        {student.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {rows.length === 0 ? (
              <div className="table-empty">
                <strong>No students found</strong>
                <span>Add a student or clear the search to show the roster.</span>
              </div>
            ) : null}
          </div>
        ) : null}
      </section>

      {dialog?.type === 'add' ? (
        <Modal
          title="Add student"
          description="Create a student record in the backend."
          onClose={() => setDialog(null)}
        >
          <form className="modal-form" onSubmit={submitStudent}>
            <label className="form-field">
              Student name
              <input name="fullNames" type="text" autoFocus required />
            </label>
            <div className="form-grid">
              <label className="form-field">
                Track
                <select name="track" defaultValue="frontend">
                  <option value="frontend">Frontend</option>
                  <option value="backend">Backend</option>
                </select>
              </label>
              <label className="form-field">
                Status
                <select name="status" defaultValue="active">
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </label>
            </div>
            <ErrorBanner error={addStudent.error} />
            <div className="dialog-actions">
              <button className="secondary-button" type="button" onClick={() => setDialog(null)}>Cancel</button>
              <button type="submit" disabled={addStudent.isPending}>
                {addStudent.isPending ? 'Saving…' : 'Add student'}
              </button>
            </div>
          </form>
        </Modal>
      ) : null}
    </>
  )
}

function isTrack(value: string): value is Track {
  return value === 'frontend' || value === 'backend'
}

function isStudentStatus(value: string): value is StudentStatus {
  return value === 'active' || value === 'inactive'
}
```

Save and test in the browser:

1. Click **Add student** — the modal opens (backdrop covers the page, × closes it).
2. Type a name and click **Add student** in the modal — the modal closes and the new
   student appears in the table.
3. Open the backend in DBeaver, refresh the `students` table — the row is there.
   Your frontend just wrote to PostgreSQL through the whole stack.

Read the new pieces:

**The dialog state.** The page needs to remember "the add dialog is open". A boolean
would work, but the page will soon have three dialogs (add, edit, delete) and each
needs to remember which student it is about. So the state is a **discriminated
union** — a type with a `type` field that says which variant it is:

```tsx
type StudentDialog = { type: 'add' }
```

`useState<StudentDialog | null>(null)` — `null` means "no dialog is open", and
`{ type: 'add' }` means "the add dialog is open". The render checks
`dialog?.type === 'add'` to decide whether to show the modal. In STEP 34 the union
grows new variants.

**The mutation.** Reading uses `useQuery`; changing uses `useMutation`:

```tsx
const addStudent = useMutation({
  mutationFn: api.createStudent,
  onSuccess: async () => {
    setDialog(null)
    await queryClient.invalidateQueries({ queryKey: ['students'] })
  },
})
```

- `mutationFn` — the function that performs the change. `api.createStudent` receives
  exactly the argument you pass to `addStudent.mutate(...)`.
- `onSuccess` — runs after the API answers. Two things happen: the dialog closes, and
  `invalidateQueries` tells React Query "the student list is now stale, refetch it".
  This is how the table refreshes: the mutation succeeded → the query is invalidated →
  `useQuery` fetches again → the new student appears. **Without the invalidation, the
  table would show old data.**
- `addStudent.isPending` — `true` while the request is in flight; the submit button
  shows "Saving…" and is disabled. `addStudent.error` — the `ApiError` if the backend
  refused; the `ErrorBanner` inside the modal shows it.

**The form.** STEP 13's uncontrolled pattern: `name` attributes + `FormData` +
`preventDefault`. The `isTrack` / `isStudentStatus` checks at the bottom are
TypeScript guards — they narrow the string from the form into the `'frontend' |
'backend'` union so `CreateStudentInput` accepts it. The browser's `required` and the
select's fixed options already prevent most bad input, but the checks keep the types
honest.

**STOP HERE**

If the submit button stays "Saving…" and nothing happens, open the Network tab: a
failed `POST /api/students` shows the backend's `400` with its message in the
response — the same reason the backend manual's Postman tests failed. If the student
is created but the table does not refresh, the invalidation is missing or misspelled.

**Read:** <https://tanstack.com/query/latest/docs/framework/react/mutations> and
<https://tanstack.com/query/latest/docs/framework/react/invalidation>.

---

## STEP 34 — Edit and delete a student

**What are we doing?**

Adding the Actions column with Edit and Delete buttons, the edit form (reusing the
add form), and the delete confirmation.

**Why do we need it?**

Students are not finished until they can be changed and removed. Edit reuses the
existing form with prefilled values; delete needs a confirmation step so one click
never destroys data.

Replace the entire contents of `StudentsPage.tsx` with the final version:

```tsx
import { useState, type FormEvent } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '../../api/client'
import type {
  CreateStudentInput,
  Student,
  StudentStatus,
  Track,
} from '../../api/types'
import { ErrorBanner } from '../../components/ErrorBanner'
import { Modal } from '../../components/Modal'
import { SearchIcon } from '../../components/SearchIcon'

type StudentDialog =
  | { type: 'add' }
  | { type: 'edit'; student: Student }
  | { type: 'delete'; student: Student }

export function StudentsPage() {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const [dialog, setDialog] = useState<StudentDialog | null>(null)

  const students = useQuery({
    queryKey: ['students', search],
    queryFn: () => api.getStudents(search),
  })

  async function refreshStudentsAndAttendance() {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['students'] }),
      queryClient.invalidateQueries({ queryKey: ['attendance'] }),
    ])
  }

  const addStudent = useMutation({
    mutationFn: api.createStudent,
    onSuccess: async () => {
      setDialog(null)
      await refreshStudentsAndAttendance()
    },
  })

  const editStudent = useMutation({
    mutationFn: ({ studentId, student }: { studentId: string; student: CreateStudentInput }) =>
      api.updateStudent(studentId, student),
    onSuccess: async () => {
      setDialog(null)
      await refreshStudentsAndAttendance()
    },
  })

  const deleteStudent = useMutation({
    mutationFn: api.deleteStudent,
    onSuccess: async () => {
      setDialog(null)
      await refreshStudentsAndAttendance()
    },
  })

  function openAddDialog() {
    addStudent.reset()
    setDialog({ type: 'add' })
  }

  function openEditDialog(student: Student) {
    editStudent.reset()
    setDialog({ type: 'edit', student })
  }

  function openDeleteDialog(student: Student) {
    deleteStudent.reset()
    setDialog({ type: 'delete', student })
  }

  function submitStudent(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const track = String(form.get('track'))
    const status = String(form.get('status'))

    if (!isTrack(track) || !isStudentStatus(status)) {
      return
    }

    const student: CreateStudentInput = {
      fullNames: String(form.get('fullNames') ?? '').trim(),
      track,
      status,
    }

    if (dialog?.type === 'edit') {
      editStudent.mutate({ studentId: dialog.student.studentId, student })
    } else {
      addStudent.mutate(student)
    }
  }

  function confirmDelete(event: FormEvent<HTMLFormElement>, studentId: string) {
    event.preventDefault()
    deleteStudent.mutate(studentId)
  }

  const rows = students.data ?? []
  const studentBeingEdited = dialog?.type === 'edit' ? dialog.student : null
  const isSaving = addStudent.isPending || editStudent.isPending

  return (
    <>
      <section className="page-heading">
        <p className="eyebrow">Roster</p>
        <h1>Students</h1>
        <p>Manage the students whose attendance is tracked.</p>
      </section>

      <ErrorBanner error={students.error} />

      <section className="panel" aria-label="Students">
        <div className="toolbar">
          <div className="toolbar-filters">
            <label className="search-field">
              <SearchIcon />
              <span className="sr-only">Search students</span>
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search students"
              />
            </label>
          </div>
          <div className="toolbar-actions">
            <button type="button" onClick={openAddDialog}>Add student</button>
          </div>
        </div>

        {students.isPending ? <p className="loading-state">Loading students…</p> : null}
        {!students.isPending && !students.error ? (
          <div className="table-wrap" tabIndex={0}>
            <table>
              <caption>{rows.length} {rows.length === 1 ? 'student' : 'students'}</caption>
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Student</th>
                  <th scope="col">Track</th>
                  <th scope="col">Status</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((student, index) => (
                  <tr key={student.studentId}>
                    <td>{String(index + 1).padStart(3, '0')}</td>
                    <td>{student.fullNames}</td>
                    <td className="capitalize">{student.track}</td>
                    <td>
                      <span className={`status-pill ${student.status === 'active' ? 'status-green' : 'status-red'}`}>
                        {student.status}
                      </span>
                    </td>
                    <td>
                      <button
                        className="table-action"
                        type="button"
                        onClick={() => openEditDialog(student)}
                      >
                        Edit
                      </button>
                      <button
                        className="table-action"
                        type="button"
                        onClick={() => openDeleteDialog(student)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {rows.length === 0 ? (
              <div className="table-empty">
                <strong>No students found</strong>
                <span>Add a student or clear the search to show the roster.</span>
                <button className="empty-state-action" type="button" onClick={openAddDialog}>
                  Add student
                </button>
              </div>
            ) : null}
          </div>
        ) : null}
      </section>

      {dialog?.type === 'add' || dialog?.type === 'edit' ? (
        <Modal
          title={studentBeingEdited ? 'Edit student' : 'Add student'}
          description={studentBeingEdited
            ? 'Update this student’s name, track, or status.'
            : 'Create a student record in the backend.'}
          onClose={() => setDialog(null)}
        >
          <form className="modal-form" onSubmit={submitStudent}>
            <label className="form-field">
              Student name
              <input
                name="fullNames"
                type="text"
                defaultValue={studentBeingEdited?.fullNames ?? ''}
                autoFocus
                required
              />
            </label>
            <div className="form-grid">
              <label className="form-field">
                Track
                <select name="track" defaultValue={studentBeingEdited?.track ?? 'frontend'}>
                  <option value="frontend">Frontend</option>
                  <option value="backend">Backend</option>
                </select>
              </label>
              <label className="form-field">
                Status
                <select name="status" defaultValue={studentBeingEdited?.status ?? 'active'}>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </label>
            </div>
            <ErrorBanner error={studentBeingEdited ? editStudent.error : addStudent.error} />
            <div className="dialog-actions">
              <button className="secondary-button" type="button" onClick={() => setDialog(null)}>Cancel</button>
              <button type="submit" disabled={isSaving}>
                {isSaving ? 'Saving…' : studentBeingEdited ? 'Save changes' : 'Add student'}
              </button>
            </div>
          </form>
        </Modal>
      ) : null}

      {dialog?.type === 'delete' ? (
        <Modal
          title="Delete student?"
          description="This action cannot be undone."
          onClose={() => setDialog(null)}
        >
          <form
            className="modal-form"
            onSubmit={(event) => confirmDelete(event, dialog.student.studentId)}
          >
            <p className="confirmation-message">
              Delete <strong>{dialog.student.fullNames}</strong>? Their attendance records will also be deleted.
            </p>
            <ErrorBanner error={deleteStudent.error} />
            <div className="dialog-actions">
              <button className="secondary-button" type="button" onClick={() => setDialog(null)}>Cancel</button>
              <button className="danger-button" type="submit" disabled={deleteStudent.isPending}>
                {deleteStudent.isPending ? 'Deleting…' : 'Delete student'}
              </button>
            </div>
          </form>
        </Modal>
      ) : null}
    </>
  )
}

function isTrack(value: string): value is Track {
  return value === 'frontend' || value === 'backend'
}

function isStudentStatus(value: string): value is StudentStatus {
  return value === 'active' || value === 'inactive'
}
```

Save and test in the browser:

1. Click **Edit** on a student — the modal opens with that student's name, track, and
   status already filled in.
2. Change the name and save — the table updates.
3. Click **Delete** — the confirmation modal appears. Click **Cancel** — nothing
   happens. Click **Delete** again and confirm — the student disappears from the
   table and from the database.

Read what changed:

**The union grew.** `StudentDialog` now has three variants. The add variant carries no
data; the edit and delete variants carry the `student` they are about. TypeScript now
protects you: inside the delete branch, `dialog.student` exists; the code can never
read `dialog.student` from an add dialog because the type forbids it.

**One form, two jobs.** The add and edit forms are the same fields. The differences
are the prefilled values and the mutation called on submit:

- `defaultValue={studentBeingEdited?.fullNames ?? ''}` — when editing, the input
  starts with the student's current name (uncontrolled input from STEP 13); when
  adding, it starts empty.
- `submitStudent` checks `dialog?.type === 'edit'` and calls `editStudent.mutate({...})`
  instead of `addStudent.mutate(student)`.
- `studentBeingEdited` is derived once and used for the title, the defaults, and
  which error to show: `studentBeingEdited ? editStudent.error : addStudent.error`.

**The refresh helper.** All three mutations close the dialog and refresh. The helper
invalidates **both** `['students']` and `['attendance']` — because editing a
student's status changes who appears in the attendance register, and deleting a
student removes their attendance rows. Refreshing only the students list would leave
the Attendance page showing a deleted student until the next reload. `Promise.all`
runs both invalidations at once and `await`s both.

**The reset calls.** `openAddDialog` calls `addStudent.reset()` before opening. If a
previous attempt failed, the mutation still holds the old error; `reset()` clears it
so the reopened dialog does not show a stale "Something went wrong" before the user
does anything.

**Delete is two clicks by design.** The first click only opens the confirmation
modal. The actual deletion happens in `confirmDelete`, called by the modal's own
form. The modal warns that attendance records are deleted too — that is your
backend's `ON DELETE cascade` doing its job.

**Read:** <https://tanstack.com/query/latest/docs/framework/react/mutations>.

---

## STEP 35 — Checkpoint: student CRUD

**What are we doing?**

Testing the whole Students feature end to end, the way the backend manual tested
endpoints in Postman.

**Why do we need it?**

Compilation does not mean correct behaviour. This checklist proves every piece —
fetch, search, add, edit, delete — works against the real backend.

1. Add a student named `Test Student`, track Frontend, status Active. Confirm they
   appear in the table and in DBeaver.
2. Search for `test` — only `Test Student` (and any other matching name) appears.
   Clear the search — everyone returns.
3. Edit `Test Student`: rename them to `Test Student Edited` and switch the track to
   Backend. Save and confirm the table shows the new values.
4. Reload the page (F5) — the edited values remain (they are in PostgreSQL, not in
   the browser).
5. Edit again and set the status to Inactive. Open the Attendance page (later —
   or check the API with `GET /api/attendance?date=<today>` in Postman): `Test
   Student Edited` is not in the register, because the register only includes active
   students.
6. Click Delete, then Cancel — the student is still there.
7. Click Delete again and confirm. Reload — the student stays gone. In DBeaver, the
   row is gone from `students`.

**STOP HERE**

If any step misbehaves, compare your `StudentsPage.tsx` with the reference solution,
and watch the Network tab to see which request failed and what the backend answered.

---

# Part 6 — The Attendance page and Settings

Part 6 builds the heart of the app: the daily register with clock in, clock out,
correction, and removal, plus the Settings dialog that configures working days and
hours. You also make one small improvement to your backend.

---

## STEP 36 — The register: date, search, and the table

**What are we doing?**

Replacing the Attendance stub with the register: a date picker, a search box, the
day's notice, and the table of active students with their times and totals.

**Why do we need it?**

The register is the screen the app is named after. Every row comes from your
`GET /api/attendance?date=` endpoint — the same response you inspected in Postman in
the backend manual (STEP 47).

Open `src/features/attendance/AttendancePage.tsx` and replace its entire contents:

```tsx
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { api } from '../../api/client'
import { ErrorBanner } from '../../components/ErrorBanner'
import { SearchIcon } from '../../components/SearchIcon'
import { getLocalDate } from '../../utils/dateTime'

export function AttendancePage() {
  const [date, setDate] = useState(getLocalDate)
  const [search, setSearch] = useState('')

  const attendance = useQuery({
    queryKey: ['attendance', date, search],
    queryFn: () => api.getAttendance(date, search),
    enabled: Boolean(date),
  })

  const rows = attendance.data?.rows ?? []

  return (
    <>
      <section className="page-heading">
        <p className="eyebrow">Daily register</p>
        <h1>Attendance</h1>
        <p>Record and review attendance for the selected date.</p>
      </section>

      {attendance.data ? <p className="notice" aria-live="polite">{attendance.data.notice}</p> : null}
      <ErrorBanner error={attendance.error} />

      <section className="panel" aria-label="Attendance register">
        <div className="toolbar">
          <div className="toolbar-filters">
            <label className="inline-field">
              <span>Date</span>
              <input type="date" value={date} onChange={(event) => setDate(event.target.value)} />
            </label>
            <label className="search-field">
              <SearchIcon />
              <span className="sr-only">Search attendance</span>
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search students"
              />
            </label>
          </div>
        </div>

        {attendance.isPending ? <p className="loading-state">Loading attendance…</p> : null}

        {!attendance.isPending && !attendance.error ? (
          <div className="table-wrap" tabIndex={0}>
            <table>
              <caption>{rows.length} active {rows.length === 1 ? 'student' : 'students'}</caption>
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Student</th>
                  <th scope="col">Track</th>
                  <th scope="col">Status</th>
                  <th scope="col">Clock in</th>
                  <th scope="col">Clock out</th>
                  <th scope="col">Total</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, index) => {
                  const record = row.record

                  return (
                    <tr key={row.student.studentId}>
                      <td>{String(index + 1).padStart(3, '0')}</td>
                      <td>{row.student.fullNames}</td>
                      <td className="capitalize">{row.student.track}</td>
                      <td>
                        <span className={`status-pill ${row.status === 'Currently in' ? 'status-green' : row.status === 'Not clocked in' ? 'status-red' : ''}`}>
                          {row.status}
                        </span>
                      </td>
                      <td>{record?.clockIn || '—'}</td>
                      <td>{record?.clockOut || '—'}</td>
                      <td>{row.total}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            {rows.length === 0 ? (
              <div className="table-empty">
                <strong>No students to show</strong>
                <span>Add an active student or clear the search.</span>
              </div>
            ) : null}
          </div>
        ) : null}
      </section>
    </>
  )
}
```

Save and open `http://localhost:5173`. **You should see** the register for today:
one row per active student, with `—` for students without a record, the computed
status pill ("Not clocked in" red, "Currently in" green, "Completed" plain), and the
daily total. The notice above the panel comes straight from your API — the same
sentence Postman returned.

Read the new ideas:

- **`useState(getLocalDate)`** — notice there are **no parentheses**. React calls
  `getLocalDate()` once, on the first render, to compute the initial date. This is
  called a *lazy initializer*. Writing `useState(getLocalDate())` would call it on
  every render and ignore the result — a subtle bug to avoid.
- **`enabled: Boolean(date)`** — the query does not run until there is a date. The
  date input always has a value, but this guard is the React Query way of saying
  "only fetch when this is ready".
- **`queryKey: ['attendance', date, search]`** — same pattern as the students page:
  the key includes both filters, so changing the date or typing in the search box
  refetches. The register is server-side: the API returns only the matching rows.
- **`record?.clockIn || '—'`** — `record` is `null` for a student with no record
  that day (remember `AttendanceRow.record: AttendanceRecord | null`). The `?.`
  means "if record is null, skip the access"; `|| '—'` replaces a missing value with
  the em dash.
- The status pill's `className` is built with a template literal, choosing the green
  or red class based on the status — the same pattern as the students page.

---

## STEP 37 — Clock in and clock out

**What are we doing?**

Adding the two clock actions: a Clock in button on each row (and one in the toolbar
with a student chooser), and a Clock out button for students who are currently in.

**Why do we need it?**

This step introduces mutations on the attendance page, plus the "row button vs.
toolbar button" problem: a row already knows its student; the toolbar does not, so it
needs a dropdown.

Replace the entire contents of `AttendancePage.tsx` with:

```tsx
import { useState, type FormEvent } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '../../api/client'
import type { AttendanceRecord, Student } from '../../api/types'
import { ErrorBanner } from '../../components/ErrorBanner'
import { Modal } from '../../components/Modal'
import { SearchIcon } from '../../components/SearchIcon'
import { getLocalDate, getLocalTime } from '../../utils/dateTime'

type AttendanceDialog =
  | { type: 'clock-in'; student: Student | null }
  | { type: 'clock-out'; student: Student; record: AttendanceRecord }

export function AttendancePage() {
  const queryClient = useQueryClient()
  const [date, setDate] = useState(getLocalDate)
  const [search, setSearch] = useState('')
  const [dialog, setDialog] = useState<AttendanceDialog | null>(null)

  const attendance = useQuery({
    queryKey: ['attendance', date, search],
    queryFn: () => api.getAttendance(date, search),
    enabled: Boolean(date),
  })

  const students = useQuery({
    queryKey: ['students'],
    queryFn: () => api.getStudents(),
  })

  const refreshAttendance = () => queryClient.invalidateQueries({ queryKey: ['attendance'] })

  const clockIn = useMutation({
    mutationFn: api.clockIn,
    onSuccess: async () => {
      setDialog(null)
      await refreshAttendance()
    },
  })

  const clockOut = useMutation({
    mutationFn: ({ attendanceId, time }: { attendanceId: string; time: string }) =>
      api.clockOut(attendanceId, time),
    onSuccess: async () => {
      setDialog(null)
      await refreshAttendance()
    },
  })

  const rows = attendance.data?.rows ?? []
  const activeStudents = (students.data ?? []).filter((student) => student.status === 'active')

  function submitClockIn(event: FormEvent<HTMLFormElement>, student: Student | null) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    clockIn.mutate({
      studentId: student?.studentId ?? String(form.get('studentId') ?? ''),
      date,
      clockIn: String(form.get('clockIn') ?? ''),
    })
  }

  function submitClockOut(event: FormEvent<HTMLFormElement>, record: AttendanceRecord) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    clockOut.mutate({
      attendanceId: record.attendanceId,
      time: String(form.get('clockOut') ?? ''),
    })
  }

  return (
    <>
      <section className="page-heading">
        <p className="eyebrow">Daily register</p>
        <h1>Attendance</h1>
        <p>Record and review attendance for the selected date.</p>
      </section>

      {attendance.data ? <p className="notice" aria-live="polite">{attendance.data.notice}</p> : null}
      <ErrorBanner error={attendance.error} />

      <section className="panel" aria-label="Attendance register">
        <div className="toolbar">
          <div className="toolbar-filters">
            <label className="inline-field">
              <span>Date</span>
              <input type="date" value={date} onChange={(event) => setDate(event.target.value)} />
            </label>
            <label className="search-field">
              <SearchIcon />
              <span className="sr-only">Search attendance</span>
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search students"
              />
            </label>
          </div>
          <div className="toolbar-actions">
            <button
              type="button"
              onClick={() => {
                clockIn.reset()
                setDialog({ type: 'clock-in', student: null })
              }}
            >
              Clock in
            </button>
          </div>
        </div>

        {attendance.isPending ? <p className="loading-state">Loading attendance…</p> : null}

        {!attendance.isPending && !attendance.error ? (
          <div className="table-wrap" tabIndex={0}>
            <table>
              <caption>{rows.length} active {rows.length === 1 ? 'student' : 'students'}</caption>
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Student</th>
                  <th scope="col">Track</th>
                  <th scope="col">Status</th>
                  <th scope="col">Clock in</th>
                  <th scope="col">Clock out</th>
                  <th scope="col">Total</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, index) => {
                  const record = row.record

                  return (
                    <tr key={row.student.studentId}>
                      <td>{String(index + 1).padStart(3, '0')}</td>
                      <td>{row.student.fullNames}</td>
                      <td className="capitalize">{row.student.track}</td>
                      <td>
                        <span className={`status-pill ${row.status === 'Currently in' ? 'status-green' : row.status === 'Not clocked in' ? 'status-red' : ''}`}>
                          {row.status}
                        </span>
                      </td>
                      <td>{record?.clockIn || '—'}</td>
                      <td>{record?.clockOut || '—'}</td>
                      <td>{row.total}</td>
                      <td>
                        {!record ? (
                          <button
                            className="table-action"
                            type="button"
                            onClick={() => {
                              clockIn.reset()
                              setDialog({ type: 'clock-in', student: row.student })
                            }}
                          >
                            Clock in
                          </button>
                        ) : !record.clockOut ? (
                          <button
                            className="table-action"
                            type="button"
                            onClick={() => setDialog({ type: 'clock-out', student: row.student, record })}
                          >
                            Clock out
                          </button>
                        ) : null}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            {rows.length === 0 ? (
              <div className="table-empty">
                <strong>No students to show</strong>
                <span>Add an active student or clear the search.</span>
              </div>
            ) : null}
          </div>
        ) : null}
      </section>

      {dialog?.type === 'clock-in' ? (
        <Modal
          title="Clock in student"
          description={dialog.student ? `${dialog.student.fullNames} on ${date}` : `Choose a student for ${date}.`}
          onClose={() => setDialog(null)}
        >
          <form className="modal-form" onSubmit={(event) => submitClockIn(event, dialog.student)}>
            {!dialog.student ? (
              <label className="form-field">
                Student
                <select name="studentId" defaultValue="" required autoFocus>
                  <option value="" disabled>Select a student</option>
                  {activeStudents.map((student) => (
                    <option key={student.studentId} value={student.studentId}>{student.fullNames}</option>
                  ))}
                </select>
              </label>
            ) : null}
            <label className="form-field">
              Clock-in time
              <input
                name="clockIn"
                type="time"
                defaultValue={getLocalTime()}
                autoFocus={Boolean(dialog.student)}
                required
              />
            </label>
            <ErrorBanner error={clockIn.error || (!dialog.student ? students.error : null)} />
            {!dialog.student && !students.isPending && activeStudents.length === 0 ? (
              <p className="form-hint">There are no active students to clock in.</p>
            ) : null}
            <div className="dialog-actions">
              <button className="secondary-button" type="button" onClick={() => setDialog(null)}>Cancel</button>
              <button
                type="submit"
                disabled={clockIn.isPending || (!dialog.student && activeStudents.length === 0)}
              >
                {clockIn.isPending ? 'Saving…' : 'Clock in'}
              </button>
            </div>
          </form>
        </Modal>
      ) : null}

      {dialog?.type === 'clock-out' ? (
        <Modal title="Clock out student" description={dialog.student.fullNames} onClose={() => setDialog(null)}>
          <form className="modal-form" onSubmit={(event) => submitClockOut(event, dialog.record)}>
            <label className="form-field">
              Clock-out time
              <input name="clockOut" type="time" defaultValue={getLocalTime()} required />
            </label>
            <ErrorBanner error={clockOut.error} />
            <div className="dialog-actions">
              <button className="secondary-button" type="button" onClick={() => setDialog(null)}>Cancel</button>
              <button type="submit" disabled={clockOut.isPending}>
                {clockOut.isPending ? 'Saving…' : 'Clock out'}
              </button>
            </div>
          </form>
        </Modal>
      ) : null}
    </>
  )
}
```

Save and test in the browser:

1. Click **Clock in** on a row without a record — the modal opens with that
   student's name and the current time prefilled. Submit — the row changes to
   "Currently in" with the clock-in time shown.
2. Click the toolbar **Clock in** — the modal has a *Select a student* dropdown
   instead of a fixed name. Pick another student and submit.
3. For a student who is in, the row now shows **Clock out** — click it and submit.
   The row becomes "Completed" with a total.
4. Try clocking in the same student twice for the same day — the backend refuses
   with `409` and the modal shows "This student is already clocked in for that date."
   This is your backend's `findRecord` check working.

Read the new ideas:

**One dialog state, two shapes.** `AttendanceDialog` has a `clock-in` variant whose
`student` may be `null` (toolbar: nobody chosen yet) or a real student (row button),
and a `clock-out` variant that always carries the student and the record. The submit
handler reads the student from the dialog when there is one, otherwise from the
form's `studentId` select:

```tsx
studentId: student?.studentId ?? String(form.get('studentId') ?? '')
```

**Row buttons vs. toolbar button.** The row's Clock in button passes
`row.student` into the dialog; the toolbar's passes `null`. The modal renders the
student chooser *only* when `!dialog.student`. The row button disappears when a
record exists — the render picks the button by looking at the record: no record →
Clock in; record without clock-out → Clock out; completed record → no action yet
(correction comes in STEP 39).

**The students query.** The toolbar needs the full active-student list, so the page
fetches it with a second `useQuery`. `activeStudents` filters out inactive students
client-side. The chooser is disabled — and a hint appears — when there are no active
students at all.

**The backend still owns the rules.** The browser validates that a time exists, but
the real rules — no duplicate clock-in, no future dates, working days, times inside
the opening/closing window — all live in your backend's `checkTimes`. The `ErrorBanner`
in the modal shows whatever message the backend returns.

---

## STEP 38 — The Settings modal

**What are we doing?**

Creating `SettingsModal.tsx`, the dialog that edits working days and opening/closing
times.

**Why do we need it?**

Settings is a feature of its own, with its own form and mutation, so it lives in its
own file — the same separation your backend used between `settings.controller.ts` and
the others.

Create `src/features/attendance/SettingsModal.tsx` and type exactly:

```tsx
import type { FormEvent } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../api/client'
import type { AttendanceSettings } from '../../api/types'
import { ErrorBanner } from '../../components/ErrorBanner'
import { Modal } from '../../components/Modal'

const WEEKDAYS = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
] as const

interface SettingsModalProps {
  settings: AttendanceSettings | undefined
  error: unknown
  onClose: () => void
}

export function SettingsModal({ settings, error, onClose }: SettingsModalProps) {
  const queryClient = useQueryClient()
  const update = useMutation({
    mutationFn: api.updateSettings,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['settings'] }),
        queryClient.invalidateQueries({ queryKey: ['attendance'] }),
      ])
      onClose()
    },
  })

  function submitSettings(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)

    update.mutate({
      workingDays: form.getAll('workingDays').map(Number),
      openingTime: String(form.get('openingTime') ?? ''),
      closingTime: String(form.get('closingTime') ?? ''),
    })
  }

  return (
    <Modal
      title="Attendance settings"
      description="Choose working days and operating hours."
      onClose={onClose}
    >
      <ErrorBanner error={error || update.error} />
      {!settings ? (
        <p className="loading-state">Loading settings…</p>
      ) : (
        <form className="modal-form" onSubmit={submitSettings}>
          <fieldset className="weekday-group">
            <legend>Working days</legend>
            <div className="weekday-grid">
              {WEEKDAYS.map((weekday, index) => (
                <label key={weekday}>
                  <input
                    name="workingDays"
                    type="checkbox"
                    value={index}
                    defaultChecked={settings.workingDays.includes(index)}
                  />
                  {weekday.slice(0, 3)}
                </label>
              ))}
            </div>
          </fieldset>
          <div className="form-grid">
            <label className="form-field">
              Opening time
              <input name="openingTime" type="time" defaultValue={settings.openingTime} required />
            </label>
            <label className="form-field">
              Closing time
              <input name="closingTime" type="time" defaultValue={settings.closingTime} required />
            </label>
          </div>
          <div className="dialog-actions">
            <button className="secondary-button" type="button" onClick={onClose}>Cancel</button>
            <button type="submit" disabled={update.isPending}>
              {update.isPending ? 'Saving…' : 'Save settings'}
            </button>
          </div>
        </form>
      )}
    </Modal>
  )
}
```

Read the parts you have not seen before:

- **Props.** The parent (AttendancePage) already fetched the settings, so this
  component receives them as props: `settings` (or `undefined` while loading), any
  fetch `error`, and `onClose`. It does its **own** fetching only for the save
  mutation.
- **`WEEKDAYS ... as const`** — a fixed list of day names; `as const` tells
  TypeScript these are exactly these strings. The checkboxes are built with
  `WEEKDAYS.map(...)`.
- **`defaultChecked={settings.workingDays.includes(index)}`** — the checkbox is
  ticked when the current settings contain that day's number. Your backend stores
  working days as `[0, 1, 2, 3, 4]` (Monday to Friday — remember the comment in
  `schema.ts`: `0 = Monday ... 6 = Sunday`). `index` in the map is exactly that
  number.
- **`form.getAll('workingDays').map(Number)`** — checkboxes with the same `name`
  submit several values, so `getAll` returns them all as an array; `.map(Number)`
  converts the strings to the numbers your API expects.
- **Two invalidations.** Saving settings can change whether today is a working day,
  so both `['settings']` and `['attendance']` are refreshed — the register's notice
  and clock-in rules must reflect the new schedule.

---

## STEP 39 — Correct, remove, and the Settings button

**What are we doing?**

Finishing the Attendance page: editing a record's times, removing a record behind a
confirmation, and opening the Settings modal from the toolbar.

**Why do we need it?**

This is the final version of the page. Correction needs the existing record's times
prefilled; removal needs the two-step confirmation so a misclick cannot destroy a
record; the Settings button ties the modal from STEP 38 into the toolbar.

Replace the entire contents of `AttendancePage.tsx` with the final version:

```tsx
import { useState, type FormEvent } from 'react'
import { Link } from '@tanstack/react-router'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '../../api/client'
import type { AttendanceRecord, Student } from '../../api/types'
import { ErrorBanner } from '../../components/ErrorBanner'
import { Modal } from '../../components/Modal'
import { SearchIcon } from '../../components/SearchIcon'
import { getLocalDate, getLocalTime } from '../../utils/dateTime'
import { SettingsModal } from './SettingsModal'

type AttendanceDialog =
  | { type: 'clock-in'; student: Student | null }
  | { type: 'clock-out'; student: Student; record: AttendanceRecord }
  | { type: 'correct'; student: Student; record: AttendanceRecord }

export function AttendancePage() {
  const queryClient = useQueryClient()
  const [date, setDate] = useState(getLocalDate)
  const [search, setSearch] = useState('')
  const [dialog, setDialog] = useState<AttendanceDialog | null>(null)
  const [confirmingRemove, setConfirmingRemove] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)

  const attendance = useQuery({
    queryKey: ['attendance', date, search],
    queryFn: () => api.getAttendance(date, search),
    enabled: Boolean(date),
  })

  const settings = useQuery({
    queryKey: ['settings'],
    queryFn: api.getSettings,
  })

  const students = useQuery({
    queryKey: ['students'],
    queryFn: () => api.getStudents(),
  })

  const refreshAttendance = () => queryClient.invalidateQueries({ queryKey: ['attendance'] })

  const clockIn = useMutation({
    mutationFn: api.clockIn,
    onSuccess: async () => {
      setDialog(null)
      await refreshAttendance()
    },
  })

  const clockOut = useMutation({
    mutationFn: ({ attendanceId, time }: { attendanceId: string; time: string }) =>
      api.clockOut(attendanceId, time),
    onSuccess: async () => {
      setDialog(null)
      await refreshAttendance()
    },
  })

  const correctAttendance = useMutation({
    mutationFn: ({
      attendanceId,
      clockIn: start,
      clockOut: end,
    }: {
      attendanceId: string
      clockIn: string
      clockOut: string
    }) => api.correctAttendance(attendanceId, { clockIn: start, clockOut: end || null }),
    onSuccess: async () => {
      setDialog(null)
      await refreshAttendance()
    },
  })

  const removeAttendance = useMutation({
    mutationFn: api.removeAttendance,
    onSuccess: async () => {
      setConfirmingRemove(false)
      setDialog(null)
      await refreshAttendance()
    },
  })

  const rows = attendance.data?.rows ?? []
  const activeStudents = (students.data ?? []).filter((student) => student.status === 'active')

  function submitClockIn(event: FormEvent<HTMLFormElement>, student: Student | null) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    clockIn.mutate({
      studentId: student?.studentId ?? String(form.get('studentId') ?? ''),
      date,
      clockIn: String(form.get('clockIn') ?? ''),
    })
  }

  function submitClockOut(event: FormEvent<HTMLFormElement>, record: AttendanceRecord) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    clockOut.mutate({
      attendanceId: record.attendanceId,
      time: String(form.get('clockOut') ?? ''),
    })
  }

  function submitCorrection(event: FormEvent<HTMLFormElement>, record: AttendanceRecord) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    correctAttendance.mutate({
      attendanceId: record.attendanceId,
      clockIn: String(form.get('clockIn') ?? ''),
      clockOut: String(form.get('clockOut') ?? ''),
    })
  }

  return (
    <>
      <section className="page-heading">
        <p className="eyebrow">Daily register</p>
        <h1>Attendance</h1>
        <p>Record and review attendance for the selected date.</p>
      </section>

      {attendance.data ? <p className="notice" aria-live="polite">{attendance.data.notice}</p> : null}
      <ErrorBanner error={attendance.error} />

      <section className="panel" aria-label="Attendance register">
        <div className="toolbar">
          <div className="toolbar-filters">
            <label className="inline-field">
              <span>Date</span>
              <input type="date" value={date} onChange={(event) => setDate(event.target.value)} />
            </label>
            <label className="search-field">
              <SearchIcon />
              <span className="sr-only">Search attendance</span>
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search students"
              />
            </label>
          </div>
          <div className="toolbar-actions">
            <button
              type="button"
              onClick={() => {
                clockIn.reset()
                setDialog({ type: 'clock-in', student: null })
              }}
            >
              Clock in
            </button>
            <button className="secondary-button" type="button" onClick={() => setSettingsOpen(true)}>
              Settings
            </button>
          </div>
        </div>

        {attendance.isPending ? <p className="loading-state">Loading attendance…</p> : null}

        {!attendance.isPending && !attendance.error ? (
          <div className="table-wrap" tabIndex={0}>
            <table>
              <caption>{rows.length} active {rows.length === 1 ? 'student' : 'students'}</caption>
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Student</th>
                  <th scope="col">Track</th>
                  <th scope="col">Status</th>
                  <th scope="col">Clock in</th>
                  <th scope="col">Clock out</th>
                  <th scope="col">Total</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, index) => {
                  const record = row.record

                  return (
                    <tr key={row.student.studentId}>
                    <td>{String(index + 1).padStart(3, '0')}</td>
                    <td>{row.student.fullNames}</td>
                    <td className="capitalize">{row.student.track}</td>
                    <td>
                      <span className={`status-pill ${row.status === 'Currently in' ? 'status-green' : row.status === 'Not clocked in' ? 'status-red' : ''}`}>
                        {row.status}
                      </span>
                    </td>
                    <td>{record?.clockIn || '—'}</td>
                    <td>{record?.clockOut || '—'}</td>
                    <td>{row.total}</td>
                    <td>
                      {!record ? (
                        <button
                          className="table-action"
                          type="button"
                          onClick={() => {
                            clockIn.reset()
                            setDialog({ type: 'clock-in', student: row.student })
                          }}
                        >
                          Clock in
                        </button>
                      ) : !record.clockOut ? (
                        <>
                          <button
                            className="table-action"
                            type="button"
                            onClick={() => setDialog({ type: 'clock-out', student: row.student, record })}
                          >
                            Clock out
                          </button>
                          <button
                            className="table-action"
                            type="button"
                            onClick={() => setDialog({ type: 'correct', student: row.student, record })}
                          >
                            Edit
                          </button>
                        </>
                      ) : (
                        <button
                          className="table-action"
                          type="button"
                          onClick={() => setDialog({ type: 'correct', student: row.student, record })}
                        >
                          Edit
                        </button>
                      )}
                    </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            {rows.length === 0 ? (
              <div className="table-empty">
                <strong>No students to show</strong>
                <span>Add an active student or clear the search.</span>
                <Link className="empty-state-action" to="/students">Manage students</Link>
              </div>
            ) : null}
          </div>
        ) : null}
      </section>

      {dialog?.type === 'clock-in' ? (
        <Modal
          title="Clock in student"
          description={dialog.student ? `${dialog.student.fullNames} on ${date}` : `Choose a student for ${date}.`}
          onClose={() => setDialog(null)}
        >
          <form className="modal-form" onSubmit={(event) => submitClockIn(event, dialog.student)}>
            {!dialog.student ? (
              <label className="form-field">
                Student
                <select name="studentId" defaultValue="" required autoFocus>
                  <option value="" disabled>Select a student</option>
                  {activeStudents.map((student) => (
                    <option key={student.studentId} value={student.studentId}>{student.fullNames}</option>
                  ))}
                </select>
              </label>
            ) : null}
            <label className="form-field">
              Clock-in time
              <input
                name="clockIn"
                type="time"
                defaultValue={getLocalTime()}
                autoFocus={Boolean(dialog.student)}
                required
              />
            </label>
            <ErrorBanner error={clockIn.error || (!dialog.student ? students.error : null)} />
            {!dialog.student && !students.isPending && activeStudents.length === 0 ? (
              <p className="form-hint">There are no active students to clock in.</p>
            ) : null}
            <div className="dialog-actions">
              <button className="secondary-button" type="button" onClick={() => setDialog(null)}>Cancel</button>
              <button
                type="submit"
                disabled={clockIn.isPending || (!dialog.student && activeStudents.length === 0)}
              >
                {clockIn.isPending ? 'Saving…' : 'Clock in'}
              </button>
            </div>
          </form>
        </Modal>
      ) : null}

      {dialog?.type === 'clock-out' ? (
        <Modal title="Clock out student" description={dialog.student.fullNames} onClose={() => setDialog(null)}>
          <form className="modal-form" onSubmit={(event) => submitClockOut(event, dialog.record)}>
            <label className="form-field">
              Clock-out time
              <input name="clockOut" type="time" defaultValue={getLocalTime()} required />
            </label>
            <ErrorBanner error={clockOut.error} />
            <div className="dialog-actions">
              <button className="secondary-button" type="button" onClick={() => setDialog(null)}>Cancel</button>
              <button type="submit" disabled={clockOut.isPending}>
                {clockOut.isPending ? 'Saving…' : 'Clock out'}
              </button>
            </div>
          </form>
        </Modal>
      ) : null}

      {dialog?.type === 'correct' ? (
        <Modal
          title="Correct attendance"
          description={`${dialog.student.fullNames} on ${date}`}
          onClose={() => setDialog(null)}
        >
          <form className="modal-form" onSubmit={(event) => submitCorrection(event, dialog.record)}>
            <label className="form-field">
              Clock-in time
              <input name="clockIn" type="time" defaultValue={dialog.record.clockIn} required />
            </label>
            <label className="form-field">
              Clock-out time
              <input name="clockOut" type="time" defaultValue={dialog.record.clockOut || ''} />
            </label>
            <ErrorBanner error={correctAttendance.error} />
            <div className="dialog-actions split-actions">
              <button
                className="danger-button"
                type="button"
                disabled={removeAttendance.isPending}
                onClick={() => {
                  removeAttendance.reset()
                  setConfirmingRemove(true)
                }}
              >
                Remove
              </button>
              <span className="action-spacer" />
              <button className="secondary-button" type="button" onClick={() => setDialog(null)}>Cancel</button>
              <button type="submit" disabled={correctAttendance.isPending}>
                {correctAttendance.isPending ? 'Saving…' : 'Save'}
              </button>
            </div>
          </form>
        </Modal>
      ) : null}

      {dialog?.type === 'correct' && confirmingRemove ? (
        <Modal
          title="Remove attendance record?"
          description="This action cannot be undone."
          onClose={() => setConfirmingRemove(false)}
        >
          <form
            className="modal-form"
            onSubmit={(event) => {
              event.preventDefault()
              removeAttendance.mutate(dialog.record.attendanceId)
            }}
          >
            <p className="confirmation-message">
              Remove {dialog.student.fullNames}’s attendance record for {date}?
            </p>
            <ErrorBanner error={removeAttendance.error} />
            <div className="dialog-actions">
              <button className="secondary-button" type="button" onClick={() => setConfirmingRemove(false)}>
                Cancel
              </button>
              <button className="danger-button" type="submit" disabled={removeAttendance.isPending}>
                {removeAttendance.isPending ? 'Removing…' : 'Remove record'}
              </button>
            </div>
          </form>
        </Modal>
      ) : null}

      {settingsOpen ? (
        <SettingsModal
          settings={settings.data}
          error={settings.error}
          onClose={() => setSettingsOpen(false)}
        />
      ) : null}
    </>
  )
}
```

Save and test in the browser:

1. **Correction.** For a student with a record, click **Edit** — the modal opens with
   the recorded times prefilled. Change them and save — the row updates. Leave the
   clock-out field empty and save — the row becomes "Currently in" again (your
   backend stores `null` and the status recalculates).
2. **Removal.** Open Edit and click **Remove** — a second modal asks to confirm.
   Click Cancel — the record stays. Click Remove again and confirm — the row returns
   to "Not clocked in".
3. **Settings.** Click the toolbar **Settings** — the dialog opens with the current
   working days and hours. Change a day or time and save — the notice above the
   register updates (for example, if you uncheck today, the notice explains that
   nobody can be clocked in).

Read the new pieces:

**Correction.** The `correct` dialog variant carries the record, so the form can
prefill both times: `defaultValue={dialog.record.clockIn}` and
`defaultValue={dialog.record.clockOut || ''}` (empty when there is no clock-out).
The mutation sends `clockOut: end || null` — an empty field becomes `null`, matching
your backend's `correctionSchema` and the `clockOut ?? null` in your controller.

**Removal is two clicks.** The Remove button inside the correction dialog only sets
`confirmingRemove` to `true`. A second, separate modal — shown only when a
correction dialog is active *and* confirmation is requested — performs the actual
`removeAttendance.mutate(...)`. Each error sits next to its own action:
`correctAttendance.error` in the correction modal, `removeAttendance.error` in the
confirmation modal.

**The empty state's link.** When there are no rows, the empty state offers a
`Link` to the Students page — a router `Link` inside a page, showing that navigation
and content work together.

**Two independent states.** `dialog` (which action is open) and `settingsOpen`
(boolean) are separate — the Settings modal is not part of the attendance dialog
union because it never needs to remember a student or record. One boolean is the
right tool when there is exactly one on/off question.

---

## STEP 40 — Checkpoint: attendance flows

**What are we doing?**

Testing every attendance flow against the real backend, mirroring the backend
manual's STEP 47.

**Why do we need it?**

The register, the two clock paths, correction, and removal are the product. Each
check below maps to a backend rule you already tested in Postman — now you see it
from the user's side.

1. Use a row's **Clock in** button on an active student. The row shows "Currently
   in" and today's time.
2. Use the toolbar **Clock in** and choose a different student from the dropdown.
3. Clock in the same student twice — the backend's `409` message appears in the
   modal: "This student is already clocked in for that date."
4. Clock the second student out — "Completed" with a daily total. Check the total
   against your own arithmetic (your backend computes `HH:MM` differences; `08:15`
   to `16:45` is `8h 30m`).
5. **Edit** the first record: change both times and save.
6. In the correction form, clear the clock-out time and save — the student becomes
   "Currently in".
7. Click **Remove**, cancel — the record remains. Remove again and confirm — the row
   shows "Not clocked in".
8. Search by a student's name and by a track (your backend searches both).
9. Change the date to a past working day and back — the register refetches each time.
10. Verify in DBeaver that the `attendance` table matches what the page shows.

**STOP HERE**

If a flow fails, watch the Network tab: the failed request shows the exact URL,
method, and the backend's status and message. Compare your `AttendancePage.tsx` and
`SettingsModal.tsx` with the reference solution line by line.

---

# Part 7 — The last backend rule, and final checks

Part 7 adds one missing validation to your backend (the frontend depends on it),
then runs the full automated checks and the complete browser test.

---

## STEP 41 — Add the closing-time rule to your backend

**What are we doing?**

Improving the backend's settings validator so it refuses a closing time that is not
later than the opening time.

**Why do we need it?**

The browser's time inputs only guarantee that a time exists. Nothing yet stops a user
from saving `openingTime: "17:00"` with `closingTime: "09:00"` — and your backend's
`checkTimes` would then reject every clock-in. The rule belongs on the server, next
to the other rules, because the browser can always be bypassed.

Open `backend/src/lib/validators.ts`. Find the `settingsSchema` you wrote in the
backend manual (STEP 35) and replace it with:

```ts
export const settingsSchema = z
  .object({
    workingDays: z.array(z.number().int().min(0).max(6))
      .min(1, "Pick at least one working day."),
    openingTime: z.string().regex(/^\d{2}:\d{2}$/, "Opening time must be HH:MM."),
    closingTime: z.string().regex(/^\d{2}:\d{2}$/, "Closing time must be HH:MM."),
  })
  .refine((settings) => settings.closingTime > settings.openingTime, {
    message: "Closing time must be later than opening time.",
    path: ["closingTime"],
  });
```

Save. If the backend is running under `npm run dev`, tsx watch restarts it
automatically. If it is not running, start it.

Read what changed: `.refine(...)` adds a check that runs **after** the field checks.
It receives the whole parsed object and returns `true` when valid. The `message` is
the error shown to the user, and `path` says which field the error belongs to.
`"17:00" > "09:00"` works because `HH:MM` is zero-padded — string comparison of
same-length time strings matches numeric order within one day.

**You should see** both of these:

1. In the browser, open the Settings modal, set Closing time to `09:00` and Opening
   time to `17:00`, and save — the modal shows "Closing time must be later than
   opening time." and stays open with your values intact.
2. In Postman, `PUT http://localhost:4000/api/settings` with `openingTime: "17:00"`
   and `closingTime: "09:00"` returns status `400` with
   `{ "error": "Closing time must be later than opening time." }`.

Restore the settings to working days Monday–Friday, `09:00`–`17:00` before
continuing.

**STOP HERE**

If the backend does not restart or reports a syntax error, read the terminal message
and check the file against the backend manual's Solutions appendix.

---

## STEP 42 — The automated checks

**What are we doing?**

Running the three checks that prove the frontend is correct: types, lint, and a
production build.

**Why do we need it?**

The backend manual ended with `npm run build` for the same reason: the machine
catches what the eye misses. These three checks together prove the code is typed,
clean, and bundleable — before you spend time clicking through the browser.

In the `frontend` terminal, one at a time:

```powershell
npm run typecheck
```

**You should see** no output and the prompt returns. No output means no type errors —
the same silence you saw in STEP 18.

```powershell
npm run lint
```

**You should see**

```text
Found 0 warnings and 0 errors.
Finished in ...ms on ... files with ... rules using ... threads.
```

```powershell
npm run build
```

**You should see** the typecheck run first, then a Vite summary ending in
`✓ built in ...ms` and a `dist/` folder containing the production files:

```text
dist/index.html                 ...
dist/assets/index-....css       ...
dist/assets/index-....js        ...
```

What each check catches:

- `typecheck` — wrong props, impossible union-state access, mismatched API types.
- `lint` — hooks called conditionally, suspicious patterns, unused values.
- `build` — everything above, plus proof that Vite can bundle the whole app.

These checks do **not** replace browser testing: the code can compile while a button
opens the wrong dialog or a query is never invalidated. That is what STEP 43 is for.

**STOP HERE**

If `typecheck` or `lint` complains, read the message: it names the file and the
line. The difference between your file and the reference solution is usually the bug.

---

## STEP 43 — The full browser test

**What are we doing?**

Testing the finished app the way a user would, page by page, including the mobile
layout.

**Why do we need it?**

This is the final acceptance test — the frontend equivalent of the backend manual's
"Final self-check".

### Students page

1. Search by a full name and by a partial name; clear the search.
2. Add an active frontend student.
3. Edit all three fields and save; the table refreshes.
4. Reload the page; the edited values remain.
5. Set the student inactive; open the Attendance page and confirm they are not in
   the register.
6. Set them active again.
7. Open Delete and cancel; nothing is deleted.
8. Open Delete and confirm; the student disappears. Confirm their attendance
   records are gone too (they had some if you clocked them in).

### Attendance page

1. Use a row's **Clock in** button.
2. Use the toolbar **Clock in** and select another active student.
3. Clock the same student in twice; the server error is shown in the modal.
4. Clock a student out.
5. Edit both times of a record (correction).
6. Clear the clock-out time in correction and save; the student becomes
   "Currently in".
7. Click Remove, cancel, and verify the record remains.
8. Click Remove and confirm; the row returns to "Not clocked in".
9. Search by student name and by track.
10. Change the date and verify the register refetches (watch the Network tab).

### Settings

1. Uncheck every working day and submit; expect the error "Pick at least one
   working day."
2. Set closing time earlier than opening time; expect the error from STEP 41.
3. Save valid days and times.
4. Pick a non-working day in the register and confirm the notice explains that
   nobody can be clocked in, and that clock-in is refused.

### Responsive layout

1. Use the browser's developer tools to set the viewport below 760 pixels.
2. Confirm the desktop links disappear and the hamburger appears.
3. Open the mobile sheet and visit both pages.
4. Confirm the tables scroll horizontally (the `table-wrap` is scrollable).
5. Confirm every modal fits inside the viewport and can scroll vertically.

---

## Final project structure

When you are done, your `frontend` folder looks like this:

```text
frontend/
├── .gitignore
├── .oxlintrc.json
├── index.html
├── package.json
├── package-lock.json
├── tsconfig.json
├── vite.config.ts
├── public/
│   └── favicon.svg
└── src/
    ├── main.tsx
    ├── router.tsx
    ├── vite-env.d.ts
    ├── api/
    │   ├── client.ts
    │   └── types.ts
    ├── components/
    │   ├── AppLayout.tsx
    │   ├── ErrorBanner.tsx
    │   ├── Modal.tsx
    │   └── SearchIcon.tsx
    ├── features/
    │   ├── attendance/
    │   │   ├── AttendancePage.tsx
    │   │   └── SettingsModal.tsx
    │   └── students/
    │       └── StudentsPage.tsx
    ├── styles/
    │   ├── base.css
    │   └── index.css
    └── utils/
        └── dateTime.ts
```

Every file in this tree was created by you, step by step, and the reference solution
in the repo has the same layout.

## Final self-check

Before you call the frontend done, every one of these must be true:

- [ ] `npm run dev` prints the Vite ready message and the page opens at
      `http://localhost:5173`.
- [ ] The header shows "Student Attendance System" with Attendance and Students
      links.
- [ ] The Students page lists the students from the API and search works.
- [ ] You can add, edit, and delete a student, and the changes survive a reload.
- [ ] Deleting a student also removes their attendance records (cascade delete).
- [ ] The register shows each active student with status and daily total.
- [ ] Clock in works from a row and from the toolbar; a duplicate clock-in shows
      the `409` error.
- [ ] Clock out, correction, and confirmed removal all work.
- [ ] Clearing a record's clock-out makes the student "Currently in" again.
- [ ] Settings save working days and times, and a closing time before the opening
      time is refused.
- [ ] The mobile navigation works below 760 pixels.
- [ ] `npm run typecheck`, `npm run lint`, and `npm run build` all pass.
- [ ] No red errors appear in the backend terminal while testing.

## Troubleshooting

| Symptom | Cause | Fix |
| --- | --- | --- |
| `npm run dev` prints `EADDRINUSE :5173` | port 5173 already in use | close the other dev server, then run again |
| Page shows "Something went wrong" with a fetch error | backend not running | start `npm run dev` in `backend` |
| Requests to `/api/...` return `404` | Vite proxy missing, or backend route missing | STEP 19; check the backend routes |
| Students page is empty but the API has students | backend not running, or search stuck | check the Network tab status; clear the search box |
| Table shows old data after a change | query not invalidated | check `invalidateQueries` in the mutation's `onSuccess` |
| A dialog shows an old error before submitting | mutation error was not cleared | call that mutation's `reset()` when opening the dialog |
| `typecheck` says "is declared but its value is never read" | unused import or variable | delete it (`noUnusedLocals` is on) |
| Clock in says "already clocked in" unexpectedly | a record exists for that student/day | open the record's Edit and Remove it, or check another date |
| Settings saves but the register ignores it | `['attendance']` not invalidated | STEP 38 — both keys must be invalidated |
| The hamburger never appears | window wider than 760 px, or CSS missing | resize below 760 px; check `base.css`'s media query |
| `npm run lint` reports a rule violation | a lint rule is offended | read the message and fix the pattern, or compare with the reference |
| Nothing updates after saving a file | the dev server crashed | restart `npm run dev` |

---

*End of the frontend lab manual. The React frontend is complete and talks to the
backend you built in the backend manual. Together they form the whole ZTAD Student
Attendance System. The `javascript/` folder in the repository is an earlier
plain-JavaScript version of the same app — you do not need it; the React version you
just built replaces it.*



