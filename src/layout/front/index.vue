<template>
  <div class="main">
    <HeaderBar></HeaderBar>
    <div :class="{ container: !isDoQuestion, question: isDoQuestion }">
      <router-view v-slot="{ Component, route }">
        <transition name="fadeSlideX" mode="out-in">
          <keep-alive>
            <component :is="Component" :key="route.path" />
          </keep-alive>
        </transition>
      </router-view>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, onBeforeMount, ref, watch } from "vue";
export default defineComponent({
  name: "Layout-Front",
});
</script>
<script lang="ts" setup>
import HeaderBar from "./components/HeaderBar.vue";
import { useRoute } from "vue-router";

const route = useRoute();
const isDoQuestion = ref(false);
if (route.path.includes("/q/")) {
  isDoQuestion.value = true;
} else {
  isDoQuestion.value = false;
}

onBeforeMount(() => {
  watch(
    () => route.path,
    (_path): any => {
      console.log("path changed", _path);
      if (_path.includes("/q/")) {
        isDoQuestion.value = true;
      } else {
        isDoQuestion.value = false;
      }
    }
  );
});
</script>

<style lang="scss" scoped>
.container {
  width: 70%;
  margin: 25px auto;

  // border: 1px solid;
}

.question {
  // margin-top: 20px;
}

@media screen and (max-width: 1068px) {
  .container {
    width: 90%;
  }
}
</style>
