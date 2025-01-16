import './App.css';
import { Outlet } from 'react-router-dom';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import Navbar from './components/Navbar';

// Create an instance of Apollo Client
const client = new ApolloClient({
  uri: '/graphql', // Adjust this URI based on your server setup
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}> {/* Wrap your application with ApolloProvider */}
      <>
        <Navbar />
        <Outlet />
      </>
    </ApolloProvider>
  );
}

export default App;