<template>
  <q-layout view="hhh LpR fff" class="bg-dark">
    <q-page-container>
      <div class="lbox lbox--visible">
        <div class="lbox__bg" @click.prevent="$router.push('/')"></div>
        <router-view></router-view>
      </div>
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
  name: "AuthLayout"
}
</script>

