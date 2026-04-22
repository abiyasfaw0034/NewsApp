import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Article } from '../../articles/types';

const BOOKMARKS_KEY = '@bookmarks_full';

interface BookmarksState {
  bookmarks: Article[];
  isLoaded: boolean;
}

const initialState: BookmarksState = {
  bookmarks: [],
  isLoaded: false,
};

// Load all bookmarked articles from storage
export const loadBookmarks = createAsyncThunk(
  'bookmarks/load',
  async () => {
    try {
      const saved = await AsyncStorage.getItem(BOOKMARKS_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  }
);

// Add a full article to bookmarks
export const addBookmark = createAsyncThunk(
  'bookmarks/add',
  async (article: Article, { getState }) => {
    const state = getState() as { bookmarks: BookmarksState };
    const updated = [...state.bookmarks.bookmarks, article];
    await AsyncStorage.setItem(BOOKMARKS_KEY, JSON.stringify(updated));
    return updated;
  }
);

// Remove an article by ID
export const removeBookmark = createAsyncThunk(
  'bookmarks/remove',
  async (id: number, { getState }) => {
    const state = getState() as { bookmarks: BookmarksState };
    const updated = state.bookmarks.bookmarks.filter(b => b.id !== id);
    await AsyncStorage.setItem(BOOKMARKS_KEY, JSON.stringify(updated));
    return updated;
  }
);

const bookmarksSlice = createSlice({
  name: 'bookmarks',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadBookmarks.fulfilled, (state, action) => {
        state.bookmarks = action.payload;
        state.isLoaded = true;
      })
      .addCase(addBookmark.fulfilled, (state, action) => {
        state.bookmarks = action.payload;
      })
      .addCase(removeBookmark.fulfilled, (state, action) => {
        state.bookmarks = action.payload;
      });
  },
});

export default bookmarksSlice.reducer;
