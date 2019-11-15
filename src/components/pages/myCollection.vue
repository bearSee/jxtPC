<template>
  <div class="myCollection">
    <el-tabs v-model="tabLabel"  type="border-card">
      <el-tab-pane label="行业消息收藏" name="industryNews">
        <zte-table
          ref="industry"
          indexStyle="index"
          requestUrl="collection/industryNews/list"
          :tableColumn="tableColumn">
          <template slot="operate" slot-scope="{ row }">
            <el-button type="text" @click.native="handleDelet(row)">取消收藏</el-button>
          </template>
          <template slot="publisher" slot-scope="{ row }">
            <el-button type="text" size="mini" @click.native="viewReleaserInfo(row)">{{row.publisher}}</el-button>
          </template>
          <template slot="title" slot-scope="{ row }">
            <el-button type="text" size="mini" @click.native="viewMsgInfo(row)">{{row.title}}</el-button>
          </template>
        </zte-table>
      </el-tab-pane>
      <el-tab-pane :label="`${userType === 'Z001002' ? '应聘' : '招聘'}消息收藏`" name="recruitmentNews">
        <zte-table
          ref="recruitment"
          indexStyle="index"
          requestUrl="collection/recruitmentNews/list"
          :tableColumn="tableColumn">
          <template slot="operate" slot-scope="{ row }">
            <el-button type="text" @click.native="handleDelet(row)">取消收藏</el-button>
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
      v-if="msgDetailVisible"
      class="shot_height"
      :visible.sync="msgDetailVisible"
      title="消息详情">
      <viewMsg
        :msgData="msgData"
        :receiveIndustryList="receiveIndustryList"
        :defaultMsg="defaultMsg"
        :needHandle="{ collect: true, complaint: true, blacklist: false }"
        :newsId="newsId"
        :blackUserId="blackUserId">
      </viewMsg>
    </el-dialog>
  </div>
</template>

<script type='text/javascript'>
import chooseIndustry from '../modules/chooseIndustry';
import viewForm from '../modules/viewForm';
import viewMsg from '../modules/viewMsg';

export default {
  name: 'myCollection',
  components: { chooseIndustry, viewForm, viewMsg },
  data() {
    return {
      tabLabel: 'industryNews',
      deletUrl: {
        industryNews: 'collection/delete',
        recruitmentNews: 'collection/delete',
      },
      tableColumn: [
        {
          code: 'operate',
          label: '操作',
          temp: 'operate',
        },
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
          code: 'publishDt',
          label: '发布时间',
        },
        {
          code: 'collectionDt',
          label: '收藏时间',
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
      newsId: '',
      blackUserId: '',
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
      let params = { recruitmentNewsId: row.newsId };
      let url = 'recruitmentNews/findById';
      if (this.tabLabel === 'industryNews') {
        params = { industryNewsId: row.newsId };
        url = 'industryNews/findById';
      }
      this.newsId = row.newsId;
      this.blackUserId = row.userId;
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
    handleDelet(row) {
      this.$confirm('是否取消收藏', '提示', { type: 'warning' }).then(() => {
        this.$http.post(this.deletUrl[this.tabLabel], { newsId: row.newsId }).then(
          () => {
            this.$message.success('操作成功');
            this.$refs.recruitment.getTableData();
            this.$refs.industry.getTableData();
          },
          () => {},
        );
      });
    },
  },
};
</script>

<style lang='scss'>
.myCollection {
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
