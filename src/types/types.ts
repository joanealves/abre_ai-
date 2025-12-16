
export type ProductCategory = 
  | "rolee" 
  | "cestas" 
  | "cafe" 
  | "namorados" 
  | "fit" 
  | "vegan" 
  | "churrasco"
  | "bebidas"
  | "chocolates"
  | "petiscos";

export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  category: ProductCategory;
  image?: string;
  description?: string;
}

export interface FavoriteItem {
  id: number;
  name: string;
  price: number;
  category: ProductCategory;
  description: string;
}