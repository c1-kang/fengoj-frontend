<template>
  <div id="addQuestionView">
    <h2>创建题目</h2>
    <a-form :model="form" label-align="left">
      <a-form-item field="title" label="标题">
        <a-input v-model="form.title" placeholder="请输入标题" />
      </a-form-item>
      <a-form-item field="level" label="难度">
        <a-select
          v-model="form.level"
          :style="{ width: '320px' }"
          placeholder="请选择难度"
        >
          <a-option :value="0">简单</a-option>
          <a-option :value="1">中等</a-option>
          <a-option :value="2">困难</a-option>
        </a-select>
      </a-form-item>
      <a-form-item field="tags" label="标签">
        <a-input-tag v-model="form.tags" placeholder="请选择标签" allow-clear />
      </a-form-item>
      <a-form-item field="content.questionDesc" label="题目描述">
        <MdEditor
          :value="form.content.questionDesc"
          :handle-change="questionDescChange"
        />
      </a-form-item>
      <a-form-item field="content.inputDesc" label="输入描述">
        <MdEditor
          :value="form.content.inputDesc"
          :handle-change="inputDescChange"
        />
      </a-form-item>
      <a-form-item field="content.outputDesc" label="输出描述">
        <MdEditor
          :value="form.content.outputDesc"
          :handle-change="outputDescChange"
        />
      </a-form-item>
      <a-form-item label="判题配置" :content-flex="false" :merge-props="false">
        <a-space direction="vertical" style="min-width: 480px">
          <a-form-item field="judgeConfig.timeLimit" label="时间限制">
            <a-input-number
              v-model="form.judgeConfig.timeLimit"
              placeholder="请输入时间限制"
              mode="button"
              min="0"
              size="large"
            />
          </a-form-item>
          <a-form-item field="judgeConfig.memoryLimit" label="内存限制">
            <a-input-number
              v-model="form.judgeConfig.memoryLimit"
              placeholder="请输入内存限制"
              mode="button"
              min="0"
              size="large"
            />
          </a-form-item>
          <a-form-item field="judgeConfig.stackLimit" label="堆栈限制">
            <a-input-number
              v-model="form.judgeConfig.stackLimit"
              placeholder="请输入堆栈限制"
              mode="button"
              min="0"
              size="large"
            />
          </a-form-item>
        </a-space>
      </a-form-item>
      <a-form-item field="content.judgeCase.input" label="输入样例">
        <MdEditor
          :value="form.judgeCase[0].input"
          :handle-change="judgeCaseInputChange"
        />
      </a-form-item>
      <a-form-item field="content.judgeCase.output" label="输出样例">
        <MdEditor
          :value="form.judgeCase[0].output"
          :handle-change="judgeCaseOutputChange"
        />
      </a-form-item>
      <div class="uploadFile">
        <span>上传判题样例，文件格式为压缩包</span>
        <a-upload :customRequest="customRequest" />
      </div>
      <div style="margin-top: 16px" />
      <a-form-item>
        <a-button
          type="primary"
          style="min-width: 200px"
          @click="doSubmit"
          :disabled="isFileUpload"
        >
          提交
        </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import MdEditor from "@/components/common/MdEditor.vue";
import { FileControllerService, QuestionControllerService } from "@/api";
import message from "@arco-design/web-vue/es/message";
import { useRoute } from "vue-router";

const route = useRoute();
// 如果页面地址包含 update，视为更新页面
const updatePage = route.path.includes("update");
const isFileUpload = ref(true);

let form = ref({
  title: "",
  tags: [],
  level: undefined,
  content: {
    questionDesc: "",
    inputDesc: "",
    outputDesc: "",
  },
  judgeConfig: {
    memoryLimit: 64,
    stackLimit: 1000,
    timeLimit: 1000,
  },
  judgeCase: [
    {
      input: "",
      output: "",
      desc: "",
    },
  ],
  judgeCaseUrl: "",
});

/**
 * 根据题目 id 获取老的数据
 */
const loadData = async () => {
  const id = route.query.id;
  if (!id) {
    return;
  }
  const res = await QuestionControllerService.getQuestionByIdUsingGet(
    id as any
  );
  if (res.code === 0) {
    form.value = res.data as any;
    // json 转 js 对象
    if (!form.value.judgeCase) {
      form.value.judgeCase = [
        {
          input: "",
          output: "",
          desc: "",
        },
      ];
    } else {
      form.value.judgeCase = JSON.parse(form.value.judgeCase as any);
    }
    if (!form.value.content) {
      form.value.content = {
        questionDesc: "",
        inputDesc: "",
        outputDesc: "",
      };
    } else {
      form.value.content = JSON.parse(form.value.content as any);
    }
    if (!form.value.judgeConfig) {
      form.value.judgeConfig = {
        memoryLimit: 1000,
        stackLimit: 1000,
        timeLimit: 1000,
      };
    } else {
      form.value.judgeConfig = JSON.parse(form.value.judgeConfig as any);
    }
    if (!form.value.tags) {
      form.value.tags = [];
    } else {
      form.value.tags = JSON.parse(form.value.tags as any);
    }
    isFileUpload.value = false;
  } else {
    message.error("加载失败，" + res.message);
  }
};

onMounted(() => {
  loadData();
});

const doSubmit = async () => {
  console.log(form.value);
  // 区分更新还是创建
  if (updatePage) {
    const res = await QuestionControllerService.updateQuestionUsingPost(
      form.value
    );
    if (res.code === 0) {
      alert("更新成功");
      message.success("更新成功");
    } else {
      message.error("更新失败，" + res.message);
    }
  } else {
    const res = await QuestionControllerService.addQuestionUsingPost(
      form.value
    );
    if (res.code === 0) {
      message.success("创建成功");
    } else {
      message.error("创建失败，" + res.message);
    }
  }
};

/**
 * 更改题目内容的值
 */
const questionDescChange = (value: string) => {
  form.value.content.questionDesc = value;
};
const inputDescChange = (value: string) => {
  form.value.content.inputDesc = value;
};
const outputDescChange = (value: string) => {
  form.value.content.outputDesc = value;
};
const judgeCaseInputChange = (value: string) => {
  form.value.judgeCase[0].input = value;
};
const judgeCaseOutputChange = (value: string) => {
  form.value.judgeCase[0].output = value;
};

const customRequest = async (option: any) => {
  const { onProgress, onError, onSuccess, fileItem, name } = option;
  const res = await FileControllerService.uploadFileUsingPost(
    "judge_case",
    fileItem.file
  );
  if (res.code === 0) {
    onSuccess(res.code);
    isFileUpload.value = false;
    form.value.judgeCaseUrl = res.data;
    window.location;
  }
};
</script>

<style scoped></style>
