export const getUserData = state => state.mirKinoUser

export const getAuth = state => state.isAuth

export const userDisplayName = state => state.mirKinoUser.displayName

export const getUserWishList = state => state.mirKinoUser.wishList

export const getUserFavorite = state => state.mirKinoUser.favorite

export const getUserList = state => list => state.mirKinoUser[list]
