import { config } from "dotenv";
config();

import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { FaissStore } from "langchain/vectorstores/faiss";
import { OpenAI } from "langchain/llms/openai";
import { RetrievalQAChain, loadQAStuffChain } from "langchain/chains";

//step1. 텍스트 임베딩 부르기
const embeddings = new OpenAIEmbeddings();
//step2. 벡터 DB FaissStore 사용 선언
const vectorstore = await FaissStore.load("./", embeddings);

//step3. 모델 선언
const model = new OpenAI({ temperature: 0.5 });

//step4. 검색 Q,A chain 객체 선언
const chain = new RetrievalQAChain({
	// 모델 선언부분
	combineDocumentsChain: loadQAStuffChain(model),
	//검색 벡터 db 등록
	retriever: vectorstore.asRetriever(),
	//문서로 값을 돌려 주는 부분
	returnSourceDocuments: true,
});

// step5. RetrievalQAChain 비동기 실행 결고 res에 담기
const res = await chain.call({
	query: "when does the restaurant open on friday",
});

// step6. 결과 부분 출력
console.log(res.text);
