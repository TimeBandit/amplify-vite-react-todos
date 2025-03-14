import { useAuthenticator } from "@aws-amplify/ui-react";
import { generateClient } from "aws-amplify/data";
import { useEffect, useState } from "react";
import type { Schema } from "../amplify/data/resource";

const client = generateClient<Schema>();

function App() {
  const { user, signOut } = useAuthenticator();
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);

  useEffect(() => {
    client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
    });
  }, []);

  function createTodo() {
    client.models.Todo.create({
      content: window.prompt("Todo content"),
      isDone: false,
    });
  }

  function deleteTodo(id: string) {
    client.models.Todo.delete({ id });
  }

  function updateTodo(e: React.MouseEvent<HTMLInputElement>) {
    e.stopPropagation();
    const id = e.currentTarget.id;

    client.models.Todo.update({
      id,
      isDone: e.currentTarget.checked,
    });
  }

  return (
    <main>
      <h1>{user?.signInDetails?.loginId}'s todos</h1>
      <button onClick={createTodo}>+ new</button>
      <ul>
        {todos.map((todo) => (
          <div className="item" key={todo.id}>
            <li className="item_content" onClick={() => deleteTodo(todo.id)}>
              {todo.content}
            </li>
            <input
              className="item_checkbox"
              onClick={(e) => updateTodo(e)}
              type="checkbox"
              name=""
              id={todo.id}
            />
          </div>
        ))}
      </ul>
      <div>
        🥳 App successfully hosted. Try creating a new todo.
        <br />
        <a href="https://docs.amplify.aws/react/start/quickstart/#make-frontend-updates">
          Review next step of this tutorial.
        </a>
      </div>
      <button onClick={signOut}>Sign out</button>
    </main>
  );
}

export default App;
