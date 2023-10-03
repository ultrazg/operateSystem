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
    <opportunitySelection
      :show="opportunitySelectionShow"
      :data="opportunitySelectionData"
      @cancel="closeopportunitySelection"
      @success="successopportunitySelection"
    />
    <tenderInfoSelect
      :show="tenderInfoSelectShow"
      :data="tenderInfoSelectData"
      @cancel="closetenderInfoSelect"
      @success="successtenderInfoSelect"
    />
  </div>
</template>

<script>
import FormItem from '@/components/formItem';
import opportunitySelection from '@/view/common/opportunitySelection';
import tenderInfoSelect from '@/view/common/tenderInfoSelect';
import { hireFrameworkDetail, addHireFramework, updateHireFramework } from '@/api/marketMiddleStage/hireFramework';
import { getBusinessOpportunityById } from '@/api/marketMiddleStage/projectApprovalManagement';
export default {
  name: 'baseInfo',
  components: {
    FormItem,
    opportunitySelection,
    tenderInfoSelect,
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
        province: undefined,
        city: undefined,
        subject: this.common().subjectCode[0].id,
      },
      layout: [
        {
          title: '承揽框架信息',
          formItems: [
            {
              label: '投标申请编号',
              prop: 'tenderApplyId',
              inputType: 'select',
              span: 12,
              // 跳转投标选择
              onFocus: (val) => {
                this.tenderInfoSelectData = {
                  ...this.data,
                  ...this.form,
                };
                this.tenderInfoSelectShow = true;
              },
            },
            {
              label: '项目信息概况',
              prop: 'busiName',
              inputType: 'input',
              span: 12,
            },
            {
              label: '商机编号',
              prop: 'busiId',
              inputType: 'select',
              span: 12,
              // 跳转商机选择
              onFocus: (val) => {
                this.opportunitySelectionData = {
                  ...this.data,
                  ...this.form,
                };
                this.opportunitySelectionShow = true;
              },
            },
            {
              label: '框架名称',
              prop: 'contractName',
              inputType: 'input',
              span: 12,
            },
            {
              label: '框架编号',
              prop: 'contractId',
              inputType: 'input',
              span: 12,
            },
            {
              label: '专业',
              prop: 'major',
              multiple: true,
              inputType: 'select',
              span: 12,
              options: this.common().majorCode,
            },
            {
              label: '省份',
              prop: 'province',
              inputType: 'select',
              span: 12,
              options: this.common().provincialCode,
              onChange: (val) => {
                this.setCity(val);
              },
            },
            {
              label: '城市',
              prop: 'city',
              multiple: true,
              inputType: 'select',
              span: 12,
              options: [],
              onChange: (val) => {
                this.form = {
                  ...this.form,
                  city: val,
                };
              },
            },
            {
              label: '框架来源',
              prop: 'from',
              inputType: 'select',
              span: 12,
              options: this.common().contractFromCode,
            },
            {
              label: '对应招标编号',
              prop: 'tenderId',
              inputType: 'input',
              span: 12,
            },
            {
              label: '委托方',
              prop: 'consignor',
              inputType: 'select',
              span: 12,
              options: this.common().constructionCode,
            },
            {
              label: '主体',
              prop: 'subject',
              inputType: 'select',
              span: 12,
              disabled: true,
              options: this.common().subjectCode,
            },
            {
              label: '档案份数',
              prop: 'documents',
              inputType: 'input',
              span: 12,
            },
            {
              label: '存档日期',
              prop: 'documentDate',
              inputType: 'dataPicker',
              span: 12,
            },
            {
              label: '安全生产费',
              prop: 'security',
              inputType: 'input',
              span: 12,
            },
            {
              label: '履约保证金',
              prop: 'bond',
              inputType: 'input',
              span: 12,
            },
            {
              label: '保证金日期',
              prop: 'bondDate',
              inputType: 'dataPicker',
              span: 12,
            },
            {
              label: '有效日期起',
              prop: 'validitySDate',
              inputType: 'dataPicker',
              span: 12,
            },
            {
              label: '签订日期',
              prop: 'signDate',
              inputType: 'dataPicker',
              span: 12,
            },
            {
              label: '有效日期止',
              prop: 'validityEDate',
              inputType: 'dataPicker',
              span: 12,
            },
            {
              label: '备注',
              prop: 'remark',
              inputType: 'input',
              span: 12,
            },
            {
              label: '审核状态',
              prop: 'status',
              inputType: 'select',
              span: 12,
              hide: true,
              options: this.common().verifyStatusCode,
            },
          ],
        },
      ],
      formRules: {
        contractName: {
          required: true,
          message: '请输入框架名称',
          trigger: 'blur',
        },
        major: {
          required: true,
          message: '请选择专业',
          trigger: 'blur',
        },
        contractId: {
          required: true,
          message: '请输入框架编号',
          trigger: 'blur',
        },
        province: {
          required: true,
          message: '请选择省份',
          trigger: 'blur',
        },
        city: {
          required: true,
          message: '请选择城市',
          trigger: 'blur',
        },
        from: {
          required: true,
          message: '请选择框架来源',
          trigger: 'blur',
        },
        consignor: {
          required: true,
          message: '请选择委托方',
          trigger: 'blur',
        },
        subject: {
          required: true,
          message: '请选择主体',
          trigger: 'blur',
        },
        documents: {
          required: true,
          message: '请输入档案份数',
          trigger: 'blur',
        },
        major: {
          required: true,
          message: '请选择专业',
          trigger: 'blur',
        },
        major: {
          required: true,
          message: '请选择专业',
          trigger: 'blur',
        },
      },
      opportunitySelectionTable: {},
      opportunitySelectionData: {},
      opportunitySelectionShow: false,
      tenderInfoSelectTable: {},
      tenderInfoSelectData: {},
      tenderInfoSelectShow: false,
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
    // 承揽框架详情
    reqDetail() {
      const { row } = this.data;

      if (row && row.id) {
        hireFrameworkDetail(row.id).then((res) => {
          if (res && res.code === '200') {
            if (res.data.province) {
              this.setCity(res.data.province);
            }
            this.form = {
              ...this.form,
              ...res.data,
              major: res.data.major.split(','),
              city: res.data.city.split(','),
            };
          }
        });
      }
    },
    async setCity(province) {
      this.form = {
        ...this.form,
        province,
        city: undefined,
      };
      const options = this.common().provincialCode;
      const findItem = options.filter((option) => option.id === province);

      if (findItem.length === 0) {
        return;
      }
      const city = await this.$getCode(findItem[0].id);

      this.$set(this.layout[0].formItems[7], 'options', city);
    },

    submitFormItem() {
      this.$refs.supplyFormItem.submitForm();
    },
    // 提交数据 修改
    submitForm(val) {
      console.log('this.data', this.data);
      const { configType, row } = this.data;
      const param = {
        ...val,
        major: val.major.join(','),
        city: val.city.join(','),
      };

      let message = '';

      let api = addHireFramework;

      if (configType === 'edit') {
        param.id = this.form.id;
        message = '修改成功';
        api = updateHireFramework;
      }
      api(param).then((res) => {
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
    // 关闭商机选择
    closeopportunitySelection() {
      this.opportunitySelectionShow = false;
      this.opportunitySelectionData = {};
    },
    // 商机选择成功
    successopportunitySelection(selectTable) {
      this.opportunitySelectionTable = selectTable;
      // 获取商机信息
      getBusinessOpportunityById(selectTable.id).then((res) => {
        if (res && res.code === '200') {
          if (res.data.province) {
            this.setCity(res.data.province);
          }
          this.form = {
            ...this.form,
            busiId: selectTable.busiId,
            busiName: selectTable.busiName,
            province: res.data.province,
            major: res.data.oneMajor.split(','),
            city: res.data.city.split(','),
          };
        }
      });
      this.closeopportunitySelection();
    },
    // 关闭投标申请编号
    closetenderInfoSelect() {
      this.tenderInfoSelectShow = false;
      this.tenderInfoSelectData = {};
    },
    // 投标申请编号成功
    successtenderInfoSelect(selectTable) {
      this.tenderInfoSelectTable = selectTable;
      this.form = {
        ...this.form,
        busiId: selectTable.busiId,
        busiName: selectTable.busiName,
        tenderApplyId: selectTable.tenderApplyId,
        consignor: selectTable.custName,
      };
      this.closeopportunitySelection();
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
