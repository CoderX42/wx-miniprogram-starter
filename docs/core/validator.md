# Validator 校验

`@wx-starter/core` 提供数据校验函数和链式校验器，全部为**纯函数**。

## 设计目标

- **常用校验内置** — 手机号、邮箱、身份证、URL
- **链式 API** — `createValidator().required().isPhone()` 风格
- **零依赖** — 不引用 validator.js 等库
- **国际化友好** — 错误信息可定制

## 快速开始

### 单函数校验

```javascript
import { isPhone, isEmail, isIdCard } from '@wx-starter/core';

isPhone('13800138000');          // true
isPhone('23800138000');          // false
isEmail('a@b.com');              // true
isIdCard('11010119900307XXXX');  // true
```

### 链式校验

```javascript
import { createValidator } from '@wx-starter/core';

const v = createValidator();

const errors = v
  .required('昵称', form.name)
  .lengthInRange('昵称', form.name, 2, 20)
  .isPhone('手机号', form.phone)
  .isEmail('邮箱', form.email)
  .collect();

if (errors.length) {
  console.log(errors);  // ['手机号格式不正确', ...]
}
```

## API

### 通用校验

#### `required(label, value)`

非空校验。

```javascript
required('昵称', '');        // '昵称不能为空'
required('昵称', 'foo');     // null
required('昵称', null);      // '昵称不能为空'
required('昵称', []);        // '昵称不能为空'
required('昵称', 0);         // null（0 是有效值）
```

### 类型校验

#### `isPhone(value, label?)`

中国大陆手机号（11 位，1 开头）。

```javascript
isPhone('13800138000');          // true
isPhone('13800138000', '手机号'); // null（通过）
isPhone('23800138000');          // false
isPhone('13800138000', '手机号'); // '手机号格式不正确'
```

#### `isEmail(value, label?)`

```javascript
isEmail('a@b.com');         // true
isEmail('not-an-email');    // false
```

#### `isIdCard(value, label?)`

中国大陆身份证（18 位，含校验码）。

```javascript
isIdCard('11010119900307XXXX');  // true
isIdCard('123');                  // false
```

#### `isUrl(value, label?)`

```javascript
isUrl('https://example.com');  // true
isUrl('not a url');            // false
```

### 范围校验

#### `inRange(label, value, min, max)`

数值范围。

```javascript
inRange('年龄', 25, 0, 150);  // null（通过）
inRange('年龄', 200, 0, 150); // '年龄必须在 0 ~ 150 之间'
```

#### `lengthInRange(label, value, min, max)`

长度范围（适用于字符串、数组）。

```javascript
lengthInRange('昵称', 'foo', 2, 20);     // null
lengthInRange('昵称', 'a', 2, 20);       // '昵称长度必须在 2 ~ 20 之间'
lengthInRange('标签', ['a', 'b'], 1, 5); // null
```

### 链式 API

#### `createValidator()`

创建链式校验器。

```javascript
const v = createValidator();

v.required('昵称', form.name);
v.isPhone('手机号', form.phone);
// ...
```

每个方法返回 validator 实例本身，可以链式调用。

```javascript
v.required('昵称', form.name)
 .lengthInRange('昵称', form.name, 2, 20)
 .isPhone('手机号', form.phone)
 .isEmail('邮箱', form.email);
```

#### `v.collect()`

收集所有错误，返回数组（首次失败是否中断，取决于方法实现）。

```javascript
const errors = v.collect();
if (errors.length) {
  Notify({ type: 'danger', message: errors[0] });
}
```

**默认行为**：每个方法**遇到错误立即返回**该错误，但**不中断链**（继续检查后续字段），最后 `collect()` 汇总所有错误。

#### `v.first()` / `v.hasError()`

```javascript
if (v.hasError()) {
  Notify({ type: 'danger', message: v.first() });
  return;
}
```

## 自定义错误信息

所有方法都接受可选的 `label` 参数，错误信息会包含：

```javascript
isPhone('123', '联系方式');
// '联系方式格式不正确'
```

如果想完全自定义，可以传入函数：

```javascript
import { custom } from '@wx-starter/core';

custom('昵称', value, () => {
  if (value.includes('admin')) return '昵称不能包含 admin';
  return null;
});
```

## 完整示例

```javascript
// utils/validators.js
import { createValidator } from '@wx-starter/core';

export function validateUserForm(form) {
  return createValidator()
    .required('昵称', form.name)
    .lengthInRange('昵称', form.name, 2, 20)
    .isPhone('手机号', form.phone)
    .isEmail('邮箱', form.email)
    .collect();
}
```

```javascript
// 页面中
import { validateUserForm } from '../../utils/validators';

onSubmit() {
  const errors = validateUserForm(this.data.form);
  if (errors.length) {
    Notify({ type: 'danger', message: errors[0] });
    return;
  }
  // 提交...
}
```

## 与 Formatter 配合

```javascript
// 表单提交前格式化 + 校验
function processForm(raw) {
  const form = {
    name: raw.name.trim(),
    phone: raw.phone.replace(/\s/g, ''),
    email: raw.email.toLowerCase(),
  };

  const errors = validateUserForm(form);
  if (errors.length) {
    return { ok: false, errors };
  }

  return { ok: true, data: form };
}
```

## 测试

```javascript
// __tests__/validator.test.js
import { isPhone, isEmail, isIdCard, createValidator } from '@wx-starter/core';

test('isPhone', () => {
  expect(isPhone('13800138000')).toBe(true);
  expect(isPhone('23800138000')).toBe(false);
});

test('isEmail', () => {
  expect(isEmail('a@b.com')).toBe(true);
  expect(isEmail('not-email')).toBe(false);
});

test('链式校验', () => {
  const errors = createValidator()
    .required('name', '')
    .isPhone('phone', '123')
    .collect();
  expect(errors.length).toBe(2);
  expect(errors[0]).toContain('name');
  expect(errors[1]).toContain('phone');
});
```

## 下一步

- [Formatter 格式化](/core/formatter) — 提交前格式化
- [原生模板 behaviors](/native/behaviors#form) — `inputChange` / `pickerChange`
- [uni-app 模板 mixins](/uniapp/mixins#form) — 同上
