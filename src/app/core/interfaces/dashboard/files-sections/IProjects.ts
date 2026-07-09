export interface IProjects {
  rows: IProject[];
}

export interface IProject {
  id: number;
  en_service_title: string;
  ar_service_title: string;
  en_service_text: string;
  ar_service_text: string;
  en_slug: null;
  ar_slug: null;
  en_meta_title: string;
  ar_meta_title: string;
  en_meta_text: string;
  ar_meta_text: string;
  service_type: string;
  main_image: string;
  home_status: number;
  active_status: number;
  created_at: string;
  updated_at: string;
}
