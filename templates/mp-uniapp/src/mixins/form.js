// mixins/form.js — 表单处理
export default {
  methods: {
    /** input 双向绑定 */
    onInput(field, e) {
      const value = e.detail.value;
      this.$set(this.form || (this.form = {}), field, value);
    },
    /** picker 选择 */
    onPicker(field, rangeKey, e) {
      const idx = e.detail.value;
      const selected = this[rangeKey]?.[idx];
      this.$set(this.form || (this.form = {}), field, selected);
    },
  },
};
