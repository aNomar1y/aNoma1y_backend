const pool = require('../../config/create_db');
require('dotenv').config();

async function recordUserAnomaly(kakao_id, cctv_id, anomaly_id) {
    const query = `
            INSERT INTO records (kakao_id, cctv_id, anomaly_id)
            VALUES (?, ?, ?)
            `;

    const [rows] = await pool.query(query, [kakao_id, cctv_id, anomaly_id]);
    
    return rows;
}

async function viewUserAnomaly(kakao_id) {
    console.log('kakao_id in viewUserAnomaly:', kakao_id)
    const anomalyIdListQuery = `
        SELECT anomaly_id FROM records WHERE kakao_id = ?
    `;
    const [anomalyIdRows] = await pool.query(anomalyIdListQuery, [kakao_id]);
    const anomalyIds = anomalyIdRows.map(row => row.anomaly_id);
    console.log(anomalyIds)
    return anomalyIds
}


module.exports = { recordUserAnomaly, viewUserAnomaly };