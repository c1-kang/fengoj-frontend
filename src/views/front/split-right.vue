<template>
  <div id="home">
    <div class="toolbar">
      <toolbar
        :config="config"
        :disabled="loading"
        :languages="Object.keys(languages)"
        :themes="Object.keys(themes)"
        @language="ensureLanguageCode"
      />
    </div>
    <div class="editor">
      <div class="loading-box" v-if="loading">
        <loading :color="color" />
      </div>
      <editor
        v-else-if="currentLangCode"
        :config="config"
        :theme="currentTheme"
        :language="currentLangCode.language"
        :code="currentLangCode.code"
      />
    </div>
    <div class="footer">
      <a-tabs
        default-active-key="1"
        @tab-click="tab_click"
        type="card"
        size="large"
        justify
        animation
      >
        <a-tab-pane key="1" title="自测输入">
          <div class="container">
            <div class="textarea">
              <textarea row="5" v-model="testForm.input"></textarea>
            </div>
          </div>
        </a-tab-pane>
        <a-tab-pane key="2">
          <template #title> <icon-play-arrow /> 自测运行 </template>
          <div class="test-success" v-if="testResult.status === 'Accepted'">
            <p>测试成功</p>
            <p>运行时间：{{ testResult.time }} ms</p>
            <p>内存消耗：{{ testResult.memory }} KB</p>
            <p>输出：{{ testResult.result }}</p>
          </div>
          <div class="test-error" v-else>
            <p>测试失败</p>
            <p>{{ testResult.errorMessage }}</p>
          </div>
        </a-tab-pane>
        <a-tab-pane key="3" title="切换视图"> </a-tab-pane>
        <a-tab-pane key="4" title="提交代码">
          <p>答案正确</p>
          <p>运行时间：{{ queryResultForm.time }} ms</p>
          <p>内存消耗：{{ queryResultForm.memory }} KB</p>
        </a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>

<style scoped>
.textarea {
  height: 21vh;
  border: 1px solid #d0d0d5;
  /* border-radius: 4px; */
  background-color: #fff;
}
.textarea > textarea {
  width: 100%;
  height: 100%;
  padding: 10px;
  line-height: 20px;
  border: 0 none;
  /* outline: 0 none; */
  outline-color: rgb(49, 147, 90);
  background: none;
  resize: none;
  box-sizing: border-box;
}
</style>

<script>
import {
  defineComponent,
  shallowRef,
  reactive,
  computed,
  onBeforeMount,
  ref,
  onUnmounted,
  onMounted,
} from "vue";
import { Codemirror } from "vue-codemirror";
import toolbar from "./vue-codemirror/toolbar.vue";
import loading from "@/components/common/loading.vue";
import editor from "./vue-codemirror/editor.vue";
import languages from "./vue-codemirror/languages";
import * as themes from "./vue-codemirror/themes";
import { CaretRight16Regular } from "@vicons/fluent";
import { QuestionControllerService } from "@/api";
import emitter from "@/utils/emitter";
import { message } from "@/utils/message";

export default defineComponent({
  components: {
    Codemirror,
    toolbar,
    editor,
    CaretRight16Regular,
  },
  props: {
    id: {
      type: Number,
    },
  },
  setup(props) {
    // 编辑器配置
    const config = reactive({
      disabled: false,
      indentWithTab: true,
      tabSize: 4,
      autofocus: true,
      height: "78vh",
      language: "cpp",
      theme: "oneDark",
    });

    // 语言代码映射
    const langCodeMap = reactive(new Map());
    const currentLangCode = computed(() => {
      return langCodeMap.get(config.language);
    });

    // 主题颜色
    const color = ref();
    const currentTheme = computed(() => {
      return themes[config.theme];
    });

    // 加载状态
    const loading = shallowRef(false);

    /**-----------测试相关 ---------------------------------------*/

    // 测试提交表单
    const testForm = ref({
      code: "",
      input: "",
      language: "",
      questionId: null,
    });

    // 自测返回表单
    const testResult = ref({
      errorMessage: "",
      memory: null,
      result: "",
      status: "",
      time: null,
    });

    // 测试提交
    const testJudge = async () => {
      const resp = await QuestionControllerService.testJudgeUsingPost(
        testForm.value
      );
      if (resp.code === 0) {
        testResult.value = resp.data;
      }
    };

    /**------------------------------------------------------------- */

    /**-----------提交相关 --------------------------------------------*/

    // 代码提交表单
    const submitForm = ref({
      code: "",
      language: "",
      questionId: null,
    });

    // 查询提交结果表单
    const queryResultForm = ref({
      status: "",
      memory: 0,
      time: 0,
    });

    // 查询提交结果
    const queryResult = async (submitId) => {
      const resp = await QuestionControllerService.getSubmitByIdUsingGet(
        submitId
      );
      if (resp.code === 0) {
        queryResultForm.value = resp.data.judgeInfo;
      } else {
        message.error("查询失败：" + resp.message);
      }
    };

    // 代码提交
    const submitCode = async () => {
      const resp = await QuestionControllerService.doQuestionSubmitUsingPost(
        submitForm.value
      );
      if (resp.code === 0) {
        console.log(resp.data);
        let submitId = resp.data;

        // 暂停2秒后查询结果
        await new Promise((resolve) => setTimeout(resolve, 2000));
        queryResult(submitId);
      } else {
        message.error("提交失败：" + resp.message);
      }
    };

    /**------------------------------------------------------------- */

    // Tabs 点击事件
    const tab_click = async (key) => {
      // 切换高度
      if (key === "3") {
        config.height === "78vh"
          ? (config.height = "55vh")
          : (config.height = "78vh");
      } else {
        config.height = "55vh";
      }

      if (key === "2") {
        // 自测输入
        testJudge();
      } else if (key === "4") {
        // 提交代码
        submitCode();
      }
    };

    // 切换语言
    const ensureLanguageCode = async (targetLanguage) => {
      // 代码语言设置
      config.language = targetLanguage;
      testForm.value.language = targetLanguage;
      submitForm.value.language = targetLanguage;

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

    // 组件加载完成后初始化
    onBeforeMount(() => {
      // init default language & code
      ensureLanguageCode(config.language);
      testForm.value.questionId = props.id;
      submitForm.value.questionId = props.id;
    });

    // 组件加载完成后监听事件
    onMounted(() => {
      // 监听代码改变事件
      emitter.on("code_change", (value) => {
        submitForm.value.code = value;
        testForm.value.code = value;
      });

      // 监听测试输入用例
      emitter.on("inputCase", (value) => {
        console.log(value);
        testForm.value.input = value;
      });
    });

    // 组件销毁时取消监听
    onUnmounted(() => {
      emitter.off("code_change");
      emitter.off("inputCase");
    });

    return {
      loading,
      color,
      config,
      languages,
      themes,
      currentLangCode,
      currentTheme,
      ensureLanguageCode,
      tab_click,
      testForm,
      testResult,
      queryResultForm,
    };
  },
});
</script>
