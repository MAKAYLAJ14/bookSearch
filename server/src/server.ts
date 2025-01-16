import express from 'express';
import path from 'node:path';
import db from './config/connection.js';
import routes from './routes/index.js';
import { ApolloServer } from '@apollo/server';
import { typeDefs, resolvers } from './Schemas/index.js';
import { expressMiddleware } from '@apollo/server/express4';
import { authenticateToken } from './services/auth.js'
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Create an instance of ApolloServer
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// Use routes
app.use(routes);

// Start the Apollo Server
const startServer = async () => {
  await server.start(); // Start the Apollo Server

  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  // Use Apollo Server as middleware for the Express app
  app.use('/graphql', expressMiddleware(server as any,
    {context: authenticateToken as any}

  )); 
  
  //if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../../client/dist')));
  //}

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