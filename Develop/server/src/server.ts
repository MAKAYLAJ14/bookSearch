import express from 'express';
import path from 'node:path';
import db from './config/connection.js';
import routes from './routes/index.js';
import { ApolloServer } from '@apollo/server';
import { typeDefs, resolvers } from './Schemas';
import { expressMiddleware } from '@apollo/server/express4';

const app = express();
const PORT = process.env.PORT || 3001;

// Create an instance of ApolloServer
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// Middleware for parsing application/json
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve client/build as static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

// Use routes
app.use(routes);

// Start the Apollo Server
const startServer = async () => {
  await server.start(); // Start the Apollo Server

  // Use Apollo Server as middleware for the Express app
  app.use('/graphql', expressMiddleware(server)); // Use createHandler for Apollo Server 4.x

  // Connect to the database and start the server
  db.once('open', () => {
    app.listen(PORT, () => {
      console.log(`🌍 Now listening on localhost:${PORT}`);
      console.log(`🚀 GraphQL Server ready at http://localhost:${PORT}/graphql`); // Update the path
    });
  });
};

// Call the startServer function
startServer();