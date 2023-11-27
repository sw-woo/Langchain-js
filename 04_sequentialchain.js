import { config } from "dotenv";
config();

import { OpenAI } from "langchain/llms/openai";
import { PromptTemplate } from "langchain/prompts";
import { LLMChain, SequentialChain } from "langchain/chains";

//step1 openai 모델 선언부
const llm = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
	temperature: 0.7,
});

//step2 질문 선언부 입력 변수 2개 설정
let template = `
 너가 주문하였던 {dish_name} 그리고 너가 경험하였던 {experience}. 리뷰를 작성해주세요! : 
`;

//step3 프롬프트 템플릿 적용
let promptTemplate = new PromptTemplate({
	template,
	inputVariables: ["dish_name", "experience"],
});

//step4 실행 체인 생성
const reviewChain = new LLMChain({
	llm,
	prompt: promptTemplate,
	outputKey: "review1",
});

//step2 질문 선언부 입력 변수 1개 설정
template = "음식점에 주어진 리뷰를: {review}, 후속 댓글을 작성해주세요!";

//step3 프롬프트 템플릿 적용
promptTemplate = new PromptTemplate({
	template,
	inputVariables: ["review"],
});
//step4 commentChain실행 체인 생성
const commentChain = new LLMChain({
	llm,
	prompt: promptTemplate,
	outputKey: "review2",
});

// template = "한문장으로 리뷰 요약 정리: \n\n {review}";

// promptTemplate = new PromptTemplate({
// 	template,
// 	inputVariables: ["review"],
// });

// const summaryChain = new LLMChain({
// 	llm,
// 	prompt: promptTemplate,
// 	outputKey: "요약",
// });

// template = "Translate the summary to korean: \n \n {summary}";
// promptTemplate = new PromptTemplate({
// 	template,
// 	inputVariables: ["summary"],
// });

// const translationChain = new LLMChain({
// 	llm,
// 	prompt: promptTemplate,
// 	outputKey: "korean_translate",
// });

const overallChain = new SequentialChain({
	// chains: [reviewChain, commentChain, summaryChain, translationChain],
	chains: [reviewChain, commentChain],
	inputVariables: ["dish_name", "experience", "review"],
	outputVariables: ["review1", "review2"],
});

const result = await overallChain.call({
	dish_name: "피자",
	experience: "맛있다.",
	review: "위 내용에 대한 리뷰를 해주세요!",
});

console.log(result);
