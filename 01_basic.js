//api key import를 위한 dotenv config(); 설정
import { config } from "dotenv";

//openai 라이브러리에서 설정과 api 부분 가져오기
import { OpenAI } from "openai";

config();
//openai 모델 선언부 temperature 속성은 0~1 까지의 값을 가질수 있고, 값이 낮으면 모델이 더 일관된 예측을 하게 되고 값이 높으면
//더 다양한 예측을 할 가능성이 있습니다.
const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
	temperature: 0.7,
});

// chat 비동기 함수 작성 4.0대 버전 반영
async function chat(input) {
	const messages = [{ role: "user", content: input }];

	const response = await openai.chat.completions.create({
		model: "gpt-3.5-turbo",
		messages: messages,
	});

	return response.choices[0].message;
}

// question 정의
const question = "오늘은 무엇을 행복하게 생각했는지 알려줘";

//chat 비동기 함수 호출 성공시 응답 메세지 출력 실패시 에러 출력
chat(question)
	.then((response) => console.log(response))
	.catch((error) => console.error(error));

//프롬프트 템플릿 사용 변수 설정
const promptTemplate = `질문에 대한 답변을 조금더 재미있고 성실하게 바꾸어주세요
질문: {question}`;

//{question} 부분 question 변수값 변환
const prompt = promptTemplate.replace("{question}", question);

//chat 비동기 함수 호출 성공시 응답 메세지 출력 실패시 에러 출력
chat(prompt)
	.then((response) => console.log(response))
	.catch((error) => console.error(error));
