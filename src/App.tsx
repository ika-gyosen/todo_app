import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useTodos } from './hooks/useTodos'
import { TodoList } from './components/TodoList'
import { EditPage } from './components/EditPage'

function App() {
  const { todos, addTodo, updateTodo, deleteTodo, toggleComplete, getTodo } = useTodos()

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-paper">
        <Routes>
          <Route
            path="/"
            element={
              <TodoList
                todos={todos}
                onToggleComplete={toggleComplete}
              />
            }
          />
          <Route
            path="/new"
            element={
              <EditPage
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
              <EditPage
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
