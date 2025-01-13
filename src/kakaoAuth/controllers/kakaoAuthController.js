const axios = require('axios');
const querystring = require("querystring");


const { getToken, getUserInfo, unlinkKakaoAccount } = require('../services/kakaoAuthService');
const { saveUser, deleteUser, updateLogout, saveAccessToken, saveRefreshToken, deleteRefreshToken } = require('../models/kakaoAuthModel');
require('dotenv').config();

async function handleKakaoCallback(req, res) {
    console.log('Full request URL:', req.protocol + '://' + req.get('host') + req.originalUrl); // 요청 URL 로그 추가
    console.log('Query parameters:', req.query); // 전체 쿼리 매개변수 로그 추가

    const code = req.query.code;

    if (!code) {
        console.error('Authorization code is missing');
        return res.status(400).send('Authorization code is missing');
    }

    console.log('Authorization code:', code);

    try {
        // Access Token 요청
        const tokenResponse = await axios.post(
            process.env.KAKAO_TOKEN_URI,
            querystring.stringify({
              grant_type: "authorization_code",
              client_id: process.env.KAKAO_REST_API_KEY,
              redirect_uri: process.env.REDIRECT_URI,
              code: code,
            }),
            { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
          );

          const { access_token } = tokenResponse.data;

          // 토큰 저장 후 프론트엔드로 리다이렉트
          res.status(200).json({ access_token });
        } catch (error) {
          console.error("카카오 토큰 요청 실패:", error.message);
          res.status(500).send("카카오 인증 실패");
        }
}


// 로그아웃 처리
async function logoutUser(req, res) {
    const { kakaoId } = req.body;

    try {
        await updateLogout(kakaoId);
        await deleteRefreshToken(kakaoId);
        res.status(200).json({ message: '로그아웃 성공' });
    } catch (err) {
        console.error('Error during logout:', err.message);
        res.status(500).send('Logout failed');
    }
}

// 회원탈퇴 처리
async function deleteUserAccount(req, res) {
    const { kakaoId, accessToken } = req.body;
    console.log(req.body);

    try {
        console.log('deleteUserAccount', accessToken)
        await unlinkKakaoAccount(accessToken);
        console.log('unlinkKakaoAccount')
        await deleteUser(kakaoId);
        console.log('deleteUser')
        await deleteRefreshToken(kakaoId);
        console.log('deleteRefreshToken')
        res.status(200).json({ message: '회원탈퇴 성공' });
    } catch (err) {
        console.error('Error during account deletion:', err.message);
        res.status(500).send('Account deletion failed');
    }
}

async function updateAccessTokenInDB(req, res) {
    const { kakaoId, accessToken } = req.body;
    console.log('Request body:', req.body);
    if (!kakaoId || !accessToken) {
        return res.status(400).json({ error: 'Access token is missing' });
    }

    try {
        // 여기에서 kakao_id는 사용자 인증 정보에서 추출해야 함
        await saveAccessToken(kakaoId, accessToken);
        res.status(200).json({ message: 'Access token updated successfully' });
    } catch (error) {
        console.error('Error updating access token:', error.message);
        res.status(500).json({ error: 'Failed to update access token' });
    }
}


module.exports = { logoutUser, deleteUserAccount, updateAccessTokenInDB };