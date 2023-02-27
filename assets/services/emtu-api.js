import axios from 'axios'

export const apiHost = 'http://localhost:3333'

const axiosClient = axios.create({
  baseURL: apiHost,
  headers: {
    'Content-Type': 'application/json'
  }
})

export default axiosClient
