const axios = require('axios');
require('dotenv').config();

const kakaoRestApiKey = process.env.KAKAO_REST_API_KEY;
const redirectUri = process.env.REDIRECT_URI;

async function getToken(code) {
    try {
        const response = await axios.post('https://kauth.kakao.com/oauth/token', null, {
            params: {
                grant_type: 'authorization_code',
                client_id: kakaoRestApiKey,
                redirect_uri: redirectUri,
                code,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching token:', error.message);
        throw new Error('Failed to fetch token');
    }
}


// Access Token으로 사용자 정보 가져오기
async function getUserInfo(accessToken) {
    const response = await axios.get('https://kapi.kakao.com/v2/user/me', {
        headers: { Authorization: `Bearer ${accessToken}` },
    });
    return response.data;
}

// Access Token으로 회원탈퇴 처리 (Unlink)
async function unlinkKakaoAccount(accessToken) {
    const response = await axios.post('https://kapi.kakao.com/v1/user/unlink', null, {
        headers: { Authorization: `Bearer ${accessToken}` },
    });
    return response.data;
}


module.exports = { getToken, getUserInfo, unlinkKakaoAccount };