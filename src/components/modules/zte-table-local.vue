<!--此组件为表单+表格组件，其中标签基本使用的饿了么UI，详细用法请查阅Element-UI官方API -->
<template>
  <div class="zte-table-local">
    <!-- 通过buttonList控制是否渲染这四个按钮 -->
    <div class="content-body" v-if="Object.keys(buttonList).length || $slots.content">
      <el-button v-if="buttonList.add" @click.native="handlerAddRow">{{'新增'}}</el-button>
      <el-button v-if="buttonList.del" @click.native="handlerDeleteRow">{{'删除'}}</el-button>
      <el-button v-if="buttonList.enable" @click.native="handlerSwitch('enable')">{{'启用'}}</el-button>
      <el-button v-if="buttonList.disable" @click.native="handlerSwitch('disable')">{{'禁用'}}</el-button>
      <slot name="content"></slot>
      <!-- slot内容分发 -->
    </div>
    <div class="table-body">
      <el-table
        ref="table"
        :size="size"
        :data="currentData"
        stripe
        highlight-current-row
        :height="height"
        style="width: 100%;"
        :row-key="rowKey"
        @current-change="handlerRowSelect"
        @row-dblclick="handleDBclick"
        @selection-change="handlerRowCheck">
        <el-table-column
          v-if="indexStyle === 'selection' || indexStyle === 'index'"
          :type="indexStyle"
          :reserve-selection='!!rowKey'
          width="55">
        </el-table-column>
        <el-table-column
          v-for="column of tableColumn"
          :key="column.code"
          :class-name="column.code"
          :prop="column.code"
          :label="column.label"
          :width="column.width"
          :min-width="column.minWidth"
          :fixed="column.fixed"
          :align="column.align"
          :show-overflow-tooltip="column.tips">
          <template slot-scope="scope">
            <slot
              v-if="column.temp"
              class="temp-column"
              :name="column.code"
              :row="scope.row"
              :column="scope.column"
              :$index="scope.$index">
            </slot>
            <template v-else>{{scope.row[column.code]}}</template>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        v-if="isPagination"
        background
        layout="total, prev, pager, next"
        :current-page="pageNum"
        :page-size="pageSize"
        :total="totalSize"
        @current-change="handlerPageChange">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import zteItem from './zte-item';

export default {
  name: 'zteTableLocal',
  components: {
    zteItem,
  },
  // 通过父元素传递给当前组件的数据用props接收
  // 传过来的数据为一个大对象，被拆分成小对象，具体为数据类型和数据内容
  props: {
    tableColumn: {
      type: Array,
      default: () => ([]),
    },
    tableData: {
      type: Array,
      default: () => ([]),
    },
    indexStyle: {
      type: String,
    },
    rowKey: {
      type: [String, Function],
    },
    labelWidth: {
      type: Number,
      default: 100,
    },
    buttonList: {
      type: Object,
      default: () => ({}),
    },
    isPagination: {
      type: Boolean,
      default: false,
    },
    height: {
      type: String,
    },
    size: String,
  },
  // 定义该组件自己的数据data()，此处data为函数，必须return才能用
  data() {
    return {
      selectionRows: [],
      pageNum: 1,
      pageSize: 5,
    };
  },
  // computed:{}即计算属性，此处数据依赖于data或props里的数据
  // 计算属性在定义过程中需写成函数，只有当计算属性依赖的数据发生变化才会调用一次计算属性方法！
  // 计算属性在使用时直接将函数名当一个数据使用，不带括弧，例如在视图中要使用到searchObj()定义的计算属性，那么直接用searchObj就好了
  computed: {
    totalSize() {
      return this.tableData.length;
    },
    currentData() {
      const data = this.isPagination
        ? this.tableData.slice((this.pageNum - 1) * this.pageSize, this.pageNum * this.pageSize)
        : this.tableData;
      return data;
    },
  },
  watch: {
  },
  created() {
    // 假数据
    // const data = {};
    // this.tableColumn.forEach((item) => {
    //   data[item.code] = 'test';
    // });
    // this.tableData = [data, data, data, data];
  },
  mounted() {
  },
  methods: {
    handlerPageChange(currentPage) {
      this.pageNum = currentPage;
    },
    handlerRowSelect(currentRow) {
      this.$emit('row-select', currentRow);
    },
    handleDBclick(row) {
      this.$emit('dblclick', row);
    },
    handlerRowCheck(selection) {
      this.selectionRows = selection;
      this.$emit('row-check', selection);
    },
    handlerAddRow() {
      this.$emit('add-row');
    },
    handlerDeleteRow() {
      if (!this.selectionRows.length) {
        this.$message.warning('请选择一条数据');
        return;
      }
      this.$emit('delete-row', this.selectionRows);
    },
    handlerSwitch(type) {
      if (!this.selectionRows.length) {
        this.$message.warning('请选择一条数据');
        return;
      }
      this.$emit('switch', this.selectionRows, type);
    },
  },
};
</script>

<style lang="scss">
@import "../../assets/scss/theme.scss";

.zte-table-local {
  [class$=-body] {
    margin-top: 15px;
    background-color: #fff;
  }
  .search-body {
    padding: 10px 20px 5px 20px;
    margin: 0;
    box-shadow: 0 7px 9px rgba($theme, .04);

    .el-form {
      display: flex;
      flex-flow: row wrap;
      justify-content: flex-start;

      .el-form-item {
        margin-right: 0;
        min-width: 250px;
      }
      .button-list {
        flex: 1 0 auto;
        text-align: right;
        margin-left: 20px;

        .el-form-item__content {
          margin-left: 0 !important;
        }
      }
    }

    .more {
      text-align: center;
      padding: 5px;
      cursor: pointer;

      &:hover .icon {
        color: $theme;
      }
    }
  }

  .content-body {
    background-color: transparent;
    .el-button {
      border: 0;
      box-shadow: 0 7px 9px rgba($theme, .04);
    }
  }
  .table-body {
    box-shadow: 0 4px 9px rgba($theme, .08);
    th {
      // text-align: center;
    }
    td {
      .el-button {
        padding-top: 0;
        padding-bottom: 0;
      }
    }
    .el-table-column--selection {
      text-align: center;
      .is-indeterminate .el-checkbox__inner::before {
        transform: scale(0.5, 1);
      }
      .el-checkbox__inner::after {
        border-width: 2px;
        top: 0;
      }
    }
  }
}
</style>
