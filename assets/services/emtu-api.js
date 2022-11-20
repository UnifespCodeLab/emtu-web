import axios from 'axios'

export const apiHost = 'localhost:3333'

const axiosClient = axios.create({
  baseURL: apiHost
})

export default axiosClient
