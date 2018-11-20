import React from 'react';
import { Provider } from 'react-redux';

import Application from './application';
import store from './redux/store/store';

export default () => (
  <Provider store={store}>
    <Application />
  </Provider>
);
