<template>
  <div class="changePassword">
    <zte-form
      :rowSize='1'
      :itemInfo="itemInfo"
      cancelText="清空"
      @submit="submit">
    </zte-form>
  </div>
</template>

<script type='text/javascript'>

export default {
  name: 'changePassword',
  data() {
    return {
      itemInfo: [
        {
          code: '1',
          label: '旧密码',
          type: 'password',
        },
        {
          code: '2',
          label: '新密码',
          type: 'password',
        },
        {
          code: '3',
          label: '确认密码',
          type: 'password',
        },
      ],
    };
  },
  created() {
  },
  methods: {
    submit(form) {
      const params = form;
      this.$http.post('/', params).then(
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
// .changePassword {
//   background: #fff;
//   .zte-form {
//     padding-top: 30px;
//     .button-list {
//       .el-form-item__content {
//         padding-top: 20px;
//         padding-left: 100px;
//         display: flex;
//       }
//     }
//     .el-input__inner {
//       width: 40%;
//     }
//   }
// }
</style>
