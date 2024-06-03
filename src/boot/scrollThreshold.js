const SCROLL_THRESHOLD = 600

export default ({ app }) => {
  app.config.globalProperties.$threshold = SCROLL_THRESHOLD
}
export { SCROLL_THRESHOLD }
