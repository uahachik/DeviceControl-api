# plugins
`Fastify’s approach to plugins is underpinned by one of its technical principles: If something could be a plugin, it likely should be.`
`Plugins operate within their scope thereby preventing conflicts within the application.`
# fastify.register()
By default, register creates a new scope, this means that if you make some changes to the Fastify instance (via decorate), this change will not be reflected by the current context ancestors, but only by its descendants. This feature allows us to achieve plugin encapsulation and inheritance, in this way you create a directed acyclic graph (DAG) and you will not have issues caused by cross dependencies.

To pass the Fastify instance into your routers and handlers, you can leverage the fact that the Fastify instance is available throughout your application context once it's registered.
1. Register the router modules with the main Fastify instance.
2. Use the Fastify instance within your router and handler functions by accessing this context.

Fastify's register Method
  1. Purpose: The register method in Fastify is used to add plugins and encapsulate routes. It helps in organizing the application by grouping related functionality.
  2. Scope and Encapsulation: Each registered plugin can have its own scope, meaning it can define its own routes, hooks, and decorators. This helps in keeping the code modular and separated.
  3. Configuration: You can pass configuration options to plugins when registering them, allowing for flexible and reusable modules.

# encapsulation
https://fastify.dev/docs/latest/Reference/Encapsulation/#encapsulation

# decorators
Decorators allow developers to attach information to core objects, like adding the user to an incoming request. Decorators allow for the attachment of properties to the request, without incurring the huge cost of optimizations and megamorphisms.
In essence, decorators ensure every route has its own hidden class for Request and Reply, allowing V8 to optimize your code to the fullest extent.

The fastify.decorate method is used to add new properties or methods to the Fastify instance, request, or reply objects. In the context of the Prisma plugin, fastify.decorate is used to add the Prisma client instance to the Fastify instance. This makes the Prisma client accessible throughout your Fastify application, allowing you to perform database operations easily within your routes and other plugins.

Benefits of Using fastify.decorate
1. Centralized Database Access: By adding the Prisma client to the Fastify instance, you ensure that all parts of your application can access the database client in a consistent manner.
2. Cleaner Code: Instead of importing and instantiating the Prisma client in multiple files, you register it once and use it anywhere via fastify.prisma.
3. Lifecycle Management: Using fastify.decorate allows you to hook into Fastify's lifecycle events, such as ensuring the Prisma client is properly disconnected when the server shuts down.

# hooks
`Fastify is based on a lifecycle/hook model where hooks are per-route (or per-encapsulation context), guaranteeing that only what is needed is executed.`
Hooks are special functions that allow developers to modify the behaviours of their applications at various points in the request/response lifecycle. They also let the application listen to specific events. Common use cases for hooks include authentication and authorization, error handling, data preprocessing and post-processing before sending it back to the user.

# validation
Fastify uses AJV (Another JSON Schema Validator) for validating both request bodies and responses. AJV is very efficient and integrates well with Fastify's schema-based validation.Starting from version 3.0, Fastify has built-in support for response validation.

# session vs token
The concepts of session and token are fundamental to web application authentication and state management.

Session-Based Authentication
Sessions are a traditional way of managing user authentication and state on the server side.

   1. Storage:
   Sessions store user information on the server, typically in memory, a database, or a dedicated session store like Redis.
   Each user session is identified by a unique session ID, which is stored on the client side as a cookie.

   2. Flow:
   When a user logs in, the server creates a session and stores user information (e.g., user ID).
   The server sends a session ID to the client as a cookie.
   For each subsequent request, the client sends the session ID cookie to the server.
   The server uses the session ID to retrieve the stored user information and validate the user's identity.

   3. Advantages:
   Stateful: Easy to implement with stateful session management.
   Security: The actual user data is kept on the server, reducing the risk of client-side tampering.

   4. Disadvantages:
   Scalability: Requires server-side storage, which can become a bottleneck as the number of users increases.
   Load Balancing: Requires sticky sessions or session replication across servers.

Token-Based Authentication
Tokens are a modern way of managing user authentication, particularly useful for distributed and stateless applications.

   1. Storage:
   Tokens (usually JWT - JSON Web Tokens) store user information in a compact, self-contained format.
   Tokens are typically stored on the client side, in localStorage or as cookies.

   2. Flow:
   When a user logs in, the server generates a token (e.g., JWT) containing user information and signs it.
   The server sends the token to the client.
   For each subsequent request, the client sends the token (usually in the Authorization header).
   The server validates the token's signature and extracts the user information.

   3. Advantages:
   Stateless: The server does not need to store user sessions, making it highly scalable.
   Decentralized: Suitable for distributed systems and microservices.
   Interoperability: Tokens can be used across different domains and services.

   4. Disadvantages:
   Security: Tokens are stored on the client side, making them vulnerable to attacks if not handled properly (e.g., XSS attacks).
  Revocation: Difficult to revoke tokens before they expire, requiring additional mechanisms like token blacklisting.

Comparison Summary
  State Management:
    Session: Stateful (user state is stored on the server).
    Token: Stateless (user state is encapsulated in the token itself).
  Scalability:
    Session: Can be challenging to scale due to server-side storage requirements.
    Token: Easier to scale as no server-side storage is needed.
  Security:
    Session: More secure for storing sensitive information as data resides on the server.
    Token: Requires careful handling to ensure security on the client side.
  Use Cases:
    Session: Suitable for traditional web applications with a single server or small clusters.
    Token: Ideal for modern web applications, APIs, and microservices that need to scale horizontally.

Example Use Cases
  Session-Based Authentication Example:
    A user logs in to a traditional web application.
    The server creates a session, stores user data on the server, and sends a session ID to the client as a cookie.
    The client includes the session ID in subsequent requests to maintain the logged-in state.
  Token-Based Authentication Example:
    A user logs in to a single-page application (SPA) or mobile app.
    The server generates a JWT containing user data, signs it, and sends it to the client.
    The client stores the token (e.g., in localStorage) and includes it in the Authorization header of subsequent requests.
    The server verifies the token and extracts user data to authorize the request.


# what next
  - tools license cost
  - production planning
  - team and positions
  - database schema
  - scaffold and contracts
  - layers and components

### start application in dev mode
`docker-compose up`
OR if changes have been made to the Dockerfile or application code and 
you need to rebuild the Docker image before starting the containers
`docker-compose up --build`

### validate Prisma schema before migration
`npx prisma format`

### migrate dev database
`docker-compose exec api npx prisma migrate dev --name <migrationName>`
OR for all migrations
`docker-compose exec api npx prisma migrate dev`

### reset a database in a development environment
reset the database and apply all migrations from scratch
`docker-compose exec api npx prisma migrate reset`