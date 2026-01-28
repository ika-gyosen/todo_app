import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useTodos } from './hooks/useTodos'
import { KanbanBoardContainer } from './containers/KanbanBoardContainer'
import { EditPageContainer } from './containers/EditPageContainer'

function App() {
  const { todos, addTodo, updateTodo, deleteTodo, updateTodoStatus, getTodo } = useTodos()

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-paper">
        <Routes>
          <Route
            path="/"
            element={
              <KanbanBoardContainer
                todos={todos}
                onUpdateStatus={updateTodoStatus}
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
              />
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
