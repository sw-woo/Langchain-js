// how to use SimpleSequentialChain
import { config } from "dotenv";
config();

import { OpenAI } from "langchain/llms/openai";
import { PromptTemplate } from "langchain/prompts";
import { SimpleSequentialChain, LLMChain } from "langchain/chains";

//step1 openai 모델 선언부
const llm = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
	temperature: 0.7,
});

//step2 질문 선언부
const responseTemplate1 = `
당신은 '감사합니다' 응답 텍스트를 생성하는 유용한 봇입니다.
고객이 만족하지 못하는 경우 실제 상담원과 대화할 수 있는 기회를 제공하세요.
감정과 주제를 입력하고 평가하게 됩니다.

 text: {input}
`;

//step2 질문 선언부
const responseTemplate2 = `
당신은 보조 봇입니다. 당신의 임무는 고객이 자신의 말을 듣고 이해받는다는 느낌을 받는 것입니다.
당신이 받은 의견을 반영해보세요
 text: {input}
`;

//step3 프롬프트 템플릿 적용
const reviewPromptTemplate1 = new PromptTemplate({
	template: responseTemplate1,
	inputVariables: ["input"],
});

//step3 프롬프트 템플릿 적용
const reviewPromptTemplate2 = new PromptTemplate({
	template: responseTemplate2,
	inputVariables: ["input"],
});

//step4 객체에 모델과 프롬프트 넣어서 생성
const reviewChain1 = new LLMChain({ llm, prompt: reviewPromptTemplate1 });
const reviewChain2 = new LLMChain({ llm, prompt: reviewPromptTemplate2 });

//step5 SimpleSequentialChain 객체로 실행 진행하기
const overallChain = new SimpleSequentialChain({
	chains: [reviewChain1, reviewChain2],
	verbose: true,
});

//step6 연속 체인 실행 진행
const result = await overallChain.run({
	input: "내가 주문하였던 피자가 맛이 없습니다.",
});

//step7 결과 확인
console.log(result);
