<template>
  <div class="master not-print">
      <el-container class="body">
        <el-aside class="body_left">
          <div class="portal_logo">
            <img class="company_logo" src="../../assets/images/logo.png" alt="">
          </div>
          <transition
            mode="out-in"
            name="menu-status-classes-transition"
            duration="300"
            enter-active-class="animated fadeIn"
            leave-active-class="animated fadeOut">
          </transition>
          <el-scrollbar class="menu-sroll">
            <el-menu
              class="menu-vertical"
              ref="menu"
              router
              unique-opened
              :collapse="isCollapse"
              :default-openeds="openedMenu"
              :default-active="activeMenu">
              <template v-for="(sub, index) in menu">
                <el-submenu :index="index.toString()" v-if="sub.children" :key="sub.name">
                  <template slot="title">
                    <img class="sub_icon" :src="require(`../../assets/images/${sub.icon}.png`)" alt="">
                    <span v-text="sub.name" slot="title"></span>
                  </template>
                  <el-menu-item
                    :title="item.name"
                    v-for="item in sub.children"
                    :key="item.name"
                    :index="item.path">
                    <span v-text="item.name" slot="title"></span>
                  </el-menu-item>
                </el-submenu>
                <el-menu-item
                  :title="sub.name"
                  :index="sub.path"
                  :key="sub.name"
                  v-else>
                  <img class="sub_icon" :src="require(`../../assets/images/${sub.icon}.png`)" alt="">
                  <span v-text="sub.name" slot="title"></span>
                </el-menu-item>
              </template>
            </el-menu>
          </el-scrollbar>
        </el-aside>
        <el-container class="body_right">
          <el-header class="top_header">
            <div class="msgTips" @click="noticeVisible = true">
              <img src="../../assets/images/msg-icon.png" alt="">
              <div>{{ noticeForm.title }}</div>
            </div>
            <div class="login-info">
              <div class="companyInfo">
                <!-- <img src="../../assets/images/companyLogo.png" alt=""> -->
                <div>{{ companyName }}</div>
              </div>
              <div class="btn_group">
                <img src="../../assets/images/changePassword.png" alt="">
                <div @click="changePassword">修改密码</div>
              </div>
              <!-- <div class="btn_group">
                <img src="../../assets/images/aboutUs.png" alt="">
                <div @click="aboutUs">平台介绍</div>
              </div>
              <div class="btn_group">
                <img src="../../assets/images/callMe.png" alt="">
                <div @click="callMe">联系我们</div>
              </div>
              <div class="btn_group">
                <img src="../../assets/images/leaveMsg.png" alt="">
                <div @click="leaveMsg">留言板</div>
              </div> -->
              <div class="btn_group logout">
                <img src="../../assets/images/logout.png"  @click="logout">
              </div>
            </div>
          </el-header>
          <el-container>
            <el-header height="32px" class="sub-header">
              <nav-tabs
                ref="navTabs"
                @active-change="handlerTabChange"
                @remove-route="handleNavRemove"
                @refresh="hanlderRefresh"
                @clearAll="clearAll">
              </nav-tabs>
            </el-header>
            <el-main class="container_page">
              <transition
                name="custom-classes-transition"
                enter-active-class="animated fadeInLeft"
                leave-active-class="animated fadeOutLeft">
                <!-- <el-scrollbar class="main-scollbar"> -->
                  <div class="container">
                    <transition
                      name="portal-classes-transition"
                      enter-active-class="animated fadeIn">
                      <!-- 内容部分 -->
                      <keep-alive :include="route">
                        <router-view v-if="$route.meta.keepAlive && renderFlag" ref="route" class="router_page">
                          <!--  这里是会被缓存的视图组件 -->
                        </router-view>
                      </keep-alive>
                    </transition>
                    <transition
                      name="portal-classes-transition"
                      enter-active-class="animated fadeInDown">
                      <router-view v-if="!$route.meta.keepAlive && renderFlag" ref="route" class="router_page">
                      </router-view>
                    </transition>
                  </div>
                <!-- </el-scrollbar> -->
              </transition>
            </el-main>
          </el-container>
        </el-container>
      </el-container>
      <!-- <el-footer class="masterFoot">
        <p>Copyright © 2015-2020 中兴新云版权所有. IE(Version 11)/Chrome/Firefox</p>
      </el-footer> -->
    <el-dialog
      width="40%"
      v-if="passwordVisible"
      :visible.sync="passwordVisible"
      title="修改密码">
      <changePassword @close="passwordVisible = false"></changePassword>
    </el-dialog>
    <el-dialog
      width="40%"
      class="noticeForm"
      v-if="noticeVisible"
      :visible.sync="noticeVisible"
      title="公告详情">
      <div class="title">{{ noticeForm.title }}</div>
      <div class="content">{{ noticeForm.content }}</div>
    </el-dialog>
  </div>
</template>

<script type="text/javascript">
import navTabs from '../modules/nav-tabs';
import changePassword from './changePassword';

export default {
  name: 'master',
  components: { navTabs, changePassword },
  data() {
    const isPerson = JSON.parse(window.localStorage.getItem('userData')).userType === 'Z001002';
    return {
      isPerson,
      noticeVisible: false,
      companyName: '',
      cdn: `${window.location.protocol}//${window.location.host}/image`,
      isCollapse: false,
      messageNum: 0,
      messageStatus: false,
      popNotice: null,
      route: [],
      renderFlag: true,
      passwordVisible: false,
      menu: [],
      defalutMenu: {
        Z001001: [
          {
            icon: 'myJiXin',
            name: '我的及信',
            path: '/myJiXin',
          },
          {
            icon: 'releaseManage',
            name: '发布管理',
            children: [
              {
                name: '行业消息',
                path: '/industryNews',
              },
              {
                name: '招聘消息',
                path: '/recruitmentNews',
              },
            ],
          },
          {
            icon: 'receiveManage',
            name: '接收管理',
            children: [
              {
                name: '我的接收',
                path: '/myRreceive',
              },
              {
                name: '接收设置',
                path: '/receivingSet',
              },
            ],
          },
          {
            icon: 'myCollection',
            name: '我的收藏',
            path: '/myCollection',
          },
          // {
          // icon: 'platformUser',
          // name: '平台用户',
          // path: '/platformUser',
          // },
          {
            icon: 'blacklist',
            name: '黑名单',
            path: '/blacklist',
          },
          {
            icon: 'notice',
            name: '公告',
            path: '/notice',
          },
        ],
        Z001002: [
          {
            icon: 'myJiXin',
            name: '我的及信',
            path: '/myJiXin',
          },
          {
            icon: 'releaseManage',
            name: '发布管理',
            children: [
              {
                name: '行业消息',
                path: '/industryNews',
              },
              {
                name: '应聘消息',
                path: '/recruitmentNews',
              },
            ],
          },
          {
            icon: 'receiveManage',
            name: '接收管理',
            children: [
              {
                name: '我的接收',
                path: '/myRreceive',
              },
              {
                name: '接收设置',
                path: '/receivingSet',
              },
            ],
          },
          {
            icon: 'myCollection',
            name: '我的收藏',
            path: '/myCollection',
          },
          {
            icon: 'blacklist',
            name: '黑名单',
            path: '/blacklist',
          },
          {
            icon: 'notice',
            name: '公告',
            path: '/notice',
          },
        ],
        ADMIN: [
          {
            icon: 'industrySet',
            name: '行业设置',
            path: '/industrySet',
          },
          {
            icon: 'userManage',
            name: '用户管理',
            children: [
              {
                name: '企业用户',
                path: '/enterpriseUser',
              },
              {
                name: '个体用户',
                path: '/individualUser',
              },
              {
                name: '行业用户',
                path: '/IndustryUser',
              },
            ],
          },
          {
            icon: 'dictionarySet',
            name: '字典设置',
            path: '/dictionarySet',
          },
          {
            icon: 'reportAudit',
            name: '举报审核',
            path: '/reportAudit',
          },
          {
            icon: 'leaveMsg',
            name: '留言板',
            path: '/msgList',
          },
          {
            icon: 'notice',
            name: '公告',
            path: '/notice',
          },
        ],
      },
      allMenu: [
        {
          icon: 'industrySet',
          name: '行业设置',
          path: '/industrySet',
        },
        {
          icon: 'userManage',
          name: '用户管理',
          children: [
            {
              name: '企业用户',
              path: '/enterpriseUser',
            },
            {
              name: '个体用户',
              path: '/individualUser',
            },
            {
              name: '行业用户',
              path: '/IndustryUser',
            },
          ],
        },
        {
          icon: 'dictionarySet',
          name: '字典设置',
          path: '/dictionarySet',
        },
        {
          icon: 'reportAudit',
          name: '举报审核',
          path: '/reportAudit',
        },
        {
          icon: 'myJiXin',
          name: '我的及信',
          path: '/myJiXin',
        },
        {
          icon: 'releaseManage',
          name: '发布管理',
          children: [
            {
              name: '行业消息',
              path: '/industryNews',
            },
            {
              name: `${isPerson ? '应聘' : '招聘'}消息`,
              path: '/recruitmentNews',
            },
          ],
        },
        {
          icon: 'receiveManage',
          name: '接收管理',
          children: [
            {
              name: '我的接收',
              path: '/myRreceive',
            },
            {
              name: '接收设置',
              path: '/receivingSet',
            },
          ],
        },
        {
          icon: 'myCollection',
          name: '我的收藏',
          path: '/myCollection',
        },
        // {
        // icon: 'platformUser',
        // name: '平台用户',
        // path: '/platformUser',
        // },
        {
          icon: 'blacklist',
          name: '黑名单',
          path: '/blacklist',
        },
        {
          icon: 'leaveMsg',
          name: '留言板',
          path: '/msgList',
        },
        {
          icon: 'notice',
          name: '公告',
          path: '/notice',
        },
      ],
      noticeForm: {},
    };
  },
  computed: {
    defaultOpen() {
      return this.$route;
    },
    openedMenu() {
      let openedMenu;
      for (const menu of this.activeMenu) {
        if (menu.children && menu.children.length) {
          for (const sub of menu.children) {
            if (sub.url === this.activeMenu) {
              openedMenu = [menu.name];
              break;
            }
          }
        }
      }
      return openedMenu;
    },
    activeMenu() {
      return this.$route.fullPath;
    },
  },
  watch: {
    /* eslint-disable */
    $route(to) {
      // 将当前打开路由加入到keepAlive的include中
      this.setAliveRoute(to);
      let obj = { ...to };
      if (obj.path === '/recruitmentNews') {
        obj = { ...to, name: `${this.isPerson ? '应聘' : '招聘'}消息` }
      }
      this.$refs.navTabs.add(obj);
    }
    /* eslint-enable */
  },
  methods: {
    // 修改密码
    changePassword() {
      this.passwordVisible = true;
      // this.$router.push('/changePassword');
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
    handlerTabChange(tab) {
      const path = (tab && tab.path) || '/index';
      this.$router.push(path);
    },
    handleNavRemove(tab) {
      if (tab.matched && tab.matched.length) {
        const routeIndex = this.route.findIndex(name => (tab.matched[tab.matched.length - 1].components.default.name === name));
        this.route.splice(routeIndex, 1);
      }
    },
    clearAll() {
      this.route = [];
    },
    hanlderRefresh() {
      // 通过renderFlag 强制re-render router-view中的组件
      this.renderFlag = false;
      this.handleNavRemove(this.$route);
      this.$nextTick(() => {
        this.renderFlag = true;
        this.setAliveRoute(this.$route);
      });
    },
    async logout() {
      await this.$http.post('/init/logout').then(
        () => {
          this.$message({
            message: '注销成功！',
            type: 'success',
          });
          this.$router.push('/');
          const ruleForm = window.localStorage.getItem('ruleForm');
          window.localStorage.clear();
          if (ruleForm) window.localStorage.setItem('ruleForm', ruleForm);
        },
        () => {},
      );
    },
    qryUserAuthorMenu() {
      // this.menu = this.allMenu;
      const userInfo = JSON.parse(window.localStorage.getItem('userData')) || {};
      this.menu = this.defalutMenu[userInfo.userType];

      // this.$http.post('/personal/listAuthFuncs').then(
      //   (res) => {
      //     const listArr = res.data.list;
      //     if (!listArr.length) {
      //       // this.menu = this.defalutMenu;
      //       return;
      //     }
      //     // 若后台返回数据为一层(所有一级二级菜单都放在同一个数组内)
      //     this.menu = this.getMenu(listArr, this.defalutMenu);

      //     // 若后台返回数据为两层(一级菜单内含有二级菜单)
      //     // listArr.forEach((item) => {
      //     //   const son = this.defalutMenu.find(object => object.id === item.id);
      //     //   if (son) {
      //     //     const arr = [];
      //     //     item.children.forEach((d) => {
      //     //       const grandson = son.children.find(object => object.id === d.id);
      //     //       if (grandson) {
      //     //         arr.push(grandson);
      //     //       }
      //     //     });
      //     //     son.children = arr;
      //     //     this.menu = [...this.menu, son];
      //     //   }
      //     // });
      //   },
      //   () => {},
      // );
    },
    getMenu(menu, defalutMenu, arr = []) {
      defalutMenu.forEach((item) => {
        const son = menu.find(object => object.id === item.id);
        if (son) {
          if (item.children) {
            item.children = this.getMenu(menu, item.children);
          }
          arr.push(item);
        }
      });
      return arr;
    },
    // 我的消息接口
    queryNoReadNoticeMessageCount() {
      this.$http.post('queryNoReadNoticeMessageCount.ajax').then(
        (res) => {
          const response = res.body;
          this.messageNum = response.rspData.recordsTotal;
          this.messageStatus = !!response.rspData.recordsTotal;
        },
        () => {},
      );
    },
    gotoMessage() {
      this.messageStatus = false;
      this.$router.push('/myMessage');
    },
    setAliveRoute(to) {
      if (
        to.matched &&
        to.matched.length &&
        to.matched[to.matched.length - 1].components.default.name
      ) {
        const routeName =
          to.matched[to.matched.length - 1].components.default.name;
        if (this.route.indexOf(routeName) === -1) {
          this.route.push(routeName);
        }
      }
    },
    // 获取第一条公告
    getFirstNotice() {
      this.$http.post('/publish/findLast', { }).then(
        ({ data }) => {
          if (!data.ok) return;
          this.noticeForm = data.data;
        },
        () => {},
      );
    },
  },
  created() {
    this.qryUserAuthorMenu();
    this.getFirstNotice();
    const userInfo = window.localStorage.getItem('userData') || {};
    this.companyName = JSON.parse(userInfo).mobileNumber;
  },
};
</script>

<style lang="scss" src='../../assets/scss/style.scss'></style>
<style lang="scss" src='../../assets/scss/theme.scss'></style>
<style lang="scss">
@import "../../assets/scss/theme.scss";
@media print {
  .not-print {
    display: none;
  }
}
.master {
  .body {
    height: 100vh;
    width: 100vw;
    .body_left {
      height: 100vh;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      width: 256px!important;
      .portal_logo {
        height: 63px;
        width: 100%;
        background: $dark;
        padding: 20px 22px;
        box-shadow:1px 1px 3px 0px rgba(0,0,0,0.21);
        img {
          width: 208px;
          height: 23px;
        }
      }
      .menu-sroll {
        background: $theme;
        height: calc(100% - 63px);
        .el-submenu__title i {
          color: #fff;
        }
        .sub_icon {
          width: 18px;
          height: 18px;
          margin-right: 5px;
        }
        .el-scrollbar__view {
          width: 257px;
        }
        .menu-vertical {
          .el-menu-item, .el-submenu__title {
            background: $theme;
            color: #fff;
            padding-left: 40px!important;
          }
          .el-menu--inline {
            .el-menu-item {
              padding-left: 66px!important;
              background: #333b51e3;
            }
          }
        }
        .is-active {
          background: #2A7CCC!important;
        }
        .el-submenu__title:hover {
          background: #2A7CCC!important;
        }
        .el-menu-item:hover {
          background: #2A7CCC!important;
        }
      }
    }
    .body_right {
      width: calc(100% - 256px);
      .top_header {
        height: 65px!important;
        width: 100%;
        box-shadow:0px 2px 6px 0px rgba(0,0,0,0.08);
        position: relative;
        color: #515666fc;
        .msgTips {
          display: flex;
          img {
            position: relative;
            top: 23px;
            width: 25px;
            height: 25px;
          }
          div {
            line-height: 72px;
            padding: 0 10px;
            color: #2690d4;
            max-width: 700px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            cursor: pointer;
          }
        }
        .login-info {
          background: #fff;
          position: absolute;
          right: 0;
          display: flex;
          min-width: 365px;
          justify-content: space-around;
          height: 100%;
          font-family: "微软雅黑";
          font-size: 15px;
          .companyInfo {
            margin: auto 0;
            height: 25px;
            padding-right: 18px;
            border-right: 1px solid #EBEBEB;
            display: flex;
            img {
              width: 34px;
              height: 34px;
              margin-right: 10px;
              position: relative;
              bottom: 4px;
            }
            div {
              // border: 1px solid #DBDBDB;
              height: 30px;
              line-height: 20px;
              font-size: 16px;
              padding: 5px 10px;
              border-radius: 4px;
              position: relative;
              bottom: 3.5px;
              color: #222;
              // min-width: 120px;
              // text-align: center;
            }
          }
          .btn_group {
            margin: auto 0;
            height: 25px;
            padding-right: 18px;
            border-right: 1px solid #EBEBEB;
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
          .logout {
            width: 30px;
            height: 30px;
            padding: 0;
            border: 0;
            img {
              width: 20px;
              height: 20px;
              margin: 0;
              top: 4px;
              cursor: pointer;
            }
          }
        }
      }
      .is-vertical {
        background: #cccccc;
      }
      .sub-header {
        margin-top: 10px;
        .list-complete-item {
          button {
            border-radius: 3px;
          }
          button:hover {
            background: $hover;
            color: #fff;
          }
          .el-button--primary {
            background: $theme;
          }
          .el-button--default  {
            background: #fff;
            border: 0.5px solid #e2e2e2;
          }
          .el-badge {
            right: -2px;
            .el-icon-error {
              background: $theme;
              color: #e2e2e2;
            }
          }
        }
        // .is-active {
        //   .el-badge {
        //     .el-icon-error {
        //       background: $theme;
        //       color: #e2e2e2;
        //     }
        //   }
        // }
      }
      .container_page {
        width: 100%;
        // height: calc(100vh - 107px);
        padding-top: 10px;
        .container {
          height: 100%;
          background: #fff;
          .router_page {
            height: 100%;
          }
        }
      }
    }
  }
  .masterFoot {
    z-index: 2150;
    background-color: $theme;
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 20px !important;
    color: #fff;
    font-size: 14px;
    p {
      width: 100%;
      text-align: center;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
  .shot_height {
    .el-dialog {
      padding-bottom: 8px;
    }
    .el-dialog__body {
      overflow-y: auto;
      height: 80vh;
    }
  }
  .noticeForm {
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

.quick-operate {
  width: 80px!important;
  .el-icon-menu {
    display: none;
  }
}
/*滚动条样式*/
div::-webkit-scrollbar {
  width: 4px;
  background: #FAFAFA;
}
div::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
    border-radius: 5px;
    -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
    background: #E1E1E1;
}
div::-webkit-scrollbar-track {/*滚动条里面轨道*/
    border-radius: 4px;
    background: #fff;
}
@media print {
  .not-print {
    display: none;
  }
}
</style>
