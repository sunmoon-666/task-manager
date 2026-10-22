const { getSupabase } = require('./supabase');

const VALID_PRIORITY = ['高', '中', '低'];

async function listTasks(priority) {
  const sb = getSupabase();
  if (!sb) throw new Error('Supabase 未配置');
  let query = sb
    .from('tasks')
    .select('id, title, priority, completed, created_at')
    .order('created_at', { ascending: false });
  if (priority && priority !== '全部') {
    if (!VALID_PRIORITY.includes(priority)) throw new Error('无效的优先级');
    query = query.eq('priority', priority);
  }
  const { data, error } = await query;
  if (error) throw error;
  return data;
}

async function addTask(title, priority = '中') {
  const sb = getSupabase();
  if (!sb) throw new Error('Supabase 未配置');
  const cleanTitle = String(title || '').trim();
  if (!cleanTitle) throw new Error('任务标题不能为空');
  const cleanPriority = VALID_PRIORITY.includes(priority) ? priority : '中';
  const { data, error } = await sb
    .from('tasks')
    .insert({ title: cleanTitle, priority: cleanPriority })
    .select()
    .single();
  if (error) throw error;
  return data;
}

async function setTaskCompleted(id, completed) {
  const sb = getSupabase();
  if (!sb) throw new Error('Supabase 未配置');
  const { data, error } = await sb
    .from('tasks')
    .update({ completed: !!completed })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

async function removeTask(id) {
  const sb = getSupabase();
  if (!sb) throw new Error('Supabase 未配置');
  const { error } = await sb.from('tasks').delete().eq('id', id);
  if (error) throw error;
  return { id };
}

module.exports = { listTasks, addTask, setTaskCompleted, removeTask };
