const pool = require('../../config/create_db');
require('dotenv').config();


async function saveUser(userInfo) {
    console.log('Saving user info:', userInfo);
    const { id, properties, access_token } = userInfo;
    const nickname = properties?.nickname || null;

    const query = `
        INSERT INTO users (kakao_id, name, nickname, access_token)
        VALUES (?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
        name = VALUES(name),
        nickname = VALUES(nickname),
        access_token = VALUES(access_token)
    `;

    await pool.query(query, [id, nickname, nickname, access_token]);
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

// model.js에 추가
async function deleteRefreshToken(kakaoId) {
    const query = `
        UPDATE users
        SET refresh_token = NULL
        WHERE kakao_id = ?
    `;
    await pool.query(query, [kakaoId]);
}



module.exports = { saveUser, updateLogout, deleteUser, saveRefreshToken, deleteRefreshToken };