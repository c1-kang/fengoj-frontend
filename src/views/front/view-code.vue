<script setup>
import { QuestionControllerService } from "@/api";
import moment from "moment";
import message from "@arco-design/web-vue/es/message";
import { useRoute } from "vue-router";
import { onMounted, ref } from "vue";
import hljs from "highlight.js/lib/core";
import cpp from "highlight.js/lib/languages/cpp";
import java from "highlight.js/lib/languages/java";
import python from "highlight.js/lib/languages/python";

const route = useRoute();

// 路由参数
const submitId = ref(Number(route.path.split("/")[3]));

// 列表配置
const tableRef = ref();
const columns = [
  {
    title: "运行ID",
    dataIndex: "id",
  },
  {
    title: "编程语言",
    dataIndex: "language",
  },
  {
    title: "运行结果",
    slotName: "judgeInfo",
  },
  {
    title: "运行时间",
    slotName: "judgeTime",
  },
  {
    title: "运行内存",
    slotName: "judgeMemory",
  },
  {
    title: "题目名",
    slotName: "title",
  },
  {
    title: "提交者",
    slotName: "userInfo",
  },
  {
    title: "提交时间",
    slotName: "createTime",
  },
];

// 查询返回表单
const queryResultForm = ref([]);

// 表格加载状态
const loading = ref(true);

// 是否编译错误
const error = ref(false);

// 查询提交结果
const queryResult = async () => {
  const resp = await QuestionControllerService.getSubmitByIdUsingGet(
    submitId.value
  );
  if (resp.code === 0) {
    let temp = [];
    temp.push(resp.data);
    queryResultForm.value = temp;

    // 编译错误状态改变
    if (temp[0].judgeInfo.status === "CompileError") {
      error.value = true;
    }

    // 动态加载语言
    if (temp[0].language === "cpp") {
      hljs.registerLanguage("cpp", cpp);
    } else if (temp[0].language === "java") {
      hljs.registerLanguage("java", java);
    } else if (temp[0].language === "python") {
      hljs.registerLanguage("python", python);
    }

    loading.value = false;
  } else {
    message.error("查询失败：" + resp.message);
  }
};

// 复制代码
const copyCode = () => {
  navigator.clipboard.writeText(queryResultForm.value[0].code).then(
    () => {
      let copyBtn = document.querySelector(".copy-btn");
      copyBtn.innerText = "复制成功";
      setTimeout(() => {
        copyBtn.innerText = "复制";
      }, 2000);
    },
    () => {
      let copyBtn = document.querySelector(".copy-btn");
      copyBtn.innerText = "复制失败";
      setTimeout(() => {
        copyBtn.innerText = "复制";
      }, 2000);
    }
  );
};

onMounted(() => {
  queryResult();
});
</script>

<template>
  <div id="view-code">
    <a-table
      :ref="tableRef"
      :columns="columns"
      :data="queryResultForm"
      :bordered="false"
      :loading="loading"
      :pagination="false"
    >
      <template #judgeInfo="{ record }">
        {{ record.judgeInfo.status }}
      </template>
      <template #judgeTime="{ record }">
        {{ record.judgeInfo.time ? record.judgeInfo.time : 0 }}ms
      </template>
      <template #judgeMemory="{ record }">
        {{ record.judgeInfo.memory ? record.judgeInfo.memory : 0 }}kb
      </template>
      <template #userInfo="{ record }">
        <router-link :to="'/view/user/' + record.userId">{{
          record.userVO.userAccount
        }}</router-link>
      </template>
      <template #title="{ record }">
        <router-link :to="'/q/' + record.questionId">{{
          record.title
        }}</router-link>
      </template>
      <template #createTime="{ record }">
        {{ moment(record.createTime).format("YYYY-MM-DD HH:mm") }}
      </template>
    </a-table>
    <div class="show" v-if="!loading">
      <n-config-provider :hljs="hljs">
        <n-code
          :code="queryResultForm[0].code"
          :language="queryResultForm[0].language"
          show-line-numbers
        />
        <button class="copy-btn" @click="copyCode">复制</button>
      </n-config-provider>
    </div>

    <div class="show" v-if="!loading && error">
      <n-config-provider :hljs="hljs">
        <n-code
          :code="queryResultForm[0].judgeInfo.errorMessage"
          :language="queryResultForm[0].language"
          show-line-numbers
        />
      </n-config-provider>
    </div>
  </div>
</template>

<style scoped>
.view-code {
  margin-top: 20px;
}

.show {
  border: 1px solid;
  padding: 20px;
  border-radius: 5px;
  margin-top: 20px;
  position: relative;
  border-color: green;
}

.copy-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 5px;
  cursor: pointer;
  border: 1px solid green;
  border-radius: 5px;
}

.copy-btn:hover {
  background-color: green;
  color: white;
}
</style>
