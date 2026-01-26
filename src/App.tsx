import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useTodos } from './hooks/useTodos'
import { TodoListContainer } from './containers/TodoListContainer'
import { EditPageContainer } from './containers/EditPageContainer'

function App() {
  const { todos, addTodo, updateTodo, deleteTodo, toggleComplete, getTodo } = useTodos()

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-paper">
        <Routes>
          <Route
            path="/"
            element={
              <TodoListContainer
                todos={todos}
                onToggleComplete={toggleComplete}
              />
            }
          />
          <Route
            path="/new"
            element={
              <EditPageContainer
                getTodo={getTodo}
                onAdd={addTodo}
                onUpdate={updateTodo}
                onDelete={deleteTodo}
                onToggleComplete={toggleComplete}
              />
            }
          />
          <Route
            path="/edit/:id"
            element={
              <EditPageContainer
                getTodo={getTodo}
                onAdd={addTodo}
                onUpdate={updateTodo}
                onDelete={deleteTodo}
                onToggleComplete={toggleComplete}
              />
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
