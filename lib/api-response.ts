// Backend API Response Interfaces

export interface TripResponse {
  id: string;
  slug: string;
  name: string;
  startDate: string;
  endDate: string;
  peopleCount: number;
  tripType: string;
  destinationCount: number;
  coverImage: string | null;
  totalBudget: number;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewResponse {
  id: string;
  destinationId: string;
  destinationName?: string;
  destination?: {
    id: string;
    name: string;
  };
  rating: number;
  comment?: string;
  content?: string;
  helpful?: number;
  helpfulCount?: number;
  likes?: number;
  createdAt?: string;
  date?: string;
}

export interface DestinationResponse {
  id: string;
  name: string;
  category: string;
  rating: number;
  totalReviews: number;
  location: string;
  price: number;
  image: string;
  images: string[];
  facilities: string[];
  description: string;
}

export interface ArticleResponse {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  author: {
    name: string;
    avatar: string;
  };
  publishDate: string;
  readingTime: string;
  image: string;
}

// User Profile Response
export interface UserProfileResponse {
  id: string;
  email: string;
  first_name?: string;
  firstName?: string;
  last_name?: string;
  lastName?: string;
  avatar_url?: string;
  avatar?: string;
  role?: string;
  joinDate?: string;
  created_at?: string;
  profileCompletion?: number;
  stats?: {
    tripPlans?: number;
    visitedDestinations?: number;
    reviewsWritten?: number;
  };
}
