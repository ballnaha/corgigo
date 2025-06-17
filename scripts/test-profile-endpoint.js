const http = require('http');

async function testProfileEndpoint() {
  try {
    console.log('🧪 ทดสอบ Profile API Endpoint...\n');

    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/profile',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    };

    const req = http.request(options, (res) => {
      console.log(`📊 Status: ${res.statusCode}`);
      console.log(`📋 Headers:`, res.headers);

      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });

      res.on('end', () => {
        console.log('\n📄 Response Body:');
        try {
          const parsed = JSON.parse(body);
          console.log(JSON.stringify(parsed, null, 2));
        } catch (e) {
          console.log(body);
        }
      });
    });

    req.on('error', (e) => {
      console.error(`❌ Request Error: ${e.message}`);
    });

    req.end();

  } catch (error) {
    console.error('❌ เกิดข้อผิดพลาด:', error);
  }
}

// รอ 3 วินาทีให้ server รัน
setTimeout(() => {
  testProfileEndpoint();
}, 3000); 