import { config } from "dotenv";
config();
import { BabyAGI } from "langchain/experimental/babyagi";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { OpenAI } from "langchain/llms/openai";

const vectorStore = new MemoryVectorStore(new OpenAIEmbeddings());

const babyAGI = BabyAGI.fromLLM({
	llm: new OpenAI({
		apiKey: process.env.OPENAI_API_KEY,
		temperature: 0.7,
	}),
	vectorstore: vectorStore,
	maxIterations: 10,
});

await babyAGI.call({
	objective: "소설관련 블로그를 5개만 작성해주세요! translate to korean",
});
