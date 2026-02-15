const pool = require('./db');
require('dotenv').config();


async function getDashboardInfo(projectNum){
    const [rows] = await pool.query(
            `SELECT *
            FROM contacts
            JOIN projects ON contacts.id = projects.contactId
            WHERE projects.id = ?`,
            [projectNum]
        );

        // if (rows.length === 0) {
        //     return res.status(404).json({ message: "No projects found for this contact" });
        // }

        console.log(rows);
        return rows;


}


async function makeJournalEntry(req, res){
    const { text, painScale } = req.body;

    const dateTime = getDate();


    try {
        const [result] = await pool.query(
            `INSERT INTO entries (projectId, text, dateTime, painScale)
             VALUES (?, ?, ?, ?)`,
            [req.projectNum, text, dateTime, painScale]
        );
        console.log(result);
        res.json({ message: 'Entry created'});
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

async function getLastEntry(req, res) {
    const projectId  = req.projectNum;

    try {
        const [rows] = await pool.query(
            `SELECT *
             FROM entries
             WHERE projectId = ?
             ORDER BY dateTime DESC
             LIMIT 1`,
            [projectId]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: "No entries found for this project" });
        }

        res.json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.sqlMessage });
    }

}

async function updateLastEntry(req, res) {
    const { text, painScale, entryId } = req.body;
    const projectNum = req.projectNum;

    try {
        const [result] = await pool.query(
           `UPDATE entries
             JOIN projects ON entries.projectId = projects.id
             SET entries.text = ?, entries.painScale = ?
             WHERE entries.id = ?
               AND projects.id = ?`,
            [text, painScale, entryId, req.projectNum]


        );
        console.log(result);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Entry not found" });
        }

        res.json({ message: "Entry updated", result });
    } catch (err) {
        console.log("error in update")
        console.error(err);
        res.status(500).json({ error: err.sqlMessage });
    }

}

function getDate(){
    const now = new Date();

    const dateTime = new Intl.DateTimeFormat('sv-SE', {
        timeZone: 'America/Chicago',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    })
    .format(now)
    .replace(' ', ' ');

    return dateTime;
}

module.exports = {getDashboardInfo, makeJournalEntry, getLastEntry, updateLastEntry};