<script setup lang="ts">
import splitRight from "./split-right.vue";
import splitLeft from "./split-left.vue";
import { ref } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

// 获取题目 ID
const questionId = ref<number>();
questionId.value = Number(route.path.slice(3));
</script>

<template>
  <div id="doQuestion">
    <n-split
      direction="horizontal"
      style="height: 90vh"
      :max="0.75"
      :min="0.25"
    >
      <template #1>
        <split-left :id="questionId"/>
      </template>
      <template #2>
        <split-right :id="questionId"/>
      </template>
    </n-split>
  </div>
</template>

<style scoped>
#doQuestion {
  /* border: 1px solid; */
  margin-top: 5px;
}
</style>
