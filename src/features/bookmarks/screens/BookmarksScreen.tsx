import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../../app/store';
import { removeBookmark } from '../store/bookmarksSlice';
import { Swipeable } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { getDomain, getFaviconUrl, formatRelativeTime } from '../../../utils/helpers';

const BookmarkItem = ({ item, onRemove, onPress }: any) => {
  const renderRightActions = () => (
    <TouchableOpacity style={styles.deleteAction} onPress={() => onRemove(item.id)}>
      <Text style={styles.deleteText}>Remove</Text>
    </TouchableOpacity>
  );

  return (
    <Swipeable renderRightActions={renderRightActions}>
      <TouchableOpacity 
        style={styles.item}
        onPress={onPress}
      >
        <View style={styles.itemHeader}>
          {getFaviconUrl(item.url) && (
            <Image source={{ uri: getFaviconUrl(item.url)! }} style={styles.favicon} />
          )}
          <Text style={styles.domain}>{getDomain(item.url)}</Text>
          <Text style={styles.dot}>•</Text>
          <Text style={styles.time}>{formatRelativeTime(item.time)}</Text>
        </View>
        <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
      </TouchableOpacity>
    </Swipeable>
  );
};

export default function BookmarksScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation<any>();
  const { bookmarks } = useSelector((state: RootState) => state.bookmarks);

  const handleRemove = (id: number) => {
    dispatch(removeBookmark(id));
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={bookmarks}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No bookmarks yet</Text>
          </View>
        }
        renderItem={({ item }) => (
          <BookmarkItem 
            item={item} 
            onRemove={handleRemove}
            onPress={() => navigation.navigate('Home', { screen: 'Detail', params: { article: item } })}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
  item: {
    padding: 16,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  favicon: {
    width: 16,
    height: 16,
    borderRadius: 4,
    marginRight: 8,
  },
  domain: {
    fontSize: 12,
    fontWeight: '500',
    color: '#000',
  },
  dot: {
    fontSize: 12,
    color: '#8E8E93',
    marginHorizontal: 4,
  },
  time: {
    fontSize: 12,
    color: '#8E8E93',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  deleteAction: {
    backgroundColor: '#FF3B30',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: '100%',
  },
  deleteText: {
    color: '#FFF',
    fontWeight: '600',
  },
});
