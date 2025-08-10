# SQL Basics Guide for Site State Management with Supabase

This guide will introduce you to the fundamental concepts of SQL (Structured Query Language) and demonstrate how to use them to manage the state of your website, specifically leveraging Supabase as your backend. No prior SQL knowledge is required.

## Table of Contents
1.  What is SQL?
2.  Core SQL Concepts
    *   Databases, Tables, Rows, and Columns
    *   Data Types
3.  Basic SQL Commands
    *   `CREATE TABLE`: Defining Your Site's Structure
    *   `INSERT INTO`: Adding New Site State Data
    *   `SELECT`: Retrieving Site State Data
    *   `UPDATE`: Modifying Existing Site State Data
    *   `DELETE FROM`: Removing Site State Data
4.  Filtering and Ordering Data
    *   `WHERE` Clause: Filtering Data
    *   `ORDER BY` Clause: Sorting Data
5.  Introduction to Relationships (JOINs)
6.  Integrating SQL Concepts with Supabase
    *   Supabase Client and SQL Operations
    *   Real-time Capabilities

---

## 1. What is SQL?

SQL stands for **Structured Query Language**. It's a standard language used to communicate with and manage relational databases. Think of it as the language you use to ask your database questions, tell it to store new information, update existing information, or remove old information.

For a website, "state" refers to the data that changes and needs to be persisted. This could be user profiles, blog posts, product listings, comments, or even configuration settings. SQL helps you manage this persistent data.

## 2. Core SQL Concepts

### Databases, Tables, Rows, and Columns

Imagine a database as a filing cabinet.

*   **Database**: The entire filing cabinet itself, holding all your organized information.
*   **Table**: A specific drawer in the cabinet, labeled for a particular type of information (e.g., "Users", "Products", "Blog Posts"). Each table stores data about a single entity.
*   **Column (or Field)**: The categories of information within a drawer (e.g., "Name", "Email", "Price", "Content"). Each column has a specific data type (text, number, date, etc.).
*   **Row (or Record)**: A single file within a drawer, representing one complete item or entry (e.g., one specific user, one product, one blog post).

**Example: A `users` table**

| id (INT) | name (TEXT) | email (TEXT)         | created_at (TIMESTAMP) |
| :------- | :---------- | :------------------- | :--------------------- |
| 1        | Alice       | alice@example.com    | 2023-01-15 10:00:00    |
| 2        | Bob         | bob@example.com      | 2023-01-15 10:05:00    |
| 3        | Charlie     | charlie@example.com  | 2023-01-16 11:30:00    |

### Data Types

Each column in a table must have a specific data type, which defines the kind of data it can store. Common SQL data types include:

*   **`INT` / `INTEGER`**: Whole numbers (e.g., 1, 100, -5).
*   **`TEXT` / `VARCHAR`**: Strings of characters (e.g., "Hello World", "user@example.com"). `VARCHAR` often has a specified maximum length.
*   **`BOOLEAN`**: True or false values.
*   **`DATE`**: Dates (e.g., '2023-01-15').
*   **`TIME`**: Times (e.g., '10:30:00').
*   **`TIMESTAMP`**: Date and time (e.g., '2023-01-15 10:30:00'). Often used for `created_at` or `updated_at` fields.
*   **`FLOAT` / `DOUBLE` / `NUMERIC`**: Numbers with decimal points.
*   **`UUID`**: Universally Unique Identifier, often used for primary keys (e.g., 'a1b2c3d4-e5f6-7890-1234-567890abcdef'). Supabase often uses UUIDs for primary keys by default.
*   **`JSONB`**: A binary JSON data type, useful for storing unstructured or semi-structured data within a column (e.g., a list of tags, user preferences).

## 3. Basic SQL Commands (CRUD Operations)

The most common operations you'll perform on a database are **C**reate, **R**ead, **U**pdate, and **D**elete (CRUD).

### `CREATE TABLE`: Defining Your Site's Structure

This command is used to define the structure of a new table in your database.

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(), -- Unique identifier for each user
    name TEXT NOT NULL,                            -- User's name, cannot be empty
    email TEXT UNIQUE NOT NULL,                    -- User's email, must be unique and not empty
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() -- Timestamp of creation, defaults to current time
);

CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    price NUMERIC(10, 2) NOT NULL, -- Price with 10 total digits, 2 after decimal
    stock_quantity INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```
*   `PRIMARY KEY`: A column (or set of columns) that uniquely identifies each row in the table.
*   `DEFAULT gen_random_uuid()`: Supabase often uses this to automatically generate a unique ID for new rows.
*   `NOT NULL`: Ensures that a column cannot have an empty value.
*   `UNIQUE`: Ensures that all values in a column are different.
*   `DEFAULT NOW()`: Sets a default value for the column to the current timestamp.

### `INSERT INTO`: Adding New Site State Data

This command adds new rows (records) into a table.

```sql
-- Inserting a new user
INSERT INTO users (name, email)
VALUES ('John Doe', 'john.doe@example.com');

-- Inserting a new product
INSERT INTO products (name, description, price, stock_quantity)
VALUES ('Laptop Pro', 'High-performance laptop', 1200.00, 50);
```
You specify the table name, the columns you're providing values for, and then the `VALUES` in the same order.

### `SELECT`: Retrieving Site State Data

This is the most common command, used to fetch data from one or more tables.

```sql
-- Select all columns and all rows from the users table
SELECT * FROM users;

-- Select specific columns from the products table
SELECT name, price FROM products;

-- Select products with a stock quantity greater than 10
SELECT name, stock_quantity FROM products WHERE stock_quantity > 10;
```
*   `*`: Wildcard to select all columns.
*   `FROM`: Specifies the table to retrieve data from.

### `UPDATE`: Modifying Existing Site State Data

This command changes existing data in one or more rows of a table.

```sql
-- Update John Doe's email
UPDATE users
SET email = 'john.doe.new@example.com'
WHERE name = 'John Doe'; -- The WHERE clause is crucial! Without it, ALL emails would be updated.

-- Increase the price of 'Laptop Pro' by 5%
UPDATE products
SET price = price * 1.05
WHERE name = 'Laptop Pro';
```
*   `SET`: Specifies the column(s) to update and their new values.
*   `WHERE`: **Extremely important!** This clause specifies which rows to update. If omitted, the `UPDATE` command will affect *all* rows in the table.

### `DELETE FROM`: Removing Site State Data

This command removes one or more rows from a table.

```sql
-- Delete the user named 'John Doe'
DELETE FROM users
WHERE name = 'John Doe'; -- The WHERE clause is crucial! Without it, ALL users would be deleted.

-- Delete products with stock quantity of 0
DELETE FROM products
WHERE stock_quantity = 0;
```
*   `WHERE`: **Extremely important!** This clause specifies which rows to delete. If omitted, the `DELETE` command will remove *all* rows from the table.

## 4. Filtering and Ordering Data

### `WHERE` Clause: Filtering Data

The `WHERE` clause is used with `SELECT`, `UPDATE`, and `DELETE` to specify conditions that rows must meet to be affected by the command.

```sql
-- Select users created after a specific date
SELECT * FROM users
WHERE created_at > '2023-01-15 12:00:00';

-- Select products priced between 500 and 1000
SELECT * FROM products
WHERE price BETWEEN 500 AND 1000;

-- Select products with 'Laptop' in their name (case-insensitive)
SELECT * FROM products
WHERE name ILIKE '%Laptop%'; -- ILIKE is for case-insensitive pattern matching in PostgreSQL (used by Supabase)

-- Combine conditions
SELECT * FROM users
WHERE created_at > '2023-01-01' AND name = 'Alice';
```
Common operators: `=`, `!=` (or `<>`), `>`, `<`, `>=`, `<=`, `LIKE` (case-sensitive pattern match), `ILIKE` (case-insensitive pattern match), `IN`, `BETWEEN`, `AND`, `OR`, `NOT`.

### `ORDER BY` Clause: Sorting Data

This clause is used with `SELECT` to sort the result set.

```sql
-- Select all users, ordered by name alphabetically (ascending)
SELECT * FROM users
ORDER BY name ASC;

-- Select products, ordered by price from highest to lowest (descending)
SELECT * FROM products
ORDER BY price DESC;

-- Order by multiple columns (e.g., by category then by price)
-- SELECT * FROM products ORDER BY category ASC, price DESC;
```
*   `ASC`: Ascending order (default).
*   `DESC`: Descending order.

## 5. Introduction to Relationships (JOINs)

Relational databases are powerful because you can define relationships between tables. For example, a `treks` table might have many `waypoints`, and each `waypoint` belongs to one `trek`.

This is typically done using **Foreign Keys**. A foreign key in one table points to the primary key in another table, establishing a link.

```sql
-- Example: A 'waypoints' table linked to a 'treks' table
CREATE TABLE waypoints (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trek_id UUID REFERENCES treks(id), -- Foreign Key linking to the 'treks' table
    name TEXT NOT NULL,
    coordinates POINT, -- Example for geographical coordinates
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```
*   `REFERENCES treks(id)`: This creates a foreign key constraint, ensuring that `trek_id` in the `waypoints` table must correspond to an existing `id` in the `treks` table.

When you want to retrieve data from multiple related tables, you use `JOIN` clauses.

```sql
-- Select all waypoints along with the name of the trek they belong to
SELECT
    w.name AS waypoint_name,
    w.coordinates,
    t.name AS trek_name,
    t.difficulty
FROM
    waypoints w
JOIN
    treks t ON w.trek_id = t.id;
```
*   `JOIN`: Combines rows from two or more tables based on a related column between them.
*   `ON`: Specifies the condition for joining the tables (usually matching primary and foreign keys).
*   `w` and `t`: Aliases (short names) for the tables to make the query more readable.

## 6. Integrating SQL Concepts with Supabase

Supabase provides a powerful JavaScript client library that abstracts away much of the raw SQL, allowing you to interact with your database using familiar JavaScript syntax. However, understanding the underlying SQL helps you use the Supabase client effectively.

Refer to the `SUPABASE_GUIDE.md` for detailed setup instructions (creating project, getting keys, environment variables).

### Supabase Client and SQL Operations

Once your Supabase client is set up (e.g., in `src/lib/supabase.ts`), you can perform CRUD operations:

**1. `SELECT` (Read Data)**

```typescript
// Fetch all users
const { data: users, error } = await supabase
  .from('users')
  .select('*'); // Equivalent to SQL: SELECT * FROM users;

// Fetch a specific product by ID
const { data: product, error: productError } = await supabase
  .from('products')
  .select('*')
  .eq('id', 'your-product-uuid') // Equivalent to SQL: WHERE id = 'your-product-uuid'
  .single(); // Use .single() if you expect only one row

// Fetch products with stock > 10, ordered by price descending
const { data: highStockProducts, error: hsError } = await supabase
  .from('products')
  .select('name, price, stock_quantity')
  .gt('stock_quantity', 10) // Equivalent to SQL: WHERE stock_quantity > 10
  .order('price', { ascending: false }); // Equivalent to SQL: ORDER BY price DESC

// Fetch waypoints and their associated trek details (using JOIN-like behavior)
// Supabase handles relationships automatically if defined in your schema
const { data: waypointsWithTrek, error: wpError } = await supabase
  .from('waypoints')
  .select('*, treks(name, difficulty)'); // Selects waypoint data and specific trek data
```
*   `.from('table_name')`: Specifies the table.
*   `.select('columns')`: Specifies columns to retrieve. `*` for all.
*   `.eq('column', 'value')`: `WHERE column = 'value'`
*   `.gt('column', value)`: `WHERE column > value` (also `lt`, `gte`, `lte`, `neq`, `in`, `is`, `like`, `ilike`)
*   `.order('column', { ascending: boolean })`: `ORDER BY column ASC/DESC`
*   `.single()`: For fetching a single record.

**2. `INSERT` (Create Data)**

```typescript
// Insert a new user
const { data: newUser, error: insertError } = await supabase
  .from('users')
  .insert([
    { name: 'Jane Doe', email: 'jane.doe@example.com' }
  ])
  .select(); // .select() returns the inserted data
```
*   `.insert([{}])`: Takes an array of objects, where each object represents a row to insert.

**3. `UPDATE` (Modify Data)**

```typescript
// Update a user's email
const { data: updatedUser, error: updateError } = await supabase
  .from('users')
  .update({ email: 'jane.new.email@example.com' })
  .eq('name', 'Jane Doe') // Crucial WHERE clause
  .select();
```
*   `.update({})`: Takes an object with the columns and their new values.
*   `.eq('column', 'value')`: The `WHERE` clause to specify which rows to update.

**4. `DELETE` (Remove Data)**

```typescript
// Delete a product by ID
const { error: deleteError } = await supabase
  .from('products')
  .delete()
  .eq('id', 'product-to-delete-uuid'); // Crucial WHERE clause
```
*   `.delete()`: Initiates the delete operation.
*   `.eq('column', 'value')`: The `WHERE` clause to specify which rows to delete.

### Real-time Capabilities

One of Supabase's powerful features is its real-time engine. You can subscribe to changes in your database tables and react to them instantly in your frontend. This is great for live updates, notifications, or collaborative features.

```typescript
// Subscribe to new inserts in the 'products' table
const productsSubscription = supabase
  .channel('products_changes') // A unique channel name
  .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'products' }, (payload) => {
    console.log('New product added:', payload.new);
    // Update your UI with the new product
  })
  .subscribe();

// Don't forget to unsubscribe when the component unmounts to prevent memory leaks
// productsSubscription.unsubscribe();
```
This allows your site's state to automatically update when data changes in the database, without needing to manually refresh or re-fetch.

By understanding these SQL basics and how they map to Supabase's client library, you'll be well-equipped to manage your site's data effectively.
