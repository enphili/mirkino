<template>
  <div class="lbox__form-wrap form-wrap">
    <p class="form-wrap__form-title form-title">Регистрация</p>
    <q-form
      class="login-form"
      @submit.prevent.stop="onSubmit"
      style="width: 240px"
      ref="registryForm"
    >
      <q-input
        color="grey-10"
        v-model="formData.login"
        label="Ваше имя/логин"
        ref="loginInput"
        :rules="[
          val => !!val || 'Обязательное поле',
          val => val.length > 3 || 'Имя должно быть не короче 3-х символов'
          ]"
      >
        <template v-slot:prepend>
          <q-icon name="person" />
        </template>
      </q-input>

      <q-input
        color="grey-10"
        type="email"
        v-model="formData.email"
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
        class="q-mt-sm"
        v-model="formData.password"
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

      <q-input
        color="grey-10"
        class="q-mt-sm q-mb-md"
        v-model="confirmpassword"
        label="Подтвердите пароль"
        ref="confirmpassInput"
        :type="isPwd ? 'password' : 'text'"
        :rules="[
          val => !!val || 'Обязательное поле',
          val => val === formData.password || 'Пароли не совпадает'
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

      <q-toggle
        color="accent"
        v-model="accept"
        checked-icon="check"
        class="text-caption q-mb-sm text-left linhe"
        label="Согласен с обработкой персоналных данных"
      >
      </q-toggle>

      <q-btn
        label="Регистрация"
        type="submit"
        color="accent"
        class="full-width"
      />
    </q-form>
    <app-close-form @click.prevent="$router.push('/')"/>
  </div>
</template>

<script>
import {useMeta, useQuasar} from 'quasar'
import {useNotification} from 'src/use/notification'
import {ref} from 'vue'
import {emailRegValid} from 'src/utils/emailRegValid'
import AppCloseForm from 'components/ui/AppCloseForm'
import {api} from 'boot/axios'
import {useStore} from 'vuex'
import {useRouter} from 'vue-router'

export default {
  name: "Registry",

  setup() {
    const $q = useQuasar()
    const $store = useStore()
    const router = useRouter()
    const metaData = {
      title: 'Регистрация новой учетной записи',
      titleTemplate: title => `Мир кино | ${title}`,
      meta: {
        description: {name: 'description', content: 'Страница создания учетной записи'}
      }
    }
    const loginInput = ref(null)
    const emailInput = ref(null)
    const passInput = ref(null)
    const confirmpassInput = ref(null)
    const confirmpassword = ref(null)
    const isPwd = ref(true)
    const accept = ref(false)
    const registryForm = ref(null)
    const formData = ref({
      login: '',
      email: '',
      password: ''
    })

    useMeta(metaData)

    const onSubmit = async () => {
      loginInput.value.validate()
      emailInput.value.validate()
      passInput.value.validate()
      confirmpassInput.value.validate()
      if (emailInput.value.hasError || passInput.value.hasError || loginInput.value.hasError || confirmpassInput.value.hasError) {
        await useNotification({
          router,
          notify: $q,
          message: 'Проверьте правильность заполненных полей формы'
        })
      }
      else if (!accept.value) {
        await useNotification({
          router,
          notify: $q,
          message: 'Вы должны согласится с обработкой персональных данных'
        })
      } else {
        try {
          const res = await api.post('/apifb/registry', {...formData.value})
          $store.commit('currentUser/userData', res.data)
          await useNotification({
            router,
            notify: $q,
            type: 'success',
            message: 'Вы успешно зарегистрировались.'
          })
          await router.push('/')
        } catch (error) {
          await useNotification({
            router,
            notify: $q,
            error
          })
          formData.value.email = ''
        }
      }
    }

    return {
      onSubmit, formData, accept, loginInput, confirmpassInput,
      isPwd, emailRegValid, emailInput, passInput, confirmpassword,
      registryForm
    }
  },

  components: { AppCloseForm }
}
</script>
