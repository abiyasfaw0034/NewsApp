import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Article } from '../types';
import { mockArticles } from '../mockData';

type SortType = 'score' | 'time';

interface ArticlesState {
  articles: Article[];
  loading: boolean;
  error: string | null;
  sort: SortType;
}

const initialState: ArticlesState = {
  articles: mockArticles,
  loading: false,
  error: null,
  sort: 'score',
};

const articlesSlice = createSlice({
  name: 'articles',
  initialState,
  reducers: {
    setSort(state, action: PayloadAction<SortType>) {
      state.sort = action.payload;
    },
  },
});

export const { setSort } = articlesSlice.actions;
export default articlesSlice.reducer;
