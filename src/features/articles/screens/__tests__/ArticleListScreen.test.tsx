import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import ArticleListScreen from '../ArticleListScreen';
import { NavigationContainer } from '@react-navigation/native';

jest.mock('../../api/articlesApi', () => ({
  articlesApi: {
    getTopArticles: jest.fn(),
  },
}));

const mockStore = configureStore([]);

describe('ArticleListScreen', () => {
  let store: any;
  const mockArticles = [
    { id: 1, title: 'Test Article 1', by: 'author1', score: 100, time: 1625097600, url: 'https://test.com' },
    { id: 2, title: 'Test Article 2', by: 'author2', score: 200, time: 1625097601, url: 'https://test2.com' },
  ];

  beforeEach(() => {
    store = mockStore({
      articles: {
        articles: mockArticles,
        loading: false,
        error: null,
        searchQuery: '',
        sort: 'score',
      },
    });
  });

  it('renders the list of articles correctly', () => {
    render(
      <Provider store={store}>
        <NavigationContainer>
          <ArticleListScreen />
        </NavigationContainer>
      </Provider>
    );

    expect(screen.getByText('Test Article 1')).toBeTruthy();
    expect(screen.getByText('Test Article 2')).toBeTruthy();
    expect(screen.getByText('by author1')).toBeTruthy();
  });

  it('filters articles based on search query', () => {
    store = mockStore({
      articles: {
        articles: mockArticles,
        loading: false,
        error: null,
        searchQuery: 'Test Article 1',
        sort: 'score',
      },
    });

    render(
      <Provider store={store}>
        <NavigationContainer>
          <ArticleListScreen />
        </NavigationContainer>
      </Provider>
    );

    expect(screen.getByText('Test Article 1')).toBeTruthy();
    expect(screen.queryByText('Test Article 2')).toBeNull();
  });

  it('shows empty state when no results found', () => {
    store = mockStore({
      articles: {
        articles: mockArticles,
        loading: false,
        error: null,
        searchQuery: 'Nonexistent',
        sort: 'score',
      },
    });

    render(
      <Provider store={store}>
        <NavigationContainer>
          <ArticleListScreen />
        </NavigationContainer>
      </Provider>
    );

    expect(screen.getByText(/No results for "Nonexistent"/i)).toBeTruthy();
  });
});
