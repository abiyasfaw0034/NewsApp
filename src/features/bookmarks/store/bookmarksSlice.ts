import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface BookmarksState {
  bookmarks: number[];
}

const initialState: BookmarksState = {
  bookmarks: [],
};

const bookmarksSlice = createSlice({
  name: 'bookmarks',
  initialState,
  reducers: {
    toggleBookmark(state, action: PayloadAction<number>) {
      const id = action.payload;
      if (state.bookmarks.includes(id)) {
        state.bookmarks = state.bookmarks.filter(b => b !== id);
      } else {
        state.bookmarks.push(id);
      }
    },
  },
});

export const { toggleBookmark } = bookmarksSlice.actions;
export default bookmarksSlice.reducer;
