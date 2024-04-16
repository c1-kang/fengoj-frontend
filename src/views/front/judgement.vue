<template>
  <div id="questionSubmitView">
    <a-form :model="searchParams" layout="inline">
      <a-form-item field="questionId" label="题号" style="min-width: 240px">
        <a-input v-model="searchParams.questionId" placeholder="请输入" />
      </a-form-item>
      <a-form-item field="language" label="编程语言" style="min-width: 240px">
        <a-select
          v-model="searchParams.language"
          :style="{ width: '320px' }"
          placeholder="选择编程语言"
        >
          <a-option>java</a-option>
          <a-option>cpp</a-option>
          <a-option>go</a-option>
          <a-option>python</a-option>
        </a-select>
      </a-form-item>
      <a-form-item>
        <a-button type="outline" @click="doSubmit">搜索</a-button>
      </a-form-item>
    </a-form>
    <a-divider :size="0" />
    <a-table
      :ref="tableRef"
      :columns="columns"
      :data="dataList"
      :pagination="{
        showTotal: true,
        pageSize: searchParams.pageSize,
        current: searchParams.current,
        total,
      }"
      @page-change="onPageChange"
    >
      <template #judgeInfo="{ record }">
        <div v-if="record.judgeInfo.status === 'Accepted'">
          <router-link :to="'/view/code/' + record.id" style="color: #0dd874"
            >Accepted</router-link
          >
        </div>
        <div v-else-if="record.judgeInfo.status === 'WrongAnswer'">
          <router-link :to="'/view/code/' + record.id" style="color: #ff443e">
            WrongAnswer
          </router-link>
        </div>
        <div v-else>
          <router-link :to="'/view/code/' + record.id">{{
            record.judgeInfo.status
          }}</router-link>
        </div>
      </template>
      <template #judgeTime="{ record }">
        {{ record.judgeInfo.time ? record.judgeInfo.time : 0 }}ms
      </template>
      <template #title="{ record }">
        <router-link :to="'/q/' + record.questionId">{{
          record.title
        }}</router-link>
      </template>
      <template #createTime="{ record }">
        {{ moment(record.createTime).format("YYYY-MM-DD HH:mm") }}
      </template>
      <template #userInfo="{ record }">
        <router-link :to="'/view/user/' + record.userId">{{
          record.userVO.userAccount
        }}</router-link>
      </template>
    </a-table>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watchEffect } from "vue";
import { QuestionControllerService, QuestionQuerySubmitRequest } from "@/api";
import message from "@arco-design/web-vue/es/message";
import { useRouter } from "vue-router";
import moment from "moment";

const tableRef = ref();

const dataList = ref([]);
const total = ref(0);
const searchParams = ref<QuestionQuerySubmitRequest>({
  questionId: undefined,
  language: undefined,
  pageSize: 10,
  current: 1,
});

/**
 * 加载数据
 */
const loadData = async () => {
  const res = await QuestionControllerService.listQuestionSubmitByPageUsingPost(
    {
      ...searchParams.value,
      sortField: "createTime",
      sortOrder: "descend",
    }
  );
  if (res.code === 0) {
    dataList.value = res.data.records;
    total.value = res.data.total;
  } else {
    message.error("加载失败，" + res.message);
  }
};

/**
 * 监听 searchParams 变量，改变时触发页面的重新加载
 */
watchEffect(() => {
  loadData();
});

/**
 * 页面加载时，请求数据
 */
onMounted(() => {
  loadData();
});

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

const onPageChange = (page: number) => {
  searchParams.value = {
    ...searchParams.value,
    current: page,
  };
};

const router = useRouter();

/**
 * 跳转到做题页面
 * @param question
 */
const toQuestionPage = (questionId: number) => {
  router.push({
    path: `/q/${questionId}`,
  });
};

/**
 * 确认搜索，重新加载数据
 */
const doSubmit = () => {
  // 这里需要重置搜索页号
  searchParams.value = {
    ...searchParams.value,
    current: 1,
  };
};
</script>

<style scoped>
#questionSubmitView {
  max-width: 1280px;
  margin: 0 auto;
}
</style>
