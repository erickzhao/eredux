const constants = {
  LOCALSTORAGE_KEY: 'TODO_STATE',
}

const actions = {
  ADD_TODO: 'ADD_TODO',
  REMOVE_TODO: 'REMOVE_TODO',
  FORCE_REFRESH: 'FORCE_REFRESH',
  CLEAR_ALL: 'CLEAR_ALL'
}

const getInitialState = () => {
  const stateString = localStorage.getItem(constants.LOCALSTORAGE_KEY);
  if (stateString) {
    const state = JSON.parse(stateString);
    refreshDOM(state);
    return state;
  }

  return {
    todoList: []
  }
};

const reducer = (prevState = getInitialState(), action) => {
  const nextState = {};

  switch (action.type) {
    case actions.ADD_TODO:
      nextState.todoList = [
        ...prevState.todoList,
        {
          text: action.text,
          key: prevState.todoList.length
        },
      ]
      break;
    case actions.REMOVE_TODO:
      const newList = prevState.todoList.filter(t => t.key !== action.key);
      nextState.todoList = refreshIds(newList);
      break;
    case actions.CLEAR_ALL:
      nextState.todoList = [];
      break;
    default:
      Object.assign(nextState, JSON.parse(JSON.stringify(prevState)));
      break;
  }
  return nextState;
}

const store = createStore(reducer);

function refreshIds(todos) {
  return todos.map((t,i) => ({
    text: t.text,
    key: i
  }));
}

function refreshDOM(manualState) {
  const container = document.querySelector('#todos');
  removeChildNodes(container);
  
  const state = manualState || store.getState();
  const newNodes = state.todoList.map(t => {
    return createNodeFromTodo(t);
  });
  newNodes.forEach(n => {
    container.appendChild(n);
  });
}

function createNodeFromTodo(todo) {
  const node = document.createElement('li');
  node.textContent = todo.text;
  node.appendChild(createRemoveButton(todo));
  return node;
}

function createRemoveButton(todo) {
  const btn = document.createElement('button');
  btn.textContent = 'x';
  btn.setAttribute('type', 'button');
  btn.setAttribute('onclick', `remove(${todo.key})`);
  return btn;
}

function removeChildNodes(node) {
  let tmp = node.firstChild;
  while (tmp) {
    node.removeChild(tmp);
    tmp = node.firstChild;
  }
}

function add(todoText) {
  store.dispatch({
    type: actions.ADD_TODO,
    text: todoText
  });

  refreshDOM();
  storeState();
}

function remove(key) {
  store.dispatch({
    type: actions.REMOVE_TODO,
    key: key
  });

  refreshDOM();
  storeState();
}

function removeAll() {
  store.dispatch({
    type: actions.CLEAR_ALL
  });

  refreshDOM();
  storeState();
}

function storeState() {
  const state = store.getState();
  localStorage.setItem(constants.LOCALSTORAGE_KEY, JSON.stringify(state));
}

// trigger pageload for localStorage getter
reducer(undefined, {type: actions.FORCE_REFRESH});
