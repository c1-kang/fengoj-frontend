<script setup lang="ts">
import { onMounted, ref, watchEffect } from "vue";
import {
  Question,
  QuestionControllerService,
} from "@/api";
import message from "@arco-design/web-vue/es/message";
import { useRouter } from "vue-router";
import moment from "moment";

const tableRef = ref();

const dataList = ref([]);
const total = ref(0);
const searchParams = ref({
  title: "",
  tags: [],
  pageSize: 8,
  current: 1,
  level: undefined,
});

const loadData = async () => {
  const res = await QuestionControllerService.listQuestionVoByPageUsingPost(
    searchParams.value
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

// {id: "1", title: "A+ D", content: "新的题目内容", tags: "["二叉树"]", answer: "新的答案", submitNum: 0,…}

const columns = [
  {
    title: "题号",
    dataIndex: "id",
  },
  {
    title: "题目名称",
    dataIndex: "title",
  },
  {
    title: "难度",
    slotName: "level",
  },
  {
    title: "通过率",
    slotName: "acceptedRate",
  },
  {
    title: "创建时间",
    slotName: "createTime",
  },
  {
    slotName: "optional",
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
const toQuestionPage = (question: Question) => {
  router.push({
    path: `/q/${question.id}`,
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

<template>
  <div id="questionsView">
    <a-form :model="searchParams" layout="inline">
      <a-form-item field="title" label="名称" style="min-width: 240px">
        <a-input v-model="searchParams.title" placeholder="请输入名称" />
      </a-form-item>
      <a-form-item field="tags" label="标签" style="min-width: 240px">
        <a-input-tag v-model="searchParams.tags" placeholder="请输入标签" />
      </a-form-item>
      <a-form-item field="level" label="难度" style="min-width: 240px">
        <a-select v-model="searchParams.level" :style="{ width: '320px' }" placeholder="选择难度">
          <a-option label="全部" value="null">全部</a-option>
          <a-option label="简单" value="0">简单</a-option>
          <a-option label="中等" value="1">中等</a-option>
          <a-option label="困难" value="2">困难</a-option>
        </a-select>
      </a-form-item>
      <a-form-item>
        <a-button type="outline" @click="doSubmit">检索</a-button>
      </a-form-item>
    </a-form>
    <a-divider size="0" />
    <a-table :ref="tableRef" stripe :columns="columns" :data="dataList" :pagination="{
      showTotal: true,
      pageSize: searchParams.pageSize,
      current: searchParams.current,
      total,
    }" @page-change="onPageChange">
      <template #level="{ record }">
        <a-space wrap>
          <a-tag v-if="record.level == 0" :key="0" color="#00b42a">
            简单
          </a-tag>
          <a-tag v-else-if="record.level == 1" :key="1" color="#ff7d00">
            中等
          </a-tag>
          <a-tag v-else :key="2" color="#f53f3f"> 困难 </a-tag>
        </a-space>
      </template>
      <template #acceptedRate="{ record }">
        {{
        `${record.submitNum
        ? parseFloat(
        Number((100 * record.acceptedNum) / record.submitNum).toFixed(
        2
        )
        )
        : "0"
        }% (${record.acceptedNum}/${record.submitNum})`
        }}
      </template>
      <template #createTime="{ record }">
        {{ moment(record.createTime).format("YYYY-MM-DD") }}
      </template>
      <template #optional="{ record }">
        <a-space>
          <a-button @click="toQuestionPage(record)"> 做题 </a-button>
        </a-space>
      </template>
    </a-table>
  </div>
</template>

<style scoped>
#questionsView {
  max-width: 1280px;
  margin: 0 auto;
}
</style>