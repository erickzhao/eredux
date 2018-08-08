const getInitialState = () => ({
  todoList: []
});

const reducer = (prevState = getInitialState(), action) => {
  const nextState = {};

  switch (action.type) {
    case 'ADD_TODO':
      nextState.todoList = [
        ...prevState.todoList,
        {
          text: action.text,
          key: prevState.todoList.length
        },
      ]
      break;
    case 'REMOVE_TODO':
      const newList = prevState.todoList.filter(t => t.key !== action.key);
      nextState.todoList = refreshIds(newList);
      break;
    default:
      nextState = JSON.parse(JSON.stringify(prevState));
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

function refreshDOM() {
  const container = document.querySelector('#todos');
  removeChildNodes(container);
  const newNodes = store.getState().todoList.map(t => {
    return createNodeFromTodo(t);
  });
  newNodes.forEach(n => {
    container.appendChild(n);
  });
}

function createNodeFromTodo(todo) {
  const node = document.createElement('div');
  node.textContent = todo.text;
  return node;
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
    'type': 'ADD_TODO',
    'text': todoText
  });

  refreshDOM();
}
