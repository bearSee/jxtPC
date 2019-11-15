<template>
  <div class="platformIntroduce">
    <login-head currentPage="platformIntroduce"></login-head>
    <div class="text_box">
      <div class="title">及信通是什么？</div>
      <div class="paragraph">及信通是连接电子产品及相关行业的平台。从采购电子产品，制造电子产品及相关行业中的开发设计，机械设备，五金，注塑模具，塑胶颜料，电子元器件，仪表仪器，电池, PCB线路板,邦定,热熔,超声,包装印刷,外观，辅料等等相互间之需求。 资源整合;新产品，新工艺，个性化订制，招聘等的智能服务。</div>
      <div class="paragraph">如何才能第一时间得到自己想要的信息？ 及信通汇集电子产品及相关行业的千家万户。在这里，你可以选择自己所需要的信息和客户，在这里，你可以和这里所有厂商有机会进行整合。只要你想得到.都可能在这里实现。在这里,给所有想转行或跨界的厂商一个平台。</div>
      <div class="paragraph">这些资讯在这里只要你需要，就能第一时间呈现在你电脑上，手机里，把别人第一时间发布的你所需要的信息为你即时接收并发送给你。不让你错过对你有用的信息.不要等到想用时才到网上去找，当你在网上找到一条信息时，可能已经发布好长时间。 或许别人已经利用，亦或不在自己所需地域之内，你不知道你查讯后所需要的信息何时出现,凡此等等。在这里及信通信息智能处理平台时时刻刻从不间断地为你收集对你有用的信息，让刚出来的第一手信息为你分享</div>
      <div class="paragraph">一条信息可能让工厂起死回生。一条信息可能获得先机，一条信息可能占领优势，一条信息也可能让你公司赚上一笔财富。 你是否想第一时间发现新产品或新工艺？让你的视野领先同行 你是否需要某方面的人脉关系来拓展公司的业务？让这方面有能力的人来给你帮忙 你是否想和上下游（其它）公司资源共享？ 让你的财富膨胀，你是否想转行或扩张,这里有一座桥梁。</div>
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
          <div class="box_font">资源整合：为您及时准确找到相对应的人脉和资源，快速达成目标</div>
        </div>
        <div class="tips_box_detail">
          <img class="box_icon" src="../../../assets/images/icon.png" alt="">
          <div class="box_font">人才招聘：助但未找到合适的人才，助个人找到合适的职位</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script type='text/javascript'>
import loginHead from './login-head';

export default {
  name: 'platformIntroduce',
  components: { loginHead },
  data() {
    return {
    };
  },
  methods: {
  },
};
</script>

<style lang='scss'>
@import "../../../assets/scss/theme";
body {
  overflow: auto;
  background: #fff;
}
.platformIntroduce {
  width: 100%;
  .text_box {
    font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
    padding: 20px 400px;
    background: f8f8f8;
    margin-bottom: 50px;
    .title {
      color: #303133;
      text-align: center;
      font-size: 24px;
      padding: 20px 0;
    }
    .paragraph {
      text-indent: 2em;
      color: #606266;
      font-size: 16px;
      line-height: 25px;
      margin: 10px 0;
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
