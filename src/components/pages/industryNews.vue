<template>
  <div class="industryNews">
    <zte-table
      ref="industryNews"
      request-url="industryNews/list"
      indexStyle="index"
      :rowSize='2'
      :searchInfo="itemInfo"
      :tableColumn="tableColumn"
      :buttonList="{ add: true }"
      @add-row="addRow">
      <template slot="operate" slot-scope="{ row }">
        <el-button type="text" @click.native="edit(row)">编辑</el-button>
        <!-- <el-button type="text" :disabled="row.enabled === 'N'" @click.native="cancelSend(row)">{{ row.enabled === 'Y' ? '取消发布' : '发布'}}</el-button> -->
        <el-button type="text" @click.native="delet(row)">删除</el-button>
        <el-button type="text" @click.native="view(row)">查看</el-button>
      </template>
      <template slot="matcherUser" slot-scope="{ row }">
        <el-button type="text" @click.native="viewMatcherUser(row)">{{ row.matcherUser }}</el-button>
      </template>
    </zte-table>
    <el-dialog
      fullscreen
      :modal='false'
      v-if="detailDialogVisible"
      :visible.sync="detailDialogVisible"
      :title="isEdit ? '修改行业消息' : '发布行业消息'">
      <publicForm
        :disabled='disabled'
        :itemInfo='dialogItemInfo'
        :formData='dialogFormData'
        :industryData='industryData'
        :defaultMsg='defaultMsg'
        @reset="detailDialogVisible = false"
        @submit='handleSubmit'>
      </publicForm>
    </el-dialog>
    <!-- 查看消息 -->
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
        :needHandle="{ collect: false, complaint: false, blacklist: false }">
      </viewMsg>
    </el-dialog>
    <!-- 查看匹配用户 -->
    <el-dialog
      v-if="matcherUserVisible"
      :visible.sync="matcherUserVisible"
      title="匹配用户详情">
      <zte-table
        width="65%"
        ref="matcherUser"
        class="matcherUser"
        request-url="/industryNews/lookMatcherUser"
        indexStyle="index"
        :rowSize='3'
        :labelWidth="70"
        :params="{ industryNewsId }"
        :searchInfo="matcherUserItemInfo"
        :tableColumn="matcherUserTableColumn"
        style="height:400px;">
        <template slot="searchText">
          <el-button size="mini" icon="el-icon-refresh-left" @click.native="refresh">刷新</el-button>
        </template>
        <template slot="operate" slot-scope="{ row }">
          <!-- <el-button type="text" @click.native="edit(row)">编辑</el-button>
          <el-button type="text" :disabled="row.enabled === 'N'" @click.native="cancelSend(row)">{{ row.enabled === 'Y' ? '取消发布' : '发布'}}</el-button> -->
          <el-button type="text" @click.native="delet(row)">删除</el-button>
          <el-button type="text" @click.native="view(row)">查看</el-button>
        </template>
        <template slot="userName" slot-scope="{ row }">
          <el-button type="text" @click.native="viewReleaserInfo(row)">{{ row.userName }}</el-button>
        </template>
      </zte-table>
    </el-dialog>
    <el-dialog
      width="45%"
      v-if="userDetailVisible"
      :visible.sync="userDetailVisible"
      title="用户详情">
      <viewForm :formData="releaserForm" :userType="userType"></viewForm>
      <!-- 行业table -->
      <chooseIndustry
        v-if="isPerson"
        :tableColumn='industryTableColumn'
        :tableData='userReceiveIndustryList'
        :disabled="true">
      </chooseIndustry>
    </el-dialog>
  </div>
</template>

<script>
import publicForm from '../modules/publicForm';
import chooseIndustry from '../modules/chooseIndustry';
import viewMsg from '../modules/viewMsg';
import viewForm from '../modules/viewForm';

export default {
  name: 'industryNews',
  components: { publicForm, chooseIndustry, viewMsg, viewForm },
  data() {
    const isPerson = JSON.parse(window.localStorage.getItem('userData')).userType === 'Z001002';
    return {
      isPerson,
      itemInfo: [
        {
          code: 'title',
          label: '行业消息标题',
          type: 'text',
        },
      ],
      tableColumn: [
        {
          code: 'operate',
          label: '操作',
          temp: 'operate',
          width: 170,
        },
        {
          label: '标题',
          code: 'title',
        },
        {
          label: '消息类型',
          code: 'messageType',
        },
        {
          label: '接收目标类型',
          code: 'receiveObject',
        },
        {
          label: '发布时间',
          code: 'createdDt',
        },
        {
          label: '发布地区',
          code: 'fullName',
        },
        {
          label: '匹配用户',
          code: 'matcherUser',
          temp: 'matcherUser',
        },
      ],
      // 弹窗数据配置
      detailDialogVisible: false,
      disabled: false,
      dialogItemInfo: [
        {
          code: 'title',
          label: '标题：',
          type: 'text',
          itemWidth: 100,
        },
        // {
        //   code: 'province',
        //   label: '省',
        //   type: 'select',
        //   showLabel: 'provinceName',
        //   options: [],
        //   optionProps: {
        //     label: 'name',
        //     value: 'id',
        //   },
        //   ajax: 'city/list',
        //   next: { city: 'parentId' },
        //   associated: ['city', 'area', 'street'],
        //   itemWidth: 25,
        //   params: { parentId: '0' },
        // },
        // {
        //   code: 'city',
        //   label: '市',
        //   type: 'select',
        //   showLabel: 'cityName',
        //   options: [],
        //   optionProps: {
        //     label: 'name',
        //     value: 'id',
        //   },
        //   ajax: 'city/list',
        //   next: { area: 'parentId' },
        //   associated: ['area', 'street'],
        //   itemWidth: 25,
        // },
        // {
        //   code: 'area',
        //   label: '区',
        //   type: 'select',
        //   showLabel: 'areaName',
        //   options: [],
        //   optionProps: {
        //     label: 'name',
        //     value: 'id',
        //   },
        //   ajax: 'city/list',
        //   next: { street: 'parentId' },
        //   associated: ['street'],
        //   itemWidth: 25,
        // },
        // {
        //   code: 'street',
        //   label: '街道',
        //   type: 'select',
        //   showLabel: 'streetName',
        //   options: [],
        //   optionProps: {
        //     label: 'name',
        //     value: 'id',
        //   },
        //   ajax: 'city/list',
        //   itemWidth: 25,
        // },
        {
          code: 'receiveObject',
          label: '接收对象：',
          type: 'check',
          options: [],
          optionProps: {
            label: 'value',
            value: 'key',
          },
          fastCode: 'Z001000',
          itemWidth: 100,
          checkAll: true,
        },
        {
          code: 'messageType',
          label: '消息类型：',
          type: 'radio',
          options: [],
          optionProps: {
            label: 'value',
            value: 'key',
          },
          fastCode: 'Z003000',
          itemWidth: 100,
        },
        {
          label: '接收行业：',
          code: 'receiveBotton',
          type: 'temp',
          itemWidth: 100,
        },
      ],
      dialogFormData: {},
      // 行业industryData
      industryData: [],
      // 富文本配置
      defaultMsg: '',
      // 行id
      industryNewsId: '',
      isEdit: false,
      // 消息详情弹窗
      msgDetailVisible: false,
      msgData: {},
      receiveIndustryList: [],
      // 匹配用户
      matcherUserVisible: false,
      matcherUserItemInfo: [
        {
          label: '用户类型',
          code: 'userType',
          type: 'select',
          options: [
            {
              value: 'Z001001',
              label: '企业用户',
            },
            {
              value: 'Z001002',
              label: '个体用户',
            },
          ],
        },
        {
          code: 'userName',
          label: '用户名称',
          type: 'text',
        },
      ],
      matcherUserTableColumn: [
        {
          label: '用户类型',
          code: 'userType',
        },
        {
          label: '用户名称',
          code: 'userName',
          temp: 'userName',
        },
        {
          label: '联系方式',
          code: 'mobileNumber',
        },
      ],
      userDetailVisible: false,
      userType: '',
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
      userReceiveIndustryList: [],
      releaserForm: {},
    };
  },
  created() {},
  methods: {
    viewReleaserInfo(row) {
      const params = { userId: row.userId };
      this.$http.post('user/info', params).then(
        (res) => {
          const info = res.data.info;
          if (!info) return;
          this.releaserForm = info;
          this.userReceiveIndustryList = info.belongIndustryList;
          this.userType = info.userType;
          this.userDetailVisible = true;
        },
        () => {},
      );
    },
    addRow() {
      this.detailDialogVisible = true;
      this.isEdit = false;
      this.dialogFormData = {};
      this.industryData = [];
      this.defaultMsg = '';
    },
    view(row) {
      this.industryNewsId = row.id;
      const params = { industryNewsId: row.id };
      this.$http.post('industryNews/findById', params).then(
        (res) => {
          res = res.data;
          if (res.industryNews) {
            const data = res.industryNews;
            this.msgData = data;
            this.defaultMsg = data.content;
            this.receiveIndustryList = data.reviceIndustryList;
            this.msgDetailVisible = true;
          }
        },
        () => {},
      );
    },
    viewMatcherUser(row) {
      this.industryNewsId = row.id;
      this.matcherUserVisible = true;
    },
    refresh() {
      const industryNewsId = this.industryNewsId;
      this.$http.post('/industryNews/matcherUserRefresh', { industryNewsId }).then(
        () => {
          this.$refs.matcherUser.getTableData();
        },
        () => {},
      );
    },
    edit(row) {
      this.industryNewsId = row.id;
      const params = { industryNewsId: row.id };
      this.$http.post('industryNews/findById', params).then(
        (res) => {
          res = res.data;
          if (res.industryNews) {
            this.industryData = res.industryNews.reviceIndustryList;
            const formData = JSON.parse(JSON.stringify(res.industryNews));
            delete formData.reviceIndustryList;
            this.defaultMsg = formData.content;
            this.dialogFormData = formData;
            this.detailDialogVisible = true;
            this.isEdit = true;
          }
        },
        () => {},
      );
    },
    delet(row) {
      const industryNewsId = row.id;
      this.$confirm('是否删除该条数据', '提示', { type: 'warning' }).then(() => {
        this.$http.post('industryNews/delete', { industryNewsId }).then(
          () => {
            this.$message.success('删除成功');
            this.$refs.industryNews.getTableData();
          },
          () => {},
        );
      });
    },
    cancelSend(row) {
      const industryNewsId = row.id;
      const enabled = row.enabled === 'Y' ? 'N' : 'Y';
      this.$http.post('recruitmentNews/cancelOrOpen', { industryNewsId, enabled }).then(
        () => {
          this.$message.success('操作成功');
          this.$refs.industryNews.getTableData();
        },
        () => {},
      );
    },
    // 弹窗-提交
    handleSubmit(obj) {
      const url = this.isEdit ? 'industryNews/update' : 'industryNews/save';
      const params = this.isEdit ? Object.assign(obj, { industryNewsId: this.industryNewsId }) : obj;
      this.$http.post(url, params).then(
        () => {
          this.$message.success('发布成功');
          this.detailDialogVisible = false;
          this.$refs.industryNews.getTableData();
        },
        () => {},
      );
    },
  },
};
</script>

<style lang="scss">
.industryNews {
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
  .matcherUser {
    .el-form {
      // flex-wrap: nowrap!important;
      .el-form-item__content {
        padding-right: 20px!important;
      }
      .button-list {
        width: 290px!important;
        min-width: 280px!important;
        flex: none!important;
      }
    }
  }
}
</style>
