// how to use SimpleSequentialChain
import { config } from "dotenv";
config();

import { OpenAI } from "langchain/llms/openai";
import { PromptTemplate } from "langchain/prompts";
import { SimpleSequentialChain, LLMChain } from "langchain/chains";

const llm = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const responseTemplate1 = `
 너는 음답 문구에서 고객이 감사한지 불편한지를 감지하는 로봇이야.
 너에게 주어지는 문장에서 감정과 주제를 input and evalute 로 바꾸어주세요.

 text: {input}
`;

const responseTemplate2 = `
 너는 어시스터트 로봇이야 너의 일은 고객의 목소리를 듣고 이해하는거야 
 너가 받은 input 값을 반영해주세요! 
 text: {input}
`;

const reviewPromptTemplate1 = new PromptTemplate({
	template: responseTemplate1,
	inputVariables: ["input"],
});

const reviewPromptTemplate2 = new PromptTemplate({
	template: responseTemplate2,
	inputVariables: ["input"],
});

const reviewChain1 = new LLMChain({ llm, prompt: reviewPromptTemplate1 });
const reviewChain2 = new LLMChain({ llm, prompt: reviewPromptTemplate2 });

const overallChain = new SimpleSequentialChain({
	chains: [reviewChain1, reviewChain2],
	verbose: true,
});

const result = await overallChain.run({
	input: "내가 주문했던 파인애플 하와이안 피자는 매우 맛이 없었습니다.",
});
console.log(result);
