# Todo-App 📝

A **modern full-stack task management project** built with **React**, **TypeScript**, **Vite** on the front-end and **Java + Spring Boot** on the back-end, using **MySQL** as the database. The project features continuous integration via **GitHub Actions**.

---

## 🚀 Technologies

- **Front-end:** React, TypeScript, Vite
- **Back-end:** Java, Spring Boot
- **Database:** MySQL
- **Testing:** Vitest, Mockito
- **CI/CD:** GitHub Actions

---

## 📦 Features

- Create new tasks with title and description.
- Edit existing tasks.
- Activate/deactivate tasks.
- Delete tasks.
- Form validation for required fields.
- Reusable modal for task creation/editing.
- Complete tests for components and pages.
- Data persistence using MySQL.
- GitHub Actions integration.

---

## ⚡ Scripts (Front-end)

Navigate to the front-end folder:

```bash
cd ./todo-web
```

Install dependencies:

```bash
npm install
```

Run development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Run tests:

```bash
vitest run
```

---

## ⚡ Scripts (Back-end)

Navigate to the back-end folder:

```bash
cd ./todo-server
```

Run development server:

```bash
mvn spring-boot:run
```

Build and run tests:

```bash
./mvnw clean test
```

---

## 🗂 Folder Structure

```
TODO-APP/
├─ .github/         # GitHub Actions configurations
├─ node_modules/    # Front-end dependencies
├─ todo-server/     # Back-end Java + Spring Boot
├─ todo-web/        # Front-end React + TypeScript
├─ .gitignore
├─ README.md
```

---

## Author
- Made with dedication by Otavio Lima.