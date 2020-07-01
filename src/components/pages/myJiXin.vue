<template>
  <div class="myJiXin">
    <zte-form
      border
      class="jixin-form"
      :class="{ 'no-border': identity === 'Z001002' }"
      :rowSize='2'
      :itemInfo="itemInfo[identity]"
      :form='form'
      :isCancel="false"
      @submit="submit">
      <template slot='receiveBotton'>
        <el-button type="primary" @click="getTreeData">选择行业</el-button>
      </template>
      <template slot='content'>
        <!-- 行业table -->
        <chooseIndustry
          :tableData='belongIndustryList'
          :tableColumn='industryTableColumn'
          @delet='delet'
          @getIndustryData='getIndustryData'>
        </chooseIndustry>
      </template>
    </zte-form>
    <el-dialog
      class="industryTree shot_height"
      width="40%"
      :modal-append-to-body='false'
      v-if="industryTreeVisible"
      :visible.sync="industryTreeVisible"
      title="行业选择">
      <industryTree
        treeUrl='industry/list'
        :params='treeParams'
        @chooseNodeClick='chooseNodeClick'>
      </industryTree>
    </el-dialog>
  </div>
</template>

<script type='text/javascript'>
import chooseIndustry from '../modules/chooseIndustry';
import industryTree from '../modules/industryTree';

export default {
  name: 'myJiXin',
  components: { chooseIndustry, industryTree },
  data() {
    return {
      itemInfo: {
        Z001002: [
          {
            code: 'perName',
            label: '姓名：',
            type: 'text',
            itemWidth: 100,
          },
          {
            code: 'sex',
            label: '性别',
            type: 'radio',
            options: [],
            optionProps: {
              label: 'value',
              value: 'key',
            },
            fastCode: 'Z009000',
            itemWidth: 100,
          },
          // {
          //   code: 'mobileNumber',
          //   label: '手机号码',
          //   type: 'text',
          //   itemWidth: 100,
          //   disabled: true,
          // },
          {
            code: 'email',
            label: '电子邮箱：',
            type: 'text',
            itemWidth: 100,
          },
          {
            code: 'province',
            label: '地址：',
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
          // {
          // code: 'address',
          // label: '详细地址：',
          // type: 'textarea',
          // itemWidth: 100,
          // },
          {
            code: 'descript',
            label: '个人简介：',
            type: 'textarea',
            itemWidth: 100,
          },
          {
            label: '接收行业：',
            code: 'receiveBotton',
            type: 'temp',
            itemWidth: 100,
          },
        ],
        Z001001: [
          {
            code: 'companyName',
            label: '公司名称：',
            type: 'text',
            itemWidth: 100,
          },
          {
            code: 'orgCode',
            label: '机构代码：',
            type: 'text',
            itemWidth: 100,
          },
          {
            code: 'personInCharge',
            label: '负责人：',
            type: 'text',
            itemWidth: 100,
          },
          // {
          //   code: 'mobileNumber',
          //   label: '手机号码',
          //   type: 'text',
          //   itemWidth: 100,
          //   disabled: true,
          // },
          {
            code: 'province',
            label: '地址：',
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
          {
            code: 'address',
            label: '详细地址：',
            type: 'textarea',
            itemWidth: 100,
          },
          {
            code: 'description',
            label: '公司介绍：',
            type: 'textarea',
            itemWidth: 100,
          },
          {
            label: '所属行业：',
            code: 'receiveBotton',
            type: 'temp',
            itemWidth: 100,
          },
        ],
      },
      form: {},
      industryTableColumn: [
        {
          label: '行业名称',
          code: 'industryName',
          width: 300,
        },
        {
          label: '行业标签',
          code: 'industryLabel',
          temp: 'industryLabel',
          align: 'center',
          minWidth: 300,
        },
        {
          label: '操作',
          code: 'operate',
          temp: 'operate',
          fixed: 'right',
          width: 100,
        },
      ],
      belongIndustryList: [],
      industryTreeVisible: false,
      treeParams: {},
      identity: 'Z001002',
    };
  },
  created() {
    const userInfo = JSON.parse(window.localStorage.getItem('userData'));
    this.identity = userInfo.userType;
    this.getData();
  },
  methods: {
    getData() {
      this.$http.post('my/info', {}).then(
        (res) => {
          res = res.data;
          this.form = res.info;
          this.belongIndustryList = res.info.belongIndustryList || [];
        },
        () => {},
      );
    },
    // 打开获取行业弹窗
    getTreeData() {
      this.industryTreeVisible = true;
    },
    // 获取行业表格中的data
    getIndustryData(data) {
      this.belongIndustryList = data;
    },
    // 删除行
    delet(i) {
      this.belongIndustryList.splice(i, 1);
    },
    chooseNodeClick(node) {
      this.industryTreeVisible = false;
      let bool = true;
      this.belongIndustryList.forEach((item) => {
        if (item.industryId === node.id || item.id === node.id) {
          bool = false;
        }
      });
      if (bool) {
        this.belongIndustryList.push(node);
        return;
      }
      this.$message.warning('列表中已存在该行业');
    },
    submit(form) {
      const params = form;
      const urlList = {
        Z001001: 'my/company/save',
        Z001002: 'my/personal/save',
      };
      if (this.belongIndustryList) {
        const belongIndustryList = this.belongIndustryList.map(item => ({
          industryLabel: item.industryLabel,
          industryName: item.industryName,
          industryId: item.industryId || item.id,
        }));
        params.belongIndustryList = JSON.stringify(belongIndustryList);
      }
      this.$http.post(urlList[this.identity], params).then(
        () => {
          this.$message.success('保存成功');
        },
        () => {},
      );
    },
  },
};
</script>

<style lang='scss'>
@import "../../assets/scss/theme";
.myJiXin {
  .jixin-form {
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
      .companyName, .mobileNumber, .perName, .email {
        .el-input__inner {
          width: 400px;
        }
      }
      .orgCode, .personInCharge {
        .el-input__inner {
          width: 200px;
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
      .address, .description, .descript {
        .el-textarea__inner {
          height: 50px!important;
          min-height: 50px!important;
        }
        .el-form-item__content {
          width: calc(100% - 110px);
          padding-right: 0!important;
        }
      }
      .address {
        .el-form-item__content {
          padding-right: 0!important;
        }
      }
    }
    .description {
      margin-top: 10px!important;
    }
    .button-list {
      background: #fff;
      .el-form-item__content {
        margin-right: 10px;
      }
    }
    .receiveBotton {
      .el-form-item__content {
        text-align: left;
      }
    }
    .content {
      .industryLabel {
        text-align: left;
      }
    }
  }
}
</style>
