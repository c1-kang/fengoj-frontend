<template>
  <div class="editor">
    <div class="main">
      <codemirror
        v-model="code"
        :style="{
          width: '100%',
          height: config.height,
          backgroundColor: '#fff',
          color: '#333',
        }"
        placeholder="Please enter the code."
        :extensions="extensions"
        :autofocus="config.autofocus"
        :disabled="config.disabled"
        :indent-with-tab="config.indentWithTab"
        :tab-size="config.tabSize"
        @update=""
        @ready=""
        @focus=""
        @change="handleChange($event)"
        @blur=""
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  shallowRef,
  computed,
  watch,
  onMounted,
  ref,
} from "vue";
import { Codemirror } from "vue-codemirror";
import emitter from "@/utils/emitter";

const props = defineProps({
  config: {
    type: Object,
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  theme: [Object, Array],
  language: Function,
});

const code = shallowRef(props.code);

// 计算拓展插件
const extensions = computed(() => {
  const result = [];
  if (props.language) {
    result.push(props.language());
  }
  if (props.theme) {
    result.push(props.theme);
  }
  return result;
});

// 监听代码变化
const handleChange = (codeValue: string) => {
  // console.log(codeValue);
  emitter.emit("code_change", codeValue);
};

onMounted(() => {
  watch(
    () => props.code,
    (_code) => {
      code.value = _code;
    }
  );
});
</script>

<style lang="scss" scoped>
@import "@/styles/variables_code_mirror.scss";

.editor {
  .divider {
    height: 1px;
    background-color: $border-color;
  }

  .main {
    display: flex;
    width: 100%;

    .code {
      width: 30%;
      height: 100px;
      margin: 0;
      padding: 0.4em;
      overflow: scroll;
      border-left: 1px solid $border-color;
      font-family: monospace;
    }
  }

  .footer {
    height: 3rem;
    padding: 0 1em;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 90%;

    .buttons {
      .item {
        margin-right: 1em;
        display: inline-flex;
        justify-content: center;
        align-items: center;
        background-color: transparent;
        border: 1px dashed $border-color;
        font-size: $font-size-small;
        color: $text-secondary;
        cursor: pointer;

        .iconfont {
          margin-left: $xs-gap;
        }

        &:hover {
          color: $text-color;
          border-color: $text-color;
        }
      }
    }

    .infos {
      .item {
        margin-left: 2em;
        display: inline-block;
        font-feature-settings: "tnum";
      }
    }
  }
}
</style>
