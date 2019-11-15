<template>
  <div>
    <zte-table-local
      ref="industry"
      index-style="index"
      :tableColumn="tableColumn"
      :tableData="tableData">
      <template slot="operate" slot-scope="{ row, $index }" v-if="!disabled">
        <el-button type="text" @click.native="delet($index)">删除</el-button>
      </template>
      <template slot="industryLabel" slot-scope="{ row, $index }">
        <zte-item
          :disabled="disabled"
          :props="industryLabelInfo(row)"
          v-model="row.industryLabel"
          :show="row.industryLabel"
          @check-change="handlerCheckChange($event, $index)">
        </zte-item>
      </template>
    </zte-table-local>
  </div>
</template>
<script>
export default {
  name: 'chooseIndustry',
  data() {
    return {
      industryLabel: {
        label: '行业标签',
        code: 'industryLabel',
        type: 'check',
        options: [],
        optionProps: {
          label: 'value',
          value: 'key',
        },
      },
    };
  },
  props: {
    tableColumn: {
      type: Array,
      default: () => ([]),
    },
    tableData: {
      type: Array,
      default: () => ([]),
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  created() {
    this.$http.post('common/combo/list', { type: 'Z002000' }).then(
      (res) => {
        this.industryLabel = Object.assign(this.industryLabel, { options: res.data.list });
      },
      () => {},
    );
  },
  watch: {
  },
  mounted() {},
  methods: {
    industryLabelInfo(row) {
      const obj = JSON.parse(JSON.stringify(this.industryLabel));
      obj.options = row.industryLabelAll;
      return obj;
    },
    handlerCheckChange(val, i) {
      const industryLabel = val.join(',');
      this.tableData[i].industryLabel = industryLabel;
      this.$emit('getIndustryData', this.tableData);
    },
    delet(i) {
      this.$emit('delet', i);
    },
  },
};
</script>
