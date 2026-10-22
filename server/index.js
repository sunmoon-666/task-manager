require('dotenv').config();
const app = require('../api');

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`[task-manager] 后端已启动: http://localhost:${port}`);
  console.log(`[task-manager] 健康检查: http://localhost:${port}/api/health`);
});
