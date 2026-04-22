import React, { useLayoutEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Linking, Image, TouchableOpacity, Share } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { addBookmark, removeBookmark } from '../../bookmarks/store/bookmarksSlice';
import { RootState, AppDispatch } from '../../../app/store';
import { formatRelativeTime, getDomain, getFaviconUrl } from '../../../utils/helpers';

export default function ArticleDetailScreen({ route, navigation }: any) {
  const { article } = route.params;
  const dispatch = useDispatch<AppDispatch>();
  const bookmarks = useSelector((state: RootState) => state.bookmarks.bookmarks);

  const isBookmarked = bookmarks.some(b => b.id === article.id);

  const openUrl = () => {
    if (article.url) {
      Linking.openURL(article.url).catch(err => console.error("Couldn't load page", err));
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `${article.title}\n${article.url}`,
        url: article.url,
        title: article.title,
      });
    } catch (error: any) {
      console.error(error.message);
    }
  };

  const handleBookmark = () => {
    if (isBookmarked) {
      dispatch(removeBookmark(article.id));
    } else {
      dispatch(addBookmark(article));
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={styles.headerButtons}>
          <TouchableOpacity onPress={handleBookmark} style={styles.headerButton}>
            <Text style={{ fontSize: 24 }}>{isBookmarked ? '🔖' : '📑'}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleShare} style={styles.headerButton}>
            <Text style={{ fontSize: 24 }}>📤</Text>
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation, isBookmarked, article]);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.meta}>
          {getFaviconUrl(article.url) && (
            <Image source={{ uri: getFaviconUrl(article.url)! }} style={styles.favicon} />
          )}
          <Text style={styles.domain}>{getDomain(article.url)}</Text>
          <Text style={styles.dot}>•</Text>
          <Text style={styles.time}>{formatRelativeTime(article.time)}</Text>
        </View>

        <Text style={styles.title}>{article.title}</Text>
        <Text style={styles.author}>by {article.by}</Text>
        
        <View style={styles.stats}>
          <Text style={styles.score}>Score: {article.score}</Text>
        </View>
        
        <View style={styles.buttonContainer}>
          {article.url ? (
            <TouchableOpacity style={styles.primaryButton} onPress={openUrl}>
              <Text style={styles.primaryButtonText}>Open in Browser</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 20,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  favicon: {
    width: 20,
    height: 20,
    borderRadius: 4,
    marginRight: 8,
  },
  domain: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
  },
  dot: {
    marginHorizontal: 5,
    color: '#8E8E93',
  },
  time: {
    fontSize: 14,
    color: '#8E8E93',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 10,
    lineHeight: 32,
  },
  author: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  stats: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    marginBottom: 20,
  },
  score: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF9500',
  },
  buttonContainer: {
    marginTop: 10,
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  headerButton: {
    marginLeft: 15,
  },
  primaryButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
