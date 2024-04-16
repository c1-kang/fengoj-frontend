<script setup lang="ts">
import { QuestionControllerService, QuestionVO } from "@/api";
import ClipboardJS from "clipboard";
import { onMounted, ref } from "vue";
import message from "@arco-design/web-vue/es/message";
import MdViewer from "@/components/common/MdViewer.vue";
import emitter from "@/utils/emitter";

// 剪贴板操作
(function copyText() {
  var clipboard = new ClipboardJS(".btn-copy", {
    target: function (trigger) {
      return trigger.parentElement!.nextElementSibling!;
    },
  });
  clipboard.on("success", function (e) {
    e.trigger.innerHTML = "已复制";
    setTimeout(function () {
      e.trigger.innerHTML = "复制";
    }, 1000);
    e.clearSelection(); // 清除文本的选中状态
  });
  clipboard.on("error", function (e) {
    e.trigger.innerHTML = "复制失败";
    setTimeout(function () {
      e.trigger.innerHTML = "复制";
    }, 1000);
    e.clearSelection(); // 清除文本的选中状态
  });
})();

/** 获取题目数据 **/
interface Props {
  id: number;
}

const props = withDefaults(defineProps<Props>(), {
  id: () => 1,
});
const question = ref<QuestionVO>();
const loadData = async () => {
  const res = await QuestionControllerService.getQuestionVoByIdUsingGet(
    props.id
  );
  if (res.code === 0) {
    question.value = res.data;

    // 促发输入测试用例
    emitter.emit("inputCase", question.value?.judgeCase![0].input);
  } else {
    message.error("加载失败，" + res.message);
  }
};
onMounted(() => {
  loadData();
});
</script>

<template>
  <div id="split-left">
    <n-scrollbar style="max-height: 90vh">
      <div class="title">{{ question?.title }}</div>
      <hr />
      <div class="panel-content">
        时间限制: {{ question?.judgeConfig!.timeLimit! / 1000 ?? 0 }}s
        内存限制: {{ question?.judgeConfig!.memoryLimit! / 1000 ?? 0 }} MB
        提交: {{question?.submitNum ?? 0}} 
        解决: {{question?.acceptedNum ?? 0}} 
      </div>
      <div class="panel-body">
        <div class="panel_prob_header">
          <div class="panel-title">题目描述</div>
        </div>
        <div class="panel-content">
          <MdViewer :value="question?.content?.questionDesc" />
        </div>
      </div>
      <div class="panel-body">
        <div class="panel_prob_header">
          <div class="panel-title">输入格式</div>
        </div>
        <div class="panel-content">
          <MdViewer :value="question?.content!.inputDesc" />
        </div>
      </div>
      <div class="panel-body">
        <div class="panel_prob_header">
          <div class="panel-title">输出格式</div>
        </div>
        <div class="panel-content">
          <MdViewer :value="question?.content!.outputDesc" />
        </div>
      </div>
      <div class="panel-body">
        <div class="panel_prob_header">
          <div class="panel-title">样例输入</div>
          <button class="btn-copy">复制</button>
        </div>
        <div class="panel-content">{{ question?.judgeCase![0].input }}</div>
      </div>
      <div class="panel-body">
        <div class="panel_prob_header">
          <div class="panel-title">样例输出</div>
          <button class="btn-copy">复制</button>
        </div>
        <div class="panel-content">{{ question?.judgeCase![0].output }}</div>
      </div>
    </n-scrollbar>
  </div>
</template>

<style scoped>
#split-left {
  margin-right: 10px;
  margin-left: 10px;
}
.title {
  border-bottom: 5px solid #373ec8;
  margin: 10px auto;
  margin-bottom: 0;
  padding: 5px 16px;
  display: inline-block;
  font-size: 18px;
  font-weight: 700;
  line-height: 25.7143px;
}

.panel-body {
  border-bottom: 1px solid #ddd;
}

.panel_prob_header {
  padding: 5px 16px;
  background-color: #e5ecf9;
  border-left: 5px solid #373ec8;
  border-bottom: 1px solid #ddd;
  font-weight: bold;
  color: #444;
  font-size: 18px;
}

.panel-content {
  padding: 20px;
}

.panel-title {
  display: inline;
}

.btn-copy {
  padding: 2px 5px;
  font-size: 14px;
  line-height: 1.5;
  border-radius: 3px;
  background-color: #fff;
  text-align: center;
  cursor: pointer;
  float: right;
}

.btn-copy:hover {
  background-color: #f5f5f5;
}
</style>
