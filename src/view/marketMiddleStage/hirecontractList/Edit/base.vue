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
    <hireProjectSelect
      :api="hireGetListByCondition"
      :show="projectShow"
      :data="projectData"
      @cancel="closeProject"
      @success="successProject"
    />
    <hireFrameWorkSelect
      :show="hireFrameWorkShow"
      :data="hireFrameWorkData"
      @cancel="closehireFrameWork"
      @success="successhireFrameWork"
    />
  </div>
</template>

<script>
import FormItem from '@/components/formItem';
import hireProjectSelect from '@/view/common/hireProjectSelect';
import hireFrameWorkSelect from '@/view/common/hireFrameWorkSelect';
import {
  hireContractDetail,
  getProjectBaseInfo,
  updateHireContract,
  addHireContract,
  hireGetListByCondition,
} from '@/api/marketMiddleStage/hirecontractList';

export default {
  name: 'baseInfo',
  components: {
    FormItem,
    hireProjectSelect,
    hireFrameWorkSelect,
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
      hireGetListByCondition,
      inputDisabled: configType === 'detail',
      isEdit: ['add', 'edit'].includes(configType),
      isAdd: ['add'].includes(configType),
      form: {
        oneMajor: undefined,
        twoMajor: undefined,
        hireId: undefined,
        hireIdName: undefined,
        construction: undefined,
        constructionRate: undefined,
        constructionTax: undefined,
        material: undefined,
        materialRate: undefined,
        materialTax: undefined,
        contractAmount: 0,
        constructionAll: 0,
        materialAll: 0,
        security: undefined,
        other: undefined,
      },
      layout: [
        {
          title: '项目基础信息',
          formItems: [
            {
              label: 'ERP编号',
              prop: 'erpId',
              inputType: 'select',
              span: 12,
              // 跳转项目选择
              onFocus: (val) => {
                this.projectData = {
                  ...this.data,
                  ...this.form,
                };
                this.projectShow = true;
                console.log('onFocus', val);
              },
            },
            {
              label: '项目名称',
              prop: 'projectName',
              disabled: true,
              inputType: 'input',
              span: 12,
            },
            {
              label: '生产中心',
              prop: 'deptId',
              disabled: true,
              inputType: 'select',
              span: 12,
              options: this.common().productionCenterCode,
            },
            {
              label: '设计单位',
              prop: 'designUnit',
              disabled: true,
              inputType: 'select',
              span: 12,
              options: this.common().designUnitCode,
            },
            {
              label: '监理单位',
              prop: 'projectName',
              disabled: true,
              inputType: 'select',
              span: 12,
              options: this.common().supervisionUnitCode,
            },
            {
              label: '建设单位',
              prop: 'constructions',
              disabled: true,
              inputType: 'select',
              span: 12,
              options: this.common().constructionCode,
            },
            {
              label: '项目状态',
              prop: 'projectstatus',
              disabled: true,
              inputType: 'select',
              span: 12,
              options: this.common().constructionCode,
            },
            {
              label: '预估收入',
              prop: 'estimatedRevenue',
              disabled: true,
              inputType: 'input',
              span: 12,
            },
            {
              label: '预估成本',
              prop: 'estimatedCost',
              disabled: true,
              inputType: 'input',
              span: 12,
            },
            {
              label: '一级专业',
              prop: 'oneMajor',
              inputType: 'select',
              disabled: true,
              span: 12,
              options: this.common().majorCode,
              onChange: (val) => {
                this.setTwoMajor(val);
              },
            },
            {
              label: '二级专业',
              prop: 'twoMajor',
              inputType: 'select',
              disabled: true,
              span: 12,
              options: [],
              onChange: (val) => {
                this.form = {
                  ...this.form,
                  twoMajor: val,
                };
              },
            },
            {
              label: '开工时间',
              prop: 'startTime',
              disabled: true,
              inputType: 'dataPicker',
              span: 12,
            },
            {
              label: '完工时间',
              prop: 'endTime',
              disabled: true,
              inputType: 'dataPicker',
              span: 12,
            },
          ],
        },
        {
          title: '承揽合同项目数据',
          formItems: [
            {
              label: '承揽订单',
              prop: 'orderId',
              inputType: 'input',
              span: 12,
            },
            {
              label: '承揽框架',
              prop: 'hireId',
              inputType: 'select',
              span: 12,
              // 跳转承揽框架选择
              onFocus: (val) => {
                this.hireFrameWorkData = {
                  ...this.data,
                  ...this.form,
                };
                this.hireFrameWorkShow = true;
              },
            },
            {
              label: '记税方式',
              prop: 'taxType',
              inputType: 'select',
              span: 12,
              options: this.common().taxTypeCode,
            },
            {
              label: '大项编号',
              prop: 'projectCode',
              inputType: 'input',
              span: 12,
            },
            {
              label: '单项名称',
              prop: 'orderName',
              inputType: 'input',
              span: 12,
            },
          ],
        },
        {
          title: '承揽合同金额数据',
          formItems: [
            {
              label: '合同总额',
              prop: 'contractAmount',
              disabled: true,
              inputType: 'inputNumber',
              span: 12,
            },
            {
              label: '总施工费',
              prop: 'constructionAll',
              disabled: true,
              inputType: 'inputNumber',
              span: 12,
            },
            {
              label: '总材料费',
              prop: 'materialAll',
              disabled: true,
              inputType: 'inputNumber',
              span: 12,
            },
            {
              label: '施工费(不含税)',
              prop: 'construction',
              inputType: 'inputNumber',
              span: 12,
              onChange: (val) => {
                if (this.form.construction === val) {
                  return;
                }
                this.form = {
                  ...this.form,
                  construction: val,
                };
                const { construction, constructionRate } = this.form;

                if (!constructionRate || !construction) {
                  this.form.constructionTax = 0;

                  return;
                }
                const taxRetaValue = constructionRate.split('_')[1];
                const amountTax = ((parseFloat(construction || 0) * parseFloat(taxRetaValue || 0)) / 100).toFixed(2);

                this.form.constructionTax = amountTax;
                this.form.constructionAll = parseFloat(construction || 0) + parseFloat(amountTax || 0);
                // 合同总额
                this.setContractAmount();
              },
            },
            {
              label: '施工费税率',
              prop: 'constructionRate',
              inputType: 'select',
              span: 12,
              options: this.common().taxRateCode,
              onChange: (val) => {
                if (this.form.constructionRate === val) {
                  return;
                }
                this.form = {
                  ...this.form,
                  constructionRate: val,
                };
                const taxRetaValue = val.split('_')[1];

                const { construction, constructionRate } = this.form;

                if (!constructionRate || !construction) {
                  this.form.constructionTax = 0;

                  return;
                }

                const amountTax = ((parseFloat(construction || 0) * parseFloat(taxRetaValue || 0)) / 100).toFixed(2);

                this.form.constructionTax = amountTax;

                // 合计
                this.form.constructionAll = parseFloat(construction || 0) + parseFloat(amountTax || 0);
                // 合同总额
                this.setContractAmount();
              },
            },
            {
              label: '施工税',
              prop: 'constructionTax',
              disabled: true,
              inputType: 'input',
              span: 12,
            },
            {
              label: '材料费(不含税)',
              prop: 'material',
              inputType: 'inputNumber',
              span: 12,
              onChange: (val) => {
                if (this.form.material === val) {
                  return;
                }
                this.form = {
                  ...this.form,
                  material: val,
                };
                const { material, materialRate } = this.form;

                if (!taxRetaValue || !materialRate) {
                  this.form.materialTax = 0;

                  return;
                }
                const taxRetaValue = materialRate.split('_')[1];
                const amountTax = ((parseFloat(material || 0) * parseFloat(taxRetaValue || 0)) / 100).toFixed(2);

                this.form.materialTax = amountTax;
                this.form.materialAll = parseFloat(material || 0) + parseFloat(amountTax || 0);
                // 合同总额
                this.setContractAmount();
              },
            },
            {
              label: '材料费税率',
              prop: 'materialRate',
              inputType: 'select',
              span: 12,
              options: this.common().taxRateCode,
              onChange: (val) => {
                if (this.form.materialRate === val) {
                  return;
                }
                this.form = {
                  ...this.form,
                  materialRate: val,
                };
                const taxRetaValue = val.split('_')[1];

                const { material, materialRate } = this.form;

                if (!materialRate || !material) {
                  this.form.materialTax = 0;

                  return;
                }

                const amountTax = ((parseFloat(material || 0) * parseFloat(taxRetaValue || 0)) / 100).toFixed(2);
                // console.log(amountTax);

                this.form.materialTax = amountTax;
                this.form.materialAll = parseFloat(material || 0) + parseFloat(amountTax || 0);

                // 合同总额
                this.setContractAmount();
              },
            },
            {
              label: '材料税',
              prop: 'materialTax',
              disabled: true,
              inputType: 'inputNumber',
              span: 12,
            },

            {
              label: '安全生产费(含税)',
              prop: 'security',
              inputType: 'inputNumber',
              span: 12,
              onChange: (val) => {
                if (this.form.security === val) {
                  return;
                }
                this.form = {
                  ...this.form,
                  security: val,
                };
                // 合同总额
                this.setContractAmount();
              },
            },
            {
              label: '设计费(含税)',
              prop: 'designFee',
              inputType: 'inputNumber',
              span: 12,
              onChange: (val) => {
                if (this.form.designFee === val) {
                  return;
                }
                this.form = {
                  ...this.form,
                  designFee: val,
                };
                // 合同总额
                this.setContractAmount();
              },
            },
            {
              label: '其它金额(含税)',
              prop: 'other',
              inputType: 'inputNumber',
              span: 12,
              onChange: (val) => {
                if (this.form.other === val) {
                  return;
                }
                this.form = {
                  ...this.form,
                  other: val,
                };
                // 合同总额
                this.setContractAmount();
              },
            },
            {
              label: '合同状态',
              prop: 'contractStatus',
              inputType: 'select',
              span: 12,
              options: this.common().contractStatus,
              onChange: (val) => {
                if (this.form.contractStatus === val) {
                  return;
                }
                this.form = {
                  ...this.form,
                  contractStatus: val,
                };
              },
            },
            {
              label: '签订日期',
              prop: 'signDate',
              inputType: 'dataPicker',
              // formatText: 'yyyy 年 MM 月 dd 日  HH 时 mm 分 ss 秒',
              // format: 'yyyy-MM-dd HH:mm:ss',
              span: 12,
            },
            {
              label: '是否开具外经证',
              prop: 'isNeedCertificate',
              inputType: 'select',
              span: 12,
              options: this.common().bondIsCancel,
            },
            {
              label: '备注',
              prop: 'remark',
              inputType: 'input',
              span: 12,
            },
          ],
        },
      ],
      // 必填内容
      formRules: {
        erpId: {
          required: true,
          message: '请输入ERP编号',
          trigger: 'blur',
        },
        orderId: {
          required: true,
          message: '请输入承揽订单',
          trigger: 'blur',
        },
        hireIdName: {
          required: true,
          message: '请输入承揽框架',
          trigger: 'blur',
        },
        taxType: {
          required: true,
          message: '请选择记税方式',
          trigger: 'blur',
        },
        projectCode: {
          required: true,
          message: '请输入大项编号',
          trigger: 'blur',
        },
        orderName: {
          required: true,
          message: '请输入单项名称',
          trigger: 'blur',
        },
        construction: {
          required: true,
          message: '请输入施工费',
          trigger: 'blur',
        },
        constructionRate: {
          required: true,
          message: '请选择施工费税率',
          trigger: 'blur',
        },
        constructionTax: {
          required: true,
          message: '请输入施工税',
          trigger: 'blur',
        },
        material: {
          required: true,
          message: '请输入材料费',
          trigger: 'blur',
        },
        materialRate: {
          required: true,
          message: '请选择材料费税率',
          trigger: 'blur',
        },
        materialTax: {
          required: true,
          message: '请输入材料税',
          trigger: 'blur',
        },
        contractAmount: {
          required: true,
          message: '请输入合同总额',
          trigger: 'blur',
        },
        constructionAll: {
          required: true,
          message: '请输入总施工费',
          trigger: 'blur',
        },
        materialAll: {
          required: true,
          message: '请输入总材料费',
          trigger: 'blur',
        },
        security: {
          required: true,
          message: '请输入安全生产费',
          trigger: 'blur',
        },
        designFee: {
          required: true,
          message: '请输入设计费',
          trigger: 'blur',
        },
        other: {
          required: true,
          message: '请输入其它金额',
          trigger: 'blur',
        },
        contractStatus: {
          required: true,
          message: '请输入合同状态',
          trigger: 'blur',
        },
        signDate: {
          required: true,
          message: '请输入签订日期',
          trigger: 'blur',
        },
        isNeedCertificate: {
          required: true,
          message: '请输入是否开具外经证',
          trigger: 'blur',
        },
      },
      reqData: {},
      projectShow: false,
      projectData: {},
      projectTable: {},
      hireFrameWorkShow: false,
      hireFrameWorkData: false,
      hireFrameWorkTable: false,
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
    // 请求数据
    reqDetail() {
      const { row } = this.data;

      if (row && row.id) {
        // 承揽合同详情信息
        hireContractDetail(row.id).then((res) => {
          if (res && res.code === '200') {
            this.reqData = res.data;
            if (res.data.infoProjectBaseDtoModel.oneMajor) {
              this.setTwoMajor(res.data.infoProjectBaseDtoModel.oneMajor);
            }
            this.form = {
              ...this.form,
              ...res.data.hireContractDtoModel,
              ...res.data.infoProjectBaseDtoModel,
            };
          }
        });
      }
    },
    // 二级专业
    async setTwoMajor(val) {
      const options = this.common().majorCode;
      const findItem = options.filter((option) => option.id === val);

      this.form = {
        ...this.form,
        oneMajor: findItem[0].id,
        twoMajor: undefined,
      };
      const twoMajor = await this.$getCode(findItem[0].id);

      this.$set(this.layout[0].formItems[10], 'options', twoMajor);
    },
    // 合同总额
    setContractAmount() {
      const { constructionAll, materialAll, security, designFee, other } = this.form;

      this.form.contractAmount =
        parseFloat(constructionAll === undefined ? 0 : constructionAll) +
        parseFloat(materialAll === undefined ? 0 : materialAll) +
        parseFloat(security === undefined ? 0 : security) +
        parseFloat(designFee === undefined ? 0 : designFee) +
        parseFloat(other === undefined ? 0 : other);
    },
    submitFormItem() {
      this.$refs.supplyFormItem.submitForm();
    },
    // 提交数据
    submitForm(val) {
      console.log('this.data', this.data);
      const { configType, row } = this.data;
      const param = {
        ...val,
      };

      let message = '';

      let api = addHireContract;

      if (configType === 'edit') {
        param.id = this.form.id;
        message = '修改成功';
        api = updateHireContract;
      }
      // 新增承揽合同
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
    // 关闭项目选择
    closeProject() {
      this.projectShow = false;
      this.projectData = {};
    },
    // 成功项目选择
    successProject(projectTable) {
      this.projectTable = projectTable;
      // 获取项目详情
      getProjectBaseInfo(projectTable.erpNumber).then((res) => {
        if (res && res.code === '200') {
          if (res.data.oneMajor) {
            this.setTwoMajor(res.data.oneMajor);
          }
          this.form = {
            ...this.form,
            erpId: projectTable.erpNumber,
            projectName: res.data.projectName,
            deptId: res.data.deptId,
            designUnit: res.data.design,
            supervisionUnit: res.data.supervision,
            constructions: res.data.constructions,
            projectstatus: res.data.projectStatus,
            estimatedRevenue: res.data.estimatedRevenue,
            estimatedCost: res.data.estimatedCost,
            oneMajor: res.data.oneMajor,
            twoMajor: res.data.twoMajor,
            startTime: res.data.startTime,
            endTime: res.data.endTime,
            hireId: res.data.contractId,
          };
        }
      });

      this.closeProject();
    },
    // 关闭承揽框架选择
    closehireFrameWork() {
      this.hireFrameWorkShow = false;
      this.hireFrameWorkData = {};
    },
    // 成功承揽框架选择
    successhireFrameWork(selectTable) {
      this.hireFrameWorkTable = selectTable;
      this.form = {
        ...this.form,
        hireIdName: selectTable.contractName,
        hireId: selectTable.contractId,
      };
      this.closehireFrameWork();
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
