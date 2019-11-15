<template>
  <div class="IndustryUser">
    <el-container>
      <el-aside class="aside-body">
        <industryTree
          ref="industryTree"
          treeUrl='industry/list'
          :params='treeParams'
          :default-expand-all="false"
          @chooseNodeClick='chooseNodeClick'>
        </industryTree>
      </el-aside>
      <el-main class="main-body">
        <zte-table
          ref="IndustryUser"
          requestUrl="/industryUser/list"
          index-style="index"
          :tableColumn="tableColumn"
          :params="{ industryId }">
          <template slot="operate" slot-scope="{ row, $index }">
            <el-button type="text" @click.native="viewReleaserInfo(row)">查看</el-button>
          </template>
        </zte-table>
      </el-main>
    </el-container>
    <el-dialog
      width="50%"
      v-if="releaserInfoVisible"
      :visible.sync="releaserInfoVisible"
      title="用户详情">
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
import industryTree from '../modules/industryTree';
import viewForm from '../modules/viewForm';
import chooseIndustry from '../modules/chooseIndustry';

export default {
  name: 'IndustryUser',
  components: { industryTree, viewForm, chooseIndustry },
  data() {
    return {
      treeParams: {},
      tableColumn: [
        {
          label: '操作',
          code: 'operate',
          temp: 'operate',
          width: 150,
        },
        {
          label: '名称',
          code: 'userName',
        },
        {
          label: '类型',
          code: 'type',
        },
      ],
      tableData: [],
      // 用户详情弹窗
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
      industryId: '',
    };
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
    chooseNodeClick(data) {
      this.industryId = data.id;
    },
  },
};
</script>


<style lang="scss">
.IndustryUser {
  width: 100%;
  height: 100%;
  background: #fff;
  .aside-body {
    width: 250px;
    height: 100%;
    margin: 10px;
    padding: 0 20px;
    border-right: 1px solid #d6d6d6;
    position: relative;
    .addbtn {
      position: absolute;
      top: 10px;
      left: 50%;
      z-index: 99;
      transform: translate(-50%, 0);
    }
    .el-tree {
      width: 100%;
    }
  }
  .main-body {
    width: calc(100% - 250px);
    height: 100%;
    padding: 20px 50px;
  }
}
/*滚动条样式*/
.industryTree::-webkit-scrollbar {
  width: 4px;
  background: #FAFAFA;
}
.industryTree::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
    border-radius: 5px;
    -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
    background: #E1E1E1;
}
.industryTree::-webkit-scrollbar-track {/*滚动条里面轨道*/
    border-radius: 4px;
    background: #fff;
}
</style>
