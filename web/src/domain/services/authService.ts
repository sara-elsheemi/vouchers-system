export interface User {
  user_id: number;
  parent_user_id: number | null;
  allow_follow: number;
  email: string;
  first_name: string;
  free_ads: string;
  premium_ads: string;
  image: string | null;
  is_email_verified: number;
  number_of_followers: number;
  number_of_following: number;
  phone: string;
  language: string;
  member_since: string;
  region_id: number;
  is_fresh: number;
  is_block: number;
  user_type?: {
    user_type_name: string;
    user_type_id: number;
    target_cat_id: number | null;
    allow_post_listing: boolean;
    not_allowed_categories: number[];
    permissions: string[];
  };
  has_listings: boolean;
}

export interface TokenValidationResponse {
  data: {
    user: User;
  };
  message: string | null;
}

export interface AuthError {
  success: boolean;
  error: string;
}

export class AuthService {
  private baseUrl: string;

  constructor() {
    // Use backend API port 3001
    this.baseUrl = 'http://localhost:3001';
  }

  async validateToken(token: string): Promise<User | null> {
    try {
      const response = await fetch(`${this.baseUrl}/api/v1/users/auth/validate`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        console.error('Token validation failed:', response.status, response.statusText);
        return null;
      }

      const data: TokenValidationResponse = await response.json();
      return data.data.user;
    } catch (error) {
      console.error('Token validation error:', error);
      return null;
    }
  }

  clearAuthData(): void {
    sessionStorage.removeItem('auth_token');
    sessionStorage.removeItem('user_data');
  }

  saveUserData(user: User): void {
    sessionStorage.setItem('user_data', JSON.stringify(user));
  }

  getCachedUserData(): User | null {
    const userData = sessionStorage.getItem('user_data');
    if (userData) {
      try {
        return JSON.parse(userData);
      } catch (error) {
        console.error('Error parsing cached user data:', error);
        return null;
      }
    }
    return null;
  }
}

export const authService = new AuthService(); 