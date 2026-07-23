const http = require('http'); // เรียกใช้โมดูล http
const { Pool } = require('pg'); // เรียกใช้ Pool จาก pg

// เชื่อมต่อฐานข้อมูล PostgreSQL
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const port = process.env.PORT || 3000; // กำหนดพอร์ต

http.createServer(async (req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  try {
    const result = await pool.query('SELECT * FROM students'); // ดึงข้อมูล
    let html = `<h1>ฐานข้อมูลนักศึกษา</h1>
    <p>รหัสนักศึกษา: 69319011137</p>
    <p>ชื่อ: จุรีรัตน์ มีชีพสม</p>
    <table border="1">
    <tr><th>รหัสนักศึกษา</th><th>ชื่อนักศึกษา</th></tr>`;
    result.rows.forEach(row => { // วนลูปแสดงข้อมูล
      html += `<tr><td>${row.student_id}</td>
      <td>${row.student_name}</td></tr>`;
    });
    html += `</table>`;
    res.end(html); // ส่งข้อมูลกลับ
  } catch (err) {
    res.statusCode = 500; // กรณีเกิดข้อผิดพลาด
    res.end(`<h1>เกิดข้อผิดพลาด</h1><p>${err.message}</p>`);
  }
}).listen(port, () => {
  console.log(`Server running on port ${port}`); // เริ่มเซิร์ฟเวอร์
});
