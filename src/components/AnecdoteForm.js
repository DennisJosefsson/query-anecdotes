import { useMutation, useQueryClient } from 'react-query'
import { createAnecdote } from '../requests'
import { useContext } from 'react'
import NotificationContext from '../notificationContext'

const AnecdoteForm = () => {
  const [notification, notificationDispatch] = useContext(NotificationContext)
  const queryClient = useQueryClient()

  const newAnecdoteMutation = useMutation(createAnecdote, {
    onSuccess: () => {
      queryClient.invalidateQueries('anecdotes')
    },
    onError: (error) => {
      notificationDispatch({
        type: 'SET',
        payload: `${error.response.data.error}`,
      })
      setTimeout(() => {
        notificationDispatch({ type: 'REMOVE' })
      }, 5000)
    },
  })

  const onCreate = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    newAnecdoteMutation.mutate({ content, votes: 0 })
    notificationDispatch({
      type: 'SET',
      payload: `Added '${content}'`,
    })
    setTimeout(() => {
      notificationDispatch({ type: 'REMOVE' })
    }, 5000)
  }

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name="anecdote" />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
