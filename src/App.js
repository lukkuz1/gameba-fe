import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Authentication/Login';
import Register from './pages/Authentication/Register';
import { CategoriesPage } from './pages/Category/AllCategories';
import Category from './pages/Category/[categoryId]/Category';
import Game from './pages/Category/[categoryId]/Game/[gameId]/Game';
import Comment from './pages/Category/[categoryId]/Game/[gameId]/Comment/[commentId]/Comment';
import { AuthProvider } from './hooks/authentification/authcontext';

function App() {
  return (
    <AuthProvider>
    <Router>
      <Routes>
        {/* Main Pages */}
        <Route path="/" element={<CategoriesPage />} />
        <Route path="/categories/:categoryId" element={<Category />} />
        <Route path="/categories/:categoryId/games/:gameId" element={<Game />} />
        <Route path="/categories/:categoryId/games/:gameId/comments/:commentId" element={<Comment />} />
        {/* Authentication Pages */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
    </AuthProvider>
  );
}

export default App;
