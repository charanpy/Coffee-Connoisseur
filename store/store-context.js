import { createContext, useReducer } from 'react';

export const StoreContext = createContext();

export const ACTION_TYPES = {
  SET_LANG_LONG: 'SET_LANG_LONG',
  SET_COFFEE_STORES: 'SET_COFFEE_STORES',
};

const storeReducer = (state, action) => {
  switch (action.type) {
    case ACTION_TYPES.SET_LANG_LONG:
      return { ...state, latLong: action.payload.latLong };

    case ACTION_TYPES.SET_COFFEE_STORES:
      return { ...state, coffeeStore: action.payload.coffeeStore };

    default:
      return state;
  }
};

const StoreProvider = ({ children }) => {
  const initialState = {
    latLong: '',
    coffeeStore: [],
  };

  const [state, dispatch] = useReducer(storeReducer, initialState);

  return (
    <StoreContext.Provider value={{ state, dispatch }}>
      {children}
    </StoreContext.Provider>
  );
};

export default StoreProvider;
