import { config } from "dotenv";
config();

import { ConversationChain } from "langchain/chains";

// https://js.langchain.com/docs/modules/model_io/models/chat/ 참조 문서
import { ChatOpenAI } from "langchain/chat_models/openai";
import {
	ChatPromptTemplate,
	HumanMessagePromptTemplate,
	SystemMessagePromptTemplate,
	MessagesPlaceholder,
} from "langchain/prompts";

import { BufferMemory } from "langchain/memory";

// 원하는 결과 값은 ConversationChain 에 memory 기능을 같이 사용하여서 이전에 물어본 대화와 맥락이 이어지는지 결과 값을 확인하는 과정입니다.

// stpe1 ChatOpenAI 모델 선언
const chat = new ChatOpenAI({
	apiKey: process.env.OPENAI_API_KEY,
	temperature: 0.7,
});

//System Template prompt 정의
const message = SystemMessagePromptTemplate.fromTemplate(
	"인간과 사람 사이의 의사소통 대화를 친근하게 제공해주세요!"
);

//메세지 메모리 저장 키워드 생성
const messagePlaceholder = new MessagesPlaceholder("history");

// chat Prompt Template 정의  System Template prompt , HumanMessagePromptTemplate.fromTemplate("{input}") 질문 input 변수 선언
// 메세지 메모리 저장 키워드 등록
const chatPrompt = ChatPromptTemplate.fromMessages([
	message,
	HumanMessagePromptTemplate.fromTemplate("{input}"),
	messagePlaceholder,
]);

// ConversationChain 생성 진행 Memory 저장 진행
const chain = new ConversationChain({
	memory: new BufferMemory({ returnMessages: true, memoryKey: "history" }),
	prompt: chatPrompt,
	llm: chat,
});

//나라 이름을 바꾸어 보면서 테스트를 진행해 보세용!
const response = await chain.call({
	input: "일본의 맛집에 음식 종류는 어떤게 있을까? 그리고 일본에서 유명한 곳은?",
});

const response2 = await chain.call({
	input: "여기서 제일 아름답고 근사한 장소는 어디야?",
});

console.log(response2);
