const { getToken, getUserInfo, unlinkKakaoAccount } = require('../services/kakaoAuthService');
const { saveUser, deleteUser, updateLogout, saveRefreshToken } = require('../models/kakaoAuthModel');
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
        const tokenData = await getToken(code);
        console.log('Token data:', tokenData);

        const userInfo = await getUserInfo(tokenData.access_token);
        console.log('User info:', userInfo);
        
        await saveUser(userInfo);

        await saveRefreshToken(userInfo.id, tokenData.refresh_token);

        res.json({
            accessToken: tokenData.access_token,
            refreshToken: tokenData.refresh_token,
            expiresIn: tokenData.expires_in,
            userInfo,
        });

    } catch (err) {
        console.error('Error during Kakao login:', err.message);
        res.status(500).send('Kakao login failed');
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

    try {
        await unlinkKakaoAccount(accessToken);
        await deleteUser(kakaoId);
        await deleteRefreshToken(kakaoId);
        res.status(200).json({ message: '회원탈퇴 성공' });
    } catch (err) {
        console.error('Error during account deletion:', err.message);
        res.status(500).send('Account deletion failed');
    }
}


module.exports = { handleKakaoCallback, logoutUser, deleteUserAccount };