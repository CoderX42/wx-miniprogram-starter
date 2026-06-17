import { describe, it, expect } from '@jest/globals';
import {
  formatDate,
  formatMoney,
  formatNumber,
  formatShortNumber,
  maskPhone,
  maskName,
  parseDate,
} from '../src/formatter.js';

describe('formatDate', () => {
  it('格式化 Date 对象', () => {
    const d = new Date(2024, 0, 5, 14, 30, 45);
    expect(formatDate(d)).toBe('2024-01-05 14:30:45');
  });

  it('格式化时间戳', () => {
    const ts = new Date(2024, 0, 5).getTime();
    expect(formatDate(ts, 'YYYY-MM-DD')).toBe('2024-01-05');
  });

  it('非法输入返回空字符串', () => {
    expect(formatDate(null)).toBe('');
    expect(formatDate('')).toBe('');
    expect(formatDate('not a date')).toBe('');
  });
});

describe('parseDate', () => {
  it('解析 ISO 字符串', () => {
    const d = parseDate('2024-01-05T14:30:45');
    expect(d).toBeInstanceOf(Date);
    expect(d.getFullYear()).toBe(2024);
  });

  it('解析 10 位时间戳（秒）', () => {
    const d = parseDate(1704422400);
    expect(d).toBeInstanceOf(Date);
  });

  it('解析 13 位时间戳（毫秒）', () => {
    const d = parseDate(1704422400000);
    expect(d).toBeInstanceOf(Date);
  });

  it('非法输入返回 null', () => {
    expect(parseDate(null)).toBeNull();
    expect(parseDate('')).toBeNull();
  });
});

describe('formatMoney', () => {
  it('分转元', () => {
    expect(formatMoney(100)).toBe('¥1.00');
    expect(formatMoney(12345)).toBe('¥123.45');
  });

  it('大数带千分位', () => {
    // 12345678 分 = 123,456.78 元
    expect(formatMoney(12345678)).toMatch(/123,456\.78/);
  });
});

describe('formatNumber', () => {
  it('千分位', () => {
    expect(formatNumber(1234567)).toBe('1,234,567');
  });
});

describe('formatShortNumber', () => {
  it('小于 1000 不简化', () => {
    expect(formatShortNumber(999)).toBe('999');
  });
  it('1000-9999 转 k', () => {
    expect(formatShortNumber(1500)).toBe('1.5k');
    expect(formatShortNumber(1000)).toBe('1k');
  });
  it('>= 10000 转 w', () => {
    expect(formatShortNumber(12000)).toBe('1.2w');
    expect(formatShortNumber(100000)).toBe('10w');
  });
});

describe('maskPhone', () => {
  it('隐藏中间四位', () => {
    expect(maskPhone('13800138000')).toBe('138****8000');
  });
  it('空值原样返回', () => {
    expect(maskPhone('')).toBe('');
    expect(maskPhone(null)).toBe(null);
  });
});

describe('maskName', () => {
  it('保留首字', () => {
    expect(maskName('张三')).toBe('张*');
    expect(maskName('李四五')).toBe('李**');
  });
  it('单字不变', () => {
    expect(maskName('X')).toBe('X');
  });
});
