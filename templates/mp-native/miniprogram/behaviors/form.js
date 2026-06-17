// behaviors/form.js — 表单处理（input/picker/upload/delete）
const { photo, unPhoto } = require('@wx-starter/core');

module.exports = Behavior({
  methods: {
    /** input 双向绑定 — bindinput="inputChange" data-field="form.name" data-type="integer" */
    inputChange(e) {
      const { field, type } = e.currentTarget.dataset;
      let value = e.detail.value;
      if (type === 'integer' && value !== '') value = Number(value);
      const keys = field.split('.');
      const data = { ...this.data };
      let target = data;
      for (let i = 0; i < keys.length - 1; i++) {
        if (!target[keys[i]]) target[keys[i]] = {};
        target = target[keys[i]];
      }
      target[keys[keys.length - 1]] = value;
      this.setData(data);
    },

    /** picker 选择 — bindchange="pickerChange" data-field="form.city" data-range="cityList" */
    pickerChange(e) {
      const { field, range } = e.currentTarget.dataset;
      const idx = e.detail.value;
      const selected = this.data[range]?.[idx];
      const keys = field.split('.');
      const data = { ...this.data };
      let target = data;
      for (let i = 0; i < keys.length - 1; i++) target = target[keys[i]] || (target[keys[i]] = {});
      target[keys[keys.length - 1]] = selected;
      this.setData(data);
    },

    /** 上传文件 — chooseImage 之后调用 */
    async uploadFile(filePaths) {
      const paths = Array.isArray(filePaths) ? filePaths : [filePaths];
      const data = await this.api.file.uploadMany({ filePaths: paths });
      const urls = (data || []).map((it) => photo(it?.data?.path || it?.path));
      return urls;
    },

    /** 追加上传结果到字段数组 — bindsuccess="uploadSuccess" data-field="form.images" */
    uploadSuccess(e) {
      const { field } = e.currentTarget.dataset;
      const { urls } = e.detail;
      const keys = field.split('.');
      const data = { ...this.data };
      let target = data;
      for (let i = 0; i < keys.length - 1; i++) {
        if (!Array.isArray(target[keys[i]])) target[keys[i]] = [];
        target = target[keys[i]];
      }
      if (!Array.isArray(target[keys[keys.length - 1]])) target[keys[keys.length - 1]] = [];
      target[keys[keys.length - 1]].push(...urls.map((u) => unPhoto(u || '')).filter(Boolean));
      this.setData(data);
    },

    /** 删除文件 — binddelete="deleteFile" data-field="form.images" */
    deleteFile(e) {
      const { field } = e.currentTarget.dataset;
      const idx = e.detail.index;
      const keys = field.split('.');
      const data = { ...this.data };
      let target = data;
      for (let i = 0; i < keys.length - 1; i++) target = target[keys[i]];
      const arr = target[keys[keys.length - 1]];
      if (Array.isArray(arr)) {
        arr.splice(idx, 1);
        this.setData(data);
      }
    },
  },
});
