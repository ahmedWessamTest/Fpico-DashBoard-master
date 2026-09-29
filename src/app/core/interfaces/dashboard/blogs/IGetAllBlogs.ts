export interface IGetAllBlogs {
  Blogs: Blogs;
}

export interface Blogs {
  current_page: number;
  data: BlogsData[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  next_page_url: null;
  path: string;
  per_page: number;
  prev_page_url: null;
  to: number;
  total: number;
}

export interface BlogsData {
  id: number;
  en_blog_title: string;
  ar_blog_title: string;
  en_blog_text: string;
  ar_blog_text: string;
  main_image: string;
  en_slug: string;
  ar_slug: string;
  blog_date: string;
  en_meta_title: string;
  ar_meta_title: string;
  en_meta_text: string;
  ar_meta_text: string;
  active_status: number;
  created_at: string;
  updated_at: string;
  ar_cta_first_title?: string;
  ar_cta_second_title?: string;
  en_cta_first_title?: string;
  en_cta_second_title?: string;
  cta_first_title?: string;
  cta_second_title?: string;
}
