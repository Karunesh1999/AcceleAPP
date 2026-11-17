export interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  originalPrice?: number;
  category: string;
  tag: string;
  image: string;
  rating: number;
  reviewsCount: number;
  inStock: boolean;
  stockCount: number;
  voltage: string;
  fieldOfView: string;
  environmentalRating: string;
  description: string;
  highlights: string[];
  specs: Record<string, string>;
  isFlagship?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Category {
  id: string;
  title: string;
  count: string;
  color: string;
  icon: string;
  description: string;
}

export type RadarMode = 'clear' | 'left' | 'right';
export type CameraPosition = 'front' | 'rear';
