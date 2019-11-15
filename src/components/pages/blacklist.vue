<template>
  <div class="blacklist">
    <zte-table
      ref="blacklist"
      indexStyle="index"
      requestUrl="blacklist/list"
      :searchInfo="itemInfo"
      :tableColumn="tableColumn">
      <template slot="operate" slot-scope="{ row }">
        <el-button type="text" @click.native="handleBlack(row)">移除黑名单</el-button>
      </template>
      <template slot="blackName" slot-scope="{ row }">
        <el-button type="text" size="mini" @click.native="viewReleaserInfo(row)">{{row.blackName}}</el-button>
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
        v-if="isPerson"
        :tableColumn='industryTableColumn'
        :tableData='receiveIndustryList'
        :disabled="true">
      </chooseIndustry>
    </el-dialog>
  </div>
</template>

<script type='text/javascript'>
import chooseIndustry from '../modules/chooseIndustry';
import viewForm from '../modules/viewForm';

export default {
  name: 'blacklist',
  components: { chooseIndustry, viewForm },
  data() {
    const isPerson = JSON.parse(window.localStorage.getItem('userData')).userType === 'Z001002';
    return {
      isPerson,
      itemInfo: [],
      tableColumn: [
        {
          code: 'operate',
          label: '操作',
          temp: 'operate',
        },
        {
          code: 'blackName',
          label: '发布者名称',
          temp: 'blackName',
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
    };
  },
  created() {
  },
  methods: {
    viewReleaserInfo(row) {
      const params = { userId: row.blackUserId };
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
    handleBlack(row) {
      const { blackUserId } = row;
      this.$http.post('blacklist/delete', { blackUserId }).then(
        () => {
          this.$message.success('操作成功');
          this.$refs.blacklist.getTableData();
        },
        () => {},
      );
    },
  },
};
</script>

<style lang='scss'>
.blacklist {
}
</style>
