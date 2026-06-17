# Formatter 格式化

`@wx-starter/core` 提供数据展示用的格式化函数，全部为**纯函数**。

## 设计目标

- **零依赖** — 不引用 dayjs / numeral 等库
- **跨平台** — 同一份代码在小程序和 h5 下运行结果一致
- **常用优先** — 日期、金额、相对时间、手机号脱敏等

## 快速开始

```javascript
import { formatDate, formatMoney, timeAgo, maskPhone } from '@wx-starter/core';

formatDate(new Date());        // '2024-01-15'
formatMoney(12345);            // '123.45'
timeAgo(new Date(Date.now() - 5 * 60 * 1000));  // '5 分钟前'
maskPhone('13800138000');      // '138****8000'
```

## API

### 日期

#### `parseDate(input)`

解析日期输入（Date / 数字 / 字符串）：

```javascript
parseDate(new Date());
parseDate(1705276800000);
parseDate('2024-01-15');
parseDate('2024-01-15 10:30:00');
```

#### `formatDate(input, pattern?)`

格式化日期。

```javascript
formatDate(new Date());           // '2024-01-15'
formatDate(new Date(), 'YYYY-MM-DD HH:mm');  // '2024-01-15 10:30'
```

支持的 pattern：

| Token | 含义 | 示例 |
|-------|------|------|
| `YYYY` | 年 | 2024 |
| `MM` | 月（补零） | 01 |
| `DD` | 日（补零） | 15 |
| `HH` | 时（补零） | 10 |
| `mm` | 分（补零） | 30 |
| `ss` | 秒（补零） | 45 |

#### `formatDateOnly(input)`

只显示日期（`YYYY-MM-DD`）：

```javascript
formatDateOnly(new Date());  // '2024-01-15'
```

#### `formatMinute(input)`

只显示时分（`HH:mm`）：

```javascript
formatMinute(new Date());  // '10:30'
```

### 金额

#### `formatMoney(cents, options?)`

**分**转**元**（避免浮点数精度问题）：

```javascript
formatMoney(12345);                // '123.45'
formatMoney(12345678);             // '123,456.78'
formatMoney(0);                    // '0.00'
formatMoney(1);                    // '0.01'
```

选项：

```javascript
formatMoney(12345, { symbol: '¥', decimals: 2 });
// '¥123.45'
```

#### `parseMoney(yuan)`

**元**转**分**：

```javascript
parseMoney('123.45');  // 12345
parseMoney(123.45);    // 12345
```

### 数字

#### `formatNumber(n, options?)`

千分位格式化：

```javascript
formatNumber(1234567);        // '1,234,567'
formatNumber(1234567, { decimals: 2 });  // '1,234,567.00'
```

#### `formatShortNumber(n)`

简化大数字（K / W）：

```javascript
formatShortNumber(999);       // '999'
formatShortNumber(1500);      // '1.5K'
formatShortNumber(15000);     // '1.5W'
formatShortNumber(1500000);   // '150W'
```

### 相对时间

#### `timeAgo(input)`

距离当前时间的描述：

```javascript
const now = Date.now();
timeAgo(new Date(now - 30 * 1000));           // '刚刚'
timeAgo(new Date(now - 5 * 60 * 1000));        // '5 分钟前'
timeAgo(new Date(now - 2 * 60 * 60 * 1000));   // '2 小时前'
timeAgo(new Date(now - 3 * 24 * 60 * 60 * 1000));  // '3 天前'
timeAgo(new Date(now - 30 * 24 * 60 * 60 * 1000)); // '2024-12-18'（超过 30 天显示具体日期）
```

### 脱敏

#### `maskPhone(phone)`

手机号中间 4 位脱敏：

```javascript
maskPhone('13800138000');  // '138****8000'
maskPhone('1380013800');   // 不足 11 位，原样返回
```

#### `maskName(name)`

姓名脱敏（保留首字）：

```javascript
maskName('张三');      // '张*'
maskName('张三丰');    // '张*丰'
maskName('John');      // 'J***'（非中文保留首字符）
```

## WXML / 模板中使用

格式化函数是纯函数，可在 WXML 通过 wxs 调用（原生）或 template（uni-app）：

### 原生小程序（wxs）

```html
<wxs module="fmt">
  var maskPhone = function(phone) {
    return phone.substr(0, 3) + '****' + phone.substr(7);
  };
  module.exports = { maskPhone: maskPhone };
</wxs>

<view>{{fmt.maskPhone(user.phone)}}</view>
```

> 注意：wxs 是子集，复杂函数需在 JS 中处理后传入 data。

### uni-app

直接在 `{{ }}` 中调用：

```vue
<template>
  <view>{{ formatMoney(order.amount) }}</view>
  <view>{{ formatDate(order.createdAt) }}</view>
</template>

<script setup>
import { formatMoney, formatDate } from '@wx-starter/core';
</script>
```

## 最佳实践

### 金额计算用分

```javascript
// ❌ 浮点数问题
0.1 + 0.2;  // 0.30000000000000004

// ✅ 用分（整数）
const total = formatMoney(10 + 20);  // '0.30'
```

### 时间戳统一用毫秒

```javascript
// 后端返回秒级时间戳
const ts = 1705276800;  // 秒
const ms = ts * 1000;
formatDate(new Date(ms));  // '2024-01-15'
```

## 测试

```javascript
// __tests__/formatter.test.js
import { formatDate, formatMoney, timeAgo, maskPhone } from '@wx-starter/core';

test('formatDate', () => {
  const d = new Date(2024, 0, 15, 10, 30);
  expect(formatDate(d)).toBe('2024-01-15');
  expect(formatDate(d, 'YYYY/MM/DD')).toBe('2024/01/15');
});

test('formatMoney', () => {
  expect(formatMoney(12345)).toBe('123.45');
  expect(formatMoney(12345678)).toBe('123,456.78');
  expect(formatMoney(0)).toBe('0.00');
});

test('maskPhone', () => {
  expect(maskPhone('13800138000')).toBe('138****8000');
});

test('timeAgo', () => {
  const now = Date.now();
  expect(timeAgo(new Date(now - 30 * 1000))).toBe('刚刚');
});
```

## 下一步

- [Validator 校验](/core/validator) — 配合 Formatter 做表单处理
- [原生模板 components](/native/components) — 业务组件
