<template>
  <div class="login-head">
    <div class="head">
      <img class="company_logo" src="../../../assets/images/logo.png" alt="">
      <div class="login-info">
        <div class="btn_group">
          <img src="../../../assets/images/aboutUs.png" alt="">
          <div @click="goToIndex">首页</div>
        </div>
        <div class="btn_group">
          <img src="../../../assets/images/aboutUs.png" alt="">
          <div @click="aboutUs">平台介绍</div>
        </div>
        <div class="btn_group">
          <img src="../../../assets/images/callMe.png" alt="">
          <div @click="callMe">联系我们</div>
        </div>
        <div class="btn_group">
          <img src="../../../assets/images/leaveMsg22.png" alt="">
          <div @click="leaveMsg">留言板</div>
        </div>
        <div class="btn_group head_login" v-show="currentPage !== 'login'">
          <div @click="goToLogin" class="head_login_btn">登录</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'login-head',
  props: {
    currentPage: {
      type: String,
      default: 'login',
    },
  },
  data() {
    return {
      typeList: {
        login: '',
        callMe: '',
        platformIntroduce: '',
        leaveMsg: '',
      },
    };
  },
  created() {
  },
  watch: {
  },
  methods: {
    goToIndex() {
      this.$router.push('/introduction');
    },
    goToLogin() {
      this.$router.push('/login');
    },
    // 平台介绍
    aboutUs() {
      this.$router.push('/platformIntroduce');
    },
    // 联系我们
    callMe() {
      this.$router.push('/callMe');
    },
    // 留言板
    leaveMsg() {
      this.$router.push('/leaveMsg');
      // this.$router.push('/msgList');
    },
  },
  mounted() {
  },
};

</script>


<style lang="scss">
@import "../../../assets/scss/theme.scss";
$font: #999;

.login-head {
  height: 60px;
  width: 100%;
  background: #1C1A28;
  position: relative;
  .head {
    height: 60px;
    width: 100%;
    background: #1C1A28;
    position: relative;
    .company_logo {
      height: 33px;
      width: 283px;
      position: absolute;
      left: 22px;
      top: 50%;
      transform: translate(0, -50%);
    }
    .login-info {
      color: #fff;
      position: absolute;
      right: 0;
      display: flex;
      min-width: 325px;
      justify-content: space-around;
      height: 100%;
      font-family: "微软雅黑";
      font-size: 15px;
      .btn_group {
        margin: auto 0;
        height: 25px;
        padding-right: 18px;
        display: flex;
        img {
          width: 18px;
          height: 18px;
          position: relative;
          top: 4px;
          right: 2px;
        }
        div {
          line-height: 25px;
          cursor: pointer;
        }
      }
      .head_login {
        height: 32px;
        .head_login_btn {
          border: 1px solid #fff;
          border-radius: 3px;
          padding: 3px 10px;
        }
      }
    }
  }
}
</style>

