import { BaseBedrockInput } from "../../util/bedrock.js";
import { BaseLLMParams } from "../base.js";
import { Bedrock as BaseBedrock } from "./web.js";
export declare class Bedrock extends BaseBedrock {
    static lc_name(): string;
    constructor(fields?: Partial<BaseBedrockInput> & BaseLLMParams);
}
