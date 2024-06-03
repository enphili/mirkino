<template>
  <div class="user" @click="authUser">
    <p class="user__name">Привет, <span>{{ upperCaseFirstChar(userName) + '!' }}</span></p>
    <img src="../assets/img/login.png" alt="avatar" class="user__avatar">
  </div>

  <q-dialog v-model="confirm" persistent>
    <q-card style="background-color: #e2e2e2;">
      <q-card-section class="row items-center">
        <q-avatar size="41px" color="accent" class="shadow-5">
          <img src="../assets/img/login.png" alt="avatar">
        </q-avatar>
        <span class="q-ml-md text-subtitle2 text-dark" style="max-width: 230px;">Хотите выйти из аккаунта или зайти в личный кабинет?</span>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Отмена" color="dark" v-close-popup />
        <q-btn flat label="В кабинет" color="dark" v-close-popup @click="toPrivateOffice"/>
        <q-btn flat label="Выйти" color="dark" v-close-popup @click="logout" />
      </q-card-actions>
    </q-card>
  </q-dialog>

</template>

<script>
import {useNotification} from 'src/use/notification'
import {ref, onMounted} from 'vue'
import { useQuasar } from 'quasar'
import {useRouter} from 'vue-router'
import {useStore} from 'vuex'
import {api} from 'boot/axios'
import { upperCaseFirstChar } from '../utils/upperCaseFirstChar'

export default {
  name: "AuthInfo",

  setup() {
    const router = useRouter()
    const confirm = ref(false)
    const $store = useStore()
    const userName = ref('гость')
    const $q = useQuasar()

    const getUserData = () => {
      const userData = $store.getters['currentUser/getUserData']
      userData.displayName?.length > 0 ? userName.value = userData.displayName : userName.value = 'гость'
    }

    onMounted(() => getUserData())

    const logout = async () => {
      try {
        await api.get('/apifb/logout') // выход из firebase
        $store.commit('currentUser/logout') // обнуление state и очистка localstorage
        getUserData() // замена никнейма на - 'гость'
        await useNotification({
          router,
          notify: $q,
          type: 'success',
          message: 'Вы вышли из системы'
        })
      }
      catch (error) {
        await useNotification({
          router,
          notify: $q,
          error
        })
      }
    }

    const toPrivateOffice = () => router.push('/privateoffice')

    const authUser = () => {
      if (userName.value !== 'гость') confirm.value = true
      else router.push('/login')
    }

    return { authUser, confirm, logout, upperCaseFirstChar, userName, toPrivateOffice }
  }
}
</script>
