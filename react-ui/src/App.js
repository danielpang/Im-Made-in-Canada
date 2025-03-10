// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ChakraProvider, Box, Container, Flex } from '@chakra-ui/react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import AddItemPage from './pages/AddItemPage';
import ItemDetailPage from './pages/ItemDetailPage';
import EditItemPage from './pages/EditItemPage';
import SearchResultsPage from './pages/SearchResultsPage';
import './App.css';
import AboutPage from './pages/AboutPage';

function App() {
  return (
    <ChakraProvider>
      <Router>
        <Flex direction="column" minH="100vh" bg="gray.50">
          <Navbar />
          <Container maxW="container.xl" py={8} flex="1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/add-item" element={<AddItemPage />} />
              <Route path="/item/:id" element={<ItemDetailPage />} />
              <Route path="/edit-item/:id" element={<EditItemPage />} />
              <Route path="/search" element={<SearchResultsPage />} />
            </Routes>
          </Container>
          <Footer />
        </Flex>
      </Router>
    </ChakraProvider>
  );
}

export default App;