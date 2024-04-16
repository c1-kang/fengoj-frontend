<script lang="ts" setup>
import router from "@/router";
import { ref } from "vue";
import { useRoute } from "vue-router";

const navList = ref([
  {
    name: "首页",
    path: "/home",
  },
  {
    name: "题库",
    path: "/q",
  },
  {
    name: "比赛",
    path: "/cmp",
  },
  {
    name: "评测",
    path: "/s",
  },
]);

const route = useRoute();
const isActive = ref("");
if (route.path.includes("/q/")) {
  isActive.value = "/q";
}
for (const item of navList.value) {
  if (item.path.indexOf(route.path) != -1) {
    isActive.value = item.path;
    break;
  }
}

const pathTo = (path: string) => {
  isActive.value = path;
  router.push(path);
};
</script>

<template>
  <div class="menu-container">
    <div class="logo">风 OJ</div>
    <nav class="nav-options">
      <li
        v-for="item in navList"
        :key="item.name"
        :class="{ active: item.path === isActive }"
        @click="pathTo(item.path)"
      >
        {{ item.name }}
      </li>
    </nav>
    <div class="login-register">
      <button type="button">登录</button>
      <button type="button">注册</button>
    </div>
  </div>
</template>

<style scoped>
.menu-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.logo {
  font-size: 24px;
  color: #333;
  cursor: pointer;
  transition: color 0.3s ease;
}

.logo:hover {
  color: #007bff;
}

.active {
  color: #007bff;
  border-bottom: 2px solid #007bff;
}

.nav-options {
  display: flex;
  list-style: none;
  padding: 0;
  margin: 0;
}

.nav-options li {
  padding: 10px 15px;
  color: #333;
  text-decoration: none;
  transition: color 0.3s ease;
}

.nav-options li:hover {
  border-bottom: 2px solid #007bff50;
}

.login-register {
  display: flex;
}

.login-register button {
  background-color: #007bff;
  color: #fff;
  border: none;
  padding: 10px 20px;
  margin-left: 10px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.login-register button:hover {
  background-color: #0056b3;
}

/* 响应式设计：屏幕尺寸小于768px时，调整菜单布局 */
@media (max-width: 768px) {
  .menu-container {
    flex-direction: column;
  }

  .nav-options {
    flex-direction: column;
    width: 100%;
    padding: 0;
  }

  .nav-options li {
    text-align: center;
    padding: 10px 0;
  }

  .login-register {
    flex-direction: column;
    align-items: center;
    margin-top: 10px;
  }

  .login-register button {
    width: 100%;
    margin-left: 0;
    margin-bottom: 5px;
  }
}
</style>
