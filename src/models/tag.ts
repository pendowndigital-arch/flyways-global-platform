export interface Tag {
  id: string;
  name: string;
  priority: boolean;
  image: string;
}

export interface ApiCategory {
  tid: string;
  name: string;
  priority: string | boolean;
  image: string;
}
