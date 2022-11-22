export const useGetLSData = (key, dataType) => JSON.parse(localStorage.getItem('mirKinoUser'))?.[key] ?? dataType
