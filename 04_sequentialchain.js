import { config } from "dotenv";
config();

import { OpenAI } from "langchain/llms/openai";
import { PromptTemplate } from "langchain/prompts";
import { LLMChain, SequentialChain } from "langchain/chains";

const llm = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

let template = `
 너가 주문하였던 {dish_name} 그리고 너가 경험하였던 {experience}. 리뷰를 작성해주세요! : 
`;

let promptTemplate = new PromptTemplate({
	template,
	inputVariables: ["dish_name", "experience"],
});

const reviewChain = new LLMChain({
	llm,
	prompt: promptTemplate,
	outputKey: "리뷰를",
});

template = "음식점에 주어진 리뷰를: {리뷰를}, 후속 댓글을 작성해주세요!";

promptTemplate = new PromptTemplate({
	template,
	inputVariables: ["리뷰를"],
});

const commentChain = new LLMChain({
	llm,
	prompt: promptTemplate,
	outputKey: "댓글을",
});

template = "한문장으로 리뷰 요약 정리: \n\n {review}";

promptTemplate = new PromptTemplate({
	template,
	inputVariables: ["review"],
});

const summaryChain = new LLMChain({
	llm,
	prompt: promptTemplate,
	outputKey: "요약",
});

template = "Translate the summary to korean: \n \n {summary}";
promptTemplate = new PromptTemplate({
	template,
	inputVariables: ["summary"],
});

const translationChain = new LLMChain({
	llm,
	prompt: promptTemplate,
	outputKey: "korean_translate",
});

const overallChain = new SequentialChain({
	chains: [reviewChain, commentChain, summaryChain, translationChain],
	inputVariables: ["dish_name", "experience"],
	outputVariables: ["리뷰를", "댓글을", "요약", "korean_translate"],
});

const result = await overallChain.call({
	dish_name: "피자",
	experience: "맛있다.",
});

console.log(result);
