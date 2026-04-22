import axios from 'axios';
import { Article } from '../types';

const BASE_URL = 'https://hacker-news.firebaseio.com/v0';

export const articlesApi = {
  getTopStoryIds: async (): Promise<number[]> => {
    const response = await axios.get<number[]>(`${BASE_URL}/topstories.json`);
    return response.data;
  },

  getArticleDetails: async (id: number): Promise<Article> => {
    const response = await axios.get(`${BASE_URL}/item/${id}.json`);
    const data = response.data;
    
    // Mapping HN API response to our Article interface
    return {
      id: data.id,
      title: data.title || 'No Title',
      by: data.by || 'Unknown',
      score: data.score || 0,
      time: data.time || 0,
      url: data.url || '',
      type: data.type || '',
    };
  },

  getTopArticles: async (limit: number = 20): Promise<Article[]> => {
    const ids = await articlesApi.getTopStoryIds();
    const limitedIds = ids.slice(0, 50); // Fetch more than 20 to ensure we have enough after filtering
    
    const articlePromises = limitedIds.map(id => articlesApi.getArticleDetails(id));
    const allArticles = await Promise.all(articlePromises);
    
    // Filtering logic as per assignment requirements:
    // 1. Must be a 'story'
    // 2. Must have a valid URL
    const filteredArticles = allArticles.filter(
      a => a.type === 'story' && a.url
    );
    
    return filteredArticles.slice(0, limit);
  }
};
