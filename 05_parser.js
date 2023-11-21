import { config } from "dotenv";
config();

import { OpenAI } from "langchain/llms/openai";
import { PromptTemplate } from "langchain/prompts";
import { StructuredOutputParser } from "langchain/output_parsers";

const parser = StructuredOutputParser.fromNamesAndDescriptions({
	answer: "answer to the user's question",
});

const formatInstructions = parser.getFormatInstructions();

const prompt = new PromptTemplate({
	template:
		"즐거운 질문 답변을 부탁합니다.\n{format_instructions} \n 질문: {question} ",
	inputVariables: ["question"],
	partialVariables: { format_instructions: formatInstructions },
});

const model = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
	temperature: 0.7,
});

const input = await prompt.format({
	question: "대한민국의 수도는?",
});
console.log(input);

const response = await model.call(input);
console.log(response);
console.log(await parser.parse(response));
