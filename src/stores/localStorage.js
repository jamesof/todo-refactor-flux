/**
 * Attempt to grab any saved ToDos from local storage, failing that, return an empty object
 *
 * @return {object}
 */
export const loadTodos = () => {
  let _todos = {};

  const savedTodos = localStorage.getItem("et-todos");

  if (savedTodos) {
    try {
      _todos = JSON.parse(savedTodos);
    } catch (error) {
      console.error("Saved ToDos could not be parsed: ", savedTodos);
    }
  }

  return _todos;
};

/**
 * Save all ToDos to local storage.
 *
 * @param {object} todos
 * @return {boolean}
 */
export const saveTodos = (todos) => {
  try {
    localStorage.setItem("et-todos", JSON.stringify(todos));

    return true;
  } catch (err) {
    console.log(err);
  }

  return false;

  // function perisitToLocalStorage() {
  //     const currentTodos = select(store).getAll();
  //     localStorage.setItem("et-todos", JSON.stringify(todos));
  //   }
  //   try {
  //     const serialState = JSON.stringify(state);
  //     localStorage.setItem("appState", serialState);
  //   } catch (err) {
  //     console.log(err);
  //   }
};
