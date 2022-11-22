<template>
  <q-layout view="hhh LpR fff" class="bg-dark">
    <q-header class="transparent q-pb-md">
      <q-toolbar class="q-mt-md">
        <q-toolbar-title shrink class="text-weight-black app-title" style="display: block">
          <router-link to="/">
            МирКино
          </router-link>
        </q-toolbar-title>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <router-view :key="$route.fullPath"/>
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
  name: "OfficeLayout",
}
</script>

