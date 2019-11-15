<template>
  <div class="msgList">
    <zte-table
      ref="msgList"
      request-url="/messageBoard/list"
      indexStyle="index"
      :rowSize='2'
      :tableColumn="tableColumn">
      <template slot="operate" slot-scope="{ row }">
        <el-button type="text" @click.native="viewMsg(row)">查看</el-button>
      </template>
      <template slot="liuyanzhe" slot-scope="{ row }">
        <el-button type="text" @click.native="viewReleaser(row)">{{ row.liuyanzhe }}</el-button>
      </template>
    </zte-table>
    <el-dialog
      width="40%"
      class="msgForm"
      v-if="msgVisible"
      :visible.sync="msgVisible"
      title="留言详情">
      <zte-form
        :itemInfo="msgItemInfo"
        :form="msgForm"
        :isSubmit='false'
        :isCancel='false'>
      </zte-form>
    </el-dialog>
    <el-dialog
      width="50%"
      v-if="releaserInfoVisible"
      :visible.sync="releaserInfoVisible"
      title="发布者详情">
      <viewForm :formData="releaserForm" :userType="userType"></viewForm>
      <!-- 行业table -->
      <chooseIndustry
        :tableColumn='industryTableColumn'
        :tableData='receiveIndustryList'
        :disabled="true">
      </chooseIndustry>
    </el-dialog>
  </div>
</template>

<script>
import publicForm from '../modules/publicForm';
import viewForm from '../modules/viewForm';

export default {
  name: 'msgList',
  components: { publicForm, viewForm },
  data() {
    return {
      // 留言详情
      msgVisible: false,
      msgItemInfo: [
        {
          code: 'mobileNumber',
          label: '手机号码',
          type: 'text',
          disabled: true,
        },
        {
          code: 'content',
          label: '留言板',
          type: 'textarea',
          disabled: true,
        },
      ],
      msgForm: {},
      // 发布者详情弹窗
      releaserInfoVisible: false,
      userType: '',
      releaserForm: {},
      industryTableColumn: [
        {
          label: '行业名称',
          code: 'industryName',
        },
        {
          label: '行业标签',
          code: 'industryLabelName',
        },
      ],
      receiveIndustryList: [],
      tableColumn: [
        {
          code: 'operate',
          label: '操作',
          temp: 'operate',
        },
        // {
        //   label: '标题',
        //   code: 'title',
        // },
        // {
        //   label: '留言者',
        //   code: 'liuyanzhe',
        //   temp: 'liuyanzhe',
        // },
        {
          label: '联系电话',
          code: 'mobileNumber',
        },
        {
          label: '留言内容',
          code: 'content',
        },
        {
          label: '时间',
          code: 'createdDt',
        },
      ],
    };
  },
  created() {},
  methods: {
    viewMsg(row) {
      this.msgVisible = true;
      this.msgForm = row;
    },
    viewReleaser(row) {
      const params = { userId: row.userId };
      this.$http.post('user/info', params).then(
        (res) => {
          const info = res.data.info;
          if (!info) return;
          this.releaserForm = info;
          this.receiveIndustryList = info.belongIndustryList;
          this.userType = info.userType;
          this.releaserInfoVisible = true;
        },
        () => {},
      );
    },
  },
};
</script>

<style lang="scss">
.msgList {
  .el-cascader {
    width: 100%;
  }
  .receiveBotton {
    width: 100%!important;
    .el-form-item__content {
      text-align: right;
    }
  }
  .dialogForm {
    .ue {
      padding-top: 30px;
    }
  }
  .msgTitle {
    color: #303133;
    text-align: center;
    font-size: 24px;
    padding: 10px 0;
  }
  .msgTips {
    color: #606266;
    text-align: center;
    font-size: 16px;
    line-height: 25px;
    margin-top: 10px;
    margin-bottom: 30px;
  }
  .msgForm {
    .el-textarea__inner, .el-input__inner {
      width: 90%;
      background: #fff;
      color: #606266;
      font-size: 14px;
    }
  }
}
</style>
