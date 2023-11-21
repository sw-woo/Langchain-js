//dot env 환경설정
import { config } from "dotenv";
config();

//사용하는 모델 프롬프트템플릿 LLMChain 라이브러리(모듈) 선언
import { OpenAI } from "langchain/llms/openai";
import { PromptTemplate } from "langchain/prompts";
import { LLMChain } from "langchain/chains";

//openai 모델 선언부 temperature 속성은 0~1 까지의 값을 가질수 있고, 값이 낮으면 모델이 더 일관된 예측을 하게 되고 값이 높으면
//더 다양한 예측을 할 가능성이 있습니다.
const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
	temperature: 0.7,
});

//질문 템플릿 선언
const template = `
 질문에 대한 답변 \n Question: {question}
`;

// 프롬프트 템플릿 적용
const prompt = new PromptTemplate({ template, inputVariables: ["question"] });

//LLMChain 모델과 프롬프트 넣어서 생성
const chain = new LLMChain({ llm: openai, prompt });

// LLMChain 객체 생성 및 결과 반환
const result = await chain.call({
	question: "오늘 무슨 음식을 먹을지 추천해주세요!",
});

//결과 출력
console.log(result);
