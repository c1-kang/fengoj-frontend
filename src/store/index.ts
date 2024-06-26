import ModuleUser from "./User";
import imgLogo from "../assets/logo.png";
import ModuleLayout from "./Layout";

class ModuleStore {
  constructor() {
    console.log("%c ModuleStore init", "color: #409EFF");
  }

  /** 项目信息 */
  readonly projectInfo = {
    title: "风 OJ",
    name: "风 OJ",
    logo: imgLogo,
    link: "https://github.com/Travis-hjs/vue-admin",
  };

  /** `layout`状态模块 */
  readonly layout = new ModuleLayout();

  /** 用户状态模块 */
  readonly user = new ModuleUser();
}

/**
 * 状态管理模块
 * - `OOP`单例设计模式
 * - 参考 [你不需要`Vuex`](https://juejin.cn/post/6844903904023429128)
 */
const store = new ModuleStore();

export default store;