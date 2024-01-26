import { create } from 'zustand';

interface PageStore {
  page: string;
  setPage: (page: string) => void;
}

const usePageStore = create<PageStore>((set) => ({
  page: '',
  setPage: (p) => set(() => ({ page: p })),
}));

export default usePageStore;