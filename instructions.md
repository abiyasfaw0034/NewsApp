Perfect—this is where your project actually becomes interview-level.
I’ll give you clean, production-style code, not messy demo code.
This will match exactly what they expect in the assessment.

📁 1. Folder Structure (create this manually)
src/
├── app/
│ └── store.ts
│
├── features/
│ ├── articles/
│ │ ├── components/
│ │ ├── screens/
│ │ │ ├── ArticleListScreen.tsx
│ │ │ └── ArticleDetailScreen.tsx
│ │ ├── store/
│ │ │ └── articlesSlice.ts
│ │ ├── mockData.ts
│ │ └── types.ts
│
│ ├── bookmarks/
│ │ ├── screens/
│ │ │ └── BookmarksScreen.tsx
│ │ ├── store/
│ │ │ └── bookmarksSlice.ts
│
├── navigation/
│ ├── RootNavigator.tsx
│ └── types.ts

🧠 2. Redux Store
📄 src/app/store.ts
import { configureStore } from '@reduxjs/toolkit';
import articlesReducer from '../features/articles/store/articlesSlice';
import bookmarksReducer from '../features/bookmarks/store/bookmarksSlice';

export const store = configureStore({
reducer: {
articles: articlesReducer,
bookmarks: bookmarksReducer,
},
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

📰 3. Articles Slice
📄 articles/types.ts
export interface Article {
id: number;
title: string;
by: string;
score: number;
time: number;
url: string;
}

📄 articles/mockData.ts
import { Article } from './types';

export const mockArticles: Article[] = [
{
id: 1,
title: 'React Native is Awesome',
by: 'john_doe',
score: 120,
time: 1710000000,
url: 'https://example.com/article1',
},
{
id: 2,
title: 'Learn Redux Toolkit',
by: 'jane_dev',
score: 98,
time: 1711000000,
url: 'https://example.com/article2',
},
];

📄 articles/store/articlesSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Article } from '../types';
import { mockArticles } from '../mockData';

type SortType = 'score' | 'time';

interface ArticlesState {
articles: Article[];
loading: boolean;
error: string | null;
sort: SortType;
}

const initialState: ArticlesState = {
articles: mockArticles,
loading: false,
error: null,
sort: 'score',
};

const articlesSlice = createSlice({
name: 'articles',
initialState,
reducers: {
setSort(state, action: PayloadAction<SortType>) {
state.sort = action.payload;
},
},
});

export const { setSort } = articlesSlice.actions;
export default articlesSlice.reducer;

🔖 4. Bookmarks Slice
📄 bookmarks/store/bookmarksSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface BookmarksState {
bookmarks: number[];
}

const initialState: BookmarksState = {
bookmarks: [],
};

const bookmarksSlice = createSlice({
name: 'bookmarks',
initialState,
reducers: {
toggleBookmark(state, action: PayloadAction<number>) {
const id = action.payload;
if (state.bookmarks.includes(id)) {
state.bookmarks = state.bookmarks.filter(b => b !== id);
} else {
state.bookmarks.push(id);
}
},
},
});

export const { toggleBookmark } = bookmarksSlice.actions;
export default bookmarksSlice.reducer;

🔀 5. Navigation
📄 navigation/RootNavigator.tsx
import React from 'react';
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
<Tab.Navigator>
<Tab.Screen name="Home" component={HomeStack} />
<Tab.Screen name="Bookmarks" component={BookmarksScreen} />
</Tab.Navigator>
</NavigationContainer>
);
}

📱 6. Screens
📄 ArticleListScreen.tsx
import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../../../app/store';
import { useNavigation } from '@react-navigation/native';

export default function ArticleListScreen() {
const navigation = useNavigation<any>();
const articles = useSelector((state: RootState) => state.articles.articles);

return (
<FlatList
data={articles}
keyExtractor={(item) => item.id.toString()}
renderItem={({ item }) => (
<TouchableOpacity onPress={() => navigation.navigate('Detail', { article: item })}>
<View style={{ padding: 16 }}>
<Text>{item.title}</Text>
<Text>Score: {item.score}</Text>
</View>
</TouchableOpacity>
)}
/>
);
}

📄 ArticleDetailScreen.tsx
import React from 'react';
import { View, Text, Button } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { toggleBookmark } from '../../bookmarks/store/bookmarksSlice';
import { RootState } from '../../../app/store';

export default function ArticleDetailScreen({ route }: any) {
const { article } = route.params;
const dispatch = useDispatch();
const bookmarks = useSelector((state: RootState) => state.bookmarks.bookmarks);

const isBookmarked = bookmarks.includes(article.id);

return (
<View style={{ padding: 16 }}>
<Text>{article.title}</Text>
<Text>By: {article.by}</Text>
<Text>Score: {article.score}</Text>

     <Button
       title={isBookmarked ? 'Remove Bookmark' : 'Add Bookmark'}
       onPress={() => dispatch(toggleBookmark(article.id))}
     />

   </View>
 );
}

📄 BookmarksScreen.tsx
import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../../../app/store';

export default function BookmarksScreen() {
const { bookmarks } = useSelector((state: RootState) => state.bookmarks);
const { articles } = useSelector((state: RootState) => state.articles);

const bookmarkedArticles = articles.filter(a => bookmarks.includes(a.id));

return (
<FlatList
data={bookmarkedArticles}
keyExtractor={(item) => item.id.toString()}
ListEmptyComponent={<Text>No bookmarks yet</Text>}
renderItem={({ item }) => (
<View style={{ padding: 16 }}>
<Text>{item.title}</Text>
</View>
)}
/>
);
}

⚠️ 7. Hook up Redux (VERY IMPORTANT)
📄 App.tsx
import React from 'react';
import { Provider } from 'react-redux';
import { store } from './src/app/store';
import RootNavigator from './src/navigation/RootNavigator';

export default function App() {
return (
<Provider store={store}>
<RootNavigator />
</Provider>
);
}

🚀 What you have now
You already built:
✅ Navigation (Stack + Tabs)
✅ Redux Toolkit setup
✅ Feature-based architecture
✅ Bookmark system (working)
✅ Mock data flow

🔥 Next step (important)
Now we upgrade this to real assessment level:
👉 Add:
API layer (Hacker News)
Sorting logic
AsyncStorage persistence
Loading / error states
Pull-to-refresh

If you want next, I’ll give you:
👉 API integration + Promise.all + filtering (exactly as assignment requires)
u know its not expo and its pure native cli right?? cause there is no src, there is android and ios tho
Yeah—I know 👍 and you’re right to question it.
Let me clear this up properly:

🧠 RN CLI vs Expo confusion
In React Native CLI, your project starts like:
android/
ios/
App.tsx
index.js
👉 There is no src/ folder by default

⚠️ But here’s the important part
👉 You are SUPPOSED to create src/ yourself
This is not Expo vs CLI.
This is:
❗ Project organization (architecture choice)

🧠 Why we add src/ manually
Without it:
App.tsx
components/
screens/
utils/
👉 becomes messy FAST ❌
