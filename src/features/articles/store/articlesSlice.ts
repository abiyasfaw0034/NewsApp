import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Article } from '../types';
import { articlesApi } from '../api/articlesApi';

type SortType = 'score' | 'time';

interface ArticlesState {
  articles: Article[];
  loading: boolean;
  error: string | null;
  sort: SortType;
  searchQuery: string;
}

const initialState: ArticlesState = {
  articles: [],
  loading: false,
  error: null,
  sort: 'score',
  searchQuery: '',
};

export const fetchArticles = createAsyncThunk(
  'articles/fetchArticles',
  async (_, { rejectWithValue }) => {
    try {
      const articles = await articlesApi.getTopArticles(30);
      return articles;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch articles');
    }
  }
);

const articlesSlice = createSlice({
  name: 'articles',
  initialState,
  reducers: {
    setSort(state, action: PayloadAction<SortType>) {
      state.sort = action.payload;
    },
    setSearchQuery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchArticles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchArticles.fulfilled, (state, action) => {
        state.loading = false;
        state.articles = action.payload;
      })
      .addCase(fetchArticles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setSort, setSearchQuery } = articlesSlice.actions;
export default articlesSlice.reducer;
