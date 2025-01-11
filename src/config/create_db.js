const mysql = require('mysql2/promise'); // mysql2/promise 가져오기
require('dotenv').config();

// MySQL 풀 생성
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  multipleStatements: true,
  connectionLimit: 100,
});

async function initializeDatabase() {
    const createDatabase = `CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME};`;
  
    const createTables = `
      USE ${process.env.DB_NAME};

      CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      kakao_id BIGINT NOT NULL UNIQUE,
      name VARCHAR(100) NOT NULL,
      nickname VARCHAR(100),
      score BIGINT DEFAULT 0,
      achievements SET('achievement1', 'achievement2', 'achievement3'),
      access_token VARCHAR(255),
      refresh_token VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    `;

try {
    // 데이터베이스 생성
    await pool.query(createDatabase);
    console.log('Database created successfully.');

    // 테이블 생성
    await pool.query(createTables);
    console.log('Tables created successfully.');
  } catch (err) {
    console.error('Error during database initialization:', err.message);
  }
}

// 초기화 함수 실행
initializeDatabase();

module.exports = pool; // MySQL 풀 내보내기