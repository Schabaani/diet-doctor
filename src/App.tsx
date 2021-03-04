import React from 'react';
import store from '_redux/store';
import { Provider } from 'react-redux';

import AppNavigation from './navigations';

const App = () => {
  return (
    <Provider store={store}>
      <AppNavigation />
    </Provider>
  );
};

export default App;
