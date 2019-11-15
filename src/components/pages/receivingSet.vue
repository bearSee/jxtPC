<template>
  <div class="receivingSet">
    <el-tabs v-model="tabLabel"  type="border-card">
      <el-tab-pane label="行业消息" name="industryNews">
        <zte-form
          border
          class="receivingSet-form"
          :rowSize='2'
          :itemInfo="industryNewsItemInfo"
          :form='industryNewsFormData'
          @submit="handleSubmit">
          <!-- 行业table -->
          <template slot='receiveBotton'>
            <!-- <el-button type="primary" @click="getTreeData">选择行业</el-button> -->
          </template>
          <template slot='content'>
            <chooseIndustry
              :tableData='industryNewsTableData'
              :tableColumn='industryNewsTableColumn'
              :disabled="true">
            </chooseIndustry>
          </template>
        </zte-form>
      </el-tab-pane>
      <!-- <el-tab-pane :label="identity == 'Z001002' ? '应聘消息' : '招聘消息'" name="recruitNews">
        <zte-form
          border
          class="receivingSet-form"
          :rowSize='2'
          :itemInfo="recruitNewsItemInfo"
          :form='recruitNewsFormData'
          @submit="handleSubmit">
          <template slot='receiveBotton' v-if="identity == 'Z001002'">
            <el-button type="primary" @click="getTreeData">选择行业</el-button>
          </template>
          <template slot='content' v-if="identity == 'Z001002'">
            <chooseIndustry
              :tableData='recruitNewsTableData'
              :tableColumn='recruitNewsTableColumn'
              @delet='delet'
              @getIndustryData='getIndustryData'>
            </chooseIndustry>
          </template>
        </zte-form>
      </el-tab-pane> -->
    </el-tabs>
    <el-dialog
      class="industryTree shot_height"
      width="40%"
      v-if="industryTreeVisible"
      :visible.sync="industryTreeVisible"
      title="行业选择">
      <industryTree
        treeUrl='industry/list'
        @chooseNodeClick='chooseNodeClick'>
      </industryTree>
    </el-dialog>
  </div>
</template>

<script>
import chooseIndustry from '../modules/chooseIndustry';
import industryTree from '../modules/industryTree';

export default {
  name: 'industryNews',
  components: { chooseIndustry, industryTree },
  data() {
    return {
      identity: JSON.parse(window.localStorage.getItem('userData')).userType,
      tabLabel: 'industryNews',
      // tab1-industryNews
      industryNewsItemInfo: [
        {
          code: 'province',
          label: '接收地址：',
          type: 'select',
          options: [],
          optionProps: {
            label: 'name',
            value: 'id',
          },
          ajax: 'city/list',
          next: { city: 'parentId' },
          associated: ['city', 'area', 'street'],
          params: { parentId: '0' },
        },
        {
          code: 'city',
          label: '',
          type: 'select',
          options: [],
          optionProps: {
            label: 'name',
            value: 'id',
          },
          ajax: 'city/list',
          next: { area: 'parentId' },
          associated: ['area', 'street'],
        },
        {
          code: 'area',
          label: '',
          type: 'select',
          options: [],
          optionProps: {
            label: 'name',
            value: 'id',
          },
          ajax: 'city/list',
          next: { street: 'parentId' },
          associated: ['street'],
        },
        {
          code: 'street',
          label: '',
          type: 'select',
          options: [],
          optionProps: {
            label: 'name',
            value: 'id',
          },
          ajax: 'city/list',
        },
        {
          code: 'messageType',
          label: '消息类型：',
          type: 'check',
          options: [],
          fastCode: 'Z003000',
          itemWidth: 100,
        },
        {
          code: 'receiveObject',
          label: '接收对象：',
          type: 'check',
          options: [],
          fastCode: 'Z001000',
          itemWidth: 100,
        },
      ],
      industryNewsFormData: {},
      industryNewsTableColumn: [
        {
          label: '行业名称',
          code: 'industryName',
          width: 200,
        },
        {
          label: '行业标签',
          code: 'industryLabelName',
          // temp: 'industryLabel',
          align: 'center',
          minWidth: 300,
        },
        // {
        //   label: '操作',
        //   code: 'operate',
        //   temp: 'operate',
        //   fixed: 'right',
        //   width: 100,
        // },
      ],
      industryNewsTableData: [],
      // tab2-recruitNews
      recruitNewsItemInfo: [
        {
          code: 'province',
          label: '接收地址：',
          type: 'select',
          options: [],
          optionProps: {
            label: 'name',
            value: 'id',
          },
          ajax: 'city/list',
          next: { city: 'parentId' },
          associated: ['city', 'area', 'street'],
          params: { parentId: '0' },
        },
        {
          code: 'city',
          label: '',
          type: 'select',
          options: [],
          optionProps: {
            label: 'name',
            value: 'id',
          },
          ajax: 'city/list',
          next: { area: 'parentId' },
          associated: ['area', 'street'],
        },
        {
          code: 'area',
          label: '',
          type: 'select',
          options: [],
          optionProps: {
            label: 'name',
            value: 'id',
          },
          ajax: 'city/list',
          next: { street: 'parentId' },
          associated: ['street'],
        },
        {
          code: 'street',
          label: '',
          type: 'select',
          options: [],
          optionProps: {
            label: 'name',
            value: 'id',
          },
          ajax: 'city/list',
        },
        {
          code: 'recruitmentWork',
          label: `${JSON.parse(window.localStorage.getItem('userData')).userType === 'Z001002' ? '应聘' : '招聘'}工种：`,
          type: 'check',
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
          label: `${JSON.parse(window.localStorage.getItem('userData')).userType === 'Z001002' ? '应聘' : '招聘'}专业：`,
          type: 'check',
          options: [],
          fastCode: 'Z005000',
          itemWidth: 100,
        },
        {
          code: 'recruitmentPosition',
          label: `${JSON.parse(window.localStorage.getItem('userData')).userType === 'Z001002' ? '应聘' : '招聘'}岗位：`,
          type: 'check',
          options: [],
          fastCode: 'Z006000',
          itemWidth: 100,
        },
        // {
        //   code: 'receiveObject',
        //   label: '接收对象',
        //   type: 'check',
        //   options: [],
        //   fastCode: 'Z001000',
        //   itemWidth: 100,
        // },
      ],
      recruitNewsFormData: {},
      recruitNewsTableColumn: [
        {
          label: '行业名称',
          code: 'industryName',
          width: 200,
        },
        {
          label: '行业标签',
          code: 'industryLabelName',
          // temp: 'industryLabel',
          align: 'center',
          minWidth: 300,
        },
        // {
        //   label: '操作',
        //   code: 'operate',
        //   temp: 'operate',
        //   fixed: 'right',
        //   width: 100,
        // },
      ],
      recruitNewsTableData: [],
      // 行业树
      industryTreeVisible: false,
    };
  },
  created() {
    const userInfo = JSON.parse(window.localStorage.getItem('userData'));
    this.identity = userInfo.userType;
    if (this.identity === 'Z001002') {
      this.industryNewsItemInfo = [...this.industryNewsItemInfo, {
        label: '接收行业：',
        code: 'receiveBotton',
        type: 'temp',
        itemWidth: 100,
      }];
      this.recruitNewsItemInfo = [...this.recruitNewsItemInfo, {
        label: '接收行业：',
        code: 'receiveBotton',
        type: 'temp',
        itemWidth: 100,
      }];
    }
    this.getFormData();
  },
  methods: {
    getFormData() {
      this.$http.post('receiveSetting/industry/info', {}).then(
        (res) => {
          this.industryNewsFormData = res.data.data;
          this.industryNewsTableData = res.data.data.receiveIndustryList;
          // const receiveIndustryList = res.data.data.receiveIndustryList.map((item) => {
          //   console.log('item', item);
          //   const options = item.industryLabelAll;
          //   const selectOption = item.industryLabel.split(',');
          //   const industryLabel = [];
          //   options.forEach((obj) => {
          //     if (selectOption.indexOf(obj.key) > -1) {
          //       industryLabel.push(obj.value);
          //     }
          //   });
          //   item.industryLabel = industryLabel.join(',');
          //   return item;
          // });
          // this.industryNewsTableData = receiveIndustryList;
        },
        () => {},
      );
      // this.$http.post('receiveSetting/recruitment/info', {}).then(
      //   (res) => {
      //     this.recruitNewsFormData = res.data.data;
      //     this.recruitNewsTableData = res.data.data.receiveIndustryList;
      //   },
      //   () => {},
      // );
    },
    // 打开获取行业弹窗
    getTreeData() {
      const listArr = this.tabLabel === 'industryNews' ? this.industryNewsTableData : this.recruitNewsTableData;
      if (listArr.length > 4) {
        this.$message.warning('接收行业不能超过5个');
        return;
      }
      this.industryTreeVisible = true;
    },
    // 获取行业表格中的data
    getIndustryData(data) {
      if (this.tabLabel === 'industryNews') {
        this.industryNewsTableData = data;
        return;
      }
      this.recruitNewsTableData = data;
    },
    // 删除行
    delet(i) {
      if (this.tabLabel === 'industryNews') {
        this.industryNewsTableData.splice(i, 1);
        return;
      }
      this.recruitNewsTableData.splice(i, 1);
    },
    chooseNodeClick(node) {
      this.industryTreeVisible = false;
      const listArr = this.tabLabel === 'industryNews' ? this.industryNewsTableData : this.recruitNewsTableData;
      let bool = true;
      listArr.forEach((item) => {
        if (item.industryId === node.id || item.id === node.id) {
          bool = false;
        }
      });
      if (!bool) {
        this.$message.warning('列表中已存在该行业');
        return;
      }

      if (this.tabLabel === 'industryNews') {
        this.industryNewsTableData.push(node);
        return;
      }
      this.recruitNewsTableData.push(node);
    },
    handleSubmit(obj) {
      const tabLabel = this.tabLabel;
      let receiveIndustryList = tabLabel === 'industryNews' ? this.industryNewsTableData : this.recruitNewsTableData;
      receiveIndustryList = JSON.stringify(receiveIndustryList.map(item => ({
        industryLabel: item.industryLabel,
        industryName: item.industryName,
        industryId: item.industryId || item.id,
      })));
      const url = tabLabel === 'industryNews' ? 'receiveSetting/industry/save' : 'receiveSetting/recruitment/save';
      const params = Object.assign(obj, { receiveIndustryList });
      this.$http.post(url, params).then(
        () => {
          this.$message.success('保存成功');
        },
        () => {},
      );
    },
  },
};
</script>

<style lang="scss">
.receivingSet {
  overflow: auto;
  .receivingSet-form {
    .el-form {
      border: 0!important;
      .el-form-item {
        border: 0!important;
        .el-form-item__label {
          background: none!important;
          border: 0!important;
          width: 110px!important;
        }
      }
      .title {
        .el-input__inner {
          width: 400px;
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
    .receiveBotton {
      .el-form-item__content {
        text-align: left;
      }
    }
    .ue {
      padding-top: 30px;
    }
    .content {
      .industryLabel {
        text-align: left;
      }
    }
  }
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
}
</style>
