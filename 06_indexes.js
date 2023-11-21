import { config } from "dotenv";
config();

import { TextLoader } from "langchain/document_loaders/fs/text";
import { CharacterTextSplitter } from "langchain/dist/text_splitter";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { FaissStore } from "langchain/vectorstores/faiss";

//step1. 데이터 가져오기 ./ 경로에 텍스트 파일 집어 넣기

const loader = new TextLoader("./");

const docs = await loader.load();

//step2. 문자데이터 split chunkSize 자르는 크기,chunkOverlap 자르는 부분에 공통영역 크기

const splitter = new CharacterTextSplitter({
	chunkSize: 200,
	chunkOverlap: 50,
});

const documents = await splitter.splitDocuments(docs);
console.log(documents);

//step3. 자른 문서데이터 임베딩

const embeddings = new OpenAIEmbeddings();

const vectorstore = await FaissStore.fromDocuments(documents, embeddings);
await vectorstore.save("./");
