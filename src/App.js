import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Login from './pages/Authentication/Login';
import Register from './pages/Authentication/Register';
import { CategoriesPage } from './pages/Category/AllCategories';
import Category from './pages/Category/[categoryId]/Category';
import Game from './pages/Category/[categoryId]/Game/[gameId]/Game';
import Comment from './pages/Category/[categoryId]/Game/[gameId]/Comment/[commentId]/Comment';

function App() {
  return (
    <Router>
      <Routes>
        {/* Main Categories Page */}
        <Route path="/" element={<CategoriesPage />} />
        <Route path="/categories/:categoryId" element={<Category />} />
        <Route path="/categories/:categoryId/games/:gameId" element={<Game />} />
        <Route path="/categories/:categoryId/games/:gameId/comments/:commentId" element={<Comment />} />
        {/* Authentication Pages */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;
