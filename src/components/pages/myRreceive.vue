<template>
  <div class="myRreceive">
    <el-tabs v-model="tabLabel"  type="border-card">
      <el-tab-pane label="行业消息接收" name="industry">
        <zte-table
          ref="industry"
          indexStyle="index"
          requestUrl="receiveNews/industry/list"
          :searchInfo="itemInfo"
          :tableColumn="tableColumn">
          <template slot="operate" slot-scope="{ row }">
            <el-button type="text" :disabled="row.isBlack === 'Y'" @click.native="handleBlack(row)">添加黑名单</el-button>
            <el-button type="text" :disabled="row.isCollection === 'Y'" @click.native="handleCollect(row)">添加收藏</el-button>
          </template>
          <template slot="publisher" slot-scope="{ row }">
            <el-button type="text" size="mini" @click.native="viewReleaserInfo(row)">{{row.publisher}}</el-button>
          </template>
          <template slot="title" slot-scope="{ row }">
            <el-button type="text" size="mini" @click.native="viewMsgInfo(row)">{{row.title}}</el-button>
          </template>
        </zte-table>
      </el-tab-pane>
      <el-tab-pane :label="`${userType === 'Z001002' ? '应聘' : '招聘'}消息接收`" name="recruitment">
        <zte-table
          ref="recruitment"
          indexStyle="index"
          requestUrl="receiveNews/recruitment/list"
          :searchInfo="itemInfo"
          :tableColumn="tableColumn">
          <template slot="operate" slot-scope="{ row }">
            <el-button type="text" :disabled="row.isBlack === 'Y'" @click.native="handleBlack(row)">添加黑名单</el-button>
            <el-button type="text" :disabled="row.isCollection === 'Y'" @click.native="handleCollect(row)">添加收藏</el-button>
          </template>
          <template slot="publisher" slot-scope="{ row }">
            <el-button type="text" size="mini" @click.native="viewReleaserInfo(row)">{{row.publisher}}</el-button>
          </template>
          <template slot="title" slot-scope="{ row }">
            <el-button type="text" size="mini" @click.native="viewMsgInfo(row)">{{row.title}}</el-button>
          </template>
        </zte-table>
      </el-tab-pane>
    </el-tabs>
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
    <el-dialog
      width="60%"
      class="shot_height"
      v-if="msgDetailVisible"
      :visible.sync="msgDetailVisible"
      title="消息详情">
      <viewMsg
        :msgData="msgData"
        :receiveIndustryList="receiveIndustryList"
        :defaultMsg="defaultMsg"
        :needHandle="{ collect: true, complaint: true, blacklist: true }"
        :blackUserId="useId"
        :newsId="rowId">
      </viewMsg>
    </el-dialog>
  </div>
</template>

<script type='text/javascript'>
import chooseIndustry from '../modules/chooseIndustry';
import viewForm from '../modules/viewForm';
import viewMsg from '../modules/viewMsg';

export default {
  name: 'myRreceive',
  components: { chooseIndustry, viewForm, viewMsg },
  data() {
    return {
      tabLabel: 'industry',
      itemInfo: [
        {
          code: 'title',
          label: '标题',
          type: 'text',
          itemWidth: 60,
        },
      ],
      tableColumn: [
        // {
        //   code: 'operate',
        //   label: '操作',
        //   temp: 'operate',
        // },
        {
          code: 'publisher',
          label: '发布者名称',
          temp: 'publisher',
        },
        {
          code: 'title',
          label: '消息标题',
          temp: 'title',
        },
        {
          code: 'messageType',
          label: '消息类型',
        },
        {
          code: 'createdDt',
          label: '发布时间',
        },
        {
          code: 'isRead',
          label: '阅读状态',
        },
      ],
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
      // 消息详情弹窗
      msgDetailVisible: false,
      msgData: {},
      defaultMsg: '',
      rowId: '',
      useId: '',
    };
  },
  created() {
  },
  methods: {
    viewReleaserInfo(row) {
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
    viewMsgInfo(row) {
      let params = {};
      let url = '';
      if (row.industryNewsId) {
        params = { industryNewsId: row.industryNewsId };
        url = 'industryNews/findById';
      }
      if (row.recruitmentNewsId) {
        params = { recruitmentNewsId: row.recruitmentNewsId };
        url = 'recruitmentNews/findById';
      }
      this.$http.post(url, params).then(
        (res) => {
          const data = res.data.industryNews || res.data.recruitmentNews;
          if (!data) return;
          this.msgData = data;
          this.defaultMsg = data.content;
          this.receiveIndustryList = data.reviceIndustryList;
          this.msgDetailVisible = true;
          this.rowId = row.industryNewsId || row.recruitmentNewsId;
          this.useId = row.userId;
        },
        () => {},
      );
    },
    handleBlack(row) {
      this.$confirm('是否将其加入黑名单', '提示', { type: 'warning' }).then(() => {
        const params = { blackUserId: row.userId };
        this.$http.post('blacklist/save', params).then(
          () => {
            this.$message.success('添加成功');
            this.$refs.recruitment.getTableData();
            this.$refs.industry.getTableData();
          },
          () => {},
        );
      });
    },
    handleCollect(row) {
      const params = { newsId: row.industryNewsId || row.recruitmentNewsId };
      this.$http.post('collection/save', params).then(
        () => {
          this.$message.success('添加成功');
          this.$refs.recruitment.getTableData();
          this.$refs.industry.getTableData();
        },
        () => {},
      );
    },
  },
};
</script>

<style lang='scss'>
.myRreceive {
  .el-tabs {
    height: 100%;
    .search-body {
      padding-top: 20px !important;
    }
    .table-head {
      width: 100%;
      height: 30px;
      padding: 8px 10px 2px 10px;
      position: relative;
      top: 7px;
      .table-head-title {
        float: left;
        width: 100px;
      }
      .table-head-btn {
        float: right;
        .el-button {
          padding: 0;
        }
      }
    }
    .el-tabs__content {
      height: 93%;
      .el-tab-pane {
        height: 100%;
      }
    }
  }
}
</style>
