/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { JudgeCase } from './JudgeCase';
import type { JudgeConfig } from './JudgeConfig';
export type QuestionEditRequest = {
    content?: string;
    id?: number;
    judgeCase?: Array<JudgeCase>;
    judgeCaseUrl?: string;
    judgeConfig?: JudgeConfig;
    tags?: Array<string>;
    title?: string;
};

