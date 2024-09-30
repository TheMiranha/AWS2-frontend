import axios from 'axios'

export const mainAPI = axios.create({
  baseURL: import.meta.env.VITE_API_MAIN
})