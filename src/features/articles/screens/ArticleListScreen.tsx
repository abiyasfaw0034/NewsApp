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
  Button
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useArticles, useProcessedArticles } from '../hooks/useArticles';
import { useDebounce } from '../../../hooks/useDebounce';

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
      <TextInput
        style={styles.searchInput}
        placeholder="Search articles..."
        value={localSearch}
        onChangeText={setLocalSearch}
        clearButtonMode="while-editing"
      />

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
      
      <FlatList
        data={processedArticles}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={fetchArticles} />
        }
        ListEmptyComponent={
          <View style={styles.center}>
            <Text style={styles.emptyText}>
              {loading ? 'Updating...' : 'No articles found'}
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.item}
            onPress={() => navigation.navigate('Detail', { article: item })}
          >
            <Text style={styles.title}>{item.title}</Text>
            <View style={styles.footer}>
              <Text style={styles.info}>by {item.by}</Text>
              <Text style={styles.info}>Score: {item.score}</Text>
            </View>
          </TouchableOpacity>
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
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  searchInput: {
    padding: 12,
    margin: 10,
    backgroundColor: '#FFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  sortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    marginBottom: 10,
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
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
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
  },
  mt10: {
    marginTop: 10,
  },
});
