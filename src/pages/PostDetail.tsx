import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import type { Post, Comment } from "../types";

const LOCAL_POSTS_KEY = "miniblog_local_posts";
const BASE_API_URL = "https://jsonplaceholder.typicode.com";

export const PostDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    let isSubscribed = true;
    const postIdNum = parseInt(id, 10);

    const loadData = async () => {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const storedLocal = localStorage.getItem(LOCAL_POSTS_KEY);
        let localFound: Post | undefined;
        if (storedLocal) {
          try {
            const list: Post[] = JSON.parse(storedLocal);
            localFound = list.find((item) => item.id === postIdNum);
          } catch {
            localFound = undefined;
          }
        }

        if (localFound) {
          if (isSubscribed) {
            setPost(localFound);
            setComments([]);
          }
        } else {
          const [postRes, commentsRes] = await Promise.all([
            fetch(`${BASE_API_URL}/posts/${id}`),
            fetch(`${BASE_API_URL}/posts/${id}/comments`),
          ]);

          if (!postRes.ok) {
            throw new Error(`Không tìm thấy bài viết (Mã lỗi: ${postRes.status})`);
          }

          const postData: Post = await postRes.json();
          const commentsData: Comment[] = commentsRes.ok ? await commentsRes.json() : [];

          if (isSubscribed) {
            setPost(postData);
            setComments(commentsData);
          }
        }
      } catch (err) {
        if (isSubscribed) {
          setErrorMessage(err instanceof Error ? err.message : "Đã có lỗi xảy ra khi tải bài viết.");
        }
      } finally {
        if (isSubscribed) {
          setIsLoading(false);
        }
      }
    };

    loadData();

    return () => {
      isSubscribed = false;
    };
  }, [id]);

  if (isLoading) {
    return (
      <div className="status-box loading-box">
        <div className="spinner"></div>
        <p>Đang tải nội dung chi tiết...</p>
      </div>
    );
  }

  if (errorMessage || !post) {
    return (
      <div className="status-box error-box">
        <p className="alert alert-error">{errorMessage || "Bài viết không tồn tại."}</p>
        <Link to="/" className="btn btn-secondary">
          &larr; Quay về trang chủ
        </Link>
      </div>
    );
  }

  return (
    <div className="post-detail-container">
      <div className="action-top">
        <Link to="/" className="btn-back">
          &larr; Về trang danh sách
        </Link>
      </div>

      <article className="post-full">
        {post.isLocal && <span className="badge-local">Bài viết cục bộ</span>}
        <h1 className="post-full-title">{post.title}</h1>
        <div className="post-full-body">
          <p>{post.body}</p>
        </div>
      </article>

      <section className="comments-section">
        <h3>Bình luận ({comments.length})</h3>
        {post.isLocal && comments.length === 0 && (
          <p className="no-comments-hint">Bài viết lưu cục bộ chưa có bình luận nào.</p>
        )}
        {!post.isLocal && comments.length === 0 && (
          <p className="no-comments-hint">Chưa có bình luận nào cho bài viết này.</p>
        )}
        {comments.length > 0 && (
          <div className="comments-list">
            {comments.map((comment) => (
              <div key={comment.id} className="comment-item">
                <div className="comment-meta">
                  <strong className="comment-author">{comment.name}</strong>
                  <span className="comment-email">({comment.email})</span>
                </div>
                <p className="comment-content">{comment.body}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};