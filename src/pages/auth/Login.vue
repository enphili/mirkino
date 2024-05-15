<template>
  <div class="lbox__form-wrap form-wrap">
  <p class="form-wrap__form-title form-title">Авторизация</p>
  <q-form
    class="login-form"
    @submit.prevent.stop="onSubmit"
    style="width: 240px"
  >
    <q-input
      color="grey-10"
      type="email"
      v-model="email"
      label="Ваш e-mail"
      ref="emailInput"
      :rules="[
          val => !!val || 'Обязательное поле',
          val => val.match(emailRegValid) || 'Не валидный email'
          ]"
    >
      <template v-slot:prepend>
        <q-icon name="mail" />
      </template>
    </q-input>

    <q-input
      color="grey-10"
      class="q-mt-sm q-mb-md"
      v-model="password"
      label="Ваш пароль"
      ref="passInput"
      :type="isPwd ? 'password' : 'text'"
      :rules="[
          val => !!val || 'Обязательное поле',
          val => val.length > 5 || 'Пароль не может быть менее 6 символов'
          ]"
    >
      <template v-slot:append>
        <q-icon
          :name="isPwd ? 'visibility_off' : 'visibility'"
          class="cursor-pointer"
          @click="isPwd = !isPwd"
        />
      </template>
      <template v-slot:prepend>
        <q-icon name="password" />
      </template>
    </q-input>

    <q-btn label="Войти" type="submit" color="accent" class="full-width"/>
  </q-form>
  <router-link class="text-right applink forget-pass" to="/forget">Забыли пароль?</router-link>
  <p class="text-body2 q-mt-md q-mb-sm">Hет акаунта?</p>
  <q-btn class="full-width" outline color="accent" @click="$router.push('/registry')">Зарегистрироваться</q-btn>
  <app-close-form @click.prevent="$router.push('/')"/>
</div>
</template>

<script>
import { useMeta } from 'quasar'
import AppCloseForm from 'components/ui/AppCloseForm'
import {ref} from 'vue'
import { useQuasar } from 'quasar'
import {emailRegValid} from 'src/utils/emailRegValid'
import {api} from 'boot/axios'
import errorsText from 'src/utils/errorsText'
import {useStore} from 'vuex'
import {useRouter} from 'vue-router'

export default {
  name: "Login",

  setup() {
    const $q = useQuasar()
    const $store = useStore()
    const router = useRouter()
    const metaData = {
      title: 'Вход в учетную запись',
      titleTemplate: title => `Мир кино | ${title}`,
      meta: {
        description: {name: 'description', content: 'Страница входа на сайт под своей учетной записью'}
      }
    }
    useMeta(metaData)
    const emailInput = ref(null)
    const passInput = ref(null)
    const email = ref(null)
    const password = ref(null)
    const isPwd = ref(true)


    const onSubmit = async () => {
      emailInput.value.validate()
      passInput.value.validate()
      if (emailInput.value.hasError || passInput.value.hasError) {
        $q.notify({
          color: 'red-5',
          textColor: 'white',
          icon: 'warning',
          message: 'Проверте правильность заполненых полей формы'
        })
      } else {
        try {
          const response = await api.post('/apifb/login', {email: email.value, password: password.value})
          $store.commit('currentUser/userData', response.data)
          $store.commit('currentUser/setAuth')
          $q.notify({
            color: 'green-4',
            textColor: 'white',
            icon: 'cloud_done',
            message: 'Вы успешно авторизовались.'
          })
          await router.push('/')
        }
        catch (error) {
          $q.notify({
            color: 'red-5',
            textColor: 'white',
            icon: 'warning',
            message: errorsText(error.response ? error.response.data.errorCode : error.message)
          })
          if (error.response.data.errorCode === 'auth/wrong-password') {
            password.value = ''
          }
        }
      }
    }

    return {
      onSubmit, email, password, isPwd, emailRegValid,
      emailInput, passInput
    }
  },

  components: { AppCloseForm }
}
</script>

