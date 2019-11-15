<template>
  <div class="viewForm">
    <div class="releaserDetail_box" v-for="item in releaserItemInfo[userType]" :key="item.code">
      <div class="viewForm_label">{{ item.label }}</div>
      <div v-if="item.type !== 'custom'" class="viewForm_value">{{ formData[item.code] }}</div>
      <div v-else class="viewForm_value">{{ formData.provinceName }} {{ formData.cityName }} {{ formData.areaName }} {{ formData.streetName }}</div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'viewForm',
  props: {
    formData: {
      type: Object,
      default: () => ({}),
    },
    userType: {
      type: String,
      default: 'Z001002',
    },
  },
  data() {
    return {
      releaserItemInfo: {
        Z001002: [
          {
            code: 'perName',
            label: '姓名',
            type: 'label',
          },
          {
            code: 'mobileNumber',
            label: '手机号码',
            type: 'label',
          },
          {
            code: 'email',
            label: '电子邮箱',
            type: 'label',
          },
          {
            code: 'descript',
            label: '个人简介',
            type: 'label',
          },
        ],
        Z001001: [
          {
            code: 'companyName',
            label: '公司名称',
          },
          {
            code: 'orgCode',
            label: '机构代码',
          },
          {
            code: 'personInCharge',
            label: '负责人',
          },
          {
            code: 'mobileNumber',
            label: '手机号码',
          },
          {
            code: 'provinceName',
            label: '省市区街道',
            type: 'custom',
          },
          {
            code: 'address',
            label: '详细地址',
          },
          {
            code: 'description',
            label: '公司介绍',
          },
        ],
      },
    };
  },
  created() {
  },
  methods: {
  },
};
</script>

<style lang="scss">
.viewForm {
  border-top: 1px solid #e2e2e2;
  border-left: 1px solid #e2e2e2;
  .releaserDetail_box {
    display: flex;
    border-bottom: 1px solid #e2e2e2;
    .viewForm_label {
      width: 100px;
      border-right: 1px solid #e2e2e2;
      padding: 15px 0;
      padding-left: 20px;
      background: #2857710f;
    }
    .viewForm_value {
      width: calc(100% - 100px);
      border-right: 1px solid #e2e2e2;
      padding: 15px 0;
      padding-left: 20px;
    }
  }
}
</style>
