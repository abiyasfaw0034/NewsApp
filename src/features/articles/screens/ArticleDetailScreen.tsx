import React from 'react';
import { View, Text, Button, StyleSheet, ScrollView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { toggleBookmark } from '../../bookmarks/store/bookmarksSlice';
import { RootState } from '../../../app/store';

export default function ArticleDetailScreen({ route }: any) {
  const { article } = route.params;
  const dispatch = useDispatch();
  const bookmarks = useSelector((state: RootState) => state.bookmarks.bookmarks);

  const isBookmarked = bookmarks.includes(article.id);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>{article.title}</Text>
        <Text style={styles.info}>By: {article.by}</Text>
        <Text style={styles.info}>Score: {article.score}</Text>
        <Text style={styles.info}>Time: {new Date(article.time * 1000).toLocaleString()}</Text>
        
        <View style={styles.buttonContainer}>
          <Button
            title={isBookmarked ? 'Remove Bookmark' : 'Add Bookmark'}
            onPress={() => dispatch(toggleBookmark(article.id))}
            color={isBookmarked ? '#ff4444' : '#007AFF'}
          />
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  info: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
  buttonContainer: {
    marginTop: 20,
  },
});
