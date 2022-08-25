<template>
  <button @click="handler">测试</button>
  <div>环境变量：{{ env }}</div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { validate } from "../src/api/api";

const handler = async () => {
  let res = await validate({});
  console.log(res, "res");
};

const env = computed(() => {
  return import.meta.env;
});
</script>

<style scoped></style>
