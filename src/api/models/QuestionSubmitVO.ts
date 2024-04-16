/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ResponseJudgeInfo } from './ResponseJudgeInfo';
import type { UserVO } from './UserVO';
export type QuestionSubmitVO = {
    code?: string;
    createTime?: string;
    id?: number;
    judgeInfo?: ResponseJudgeInfo;
    language?: string;
    questionId?: number;
    status?: number;
    title?: string;
    updateTime?: string;
    userId?: number;
    userVO?: UserVO;
};

