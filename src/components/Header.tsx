import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getNavLinkClass = ({ isActive }: { isActive: boolean }) =>
    isActive ? "nav-link active" : "nav-link";

  return (
    <header className="site-header">
      <div className="header-container">
        <NavLink to="/" className="site-brand">
          MiniBlog
        </NavLink>
        <nav className="site-nav">
          <NavLink to="/" end className={getNavLinkClass}>
            Trang chủ
          </NavLink>
          {user && (
            <NavLink to="/create" className={getNavLinkClass}>
              Tạo bài viết
            </NavLink>
          )}
          {user ? (
            <div className="user-section">
              <span className="user-greeting">Xin chào, {user.username}</span>
              <button type="button" className="btn-logout" onClick={handleLogout}>
                Đăng xuất
              </button>
            </div>
          ) : (
            <NavLink to="/login" className={getNavLinkClass}>
              Đăng nhập
            </NavLink>
          )}
        </nav>
      </div>
    </header>
  );
};