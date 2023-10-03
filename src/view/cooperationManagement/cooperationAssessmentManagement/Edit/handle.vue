<template>
  <div id="handle">
    <FormItem
      ref="supplyFormItem"
      :layout="layout"
      :rules="formRules"
      :disabled="inputDisabled"
      :isEdit="isEdit"
      :form.sync="form"
      @submit="submitForm"
    />

    <!-- <cooperation-dialog
      :show="false"
      :data="cooperationData"
      @cancel="closeCooperation"
      @success="successCooperation"
    /> -->
    <cooperationUnits :show="unitShow" :data="unitData" @cancel="closeEdit" @success="successEdit" />
  </div>
</template>

<script>
import FormItem from '@/components/formItem';
// import CooperationDialog from '@/components/cooperationDialog';
import cooperationUnits from '@/view/common/cooperationUnits';
import { updateCooperationAssessment, addCooperationAssessment } from '@/api/cooperationUnitManagement/index';

export default {
  name: 'handleInfo',
  components: {
    FormItem,
    // CooperationDialog,
    cooperationUnits,
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
          title: '月度评估编辑',
          formItems: [
            {
              label: '合作单位',
              prop: 'unitName',
              inputType: 'input',
              span: 12,
              onFocus: (val) => {
                this.unitData = {
                  ...this.data,
                  ...this.form,
                };
                this.unitShow = true;
              },
            },
            {
              label: '年份',
              inputType: 'year',
              span: 12,
              prop: 'year',
            },
            {
              label: '月份',
              inputType: 'month',
              span: 12,
              prop: 'month',
              // props: {
              //   type: 'month',
              //   format: 'MM',
              //   fieldName: 'signDate',
              //   placeholder: '请选择月份',
              // },
            },
            {
              label: '项目部考核',
              prop: 'project',
              inputType: 'input',
              span: 12,
            },
            {
              label: '质监部考核',
              prop: 'quality',
              inputType: 'input',
              span: 12,
            },
            {
              label: '区办考核',
              prop: 'office',
              inputType: 'input',
              span: 12,
            },
            {
              label: '月度考核',
              prop: 'average',
              inputType: 'input',
              span: 12,
            },
            {
              label: '罚款情况',
              prop: 'rewards',
              inputType: 'input',
              span: 12,
            },
            {
              label: '备注',
              prop: 'remark',
              inputType: 'input',
              span: 12,
            },
            {
              label: '整改通知',
              prop: 'assessment',
              inputType: 'input',
              span: 12,
            },
            {
              label: '黄牌',
              prop: 'yellowAssessment',
              inputType: 'input',
              span: 12,
            },
            {
              label: '红牌',
              prop: 'redAssessment',
              inputType: 'input',
              span: 12,
            },
            {
              label: '黑牌',
              prop: 'blackAssessment',
              inputType: 'input',
              span: 12,
            },
          ],
        },
      ],
      formRules: {
        unitName: {
          required: true,
          message: '请选择合作单位',
          trigger: 'change',
        },
        project: {
          type: 'number',
          message: '请输入数字',
          trigger: 'change',
          validator: this.checkNum,
        },
        quality: {
          type: 'number',
          message: '请输入数字',
          trigger: 'change',
          validator: this.checkNum,
        },
        average: {
          type: 'number',
          message: '请输入数字',
          trigger: 'change',
          validator: this.checkNum,
        },
        rewards: {
          type: 'number',
          message: '请输入数字',
          trigger: 'change',
          validator: this.checkNum,
        },
        assessment: {
          type: 'number',
          message: '请输入数字',
          trigger: 'change',
          validator: this.checkNum,
        },
        yellowAssessment: {
          type: 'number',
          message: '请输入数字',
          trigger: 'blur',
          validator: this.checkNum,
        },
        redAssessment: {
          type: 'number',
          message: '请输入数字',
          trigger: 'change',
          validator: this.checkNum,
        },
        blackAssessment: {
          type: 'number',
          message: '请输入数字',
          trigger: 'change',
          validator: this.checkNum,
        },
        // no: { required: true, message: "请输入公告名称", trigger: "blur" },
        // address: { required: true, message: "请输入公告号", trigger: "blur" },
        // buildArea: {
        //   required: true,
        //   message: "请选择公告类型",
        //   trigger: "blur",
        // },
      },
      unitData: {},
      unitShow: false,
      selectTable: {},
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
      console.log('this.val', val);
      const { configType } = this.data;

      let param = {};

      if (val.month && val.month.indexOf('月') !== -1) {
        const monthStr = val.month.substring(0, val.month.indexOf('月'));
        const { month, ...formatVal } = val;

        // console.log(formatVal);

        param = {
          month: monthStr,
          ...formatVal,
        };
      } else {
        param = {
          ...val,
        };
      }

      console.log(param);

      // return;
      if (configType === 'edit') {
        updateCooperationAssessment(param).then((res) => {
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
      } else if (configType === 'add') {
        Reflect.deleteProperty(param, 'id');
        addCooperationAssessment(param).then((res) => {
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
      }
    },
    cancelForm() {
      this.form = {};
      this.$refs.supplyFormItem.cancelForm();
    },

    closeEdit() {
      this.unitShow = false;
      this.unitData = {};
    },
    successEdit(selectTable) {
      this.selectTable = selectTable;
      console.log(selectTable);
      // this.form.unitName = selectTable.unitName;
      // this.form.detailId = selectTable.id;
      this.form = {
        ...this.form,
        unitName: selectTable.unitName,
        detailId: selectTable.id,
      };
      this.closeEdit();
    },

    checkNum(rule, value, callback) {
      if (!value) {
        return callback(); // 无值也通过，非必填
        // return callback(new Error('请输入内容'));
      }
      const enterValue = parseFloat(value);

      // eslint-disable-next-line no-negated-condition
      if (!Number.isFinite(enterValue)) {
        callback(new Error('请输入数字值'));
      } else {
        callback();
      }
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
#handle {
}
</style>
