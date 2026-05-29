# Last Updated 29/5/2026 9:40 PM
(29/5/2026 9:40 PM) Fixed trailing commas causing "Docker exec failed, trying alternative method" error.
(29/5/2026 5:00 PM) Added an important note to section 1.4.1

# Fix to Docker issues
1. run "docker compose -f database/compose.yaml down -v" to delete the entire docker image. If it's conflicting with the old InvoiceLab assignment db. It's not permanently gone as we can just run the SQL statement to bring everything back.

2. Run either npm run docker:db:start or npm run db:reset

# ⛏️ CraftLess Development Guide

### 🗄️ How to access Adminer (Database UI):
* **URL:** http://localhost:8080
* **System:** PostgreSQL
* **Server:** `pgdatabase`
* **Username:** `root`
* **Password:** `root`
* **Database:** `craftless_db`

---

## Step 1: Database

**1.1** Go to `database/init/01_schema.sql` AND `database/sql/01_schema.sql`
* **1.1.1** Add simple form tables.
* **1.1.2** Add line item form tables.

**1.2** Go to `database/sql/003_seed.sql`
* **1.2.1** Populate simple form tables using `INSERT INTO … VALUES …`
* **1.2.2** Populate line item form tables using `INSERT INTO … VALUES …`
* **1.2.3** Create the `SELECT setval` command for your corresponding table to sync the IDs.

**1.3** Go to `database/sql/sql_run.sql`
* **1.3.1** Add your corresponding table to the drop table list at the top.
* **1.3.2** Create your simple tables (without the `if exists` argument).
* **1.3.3** Create your line item tables (without the `if exists` argument).
* **1.3.4** *(Optional)* Add indexes for certain variables and frequently searched columns.
* **1.3.5** Populate simple form tables (without the `ON CONFLICT DO NOTHING` part).
* **1.3.6** Populate line item form tables (without the `ON CONFLICT DO NOTHING` part).
* **1.3.7** Create the `SELECT setval` command for your corresponding table (Same as 1.2.3).

**1.4** Go to `database/setup_db.js`
* **1.4.1** In the `getTableCounts` function, add a `SELECT COUNT(*)` command to the list.
* (IMPORTANT NOTE) I forgot to mention it, but make sure to update the length of counts.length to be the same as the current number of tables (usually +2 after your changes)
* **1.4.2** In the `getTableCounts` function, append your corresponding table name to the return list in `camelCase`.
* **1.4.3** In the `getSeedDecision` function, add a check to see if the count is 0 (Use `camelCase`).
* **1.4.4** In the `logCounts` function, add your corresponding table to the logging, following the syntax.

**1.5** Go to `scripts/docker-db-check.js`
* **1.5.1** In the last `for loop` of the script, append your corresponding table name to the list.

**1.6** Apply your changes
* **1.6.1** Run `npm run db:reset` in your terminal to wipe and cleanly rebuild the database with your new tables and seed data.

**1.7** Open Adminer and verify:
* **1.7.1** Your simple table exists.
* **1.7.2** Your line item table exists.
* **1.7.3** Compare them to the Supabase version; it should look the same.

---

## Step 2: CRUD API

**2.1** Create a new file in `server/src/services/` called `{TABLE NAME PLURAL}.service.js` *(DO NOT MAKE ONE FOR LINE ITEM)*
* **2.1.1** Make sure the table name part ends with an **s**. (e.g., `transfer.service.js` ❌ ➔ `transfers.service.js` ✅)
* **2.1.2** Rename preexisting `service.js` files (like `salesPersons.service.js`) to your own and work it out from there.

**2.2** Create a new file in `server/src/controllers/` called `{TABLE NAME PLURAL}.controller.js` *(DO NOT MAKE ONE FOR LINE ITEM)*
* **2.2.1** Make sure the table name part ends with an **s**. (e.g., `transfer.controller.js` ❌ ➔ `transfers.controller.js` ✅)
* **2.2.2** Rename preexisting `controller.js` files to your own and work it out from there.

**2.3** Create a new file in `server/src/routes/` called `{TABLE NAME PLURAL}.routes.js` *(DO NOT MAKE ONE FOR LINE ITEM)*
* **2.3.1** Make sure the table name part ends with an **s**. (e.g., `transfer.routes.js` ❌ ➔ `transfers.routes.js` ✅)
* **2.3.2** Rename preexisting `routes.js` files to your own and work it out from there.

**2.4** Go to `server/src/app.js`
* **2.4.1** Append your route imports near the top of the file.
* **2.4.2** Append your `app.use()` route near the bottom of the file.

**2.5** Test your API 
*(Use the REST Client VS Code extension (`test.http`) for POST, PUT, and DELETE. GET can be viewed in a browser).*
* **2.5.1** Test GET (ALL)
* **2.5.2** Test GET (Specific ID)
* **2.5.3** Test POST
* **2.5.4** Test PUT
* **2.5.5** Test DELETE
* **2.5.6** You should see a bunch of `200` or `201` success responses.
* **2.5.7** Don't panic if you do GET (ALL) and don't see your newest entry right away—it might only show the top 10 IDs due to pagination. Verify in Adminer.

---

## Step 3: Frontend Client

**3.1** Create a new file in `client/src/api/` called `{TABLE NAME PLURAL}.api.js` *(DO NOT MAKE ONE FOR LINE ITEM)*
* **3.1.1** Make sure the table name part ends with an **s**. (e.g., `transfer.api.js` ❌ ➔ `transfers.api.js` ✅)
* **3.1.2** Rename preexisting `api.js` files to your own and work it out from there.

**3.2** Create a new folder called `{TABLE NAME PLURAL}` and 2 files called `{TABLE NAME}List.jsx` and `{TABLE NAME}Page.jsx` in `client/src/pages/`
* **3.2.1** Make sure the folder is `{TABLE NAME}` ending with an **s**.
* **3.2.2** Make sure the 2 `.jsx` files are in **PascalCase**. (e.g., `playerList.jsx` ❌ ➔ `PlayerList.jsx` ✅).
* **3.2.3** Rename preexisting `...List.jsx` and `...Page.jsx` files (the `salesPersons` ones are the easiest to modify) to your own and work it out from there.

**3.3** Go back to `server/src/services/reports.service.js` and add your SQL report queries.
* **3.3.1** Check the Supabase SQL section—your reports might already be there from when we did Project 1!

**3.4** Go to `server/src/controllers/reports.controller.js` and add your report controller (copy and rename an existing one).

**3.5** Go to `server/src/routes/reports.routes.js` and add your report endpoint.

**3.6** Go to `client/src/api/reports.api.js` and add your report fetch function.

**3.7** Go to `client/src/pages/reports/Reports.jsx` and map out your report's columns.

**3.8** Go to `client/src/pages/reports/filters/ReportFilters.jsx` and add your report's dropdowns/date filters.

**3.9** Go to `client/src/main.jsx` (The Router)

* **3.9.1** Import the 2 pages you created near the top of the file.
* **3.9.2** Add your page link to the sidebar in the `Sidebar` function, somewhere inside `<nav className="sidebar-nav">`.
* **3.9.3** Add your frontend routes near the bottom of the code inside `ReactDOM.createRoot...` under the `<Routes>` section.

---
shoo juniors, no free points here.
