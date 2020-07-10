<template>
  <div class="recruitmentNews">
    <zte-table
      ref="recruitmentNews"
      request-url="recruitmentNews/list"
      indexStyle="index"
      :rowSize='2'
      :searchInfo="itemInfo"
      :tableColumn="tableColumn"
      :buttonList="{ add: true }"
      @add-row="addRow">
      <template slot="operate" slot-scope="{ row }">
        <el-button type="text" @click.native="edit(row)">编辑</el-button>
        <el-button type="text" @click.native="cancelSend(row)">{{ row.enabled === 'Y' ? '取消发布' : '发布'}}</el-button>
        <el-button type="text" @click.native="delet(row)">删除</el-button>
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
      :title="`${isEdit ? '修改' : '发布'}${isPerson ? '应聘' : '招聘'}消息`">
      <publicForm
        ref="publicForm"
        :disabled='disabled'
        :hideReceiveOprate="hideReceiveOprate"
        :itemInfo='dialogItemInfo'
        :formData='dialogFormData'
        :industryData='industryData'
        :defaultMsg='defaultMsg'
        @check-change="checkChange"
        @reset="detailDialogVisible = false"
        @submit='handleSubmit'>
      </publicForm>
    </el-dialog>
    <!-- 查看匹配用户 -->
    <el-dialog
      v-if="matcherUserVisible"
      :visible.sync="matcherUserVisible"
      title="匹配用户详情">
      <zte-table
        width="60%"
        ref="matcherUser"
        class="matcherUser"
        request-url="/recruitmentNews/lookMatcherUser"
        indexStyle="index"
        :rowSize='3'
        :labelWidth="70"
        :params="{ recruitmentNewsId }"
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
import viewForm from '../modules/viewForm';
import chooseIndustry from '../modules/chooseIndustry';

export default {
  name: 'recruitmentNews',
  components: { publicForm, viewForm, chooseIndustry },
  data() {
    const isPerson = JSON.parse(window.localStorage.getItem('userData')).userType === 'Z001002';
    const otherItemInfo = isPerson ? [
      {
        code: 'province',
        label: `${isPerson ? '应聘' : '招聘'}地址：`,
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
    ] : [];
    return {
      isPerson,
      itemInfo: [
        {
          code: 'title',
          label: '消息标题',
          type: 'text',
        },
      ],
      tableColumn: [
        {
          code: 'operate',
          label: '操作',
          temp: 'operate',
          width: 200,
        },
        {
          code: 'title',
          label: '标题',
        },
        {
          code: 'recruitmentWork',
          label: `${isPerson ? '应聘' : '招聘'}工种`,
        },
        {
          code: 'recruitmentProfessional',
          label: `${isPerson ? '应聘' : '招聘'}专业`,
        },
        {
          code: 'recruitmentPosition',
          label: `${isPerson ? '应聘' : '招聘'}岗位`,
        },
        {
          label: '接收地区',
          code: 'fullName',
        },
        {
          label: '发布时间',
          code: 'createdDt',
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
        ...otherItemInfo,
        // {
        //   code: 'receiveObject',
        //   label: '接收对象',
        //   type: 'radio',
        //   options: [],
        //   optionProps: {
        //     label: 'value',
        //     value: 'key',
        //   },
        //   fastCode: 'Z001000',
        //   itemWidth: 100,
        // },
        {
          code: 'recruitmentWork',
          label: `${isPerson ? '应聘' : '招聘'}工种：`,
          type: 'radio',
          options: [],
          optionProps: {
            label: 'value',
            value: 'key',
          },
          fastCode: 'Z004000',
          itemWidth: 100,
        },
        {
          code: 'recruitmentProfessional',
          label: `${isPerson ? '应聘' : '招聘'}专业：`,
          type: 'radio',
          options: [],
          fastCode: 'Z005000',
          itemWidth: 100,
        },
        {
          code: 'recruitmentPosition',
          label: `${isPerson ? '应聘' : '招聘'}岗位：`,
          type: 'radio',
          options: [],
          fastCode: 'Z006000',
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
      recruitmentNewsId: '',
      isEdit: false,
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
  methods: {
    checkChange(val, info) {
      if (info.code === 'recruitmentProfessional') {
        const { bizType } = info.options.find(({ key }) => key === val[0]);
        // bizType为2隐藏岗位radio和行业选择
        this.hideReceiveOprate = bizType === '2';
        const receiveBottonIndex = this.dialogItemInfo.findIndex(({ code }) => code === 'receiveBotton');
        const recruitmentPositionIndex = this.dialogItemInfo.findIndex(({ code }) => code === 'recruitmentPosition');
        this.$set(this.dialogItemInfo[receiveBottonIndex], 'show', !this.hideReceiveOprate);
        this.$set(this.dialogItemInfo[recruitmentPositionIndex], 'show', !this.hideReceiveOprate);

        let form = {};
        if (this.$refs.publicForm && this.$refs.publicForm.$refs.form) form = this.$refs.publicForm.$refs.form.currentForm || {};
        if (this.hideReceiveOprate && this.$refs.publicForm) this.$refs.publicForm.receiveIndustryList = [];
        this.dialogFormData = {
          ...this.dialogFormData,
          ...form,
          bizType,
          recruitmentPosition: this.hideReceiveOprate ? '' : form.recruitmentPosition,
        };
      }
    },
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
    viewMatcherUser(row) {
      this.recruitmentNewsId = row.id;
      this.matcherUserVisible = true;
    },
    refresh() {
      const recruitmentNewsId = this.recruitmentNewsId;
      this.$http.post('/recruitmentNews/matcherUserRefresh', { recruitmentNewsId }).then(
        () => {
          this.$refs.matcherUser.getTableData();
        },
        () => {},
      );
    },
    edit(row) {
      this.recruitmentNewsId = row.id;
      const params = { recruitmentNewsId: row.id };
      this.$http.post('recruitmentNews/findById', params).then(
        (res) => {
          res = res.data;
          if (res.recruitmentNews) {
            this.industryData = res.recruitmentNews.reviceIndustryList;
            const formData = JSON.parse(JSON.stringify(res.recruitmentNews));
            delete formData.reviceIndustryList;
            this.dialogFormData = formData;
            this.defaultMsg = formData.content;
            this.detailDialogVisible = true;
            this.isEdit = true;
            this.$nextTick(() => {
              // bizType为2隐藏岗位radio和行业选择
              this.hideReceiveOprate = formData.bizType === '2';
              const receiveBottonIndex = this.dialogItemInfo.findIndex(({ code }) => code === 'receiveBotton');
              const recruitmentPositionIndex = this.dialogItemInfo.findIndex(({ code }) => code === 'recruitmentPosition');
              this.$set(this.dialogItemInfo[receiveBottonIndex], 'show', !this.hideReceiveOprate);
              this.$set(this.dialogItemInfo[recruitmentPositionIndex], 'show', !this.hideReceiveOprate);
            });
          }
        },
        () => {},
      );
    },
    delet(row) {
      const recruitmentNewsId = row.id;
      this.$confirm('是否删除该条数据', '提示', { type: 'warning' }).then(() => {
        this.$http.post('recruitmentNews/delete', { recruitmentNewsId }).then(
          () => {
            this.$message.success('删除成功');
            this.$refs.recruitmentNews.getTableData();
          },
          () => {},
        );
      });
    },
    cancelSend(row) {
      const recruitmentNewsId = row.id;
      const enabled = row.enabled === 'Y' ? 'N' : 'Y';
      this.$http.post('recruitmentNews/cancelOrOpen', { recruitmentNewsId, enabled }).then(
        () => {
          this.$message.success('操作成功');
          this.$refs.recruitmentNews.getTableData();
        },
        () => {},
      );
    },
    // 弹窗-提交
    handleSubmit(obj) {
      const url = this.isEdit ? 'recruitmentNews/update' : 'recruitmentNews/save';
      const params = this.isEdit ? Object.assign(obj, { recruitmentNewsId: this.recruitmentNewsId }) : obj;
      this.$http.post(url, params).then(
        () => {
          this.$message.success('发布成功');
          this.detailDialogVisible = false;
          this.$refs.recruitmentNews.getTableData();
        },
        () => {},
      );
    },
  },
};
</script>

<style lang="scss">
.recruitmentNews {
  .el-cascader {
    width: 100%;
  }
  .receiveBotton {
    width: 100%!important;
    .el-form-item__content {
      text-align: right;
    }
  }
  .matcherUser {
    .el-form {
      flex-wrap: nowrap!important;
      .el-form-item__content {
        padding-right: 20px!important;
      }
      .button-list {
        width: 300px!important;
        min-width: 280px!important;
      }
    }
      .province {
        width: 330px!important;
      }
      .city,.area,.street {
        width: 220px!important;
        .el-form-item__content {
          margin-left: 0!important;
        }
      }
  }
}
</style>
