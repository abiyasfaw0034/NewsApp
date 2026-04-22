import React from 'react';
import { Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

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
          tabBarIcon: ({ focused }) => {
            let icon;
            if (route.name === 'Home') {
              icon = focused ? '📰' : '📰';
            } else if (route.name === 'Bookmarks') {
              icon = focused ? '🔖' : '🔖';
            }
            return <Text style={{ fontSize: 20 }}>{icon}</Text>;
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
