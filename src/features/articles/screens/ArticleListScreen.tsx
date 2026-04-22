import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../../../app/store';
import { useNavigation } from '@react-navigation/native';

export default function ArticleListScreen() {
  const navigation = useNavigation<any>();
  const articles = useSelector((state: RootState) => state.articles.articles);

  return (
    <View style={styles.container}>
      <FlatList
        data={articles}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.item}
            onPress={() => navigation.navigate('Detail', { article: item })}
          >
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.score}>Score: {item.score}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  item: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  score: {
    color: '#666',
  },
});
