import React from 'react';
import { View, Text, Button, StyleSheet, ScrollView, Linking, Image } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { toggleBookmark } from '../../bookmarks/store/bookmarksSlice';
import { RootState } from '../../../app/store';
import { formatRelativeTime, getDomain, getFaviconUrl } from '../../../utils/helpers';

export default function ArticleDetailScreen({ route }: any) {
  const { article } = route.params;
  const dispatch = useDispatch();
  const bookmarks = useSelector((state: RootState) => state.bookmarks.bookmarks);

  const isBookmarked = bookmarks.includes(article.id);
  const domain = getDomain(article.url);
  const faviconUrl = getFaviconUrl(article.url);

  const openUrl = () => {
    if (article.url) {
      Linking.openURL(article.url).catch(err => console.error("Couldn't load page", err));
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.meta}>
          {faviconUrl && (
            <Image source={{ uri: faviconUrl }} style={styles.favicon} />
          )}
          <Text style={styles.domain}>{domain}</Text>
          <Text style={styles.dot}>•</Text>
          <Text style={styles.time}>{formatRelativeTime(article.time)}</Text>
        </View>

        <Text style={styles.title}>{article.title}</Text>
        <Text style={styles.author}>by {article.by}</Text>
        
        <View style={styles.stats}>
          <Text style={styles.score}>Score: {article.score}</Text>
        </View>
        
        <View style={styles.buttonContainer}>
          <Button
            title={isBookmarked ? 'Remove Bookmark' : 'Add Bookmark'}
            onPress={() => dispatch(toggleBookmark(article.id))}
            color={isBookmarked ? '#ff4444' : '#007AFF'}
          />
          <View style={styles.mt10}>
            {article.url ? (
              <Button title="Open in Browser" onPress={openUrl} color="#5856D6" />
            ) : null}
          </View>
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
  mt10: {
    marginTop: 10,
  },
});
