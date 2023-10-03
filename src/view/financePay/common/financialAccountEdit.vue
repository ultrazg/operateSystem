<template>
  <dialog-cont
    @on-cancel="canceledit('cancel')"
    @on-close="canceledit('close')"
    @on-confirm="confirmedit"
    @on-open="openedit"
    :title="title"
    :width="width"
    :visible.sync="dialogShow"
    :append-to-body="true"
    ref="dialog"
  >
    <div class="scrollView" :style="{ height: scrollHeight }">
      <FormItem
        ref="supplyFormItem"
        :layout="layout"
        :rules="formRules"
        :disabled="false"
        :isEdit="true"
        :form.sync="form"
        @submit="submitForm"
      />
    </div>
  </dialog-cont>
</template>

<script>
import dialogCont from '@/components/dialog';
import FormItem from '@/components/formItem';
import { saveBatchNo } from '@/api/financePay/financeLedger';
export default {
  name: 'financialAccountEdit',
  components: {
    dialogCont,
    FormItem,
  },
  inject: ['common'],
  props: {
    data: {},
    show: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: '编辑',
    },
    width: {
      type: String,
      default: '900px',
    },
  },
  data() {
    return {
      scrollHeight: 'auto',
      form: {},
      confirmShow: false,
      layout: [
        {
          title: '信息编辑',
          formItems: [],
        },
      ],
      formRules: {
        busiName: {
          required: true,
          message: '请输入商机(项目)名称',
          trigger: 'blur',
        },
      },
      paymentRecordFormItems: [
        {
          label: 'ERP编号',
          prop: 'erpNumber',
          inputType: 'input',
          span: 12,
          disabled: true,
        },
        {
          label: '预缴编号',
          prop: 'billID',
          inputType: 'input',
          span: 12,
          disabled: true,
        },
        {
          label: '增值税',
          prop: 'zzs',
          inputType: 'inputNumber',
          span: 12,
          disabled: true,
        },
        {
          label: '城建税',
          prop: 'cjs',
          inputType: 'inputNumber',
          span: 12,
          disabled: true,
        },
        {
          label: '教育费附加',
          prop: 'jys',
          inputType: 'inputNumber',
          span: 12,
          disabled: true,
        },
        {
          label: '地方教育附加',
          prop: 'dfjyf',
          inputType: 'inputNumber',
          span: 12,
          disabled: true,
        },
        {
          label: '列账金额',
          prop: 'amountTotal',
          inputType: 'inputNumber',
          span: 12,
        },
        {
          label: '列账单号',
          prop: 'batchNo',
          inputType: 'input',
          span: 12,
        },
      ],
      subPackageFormItems: [
        {
          label: 'ERP编号',
          prop: 'erpNumber',
          inputType: 'input',
          span: 12,
          disabled: true,
        },
        {
          label: '批次号',
          prop: 'batchID',
          inputType: 'input',
          span: 12,
          disabled: true,
        },
        {
          label: '税额',
          prop: 'taxAmount',
          inputType: 'inputNumber',
          span: 12,
          disabled: true,
        },
        {
          label: '不含税额',
          prop: 'freeAmount',
          inputType: 'inputNumber',
          span: 12,
          disabled: true,
        },
        {
          label: '总额',
          prop: 'priceAmount',
          inputType: 'inputNumber',
          span: 12,
          disabled: true,
        },
        {
          label: '列账金额',
          prop: 'amountTotal',
          inputType: 'inputNumber',
          span: 12,
        },
        {
          label: '列账单号',
          prop: 'batchNo',
          inputType: 'input',
          span: 12,
        },
      ],
    };
  },
  computed: {
    dialogShow: {
      get() {
        return this.show;
      },
      set(v) {
        console.log('set');
      },
    },
  },
  methods: {
    openedit() {
      console.log('openedit');
      console.log(this.data);
      const { row } = this.data;

      this.form = {
        ...row,
      };
      if (this.data.configType === 'subPackage') {
        this.form.amountTotal = row.priceAmount;
      } else {
        const { zzs = 0, cjs = 0, jys = 0, dfjyf = 0 } = row;

        this.form.amountTotal = parseFloat(zzs) + parseFloat(cjs) + parseFloat(jys) + parseFloat(dfjyf);
      }
      this.$set(
        this.layout[0],
        'formItems',
        this.data.configType === 'subPackage' ? this.subPackageFormItems : this.paymentRecordFormItems,
      );
    },
    closeedit() {
      this.cancelForm();
    },
    canceledit(type) {
      this.closeedit();
      this.$emit('cancel', type);
    },
    confirmedit() {
      this.submitFormItem();
    },
    successSubmit() {
      this.closeedit();
      this.$emit('success');
    },
    submitFormItem() {
      this.$refs.supplyFormItem.submitForm();
    },
    submitForm(val) {
      const { configType, row } = this.data;
      const params = {
        ...val,
        operType: configType,
      };

      saveBatchNo(params).then((res) => {
        if (res.code === '200') {
          this.$notify.success({
            title: '成功',
            message: '编辑成功',
            position: 'bottom-right',
          });
          this.$emit('success');
        }
      });
    },
    cancelForm() {
      this.form = {};
      this.$refs.supplyFormItem.cancelForm();
    },
  },
};
</script>

<style lang="less" scoped>
@deep: ~'>>>';

@{deep}.el-dialog__body {
  padding-right: 4px;
}
.scrollView {
  overflow: hidden;
  overflow-y: auto;
  padding-right: 10px;
  // 重写滚动条样式
  &::-webkit-scrollbar-track-piece {
    //滚动条凹槽的颜色，还可以设置边框属性
    background-color: transparent;
  }
  &::-webkit-scrollbar {
    //滚动条的宽度
    width: 4px;
    height: 4px;
    border-radius: 2px;
    margin-right: 2px;
    position: relative;
  }
  &::-webkit-scrollbar-thumb {
    //滚动条的设置
    background: #d5d5d5;
    background-clip: padding-box;
    min-height: 28px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background-color: #d5d5d5;
  }
}
</style>
