<template>
  <div id="base">
    <FormItem
      ref="supplyFormItem"
      :layout="layout"
      :rules="formRules"
      :disabled="inputDisabled"
      :isEdit="isEdit"
      :form.sync="form"
      @submit="submitForm"
    />
  </div>
</template>

<script>
import FormItem from '@/components/formItem';
import { writeAdjustReason } from '@/api/financeManagement/bankRecordManagement';

export default {
  name: 'baseInfo',
  components: {
    FormItem,
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
      form: {
        adjustReason: undefined,
      },
      layout: [
        {
          title: '款项性质填写',
          formItems: [
            {
              label: '款项性质',
              prop: 'adjustReason',
              inputType: 'select',
              span: 12,
              options: this.common().recordAdjustType,
              onChange: (val) => {
                // const options = this.common().judgeResult;
                // const findItem = options.filter((option) => option.id === val);
                //
                // this.form = {
                //   ...this.form,
                //   judgeResult: findItem[0].id,
                //   auditOpinion: findItem[0].name,
                // };
              },
            },
          ],
        },
      ],
      formRules: {
        // no: { required: true, message: "请输入公告名称", trigger: "blur" },
        // address: { required: true, message: "请输入公告号", trigger: "blur" },
        // buildArea: {
        //   required: true,
        //   message: "请选择公告类型",
        //   trigger: "blur",
        // },
      },
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
      // if (!this.isAdd) {
      //   this.reqDetail();
      // }
    },
  },
  methods: {
    reqDetail() {
      const { row } = this.data;

      if (row && row.id) {
        this.form = {
          ...this.form,
          ...row,
        };
      }
    },
    submitFormItem() {
      this.$refs.supplyFormItem.submitForm();
    },
    submitForm(val) {
      console.log('this.data', this.data);
      const param = {
        // ...val,
        adjustReason: val.adjustReason,
        id: this.data.row.id,
      };

      writeAdjustReason(param).then((res) => {
        if (res.code === '200') {
          this.$notify({
            title: '成功',
            message: '操作成功',
            type: 'success',
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
  created() {
    // if (this.isAdd === false) {
    //   this.reqDetail();
    // }
  },
};
</script>

<style lang="less" scoped>
#base {
}
</style>
