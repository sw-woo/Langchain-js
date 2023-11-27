import { config } from "dotenv";
config();

import { OpenAI } from "langchain/llms/openai";
import { PromptTemplate } from "langchain/prompts";
import { StructuredOutputParser } from "langchain/output_parsers";

// stpe1. parser 선언 설정
const parser = StructuredOutputParser.fromNamesAndDescriptions({
	answer: "answer to the user's question",
});
// JSON 포맷 구조
const formatInstructions = parser.getFormatInstructions();

//step2. 프롬프트 템플릿 설정
const prompt = new PromptTemplate({
	template:
		"Be very funny when answering questions\n{format_instructions} \n Question: {question} ",
	inputVariables: ["question"],
	partialVariables: { format_instructions: formatInstructions },
});

//step3. 모델 선언
const model = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
	temperature: 0.7,
});

//step4 inputVariables에 question 변수 넣기
const input = await prompt.format({
	question: "대한민국의 수도는?",
});
console.log(input);

const response = await model.call(input);

console.log("========json parse 최종 형태========\n");
console.log(response);

// console.log(await parser.parse(response));

//parser.parse()는 자바스크립트 오브젝트로 변환시켜주는 작업을 합니다.
const jsonResponse = await parser.parse(response);
console.log("======== 자바스크립트 오브젝트(객체) 형태========\n");
console.log(jsonResponse);
