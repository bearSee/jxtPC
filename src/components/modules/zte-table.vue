<template>
  <div class="zte-table">
    <div class="search-body" v-if="searchInfo.length">
      <el-form
        ref="searchForm"
        size="mini"
        :model="searchForm"
        :rules="rules"
        :label-width="labelWidth + 'px'"
        :label-position="lablePosition">
        <transition
          name="search-info-transition"
          enter-active-class="animated fadeIn"
          leave-active-class="animated fadeOut"
          v-for="(info, index) of searchInfo"
          :key="info.code">
          <el-form-item
            v-if="info.show !== false"
            v-show="searchExpend || expendAll ? index < searchInfo.length : index < expendSize"
            :class="info.code"
            :style="'width: ' + (info.itemWidth ? info.itemWidth : widthPercent) + '%;'"
            :label="info.label"
            :prop="info.code">
            <zte-item v-if="!info.range"
              :props="info"
              :format="info.format"
              v-model="searchForm[info.code]"
              :show="searchForm[info.showLabel]"
              :params="Object.assign({}, info.params, info.code)"
              @show-change="showChange"
              @single-picker-change="pickerChange"
              @tree-pick-change="treeChange"
              @range-change="handlerRangeChange($event, info)"
              >
            </zte-item>
          </el-form-item>
        </transition>
        <!-- 隐藏域input解决浏览器默认提交bug -->
        <input type="text" style="display: none" v-if="searchInfo.length === 1">
        <el-form-item v-if="!cancelSearch" class="button-list" :style="'width:' + widthPercent + '%;'">
           <div class="search-btn">
            <el-button
              v-if="buttonList.add"
              type="primary"
              size="mini"
              icon="el-icon-plus"
              @click.native="handlerAddRow">
              新增
            </el-button>
            <el-button @click.native="submitForm" icon="el-icon-search">查询</el-button>
            <el-button @click.native="resetForm" icon="el-icon-refresh">重置</el-button>
            <template class="search-text" v-if="$slots.searchText">
              <slot name="searchText"></slot>
            </template>
             <el-button
              v-if="buttonList.back"
              plain
              size="mini"
              icon="el-icon-arrow-left"
              @click.native="handlerBack">
              返回
            </el-button>
            <template class="search-slotBtn" v-if="$slots.operate">
              <slot name="operate"></slot>
            </template>
          </div>
        </el-form-item>
      </el-form>
      <div class="more" v-if="seachIsMore && !expendAll" @click="searchExpend = !searchExpend">
        <i class="icon el-icon-arrow-up" v-if="searchExpend"></i>
        <i class="icon el-icon-arrow-down" v-else></i>
      </div>
    </div>
    <div class="content-body" v-if="Object.keys(buttonList).length || $slots.content">
      <slot name="content"></slot>
      <el-button
        v-if="buttonList.excelExport"
        size="mini"
        :loading="loadingWait"
        @click.native="handlerExcelExport">
        {{loadingWait ? '正在导出' : '导出Excel'}}
      </el-button>
      <el-button
        v-if="buttonList.enable"
        plain
        size="mini"
        @click.native="handlerSwitch('enable')">
        启用
      </el-button>
      <el-button
        v-if="buttonList.disable"
        plain
        size="mini"
        @click.native="handlerSwitch('disable')">
        禁用
      </el-button>
      <el-button
        v-if="buttonList.del"
        size="mini"
        icon="el-icon-minus"
        @click.native="handlerDeleteRow">
        删除
      </el-button>
    </div>
    <div class="table-body"
        :style="{'width': $slots.picked ? '50%' : '100%', 'verticalAlign': 'top' }">
      <el-table
        size="mini"
        ref="table"
        :data="tableData"
        stripe
        highlight-current-row
        :height="height"
        :row-key="rowKey"
        header-cell-class-name="table-head-cell"
        @current-change="handlerRowSelect"
        @row-click="hanlerRowClick"
        @row-dblclick="handleDBclick"
        @selection-change="handlerRowCheck"
        @select="handleSelectionCheck"
        @select-all="handleSelectionCheckAll"
        @sort-change="handlerSortChange">
        <el-table-column
          v-if="currentIndex === 'selection' || currentIndex === 'index'"
          :type="currentIndex"
          :selectable="selectable"
          :reserve-selection='!!rowKey'
          label="序号"
          width="55">
        </el-table-column>
        <template v-if="column.show !== false" v-for="column of tableColumn">
          <el-table-column
            v-if="column.temp"
            :key="column.code"
            :class-name="column.code"
            :prop="column.code"
            :label="column.label"
            :width="column.width"
            :fixed="column.fixed"
            :show-overflow-tooltip="column.tips"
            :sortable="false">
            <template slot-scope="scope">
              <el-button
                v-if="buttonList.edit && column.temp === 'operate'"
                type="text"
                size="mini"
                @click.native.stop="handlerEdit(scope.row, scope.$index, scope.column)">
                编辑
              </el-button>
              <slot
                class="temp-column"
                :name="column.code"
                :row="scope.row"
                :column="scope.column"
                :$index="scope.$index">
              </slot>
            </template>
          </el-table-column>
          <el-table-column
            v-else
            :key="column.code"
            :class-name="column.code"
            :prop="column.code"
            :label="column.label"
            :min-width="column.width || computeColumnWidth(column)"
            :fixed="column.fixed"
            :show-overflow-tooltip="column.tips"
            :sortable="!column.temp && isSortable && column.sort !== false ? 'custom' : false">
          </el-table-column>
        </template>
        <el-table-column
          v-if="buttonList.edit && !$scopedSlots.operate"
          class-name="operate"
          prop="operate"
          label="操作"
          width="100"
          fixed="right">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="mini"
              @click.native.stop="handlerEdit(scope.row, scope.$index, scope.column)">
              编辑
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="bottom-body">
      <div class="comment" v-if="$scopedSlots.comment">
        <slot name="comment" :rows="selectionRows"></slot>
      </div>
      <el-pagination
        v-if="isPagination"
        background
        :layout="layout"
        :current-page="pageNum"
        :page-size="currentPageSize"
        :page-sizes="pageSizes"
        :total="totalSize"
        @size-change="handlerSizeChange"
        @current-change="handlerPageChange">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import zteItem from './zte-item';

export default {
  name: 'zteTable',
  components: {
    zteItem,
  },
  props: {
    searchInfo: {
      type: Array,
      default: () => ([]),
    },
    expendAll: {
      type: Boolean,
      default: false,
    },
    rules: Object,
    tableColumn: {
      type: Array,
      default: () => ([]),
    },
    selectable: Function,
    requestUrl: {
      type: String,
      required: true,
    },
    lablePosition: {
      type: String,
      default: 'left',
    },
    exportUrl: String,
    params: {
      type: Object,
      default: () => ({}),
    },
    autoSearch: {
      type: Boolean,
      default: true,
    },
    indexStyle: {
      type: String,
    },
    rowKey: {
      type: [String, Function],
    },
    checkedRow: {
      type: Array,
      default: () => ([]),
    },
    labelWidth: {
      type: Number,
      default: 100,
    },
    rowSize: {
      type: Number,
      default: 3,
    },
    pageSize: {
      type: Number,
      default: 10,
    },
    pageSizes: {
      type: Array,
      default: () => ([10, 20, 30, 40]),
    },
    isPagination: {
      type: Boolean,
      default: true,
    },
    isSortable: {
      type: Boolean,
      default: false,
    },
    buttonList: {
      type: Object,
      default: () => ({}),
    },
    height: {
      type: [Number, String],
    },
    layout: {
      type: String,
      default: 'total, sizes, prev, pager, next',
    },
    clickToCheck: {
      type: Boolean,
      default: true,
    },
    cancelSearch: {
      type: Boolean,
      default: false,
    },
    excelUrl: {
      type: String,
      default: '/',
    },
  },
  data() {
    return {
      tableData: [],
      totalSize: 0,
      searchForm: {},
      searchExpend: false,
      pageNum: 1,
      currentPageSize: this.pageSize,
      orderField: '',
      order: '',
      defaultRow: 1,
      selectionRows: [],
      exportData: {},
      loadingWait: false,
    };
  },
  computed: {
    searchObj() {
      const { currentPageSize, pageNum, orderField, order } = this;
      const searchObj = {
        orderField,
        order,
        pageNum,
        pageSize: currentPageSize,
      };
      Object.keys(this.searchForm).forEach((key) => {
        if (this.searchForm[key]) {
          if (this.searchForm[key].constructor === Array) {
            this.searchInfo.forEach((item) => {
              if (item.type === 'daterange' && item.code === key) {
                searchObj[item.startCode] = this.searchForm[key][0];
                searchObj[item.endCode] = this.searchForm[key][1];
              }
            });
          } else {
            searchObj[key] = this.searchForm[key];
          }
        }
      });
      return searchObj;
    },
    exportFullUrl() {
      if (this.exportUrl) {
        return this.$http.defaults.baseURL + this.exportUrl;
      }
      return this.exportData;
    },
    widthPercent() {
      return (100 / this.rowSize).toFixed(2);
    },
    expendSize() {
      return this.rowSize * this.defaultRow - 1;
    },
    seachIsMore() {
      return this.searchInfo.filter(item => item.show !== false).length > this.expendSize;
    },
    currentIndex() {
      let indexStyle = this.indexStyle;
      if (this.buttonList && (
        this.buttonList.del ||
        this.buttonList.enable ||
        this.buttonList.disable
      )) {
        indexStyle = 'selection';
      }
      return indexStyle;
    },
  },
  watch: {
    tableData(val) {
      if (this.indexStyle === 'selection' && !!this.rowKey) {
        this.$refs.table.clearSelection();
        if (this.checkedRow.length) {
          for (const newrow of val) {
            if (this.indexOfRowKey(this.checkedRow, newrow) >= 0) {
              this.$refs.table.toggleRowSelection(newrow);
            }
          }
        }
      } else if (this.rowKey) {
        // 当有checkedRow且长度为1的时候,有rowKey传入则视为单选表格
        if (this.checkedRow.length === 1) {
          const singleIndex = this.indexOfRowKey(val, this.checkedRow[0]);
          if (singleIndex >= 0) {
            this.$nextTick(() => {
              this.$refs.table.setCurrentRow(val[singleIndex]);
            });
          }
        }
      }
    },
    checkedRow() {
      this.$refs.table.clearSelection();
      if (this.checkedRow.length) {
        for (const newrow of this.tableData) {
          if (this.indexOfRowKey(this.checkedRow, newrow) >= 0) {
            this.$refs.table.toggleRowSelection(newrow);
          }
        }
      }
    },
    params: {
      deep: true,
      handler() {
        this.getTableData();
      },
    },
  },
  created() {
    this.initForm();
    this.initSelectOptions();
    // 假数据
    // const data = {};
    // this.tableColumn.forEach((item) => {
    //   data[item.code] = 'test';
    // });
    // this.tableData = [data, data, data, data];
  },
  mounted() {
    if (this.autoSearch) {
      this.getTableData();
      this.$emit('search', this.searchObj);
    }
  },
  methods: {
    getTableData() {
      const params = Object.assign({}, this.searchObj, this.params);
      this.exportData = params;
      this.$http.post(this.requestUrl, params).then(
        (res) => {
          res = res.data;
          if (res.ok) {
            this.tableData = res.list || [];
            this.totalSize = res.total;
          }
        },
        () => {},
      ).catch();
    },
    initForm() {
      const form = {};
      this.searchInfo.forEach((info) => {
        if (info.value || info.value === '') {
          form[info.code] = info.value;
        }
      });
      this.searchForm = form;
    },
    initSelectOptions() {
      for (const info of this.searchInfo) {
        if (info.type === 'select') {
          if (info.ajax || info.key) {
            const ajax = info.ajax || `/base/select/list/${info.key}`;
            this.$http.get(ajax).then(
              (res) => {
                res = res.data;
                this.$set(info, 'options', res);
              },
            ).catch();
          } else if (info.fastCode) {
            this.$http.post('common/getByParentKey', { type: info.fastCode }).then(
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
      }
    },
    submitForm() {
      let valiFlag = true;
      if (this.rules) {
        this.$refs.searchForm.validate((valid) => {
          valiFlag = valid;
        });
      }
      if (!valiFlag) {
        return;
      }

      this.pageNum = 1;
      this.getTableData();
      this.$emit('search', this.searchObj);
    },
    resetForm() {
      this.initForm();
      this.$emit('resetForm');
    },
    computeColumnWidth(column) {
      const label = column.label;
      const sort = column.sort !== false && this.isSortable;
      const width = 14;
      let labelWidth = label.length * width + 20;
      labelWidth += sort ? 24 : 0;
      return labelWidth;
    },
    handlerSizeChange(currentSize) {
      this.currentPageSize = currentSize;
      this.pageNum = 1;
      this.getTableData();
      this.$emit('search', this.searchObj);
    },
    handlerPageChange(currentPage) {
      this.pageNum = currentPage;
      this.getTableData();
      this.$emit('search', this.searchObj);
    },
    handlerSortChange({ prop, order }) {
      this.orderField = prop;
      this.order = order === 'ascending' ? 'asc' : 'desc';
      this.getTableData();
      this.$emit('search', this.searchObj);
    },
    handlerRowSelect(currentRow) {
      this.$emit('row-select', currentRow);
    },
    hanlerRowClick(row) {
      if (this.currentIndex === 'selection' && this.clickToCheck && (!this.selectable || this.selectable(row))) {
        this.$refs.table.toggleRowSelection(row);
        this.handleSelectionCheck(this.selectionRows, row);
      }
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
    handlerBack() {
      this.$emit('page-back');
    },
    handlerDeleteRow() {
      if (!this.selectionRows.length) {
        this.$message.warning('请选择一条数据');
        return;
      }
      this.$confirm('是否删除数据?', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.$emit('delete-row', this.selectionRows);
      }).catch();
    },
    handlerSwitch(type) {
      if (!this.selectionRows.length) {
        this.$message.warning('请选择一条数据');
        return;
      }
      this.$emit('switch-status', this.selectionRows, type);
    },
    handlerEdit(row, index, column) {
      this.$emit('edit-row', row, index, column);
    },
    // 导出excel
    handlerExcelExport() {
      this.loadingWait = true;
      const instance = axios.create({
        headers: {
          'Content-Type': 'application/json',
          Authorization: window.localStorage.getItem('Authorization'),
        },
        responseType: 'blob',
        transformRequest: [d => JSON.stringify(d)],
      });
      const params = JSON.parse(JSON.stringify(this.searchObj));
      delete params.pageNum;
      delete params.pageSize;
      instance.post(this.excelUrl, params).then((res) => {
        this.$message.success('导出成功');
        this.loadingWait = false;
        this.download(res.data);
      }).catch(() => {
        this.$message.warning('导出失败');
        this.loadingWait = false;
      });
    },
    // excel下载
    download(data) {
      if (!data) {
        return;
      }
      // 通过window.URL.createObjectURL(new Blob()) . indexOf(location.host) < 0 或 'msSaveOrOpenBlob' in navigator
      // 来检测是否是IE或早期生成Object URL不带域名的Edge。如果表达式返回true则时IE或Edge旧版本。
      if ('msSaveOrOpenBlob' in navigator) {
        // Microsoft Edge and Microsoft Internet Explorer 10-11
        window.navigator.msSaveOrOpenBlob(data, 'excel.xlsx');
      } else {
        // standard code for Google Chrome, Mozilla Firefox etc
        const url = window.URL.createObjectURL(new Blob([data]));
        const link = document.createElement('a');
        link.style.display = 'none';
        link.href = url;
        link.setAttribute('download', 'excel.xlsx');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    },
    // 处理单行checkbox变更，修改checkedRow
    handleSelectionCheck(selection, row) {
      const rowInSelection = selection.indexOf(row);
      const rowInCheckRows = this.indexOfRowKey(this.checkedRow, row);
      if (rowInSelection > -1) {
        if (rowInCheckRows === -1) {
          this.checkedRow.push(row);
        } else if (rowInCheckRows > -1) {
          this.checkedRow[rowInCheckRows] = row;
        }
      }
      if (rowInSelection === -1 && rowInCheckRows > -1) {
        this.checkedRow.splice(rowInCheckRows, 1);
      }
      this.$emit('checkedChange', this.checkedRow);
    },
    // 处理全选checkbox变更，修改checkedRow
    handleSelectionCheckAll(rows) {
      if (rows.length) {
        for (const row of rows) {
          const index = this.indexOfRowKey(this.checkedRow, row);
          if (index === -1) {
            this.checkedRow.push(row);
          } else if (index > -1) {
            this.checkedRow[index] = row;
          }
        }
      } else {
        for (const row of this.tableData) {
          const index = this.indexOfRowKey(this.checkedRow, row);
          if (index > -1) {
            this.checkedRow.splice(index, 1);
          }
        }
      }
      this.$emit('checkedChange', this.checkedRow);
    },
    // 根据rowkey查询index
    indexOfRowKey(array, row) {
      if (array.indexOf(row) >= 0) {
        return array.indexOf(row);
      }
      for (const temprow of array) {
        if ((typeof this.rowKey === 'string' &&
              temprow[this.rowKey] === row[this.rowKey])
            || (this.rowKey instanceof Function &&
              this.rowKey(temprow) === this.rowKey(row))
        ) {
          return array.indexOf(temprow);
        }
      }
      return -1;
    },
    showChange(showLabel, value) {
      this.searchForm[showLabel] = value;
    },
    pickerChange(row) {
      this.$emit('pickerChange', row);
      const keys = Object.keys(row);
      keys.forEach((key) => {
        if (this.searchForm[key] !== undefined) {
          this.searchForm[key] = row[key];
        } else {
          this.$set(this.searchForm, key, row[key]);
        }
      });
    },
    treeChange(showLabel, checked, halfId, halfChecked) {
      this.searchForm[showLabel] = checked;
      this.searchForm[halfId] = halfChecked;
    },
    handlerRangeChange(val, info) {
      if (info.subCode && info.subCode.length === 2) {
        this.searchObj[info.subCode[0]] = val[0];
        this.searchObj[info.subCode[1]] = val[1];
      }
    },
  },
};
</script>

<style lang="scss">
@import "../../assets/scss/theme.scss";

.zte-table {
  div {
    height: 100%;
  }
  [class$=-body] {
    // margin-top: 7px;
    background-color: #fff;
    border-radius: 3px;
    height: auto;
  }
  height: 100%;
  display: flex;
  flex-flow: column nowrap;
  .search-body {
    flex: 0 0 auto;
    padding: 10px 20px 5px 20px;
    margin: 0;
    box-shadow: 0 7px 9px rgba($theme, .04);

    .el-form {
      display: flex;
      flex-flow: row wrap;
      justify-content: flex-start;

      .el-form-item {
        margin-right: 0;
        min-width: 200px;
        margin-bottom:6px;
        .el-form-item__label {
          line-height: 36px;
        }
        .el-form-item__content {
          line-height: 35px;
          padding-right: 50px;
          .el-input__inner {
            // height: 35px;
          }
        }
      }
      .button-list {
        flex: 1 0 auto;
        text-align: right;
        margin-bottom:0px;
        .search-btn {
          float: right;
        }
        .search-slotBtn {
          float: right;
           margin-right: 12px;
        }
        .el-form-item__content {
            margin-left: 0 !important;
        }
      }
    }

    .more {
      text-align: center;
      padding:0 5px;
      cursor: pointer;

      &:hover .icon {
        color: $theme;
      }
    }
  }

  .content-body {
    background-color: transparent;
    // .el-button {
    //   border: 0;
    //   box-shadow: 0 7px 9px rgba($theme, .04);
    //   background-color: #0b7ed7;
    //   color: #fff;
    //   margin-left: 15px;
    // }
    .el-button-group {
      margin-left: 10px;
    }
  }
  .comment {
    // .el-button {
    //   border: 0;
    //   box-shadow: 0 7px 9px rgba($theme, .04);
    //   background-color: #0b7ed7;
    //   color: #fff;
    //   margin-left: 15px;
    //   margin-top: 10px;
    // }
  }
  .table-body {
    flex: 1 1 auto;
    box-shadow: 0 4px 9px rgba($theme, .08);
    display: flex;
    flex-flow: column nowrap;
    justify-content: space-between;
    .el-table {
      .el-table__fixed-header-wrapper {
        height: auto!important;
      }
      .el-table__header-wrapper {
        flex: 0 0 auto;
        height: auto!important;
      }
      .el-table__body-wrapper {
        flex: 1 1 auto;
        overflow-y: auto;
      }
      display: flex;
      flex-flow: column nowrap;
      height: 100% !important;
    }
    .table-head-cell {
      // background-color: $light;
      // color: #fff;
    }
    // th {
    //   text-align: center;
    // }
    td {
      .el-button {
        padding-top: 0;
        padding-bottom: 0;
      }
    }
    .el-table-column--selection {
      text-align: center;
      // .is-indeterminate .el-checkbox__inner::before {
      //   transform: scale(0.5, 1);
      // }
      // .el-checkbox__inner::after {
      //   border-width: 2px;
      //   top: 0;
      // }
    }
    .el-pagination {
      text-align: right;
      padding: 10px;
      font-weight: normal;
    }
  }
  .bottom-body {
    min-height: 30px;
    margin-top: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .comment {
      padding: 10px;
    }
    .el-pagination {
      flex: 1 1 auto;
      text-align: right;
      padding: 10px;
      font-weight: normal;
    }
  }
}

.el-dialog__body {
  .zte-table {
    .content-body {
      .el-button {
        border: 1px solid #dcdfe6;
        box-shadow: none;
      }
    }
  }
}
</style>
