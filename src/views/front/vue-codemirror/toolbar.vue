<template>
  <div class="toolbar">
    <div class="item">
      <label for="language">语言:</label>
      <div class="select" style="width: 150px">
        <n-space vertical>
          <n-select
            v-model:value="config.language"
            :options="options"
            @update:value="handleSelectLanguage(config.language)"
          />
        </n-space>
      </div>
    </div>
    <div class="item">
      <label for="theme">主题:</label>
      <div class="select" style="width: 150px">
        <n-space vertical>
          <n-select v-model:value="config.theme" :options="themesOptions" />
        </n-space>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, toRefs } from "vue";
export default defineComponent({
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    config: {
      type: Object,
      required: true,
    },
    languages: {
      type: Array as PropType<Array<string>>,
      required: true,
    },
    themes: {
      type: Array as PropType<Array<string>>,
      required: true,
    },
  },
  methods: {
    handleSelectLanguage(language: string) {
      this.$emit("language", language);
    },
  },
  setup(props) {
    const { languages } = props;
    const options = ref<Array<{ label: string; value: string }>>([]);
    for (let language of languages) {
      options.value.push({ label: language, value: language });
    }

    const { themes } = props;
    const themesOptions = ref<Array<{ label: string; value: string }>>([]);
    for (let theme of themes) {
      themesOptions.value.push({ label: theme, value: theme });
    }

    return {
      options,
      themesOptions,
    };
  },
});
</script>

<style lang="scss" scoped>
@import "@/styles/variables.scss";

.toolbar {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  height: 3rem;
  padding: 0 1em;

  .item {
    display: inline-flex;
    align-items: center;
    margin-right: 2em;

    label {
      display: inline-block;
      margin-right: 0.5em;
    }
  }
}
</style>
