const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('[warn] 缺少 SUPABASE_URL / SUPABASE_ANON_KEY 环境变量，接口会报错。请参考 .env.example 配置。');
}

// 懒加载单例：避免在未配置环境变量时初始化即抛错
let _client = null;
function getSupabase() {
  if (!_client && supabaseUrl && supabaseAnonKey) {
    _client = createClient(supabaseUrl, supabaseAnonKey);
  }
  return _client;
}

module.exports = { getSupabase };
