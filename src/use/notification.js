import errorsText from 'src/utils/errorsText'

export const useNotification = async ({
    router,
    notify,
    type = 'error',
    error = null,
    message = 'Неизвестная ошибка'
  }) => {
  if (type === 'success') {
    notify.notify({
      color: 'green-4',
      textColor: 'white',
      icon: 'cloud_done',
      message
    })
    return
  }

  if (!error) {
    notify.notify({
      color: 'red-5',
      textColor: 'white',
      icon: 'warning',
      message
    })
    return
  }

  if (error.response) {
    const statusCode = error.response.status
    switch (statusCode) {
      case 404:
        await router.push('/404')
        break
      case 401:
        await router.push('/login')
        notify.notify({
          color: 'red-5',
          textColor: 'white',
          icon: 'warning',
          message: 'Вы неавторизованы. Пожалуйста, войдите в систему.'
        })
        break
      default:
        notify.notify({
          color: 'red-5',
          textColor: 'white',
          icon: 'warning',
          message: errorsText(error.response.data.errorCode || error.message) || message
        })
    }
  } else {
    notify.notify({
      color: 'red-5',
      textColor: 'white',
      icon: 'warning',
      message: error.message || message
    })
  }
}
