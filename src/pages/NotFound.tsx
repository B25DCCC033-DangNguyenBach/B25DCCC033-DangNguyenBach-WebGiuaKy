import { Link } from "react-router-dom";

export const NotFound = () => {
  return (
    <div className="not-found-card">
      <h1 className="error-code">404</h1>
      <h2>Trang không tìm thấy</h2>
      <p>Đường dẫn bạn vừa truy cập không tồn tại hoặc đã được gỡ bỏ.</p>
      <Link to="/" className="btn btn-primary">
        &larr; Trở về Trang chủ
      </Link>
    </div>
  );
};