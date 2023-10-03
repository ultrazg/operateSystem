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
import { dictionaryAdd } from '@/api/basicInformationManagement/dictionariesIndex';

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
      form: {},
      layout: [
        {
          title: '字典新增',
          formItems: [
            {
              label: '字典编码',
              prop: 'code',
              inputType: 'input',
              span: 12,
            },
            {
              label: '字典排序',
              prop: 'sortKey',
              inputType: 'input',
              span: 12,
            },
            {
              label: '字典名称/值',
              prop: 'name',
              inputType: 'input',
              span: 12,
            },
            {
              label: '字典值',
              prop: 'value',
              inputType: 'input',
              span: 12,
            },
            {
              label: '字典备注',
              prop: 'description',
              inputType: 'input',
              span: 12,
            },
          ],
        },
      ],
      formRules: {
        code: {
          required: true,
          message: '请输入字典编码',
          trigger: 'blur',
        },
        sortKey: {
          required: true,
          message: '请输入字典排序',
          trigger: 'blur',
        },
        name: {
          required: true,
          message: '请输入字典名称/值',
          trigger: 'blur',
        },
      },
    };
  },
  mounted() {
    // this.$nextTick(() => {
    // });
  },
  watch: {
    data(val) {
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
      const { configType, row } = this.data;
      const id = configType === 'add' ? '' : this.form.id;

      const param = {
        parentId: row.parentId,
        code: val.code,
        description: val.description,
        name: val.name,
        sortKey: val.sortKey,
        value: val.value,
      };
      const message = configType === 'add' ? '新增成功' : '修改成功';

      dictionaryAdd(param).then((res) => {
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
#base {
}
</style>
