export interface WooCommerceCustomer {
  id: number;
  date_created: string;
  date_created_gmt: string;
  date_modified: string;
  date_modified_gmt: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  username: string;
  billing: {
    first_name: string;
    last_name: string;
    company: string;
    address_1: string;
    address_2: string;
    city: string;
    postcode: string;
    country: string;
    state: string;
    email: string;
    phone: string;
  };
  shipping: {
    first_name: string;
    last_name: string;
    company: string;
    address_1: string;
    address_2: string;
    city: string;
    postcode: string;
    country: string;
    state: string;
  };
  is_paying_customer: boolean;
  avatar_url: string;
  meta_data: {
    id: number;
    key: string;
    value: string;
  }[];
}

export interface CustomerRegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  billing?: {
    phone?: string;
    address?: string;
    city?: string;
    postcode?: string;
  };
}

export interface CustomerLoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  token?: string;
  refreshToken?: string;
  customer?: WooCommerceCustomer;
  error?: string;
}

export interface ReviewSubmission {
  productId: number;
  rating: number;
  review: string;
  reviewer: string;
  reviewerEmail: string;
  images?: File[];
}
