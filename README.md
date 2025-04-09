# Things to remember while building application on next.js

1. First check for the existence of database connection if it is then use it else create new connection

// ✅ Mongoose vs. Zod (Key Differences)
// - Mongoose: Defines schemas & validates data before storing in MongoDB.
// - Zod: Validates data at runtime (e.g., API requests) before sending to the database.
// - Use Zod for API input validation & Mongoose for database schema enforcement.


The callbacks object in NextAuthOptions allows you to customize authentication behavior by modifying session, JWT, and redirect logic. It contains functions that execute at specific points in the authentication flow.

jwt Callback – Runs when a JWT is created or updated

session Callback – Controls what data is sent to the client

redirect Callback – Defines where users are redirected after login/logout

signIn Callback – Runs before a user signs in

authorized Callback – Used in middleware to protect routes

# Key Features of Lucid React:

- Comprehensive Component Set: Provides a wide range of components such as buttons, forms, modals, and tables, which can be easily integrated into your projects.
- You can know more about the icons in the node_modules/lucide-react/dist and the icons provided are SVG's