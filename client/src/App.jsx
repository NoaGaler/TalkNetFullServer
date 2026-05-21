import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext, UserProvider } from './context/UserContext';

import Login from './authentication/LogIn';
import Register from './authentication/Register';
import CompleteProfile from './authentication/CompleteProfile';
import AuthenticationApp from './authentication/AuthenticationApp';

import Home from './pages/home/Home';
import WelcomeHero from './pages/home/WelcomeHero';
import TodosPage from './pages/todos/TodosPage';
import PostsPage from './pages/posts/PostsPage';
import AlbumsPage from './pages/albums/AlbumsPage';
import PhotoGallery from './pages/albums/PhotoGallery';
import UserInfo from './pages/info/UserInfo';

function AppRoute() {

  const { currentUser, isNewUser, loading } = useContext(UserContext);

  if (loading) {
    return <div className="loadingScreen">Loading...</div>;
  }

  const isProfileIncomplete = currentUser && !currentUser.email;

  return (
    <Routes>
      <Route path="/" element={
        !currentUser ? (
          <AuthenticationApp />
        ) : isProfileIncomplete ? (
          <Navigate to={`/${currentUser.username}/completeProfile`} replace />
        ) : (
          <Navigate to={`/${currentUser.username}/home`} replace />
        )
      }>
        <Route index element={<Navigate to="/login" />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
      </Route>

      <Route
        path="/:username/completeProfile"
        element={currentUser ? <CompleteProfile /> : <Navigate to="/login" />}
      />

      <Route
        path="/:username/home"
        element={
          !currentUser ? (
            <Navigate to="/login" />
          ) : isProfileIncomplete ? (
            <Navigate to={`/${currentUser.username}/completeProfile`} replace />
          ) : (
            <Home />
          )
        }
      >
        <Route index element={<WelcomeHero />} />
        <Route path="todos" element={<TodosPage />} />
        <Route path="posts" element={<PostsPage />} />
        <Route path="albums" element={<AlbumsPage />} />
        <Route path="albums/:albumId" element={<PhotoGallery />} />
        <Route path="info" element={<UserInfo />} />
      </Route>

      <Route path="*" element={<h1>404 - Page Not Found</h1>} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <UserProvider>
        <AppRoute />
      </UserProvider>
    </BrowserRouter>
  );
}

export default App;



