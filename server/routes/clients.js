const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET counts for all methods by year
router.get('/counts/all', async (req, res) => {
  const { year } = req.query;
  try {
    let query = 'SELECT method, COUNT(*) as count FROM clients';
    let params = [];
    if (year && year !== '0') {
      query += ' WHERE year = ?';
      params.push(year);
    }
    query += ' GROUP BY method';
    const [rows] = await db.query(query, params);
    const counts = {};
    rows.forEach((row) => {
      counts[row.method] = row.count;
    });
    res.json(counts);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET all clients by method - ALL years grouped by year
router.get('/all-years/:method', async (req, res) => {
  const { method } = req.params;
  try {
    const [rows] = await db.query(
      `SELECT *, TIMESTAMPDIFF(YEAR, date_of_birth, CURDATE()) AS age 
       FROM clients WHERE method = ? 
       ORDER BY year ASC, MONTH(date_of_registration) ASC, DAY(date_of_registration) ASC`,
      [method]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET all clients by method
router.get('/:method', async (req, res) => {
  const { method } = req.params;
  const { year } = req.query;
  try {
    let query = `SELECT *, TIMESTAMPDIFF(YEAR, date_of_birth, CURDATE()) AS age FROM clients WHERE method = ?`;
    let params = [method];
    
    if (year && year !== '0') {
      query += ' AND year = ?';
      params.push(year);
    }
    
    query += ' ORDER BY year ASC, MONTH(date_of_registration) ASC, DAY(date_of_registration) ASC';
    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.post('/', async (req, res) => {
  const {
    method, date_of_registration, family_serial_no,
    last_name, first_name, middle_initial,
    complete_address, date_of_birth,
    se_status, type_of_client, source, previous_method, year
  } = req.body;

  try {
    let clientYear = year;
    if (!clientYear || clientYear === 0) {
      clientYear = date_of_registration 
        ? new Date(date_of_registration).getFullYear() 
        : new Date().getFullYear();
    }

    const [result] = await db.query(
      `INSERT INTO clients 
        (method, date_of_registration, family_serial_no, last_name, first_name, middle_initial,
        complete_address, date_of_birth, se_status, type_of_client, source, previous_method, year)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        method, 
        date_of_registration || null, 
        family_serial_no || null,
        last_name, 
        first_name, 
        middle_initial || null,
        complete_address, 
        date_of_birth || null,
        se_status || null, 
        type_of_client, 
        source, 
        previous_method, 
        clientYear
      ]
    );
    res.json({ message: 'Client added successfully', id: result.insertId });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// PUT update client
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const {
    date_of_registration, family_serial_no,
    last_name, first_name, middle_initial,
    complete_address, age, date_of_birth,
    se_status, type_of_client, source, previous_method
  } = req.body;

  try {
    // Kunin ang year mula sa date_of_registration
    const updatedYear = date_of_registration 
      ? new Date(date_of_registration).getFullYear() 
      : null;

    console.log("UPDATE DATE:", date_of_registration);
    console.log("BIRTH DATE:", date_of_birth);
    console.log("UPDATED YEAR:", updatedYear);

    await db.query(
      `UPDATE clients SET
        date_of_registration=?, family_serial_no=?, last_name=?, first_name=?, middle_initial=?,
        complete_address=?, age=?, date_of_birth=?, se_status=?, type_of_client=?, source=?, previous_method=?, year=?
       WHERE id=?`,
      [date_of_registration, family_serial_no, last_name, first_name, middle_initial,
       complete_address, age, date_of_birth, se_status, type_of_client, source, previous_method, updatedYear, id]
    );
    res.json({ message: 'Client updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET single client by id
router.get('/client/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query(
      `SELECT *, TIMESTAMPDIFF(YEAR, date_of_birth, CURDATE()) AS age FROM clients WHERE id = ?`,
      [id]
    );
    if (rows.length === 0) return res.status(404).json({ message: 'Client not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});


// DELETE client
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM clients WHERE id = ?', [id]);
    res.json({ message: 'Client deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;