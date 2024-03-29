<template>
  <div class="zte-form" :class="{ 'border': border }">
    <el-form
      v-show="currentInfo.length"
      :model="currentForm"
      :rules="currentRules"
      ref="ruleForm"
      :size="size"
      :label-position="leftLabel ? 'left' : 'right'"
      :label-width="labelWidth * (isLanguage ? 1.2 : 1) + 'px'">
      <el-form-item
        v-for="info of currentInfo"
        :key="info.code"
        :class="info.code"
        :style="'width: ' + (info.itemWidth ? info.itemWidth : widthPercent) + '%;'"
        :label="info.label"
        :prop="info.code"
        v-show="info.show !== false">
        <template
          v-if="info.type === 'temp'">
          <slot :name="info.code" :info="info" :form="currentForm"></slot>
        </template>
        <zte-item
          v-else
          :props="info"
          :disabled="disabled"
          v-model="currentForm[info.code]"
          :show="currentForm[info.showLabel]"
          :params="Object.assign({}, info.params, params[info.code])"
          @prev-need="warningPrev"
          @show-change="showChange"
          @single-picker-change="pickerChange"
          @tree-pick-change="treeChange"
          @select-change="handlerSelectChange($event, info)"
          @check-change="handlerCheckChange($event, info)"
          @range-change="handlerRangeChange($event, info)">
        </zte-item>
      </el-form-item>
      <!-- 隐藏域input解决浏览器默认提交bug -->
      <input type="text" style="display: none" v-if="currentInfo.length === 1">
      <div class="content">
        <slot name="content" :form="currentForm"></slot>
      </div>
      <el-form-item class="button-list" :style="'width: ' + widthPercent + '%;'" v-if="!disabled">
        <el-button class="submit" type="primary" @click.native="submitForm" v-if="isSubmit">{{submitText || '提交'}}</el-button>
        <el-button class="reset" @click.native="resetForm" v-if="isCancel">{{cancelText || '重置'}}</el-button>
        <slot name="moreOperate" :currentForm="currentForm"></slot>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
// import qs from 'qs';
import zteItem from './zte-item';

export default {
  name: 'zteForm',
  components: { zteItem },
  props: {
    itemInfo: {
      type: Array,
      default: () => ([]),
    },
    form: {
      type: Object,
      default: () => ({}),
    },
    rules: {
      type: Object,
      default: () => ({}),
    },
    rowSize: {
      type: Number,
      default: 1,
    },
    labelWidth: {
      type: Number,
      default: 100,
    },
    isSubmit: {
      type: Boolean,
      default: true,
    },
    isCancel: {
      type: Boolean,
      default: true,
    },
    submitText: {
      type: String,
      default: '',
    },
    cancelText: {
      type: String,
      default: '',
    },
    border: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    isLanguage: {
      type: Boolean,
      default: false,
    },
    saveForm: {
      type: Boolean,
      default: false,
    },
    localRequire: {
      type: Boolean,
      default: true,
    },
    size: {
      type: String,
      default: 'mini',
    },
    leftLabel: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    widthPercent() {
      return (100 / this.rowSize).toFixed(2);
    },
    params() {
      const params = {};
      for (const info of this.currentInfo) {
        if (info.prev && Object.keys(info.prev).length) { // prev: { code: 'param1'  }
          params[info.code] = {};
          for (const key of Object.keys(info.prev)) {
            params[info.code][info.prev[key]] = this.currentForm[key];
          }
        }
      }
      return params;
    },
  },
  data() {
    return {
      currentRules: {},
      currentForm: {},
      currentInfo: [],
    };
  },
  created() {
    this.initItemInfo();
  },
  watch: {
    form: {
      deep: true,
      handler() {
        this.initForm();
        this.$nextTick(() => {
          this.$refs.ruleForm.clearValidate();
        });
        this.itemInfo.forEach((info) => {
          if (info.type === 'select' && info.next) {
            for (const code in info.next) {
              const index = this.itemInfo.findIndex(item => item.code === code);
              if (index > -1) {
                const item = this.itemInfo[index];
                const params = {};
                params[info.next[code] || info.code] = this.form[info.code];
                this.getOptions(item, params);
              }
            }
          }
        });
      },
    },
    itemInfo() {
      this.initItemInfo();
      this.$nextTick(() => {
        this.$refs.ruleForm.clearValidate();
      });
    },
    isLanguage() {
      this.initItemInfo();
      this.$nextTick(() => {
        this.$refs.ruleForm.clearValidate();
      });
    },
    currentForm: {
      deep: true,
      handler() {
        this.$emit('change', this.currentForm);
      },
    },
  },
  methods: {
    initSelectOptions() {
      this.itemInfo.forEach((info) => {
        this.getOptions(info);
      });
    },
    getOptions(info, args) {
      if (info.type === 'select' || info.type === 'check' || info.type === 'radio') {
        if (!info.options) {
          this.$set(info, 'options', []);
        }
        if (info.ajax) {
          const params = Object.assign({}, info.params, args);
          this.$http.post(info.ajax, params).then(
            (res) => {
              res = res.data;
              info.options = res.list;
            },
          ).catch();
        } else if (info.fastCode) {
          this.$http.post('common/combo/list', { type: info.fastCode }).then(
            (res) => {
              res = res.data;
              info.options = res.list;
              info.optionProps = {
                label: 'value',
                value: 'key',
              };
            },
          ).catch();
        }
      }
    },
    initItemInfo() {
      this.currentInfo = this.isLanguage ? this.langItemInfo(this.itemInfo) : this.itemInfo;
      this.initSelectOptions();
      this.initForm();
      if (!this.disabled) {
        this.initRules();
      }
    },
    initRules() {
      const rules = {};
      const inputList = ['text', 'number', 'textarea', 'password'];
      this.currentInfo.forEach((info) => {
        const rule = this.rules[info.code] || [];
        if (info.required) {
          const message = info.placeholder || (inputList.indexOf(info.type) > -1 ? '请输入' : '请选择');
          rule.push({
            type: info.dataType || 'string',
            required: true,
            message,
            trigger: ['blur', 'change'],
          });
        }
        if (rule.length) {
          rules[info.code] = rule;
        }
      });
      this.currentRules = rules;
    },
    initForm() {
      const form = {};
      this.currentInfo.forEach((info) => {
        form[info.code] = '';
        if (info.type === 'upload') form[info.code] = [];
      });
      this.currentForm = Object.assign({}, form, this.form, this.saveForm ? this.currentForm : {});
    },
    submitForm() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          if (this.isLanguage) {
            this.handlerSubmit(this.currentForm);
          } else {
            this.$emit('submit', this.currentForm);
          }
        } else {
          return false;
        }
        return true;
      });
    },
    resetForm() {
      this.$refs.ruleForm.resetFields();
      this.$nextTick(() => {
        this.$refs.ruleForm.clearValidate();
      });
      this.$emit('reset');
    },
    // select后置字段，清空及重新请求数据
    handlerSelectChange(val, info) {
      if (info.next) {
        for (const code in info.next) {
          const index = this.itemInfo.findIndex(item => item.code === code);
          if (index > -1) {
            const item = this.itemInfo[index];
            const params = {};
            params[info.next[code] || info.code] = val;
            this.getOptions(item, params);
          }
          if (info.next[code]) {
            if (info.multiple) {
              const options = info.options.filter(opt => val.indexOf(opt[info.optionProps.value]) > -1);
              this.currentForm[code] = options.map(opt => opt[info.next[code]]).join(',');
            } else if (info.associated) {
              info.associated.forEach((value) => {
                const i = this.itemInfo.findIndex(d => d.code === value);
                this.itemInfo[i].options = [];
                this.currentForm[value] = '';
              });
            }
          } else {
            this.currentForm[code] = '';
          }
        }
      }
      this.$emit('select-change', val, info);
    },
    handlerCheckChange(val, info) {
      this.$emit('check-change', val, info);
    },
    handlerRangeChange(val, info) {
      if (info.subCode && info.subCode.length === 2) {
        this.currentForm[info.subCode[0]] = val[0];
        this.currentForm[info.subCode[1]] = val[1];
      }
    },
    // 多语言封装
    langItemInfo(itemInfo) {
      const result = [];
      itemInfo.forEach((info) => {
        if (info.lang) {
          result.push(...this.langs.map(lang => ({
            ...info,
            code: `${info.code}_${lang.value}`,
            label: `${info.label}(${lang.label})`,
            required: (this.localRequire && lang.value !== this.$i18n.locale) ? false : info.required,
          })));
        } else {
          result.push(info);
        }
      });
      return result;
    },
    handlerSubmit(form) {
      let result = {
        languages: [],
      };
      this.langs.forEach((lang) => {
        const obj = {
          language: lang.value,
        };
        this.itemInfo.forEach((info) => {
          if (!info.lang) {
            result[info.code] = form[info.code];
          } else {
            obj[info.code] = form[`${info.code}_${lang.value}`];
          }
        });
        result.languages.push(obj);
      });
      result = Object.assign({}, form, result);
      this.$emit('submit', result);
    },
    showChange(obj) {
      this.currentForm[obj.showLabel] = obj.value;
    },
    treeChange(showLabel, checked, halfId, halfChecked) {
      this.currentForm[showLabel] = checked;
      this.currentForm[halfId] = halfChecked;
    },
    pickerChange(row) {
      const keys = Object.keys(row);
      keys.forEach((key) => {
        if (this.currentForm[key] !== undefined) {
          this.currentForm[key] = row[key];
        } else {
          this.$set(this.currentForm, key, row[key]);
        }
      });
    },
    warningPrev(prevcode) {
      const label = this.itemInfo.find(item => item.code === prevcode).label;
      this.$message.warning('waringPrev', { label });
    },
  },
};
</script>

<style lang="scss">
@import "../../assets/scss/theme.scss";

.zte-form {
  background-color: #fff;
  &.border {
    .el-form {
      margin: 0;
      border-top: 1px solid $borderColor;
      border-left: 1px solid $borderColor;

      .el-form-item:not(.button-list) {
        border: 1px solid $borderColor;
        border-top: 0;
        border-left: 0;
        margin: 0;

        .el-form-item__label {
          padding: 0px 10px;
          border-right: 1px solid $borderColor;
          background-color: $tabel_head;
          line-height: 50px;
          // text-align: center;
        }
        .el-form-item__content {
          padding: 0px 10px;
          line-height: 50px;
          height: 50px;
          background-color: #fff;
        }
        .el-form-item__error {
          top: 50%;
          left: auto;
          right: 20px;
          transform: translateY(-50%);
        }
      }
      .el-form-item.button-list {
        margin-bottom: 0;
        margin-left: -1px;
        min-height: 50px;
      }
    }
  }

  .el-form {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: flex-start;

    &.el-form--label-top {
      .el-form-item {
        padding: 0 15px;
      }
    }

    // &.horizontal {
    //   flex-direction: row;
    // }

    // &.vertical {
    //   flex-direction: column;
    // }
    .content {
      width: 100%;
    }

    .el-form-item {
      margin-right: 0;
      min-width: 150px;

      .el-form-item__label {
        // line-height: 50px;
      }
      .el-form-item__content {
        // line-height: 50px;
        // padding-right: 25% !important;

        .el-input__inner {
          // height: 35px;;
        }
      }


      &.image .el-form-item__content {
        line-height: 1;
      }
    }
    .button-list {
      flex: 1 0 auto;
      text-align: right;
      position: relative;
      height: 30px;
      // min-height: 50px;
      // margin-bottom: 0;
      border-left: 1px solid #fff;

      .el-form-item__content {
        position: absolute;
        right: 0;
        bottom: 0;
        margin-left: 0 !important;
        text-align: right;
        width: 100%;

        .el-button {
          width: 100px;
          border-width: 1px;
          &.submit {
          }
          &.reset {
            border: 1px solid #dcdfe6;
          }
        }
      }
    }
  }
}
</style>
