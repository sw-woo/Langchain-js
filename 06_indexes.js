import { config } from "dotenv";
config();

import { TextLoader } from "langchain/document_loaders/fs/text";

//랭체인 characterTextSplitter 선언
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";

//faissStore Facebook 메타에서 개발을 진행한 벡터 DB
import { FaissStore } from "langchain/vectorstores/faiss";

//step1. 데이터 가져오기 ./ 경로에 텍스트 파일 집어 넣기

const loader = new TextLoader("./restaurant.txt");

const docs = await loader.load();

//step2. 문자데이터 split chunkSize 자르는 크기,chunkOverlap 자르는 부분에 공통영역 크기

const splitter = new RecursiveCharacterTextSplitter({
	chunkSize: 200,
	chunkOverlap: 50,
});

const documents = await splitter.splitDocuments(docs);
console.log(documents);

//step3. 자른 문서데이터 임베딩 https://openai.com/blog/introducing-text-and-code-embeddings
const embeddings = new OpenAIEmbeddings();

//step4. 벡터DB FaissStore에 저장하기
const vectorstore = await FaissStore.fromDocuments(documents, embeddings);
await vectorstore.save("./");
