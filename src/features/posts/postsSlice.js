import {
  createAsyncThunk,
  createSelector,
  createSlice
} from '@reduxjs/toolkit';
import { redditAPI } from '../../data/reddit_api';

// Thunks
export const getPostsBySubreddit = createAsyncThunk(
  'posts/getPostsBySubreddit',
  async subreddit => {
    const posts = await redditAPI.getPostsBySubreddit(subreddit);
    return posts;
  }
);

// Slice
const initialState = {
  posts: [],
  error: false,
  isLoading: false,
  searchTerm: ''
};

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    }
  },
  extraReducers: builder => {
    builder
      .addCase(getPostsBySubreddit.pending, state => {
        state.isLoading = true;
        state.error = false;
      })
      .addCase(getPostsBySubreddit.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = false;
        state.posts = action.payload;
      })
      .addCase(getPostsBySubreddit.rejected, state => {
        state.isLoading = false;
        state.error = true;
      });
  }
});

export default postsSlice.reducer;

// Selectors
const selectSearchTerm = state => state.posts.searchTerm;
const selectPosts = state => state.posts.posts;

export const selectFilteredPosts = createSelector(
  [selectSearchTerm, selectPosts],
  (searchTerm, posts) => {
    if (searchTerm !== '') {
      return posts.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return posts;
  }
);
export const selectPostsSlice = state => state.posts;

// Action creators
export const { setSearchTerm } = postsSlice.actions;
