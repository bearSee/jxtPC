<template>
  <transition
    name="main-classes-transition"
    enter-active-class="animated fadeIn"
    leave-active-class="animated zoomOutDown"
  >
    <router-view></router-view>
  </transition>
</template>

<script>

export default {
  name: 'app',
};
</script>

<style lang='scss'>
@import "./assets/scss/theme";

html,body{
  height: 100%;
  background-color: #fff;
  padding: 0 !important;
  margin: 0;
  overflow: hidden!important;
}
textarea {
  font-family: inherit;
}
section, header, aside, main {
  height: 100%;
}
.el-select-dropdown__list {
  padding-bottom: 18px!important;
}
.zte-table .el-table th{
  background: $tabel_head;
}
.zte-table .table-body {
  margin-top: 0;
}
</style>
