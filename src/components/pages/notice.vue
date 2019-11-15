<template>
  <div class="notice">
    <zte-table
      ref="notice"
      request-url="/publish/list"
      indexStyle="index"
      :rowSize='2'
      :buttonList="{ add: identity === 'ADMIN' }"
      :searchInfo="itemInfo"
      :tableColumn="tableColumn"
      @add-row="add">
      <template slot="operate" slot-scope="{ row }">
        <el-button type="text" @click.native="view(row)">查看</el-button>
        <template v-if="identity === 'ADMIN'">
          <el-button type="text" @click.native="delet(row)">删除</el-button>
          <el-button type="text" @click.native="edit(row)">修改</el-button>
        </template>
      </template>
    </zte-table>
    <el-dialog
      width="40%"
      class="noticeForm"
      v-if="noticeVisible"
      :visible.sync="noticeVisible"
      :title="isEdit ? '修改' : '新增' + '公告'">
      <zte-form
        :itemInfo="noticeInfo"
        :form="noticeForm"
        @submit='submit'
        :isCancel='false'>
      </zte-form>
    </el-dialog>
    <el-dialog
      width="40%"
      class="viewNoticeForm shot_height"
      v-if="viewNoticeVisible"
      :visible.sync="viewNoticeVisible"
      title="公告详情">
      <div class="title">{{ noticeForm.title }}</div>
      <div class="content">{{ noticeForm.content }}</div>
    </el-dialog>
  </div>
</template>

<script>

export default {
  name: 'notice',
  data() {
    return {
      identity: JSON.parse(window.localStorage.getItem('userData')).userType,
      noticeVisible: false,
      viewNoticeVisible: false,
      dialogTitle: '新增',
      noticeInfo: [
        {
          label: '标题',
          code: 'title',
          type: 'text',
        },
        {
          label: '公告内容',
          code: 'content',
          type: 'textarea',
        },
      ],
      noticeForm: {},
      itemInfo: [
        {
          code: 'title',
          label: '标题',
          type: 'text',
        },
      ],
      tableColumn: [
        {
          code: 'operate',
          label: '操作',
          temp: 'operate',
          width: 150,
        },
        {
          label: '标题',
          code: 'title',
        },
        // {
        //   label: '发布内容',
        //   code: 'content',
        // },
        {
          label: '发布时间',
          code: 'createdDt',
        },
      ],
    };
  },
  created() {
  },
  methods: {
    add() {
      this.noticeForm = {};
      this.noticeVisible = true;
      this.isEdit = false;
    },
    edit(row) {
      this.noticeForm = row;
      this.noticeVisible = true;
      this.publishId = row.id;
      this.isEdit = true;
    },
    view(row) {
      this.noticeForm = row;
      this.viewNoticeVisible = true;
    },
    delet(row) {
      this.$http.post('/publish/delete', { publishId: row.id }).then(
        (res) => {
          if (res.data.ok) this.$message.success('删除成功');
          this.$refs.notice.getTableData();
        },
        () => {},
      );
    },
    submit(form) {
      const url = this.isEdit ? '/publish/update' : '/publish/save';
      form.publishId = this.publishId;
      this.$http.post(url, form).then(
        (res) => {
          if (res.data.ok) this.$message.success('保存成功');
          this.noticeVisible = false;
          this.$refs.notice.getTableData();
        },
        () => {},
      );
    },
  },
};
</script>

<style lang="scss">
.notice {
  .noticeForm {
    .el-textarea {
      display: block;
    }
  }
  .viewNoticeForm {
    .title {
      text-align: center;
      padding: 10px 0;
      font-size: 18px;
    }
    .content {
      padding: 20px 0;
      line-height: 22px;
      text-indent: 2em;
    }
  }
}
</style>
