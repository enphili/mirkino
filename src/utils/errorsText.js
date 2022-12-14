const errorsCode = {
  'auth/email-already-in-use' : 'Учетная запись с данным адресом электронной почты уже существует.',
  'auth/invalid-email': 'Недействителен адрес электронной почты.',
  'auth/operation-not-allowed': 'Авторизация по email и паролю в настоящее время отлючена.',
  'auth/weak-password': 'Недостаточно надежный пароль.',
  'auth/app-deleted': 'Экземпляр FirebaseApp был удален.',
  'auth/app-not-authorized': 'Данное приложение не авторизовано с Firebase.',
  'auth/argument-error': 'Метод вызывается с неверными аргументами.',
  'auth/invalid-api-key': 'Предоставленный ключ API недействителен.',
  'auth/invalid-user-token': 'Учетные данные пользователя больше не действительны.',
  'auth/invalid-tenant-id': 'ID недействителен.',
  'auth/network-request-failed': 'Произошла сетевая ошибка.',
  'auth/requires-recent-login': 'Время последнего входа пользователя не соответствует порогу безопасности.',
  'auth/too-many-requests': 'Запросы от устройства заблокированы из-за необычной активности.',
  'auth/user-disabled': 'Учетная запись пользователя была отключена администратором',
  'auth/user-token-expired': 'Срок действия учетных данных пользователя истек.',
  'auth/web-storage-unsupported': 'Браузер не поддерживает веб-хранилище или если пользователь их отключает.',
  'Network Error': 'Сетевая ошибка, сервер не доступен.',
  'auth/user-not-found': 'Пользователь не найден',
  'auth/wrong-password': 'Недействительный пароль для данной учетной записи',
  'auth/invalid-continue-uri': 'В продолжении URL отсутствует домен.',
  'ECONNREFUSED': 'Проверте настройки серверов'
}

export default code => errorsCode[code] ? errorsCode[code] : 'Возникла неизвестная ошибка! Попробуйте позже.'
