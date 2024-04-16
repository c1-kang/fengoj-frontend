<template>
  <div id="home">
    首页
  </div>
</template>

<style scoped></style>

<script>
import {
  defineComponent,
  shallowRef,
  reactive,
  computed,
  onBeforeMount,
} from "vue";
import { Codemirror } from "vue-codemirror";
import toolbar from "./vue-codemirror/toolbar.vue";
import loading from "@/components/common/loading.vue";
import editor from "./vue-codemirror/editor.vue";
import languages from "./vue-codemirror/languages";
import * as themes from "./vue-codemirror/themes";

export default defineComponent({
  components: {
    Codemirror,
    toolbar,
    editor,
  },
  setup() {
    const config = reactive({
      disabled: false,
      indentWithTab: true,
      tabSize: 4,
      autofocus: true,
      height: "100vh",
      language: "javascript",
      theme: "oneDark",
    });

    const langCodeMap = reactive(new Map());
    const currentLangCode = computed(() => {
      return langCodeMap.get(config.language);
    });
    const currentTheme = computed(() => {
      return themes[config.theme];
    });

    const loading = shallowRef(false);

    const ensureLanguageCode = async (targetLanguage) => {
      config.language = targetLanguage;
      loading.value = true;
      const delayPromise = () =>
        new Promise((resolve) => window.setTimeout(resolve, 260));
      if (langCodeMap.has(targetLanguage)) {
        await delayPromise();
      } else {
        const [result] = await Promise.all([
          languages[targetLanguage](),
          delayPromise(),
        ]);
        console.log("result", result.default);
        langCodeMap.set(targetLanguage, result.default);
      }
      loading.value = false;
    };

    loading.value = true;
    onBeforeMount(() => {
      // init default language & code
      ensureLanguageCode(config.language);
    });

    return {
      loading,
      config,
      languages,
      themes,
      currentLangCode,
      currentTheme,
      ensureLanguageCode,
    };
  },
});
</script>
