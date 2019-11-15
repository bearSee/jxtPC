<template>
  <div class="enterpriseUser">
    <zte-table
      ref="enterpriseUser"
      request-url="user/company/list"
      indexStyle="index"
      :searchInfo="itemInfo"
      :tableColumn="tableColumn">
      <template slot="operate" slot-scope="{ row }">
        <el-button type="text" @click.native="handleView(row)">查看</el-button>
        <el-button type="text" :disabled="row.approveState !== 'Z007001'" @click.native="handlePass(row)">审核通过</el-button>
        <el-button type="text" @click.native="handleDisable(row)">{{ row.enabled === 'Y' ? '禁用' : '启用' }}</el-button>
      </template>
    </zte-table>
    <el-dialog
      width="50%"
      v-if="dialogVisible"
      :visible.sync="dialogVisible"
      title="企业用户信息">
      <viewForm :formData="dialogFormData" userType="Z001001"></viewForm>
      <!-- 行业table -->
      <chooseIndustry
        :tableData='industryList'
        :tableColumn='industryTableColumn'
        :disabled="true">
      </chooseIndustry>
    </el-dialog>
  </div>
</template>

<script>
import chooseIndustry from '../modules/chooseIndustry';
import industryTree from '../modules/industryTree';
import viewForm from '../modules/viewForm';

export default {
  name: 'industryNews',
  components: { chooseIndustry, industryTree, viewForm },
  data() {
    return {
      itemInfo: [
        {
          code: 'keyword',
          label: '筛选条件',
          placeholder: '公司名称或联系人',
          type: 'text',
          itemWidth: 50,
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
          label: '公司名称',
          code: 'companyName',
        },
        {
          label: '已发布消息',
          code: 'publishCount',
        },
        {
          label: '最后登录时间',
          code: 'lastLogin',
        },
      ],
      // 弹窗数据配置
      dialogVisible: false,
      dialogFormData: {},
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
      industryList: [],
    };
  },
  created() {},
  methods: {
    handleDisable(row) {
      const params = { userId: row.userId };
      params.enabled = row.enabled === 'Y' ? 'N' : 'Y';
      this.$http.post('user/updateEnabled', params).then(
        () => {
          this.$message.success('操作成功');
          this.$refs.enterpriseUser.getTableData();
        },
        () => {},
      );
    },
    handlePass(row) {
      const params = { userId: row.userId };
      params.approveState = row.approveState === 'Y' ? 'N' : 'Y';
      this.$http.post('user/approval', params).then(
        () => {
          this.$message.success('操作成功');
          this.$refs.enterpriseUser.getTableData();
        },
        () => {},
      );
    },
    handleView(row) {
      const params = { userId: row.userId };
      this.$http.post('user/info', params).then(
        (res) => {
          res = res.data.info || {};
          this.dialogFormData = res;
          this.industryList = res.belongIndustryList;
          this.dialogVisible = true;
        },
        () => {},
      );
    },
  },
};
</script>

<style lang="scss">
.enterpriseUser {
}
</style>
