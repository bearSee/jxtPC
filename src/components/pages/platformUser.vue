<template>
  <div class="platformUser">
    <zte-table
      ref="platformUser"
      request-url="user/company/list"
      indexStyle="index"
      :searchInfo="itemInfo"
      :tableColumn="tableColumn">
      <template slot="operate" slot-scope="{ row }">
        <el-button type="text" @click.native="handleView(row)">查看</el-button>
      </template>
    </zte-table>
    <el-dialog
      width="50%"
      v-if="releaserInfoVisible"
      :visible.sync="releaserInfoVisible"
      title="查看详情">
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
import chooseIndustry from '../modules/chooseIndustry';
import industryTree from '../modules/industryTree';
import viewForm from '../modules/viewForm';

export default {
  name: 'platformUser',
  components: { chooseIndustry, industryTree, viewForm },
  data() {
    return {
      itemInfo: [
        {
          code: 'keyword',
          label: '筛选条件',
          placeholder: '公司名称或联系人',
          type: 'text',
          itemWidth: 40,
        },
      ],
      tableColumn: [
        {
          code: 'operate',
          label: '操作',
          temp: 'operate',
          width: 50,
        },
        {
          label: '公司名称',
          code: 'companyName',
        },
        {
          label: '联系人',
          code: 'personInCharge',
        },
        {
          label: '手机号',
          code: 'mobileNumber',
        },
        {
          label: '邮箱',
          code: 'email',
        },
      ],
      // 弹窗数据配置
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
    };
  },
  created() {},
  methods: {
    handleView(row) {
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
.platformUser {
}
</style>
