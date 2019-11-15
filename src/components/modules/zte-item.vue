
<template>
  <div class="zte-item">
    <label v-if="disabled && props.type !== 'switch' || props.type === 'label'" class="label">
      {{currentLabel || currentValue}}
    </label>
    <el-input
      v-else-if="props.type === 'text'"
      :maxlength="props.maxlength"
      :prefix-icon="props.iconName"
      :placeholder="'请输入' + (props.placeholder || props.label)"
      :disabled="props.disabled"
      :readonly="props.readonly"
      v-model.trim="currentValue"
      clearable>
    </el-input>
    <el-input
      v-else-if="props.type === 'password'"
      :type="props.type"
      :maxlength="props.maxlength"
      :placeholder="'请输入' + (props.placeholder || props.label)"
      :disabled="props.disabled"
      v-model.trim="currentValue"
      clearable>
    </el-input>
    <el-input
      v-else-if="props.type === 'number'"
      :type="props.type"
      :maxlength="props.maxlength"
      :placeholder="'请输入' + (props.placeholder || props.label)"
      :disabled="props.disabled"
      v-model.trim="currentValue"
      clearable>
      <template v-if="props.append" slot="append">
        {{ props.append }}
      </template>
    </el-input>
    <el-input-number
      v-else-if="props.type === 'counter'"
      :min="props.min || 1"
      :max="props.max || 100"
      :disabled="props.disabled"
      v-model="currentValue"
      clearable>
    </el-input-number>
    <el-select
      v-else-if="props.type === 'select'"
      :placeholder="'请选择' + (props.placeholder || props.label)"
      :disabled="props.disabled"
      v-model="currentValue"
      :multiple="props.multiple"
      @change="handlerSelectChange">
      <el-option
        v-for="item in props.options"
        :key="item[optionProps.value]"
        :label="item[optionProps.label]"
        :value="item[optionProps.value]">
      </el-option>
    </el-select>
    <el-radio-group
      v-else-if="props.type === 'radio'"
      :disabled="props.disabled"
      v-model="currentValue"
      @change="handlerCheckChange">
      <el-radio
        v-for="item in props.options"
        :key="item[optionProps.value]"
        :label="item[optionProps.value]"
        :disabled="props.disabled">
        {{item[optionProps.label]}}
      </el-radio>
    </el-radio-group>
    <el-checkbox-group
      v-else-if="props.type === 'check'"
      :disabled="props.disabled"
      v-model="currentValue"
      @change="handlerCheckChange">
      <el-checkbox
        v-for="item in props.options"
        :key="item[optionProps.value]"
        :label="item[optionProps.value]"
        :disabled="props.disabled">
        {{item[optionProps.label]}}
      </el-checkbox>
    </el-checkbox-group>
    <el-date-picker
      v-else-if="props.type === 'date' || props.type === 'datetime' || props.type === 'daterange'"
      :placeholder="'请选择' + (props.placeholder || props.label)"
      :start-placeholder="'请选择' + (props.startPlaceholder || props.label)"
      :end-placeholder="'请选择' + (props.endPlaceholder || props.label)"
      :disabled="props.disabled"
      :type="props.type"
      v-model="currentValue"
      clearable
      :picker-options="props.pickerOptions"
      :value-format="dateFormat">
    </el-date-picker>
    <el-switch
      v-else-if="props.type === 'switch'"
      :disabled="props.disabled"
      :active-value="props.on === undefined ? 'on' : props.on"
      :inactive-value="props.off === undefined ? 'off' : props.off"
      v-model="currentValue">
    </el-switch>
    <el-input
      v-else-if="props.type === 'table'"
      type="text"
      :disabled="props.disabled"
      :placeholder="'请选择' + (props.placeholder || props.label)"
      :value="show"
      readonly
      clearable
      @clear="clear"
      @click.native="!props.disabled && handlerTableClick($event)"
      prefix-icon="el-icon-search">
    </el-input>
    <el-input
      v-else-if="props.type === 'textarea'"
      type="textarea"
      :autosize="{ minRows: 4, maxRows: 8 }"
      :placeholder="'请输入' + (props.placeholder || props.label)"
      :disabled="props.disabled"
      v-model="currentValue">
    </el-input>
    <el-upload
      v-else-if="props.type === 'upload'"
      :action="props.action || 'sys/file/upload'"
      :limit="props.limit"
      :on-success="uploadSuccess"
      :on-remove="uploadRemove"
      :file-list="currentValue">
      <el-button size="small" type="primary">点击上传</el-button>
      <div slot="tip" class="el-upload__tip">只能上传jpg或png文件且不超过500kb</div>
    </el-upload>
    <img class="image" v-else-if="props.type === 'image'">
    <div v-else-if="props.type === 'temp'">
      <slot :name="props.code"></slot>
    </div>
    <table-picker
      v-if="props.type === 'table' && pickerVisible"
      :params="Object.assign({}, params, props.params)"
      :dialogVisible.sync="pickerVisible"
      :service="props.service"
      :table-key="props.key"
      :title="props.label"
      :selected="currentValue"
      :row-key="props.code"
      :row-trans="props.trans"
      :config="props.config"
      :request-url="props.requestUrl"
      @selectChange='pickerSelect'
      @singleSelectChange='singlePickerSelect'>
    </table-picker>
  </div>
</template>

<script>
import Emitter from '../../mixins/emitter';

export default {
  name: 'zteItem',
  components: {
    tablePicker: () => import('./table-picker'),
  },
  mixins: [Emitter],
  props: {
    props: {
      type: Object,
      default: () => ({}),
    },
    value: {
      type: [String, Number, Array],
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    show: {
      type: String,
    },
    params: {
      type: Object,
    },
  },
  computed: {
    optionProps() {
      const optionProps = Object.assign({ label: 'label', value: 'value' }, this.props.optionProps);
      return optionProps;
    },
    currentLabel() {
      let label = '';
      if (this.props.type === 'select' && this.props.options) {
        const option = this.props.options.filter(opt => opt[this.optionProps.value] === this.currentValue)[0];
        label = option && option[this.optionProps.label];
      }
      if (this.props.type === 'table' || this.props.type === 'tree') {
        label = this.show;
      }
      return label;
    },
    dateFormat() {
      let format = '';
      if (this.props.type === 'date') {
        format = 'yyyy-MM-dd';
      }
      if (this.props.type === 'datetime') {
        format = 'yyyy-MM-dd HH:mm:ss';
      }
      if (this.props.type === 'daterange') {
        format = 'yyyy-MM-dd';
      }
      return format;
    },
    isMultiple() {
      const isMultiple =
        this.props.type === 'check' ||
        (this.props.type === 'select' && this.props.multiple === true);
      return isMultiple;
    },
  },
  data() {
    return {
      currentValue: (this.props.type === 'check' || this.isMultiple) ? (this.value && this.value.split(',') || []) : this.value,
      pickerVisible: false,
      treeVisible: false,
      editorOption: {
        placeholder: '请输入',
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            ['blockquote', 'code-block'],
          ],
          // syntax: {
          //   highlight: text => hljs.highlightAuto(text).value,
          // },
        },
      },
      prevParams: null,
    };
  },
  watch: {
    value(val) {
      this.currentValue = (this.props.type === 'check' || this.isMultiple) ? (val && val.split(',') || []) : val;
      this.dispatch('ElFormItem', 'el.form.change', [val]);
    },
    currentValue(val) {
      const value = (this.props.type === 'check' || this.isMultiple) ? val.join(',') : val;
      this.$emit('input', value);
      if (this.props.type === 'range') this.$emit('range-change', value);
    },
    params: {
      deep: true,
      handler() {
        if (this.props.prev
        && Object.keys(this.params).length > 0
        && this.checkPrev(this.params, this.prevParams)) {
          this.prevParams = this.params;
          this.clear();
        }
      },
    },
    fileList(val) {
      this.currentValue = val.map(file => file.url).join(',');
    },
  },
  methods: {
    beforeRemove(file) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    uploadSuccess(res) {
      if (res.code === 0) {
        res.name = res.filename;
        this.currentValue.push(res);
      }
    },
    uploadRemove(file) {
      const index = this.currentValue.indexOf(file);
      this.currentValue.splice(index, 1);
    },
    ctnChange(val) {
      this.currentValue = val;
    },
    handlerTableClick(e) {
      if (this.checkPrevParams() && e.target.tagName === 'INPUT') {
        this.pickerVisible = true;
      }
    },
    handlerTreeClick(e) {
      if (this.checkPrevParams() && e.target.tagName === 'INPUT') {
        this.treeVisible = true;
      }
    },
    showLabel(value) {
      let showLabel = '';
      if (value) {
        if (value.label) {
          showLabel = value[this.props.showLabel];
        } else if (value.length) {
          showLabel = value.map(item => item[this.props.showLabel]).join(',');
        }
      }
      return showLabel;
    },
    bindKey(rows) {
      if (this.props.type === 'table' && rows) {
        return rows.map(item => item[this.props.code]).join(',');
      }
      return '';
    },
    pickerSelect(rows) {
      const obj = {
        showLabel: this.props.showLabel,
        value: this.showLabel(rows),
      };
      this.$emit('show-change', obj);
      this.currentValue = this.bindKey(rows);
    },
    singlePickerSelect(row) {
      this.$emit('single-picker-change', row[0]);
    },
    treePickerSelect(checked, halfChecked) {
      if (halfChecked) {
        this.$emit('tree-pick-change',
          this.props.showLabel, checked.map(d => d.name).join(','),
          this.props.halfId, halfChecked.map(d => d.id).join(','));
      } else {
        this.$emit('tree-pick-change',
          this.props.showLabel, checked.map(d => d.name).join(','));
      }
      this.currentValue = checked.map(d => d.id).join(',');
    },
    handlerSelectChange(val) {
      this.$emit('select-change', val);
    },
    handlerCheckChange(val) {
      let value = val;
      if (this.props.type === 'radio') value = [val];
      this.$emit('check-change', value);
    },
    checkPrev(newObj, oldObj) {
      for (const key of Object.keys(newObj)) {
        if (!oldObj[key] || newObj[key] !== oldObj[key]) {
          return true;
        }
      }
      return false;
    },
    checkPrevParams() {
      if (this.props.prev && Object.keys(this.props.prev).length > 0) {
        for (const key of Object.keys(this.props.prev)) {
          if (!this.prevParams[this.props.prev[key]]
          || this.prevParams[this.props.prev[key]] === '') {
            this.$emit('prev-need', key);
            return false;
          }
        }
      }
      return true;
    },
    clear() {
      if (this.props.type === 'table') {
        const obj = {};
        if (this.props.trans instanceof Array) {
          this.props.trans.forEach((el) => {
            obj[el.to] = '';
          });
        }
        this.$emit('single-picker-change', obj);
      }
      this.currentValue = '';
    },
  },
  created() {
    this.prevParams = this.params;
  },
  mounted() {
    if ((this.props.type === 'check' || this.props.type === 'radio') && this.props.checkAll) {
      if (!this.props.options.length) {
        setTimeout(() => {
          this.currentValue = this.props.options.map(item => item[this.props.optionProps && this.props.optionProps.value ? this.props.optionProps.value : 'key']);
        }, 1000);
        return;
      }
      this.currentValue = this.props.options.map(item => item[this.props.optionProps && this.props.optionProps.value ? this.props.optionProps.value : 'key']);
    }
  },
};
</script>

<style lang="scss">
.zte-item {
  position: relative;
  background-color: transparent;
  .label {
    display: block;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .el-select {
    display: block;
  }
  .el-input {
    width: 100%!important;
  }
  .image {
    width: 120px;
    height: 162px;
    position: relative;
    margin-left: 50%;
    transform: translateX(-50%);
  }
  .quill-editor {
    strong {
      font-weight: 700;
    }
  }
}
</style>

