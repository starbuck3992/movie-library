<template>
  <HeaderMenu></HeaderMenu>
  <Toast></Toast>
  <router-view />
</template>

<script setup lang="ts">
import HeaderMenu from '@/modules/HeaderMenu.vue';
import Toast from '@/modules/Toast.vue';
</script>
