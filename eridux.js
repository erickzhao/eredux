const createStore = (reducer, initialState) => {
  const store = {};
  
  // Current state of the store
  store.state = initialState;

  // Listeners are functions that execute when an action is dispatched
  store.listeners = [];

  // Following a UI interaction, the component calls the dispatch function
  // to modify the state and execute each listener function.
  
  // Each action has its own type to tell the reducer what to do.
  store.dispatch = (action) => {
    store.state = reducer(store.state, action);
    store.listeners.forEach(listener => listener());
  };

  store.subscribe = (listener) => {
    store.listeners.push(listener);
  };

  // Exposes the state
  store.getState = () => store.state;

  return store;
}
