<template>
  <div class="login">
    <div class="box">
      <login-head currentPage="login"></login-head>
      <img class="banner" src="../../assets/images/callMe_bg.png" alt="">
      <div class="login-pad">
        <div class="login-form">
          <div class="form_title">账号登录</div>
          <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="demo-ruleForm" >
            <el-form-item class="item-line" prop="mobileNumber">
              <img class="form_icon" src="../../assets/images/acount.png" alt="">
              <input class="el-input__inner" type="text" :placeholder="'帐号'" v-model="ruleForm.mobileNumber" auto-complete="off" @keyup.enter="submitForm('ruleForm')">
            </el-form-item>
            <el-form-item class="item-line" prop="password">
              <img class="form_icon" src="../../assets/images/passport.png" alt="">
              <input class="el-input__inner" type="password" :placeholder="'密码'" v-model="ruleForm.password" auto-complete="off" @keyup.enter="submitForm('ruleForm')">
            </el-form-item>
            <div class="savePassword">
              <el-checkbox v-model="saveRuleForm">记住账号</el-checkbox>
              <!-- <span class="tips">忘记密码?</span> -->
            </div>
            <el-form-item class="loginbtn">
              <el-button type="primary" :loading="submitLoading" @click="submitForm('ruleForm')">登录</el-button>
            </el-form-item>
            <div class="register">
              <div class="tips">还没有账号?</div>
              <div class="registerbtn" @click="registerVisible = true">立即注册>></div>
            </div>
          </el-form>
        </div>
      </div>
      <div class="foot">
        <div class="text_title">我们的特色</div>
        <div class="text_content">竭力为您提供便捷、安全、稳定的平台服务</div>
        <div class="tips_box">
          <div class="tips_box_detail">
            <img class="box_icon" src="../../assets/images/icon.png" alt="">
            <div class="box_font">新产业、新技术：及时发现行业新型产业和技术，预估行业未来趋势</div>
          </div>
          <div class="tips_box_detail">
            <img class="box_icon" src="../../assets/images/icon.png" alt="">
            <div class="box_font">资源整合：整合零碎的行业，及时响应对接</div>
          </div>
          <div class="tips_box_detail">
            <img class="box_icon" src="../../assets/images/icon.png" alt="">
            <div class="box_font">人才招聘：挖掘人才</div>
          </div>
        </div>
      </div>
    </div>
    <el-dialog
      center
      width="35%"
      title="用户注册"
      class="register"
      v-if="registerVisible"
      :visible.sync="registerVisible">
      <zte-form
        ref="register"
        :itemInfo="registerInfo"
        submitText="注册"
        cancelText="关闭"
        @submit="registerSubmit"
        @reset="registerVisible = false">
        <template slot='codeButtom'>
          <el-button size="mini" type="primary" :disabled="isGetCoding" @click.native="getCode">{{ isGetCoding ? `${time}s` : '获取验证码'}}</el-button>
        </template>
      </zte-form>
    </el-dialog>
  </div>
</template>

<script>
import loginHead from '../pages/beforeLogin/login-head';

export default {
  name: 'login',
  components: { loginHead },
  data() {
    return {
      clientWidth: 1440,
      clientHeight: 0,
      cdn: `${window.location.protocol}//${window.location.host}/image`,
      root: `${window.location.protocol}//${window.location.host}/`,
      ruleForm: {
        mobileNumber: '',
        password: '',
      },
      saveRuleForm: false,
      rules: {
        // mobileNumber: [
        //   { required: true, message: '请输入账户名称', trigger: 'blur,change' },
        // ],
        // password: [
        //   { required: true, message: '请输入密码', trigger: 'blur,change' },
        // ],
        // validateCode: [
        //   { required: true, message: '请输入验证码', trigger: 'blur' },
        //   { min: 4, max: 4, message: '验证码长度为 4 个字符', trigger: 'blur' },
        // ],
      },
      submitLoading: false,
      registerVisible: false,
      registerInfo: [
        {
          label: '手机号',
          code: 'mobileNumber',
          type: 'text',
          required: true,
        },
        {
          label: '密码',
          code: 'password',
          type: 'password',
          required: true,
        },
        {
          label: '账户类型',
          code: 'userType',
          type: 'select',
          options: [
            {
              value: 'Z001001',
              label: '企业用户',
            },
            {
              value: 'Z001002',
              label: '个人用户',
            },
          ],
          required: true,
        },
        {
          label: '验证码',
          code: 'verifyCode',
          type: 'text',
          required: true,
          itemWidth: 70,
        },
        {
          label: '',
          code: 'codeButtom',
          type: 'temp',
          itemWidth: 30,
        },
      ],
      isGetCoding: false,
      time: 120,
    };
  },
  created() {
    const ruleForm = window.localStorage.getItem('ruleForm');
    if (ruleForm) {
      this.ruleForm = JSON.parse(ruleForm);
      this.saveRuleForm = true;
    }
  },
  watch: {
    saveRuleForm(val) {
      if (val) {
        window.localStorage.setItem('ruleForm', JSON.stringify(this.ruleForm));
        return;
      }
      window.localStorage.removeItem('ruleForm');
    },
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          this.submitLoading = true;
          await this.loginAction();
        }
      });
    },
    async loginAction() {
      if (this.saveRuleForm) window.localStorage.setItem('ruleForm', JSON.stringify(this.ruleForm));
      await this.$http.post('init/login', this.ruleForm).then(
        (res) => {
          res = res.data;
          if (res) {
            window.localStorage.setItem('Authorization', res.Authorization);
            window.localStorage.setItem('userData', JSON.stringify(res.user));
          }
          this.submitLoading = false;
          this.changeMune(res.user.userType);
          if (res.user.userType === 'ADMIN') {
            this.$router.push('/reportAudit');
            return;
          }
          if (res.user.approveState !== 'Z007002') {
            this.$router.push('/myJiXin');
            return;
          }
          this.$router.push('/index');
        },
        () => {
          this.submitLoading = false;
        },
      );
    },
    changeMune(userType) {
      this.$router.options.routes = this.$router.options.routes.map((route) => {
        if (route.path === '/index') {
          route.children = route.children.map((d) => {
            if (d.path === '/recruitmentNews') d.name = `${userType.userType === 'Z001002' ? '应聘' : '招聘'}消息`;
            return d;
          });
        }
        return route;
      });
      console.log('tag', this.$router.options.routes);
    },
    registerSubmit(form) {
      this.$http.post('init/register', form).then(
        () => {
          this.registerVisible = false;
          this.$message.success('注册成功');
        },
        () => {},
      );
    },
    getCode() {
      this.$http.post('init/verifcatCode', { mobileNumber: this.$refs.register.currentForm.mobileNumber }).then(
        () => {
          this.isGetCoding = true;
          const timer = setInterval(() => {
            if (this.time === 0) {
              clearInterval(timer);
              this.isGetCoding = false;
              this.time = 120;
            }
            this.time--;
          }, 1000);
        },
        () => {},
      );
    },
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
};

</script>


<style lang="scss">
@import "../../assets/scss/theme.scss";
$font: #999;

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
    }
    .login-pad {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      right: 13%;
      z-index: 1;
      width: 343px;
      height: 376px;
      padding: 40px 30px;
      display: flex;
      flex-direction: column;
      background: rgba(251,249,246,1);
      box-shadow: 0px 1px 2px 0px rgba(0,0,0,0.5);
      border-radius: 5px;

      .login-form {
        .form_title {
          font-size:16px;
          font-family:PingFangSC-Medium;
          font-weight:500;
          color:rgba(72,72,72,1);
          line-height:22px;
          margin-bottom: 25px;
        }
        .demo-ruleForm {
          .savePassword, .register {
            display: flex;
            justify-content: space-between;
            .tips, .registerbtn {
              line-height: 19px;
              font-size: 14px;
              color:rgba(149,150,154,1);
            }
            .registerbtn {
              cursor: pointer;
              color: #1594FF;
            }
          }
          .el-form-item__content {
            display: flex;
            flex-direction: row;
            position: relative;
            .form_icon {
              width: 22px;
              height: 22px;
              position: absolute;
              top: 50%;
              left: 4px;
              transform: translate(0, -50%);
            }
            input {
              border-width: 0px;
              height: 40px;
              font-weight: lighter;
              padding-left: 30px;
              background:rgba(255,255,255,1);
              box-shadow:0px 1px 4px 0px rgba(0,0,0,0.31);
              border-radius:3px;
              border:1px solid rgba(178,178,178,1);
            }
          }

          & .el-form-item {
            .el-form-item__content {
              .el-button {
                width: 100%;
                height: 40px;
                font-size: 18px;
                span {
                  color: #fff;
                }
              }
            }
          }
          .loginbtn {
            margin: 20px 0;
            // background:linear-gradient(180deg,rgba(18,125,255,1) 0%,rgba(15,116,228,1) 100%);
            // box-shadow:0px 1px 3px 0px rgba(118,181,239,1);
            border-radius:2px;
            // border:1px solid rgba(25,92,167,1);
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
  .codeButtom {
    min-width: 0px!important;
    .el-form-item__content {
      text-align: right;
      margin-left: 0px!important;
      .el-button {
        padding: 7px;
        min-width: 76px;;
      }
    }
  }
  .verifyCode {
    min-width: 100px!important;
  }
  .el-dialog {
    border-radius: 5px;
    padding-right: 15px;
  }
}
</style>

