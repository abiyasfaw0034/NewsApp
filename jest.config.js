module.exports = {
  preset: '@react-native/jest-preset',
  setupFilesAfterEnv: ['./jest.setup.js'],
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|@react-navigation|react-redux|@reduxjs/toolkit|axios)/)',
  ],
  moduleNameMapper: {
    '^react-redux$': '<rootDir>/node_modules/react-redux/dist/react-redux.js',
  },
};
