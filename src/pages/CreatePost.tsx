import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import type { Post } from "../types";

const LOCAL_POSTS_KEY = "miniblog_local_posts";

interface FormErrors {
  title?: string;
  body?: string;
}

export const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const validateForm = (): boolean => {
    const currentErrors: FormErrors = {};

    if (!title.trim()) {
      currentErrors.title = "Tiêu đề không được để trống.";
    } else if (title.trim().length < 5) {
      currentErrors.title = "Tiêu đề bài viết phải có ít nhất 5 ký tự.";
    }

    if (!body.trim()) {
      currentErrors.body = "Nội dung bài viết không được để trống.";
    } else if (body.trim().length < 15) {
      currentErrors.body = "Nội dung bài viết phải có ít nhất 15 ký tự.";
    }

    setErrors(currentErrors);
    return Object.keys(currentErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    const newPost: Post = {
      id: Date.now(),
      title: title.trim(),
      body: body.trim(),
      userId: 1,
      isLocal: true,
    };

    try {
      const stored = localStorage.getItem(LOCAL_POSTS_KEY);
      let localList: Post[] = [];
      if (stored) {
        try {
          localList = JSON.parse(stored);
        } catch {
          localList = [];
        }
      }

      const updatedList = [newPost, ...localList];
      localStorage.setItem(LOCAL_POSTS_KEY, JSON.stringify(updatedList));

      navigate("/");
    } catch {
      alert("Không thể lưu bài viết vào bộ nhớ trình duyệt.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="create-post-card">
      <div className="create-post-header">
        <h2>Tạo bài viết mới</h2>
        <Link to="/" className="btn-back">
          &larr; Hủy & Quay lại
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="form-layout">
        <div className="form-group">
          <label htmlFor="post-title">
            Tiêu đề bài viết <span className="text-danger">*</span>
          </label>
          <input
            id="post-title"
            type="text"
            className={`form-control ${errors.title ? "is-invalid" : ""}`}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Nhập tiêu đề (tối thiểu 5 ký tự)..."
          />
          {errors.title && <span className="error-text">{errors.title}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="post-body">
            Nội dung chi tiết <span className="text-danger">*</span>
          </label>
          <textarea
            id="post-body"
            rows={7}
            className={`form-control ${errors.body ? "is-invalid" : ""}`}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Nhập nội dung bài viết (tối thiểu 15 ký tự)..."
          />
          {errors.body && <span className="error-text">{errors.body}</span>}
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
            {isSubmitting ? "Đang lưu bài..." : "Xuất bản bài viết"}
          </button>
        </div>
      </form>
    </div>
  );
};