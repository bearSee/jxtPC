<template>
  <div class="reportAudit">
    <zte-table
      ref="reportAudit"
      indexStyle="index"
      requestUrl="complaint/list"
      :tableColumn="tableColumn">
      <template slot="publisherName" slot-scope="{ row }">
        <el-button type="text" size="mini" @click.native="viewReleaserInfo(row)">{{row.publisherName}}</el-button>
      </template>
      <template slot="title" slot-scope="{ row }">
        <el-button type="text" size="mini" @click.native="viewMsgInfo(row)">{{row.title}}</el-button>
      </template>
      <template slot="operate" slot-scope="{ row }">
        <!-- <el-button type="text" @click.native="handleReject(row)">驳回</el-button> -->
        <el-button type="text" @click.native="handleDelet(row)">关闭</el-button>
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
        :needHandle="{ collect: true, complaint: true, blacklist: true }">
      </viewMsg>
    </el-dialog>
  </div>
</template>

<script type='text/javascript'>
import chooseIndustry from '../modules/chooseIndustry';
import viewForm from '../modules/viewForm';
import viewMsg from '../modules/viewMsg';

export default {
  name: 'reportAudit',
  components: { chooseIndustry, viewForm, viewMsg },
  data() {
    return {
      tableColumn: [
        {
          code: 'operate',
          label: '操作',
          temp: 'operate',
          width: 200,
        },
        {
          code: 'publisherName',
          label: '发布者名称',
          temp: 'publisherName',
          width: 180,
        },
        {
          code: 'title',
          label: '消息标题',
          temp: 'title',
          width: 350,
        },
        {
          code: 'createdDt',
          label: '发布时间',
        },
        {
          code: 'complaintCount',
          label: '举报次数',
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
    };
  },
  created() {
  },
  methods: {
    viewMsgInfo(row) {
      let params = {};
      let url = '';
      if (row.newsType === 'I') {
        params = { industryNewsId: row.newsId };
        url = 'industryNews/findById';
      } else {
        params = { recruitmentNewsId: row.newsId };
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
        },
        () => {},
      );
    },
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
    handleReject(row) {
      const params = row;
      this.$http.post('', params).then(
        () => {
        },
        () => {},
      );
    },
    handleDelet(row) {
      const { newsId } = row;
      this.$http.post('complaint/close', { newsId }).then(
        (res) => {
          if (res.data.ok) this.$message.success('关闭成功');
          this.$refs.reportAudit.getTableData();
        },
        () => {},
      );
    },
  },
};
</script>

<style lang='scss'>
.reportAudit {
}
</style>
