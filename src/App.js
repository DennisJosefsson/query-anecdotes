import { useQuery, useMutation, useQueryClient } from 'react-query'
import { getAnecdotes, voteAnecdote } from './requests'
import { useReducer } from 'react'
import NotificationContext from './notificationContext'

import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'

const notificationReducer = (state, action) => {
  switch (action.type) {
    case 'SET':
      return action.payload
    case 'REMOVE':
      return null
    default:
      return state
  }
}

const App = () => {
  const [notification, notificationDispatch] = useReducer(
    notificationReducer,
    null
  )

  const queryClient = useQueryClient()
  const voteAnecdoteMutation = useMutation(voteAnecdote, {
    onSuccess: () => {
      queryClient.invalidateQueries('anecdotes')
    },
  })

  const handleVote = (anecdote) => {
    voteAnecdoteMutation.mutate(anecdote)
    notificationDispatch({
      type: 'SET',
      payload: `Voted on '${anecdote.content}'`,
    })
    setTimeout(() => {
      notificationDispatch({ type: 'REMOVE' })
    }, 5000)
  }

  const result = useQuery('anecdotes', getAnecdotes)

  if (result.isError) {
    return <div>Anecdote service not available due to server error</div>
  }
  if (result.isLoading) {
    return <div>Retrieving data</div>
  }

  const anecdotes = result.data

  return (
    <div>
      <h3>Anecdote app</h3>
      <NotificationContext.Provider
        value={[notification, notificationDispatch]}
      >
        <Notification notification={notification} />
        <AnecdoteForm />
      </NotificationContext.Provider>
      {anecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default App
