const pool = require('./db');
require('dotenv').config();

async function getEntries(req, res) {
    
    await sleep(5);

    const projectId = req.projectNum;

    try {
        const [rows] = await pool.query(
            `SELECT entries.id, entries.text, entries.dateTime, entries.painScale
             FROM entries
             WHERE projectId = ?
             ORDER BY dateTime DESC`,
            [projectId]
        );

        if (rows.length === 0) {
            return res.status(204).json({ message: "No entries found for this project" });
        }

        res.json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.sqlMessage });
    }

}


module.exports = {getEntries}