const pool = require('../../config/create_db');
require('dotenv').config();


async function saveUser(userInfo) {
    console.log('Saving user info:', userInfo);
    const { id, properties } = userInfo;
    const nickname = properties?.nickname || null;

    const query = `
        INSERT INTO users (kakao_id, name)
        VALUES (?, ?)
        ON DUPLICATE KEY UPDATE
        name = VALUES(name)
    `;

    await pool.query(query, [id, nickname]);
}

// 로그아웃 처리 (토큰 무효화)
async function updateLogout(kakaoId) {
    const query = `UPDATE users SET access_token = NULL WHERE kakao_id = ?`;
    await pool.query(query, [kakaoId]);
}

// 회원탈퇴 처리
async function deleteUser(kakaoId) {
    const query = `DELETE FROM users WHERE kakao_id = ?`;
    await pool.query(query, [kakaoId]);
}

// refresh token 저장
async function saveRefreshToken(kakaoId, refreshToken) {
    const query = `
        UPDATE users
        SET refresh_token = ?
        WHERE kakao_id = ?
    `;
    const [result] = await pool.query(query, [refreshToken, kakaoId]);
    return result;
}

// refresh token 저장
async function saveAccessToken(kakaoId, accessToken) {
    const query = `
        UPDATE users
        SET access_token = ?
        WHERE kakao_id = ?
    `;
    const [result] = await pool.query(query, [accessToken, kakaoId]);
    console.log('Saving access token:', result);
    return result;
}

// model.js에 추가
async function deleteRefreshToken(kakaoId) {
    const query = `
        UPDATE users
        SET refresh_token = NULL
        WHERE kakao_id = ?
    `;
    await pool.query(query, [kakaoId]);
}


async function deleteRecords(kakaoId) {
    const query = `
        DELETE FROM records WHERE kakao_id = ?
    `;

    await pool.query(query, [kakaoId]);
}


module.exports = { deleteRecords, saveAccessToken, saveUser, updateLogout, deleteUser, saveRefreshToken, deleteRefreshToken };