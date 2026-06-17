const createPage = require('../../pages-base');

createPage({
  useForm: true,
  data: {
    form: {
      name: '',
      age: '',
      gender: 0,
      hobby: '',
    },
    genderList: ['男', '女', '其他'],
    hobbyList: ['阅读', '音乐', '运动', '旅行', '美食'],
    errors: {},
  },
  onSubmit() {
    const { form } = this.data;
    const errors = {};

    if (!form.name) errors.name = '姓名必填';
    if (!form.age || isNaN(form.age)) errors.age = '年龄必须是数字';
    if (form.age && (form.age < 0 || form.age > 150)) errors.age = '年龄范围错误';

    if (Object.keys(errors).length > 0) {
      this.setData({ errors });
      this.toast('请检查表单');
      return;
    }

    this.setData({ errors: {} });
    this.toast('提交成功');
  },
  onReset() {
    this.setData({
      form: { name: '', age: '', gender: 0, hobby: '' },
      errors: {},
    });
  },
});
