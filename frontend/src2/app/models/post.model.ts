export interface Post {
  id: number;
  authorName: string;
  authorAvatar: string;
  timeAgo: string;
  imageUrl?: string;
  content: string;
  likes: number;
  comments: number;
}
