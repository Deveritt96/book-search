const express = require('express');
const path = require('path');
const { typeDefs, resolvers } = require('./schemas'); // GraphQL schema - typeDefs and resolvers
const { ApolloServer } = require('apollo-server-express')
const { authMiddleware } = require('./utils/auth')
const routes = require('./routes'); 

// Database connection configuration
const db = require('./config/connection');
// const routes = require('./routes');

// Initialize Express.js server
const app = express();
const PORT = process.env.PORT || 3001;

// Create an instance of ApolloServer
async function startApolloServer() {
  const server = new ApolloServer({
  typeDefs, // GraphQL schema to use
  resolvers, // Resolver functions to handle GraphQL queries
  context: authMiddleware, // Middleware function to authenticate users
});

// Start the server
await server.start(); 

// Apply Apollo middleware to Express.js server

server.applyMiddleware({ app });

}

startApolloServer();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

db.once('open', () => {
  app.listen(PORT, () => console.log(`🌍 Now listening on localhost:${PORT}`));
});

const _dirname = path.dirname("");
const buildPath = path.join(_dirname, "../client/build");
app.use(express.static(buildPath));
// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/build")));
}


// Define app routes fpr requess not handled by other routes

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'))
})

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}


app.use(routes);