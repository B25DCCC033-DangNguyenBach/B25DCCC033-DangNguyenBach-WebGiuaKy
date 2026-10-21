import { Routes, Route } from "react-router-dom";
import { Header } from "./components/Header";
import { Home } from "./pages/Home";
import { PostDetail } from "./pages/PostDetail";
import { CreatePost } from "./pages/CreatePost";
import { Login } from "./pages/Login";
import { NotFound } from "./pages/NotFound";
import { ProtectedRoute } from "./routes/ProtectedRoute";

export const App = () => {
  return (
    <div className="app-root">
      <Header />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/posts/:id" element={<PostDetail />} />
          <Route path="/login" element={<Login />} />
          
          <Route element={<ProtectedRoute />}>
            <Route path="/create" element={<CreatePost />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <footer className="site-footer">
        <p>&copy; 2026 MiniBlog Project - Bài kiểm tra giữa kỳ Lập trình Web PTIT</p>
      </footer>
    </div>
  );
};

export default App;