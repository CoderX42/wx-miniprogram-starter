/**
 * 校验工具 — 通用字段校验
 *
 * 用法：
 *   validator.isPhone('13800138000') // true
 *   validator.isIdCard('...') // true
 *   validator.required(value) // boolean
 */

export const required = (v) => v !== null && v !== undefined && v !== '' && !(Array.isArray(v) && v.length === 0);

export const isString = (v) => typeof v === 'string';
export const isNumber = (v) => typeof v === 'number' && !isNaN(v);
export const isInteger = (v) => Number.isInteger(v);
export const isBoolean = (v) => typeof v === 'boolean';
export const isArray = Array.isArray;
export const isObject = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);

export const isPhone = (v) => /^1[3-9]\d{9}$/.test(String(v || ''));

export const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v || ''));

// 简单版身份证校验（18 位，最后一位可为 X）
export const isIdCard = (v) => /^\d{17}[\dXx]$/.test(String(v || ''));

export const isUrl = (v) => {
  try {
    new URL(v);
    return true;
  } catch {
    return false;
  }
};

export const isHttpUrl = (v) => /^https?:\/\//.test(String(v || ''));

/**
 * 值在范围内
 */
export const inRange = (v, min, max) => {
  const n = Number(v);
  if (isNaN(n)) return false;
  return n >= min && n <= max;
};

/**
 * 字符串长度在范围内
 */
export const lengthInRange = (v, min, max) => {
  const s = String(v || '');
  return s.length >= min && s.length <= max;
};

/**
 * 创建校验器（链式）
 * @example
 *   const v = createValidator(value)
 *   v.required().isPhone()
 *   if (v.isValid) { ... }
 */
export function createValidator(value) {
  const errors = [];
  const self = {
    value,
    errors,
    isValid: true,
    fail(msg) {
      errors.push(msg);
      self.isValid = false;
      return self;
    },
    required(msg = '必填') {
      if (!required(value)) self.fail(msg);
      return self;
    },
    isPhone(msg = '手机号格式错误') {
      if (value && !isPhone(value)) self.fail(msg);
      return self;
    },
    isEmail(msg = '邮箱格式错误') {
      if (value && !isEmail(value)) self.fail(msg);
      return self;
    },
    isIdCard(msg = '身份证格式错误') {
      if (value && !isIdCard(value)) self.fail(msg);
      return self;
    },
    isUrl(msg = 'URL 格式错误') {
      if (value && !isUrl(value)) self.fail(msg);
      return self;
    },
    inRange(min, max, msg = `需在 ${min}-${max} 之间`) {
      if (value !== '' && value !== null && value !== undefined && !inRange(value, min, max)) {
        self.fail(msg);
      }
      return self;
    },
    lengthInRange(min, max, msg = `长度需在 ${min}-${max} 之间`) {
      if (value !== '' && value !== null && value !== undefined && !lengthInRange(value, min, max)) {
        self.fail(msg);
      }
      return self;
    },
  };
  return self;
}
