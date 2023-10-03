<template>
  <div id="batchUpdate">
    <!-- 以租代建-生成合作合同 -->
    <FormItem
      ref="supplyFormItem"
      :layout="layout"
      :rules="formRules"
      :disabled="inputDisabled"
      :isEdit="isEdit"
      :form.sync="form"
      :labelWidth="'140px'"
      @submit="submitForm"
    />
    <wrapper title="申请列表">
      <page-table
        ref="pageTable"
        col-align="left"
        :data="tableData"
        :cols="tableCols"
        :selection="false"
        :operator="false"
        :showPage="false"
        reserveSelection
      >
      </page-table>
    </wrapper>
  </div>
</template>

<script>
import FormItem from '@/components/formItem';
import wrapper from '@/components/wrapper';
import PageTable from '@/components/page-table';
import { batchUpdate } from '@/api/marketMiddleStage/projectApprovalManagement/instead';

export default {
  name: 'batchUpdate',
  components: {
    FormItem,
    wrapper,
    PageTable,
  },
  props: {
    show: Boolean,
    data: {},
  },
  inject: ['common'],
  data() {
    const { configType } = this.data;

    return {
      /** 输入禁用 */
      inputDisabled: configType === 'detail',
      isEdit: ['add', 'edit'].includes(configType),
      isAdd: ['add'].includes(configType),
      form: {},
      layout: [
        {
          title: '时间信息信息',
          formItems: [
            {
              label: '拆站日期',
              prop: 'splitTime',
              inputType: 'dataPicker',
              formatText: 'yyyy 年 MM 月 dd 日  HH 时 mm 分 ss 秒',
              format: 'yyyy-MM-dd HH:mm:ss',
              span: 12,
            },
          ],
        },
      ],
      formRules: {
        splitTime: {
          required: true,
          message: '请选择拆站日期',
          trigger: 'blur',
        },
      },
      peopleShow: false,
      peopleData: {},
      selectTable: {},
      tableData: [], // 表单数据
      tableCols: [
        {
          label: '项目名称',
          prop: 'name',
        },
        {
          label: 'ERP编号',
          prop: 'erpNumber',
        },
        {
          label: '业务确认单号',
          prop: 'busiOrderId',
        },
        {
          label: '省份',
          prop: 'province',
        },
        {
          label: '地市',
          prop: 'city',
        },
        {
          label: '区县',
          prop: 'area',
        },
        {
          label: '委托模式',
          prop: 'entrustType',
        },
        {
          label: '产品服务费(元/年、含税)',
          prop: 'prodPrice',
        },
        {
          label: '产品服务费(元/年、不含税)',
          prop: 'prodPriceNoTax',
        },
      ],
      unitData: {},
      unitShow: false,
      selectUnitTable: {},
    };
  },
  mounted() {
    // this.$nextTick(() => {
    // });
  },
  watch: {
    data(val) {
      console.log('val', val);
      // this.data = val;
      this.inputDisabled = val.configType === 'detail';
      this.isEdit = ['add', 'edit'].includes(val.configType);
      this.isAdd = ['add'].includes(val.configType);
      if (!this.isAdd) {
        this.reqDetail();
      }
    },
  },
  methods: {
    // 请求数据
    reqDetail() {
      const { row } = this.data;

      if (row) {
        // this.form = {
        //   ...this.form,
        //   ...row,
        // };
        this.tableData = row;
      }
    },
    submitFormItem() {
      this.$refs.supplyFormItem.submitForm();
    },
    // 提交数据
    submitForm(val) {
      console.log('this.data', this.data);
      const { configType, row } = this.data;
      const id = configType === 'add' ? '' : this.form.id;
      const param = {
        ...val,
        ids: this.tableData.map((table) => table.id),
      };
      const message = '更新状态成功';

      // 以租代建生成合作合同
      batchUpdate(param).then((res) => {
        if (res.code === '200') {
          this.$notify({
            title: '成功',
            message,
            type: 'success',
            position: 'bottom-right',
          });
          this.$emit('success');
        }
      });
    },
    // 取消提交
    cancelForm() {
      this.form = {};
      this.$refs.supplyFormItem.cancelForm();
    },
  },
  created() {
    if (this.isAdd === false) {
      this.reqDetail();
    }
  },
};
</script>

<style lang="less" scoped>
#batchUpdate {
  #PageTable {
    min-height: auto;
  }
}
</style>
