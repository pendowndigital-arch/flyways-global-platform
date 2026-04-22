import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { fetchTags } from '../services/tagsService';
import { Tag } from '../models/tag';

interface CategoriesContextValue {
  categories: Tag[];
  loading: boolean;
}

const CategoriesContext = createContext<CategoriesContextValue>({ categories: [], loading: true });

export function CategoriesProvider({ children }: { children: ReactNode }) {
  const [categories, setCategories] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTags().then((tags) => {
      setCategories(tags);
      setLoading(false);
    });
  }, []);

  return (
    <CategoriesContext.Provider value={{ categories, loading }}>
      {children}
    </CategoriesContext.Provider>
  );
}

export function useCategories() {
  return useContext(CategoriesContext);
}
