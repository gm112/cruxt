<template>
  <u-app
    :toaster="{
      position: 'top-right',
      class: 'mt[calc(env(--env-safe-area-inset-top))]',
    }"
  >
    <nuxt-route-announcer />
    <nuxt-layout>
      <nuxt-page />
    </nuxt-layout>
  </u-app>
</template>
