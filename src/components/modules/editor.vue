<template>
  <div>
    <script id="editor" type="text/plain"></script>
  </div>
</template>
<script>
export default {
  name: 'UE',
  data() {
    return {
      editor: null,
    };
  },
  props: {
    defaultMsg: {
      type: String,
    },
    config: {
      type: Object,
    },
  },
  mounted() {
    const that = this;
    // eslint-disable-next-line
    this.editor = UE.getEditor('editor', this.config); // 初始化UE
    this.editor.addListener('ready', () => {
      that.editor.setContent(that.defaultMsg); // 确保UE加载完成后，放入内容。
    });
  },
  methods: {
    getUEContent() { // 获取内容方法
      return this.editor.getContent();
    },
    getUEContentTxt() { // 获取纯文本内容方法
      return this.editor.getContentTxt();
    },
  },
  destroyed() {
    this.editor.destroy();
  },
};
</script>
