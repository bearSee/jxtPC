<template>
  <div class="introduction">
    <div class="introduction_box">
      <div class="introduction_head">
        <div class="head_info">
          <img class="company_logo" src="../../../assets/images/logo.png" alt="">
          <div class="btn">
            <img src="../../../assets/images/index.png" alt="">
            <div @click="goToScroll(0)">首页</div>
          </div>
          <div class="btn">
            <img src="../../../assets/images/aboutUs.png" alt="">
            <div @click="goToScroll(1)">平台介绍</div>
          </div>
          <div class="btn">
            <img src="../../../assets/images/callMe.png" alt="">
            <div @click="goToScroll(3)">联系我们</div>
          </div>
          <div class="btn">
            <img src="../../../assets/images/leaveMsg22.png" alt="">
            <div @click="goToScroll(4)">留言板</div>
          </div>
        </div>
        <div class="btn_group">
          <div @click="gotoLogin" class="btn_group_login">登录</div>
          <div @click="gotoRegister" class="btn_group_registe">注册</div>
          <!-- <div @click="loginVisible = true" class="btn_group_login">登录</div>
          <div @click="registerVisible = true" class="btn_group_registe">注册</div> -->
        </div>
      </div>
    </div>
    <div class="introduction_body" id="introduction_body">
      <div class="contentpage1 contentpage">
        <transition>
          <div class="active_box animated fadeInDown" v-show="currentPage === 1">
            <div class="font_title">一场信息应用方式的变革</div>
            <div class="font_dec">集上下游伙伴之力，成就新的商业之事</div>
            <div class="font_btn" @click="readyRegister = false;readyReset = false;readyLogin = true">立即加入</div>
            <!-- <div class="font_btn" @click="loginVisible = true">立即加入</div> -->
          </div>
        </transition>
        <img src="/image/introduction_bg.png" class="head_img">
        <!-- 登录表单 -->
        <transition>
          <div :class="`login-pad animated ${readyLogin ? 'fadeIn' : 'fadeOut'}`" v-show="readyLogin">
            <div class="login-form">
              <div class="form_title">
                <div>登录</div>
                <div class="bottom_line"><div class="line1"></div></div>
              </div>
              <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="demo-ruleForm" >
                <el-form-item class="item-line" prop="mobileNumber">
                  <img class="form_icon" src="../../../assets/images/acount.png" alt="">
                  <input class="el-input__inner" type="text" placeholder="手机号" v-model="ruleForm.mobileNumber" auto-complete="off" @keyup.enter="submitForm('ruleForm')">
                </el-form-item>
                <el-form-item class="item-line" prop="password">
                  <img class="form_icon" src="../../../assets/images/passport.png" alt="">
                  <input class="el-input__inner" type="password" placeholder="密码" v-model="ruleForm.password" auto-complete="off" @keyup.enter="submitForm('ruleForm')">
                </el-form-item>
                <div class="savePassword">
                  <el-checkbox v-model="saveRuleForm">记住账号</el-checkbox>
                  <span class="tips forgetPassword" @click="readyReset = true;readyLogin = false;readyRegister = false">忘记密码?</span>
                  <!-- <span class="tips">忘记密码?</span> -->
                </div>
                <el-form-item class="loginbtn">
                  <el-button type="primary" :loading="submitLoading" @click="submitForm('ruleForm')">登录</el-button>
                </el-form-item>
                <div class="register">
                  <div class="tips">还没有账号?</div>
                  <div class="registerbtn" @click="readyReset = false;readyLogin = false;readyRegister = true">前往注册>></div>
                </div>
              </el-form>
            </div>
          </div>
        </transition>
        <!-- 注册表单 -->
        <transition>
          <div :class="`register-pad animated ${readyRegister ? 'fadeIn' : 'fadeOut'}`" v-show="readyRegister">
            <div class="form_title">
              <div>注册</div>
              <div class="bottom_line"><div class="line1"></div></div>
            </div>
            <zte-form
              ref="register"
              :labelWidth="80"
              :leftLabel="true"
              :itemInfo="registerInfo"
              submitText="立即注册"
              @submit="registerSubmit"
              :isCancel="false">
              <template slot='verifyCode' slot-scope="{ form }">
                <el-input class="verifyInput" placeholder="验证码" v-model="form.verifyCode"></el-input>
                <el-button class="verifyButtom" size="mini" :loading="isGetCoding" @click.native="getCode">{{ isGetCoding ? `${time == '120' ? '获取中' : time + 's'}` : '获取验证码'}}</el-button>
              </template>
              <template slot='content'>
                <el-checkbox v-model="agreeFile">我已阅读并同意<span @click.stop="fileVisible = true" style="color:#1076EC">《网站协议》</span></el-checkbox>
              </template>
            </zte-form>
          </div>
        </transition>
        <!-- 重置密码表单 -->
        <transition>
          <div :class="`register-pad reset-pad animated ${readyReset ? 'fadeIn' : 'fadeOut'}`" v-show="readyReset">
            <div class="form_title">
              <div>重置密码</div>
              <div class="bottom_line"><div class="line1"></div></div>
            </div>
            <zte-form
              ref="readyReset"
              :labelWidth="80"
              :leftLabel="true"
              :itemInfo="resetInfo"
              submitText="完成并登录"
              @submit="resetSubmit"
              :isCancel="false">
              <template slot='verifyCode' slot-scope="{ form }">
                <el-input class="verifyInput" placeholder="验证码" v-model="form.verifyCode"></el-input>
                <el-button class="verifyButtom" size="mini" :loading="isGetResetCoding" @click.native="getResetCode">{{ isGetResetCoding ? `${resetTime == '120' ? '获取中' : resetTime+ 's'}` : '获取验证码'}}</el-button>
              </template>
            </zte-form>
          </div>
        </transition>
      </div>
      <div class="contentpage2 contentpage">
        <img src="../../../assets/images/b2.png" class="head_img">
        <div class="foot">
          <div class="text_title">我们的特色</div>
          <div class="text_content">您所需的信息正好也是客户所给予的信息,得到及时准确的对接</div>
          <div class="tips_box">
            <div class="tips_box_detail">
              <img class="box_icon" src="../../../assets/images/icon1.png" alt="">
              <div class="box_font">新技术/新产品 及时发现行业中的新技术/新产品,得到快速应用和推广</div>
            </div>
            <div class="tips_box_detail">
              <img class="box_icon" src="../../../assets/images/icon2.png" alt="">
              <div class="box_font">资源整合：为您及时准确找到相对应的人脉和资源，快速达成目标</div>
            </div>
            <div class="tips_box_detail">
              <img class="box_icon" src="../../../assets/images/icon3.png" alt="">
              <div class="box_font">人才招聘：助单位找到合适的人才，助个人找到合适的职位</div>
            </div>
          </div>
        </div>
      </div>
      <div class="contentpage3 contentpage">
        <img src="../../../assets/images/b3.png" class="head_img">
        <div class="foot">
          <img class="dou_up" src="../../../assets/images/dou_up.png" alt="">
          <div class="text_box">
            <div class="title">关于及信通</div>
            <div class="paragraph">及信通是连接电子产品及其相关行业信息资源整合的平台.从产品开发设计,生产,营销,及其相关行业中的机械设备,五金,注塑模具,塑胶颜料,电子元器件,仪表仪器,电池, PCB线路板,邦定,热熔,超声,包装印刷,外观工艺等相互间之需求, 资源整合,新产品，新工艺，招聘应聘等的智能服务。</div>
            <div class="paragraph">你发挥有创意的方案,你天马行空的金点子,你发明,创造或能改善的技术,你需要的整合,你需要的共享,你需要的实践生产,及信通从千家万户中为你智能选取志同道合,有共同兴趣的团队和个人,而这也正是对方所需的,想推自己的产品,想展自己的优势,想得到所要的需求,而这也正是对方所需的,你所需要的也正好是对方所给予的。</div>
            <div class="paragraph">一条信息可能让工厂起死回生。一条信息可能获得先机，一条信息可能占领优势，一条信息也可能让你公司赚上一笔财富。如何才能第一时间得到自己想要的信息？ 及信通汇集电子产品及相关行业的千家万户。在这里，你可以精准选择自己所需要的信息和客户,得到及时准确的对接。在这里,你可以追寻最新的产品和技术, 最新的工艺展示,得到快速应用和推广。在这里,把别人第一时间发布的你所需要的信息为你即时接收并把你推送给对方。在这里….在这里没有排名也无需推广,第一时间帮您找到最需要最适合的信息是我们的使命。</div>
          </div>
          <img class="dou_down" src="../../../assets/images/dou_down.png" alt="">
        </div>
      </div>
      <div class="contentpage4 contentpage">
        <transition>
          <div class="active_box animated fadeInUp" v-show="currentPage === 4">
            <div class="font_title">选择及信通  “助”您成功</div>
            <div class="font_dec" style="line-height:32px">
              你发挥有创意的方案, 你天马行空的金点子, 你发明、创造或能改善的技术, 你需要的整合, 你需要的共享, 你需要的实践生产, 及信通从千家万户中为你智能选取志同道合,有共同兴趣的团队和个人, 而这也正是对方所需的
            </div>
            <el-button class="font_btn" @click="goToScroll(4)">联系我们</el-button>
          </div>
        </transition>
        <img src="../../../assets/images/statistics.png" class="head_img">
      </div>
      <div class="contentpage5 contentpage">
        <div class="msgTitle">及信通留言板</div>
        <div class="msgTips">尊敬的及信通用户，感谢您对及信通信息平台的支持。欢迎您对我们提出宝贵的意见和建议！</div>
        <div class="msg_content">
          <zte-form
            :itemInfo="msgItemInfo"
            submitText='留言'
            cancelText='清空'
            @submit="msgSubmit">
          </zte-form>
        </div>
        <div class="foot">&#169;2018 及信通行业信息发布平台&nbsp;&nbsp;<a href="http://www.beian.miit.gov.cn/">粤ICP备19058676号</a></div>
      </div>
    </div>
    <el-dialog
      center
      title="账号注册"
      class="register_dialog"
      v-if="registerVisible"
      :visible.sync="registerVisible">
      <div class="bottom_line"><div class="line1"></div></div>
      <zte-form
        ref="register"
        class="register-form"
        :labelWidth="80"
        :leftLabel="true"
        :itemInfo="registerInfo"
        submitText="立即注册"
        @submit="registerSubmit"
        :isCancel="false">
        <template slot='verifyCode' slot-scope="data">
          <el-input class="verifyInput" v-model="data.form.verifyCode"></el-input>
          <el-button class="verifyButtom" size="mini" :loading="isGetCoding" @click.native="getCode">{{ isGetCoding ? `${time}s` : '获取验证码'}}</el-button>
        </template>
        <template slot='content'>
          <el-checkbox v-model="agreeFile">我已阅读并同意<span @click.stop="fileVisible = true" style="color:#1076EC">《网站协议》</span></el-checkbox>
        </template>
      </zte-form>
    </el-dialog>
    <el-dialog
      center
      title="账号登录"
      class="login_dialog"
      v-if="loginVisible"
      :visible.sync="loginVisible">
      <div class="bottom_line"><div class="line1"></div></div>
      <div class="login-form">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="demo-ruleForm" >
          <el-form-item class="item-line" prop="mobileNumber">
            <i class="el-icon-mobile-phone"></i>
            <img class="form_icon" src="../../../assets/images/acount.png" alt="">
            <input class="el-input__inner" type="text" :placeholder="'手机号码'" v-model="ruleForm.mobileNumber" auto-complete="off" @keyup.enter="submitForm('ruleForm')">
          </el-form-item>
          <el-form-item class="item-line" prop="password">
            <img class="form_icon" src="../../../assets/images/passport.png" alt="">
            <input class="el-input__inner" type="password" :placeholder="'密码'" v-model="ruleForm.password" auto-complete="off" @keyup.enter="submitForm('ruleForm')">
          </el-form-item>
          <div class="savePassword">
            <el-checkbox v-model="saveRuleForm">记住账号</el-checkbox>
            <span class="tips">忘记密码?</span>
          </div>
          <!-- <el-checkbox v-model="agreeFile">我已阅读并同意<span @click.stop="fileVisible = true" style="color:#1076EC">《网站协议》</span></el-checkbox> -->
          <el-form-item class="loginbtn">
            <el-button type="primary" :loading="submitLoading" @click="submitForm('ruleForm')">登录</el-button>
          </el-form-item>
          <div class="register">
            <div class="tips">还没有账号?</div>
            <div class="registerbtn" @click="loginVisible = false;registerVisible = true">前往注册>></div>
          </div>
        </el-form>
      </div>
    </el-dialog>
    <el-dialog
      width="50%"
      class="fileDetail"
      :visible.sync="fileVisible"
      title="注册协议">
      <div class="content">
        <div class="paragraph">
          欢迎您访问及信通行业信息发布平台网站（以下简称及信通），在您访问或使用本网站之前，请您一定仔细阅读服务条款协议。一旦您以任何方式登陆本网站或直接、间接使用本网站信息，即表示您不加修改地、无条件接受本协议中所包含的全部条款（包括且不限于本网站根据实际情况对条款进行的修改、补充以及相应通告），并且遵守有关互联网相关法律和本网站的规定与规则。
        </div>
        <div class="title">网站使用</div>
        <div class="paragraph">
          及信通仅供能够根据相关法律订立具有法律约束力的合约的个人或公司使用。因此，您的年龄必须在十八周岁或以上，才可使用本公司服务。
        </div>
        <div class="title">本网站上的信息</div>
        <div class="paragraph">
          本网站上的用户或他们的产品及相应服务等的信息均由用户自行提供，用户依法对其承担全部法律责任。本网站对此类信息及相关信息的准确性、完整性、合法性或真实性均不承担任何法律责任。同时，本网站对任何使用或提供本网站信息进行商业活动产生的风险均不承担任何法律责任。本网站用户表述的任何意见，并不代表本网站、本网站运营商或本网站关联公司的意见。因此而产生的法律责任由用户自行承担。
        </div>
        <div class="p">1．同意在享用及信通服务的同时，同意接受及信通提供的各类信息服务。</div>
        <div class="p">2．除非本服务协议明确规定，不得对及信通服务中的任何信息、软件、产品或服务进行修改、拷贝、传播、传送、显示、运行、复制、发表、许可、制造衍生产品、转让或销售。</div>
        <div class="p">3．保证向及信通提交的注册信息均真实、准确、及时、详尽和完整.保证通过及信通服务所从事的一切活动都是合法、真实的，不会有欺诈成份,不侵害任何第三方的合法权益。</div>
        <div class="p">4.及信通没有义务使用及信通服务的行为进行监督。但是，及信通保留权利在任何时候、无需给予通知并可以凭借任何理由终止使用及信通服务。</div>
        <div class="p">5、免责声明</div>
        <div class="p_son">
          本网站在此特别声明对如下事宜不承担任何法律责任：
        </div>
        <div class="p">（一）本网站在此声明，对您使用网站、与本网站相关的任何内容、服务或其它链接至本网站的站点、内容均不作直接、间接、法定、约定的保证。</div>
        <div class="p">（二）由于网站服务的特殊性，本网站不担保网络服务一定能满足您的要求，也不担保网络服务不会中断，对网络服务的及时性、安全性、准确性也都不作担保。因任何原因造成网络服务的中断给您造成的损失，本网站不承担任何法律责任。</div>
        <div class="p">（三）无论在任何原因下（包括但不限于疏忽原因），对您或任何人通过使用本网站上的信息或由本网站链接的信息，或其他与本网站链接的网站信息所导致的损失或损害（包括直接、间接、特别或后果性的损失或损害，责任均由使用者自行承担,包括但不限于疏忽责任）。使用者对本网站的使用即表明同意承担浏览本网站的全部风险。</div>
        <div class="p_son_son">
        </div>
        <div class="title">权利声明</div>
        <div class="p">1.与及信通服务相关的任何产品和服务，其所有权和知识产权归及信通所有。</div>
        <div class="p">2.因使用及信通各项服务而提供的全部信息，同意及信通享有使用权及授权他人使用的权利。</div>
        <div class="p">3.使用及信通服务的行为将视为对本服务协议全部内容的接受。</div>
        <div class="title">
          及信通向您提供的服务付出了大量的成本，目前是免费的.如未来及信通向您收取合理费用，及信通通过法定程序后通知您，确保您有充分选择的权利，免费的试用服务不应视为及信通放弃收费的权利，及信通保留随时通知收费的权利。
        </div>
        <div class="title">
          本协议最终解释权归及信通所有。
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { setInterval, clearInterval } from 'timers';
import loginHead from './login-head';

export default {
  components: { loginHead },
  data() {
    return {
      currentPage: 1,
      btnDisabled: false,
      readyLogin: false,
      readyRegister: false,
      readyReset: false,
      loginVisible: false,
      registerVisible: false,
      forgetVisible: false,
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
          placeholder: '请输入',
          type: 'temp',
          required: true,
        },
      ],
      isGetCoding: false,
      time: 120,
      resetInfo: [
        {
          label: '手机号',
          code: 'mobileNumber',
          type: 'text',
          required: true,
        },
        {
          label: '新密码',
          code: 'password',
          type: 'password',
          required: true,
        },
        {
          label: '验证码',
          code: 'verifyCode',
          placeholder: '请输入',
          type: 'temp',
          required: true,
        },
      ],
      isGetResetCoding: false,
      resetTime: 120,
      msgItemInfo: [
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
      agreeFile: false,
      fileVisible: false,
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
    gotoLogin() {
      const currentTop = document.getElementById('introduction_body').scrollTop;
      if (currentTop !== 0) {
        this.goToScroll(0);
        setTimeout(() => {
          this.readyRegister = false;
          this.readyReset = false;
          this.readyLogin = true;
        }, 1000);
        return;
      }
      this.readyRegister = false;
      this.readyReset = false;
      this.readyLogin = true;
    },
    gotoRegister() {
      const currentTop = document.getElementById('introduction_body').scrollTop;
      if (currentTop !== 0) {
        this.goToScroll(0);
        setTimeout(() => {
          this.readyLogin = false;
          this.readyReset = false;
          this.readyRegister = true;
        }, 1000);
        return;
      }
      this.readyLogin = false;
      this.readyReset = false;
      this.readyRegister = true;
    },
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
    registerSubmit(form) {
      if (!this.agreeFile) {
        this.$message.warning('请勾选同意网站协议按钮');
        return;
      }
      this.$http.post('init/register', form).then(
        () => {
          this.registerVisible = false;
          this.$message.success('注册成功');
          this.ruleForm = form;
          this.loginAction();
        },
        () => {},
      );
    },
    resetSubmit(form) {
      this.$http.post('/init/forget', form).then(
        () => {
          this.$message.success('重置成功');
          this.ruleForm = form;
          this.loginAction();
        },
        () => {},
      );
    },
    // 注册获取验证码
    getCode() {
      this.isGetCoding = true;
      this.$http.post('init/verifcatCode', { mobileNumber: this.$refs.register.currentForm.mobileNumber }).then(
        (res) => {
          res = res.data;
          if (!res.ok) {
            this.isGetCoding = false;
            return;
          }
          const timer = setInterval(() => {
            if (this.time === 0) {
              clearInterval(timer);
              this.isGetCoding = false;
              this.time = 120;
            }
            this.time--;
          }, 1000);
        },
        () => {
          this.isGetCoding = false;
        },
      );
    },
    // 获取重置密码的验证码
    getResetCode() {
      this.isGetResetCoding = true;
      this.$http.post('/init/verifcatCode/forget', { mobileNumber: this.$refs.readyReset.currentForm.mobileNumber }).then(
        (res) => {
          res = res.data;
          if (!res.ok) {
            this.isGetResetCoding = false;
            return;
          }
          const resetTimer = setInterval(() => {
            if (this.resetTime === 0) {
              clearInterval(resetTimer);
              this.isGetResetCoding = false;
              this.resetTime = 120;
            }
            this.resetTime--;
          }, 1000);
        },
        () => {
          this.isGetResetCoding = false;
        },
      );
    },
    msgSubmit(form) {
      const params = form;
      this.$http.post('/messageBoard/save', params).then(
        () => {
          this.$message.success('留言成功');
        },
        () => {},
      );
    },
    goToScroll(pageNum) {
      // 计时器执行过程中按钮不可点击
      if (this.btnDisabled) return;
      this.btnDisabled = true;
      // 隐藏登录、注册表单
      this.readyLogin = false;
      this.readyReset = false;
      this.readyRegister = false;
      let leader = document.getElementById('introduction_body').scrollTop;
      const clientHeight = document.body.clientHeight;
      const topVal = clientHeight > 960 ? clientHeight : 960;
      const target = topVal * pageNum;
      const timer = setInterval(() => {
        leader += (target - leader) / 10;
        if (parseInt(Math.abs(target - leader)) === 0) {
          clearInterval(timer);
          leader = target;
          this.btnDisabled = false;
          // 获取当前页
          this.currentPage = pageNum + 1;
        }
        document.getElementById('introduction_body').scrollTop = leader;
      }, 15);
    },
    handleScroll() {
      const scrollTop = document.getElementById('introduction_body').scrollTop;
      const clientHeight = document.body.clientHeight;
      const topVal = clientHeight > 960 ? clientHeight : 960;
      if (scrollTop < topVal / 2) this.currentPage = 1;
      if (scrollTop >= topVal / 2 && scrollTop < topVal * 2) this.currentPage = 2;
      if (scrollTop >= topVal * 2 && scrollTop < topVal * 3) this.currentPage = 3;
      if (scrollTop >= topVal * 2.8 && scrollTop <= topVal * 3.5) this.currentPage = 4;
      if (scrollTop > topVal * 3.5) this.currentPage = 5;
    },
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll, true);
  },
};
</script>


<style lang="scss">
@import "../../../assets/scss/theme.scss";
$font: #999;

.introduction {
  .introduction_box {
    width: 100%;
    height: 60px;
    position: fixed;
    top: 0;
    z-index: 99;
    .introduction_head {
      height: 100%;
      width: 100%;
      background: #1C1A28;
      position: relative;
      .head_info {
        color: #fff;
        position: absolute;
        left: 150px;
        top: 50%;
        transform: translate(0, -50%);
        display: flex;
        width: 660px;
        justify-content: space-around;
        height: 100%;
        font-family: "微软雅黑";
        font-size: 15px;
        .company_logo {
          height: 38px;
          padding-top: 4px;
          width: 295px;
          margin: auto 0;
          margin-right: 30px;
        }
        .btn {
          margin: auto 0;
          height: 25px;
          padding-right: 14px;
          display: flex;
          img {
            width: 18px;
            height: 18px;
            position: relative;
            top: 6px;
            right: 2px;
          }
          div {
            line-height: 28px;
            cursor: pointer;
          }
        }
      }
      .btn_group {
        position: absolute;
        right: 200px;
        top: 50%;
        transform: translate(0, -50%);
        color: #fff;
        width: 130px;
        display: flex;
        justify-content: space-between;
        .btn_group_registe, .btn_group_login {
          border: 1px solid #fff;
          border-radius: 3px;
          padding: 7px 13px;
          cursor: pointer;
        }
      }
    }
  }
  .introduction_body {
    padding-top: 60px;
    height: 100vh;
    min-height: 960px;
    width: 100%;
    overflow: hidden;
    overflow-y: auto;
    .contentpage {
      height: calc(100% + 60px);
      background: #fff;
      position: relative;
    }
    .contentpage1 {
      position: relative;
      .el-button--primary {
        background: #1076EC;
        border-color: #1076EC;
      }
      .form_title {
        font-size: 20px;
        font-family:PingFangSC-Medium;
        font-weight: 600;
        color:rgba(72,72,72,1);
        line-height: 27px;
        margin-bottom: 15px;
        .bottom_line {
          height: 3px;
          background: #E6E3DA;
          margin-top: 10px;
          .line1 {
            background: #1076EC;
            border-radius: 65px;
            height: 100%;
            width: 78px;
          }
        }
      }
      .login-pad {
        position: absolute;
        top: 40%;
        transform: translateY(-50%);
        right: 13%;
        z-index: 10;
        width: 343px;
        height: 356px;
        padding: 40px 30px;
        display: flex;
        flex-direction: column;
        background: rgba(251,249,246,1);
        box-shadow: 0px 1px 2px 0px rgba(0,0,0,0.5);
        border-radius: 5px;
        .login-form {
          .demo-ruleForm {
            .savePassword, .register {
              display: flex;
              justify-content: space-between;
              .tips, .registerbtn {
                line-height: 19px;
                font-size: 14px;
                color:rgba(149,150,154,1);
              }
              .forgetPassword {
                cursor: pointer;
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
      .register-pad {
        position: absolute;
        top: 40%;
        transform: translateY(-50%);
        right: 13%;
        z-index: 9;
        width: 343px;
        height: 400px;
        padding: 40px 30px;
        display: flex;
        flex-direction: column;
        background: rgba(251,249,246,1);
        box-shadow: 0px 1px 2px 0px rgba(0,0,0,0.5);
        border-radius: 5px;
        .el-form {
          background: #faf8f6;
          .verifyCode {
            .el-form-item__content {
              .verifyInput {
                width: 110px;
                margin-right: 6px;
              }
              .verifyButtom {
                width: 80px;
                padding: 7px 10px;
              }
            }
          }
        }
        .el-form {
          .el-form-item {
            .el-form-item__error {
              padding-top: 3px;
            }
            .el-form-item__label {
              font-weight: 600;
              font-size: 14px;
            }
            .el-form-item__label:before {
              content: ""
            }
          }
          .button-list {
            margin-top: 30px;
            .submit {
              width: 100%;
              height: 40px;
            }
          }
        }
      }
      .reset-pad {
        height: 325px;
      }
      .head_img {
        min-width: 100%;
        height: calc(100vh);
        min-height: 960px;
        position: absolute;
        top: 0;
        z-index: 2;
      }
      .active_box {
        height: 200px;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        position: absolute;
        top: 300px;
        left: 300px;
        color: #fff;
        z-index: 3;
        .font_title {
          font-size: 40px;
          font-weight: 600;
          letter-spacing: 3.5px;
        }
        .font_dec {
          font-size: 28px;
          font-weight: 300;
        }
        .font_btn {
          width: 110px;
          text-align: center;
          font-size: 18px;
          font-weight: 400;
          padding: 9px 5px;
          border: 1px solid #fff;
          border-radius: 5px;
          cursor: pointer;
        }
      }
    }
    .contentpage2 {
      .head_img {
        width: 100%;
      }
      // background-image: url('../../assets/images/b2.png');
      // background-position: center 60px;
      // background-size: cover;
      // background-repeat: no-repeat;
      .foot {
        // position: fixed;
        // bottom: 0;
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
          margin-top: 80px;
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
    .contentpage3 {
      .head_img {
        width: 100%;
      }
      .foot {
        font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
        // position: fixed;
        // bottom: 0;
        height: 400px;
        padding-top: 60px;
        background: #fff;
        width: 100%;
        position: relative;
        .text_box {
          width: 70%;
          height: 400px;
          overflow: hidden;
          font-size: 14px;
          line-height: 23px;
          color: #606266;
          margin: auto;
          .title {
            text-align: center;
            font-size: 24px;
            font-weight:600;
            color: rgba(51,51,51,1);
            line-height: 33px;
            padding-bottom: 20px;
          }
          .paragraph {
            text-indent: 2em;
            padding: 5px 0;
          }
          .minititle {
            padding-bottom: 30px;
            padding-top: 15px;
            text-align: center;
            font-weight: 400;
            color: rgba(126,126,126,1);
          }
        }
        .dou_up, .dou_down {
          position: absolute;
          width: 45px;
          height: 36px;
        }
        .dou_up {
          left: 160px;
          top: 70px;
        }
        .dou_down {
          right: 150px;
          bottom: 50px;
        }
      }
    }
    .contentpage4 {
      position: relative;
      .head_img {
        min-width: 100%;
        height: calc(100vh);
        min-height: 960px;
        position: absolute;
        top: 0;
        z-index: 2;
      }
      .active_box {
        height: 200px;
        width: 100%;
        padding: 0 10%;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        position: absolute;
        top: 40%;
        transform: translate(-50%, -50%);
        color: #343434;
        z-index: 3;
        text-align: center;
        .font_title {
          font-size: 36px;
          font-weight: 600;
        }
        .font_dec {
          font-size: 22px;
          font-weight: 400;
          margin: 20px 0;
          .blue_font {
            color: #076BF2;
          }
        }
        .font_btn {
          width: 150px;
          background: #076BF2;
          font-size: 20px;
          font-weight: 400;
          color: #fff;
          margin: auto;
        }
      }
    }
    .contentpage5 {
      height: 100%;
      padding-top: 150px;
      position: relative;
      font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
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
      .msg_content {
        width: 50%;
        margin: 0 auto;
        height: calc(100% - 129px);
        .zte-form {
          padding-top: 30px;
          .content {
            .el-textarea__inner {
              height: 200px!important;
            }
          }
          .button-list {
            margin-top: 20px;
            .el-form-item__content {
              padding-left: 100px;
              text-align: left;
            }
          }
        }
      }
      .foot {
        position: fixed;
        bottom: 0;
        line-height: 45px;
        text-align: center;
        width: 100%;
        background: #3d434f;
        color: #949aaa;
        a {
          color: #949aaa;
          text-decoration: none;
        }
      }
    }
  }
}
.fileDetail {
  .el-dialog__body {
    height: 70vh;
    overflow-y: auto;
    .content {
      line-height: 25px;
      .title, .paragraph, .p ,.p_son, .p_son_son {
        text-indent: 2em;
      }
      .title {
        padding: 10px 0;
      }
    }
  }
}
.login_dialog, .register_dialog {
  .el-dialog {
    width: 343px;
    height: 366px;
    box-shadow: 0px 1px 2px 0px rgba(0,0,0,0.5);
    border-radius: 5px!important;
    background: rgba(251,249,246,1);
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    margin-top: 0px!important;
    .el-dialog__header {
      font-size: 20px;
      font-family:PingFangSC-Medium;
      font-weight: 600;
      color:rgba(72,72,72,1);
      line-height: 27px;
      text-align: left;
      padding: 20px;
      padding-bottom: 0;
      border-bottom: 0;
      border-radius: 4px 4px 0 0;
      background: #fbf9f6;
    }
    .el-dialog__body {
      padding: 30px 20px;
      .bottom_line {
        height: 3px;
        background: #E6E3DA;
        margin-top: 7px;
        margin-bottom: 30px;
        .line1 {
          background: #1076EC;
          border-radius: 65px;
          height: 100%;
          width: 78px;
        }
      }
      // 登录弹窗
      .login-form {
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
      .register-form {
        background: #fbf9f6;
        .el-form {
          .content {
            display: none!important;
          }
          .verifyCode {
            .el-form-item__content {
              .verifyInput {
                width: 133px;
                margin-right: 6px;
              }
              .verifyButtom {
                width: 80px;
                padding: 7px 10px;
              }
            }
          }
        }
        .el-form {
          .el-form-item {
            .el-form-item__error {
              padding-top: 3px;
            }
            .el-form-item__label {
              font-weight: 600;
              font-size: 14px;
            }
            .el-form-item__label:before {
              content: ""
            }
          }
          .button-list {
            margin-top: 30px;
            .submit {
              width: 100%;
              height: 40px;
            }
          }
        }
      }
    }
  }
  .el-button--primary {
    background: #1076EC;
    border-color: #1076EC;
  }
}
.login_dialog {
  .el-dialog {
    height: 356px;
    .el-dialog__body {
      padding-top: 0;
    }
  }
}
.register_dialog {
  .el-dialog {
    .el-dialog__body {
      padding-top: 0;
    }
  }
}
/*滚动条样式*/
.introduction_body::-webkit-scrollbar {
  width: 4px;
  background: #FAFAFA;
}
.introduction_body::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
    border-radius: 5px;
    -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
    background: #E1E1E1;
}
.introduction_body::-webkit-scrollbar-track {/*滚动条里面轨道*/
    border-radius: 4px;
    background: #fff;
}
</style>
