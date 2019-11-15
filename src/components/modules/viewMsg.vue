<template>
  <div class="viewMsg">
    <div class="viewMsg_head">
      <div class="viewMsg_title">{{ currentMsgData.title }}</div>
      <div class="viewMsg_des">
        <div class="time">{{ currentMsgData.createdDt }}</div>
        <div class="company">发布者:{{ currentMsgData.publisher }}</div>
        <div class="industry">行业：{{ industry }}</div>
      </div>
      <div class="mag_handle" v-if="isAdmin">
        <el-tooltip effect="dark" :content="currentMsgData.isCollection === 'Y' ? '取消收藏' : '收藏'" placement="top-start" v-if="needHandle.collect">
          <el-button size="mini" icon="el-icon-star-off" type="warning" circle @click.native="collect"></el-button>
        </el-tooltip>
        <el-tooltip effect="dark" :content="currentMsgData.isBlacklist === 'Y' ? '取消黑名单' : '添加黑名单'" placement="top-start" v-if="needHandle.complaint">
          <el-button size="mini" type="info" circle @click.native="beBlack"><i class="el-icon-star-off"></i></el-button>
        </el-tooltip>
        <el-tooltip effect="dark" :content="currentMsgData.isComplaint === 'Y' ? '已举报' : '举报'" placement="top-start" v-if="needHandle.blacklist">
          <el-button size="mini" type="danger" circle :disabled="currentMsgData.isComplaint === 'Y'" @click.native="inform"><i class="el-icon-star-off"></i></el-button>
        </el-tooltip>
      </div>
    </div>
    <div class="viewMsg_UE" v-html="defaultMsg"></div>
  </div>
</template>

<script>

export default {
  name: 'viewMsg',
  props: {
    msgData: {
      type: Object,
      default: () => ({}),
    },
    receiveIndustryList: {
      type: Array,
      default: () => ([]),
    },
    defaultMsg: {
      type: String,
      default: '',
    },
    needHandle: {
      type: Object,
      default: () => ({
        collect: false,
        complaint: false,
        blacklist: false,
      }),
    },
    newsId: {
      type: String,
      default: '',
    },
    blackUserId: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      currentMsgData: {},
      industry: '',
      isAdmin: true,
    };
  },
  created() {
    this.currentMsgData = this.msgData;
    this.industry = this.receiveIndustryList.map(item => (item.industryName)).join('、');
    this.isAdmin = JSON.parse(window.localStorage.getItem('userData')).userType !== 'ADMIN';
  },
  methods: {
    // 收藏
    collect() {
      const newsId = this.newsId;
      if (this.currentMsgData.isCollection === 'N') {
        this.$http.post('collection/save', { newsId }).then(
          () => {
            this.$message.success('收藏成功');
            this.currentMsgData = Object.assign(this.currentMsgData, { isCollection: 'Y' });
          },
          () => {},
        );
        return;
      }
      this.$http.post('collection/delete', { newsId }).then(
        () => {
          this.$message.success('已取消收藏');
          this.currentMsgData = Object.assign(this.currentMsgData, { isCollection: 'N' });
        },
        () => {},
      );
    },
    // 添加黑名单
    beBlack() {
      const blackUserId = this.blackUserId;
      if (this.currentMsgData.isBlacklist === 'N') {
        this.$http.post('blacklist/save', { blackUserId }).then(
          () => {
            this.$message.success('添加黑名单成功');
            this.currentMsgData = Object.assign(this.currentMsgData, { isBlacklist: 'Y' });
          },
          () => {},
        );
        return;
      }
      this.$http.post('blacklist/delete', { blackUserId }).then(
        () => {
          this.$message.success('黑名单已取消');
          this.currentMsgData = Object.assign(this.currentMsgData, { isBlacklist: 'N' });
        },
        () => {},
      );
    },
    // 举报
    inform() {
      const newsId = this.newsId;
      this.$http.post('complaint/submit', { newsId }).then(
        () => {
          this.$message.success('举报成功');
          this.currentMsgData = Object.assign(this.currentMsgData, { isComplaint: 'Y' });
        },
        () => {},
      );
    },
  },
};
</script>

<style lang="scss">
.viewMsg {
  .viewMsg_head {
    .viewMsg_title {
      font-size: 22px;
      font-weight: 600;
      letter-spacing: 2px;
      padding-bottom: 10px;
    }
    .viewMsg_des {
      display: flex;
      flex-wrap: wrap;
      line-height: 28px;
      .time {
        padding-right: 20px;
        width: 150px;
      }
      .company {
        padding-right: 20px;
      }
      .industry {
        padding-right: 20px;
      }
    }
    .mag_handle {
      text-align: right;
      button {
        width: 28px;
        height: 28px;
      }
    }
  }
  .viewMsg_UE {
    padding-bottom: 30px;
    padding-top: 10px;
  }
}
</style>
