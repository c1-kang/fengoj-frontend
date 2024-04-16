/**
 * 用户信息
 */
export interface UserInfo {
  /** 用户`id` */
  id: number | string;
  /** 用户名 */
  userName: string;
  /**
   * 用户类型
   *
   * | string | 用户类型 |
   * | --- | --- |
   * | admin | 超级管理员 |
   * | user | 普通用户 |
   */
  userRole: string;
  /** 用户头像 */
  userAvatar: string;
}

/** 登录接口传参 */
export interface LoginParams {
  userAccount: string;
  userPassword: string;
}
