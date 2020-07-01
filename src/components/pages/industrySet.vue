<template>
  <div class="industrySet">
    <el-container>
      <el-aside class="aside-body">
        <el-button size="mini" icon="el-icon-plus" class="addbtn" @click.native="createNewFa">添加根节点</el-button>
        <industryTree
          ref="industryTree"
          treeUrl='industry/setting'
          :params='treeParams'
          :default-expand-all="false"
          @chooseNodeClick='chooseNodeClick'
          :needAllData="true">
        </industryTree>
      </el-aside>
      <el-main class="main-body">
        <div class="title">基本信息</div>
        <zte-form
          :rowSize='1'
          :itemInfo="itemInfo"
          :form='currentData'
          submitText="修改"
          :isCancel="false"
          @submit="editFatherSubmit">
          <template slot="moreOperate">
            <el-button size="mini" @click.native="createNewSon">添加子节点</el-button>
            <el-button size="mini" @click.native="deletForm">删除</el-button>
          </template>
        </zte-form>
      </el-main>
    </el-container>
    <el-dialog
      class="addDialog"
      v-if="addVisible"
      :visible.sync="addVisible"
      :title="title">
      <zte-form
        :rowSize='1'
        :itemInfo="itemInfo"
        :form='faFormData'
        @submit="dialogSubmit">
      </zte-form>
    </el-dialog>
  </div>
</template>

<script>
import industryTree from '../modules/industryTree';

export default {
  name: 'industrySet',
  components: { industryTree },
  data() {
    return {
      title: '',
      treeParams: {},
      itemInfo: [
        {
          code: 'industryName',
          label: '行业名称',
          type: 'text',
          itemWidth: 100,
        },
        {
          code: 'allowSubscribe',
          label: '允许订阅',
          type: 'switch',
          itemWidth: 100,
          on: 'Y',
          off: 'N',
        },
        {
          code: 'industryLabel',
          label: '行业标签',
          type: 'check',
          options: [],
          optionProps: {
            label: 'value',
            value: 'key',
          },
          fastCode: 'Z002000',
          itemWidth: 100,
          checkAll: true,
        },
        {
          code: 'description',
          label: '说明',
          type: 'textarea',
          itemWidth: 100,
        },
        {
          code: 'sort',
          label: '排序',
          type: 'number',
          itemWidth: 100,
        },
      ],
      currentData: { allowSubscribe: 'Y' },
      faFormData: { allowSubscribe: 'Y' },
      addVisible: false,
      isAddFather: false,
    };
  },
  methods: {
    createNewFa() {
      this.title = '添加根节点';
      this.addVisible = true;
      this.isAddFather = true;
    },
    createNewSon() {
      const obj = JSON.parse(JSON.stringify(this.currentData));
      if (obj.allowSubscribe) delete obj.allowSubscribe;
      if (!Object.keys(obj).length) {
        this.$message.warning('请先选择节点');
        return;
      }
      this.title = '添加子节点';
      this.addVisible = true;
      this.isAddFather = false;
    },
    // 编辑当前节点提交
    editFatherSubmit(form) {
      const obj = JSON.parse(JSON.stringify(this.currentData));
      if (obj.allowSubscribe) delete obj.allowSubscribe;
      if (!Object.keys(obj).length) {
        this.$message.warning('请先选择节点');
        return;
      }
      const params = { ...form, industryId: form.id };
      this.$http.post('industry/update', params).then(
        () => {
          this.$message.success('修改成功');
          this.$refs.industryTree.getTreeData();
        },
        () => {},
      );
    },
    deletForm() {
      const obj = JSON.parse(JSON.stringify(this.currentData));
      if (obj.allowSubscribe) delete obj.allowSubscribe;
      if (!Object.keys(obj).length) {
        this.$message.warning('请先选择节点');
        return;
      }
      this.$confirm('是否将该节点删除', '提示', { type: 'warning' }).then(() => {
        const params = { industryId: this.currentData.id };
        this.$http.post('industry/delete', params).then(
          () => {
            this.$message.success('删除成功');
            this.currentData = {};
            this.$refs.industryTree.getTreeData();
          },
          () => {},
        );
      });
    },
    // 弹窗提交统一控制
    dialogSubmit(form) {
      if (this.isAddFather) {
        this.addFatherSubmit(form);
        return;
      }
      this.addSonSubmit(form);
    },
    // 新增根节点提交
    addFatherSubmit(form) {
      const params = { ...form };
      this.$http.post('industry/save', params).then(
        () => {
          this.$message.success('新增成功');
          this.addVisible = false;
          this.$refs.industryTree.getTreeData();
        },
        () => {},
      );
    },
    // 新增子节点提交
    addSonSubmit(form) {
      const params = { ...form, parentId: this.currentData.id };
      this.$http.post('industry/save', params).then(
        () => {
          this.addVisible = false;
          this.$refs.industryTree.getTreeData();
        },
        () => {},
      );
    },
    chooseNodeClick(data) {
      this.currentData = data;
    },
  },
};
</script>


<style lang="scss">
.editDialog {
  .zte-form {
    width: 80%;
    margin: auto;
    .el-form-item__label {
      text-align: left;
    }
  }
}
.addDialog {
  .zte-form {
    width: 93%;
  }
}
.industrySet {
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
      padding-top: 50px;
    }
  }
  .main-body {
    width: calc(100% - 250px);
    height: 100%;
    padding: 20px 50px;
    padding-right: 150px;
    .title {
      width: 100px;
      padding: 20px 0;
      padding-right: 12px;
      text-align: right;
    }
    .zte-table {
      height: calc(100% - 309px);
    }
  }
}
</style>
