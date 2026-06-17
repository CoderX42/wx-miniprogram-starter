<template>
  <view class="container">
    <page-title title="表单示例" :back="true" />

    <view class="form">
      <view class="form-item">
        <view class="form-label">姓名</view>
        <input
          class="form-input"
          :value="form.name"
          placeholder="请输入姓名"
          @input="onInput('name', $event)"
        />
        <view v-if="errors.name" class="form-error">{{ errors.name }}</view>
      </view>

      <view class="form-item">
        <view class="form-label">年龄</view>
        <input
          class="form-input"
          type="number"
          :value="form.age"
          placeholder="请输入年龄"
          @input="onInput('age', $event)"
        />
        <view v-if="errors.age" class="form-error">{{ errors.age }}</view>
      </view>

      <view class="form-item">
        <view class="form-label">性别</view>
        <picker
          mode="selector"
          :range="genderList"
          :value="form.gender"
          @change="onPicker('gender', 'genderList', $event)"
        >
          <view class="form-input">{{ genderList[form.gender] || '请选择' }}</view>
        </picker>
      </view>

      <view class="form-item">
        <view class="form-label">爱好</view>
        <picker
          mode="selector"
          :range="hobbyList"
          :value="form.hobby"
          @change="onPicker('hobby', 'hobbyList', $event)"
        >
          <view class="form-input">{{ hobbyList[form.hobby] || '请选择' }}</view>
        </picker>
      </view>

      <view class="form-actions">
        <view class="btn btn-secondary" @tap="onReset">重置</view>
        <view class="btn" @tap="onSubmit">提交</view>
      </view>
    </view>
  </view>
</template>

<script>
import formMixin from '@/mixins/form';

export default {
  mixins: [formMixin],
  data() {
    return {
      form: { name: '', age: '', gender: 0, hobby: '' },
      genderList: ['男', '女', '其他'],
      hobbyList: ['阅读', '音乐', '运动', '旅行', '美食'],
      errors: {},
    };
  },
  methods: {
    onSubmit() {
      const errors = {};
      if (!this.form.name) errors.name = '姓名必填';
      if (!this.form.age || isNaN(this.form.age)) errors.age = '年龄必须是数字';
      this.errors = errors;
      if (Object.keys(errors).length > 0) {
        this.$toast('请检查表单');
        return;
      }
      this.$toast('提交成功');
    },
    onReset() {
      this.form = { name: '', age: '', gender: 0, hobby: '' };
      this.errors = {};
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  padding: 32rpx 24rpx;
}
.form {
  background: $color-bg-card;
  border-radius: $radius-md;
  padding: 32rpx 24rpx;
}
.form-item {
  margin-bottom: 32rpx;
}
.form-label {
  font-family: 'PFM';
  font-size: $font-base;
  color: $color-text-primary;
  margin-bottom: 12rpx;
}
.form-input {
  background: $color-bg;
  border-radius: $radius-base;
  padding: 20rpx 24rpx;
  font-family: 'PFR';
  font-size: $font-base;
  min-height: 80rpx;
  box-sizing: border-box;
}
.form-error {
  color: $color-error;
  font-size: $font-sm;
  margin-top: 8rpx;
}
.form-actions {
  display: flex;
  gap: 16rpx;
  margin-top: 48rpx;
}
.btn {
  flex: 1;
  padding: 24rpx 32rpx;
  background: $color-primary;
  color: $color-text-inverse;
  border-radius: $radius-md;
  text-align: center;
  font-family: 'PFM';
  font-size: $font-base;
}
.btn-secondary {
  background: $color-border-light;
  color: $color-text-primary;
}
</style>
