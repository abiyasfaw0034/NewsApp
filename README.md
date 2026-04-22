# 📰 Hacker News App - React Native Assessment

A production-grade React Native application displaying top stories from Hacker News, featuring a feature-based architecture, Redux state management, and offline awareness.

## 🚀 Key Features

- **Top Stories Feed**: Fetches real-time data from Hacker News API.
- **Advanced Filtering**: Filters for 'stories' with valid URLs only.
- **Smart Search**: Debounced client-side search across titles and authors.
- **Bookmark System**: Save full articles for offline reading, persisted via `AsyncStorage`.
- **Performance Optimized**: Uses `getItemLayout`, `React.memo`, and `useMemo` for 60fps scrolling.
- **Offline Awareness**: Real-time connection monitoring with a non-intrusive status banner.
- **Deep Linking**: Share articles directly or open them in the system browser.

---

## 🛠 Architecture & Tech Stack

### 📂 Feature-Based Structure
The project follows a **Feature-First** architecture to ensure scalability:
- `src/features/articles`: Logic and UI for the main news feed.
- `src/features/bookmarks`: Persistence and management of saved stories.
- `src/navigation`: App-wide routing configuration.
- `src/shared`: Generic components like `OfflineBanner`.
- `src/utils`: Reusable helpers for formatting and data parsing.

### 🧠 State Management: Redux Toolkit (RTK)
**Decision**: I chose Redux Toolkit over Zustand or Context API.
- **Why?**: RTK provides a predictable state container with built-in support for async logic (Thunks) and deep integration with DevTools. For a news app where multiple features (List, Details, Bookmarks) share data, RTK's centralized store ensures a single source of truth.
- **Full Article Persistence**: We store the entire `Article` object in Bookmarks rather than just the ID. This allows for **instant UI rendering** and **offline viewing** of saved articles without re-fetching from the network.

---

## ⚖️ Trade-offs & Decisions

### 1. No Pagination
- **Trade-off**: The app fetches the top 20 stories at once.
- **Reasoning**: Given the assessment requirement for exactly 20 items, infinite scroll was unnecessary. In a production app, I would implement `onEndReached` with cursor-based pagination.

### 2. Parallel API Calls (`Promise.all`)
- **Trade-off**: We fire 20+ detail requests simultaneously.
- **Reasoning**: HN API requires a separate call per item. Parallelizing these reduces total latency but increases initial network spike.
- **Improvement**: Implementing a caching layer or using RTK Query would mitigate redundant requests.

---

## 🧠 Technical Deep Dive: Interview Questions

### Q: Bridge vs JSI?
- **Bridge**: The legacy architecture where JS and Native communicate via asynchronous JSON messages serialized over a "bridge". It’s often a bottleneck for high-frequency data (like animations).
- **JSI (JavaScript Interface)**: The new architecture (part of Fabric/TurboModules). It allows JS to hold a reference to C++ Host Objects, enabling **synchronous** communication. This eliminates the serialization overhead and allows for much smoother interactions.

### Q: FlatList Performance?
To achieve 60fps in a list:
- **`getItemLayout`**: Skips the need for the list to measure items dynamically (major performance gain for fixed-height items).
- **`keyExtractor`**: Ensures React correctly identifies which items changed, avoiding total re-renders.
- **`windowSize` / `initialNumToRender`**: Controls how many items are kept in memory.
- **`removeClippedSubviews`**: Unmounts components that are off-screen.

### Q: When to use `useMemo` and `useCallback`?
- **`useMemo`**: Used when you have expensive calculations (like our filtering/sorting logic) that should only re-run when specific dependencies change.
- **`useCallback`**: Used to maintain referential identity of functions across renders. This is crucial when passing functions to `React.memo` components (like our `renderItem` or `ArticleItem`) to prevent them from re-rendering just because a parent's function was re-created.

### Q: State Management Comparison?
- **Redux**: Best for complex, global state with many interacting features. Great for debugging.
- **Zustand**: Lightweight, less boilerplate, great for simpler apps or if "simplicity" is the priority.
- **Context API**: Best for static global data (Themes, Auth User). Not ideal for frequently changing state due to "unnecessary re-render" issues in deeply nested trees.

### Q: Offline-First Strategy?
A robust strategy includes:
1. **Caching**: Storing API responses (using something like `redux-persist` or `RTK Query`).
2. **Optimistic Updates**: Updating the UI immediately and syncing with the server when back online.
3. **Queueing**: If a user bookmarks while offline, we queue the action and process it when connectivity is restored.

---

## 📈 Future Improvements
1. **RTK Query Migration**: To handle caching and automated re-fetching out of the box.
2. **Skeleton Screens**: Replace the `ActivityIndicator` with animated skeleton loaders for better perceived performance.
3. **Unit Test Coverage**: Expand tests to cover the UI layer and navigation transitions.

---

## 🛠 Setup & Installation

1. **Clone & Install**:
   ```sh
   npm install
   ```
2. **Run Android**:
   ```sh
   npx react-native run-android
   ```
3. **Run iOS**:
   ```sh
   npx react-native run-ios
   ```
