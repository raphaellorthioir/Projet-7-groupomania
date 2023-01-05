// ce fichier va s'occuper de regrouper tous les reducers

import { combineReducers } from 'redux';
import userReducer from './user.reducer';

export default combineReducers({
  userReducer,
});
