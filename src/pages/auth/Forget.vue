<template>
  <div class="lbox__form-wrap form-wrap">
    <p class="form-wrap__form-title form-title">Восстановление пароля</p>
    <q-form
      sclass="login-form"
      @submit.prevent.stop="onSubmit"
      style="width: 240px"
    >
      <q-input
        color="grey-10"
        class="q-mt-sm q-mb-md"
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

      <q-btn label="Восстановить" type="submit" color="accent" class="full-width"/>
    </q-form>
    <app-close-form @click.prevent="$router.push('/')"/>
  </div>
</template>

<script>
import AppCloseForm from 'components/ui/AppCloseForm'
import {useMeta, useQuasar} from 'quasar'
import {useNotification} from 'src/use/notification'
import {ref} from 'vue'
import {api} from 'boot/axios'
import {emailRegValid} from 'src/utils/emailRegValid'
import {useRouter} from 'vue-router'

export default {
  name: "Forget",

  setup() {
    const $q = useQuasar()
    const router = useRouter()
    const metaData = {
      title: 'Восстановление пароля',
      titleTemplate: title => `Мир кино | ${title}`,
      meta: {
        description: {name: 'description', content: 'Страница восстановления пароля от учетной записи'}
      }
    }
    const email = ref(null)
    const emailInput = ref(null)

    useMeta(metaData)

    const onSubmit = async () => {
      emailInput.value.validate()
      if (emailInput.value.hasError) {
        await useNotification({
          router,
          notify: $q,
          message: 'Похоже email заполнен не правильно'
        })
      } else {
        try {
          const response = await api.post('/apifb/forget', {email: email.value})
          if (response.status === 200) {
            await router.push('/login')
          }
          await useNotification({
            router,
            notify: $q,
            type: 'success',
            message: 'Ссылка на сброс пароля отправлена Вам на email.'
          })
        } catch (error) {
          await useNotification({
            router,
            notify: $q,
            error
          })
        }
      }
    }

    return {email, emailInput, onSubmit, emailRegValid}
  },

  components: {AppCloseForm}
}
</script>
