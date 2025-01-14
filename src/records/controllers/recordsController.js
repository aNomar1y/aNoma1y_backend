const axios = require('axios');

const { recordUserAnomaly, viewUserAnomaly } = require('../models/recordsModel');

// 현상 기록
exports.recordUserAnomaly = async (req, res) => {
    const { kakao_id, cctv_id, anomaly_id } = req.body;

    try {
        const rows = await recordUserAnomaly(kakao_id, cctv_id, anomaly_id)
        res.json({success: true, data: rows})
    } catch (error) {
        console.error('Error fetching recordUserAnomaly:', error.message);
        res.status(500).json({ success: false, message: 'Failed to fetch recordUserAnomaly.' });
    }
}

// 회원 별 전체 현상 기록
exports.viewUserAnomaly = async (req, res) => {
    const {kakao_id} = req.params;
    console.log('viewuser kakaoid:', kakao_id)
    try {
        const rows = await viewUserAnomaly(kakao_id);
        res.json({ success: true, data: rows });
    } catch (error) {
        console.error('Error fetching viewUserAnomaly:', error.message);
        res.status(500).json({ success: false, message: 'Failed to fetch viewUserAnomaly.' });
    }
};
