<template>
  <div class="loading" :style="{'background-color': color}"></div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "loading",
  props: {
    color: {
      type: String,
    },
  },
});
</script>

<style lang="scss" scoped></style>
