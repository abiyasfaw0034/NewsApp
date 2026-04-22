# 📰 Hacker News App - React Native CLI Assessment

A production-grade React Native application displaying top stories from Hacker News, featuring a feature-based architecture, Redux state management, and robust offline awareness.

## 📱 Overview

This application provides a seamless experience for browsing the latest technology news. It fetches real-time data from the Hacker News API, offering deep exploration of each story through a dedicated detail screen and persistent bookmarking for offline consumption.

- **Real-time News**: Fetches and displays the top 20 stories from Hacker News.
- **Rich Content**: View article details and open original sources directly via **Linking.openURL**.
- **Smart Bookmarking**: Save full articles for later reading with local persistence that survives app restarts.
- **Offline Resilience**: Monitor connection status and read cached stories even without internet.

---

## ⚙️ Tech Stack

- **Framework**: React Native CLI (Pure Native, NOT Expo)
- **Language**: TypeScript
- **State Management**: Redux Toolkit (RTK) with Thunks
- **Navigation**: React Navigation (Bottom Tabs + Native Stack)
- **Networking**: Axios
- **Persistence**: AsyncStorage
- **Connectivity Monitoring**: @react-native-community/netinfo
- **Testing**: Jest + @testing-library/react-native + redux-mock-store

---

## 🚀 Setup Instructions

### 1. Clone & Install

```bash
git clone https://github.com/abiyasfaw0034/NewsApp
cd NewsApp
npm install
```

### 2. Run Android

```bash
npx react-native run-android
```

### 3. Run iOS

```bash
cd ios && pod install && cd ..
npx react-native run-ios
```

---

## 🏗️ Architecture & Folder Structure

We follow a **Feature-Based Architecture**, ensuring that every module (Articles, Bookmarks) is self-contained and scalable.

- **API Layer**: Centralized network logic using Axios.
- **Hooks**: Custom hooks (`useArticles`, `useDebounce`) handle complex business logic.
- **Components**: UI-only components formatted for performance.
- **Redux**: Predictable global state management.

### Directory Structure:

```
src/
  app/              # Global Redux Store config
  features/
    articles/      # Main news feed logic, screens, and API
      api/         # fetchArticles.ts
      hooks/       # useArticles.ts
      screens/     # ArticleListScreen, ArticleDetailScreen
      store/       # articlesSlice.ts
    bookmarks/     # Persistence layer for saved stories
      store/       # bookmarksSlice.ts
      screens/     # BookmarksScreen
  navigation/       # RootNavigator (Bottom Tabs + Stack)
  shared/           # Global UI components (OfflineBanner)
  utils/            # Formatting & parsing helpers (helpers.ts)
```

---

## ✨ Features Implemented

### 📝 Core Requirements

- ✅ **Article List**: High-performance scrolling using `FlatList`.
- ✅ **Detailed View**: Access author, score, and relative time for every story.
- ✅ **Linking.openURL**: Tappable **"Open in Browser"** button in the Detail screen to access full articles.
- ✅ **Share API Integration**: Integrated the native **React Native Share API** in the header of the Detail screen for frictionless content sharing.
- ✅ **Favicon Integration**: Using the **Google S2 Favicon API** to dynamically display source icons (e.g., GitHub, TechCrunch) for every story.
- ✅ **Sorting Control**: Toggle between **Score** and **Time** (recency) to find what matters most.

### 🌟 Bonus Features

- ✅ **Bookmarks Tab**: A dedicated **third tab in the Bottom Tab Navigator** specifically for managing saved stories.
- ✅ **Swipe-to-Remove**: Implemented gesture-based **swipe-to-delete** on the Bookmarks screen using `react-native-gesture-handler`.
- ✅ **Debounced Search**: Local filtering with a 500ms delay to prevent UI stutter and unnecessary re-renders.
- ✅ **Offline Detection Banner**: An animated status banner that appears when connectivity is lost. It handles reconnection elegantly and allows users to access their **cached bookmarks** while offline.

---

## ⚡ Performance Optimizations

- **FlatList Tuning**: Optimized with `keyExtractor` and `getItemLayout` (fixed height) for stable 60fps rendering even with large data sets.
- **Memoization**: Extensive use of `React.memo`, `useMemo`, and `useCallback` to maintain referential identity and minimize re-renders.
- **Scroll Restoration**: Automatically managed via React Navigation's native stack behavior when returning from the Detail screen.

---

## 🧪 Testing Coverage

### Unit Tests (`src/utils/__tests__`)

- **helpers.test.ts**: Asserts that domain extraction correctly parses URLs and handles edge cases (e.g., removing `www`).

### Component Tests (`src/features/articles/screens/__tests__`)

- **ArticleListScreen.test.tsx**:
  - Asserts that 20 items are rendered inside the feed.
  - Verifies that search filtering correctly hides non-matching items.
  - Asserts that the "No results" empty state displays the correct query context.
  - Verifies that navigation is triggered when a list item is tapped.

---

## 🧠 Technical Case Study (Section 02)

### Q1 — Bridge vs JSI & The New Architecture

React Native originally used the **Bridge** to communicate between JS and Native via asynchronous JSON serialization. This was a bottleneck for performance. **JSI (JavaScript Interface)** allows JS to hold direct C++ references to native objects, enabling **synchronous** execution and eliminating the serialization overhead. This is the foundation of the new **Fabric** (UI) and **TurboModules** (logic) architectures.

### Q2 — Diagnosing a Janky FlatList

I would identify FPS drops using **Flipper** or the **Performance Monitor**. Primary fixes include:

1. Ensuring list items are wrapped in `React.memo`.
2. Implementing `getItemLayout` to skip dynamic measurement.
3. Tuning `windowSize` and `maxToRenderPerBatch` to reduce memory pressure.
4. Using `useMemo` for any data processing (sorting/filtering) before passing data to the list.

### Q3 — useCallback and useMemo

I used `useMemo` in this project to cache the sorted/filtered article array, ensuring it only recalculates when the search query or sort type changes. I used `useCallback` for the `renderItem` function of the FlatList; since `ArticleItem` is a memoized component, a stable function reference is required to prevent it from re-rendering on every parent render.

### Q4 — State Management Decision

I chose **Redux Toolkit** over Context API because this app requires complex, multi-layered state (API data + Local Bookmarks) that must be synced and persisted. Redux provides a single source of truth and excellent dev-tooling. I selected RTK over **Zustand** for this assessment to demonstrate familiarity with industry-standard, robust patterns for enterprise-level apps.

### Q5 — Offline-First Strategy

My strategy involves **Connection Detection** (via NetInfo) and **Persistence** (via AsyncStorage). We prioritize UX by allowing users to interact with previously saved bookmarks even without internet. For full offline-first apps, I would recommend **RTK Query's caching** or a local DB like **Realm** to store all fetched news items temporarily.

---

## ⚖️ Trade-offs

1. **Parallel Fetching**: We fetch 20+ detail items simultaneously to ensure speed, though this creates a network burst.
2. **Persistence Simplicity**: We use AsyncStorage for bookmarks; for mission-critical apps with high volumes, MMKV would be the faster choice.

---

## ✅ Final Developer Checklist

- [x] App runs perfectly on Android CLI.
- [x] Strict TypeScript interfaces for all data models (Zero `any` usage).
- [x] Hacker News API integration (IDs -> Items -> Filtered Stories).
- [x] All lifecycle states handled (Loading/Error/Empty).
- [x] Persistent Bookmarks survive app restarts.
- [x] Swipe-to-remove gesture-based deletion.
- [x] Offline banner with reconnect handling.
- [x] All 5 technical interview questions answered.
- [x] Full unit and component tests implemented.
