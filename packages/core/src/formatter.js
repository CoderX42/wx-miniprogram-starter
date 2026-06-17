/**
 * 格式化工具 — 日期、金额、数字、相对时间
 *
 * 零依赖，纯 JS 实现。在小程序和 uni-app 中均可使用。
 */

/**
 * 补零
 */
function pad(n, len = 2) {
  return String(n).padStart(len, '0');
}

/**
 * 解析时间为 Date 对象
 * @param {Date|string|number} value
 * @returns {Date|null}
 */
export function parseDate(value) {
  if (value === null || value === undefined || value === '') return null;
  if (value instanceof Date) return isNaN(value.getTime()) ? null : value;
  if (typeof value === 'number') {
    const ts = String(value).length === 10 ? value * 1000 : value;
    const d = new Date(ts);
    return isNaN(d.getTime()) ? null : d;
  }
  if (typeof value === 'string') {
    const t = value.trim();
    if (!t) return null;
    if (/^\d+$/.test(t)) {
      const ts = t.length === 10 ? Number(t) * 1000 : Number(t);
      const d = new Date(ts);
      return isNaN(d.getTime()) ? null : d;
    }
    const normalized = t.includes('T') ? t : t.replace(/-/g, '/');
    const d = new Date(normalized);
    return isNaN(d.getTime()) ? null : d;
  }
  return null;
}

/**
 * 格式化日期
 * @param {Date|string|number} value
 * @param {string} [fmt='YYYY-MM-DD HH:mm:ss']
 */
export function formatDate(value, fmt = 'YYYY-MM-DD HH:mm:ss') {
  const d = parseDate(value);
  if (!d) return '';
  const map = {
    YYYY: d.getFullYear(),
    MM: pad(d.getMonth() + 1),
    DD: pad(d.getDate()),
    HH: pad(d.getHours()),
    mm: pad(d.getMinutes()),
    ss: pad(d.getSeconds()),
  };
  return fmt.replace(/YYYY|MM|DD|HH|mm|ss/g, (key) => map[key]);
}

export const formatDateOnly = (v) => formatDate(v, 'YYYY-MM-DD');
export const formatMinute = (v) => formatDate(v, 'YYYY-MM-DD HH:mm');

/**
 * 金额格式化 — 分转元，保留两位
 */
export function formatMoney(value, prefix = '¥', decimals = 2) {
  const n = Number(value);
  if (isNaN(n)) return '';
  const fixed = (n / 100).toFixed(decimals);
  return prefix + Number(fixed).toLocaleString('zh-CN', { minimumFractionDigits: decimals });
}

/**
 * 数字千分位
 */
export function formatNumber(value, decimals = 0) {
  const n = Number(value);
  if (isNaN(n)) return '';
  return n.toLocaleString('zh-CN', { minimumFractionDigits: decimals });
}

/**
 * K/W 简化（用于粉丝数等）
 */
export function formatShortNumber(value) {
  const n = Number(value);
  if (isNaN(n)) return '';
  if (n >= 10000) {
    return (n / 10000).toFixed(1).replace(/\.0$/, '') + 'w';
  }
  if (n >= 1000) {
    return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
  }
  return String(n);
}

/**
 * 相对时间
 */
export function timeAgo(value) {
  const d = parseDate(value);
  if (!d) return '';
  const diff = Date.now() - d.getTime();
  if (diff < 0) return '';
  const sec = Math.floor(diff / 1000);
  if (sec < 30) return '刚刚';
  if (sec < 60) return `${sec}秒前`;
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}分钟前`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}小时前`;
  const day = Math.floor(hr / 24);
  if (day < 30) return `${day}天前`;
  return formatDateOnly(d);
}

/**
 * 隐藏手机号中间四位
 */
export function maskPhone(phone) {
  if (!phone || phone.length < 7) return phone;
  return phone.slice(0, 3) + '****' + phone.slice(-4);
}

/**
 * 隐藏姓名（保留首字）
 */
export function maskName(name) {
  if (!name) return '';
  if (name.length <= 1) return name;
  return name[0] + '*'.repeat(name.length - 1);
}
