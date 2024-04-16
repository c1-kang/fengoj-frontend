/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { JudgeCase } from './JudgeCase';
import type { JudgeConfig } from './JudgeConfig';
import type { QuestionContent } from './QuestionContent';
export type QuestionUpdateRequest = {
    content?: QuestionContent;
    id?: number;
    judgeCase?: Array<JudgeCase>;
    judgeCaseUrl?: string;
    judgeConfig?: JudgeConfig;
    level?: number;
    tags?: Array<string>;
    title?: string;
};

