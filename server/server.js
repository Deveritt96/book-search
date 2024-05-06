const express = require('express');
const path = require('path');
const { typeDefs, resolvers } = require('./schemas'); // GraphQL schema - typeDefs and resolvers
const { ApolloServer } = require('apollo-server-express');
const { authMiddleware } = require('./utils/auth');
const routes = require('./routes');
const db = require('./config/connection');

const app = express();
const PORT = process.env.PORT || 3001;

async function startApolloServer() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: authMiddleware, // Assuming this is your authentication middleware function
  });

  await server.start();
  server.applyMiddleware({ app });
}

startApolloServer();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve static assets
const buildPath = path.join(__dirname, "../client/build");
app.use(express.static(buildPath));

// Define routes
app.use(routes);

// Serve index.html for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

db.once('open', () => {
  app.listen(PORT, () => console.log(`🌍 Now listening on localhost:${PORT}`));
});
