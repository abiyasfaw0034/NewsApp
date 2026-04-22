import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';

import ArticleListScreen from '../features/articles/screens/ArticleListScreen';
import ArticleDetailScreen from '../features/articles/screens/ArticleDetailScreen';
import BookmarksScreen from '../features/bookmarks/screens/BookmarksScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const HomeStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="Articles" component={ArticleListScreen} />
    <Stack.Screen name="Detail" component={ArticleDetailScreen} />
  </Stack.Navigator>
);

export default function RootNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName = '';
            if (route.name === 'Home') {
              iconName = focused ? 'newspaper' : 'newspaper-outline';
            } else if (route.name === 'Bookmarks') {
              iconName = focused ? 'bookmarks' : 'bookmarks-outline';
            }
            return <Icon name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#007AFF',
          tabBarInactiveTintColor: 'gray',
        })}
      >
        <Tab.Screen name="Home" component={HomeStack} options={{ headerShown: false }} />
        <Tab.Screen name="Bookmarks" component={BookmarksScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
