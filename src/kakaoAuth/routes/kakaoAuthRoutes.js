const express = require('express');
const { logoutUser, deleteUserAccount, updateAccessTokenInDB } = require('../controllers/kakaoAuthController');
require('dotenv').config();
const querystring = require("querystring");
const axios = require('axios');

const router = express.Router();

router.use(express.json());

router.post('/token', updateAccessTokenInDB);

// 카카오 로그인 시작
router.get('/', (req, res) => {
    const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${process.env.KAKAO_REST_API_KEY}&redirect_uri=${process.env.REDIRECT_URI}`;
    console.log(kakaoAuthUrl)
    res.redirect(kakaoAuthUrl);
});

// 카카오 로그인 콜백
router.get('/callback', async (req, res) => {
    const { code } = req.query;
  
    console.log("Authorization code:", code);
  
    if (!code) {
      return res.status(400).send("Authorization code not provided");
    }
  
    try {
      const tokenResponse = await axios.post(
        process.env.KAKAO_TOKEN_URI,
        querystring.stringify({
          grant_type: "authorization_code",
          client_id: process.env.KAKAO_REST_API_KEY,
          redirect_uri: process.env.REDIRECT_URI,
          code: code,
        }),
        {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        }
      );
  
      console.log("Token response:", tokenResponse.data);
  
      const { access_token, refresh_token } = tokenResponse.data;
  
      // 성공적으로 토큰 반환
      res.redirect(`http://localhost:3000/home?access_token=${access_token}`);
    } catch (error) {
      console.error("카카오 토큰 요청 실패:", error.message);
      if (error.response) {
        console.error("Response data:", error.response.data);
      }
      res.status(500).send("Failed to fetch Kakao token");
    }
  });


// 로그아웃
router.post('/logout', logoutUser);

// 회원탈퇴
router.delete('/delete', deleteUserAccount);

module.exports = router;