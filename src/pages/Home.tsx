import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import type { Post } from "../types";

const LOCAL_POSTS_KEY = "miniblog_local_posts";
const API_URL = "https://jsonplaceholder.typicode.com/posts";

export const Home = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isSubscribed = true;

    const fetchPosts = async () => {
      setIsLoading(true);
      setErrorMessage(null);
      try {
        const response = await fetch(API_URL);
        if (!response.ok) {
          throw new Error(`Lỗi tải dữ liệu: ${response.status} ${response.statusText}`);
        }
        const apiPosts: Post[] = await response.json();

        const storedLocal = localStorage.getItem(LOCAL_POSTS_KEY);
        let localPosts: Post[] = [];
        if (storedLocal) {
          try {
            localPosts = JSON.parse(storedLocal);
          } catch {
            localPosts = [];
          }
        }

        if (isSubscribed) {
          setPosts([...localPosts, ...apiPosts]);
        }
      } catch (err) {
        if (isSubscribed) {
          setErrorMessage(err instanceof Error ? err.message : "Đã có lỗi không xác định xảy ra.");
        }
      } finally {
        if (isSubscribed) {
          setIsLoading(false);
        }
      }
    };

    fetchPosts();

    return () => {
      isSubscribed = false;
    };
  }, []);

  const filteredPosts = useMemo(() => {
    return posts.filter((post) =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase().trim())
    );
  }, [posts, searchTerm]);

  return (
    <div className="home-container">
      <div className="home-header">
        <h1>Danh sách bài viết</h1>
        <div className="search-bar">
          <input
            type="text"
            className="form-control"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm kiếm bài viết theo tiêu đề..."
          />
        </div>
      </div>

      {isLoading && (
        <div className="status-box loading-box">
          <div className="spinner"></div>
          <p>Đang tải danh sách bài viết...</p>
        </div>
      )}

      {errorMessage && (
        <div className="status-box error-box">
          <p className="alert alert-error">{errorMessage}</p>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => window.location.reload()}
          >
            Thử lại
          </button>
        </div>
      )}

      {!isLoading && !errorMessage && filteredPosts.length === 0 && (
        <div className="status-box empty-box">
          <p>Không tìm thấy bài viết nào phù hợp.</p>
        </div>
      )}

      {!isLoading && !errorMessage && filteredPosts.length > 0 && (
        <div className="posts-grid">
          {filteredPosts.map((post) => (
            <article key={post.id} className="post-card">
              <div className="post-card-content">
                {post.isLocal && <span className="badge-local">Bài viết của bạn</span>}
                <h2 className="post-card-title">{post.title}</h2>
                <p className="post-card-snippet">
                  {post.body.length > 120 ? `${post.body.substring(0, 120)}...` : post.body}
                </p>
              </div>
              <div className="post-card-footer">
                <Link to={`/posts/${post.id}`} className="btn-readmore">
                  Đọc tiếp &rarr;
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};