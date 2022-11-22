import {useGetLSData} from 'src/use/getDataFromLocalStorage'

export default function () {
  return {
    isAuth: !!useGetLSData('userUid', ''),
    mirKinoUser: {
      creationTime: useGetLSData('creationTime', ''),
      displayName: useGetLSData('displayName', ''),
      email: useGetLSData('email', ''),
      userUid: useGetLSData('userUid', ''),
      wishList: useGetLSData('wishList', {}),
      favorite: useGetLSData('favorite', {})
    }
  }
}
