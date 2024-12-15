import { createClient } from "@/lib/supabase/server";

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  image: string;
  category_id: string;
  featured: boolean;
  demo_url?: string;
  created_at: string;
};

export type Category = {
  id: string;
  name: string;
  description: string;
  image_url: string;
  slug: string;
  image: string;
};

export async function getFeaturedProducts(): Promise<Product[]> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('featured', true)
    .limit(4);
    
  if (error) throw error;
  return data || [];
}

export async function getCategories(): Promise<Category[]> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('categories')
    .select('*');
    
  if (error) throw error;
  return data || [];
}

export async function getProductsByCategory(categoryId: string): Promise<Product[]> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('category_id', categoryId);
    
  if (error) throw error;
  return data || [];
}

export async function getProduct(productId: string): Promise<Product | null> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', productId)
    .single();
    
  if (error) throw error;
  return data;
} 