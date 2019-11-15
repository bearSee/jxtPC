<template>
  <div class="individualUser">
    <zte-table
      ref="individualUser"
      request-url="user/personal/list"
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
      title="个体用户信息">
      <viewForm :formData="dialogFormData" userType="Z001002"></viewForm>
      <!-- 行业table -->
      <!-- <chooseIndustry
        :tableData='industryList'
        :tableColumn='industryTableColumn'
        :disabled="true">
      </chooseIndustry> -->
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
          placeholder: '个体名称或手机号',
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
          label: '状态',
          code: 'approveStateName',
        },
        {
          label: '个体名称',
          code: 'perName',
        },
        {
          label: '手机号',
          code: 'mobileNumber',
        },
        {
          label: '邮箱',
          code: 'email',
          // width: 100,
        },
        {
          label: '用户状态',
          code: 'enabledName',
        },
      ],
      // 弹窗数据配置
      dialogVisible: false,
      dialogItemInfo: [
        {
          code: 'perName',
          label: '个体名称',
          type: 'label',
        },
        {
          code: 'mobileNumber',
          label: '手机号码',
          type: 'label',
        },
        {
          code: 'email',
          label: '电子邮箱',
          type: 'label',
        },
      ],
      dialogFormData: {},
      industryTableColumn: [
        {
          label: '行业名称',
          code: 'industryName',
        },
        {
          label: '行业标签',
          code: 'industryLabel',
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
          this.$refs.individualUser.getTableData();
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
          this.$refs.individualUser.getTableData();
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
          this.dialogVisible = true;
        },
        () => {},
      );
    },
  },
};
</script>

<style lang="scss">
.individualUser {
}
</style>
