
const isPerson = window.localStorage.getItem('userData') && JSON.parse(window.localStorage.getItem('userData')).userType === 'Z001002';
const login = () => import(/* webpackChunkName: "login" */ '../components/pages/beforeLogin/introduction');
const page404 = () => import(/* webpackChunkName: "page404" */ '../components/base/404');
const portal = () => import(/* webpackChunkName: "portal" */ '../components/pages/master');
const index = () => import(/* webpackChunkName: "index" */ '../components/pages/index');

// 行业设置
const industrySet = () => import(/* webpackChunkName: "industrySet" */ '../components/pages/industrySet');

// 行业用户
const IndustryUser = () => import(/* webpackChunkName: "IndustryUser" */ '../components/pages/IndustryUser');

// 企业用户
const enterpriseUser = () => import(/* webpackChunkName: "enterpriseUser" */ '../components/pages/enterpriseUser');

// 个体用户
const individualUser = () => import(/* webpackChunkName: "individualUser" */ '../components/pages/individualUser');

// 字典设置
const dictionarySet = () => import(/* webpackChunkName: "dictionarySet" */ '../components/pages/dictionarySet');

// 举报审核
const reportAudit = () => import(/* webpackChunkName: "reportAudit" */ '../components/pages/reportAudit');

// 我的及信
const myJiXin = () => import(/* webpackChunkName: "myJiXin" */ '../components/pages/myJiXin');

// 行业消息
const industryNews = () => import(/* webpackChunkName: "industryNews" */ '../components/pages/industryNews');

// 招聘消息
const recruitmentNews = () => import(/* webpackChunkName: "recruitmentNews" */ '../components/pages/recruitmentNews');

// 我的接收
const myRreceive = () => import(/* webpackChunkName: "myRreceive" */ '../components/pages/myRreceive');

// 接收设置
const receivingSet = () => import(/* webpackChunkName: "receivingSet" */ '../components/pages/receivingSet');

// 我的收藏
const myCollection = () => import(/* webpackChunkName: "myCollection" */ '../components/pages/myCollection');

// 平台企业用户
const platformUser = () => import(/* webpackChunkName: "platformUser" */ '../components/pages/platformUser');

// 黑名单
const blacklist = () => import(/* webpackChunkName: "blacklist" */ '../components/pages/blacklist');

// 修改密码
const changePassword = () => import(/* webpackChunkName: "changePassword" */ '../components/pages/changePassword');

// 留言板
const msgList = () => import(/* webpackChunkName: "msgList" */ '../components/pages/msgList');

// 公告
const notice = () => import(/* webpackChunkName: "notice" */ '../components/pages/notice');

// 平台介绍
const platformIntroduce = () => import(/* webpackChunkName: "platformIntroduce" */ '../components/pages/beforeLogin/platformIntroduce');

// 联系我们
const callMe = () => import(/* webpackChunkName: "callMe" */ '../components/pages/beforeLogin/callMe');

// 留言板
const leaveMsg = () => import(/* webpackChunkName: "leaveMsg" */ '../components/pages/beforeLogin/leaveMsg');


const pages = [
  { path: '*', redirect: '/error' },
  { path: '/', redirect: '/login' },
  { path: '/login', component: login, meta: { requirAuth: false } },
  { path: '/error', component: page404, meta: { requirAuth: false } },
];

export default {
  routes: [
    ...pages,
    {
      path: '/platformIntroduce',
      name: '平台介绍',
      component: platformIntroduce,
      meta: {
        keepAlive: false,
        requirAuth: true,
      },
    },
    {
      path: '/callMe',
      name: '联系我们',
      component: callMe,
      meta: {
        keepAlive: false,
        requirAuth: true,
      },
    },
    {
      path: '/leaveMsg',
      name: '留言板',
      component: leaveMsg,
      meta: {
        keepAlive: false,
        requirAuth: true,
      },
    },
    { path: '/index',
      component: portal,
      children: [
        {
          path: '/',
          name: '首页',
          component: index,
          meta: {
            keepAlive: false,
            requirAuth: true,
          },
        },
        {
          path: '/industrySet',
          name: '行业设置',
          component: industrySet,
          meta: {
            keepAlive: false,
            requirAuth: true,
          },
        },
        {
          path: '/IndustryUser',
          name: '行业用户',
          component: IndustryUser,
          meta: {
            keepAlive: false,
            requirAuth: true,
          },
        },
        {
          path: '/enterpriseUser',
          name: '企业用户',
          component: enterpriseUser,
          meta: {
            keepAlive: false,
            requirAuth: true,
          },
        },
        {
          path: '/individualUser',
          name: '个体用户',
          component: individualUser,
          meta: {
            keepAlive: false,
            requirAuth: true,
          },
        },
        {
          path: '/dictionarySet',
          name: '字典设置',
          component: dictionarySet,
          meta: {
            keepAlive: false,
            requirAuth: true,
          },
        },
        {
          path: '/reportAudit',
          name: '举报审核',
          component: reportAudit,
          meta: {
            keepAlive: false,
            requirAuth: true,
          },
        },
        {
          path: '/myJiXin',
          name: '我的及信',
          component: myJiXin,
          meta: {
            keepAlive: false,
            requirAuth: true,
          },
        },
        {
          path: '/industryNews',
          name: '行业消息',
          component: industryNews,
          meta: {
            keepAlive: false,
            requirAuth: true,
          },
        },
        {
          path: '/recruitmentNews',
          name: `${isPerson ? '应聘' : '招聘'}消息`,
          component: recruitmentNews,
          meta: {
            keepAlive: false,
            requirAuth: true,
          },
        },
        {
          path: '/myRreceive',
          name: '我的接收',
          component: myRreceive,
          meta: {
            keepAlive: false,
            requirAuth: true,
          },
        },
        {
          path: '/receivingSet',
          name: '接收设置',
          component: receivingSet,
          meta: {
            keepAlive: false,
            requirAuth: true,
          },
        },
        {
          path: '/myCollection',
          name: '我的收藏',
          component: myCollection,
          meta: {
            keepAlive: false,
            requirAuth: true,
          },
        },
        {
          path: '/platformUser',
          name: '平台企业用户',
          component: platformUser,
          meta: {
            keepAlive: false,
            requirAuth: true,
          },
        },
        {
          path: '/blacklist',
          name: '黑名单',
          component: blacklist,
          meta: {
            keepAlive: false,
            requirAuth: true,
          },
        },
        {
          path: '/changePassword',
          name: '修改密码',
          component: changePassword,
          meta: {
            keepAlive: false,
            requirAuth: true,
          },
        },
        {
          path: '/msgList',
          name: '留言板',
          component: msgList,
          meta: {
            keepAlive: false,
            requirAuth: true,
          },
        },
        {
          path: '/notice',
          name: '公告',
          component: notice,
          meta: {
            keepAlive: false,
            requirAuth: true,
          },
        },
      ],
    },
  ],
  scrollBehavior() {
    return { x: 0, y: 0 };
  },
};
