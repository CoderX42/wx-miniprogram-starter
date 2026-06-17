import { describe, it, expect } from '@jest/globals';
import {
  required,
  isPhone,
  isEmail,
  isIdCard,
  isUrl,
  isHttpUrl,
  inRange,
  lengthInRange,
  createValidator,
} from '../src/validator.js';

describe('required', () => {
  it('空值返回 false', () => {
    expect(required(null)).toBe(false);
    expect(required(undefined)).toBe(false);
    expect(required('')).toBe(false);
    expect(required([])).toBe(false);
  });
  it('非空返回 true', () => {
    expect(required('x')).toBe(true);
    expect(required(0)).toBe(true);
    expect(required([1])).toBe(true);
    expect(required({})).toBe(true);
  });
});

describe('isPhone', () => {
  it('合法手机号', () => {
    expect(isPhone('13800138000')).toBe(true);
    expect(isPhone('17012345678')).toBe(true);
  });
  it('非法手机号', () => {
    expect(isPhone('1380013800')).toBe(false);
    expect(isPhone('23800138000')).toBe(false);
    expect(isPhone('abc')).toBe(false);
  });
});

describe('isEmail', () => {
  it('合法邮箱', () => {
    expect(isEmail('foo@bar.com')).toBe(true);
    expect(isEmail('a.b+c@x.io')).toBe(true);
  });
  it('非法邮箱', () => {
    expect(isEmail('foo@')).toBe(false);
    expect(isEmail('@bar.com')).toBe(false);
  });
});

describe('isIdCard', () => {
  it('18 位身份证', () => {
    expect(isIdCard('11010119900307881X')).toBe(true);
    expect(isIdCard('110101199003078810')).toBe(true);
  });
  it('非法', () => {
    expect(isIdCard('11010119900307881')).toBe(false);
    expect(isIdCard('110101199003078811Y')).toBe(false);
  });
});

describe('isUrl / isHttpUrl', () => {
  it('合法 URL', () => {
    expect(isUrl('https://example.com')).toBe(true);
    expect(isHttpUrl('http://foo.bar/path')).toBe(true);
  });
  it('非法 URL', () => {
    expect(isUrl('not a url')).toBe(false);
    expect(isHttpUrl('foo://x')).toBe(false);
  });
});

describe('inRange / lengthInRange', () => {
  it('数字范围', () => {
    expect(inRange(5, 1, 10)).toBe(true);
    expect(inRange(0, 1, 10)).toBe(false);
    expect(inRange(11, 1, 10)).toBe(false);
  });
  it('字符串长度', () => {
    expect(lengthInRange('hello', 1, 10)).toBe(true);
    expect(lengthInRange('', 1, 10)).toBe(false);
  });
});

describe('createValidator', () => {
  it('链式校验 - 全通过', () => {
    const v = createValidator('13800138000').required().isPhone();
    expect(v.isValid).toBe(true);
    expect(v.errors).toEqual([]);
  });
  it('链式校验 - 失败', () => {
    const v = createValidator('abc').required().isPhone('手机号错');
    expect(v.isValid).toBe(false);
    expect(v.errors).toEqual(['手机号错']);
  });
  it('多规则累计错误', () => {
    const v = createValidator('').required('必填').isPhone('手机错');
    expect(v.isValid).toBe(false);
    expect(v.errors).toContain('必填');
  });
});
