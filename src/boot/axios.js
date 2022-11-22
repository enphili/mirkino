import { boot } from 'quasar/wrappers'
import axios from 'axios'

const baseURL = () => {
  if (process.env.DEV) return `http://localhost:3000`
  if (process.env.PROD) return `https://mirkino.devflweb.ru`
}

const api = axios.create({
  baseURL: baseURL()
})

export default boot(({ app }) => {
  // for use inside Vue files (Options API) through this.$axios and this.$backend

  app.config.globalProperties.$axios = axios
  // this will allow you to use this.$axios

  app.config.globalProperties.$api = api
  // this will allow you to use this.$backend
})

export { api }
