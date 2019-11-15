<template>
  <div class="callMe">
    <div class="login">
      <div class="box">
        <login-head currentPage="callMe"></login-head>
        <img class="banner" src="../../../assets/images/callMe_bg.png" alt="">
        <!-- <img v-if="clientWidth > 1440" class="banner" src="../../assets/images/callMe_bg.png" alt="">
        <img v-else class="bg2" src="../../assets/images/callMe_bg.jpg" alt=""> -->
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
    </div>
  </div>
</template>

<script type='text/javascript'>
import loginHead from './login-head';

export default {
  name: 'callMe',
  components: { loginHead },
  data() {
    return {
      clientWidth: 1440,
      clientHeight: 0,
    };
  },
  mounted() {
    this.clientHeight = document.documentElement.clientHeight;
    this.clientWidth = document.documentElement.clientWidth;
    // 然后监听window的resize事件．在浏览器窗口变化时再设置下背景图高度．
    const that = this;
    window.onresize = function temp() {
      that.clientHeight = document.documentElement.clientHeight;
      that.clientWidth = document.documentElement.clientWidth;
    };
  },
  methods: {
  },
};
</script>

<style lang='scss'>
@import "../../../assets/scss/theme";
.login {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  // background: #0E5DFF;
  .box {
    position: relative;
    width: 100%;
    height: 100%;
    overflow-y: auto;
    .banner {
      width: 100%;
      // height: 61.25%;
      // min-height: 592px;
      // min-width: 1920px;
      // position: absolute;
      // left: 50%;
      // top: 6.25%;
      // transform: translate(-50%, 0);
    }
    // .bg2 {
    //   min-height: 592px;
    //   min-width: 1440px;
    //   height: 61.25%;
    // }
    .foot {
      height: 22.5%;
      min-height: 308px;
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
}
</style>
