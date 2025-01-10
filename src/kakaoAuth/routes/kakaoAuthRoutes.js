const express = require('express');
const { handleKakaoCallback, logoutUser, deleteUserAccount } = require('../controllers/kakaoAuthController');
require('dotenv').config();

const router = express.Router();

router.use(express.json());

// 카카오 로그인 시작
router.get('/', (req, res) => {
    const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${process.env.KAKAO_REST_API_KEY}&redirect_uri=${process.env.REDIRECT_URI}`;
    res.redirect(kakaoAuthUrl);
});

// 카카오 로그인 콜백
router.get('/callback', handleKakaoCallback);

// 로그아웃
router.post('/logout', logoutUser);

// 회원탈퇴
router.delete('/delete', deleteUserAccount);

module.exports = router;