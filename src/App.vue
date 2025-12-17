<template>
  <router-view />
  <Toast />
</template>

<script>
import './charts/ChartjsConfig';
import Toast from './components/Toast.vue'

export default {
  components: {
    Toast
  }
}
</script>

