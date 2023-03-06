import axios from 'axios'

const baseUrl = 'http://localhost:3001/anecdotes'

export const getAnecdotes = () => {
  const result = axios.get(baseUrl).then((res) => res.data)
  return result
}

export const createAnecdote = (anecdote) => {
  const result = axios.post(baseUrl, anecdote).then((res) => res.data)
  return result
}

export const voteAnecdote = (anecdote) => {
  const anecdoteUrl = `${baseUrl}/${anecdote.id}`
  const result = axios
    .put(anecdoteUrl, { ...anecdote, votes: anecdote.votes + 1 })
    .then((res) => res.data)
  return result
}
