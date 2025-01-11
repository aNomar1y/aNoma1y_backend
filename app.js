const express = require('express');
const cors = require('cors');
require('dotenv').config();


const kakaoAuthRoutes = require("./src/kakaoAuth/routes/kakaoAuthRoutes"); // 경로에 맞게 수정하세요
//const userRoutes = require('./src/users/routes/userRoutes')

require('dotenv').config();

const app = express();

app.use(cors({
    origin: 'http://localhost:3000', // 허용할 클라이언트의 출처
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], // 허용할 HTTP 메서드
    credentials: true, // 쿠키 인증 정보 허용
}));

app.use((req, res, next) => {
    console.log(`Incoming request: ${req.method} ${req.url}`);
    next();
  });

// Body-parser 설정
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 라우터 등록
// 카카오 로그인
app.use('/auth/kakao', kakaoAuthRoutes);

// //user 관리
// app.use('/users', userRoutes);

// // 정적 파일 제공 (사진 파일 접근 가능)
// const uploadDir = path.resolve(__dirname, "src/uploads");
// if (!fs.existsSync(uploadDir)) {
//     fs.mkdirSync(uploadDir, { recursive: true });
// }
// app.use("/uploads", express.static(uploadDir));

app.listen(process.env.PORT, () => {
    console.log(`서버가 http://localhost:${process.env.PORT} 에서 실행 중입니다.`);
  });