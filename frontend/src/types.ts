export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  STORE_OWNER = 'store_owner',
}

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  address: string;
  role: UserRole;
  stores?: Store[];
  ratings?: Rating[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Store {
  id: string;
  name: string;
  email: string;
  address: string;
  ownerId: string;
  owner?: User;
  ratings?: Rating[];
  avgRating?: number;
  ratingsCount?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Rating {
  id: string;
  userId: string;
  storeId: string;
  rating: number;
  user?: User;
  store?: Store;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  statusCode: number;
}