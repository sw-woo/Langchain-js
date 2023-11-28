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
 너는 음답 문구에서 고객의 감정을 감지하는 로봇이야.
 너에게 주어지는 문장에서 고객의 감정을 분석해서 말해주세요!

 문구: {input}
`;

//step2 질문 선언부
const responseTemplate2 = `
 너는 어시스터트 로봇이야 너의 일은 고객의 목소리를 듣고 이해하는거야 
 너가 받은 input 값에 감정을 분석해서 알려주세요!
 문구: {input}
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
	verbose: false,
});

//step6 연속 체인 실행 진행
const result = await overallChain.run({
	input: "어제 주문하였던 옷들은 전부 별로인것 같아요.",
	input: "어제 주문하였던 옷들은 너무 좋았던것 같아요.",
});

//step7 결과 확인
console.log(result);
