<template>
  <div class="dictionarySet">
    <el-container>
      <el-aside class="aside-body">
        <div class="addbtn">字典列表</div>
        <!-- <el-button size="mini" icon="el-icon-plus" class="addbtn" @click.native="addVisible = true">添加字典</el-button> -->
        <el-tree :data="treeData" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
      </el-aside>
      <el-main class="main-body">
        <!-- <div class="title">基本信息</div>
        <zte-form
          :itemInfo="itemInfo"
          :form='formData'
          cancelText="删除"
          @submit="changeSubmit"
          @reset="deletForm">
        </zte-form> -->
        <zte-table
          ref="dictionary"
          indexStyle="index"
          request-url="dictionary/list"
          :tableColumn="tableColumn"
          :params='{ parentKey }'>
          <template slot="operate" slot-scope="{ row }">
            <el-button type="text" @click.native="editLine(row)">编辑</el-button>
            <el-button type="text" @click.native="deletLine(row)">{{ row.enabled === 'Y' ? '禁用' : '启用' }}</el-button>
          </template>
          <template slot="content">
            <!-- <span class="title">字典选择项</span> -->
            <el-button size="mini" icon="el-icon-plus" @click.native="addLine()">新增选项</el-button>
          </template>
        </zte-table>
      </el-main>
    </el-container>
    <el-dialog
      class="addDialog"
      v-if="addVisible"
      :visible.sync="addVisible"
      title="添加字典">
      <zte-form
        :itemInfo="itemInfo"
        @submit="addSubmit">
      </zte-form>
    </el-dialog>
    <el-dialog
      width="40%"
      class="editDialog"
      v-if="editVisible"
      :visible.sync="editVisible"
      title="编辑选择项">
      <zte-form
        :itemInfo="dialogItemInfo"
        :form='editData'
        @submit="editSubmit">
      </zte-form>
    </el-dialog>
  </div>
</template>

<script>

export default {
  name: 'dictionarySet',
  data() {
    return {
      treeData: [],
      currentId: '',
      defaultProps: {
        label: 'dicValue',
        value: 'dicKey',
      },
      // itemInfo: [
      //   {
      //     code: 'dicValue',
      //     label: '字典名称',
      //     type: 'text',
      //     itemWidth: 100,
      //   },
      //   {
      //     code: '2',
      //     label: '说明',
      //     type: 'textarea',
      //     itemWidth: 100,
      //   },
      // ],
      // formData: {},
      tableColumn: [
        {
          label: '选项名称',
          code: 'dicValue',
        },
        {
          label: '排序',
          code: 'sort',
        },
        {
          label: '编码',
          code: 'dicKey',
        },
        {
          code: 'operate',
          label: '操作',
          temp: 'operate',
          fixed: 'right',
          width: 100,
        },
      ],
      addVisible: false,
      editVisible: false,
      dialogItemInfo: [
        {
          code: 'dicValue',
          label: '选项',
          type: 'text',
          itemWidth: 100,
        },
        {
          code: 'sort',
          label: '顺序',
          type: 'number',
          itemWidth: 100,
        },
        {
          code: 'dicKey',
          label: '编码',
          type: 'text',
          itemWidth: 100,
        },
      ],
      editData: {},
      isEdit: false,
      parentKey: '',
    };
  },
  created() {
    this.getData();
  },
  methods: {
    getData(parentKey = 0) {
      this.$http.post('dictionary/list', { parentKey }).then(
        (res) => {
          res = res.data;
          this.treeData = res.list;
        },
        () => {},
      );
    },
    handleNodeClick(data) {
      this.parentKey = data.dicKey;
    },
    deletForm() {
    },
    addLine() {
      if (!this.parentKey) {
        this.$message.warning('请先选择字典');
        return;
      }
      this.editData = {};
      this.isEdit = false;
      this.editVisible = true;
    },
    editLine(row) {
      this.isEdit = true;
      this.lineId = row.id;
      this.editVisible = true;
      this.editData = row;
    },
    deletLine(row) {
      const params = {
        dicKey: row.dicKey,
        enabled: row.enabled === 'Y' ? 'N' : 'Y',
      };
      this.$http.post('dictionary/updateEnabled', params).then(
        () => {
          this.$message.success('操作成功');
          this.$refs.dictionary.getTableData();
        },
        () => {},
      );
    },
    editSubmit(form) {
      const params = this.isEdit ? form : Object.assign(form, { parentKey: this.parentKey });
      const url = this.isEdit ? 'dictionary/update' : 'dictionary/save';
      this.$http.post(url, params).then(
        () => {
          this.$refs.dictionary.getTableData();
          this.editVisible = false;
          this.$message.success('操作成功');
        },
        () => {},
      );
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
.dictionarySet {
  width: 100%;
  height: 100%;
  background: #fff;
  .el-container {
    overflow: hidden;
  }
  .content-body {
    margin-bottom: 20px;
  }
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
      padding-bottom: 50px;
    }
  }
  .main-body {
    width: calc(100% - 250px);
    height: 100%;
    padding: 20px 50px;
    // padding-right: 150px;
    .title {
      width: 100px;
      padding: 20px 0;
      padding-right: 12px;
      text-align: right;
    }
    .zte-table {
      height: calc(100vh - 179px);
    }
  }
}
</style>
