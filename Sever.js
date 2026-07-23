const http = require('http');

// เรียกใช้งาน Pool จากไลบรารี pg
const { Pool } = require('pg');

// ตั้งค่าการเชื่อมต่อฐานข้อมูล
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const port = process.env.PORT || 3000;

// สร้าง HTTP Server
const server = http.createServer(async (req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html; charset=utf-8');

  try {
    // เชื่อมต่อฐานข้อมูล
    const client = await pool.connect();

    // ดึงข้อมูลจากตาราง students
    const result = await client.query('SELECT * FROM students');

    // คืนการเชื่อมต่อ
    client.release();

    // สร้าง HTML
    let html = `
      <h1>ฐานข้อมูลนักศึกษา (ทดสอบการเชื่อมต่อ)</h1>
      <table border="1" cellpadding="10">
        <tr>
          <th>รหัสนักศึกษา</th>
          <th>ชื่อนักศึกษา</th>
        </tr>
    `;

    // แสดงข้อมูลจากฐานข้อมูล
    result.rows.forEach((row) => {
      html += `
        <tr>
          <td>${row.student_id}</td>
          <td>${row.student_name}</td>
        </tr>
      `;
    });

    html += `</table>`;

    res.end(html);

  } catch (err) {
    console.error(err);

    res.statusCode = 500;
    res.end(`
      <h1>เกิดข้อผิดพลาด!</h1>
      <p>${err.message}</p>
    `);
  }
});

// เริ่มต้น Server
server.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
