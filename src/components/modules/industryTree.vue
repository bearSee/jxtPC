<template>
  <div class="industryTree">
    <el-tree
      :default-expand-all="defaultExpandAll"
      :expand-on-click-node='false'
      :data="treeData"
      :props="treeProps"
      @node-click="handleNodeClick">

    <el-tooltip slot-scope="{ node, data}" effect="dark" :content="data[treeProps.showTitleCode] || '暂无说明'" placement="right-end">
      <span>{{ data[treeProps.label] }}</span>
    </el-tooltip>
      </el-tree>
  </div>
</template>

<script type='text/javascript'>

export default {
  name: 'industryTree',
  props: {
    defaultExpandAll: {
      type: Boolean,
      default: false,
    },
    treeUrl: {
      type: String,
      default: 'industry/list',
    },
    params: {
      type: Object,
      default: () => ({}),
    },
    treeProps: {
      type: Object,
      default: () => ({
        children: 'children',
        label: 'industryName',
        value: 'id',
        showTitleCode: 'description',
      }),
    },
    needAllData: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      treeData: [],
    };
  },
  created() {
    this.getTreeData();
  },
  methods: {
    handleNodeClick(node) {
      if (this.needAllData) {
        this.$emit('chooseNodeClick', node);
        return;
      }
      const { industryLabelAll, industryName, id } = node;
      const obj = { industryLabelAll, industryName, id, industryLabel: '' };
      this.$emit('chooseNodeClick', obj);
    },
    getTreeData() {
      const params = this.params;
      this.$http.post(this.treeUrl, params).then(
        (res) => {
          this.treeData = res.data.list[0].children;
        },
        () => {},
      );
    },
  },
};
</script>

<style lang='scss'>
.industryTree {
  width: 100%;
}
</style>
