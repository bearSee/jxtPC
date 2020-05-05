<!--
 * @Author: your name
 * @Date: 2020-05-05 16:45:22
 * @LastEditTime: 2020-05-05 16:51:13
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: /nginx/Users/bear/Desktop/jxtPC/src/components/pages/changePassword.vue
 -->
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
          code: 'oldPwd',
          label: '旧密码',
          type: 'password',
        },
        {
          code: 'pwd1',
          label: '新密码',
          type: 'password',
        },
        {
          code: 'pwd2',
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
      this.$http.post('/my/resetPassword', form).then(
        () => {
          this.$message.success('保存成功');
          this.$emit('close');
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
