<template>
  <div class="publicForm">
    <zte-form
      border
      class="dialogForm"
      :disabled='disabled'
      :itemInfo="itemInfo || defItemInfo"
      :form='form'
      cancelText="关闭"
      @reset="$emit('reset')"
      @submit="handleSubmit">
      <!-- 选择行业按钮操作slot -->
      <template slot='receiveBotton'>
        <el-button type="primary" @click="getTreeData">选择行业</el-button>
      </template>
      <template slot='content'>
        <!-- 行业table -->
        <chooseIndustry
          :tableData='receiveIndustryList'
          :tableColumn='industryTableColumn'
          @delet='delet'
          @getIndustryData='getIndustryData'>
        </chooseIndustry>
        <!-- 富文本 -->
        <!-- <el-button size="mini" @click.native="getUEContent()">获取内容</el-button>
        <el-button size="mini" @click.native="getUEContentTxt()">获取无文本内容</el-button> -->
        <UE class="ue" ref="ue" :defaultMsg="defaultMsg" v-show="!industryTreeVisible" :config="Object.assign(config, { readonly: disabled })"/>
      </template>
    </zte-form>
    <el-dialog
      class="industryTree shot_height"
      width="40%"
      :modal-append-to-body='false'
      v-if="industryTreeVisible"
      :visible.sync="industryTreeVisible"
      title="行业选择">
      <industryTree
        :params='treeParams'
        @chooseNodeClick='chooseNodeClick'>
      </industryTree>
    </el-dialog>
  </div>
</template>

<script>
import chooseIndustry from '../modules/chooseIndustry';
import industryTree from '../modules/industryTree';

export default {
  name: 'publicForm',
  components: { chooseIndustry, industryTree },
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    itemInfo: {
      type: Array,
      default: () => ([]),
    },
    formData: {
      type: Object,
      default: () => ({}),
    },
    industryTableColumn: {
      type: Array,
      default: () => ([
        {
          label: '行业名称',
          code: 'industryName',
          width: 300,
        },
        {
          label: '行业标签',
          code: 'industryLabel',
          temp: 'industryLabel',
          align: 'center',
          minWidth: 300,
        },
        {
          label: '操作',
          code: 'operate',
          temp: 'operate',
          fixed: 'right',
          width: 100,
        },
      ]),
    },
    industryData: {
      type: Array,
      default: () => ([]),
    },
    treeParams: {
      type: Object,
      default: () => ({}),
    },
    treeUrl: {
      type: String,
      default: '/asd/dasd',
    },
    defaultMsg: {
      type: String,
      default: '',
    },
    config: {
      type: Object,
      default: () => ({
        initialFrameWidth: null,
        initialFrameHeight: 300,
        zIndex: 2080,
      }),
    },
  },
  data() {
    return {
      form: {},
      defItemInfo: [
        {
          code: 'title',
          label: '标题',
          type: 'text',
          itemWidth: 33.33,
        },
        {
          code: 'receiveObject',
          label: '接收对象',
          type: 'check',
          options: [
            {
              value: '个体',
              key: 'Z001001',
            },
            {
              value: '商户',
              key: 'Z001002',
            },
          ],
          optionProps: {
            label: 'value',
            value: 'key',
          },
          itemWidth: 33.33,
        },
        {
          code: 'province',
          label: '地址：',
          type: 'select',
          showLabel: 'provinceName',
          options: [],
          optionProps: {
            label: 'name',
            value: 'id',
          },
          ajax: 'city/list',
          next: { city: 'parentId' },
          associated: ['city', 'area', 'street'],
          // itemWidth: 25,
          params: { parentId: '0' },
        },
        {
          code: 'city',
          label: '',
          type: 'select',
          showLabel: 'cityName',
          options: [],
          optionProps: {
            label: 'name',
            value: 'id',
          },
          ajax: 'city/list',
          next: { area: 'parentId' },
          associated: ['area', 'street'],
        // itemWidth: 25,
        },
        {
          code: 'area',
          label: '',
          type: 'select',
          showLabel: 'areaName',
          options: [],
          optionProps: {
            label: 'name',
            value: 'id',
          },
          ajax: 'city/list',
          next: { street: 'parentId' },
          associated: ['street'],
        // itemWidth: 25,
        },
        {
          code: 'street',
          label: '',
          type: 'select',
          showLabel: 'streetName',
          options: [],
          optionProps: {
            label: 'name',
            value: 'id',
          },
          ajax: 'city/list',
        // itemWidth: 25,
        },
        {
          code: 'messageType',
          label: '消息类型',
          type: 'check',
          options: [],
          optionProps: {
            label: 'value',
            value: 'key',
          },
          fastCode: 'Z003000',
          itemWidth: 100,
        },
        {
          label: '接收行业',
          code: 'receiveBotton',
          type: 'temp',
          itemWidth: 100,
        },
      ],
      industryTreeVisible: false,
      receiveIndustryList: [],
    };
  },
  created() {
    setTimeout(() => {
      this.form = this.formData;
    }, 300);
    this.receiveIndustryList = [...this.industryData, ...this.receiveIndustryList];
  },
  methods: {
    // 获取行业
    getTreeData() {
      this.industryTreeVisible = true;
    },
    // 获取行业表格中的data
    getIndustryData(data) {
      this.receiveIndustryList = data;
    },
    // 删除行
    delet(i) {
      this.receiveIndustryList.splice(i, 1);
    },
    chooseNodeClick(node) {
      this.industryTreeVisible = false;
      let bool = true;
      this.receiveIndustryList.forEach((item) => {
        if (item.industryId === node.id || item.id === node.id) {
          bool = false;
        }
      });
      if (bool) {
        const { industryLabelAll, industryName, id } = node;
        const obj = { industryLabelAll, industryName, id, industryLabel: '' };
        this.receiveIndustryList.push(obj);
        return;
      }
      this.$message.warning('列表中已存在该行业');
    },
    // 弹窗-提交
    handleSubmit(form) {
      const receiveIndustryList = this.receiveIndustryList.map(item => ({
        industryLabel: item.industryLabel,
        industryName: item.industryName,
        industryId: item.industryId || item.id,
      }));
      const obj = {
        ...form,
        content: this.$refs.ue.getUEContent(),
        receiveIndustryList: JSON.stringify(receiveIndustryList),
      };
      this.$emit('submit', obj);
    },
    // 获取富文本内容--------------------------------------------------
    getUEContent() {
      const content = this.$refs.ue.getUEContent();
      this.$notify({
        title: '获取成功，可在控制台查看！',
        message: content,
        type: 'success',
      });
    },
    getUEContentTxt() {
      const content = this.$refs.ue.getUEContentTxt();
      this.$notify({
        title: '获取成功，可在控制台查看！',
        message: content,
        type: 'success',
      });
    },
  },
};
</script>

<style lang="scss">
.publicForm {
  .dialogForm {
    .el-form {
      border: 0!important;
      .el-form-item {
        border: 0!important;
        .el-form-item__label {
          background: none!important;
          border: 0!important;
        }
      }
      .title {
        .el-input__inner {
          width: 400px;
        }
      }
      .province {
        width: 320px!important;
      }
      .city,.area,.street {
        width: 220px!important;
        .el-form-item__content {
          margin-left: 0!important;
        }
      }
    }
    .receiveBotton {
      .el-form-item__content {
        text-align: left;
      }
    }
    .ue {
      padding-top: 30px;
    }
    .content {
      .industryLabel {
        text-align: left;
      }
    }
  }
  .industryTree {
    // z-index: 9999;
    .el-dialog {
      padding-bottom: 10px;
      .el-dialog__body {
        padding: 10px;
        height: 80vh;
        overflow-y: scroll;
      }
    }
  }
}
</style>
