import { useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../../app/store';
import { fetchArticles, setSearchQuery, setSort } from '../store/articlesSlice';

/**
 * Hook for basic article data and actions
 */
export function useArticles() {
  const dispatch = useDispatch<AppDispatch>();
  const { articles, loading, error, sort, searchQuery } = useSelector(
    (state: RootState) => state.articles,
  );

  const handleFetchArticles = useCallback(() => {
    dispatch(fetchArticles());
  }, [dispatch]);

  const handleUpdateSearch = useCallback((query: string) => {
    dispatch(setSearchQuery(query));
  }, [dispatch]);

  const handleUpdateSort = useCallback((value: 'score' | 'time') => {
    dispatch(setSort(value));
  }, [dispatch]);

  return {
    rawArticles: articles,
    loading,
    error,
    sort,
    searchQuery,
    fetchArticles: handleFetchArticles,
    updateSearch: handleUpdateSearch,
    updateSort: handleUpdateSort,
  };
}

/**
 * Hook for processing (filtering/sorting) articles
 */
export function useProcessedArticles(articles: any[], searchQuery: string, sort: 'score' | 'time') {
  return useMemo(() => {
    let filtered = articles;
    if (searchQuery) {
      filtered = articles.filter(
        a =>
          a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          a.by.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    return [...filtered].sort((a, b) => {
      if (sort === 'score') return b.score - a.score;
      return b.time - a.time;
    });
  }, [articles, searchQuery, sort]);
}
