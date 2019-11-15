<template>
  <div class="index">
    <zte-table
      ref="industry"
      indexStyle="index"
      requestUrl="receiveNews/industry/list"
      :searchInfo="itemInfo"
      :tableColumn="tableColumn">
      <template slot="operate" slot-scope="{ row }">
        <el-button type="text" :disabled="row.isBlack === 'Y'" @click.native="handleBlack(row)">添加黑名单</el-button>
        <el-button type="text" :disabled="row.isCollect === 'Y'" @click.native="handleCollect(row)">添加收藏</el-button>
      </template>
      <template slot="publisher" slot-scope="{ row }">
        <el-button type="text" size="mini" @click.native="viewReleaserInfo(row)">{{row.publisher}}</el-button>
      </template>
      <template slot="title" slot-scope="{ row }">
        <el-button type="text" size="mini" @click.native="viewMsgInfo(row)">{{row.title}}</el-button>
      </template>
    </zte-table>
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
      v-if="msgDetailVisible"
      class="shot_height"
      :visible.sync="msgDetailVisible"
      title="消息详情">
      <viewMsg
        :msgData="msgData"
        :receiveIndustryList="receiveIndustryList"
        :defaultMsg="defaultMsg"
        :needHandle="{ collect: true, complaint: true, blacklist: false }"
        :blackUserId="newsId"
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
  name: 'index',
  components: { chooseIndustry, viewForm, viewMsg },
  data() {
    return {
      itemInfo: [
        {
          code: 'title',
          label: '标题',
          type: 'text',
          itemWidth: 50,
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
      isCollect: false,
      isComplaint: false,
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
        },
        () => {},
      );
    },
  },
};
</script>

<style lang='scss'>
.index {
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
