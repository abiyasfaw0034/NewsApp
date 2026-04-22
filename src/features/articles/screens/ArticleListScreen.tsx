import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  StyleSheet, 
  ActivityIndicator, 
  TextInput,
  RefreshControl,
  Button,
  Image
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useArticles, useProcessedArticles } from '../hooks/useArticles';
import { useDebounce } from '../../../hooks/useDebounce';
import { formatRelativeTime, getDomain, getFaviconUrl } from '../../../utils/helpers';

export default function ArticleListScreen() {
  const navigation = useNavigation<any>();
  
  // Data and actions
  const { 
    rawArticles, 
    loading, 
    error, 
    searchQuery, 
    sort,
    fetchArticles, 
    updateSearch,
    updateSort
  } = useArticles();
  
  // Processing
  const processedArticles = useProcessedArticles(rawArticles, searchQuery, sort);
  
  // Search state
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const debouncedSearch = useDebounce(localSearch, 500);

  // 1. Component decides when to fetch
  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  // 2. Sync debounced search to Redux (fixed dependencies)
  useEffect(() => {
    updateSearch(debouncedSearch);
  }, [debouncedSearch, updateSearch]);

  const clearSearch = () => {
    setLocalSearch('');
  };

  if (loading && rawArticles.length === 0) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.mt10}>Fetching latest news...</Text>
      </View>
    );
  }

  if (error && rawArticles.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
        <Button title="Retry" onPress={fetchArticles} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search articles..."
            placeholderTextColor="#8E8E93"
            value={localSearch}
            onChangeText={setLocalSearch}
            clearButtonMode="while-editing"
          />
          {localSearch.length > 0 && (
            <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
              <Text style={styles.clearButtonText}>✕</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.sortContainer}>
          <Text style={styles.sortLabel}>Sort by:</Text>
          <TouchableOpacity 
            style={[styles.sortButton, sort === 'score' && styles.activeSort]} 
            onPress={() => updateSort('score')}
          >
            <Text style={[styles.sortButtonText, sort === 'score' && styles.activeSortText]}>Score</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.sortButton, sort === 'time' && styles.activeSort]} 
            onPress={() => updateSort('time')}
          >
            <Text style={[styles.sortButtonText, sort === 'time' && styles.activeSortText]}>Time</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <FlatList
        data={processedArticles}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={fetchArticles} />
        }
        ListEmptyComponent={
          <View style={styles.center}>
            <Text style={styles.emptyText}>
              {loading 
                ? 'Updating...' 
                : searchQuery 
                  ? `No results for "${searchQuery}"`
                  : 'No articles found'}
            </Text>
          </View>
        }
        renderItem={({ item }) => {
          const domain = getDomain(item.url);
          const faviconUrl = getFaviconUrl(item.url);
          
          return (
            <TouchableOpacity 
              style={styles.item}
              onPress={() => navigation.navigate('Detail', { article: item })}
            >
              <View style={styles.itemHeader}>
                {faviconUrl && (
                  <Image source={{ uri: faviconUrl }} style={styles.favicon} />
                )}
                <Text style={styles.domain}>{domain}</Text>
                <Text style={styles.dot}>•</Text>
                <Text style={styles.time}>{formatRelativeTime(item.time)}</Text>
              </View>
              
              <Text style={styles.title}>{item.title}</Text>
              
              <View style={styles.footer}>
                <Text style={styles.info}>by {item.by}</Text>
                <Text style={styles.info}>Score: {item.score}</Text>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
    paddingBottom: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E5E5EA',
    margin: 10,
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 16,
    color: '#000', // Ensure text is visible
  },
  clearButton: {
    padding: 5,
  },
  clearButtonText: {
    color: '#8E8E93',
    fontSize: 18,
  },
  sortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  sortLabel: {
    fontSize: 14,
    color: '#8E8E93',
    marginRight: 10,
  },
  sortButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 15,
    backgroundColor: '#E5E5EA',
    marginRight: 8,
  },
  activeSort: {
    backgroundColor: '#007AFF',
  },
  sortButtonText: {
    fontSize: 12,
    color: '#000',
  },
  activeSortText: {
    color: '#FFF',
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
    marginBottom: 8,
    lineHeight: 22,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  info: {
    fontSize: 12,
    color: '#8E8E93',
  },
  errorText: {
    color: '#FF3B30',
    marginBottom: 10,
    textAlign: 'center',
  },
  emptyText: {
    color: '#8E8E93',
    fontSize: 16,
    textAlign: 'center',
  },
  mt10: {
    marginTop: 10,
  },
});
