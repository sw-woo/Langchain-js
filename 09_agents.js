//llm ReAct (Reason+Act) 추로하고 행동하고  조금더 자세히는
//생각하고(Thought) -> 행동하고(Act) -> 관찰하고(observe)를 해답을 얻을때까지 무제한 반복을 진행합니다.
import { config } from "dotenv";
config();

import { ChatOpenAI } from "langchain/chat_models/openai";
import { initializeAgentExecutorWithOptions } from "langchain/agents";
import { Calculator } from "langchain/tools/calculator";

process.env.LANGCHAIN_HANDLER = "langchain";

const model = new ChatOpenAI({
	apiKey: process.env.OPENAI_API_KEY,
	temperature: 0.7,
});
const tools = [new Calculator()];

const executor = await initializeAgentExecutorWithOptions(tools, model, {
	agentType: "chat-conversational-react-description",
	verbose: true,
});

const input0 = "지수는 무엇인지 알려주세요! ";

const result0 = await executor.call({ input: input0 });

console.log(result0);

// const input1 = "3000나누기 300은 무엇일까요?";

// const result1 = await executor.call({ input: input1 });

// console.log(result1);
