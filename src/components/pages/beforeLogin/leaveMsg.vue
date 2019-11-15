<template>
  <div class="leaveMsg">
    <login-head currentPage="leaveMsg"></login-head>
    <div class="msgBox">
      <div class="msgTitle">及信通留言板</div>
      <div class="msgTips">尊敬的及信通用户，感谢您对及信通信息平台的支持。欢迎您对我们提出宝贵的意见和建议！</div>
      <div class="content">
        <zte-form
        :itemInfo="itemInfo"
        submitText='留言'
        cancelText='清空'
        @submit="submit">
      </zte-form>
      </div>
    </div>
    <div class="foot">
      <div class="text_title">我们的特色</div>
      <div class="text_content">竭力为您提供便捷、安全、稳定的平台服务</div>
      <div class="tips_box">
        <div class="tips_box_detail">
          <img class="box_icon" src="../../../assets/images/icon.png" alt="">
          <div class="box_font">新产业、新技术：及时发现行业新型产业和技术，预估行业未来趋势</div>
        </div>
        <div class="tips_box_detail">
          <img class="box_icon" src="../../../assets/images/icon.png" alt="">
          <div class="box_font">资源整合：整合零碎的行业，及时响应对接</div>
        </div>
        <div class="tips_box_detail">
          <img class="box_icon" src="../../../assets/images/icon.png" alt="">
          <div class="box_font">人才招聘：挖掘人才</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script type='text/javascript'>
import loginHead from './login-head';

export default {
  name: 'leaveMsg',
  components: { loginHead },
  data() {
    return {
      itemInfo: [
        {
          code: 'mobileNumber',
          label: '手机号码',
          type: 'text',
        },
        {
          code: 'content',
          label: '留言板',
          type: 'textarea',
        },
      ],
    };
  },
  created() {
  },
  methods: {
    submit(form) {
      const params = form;
      this.$http.post('/messageBoard/save', params).then(
        () => {
          this.$message.success('留言成功');
        },
        () => {},
      );
    },
  },
};
</script>

<style lang='scss'>
@import "../../../assets/scss/theme";
.leaveMsg {
  .msgBox {
    font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
    padding: 20px 100px;
    padding-bottom: 70px;
    background: #f8f8f8;
    .msgTitle {
      color: #303133;
      text-align: center;
      font-size: 24px;
      padding-top: 30px;
    }
    .msgTips {
      color: #606266;
      text-align: center;
      font-size: 16px;
      line-height: 25px;
      margin-top: 20px;
      margin-bottom: 30px;
    }
    .content {
      width: 50%;
      margin: 0 auto;
      .zte-form {
        padding-top: 30px;
        padding-right: 100px;
        background: none;
        .content {
          .el-textarea__inner {
            height: 200px!important;
          }
        }
        .button-list {
          margin-top: 20px;
          .el-form-item__content {
            padding-top: 20px;
            padding-left: 100px;
            display: flex;
          }
        }
      }
    }
  }
  .foot {
    height: 308px;
    width: 100%;
    background: #fff;
    text-align: center;
    .text_title {
      font-size:24px;
      font-family:PingFangSC-Semibold;
      font-weight:600;
      color:rgba(51,51,51,1);
      line-height:33px;
      padding: 44px 0 9px 0;
    }
    .text_content {
      font-size:14px;
      font-family:PingFangSC-Regular;
      font-weight:400;
      color:rgba(126,126,126,1);
      line-height:20px;
    }
    .tips_box {
      display: flex;
      justify-content: space-around;
      margin-top: 40px;
      .tips_box_detail {
        width: 310px;
        .box_font {
          font-size:14px;
          font-family:PingFangSC-Medium;
          font-weight:500;
          color:rgba(51,51,51,1);
          line-height:20px;
        }
        .box_icon {
          width: 61px;
          height: 69px;
        }
      }
    }
  }
}

</style>
