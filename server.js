const http = require('http');
const { Pool } = require('pg');

// 1. Enable SSL for Railway PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false,
});

const port = process.env.PORT || 3000;

// Helper to escape HTML characters (Prevents XSS)
function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

const server = http.createServer(async (req, res) => {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');

  try {
    // 2. pool.query() automatically acquires and releases connections safely
    const result = await pool.query('SELECT * FROM students');

    res.statusCode = 200;

    let html = `<h1>ฐานข้อมูลนักศึกษา (ทดสอบการเชื่อมต่อ)</h1>`;
    html += `<table border="1" cellpadding="10">`;
    html += `<tr><th>รหัสนักศึกษา</th><th>ชื่อ-นามสกุล</th></tr>`;

    result.rows.forEach((row) => {
      html += `<tr><td>${escapeHtml(row.student_id)}</td><td>${escapeHtml(row.student_name)}</td></tr>`;
    });

    html += `</table>`;
    res.end(html);
  } catch (err) {
    console.error('Database Error:', err);

    // 3. Set proper HTTP 500 status on error
    res.statusCode = 500;
    res.end(`<h1>เกิดข้อผิดพลาด!</h1><p>${escapeHtml(err.message)}</p>`);
  }
});

server.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
