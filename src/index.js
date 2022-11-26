import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import axios from 'axios'
import 'moment/locale/es'

axios.defaults.baseURL = 'http://127.0.0.1:4000/api/'
axios.defaults.headers.common['Authorization'] = `Bearer ${window.localStorage.getItem('token')}`
axios.defaults.headers.common['Content-Type'] = 'application/json'
axios.defaults.headers.common['Accept'] = 'application/json'

axios.interceptors.response.use(response => {
  return response.data
}, error => {
  return Promise.reject(error.response.data)
})

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <App />
)
