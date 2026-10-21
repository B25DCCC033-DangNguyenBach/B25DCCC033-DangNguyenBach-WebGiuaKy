export interface Post {
  id: number;
  title: string;
  body: string;
  userId?: number;
  isLocal?: boolean;
}

export interface Comment {
  id: number;
  postId: number;
  name: string;
  email: string;
  body: string;
}

export interface User {
  username: string;
  role: string;
}

export interface AuthContextType {
  user: User | null;
  login: (username: string, pass: string) => boolean;
  logout: () => void;
}
