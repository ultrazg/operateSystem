<template>
  <div id="selfBaseInfo">
    <!--自建-新增-查看你-编辑页面模块-->
    <FormItem
      ref="supplyFormItem"
      :layout="layout"
      :rules="formRules"
      :disabled="inputDisabled"
      :isEdit="isEdit"
      :form.sync="form"
      :labelWidth="'140px'"
      @submit="submitForm"
      @change="changeForm"
    />
    <nextAuditPeople :show="peopleShow" :data="peopleData" @cancel="closeEdit" @success="successEdit" />
    <opportunitySelection
      :show="opportunitySelectionShow"
      :data="opportunitySelectionData"
      @cancel="closeopportunitySelection"
      @success="successopportunitySelection"
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
import nextAuditPeople from '@/view/common/nextAuditPeople.vue';
import opportunitySelection from '@/view/common/opportunitySelection';
import hireFrameWorkSelect from '@/view/common/hireFrameWorkSelect';
import { selectListByParentCode } from '@/api/common';
import { detail, addSelf, updateSelf } from '@/api/marketMiddleStage/projectApprovalManagement/oneSelf';
import { getBusinessOpportunityById } from '@/api/marketMiddleStage/projectApprovalManagement';
export default {
  name: 'selfBaseInfo',
  components: {
    FormItem,
    nextAuditPeople,
    opportunitySelection,
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
      inputDisabled: configType === 'detail',
      isEdit: ['add', 'edit'].includes(configType),
      isAdd: ['add'].includes(configType),
      form: {
        subject: this.common().subjectCode[0].id,
      },
      layout: [
        {
          title: '立项信息',
          formItems: [
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
              label: '框架编号',
              prop: 'contractId',
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
              label: '框架名称',
              prop: 'contractName',
              inputType: 'input',
              disabled: true,
              span: 12,
            },
            {
              label: '项目名称',
              prop: 'name',
              inputType: 'input',
              span: 12,
            },
            {
              label: '甲方项目编号',
              prop: 'aProjectId',
              inputType: 'input',
              span: 12,
            },
            {
              label: '甲方订购单号',
              prop: 'aOrderId',
              inputType: 'input',
              span: 12,
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
              inputType: 'select',
              span: 12,
              options: [],
              onChange: (val) => {
                this.form = {
                  ...this.form,
                  city: val,
                };
                this.setArea(val);
              },
            },
            {
              label: '区/县',
              prop: 'area',
              inputType: 'select',
              span: 12,
              options: [],
              multiple: true,
              onChange: (val) => {
                this.form = {
                  ...this.form,
                  area: val,
                };
              },
            },
            {
              label: '一级专业',
              prop: 'oneMajor',
              inputType: 'select',
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
              label: '市场类型',
              prop: 'marketType',
              inputType: 'select',
              span: 12,
              options: this.common().marketType,
              onChange: (val) => {
                this.form.marketType = val;
              },
            },
            {
              label: '部门',
              prop: 'deptId',
              inputType: 'select',
              span: 12,
              options: this.common().deptIdCode,
            },
            {
              label: '项目经理',
              prop: 'managerName',
              inputType: 'select',
              span: 12,
              // 跳转人员选择
              onFocus: (val) => {
                this.peopleData = {
                  ...this.data,
                  ...this.form,
                };
                this.peopleShow = true;
              },
            },
            {
              label: '项目经理电话',
              prop: 'managerMobile',
              inputType: 'input',
              disabled: true,
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
              label: '计划开工时间',
              prop: 'startTime',
              inputType: 'dataPicker',
              span: 12,
            },
            {
              label: '计划完工时间',
              prop: 'endTime',
              inputType: 'dataPicker',
              span: 12,
            },
            {
              label: '监理单位',
              prop: 'supervisionUnit',
              inputType: 'select',
              span: 12,
              options: this.common().supervisionUnitCode,
            },
            {
              label: '监理联系人',
              prop: 'supervisionPeople',
              inputType: 'input',
              span: 12,
            },
            {
              label: '监理联系方式',
              prop: 'supervisionContact',
              inputType: 'input',
              span: 12,
            },
            {
              label: '付款方式',
              prop: 'payType',
              inputType: 'select',
              span: 12,
              options: this.common().paymentType,
              // onChange: (val) => {},
            },
            {
              label: '项目描述',
              prop: 'description',
              inputType: 'input',
              span: 12,
            },
            {
              label: 'ERP编号',
              disabled: true,
              prop: 'erpNumber',
              inputType: 'input',
              span: 12,
            },
            {
              label: '项目描述附件',
              prop: 'projectDescribe',
              disabled: false,
              placeholder: '支持pdf/.jpg/.png格式文件',
              limit: 5,
              accept: '.jpg, .png, .pdf, .jpeg',
              inputType: 'upload',
              params: {
                filePath: 'fileUpload',
                serviceCode: 'selfProject',
              },
              span: 12,
            },
          ],
        },
        {
          title: '关联成本信息',
          formItems: [
            {
              label: '项目预估收入',
              prop: 'estimatedRevenue',
              inputType: 'input',
              span: 12,
            },
            {
              label: '项目成本预算(万元)',
              prop: 'estimatedCost',
              disabled: true,
              inputType: 'inputNumber',
              span: 12,
            },
            {
              label: '预计利润率(%)',
              prop: 'expectedProfitRate',
              inputType: 'inputNumber',
              span: 12,
            },
            {
              label: '预计毛利率(%)',
              prop: 'estimateMarginRate',
              inputType: 'inputNumber',
              span: 12,
            },
            {
              label: '是否有分包费',
              prop: 'hasPackage',
              inputType: 'select',
              span: 12,
              options: this.common().isHas,
              onChange: (val) => {
                this.form = {
                  ...this.form,
                  hasPackage: val,
                };
                this.layout[1].formItems[5].hide = !(val === '1');
                this.formRules.subpackageCost.required = val === '1';
              },
            },
            {
              label: '分包费',
              prop: 'subpackageCost',
              hide: true,
              inputType: 'inputNumber',
              span: 12,
              onChange: (val) => {
                this.form = {
                  ...this.form,
                  subpackageCost: val,
                };
                this.handleChangeAll();
              },
            },
            {
              label: '安全生产费',
              prop: 'safeProductionCost',
              inputType: 'inputNumber',
              span: 12,
              onChange: (val) => {
                this.form = {
                  ...this.form,
                  safeProductionCost: val,
                };
                this.handleChangeAll();
              },
            },
            {
              label: '差旅费',
              prop: 'travelCost',
              inputType: 'inputNumber',
              span: 12,
              onChange: (val) => {
                this.form = {
                  ...this.form,
                  travelCost: val,
                };
                this.handleChangeAll();
              },
            },
            {
              label: '项目人工费',
              prop: 'projectArtificialCost',
              inputType: 'inputNumber',
              span: 12,
              onChange: (val) => {
                this.form = {
                  ...this.form,
                  projectArtificialCost: val,
                };
                this.handleChangeAll();
              },
            },
            {
              label: '房屋租赁及物业管理费',
              prop: 'housesCost',
              inputType: 'inputNumber',
              span: 12,
              onChange: (val) => {
                this.form = {
                  ...this.form,
                  housesCost: val,
                };
                this.handleChangeAll();
              },
            },
            {
              label: '材料费',
              prop: 'materialCost',
              inputType: 'inputNumber',
              span: 12,
              onChange: (val) => {
                this.form = {
                  ...this.form,
                  materialCost: val,
                };
                this.handleChangeAll();
              },
            },
            {
              label: '设备仪表租赁费',
              prop: 'equipmentLeaseCost',
              inputType: 'inputNumber',
              span: 12,
              onChange: (val) => {
                this.form = {
                  ...this.form,
                  equipmentLeaseCost: val,
                };
                this.handleChangeAll();
              },
            },
            {
              label: '公司人工成本费',
              prop: 'companyArtificialCost',
              inputType: 'inputNumber',
              span: 12,
              onChange: (val) => {
                this.form = {
                  ...this.form,
                  companyArtificialCost: val,
                };
                this.handleChangeAll();
              },
            },
            {
              label: '车辆使用费及其他',
              prop: 'carCost',
              inputType: 'inputNumber',
              span: 12,
              onChange: (val) => {
                this.form = {
                  ...this.form,
                  carCost: val,
                };
                this.handleChangeAll();
              },
            },
            {
              label: '折旧与摊销费',
              prop: 'depreciationAmortizeCost',
              inputType: 'inputNumber',
              span: 12,
              onChange: (val) => {
                this.form = {
                  ...this.form,
                  depreciationAmortizeCost: val,
                };
                this.handleChangeAll();
              },
            },
            {
              label: '业务费',
              prop: 'operationCost',
              inputType: 'inputNumber',
              span: 12,
              onChange: (val) => {
                this.form = {
                  ...this.form,
                  operationCost: val,
                };
                this.handleChangeAll();
              },
            },
            {
              label: '办公费',
              prop: 'officeCost',
              inputType: 'inputNumber',
              span: 12,
              onChange: (val) => {
                this.form = {
                  ...this.form,
                  officeCost: val,
                };
                this.handleChangeAll();
              },
            },
            {
              label: '其他费用',
              prop: 'otherCost',
              inputType: 'inputNumber',
              span: 12,
              onChange: (val) => {
                this.form = {
                  ...this.form,
                  otherCost: val,
                };
                this.handleChangeAll();
              },
            },
            {
              label: '通信费',
              prop: 'communicationCost',
              inputType: 'inputNumber',
              span: 12,
              onChange: (val) => {
                this.form = {
                  ...this.form,
                  communicationCost: val,
                };
                this.handleChangeAll();
              },
            },
            {
              label: '税金规费',
              prop: 'taxesCost',
              inputType: 'inputNumber',
              span: 12,
              onChange: (val) => {
                this.form = {
                  ...this.form,
                  taxesCost: val,
                };
                this.handleChangeAll();
              },
            },
          ],
        },
      ],
      // 必填内容
      formRules: {
        name: {
          required: true,
          message: '请输入项目名称',
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
        area: {
          required: true,
          message: '请选择区县',
          trigger: 'blur',
        },
        oneMajor: {
          required: true,
          message: '请选择一级专业',
          trigger: 'blur',
        },
        twoMajor: {
          required: true,
          message: '请选择二级专业',
          trigger: 'blur',
        },
        managerName: {
          required: true,
          message: '请选择项目经理',
          trigger: 'blur',
        },
        deptId: {
          required: true,
          message: '请选择部门',
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
        paymentType: {
          required: true,
          message: '请选择付款方式',
          trigger: 'blur',
        },
        description: {
          required: true,
          message: '请输入项目描述',
          trigger: 'blur',
        },
        projectDescribeUrl: {
          required: true,
          message: '请上传项目描述附件',
          trigger: 'blur',
        },
        hasPackage: {
          required: true,
          message: '请选择是否有分包费',
          trigger: 'blur',
        },
        estimatedRevenue: {
          required: true,
          message: '请输入项目预估收入',
          trigger: 'blur',
        },
        estimateMarginRate: {
          required: true,
          message: '请输入预计毛利率(%)',
          trigger: 'blur',
        },
        payType: {
          required: true,
          message: '请选择付款方式',
          trigger: 'blur',
        },
        subpackageCost: {
          required: true,
          message: '请输入分包费',
          trigger: 'blur',
        },
        marketType: {
          required: true,
          message: '请输入市场类型',
          trigger: 'blur',
        },
      },
      peopleShow: false,
      peopleData: {},
      selectTable: {},
      opportunitySelectionTable: {},
      opportunitySelectionData: {},
      opportunitySelectionShow: false,
      hireFrameWorkShow: false,
      hireFrameWorkData: false,
      hireFrameWorkTable: false,
    };
  },
  mounted() {
    // this.$nextTick(() => {});
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
    // 省份下拉框
    getSelectListByParentCode(province) {
      selectListByParentCode(province).then((res) => {
        if (res && res.code === '200') {
          const cityOptions = res.data.map((item) => ({
            name: item.name,
            id: item.code,
          }));
        }
      });
    },
    // 请求数据
    reqDetail() {
      const { row } = this.data;

      if (row && row.id) {
        detail(row.id).then(async (res) => {
          if (res && res.code === '200') {
            if (res.data.province) {
              await this.setCity(res.data.province);
            }
            if (res.data.city) {
              await this.setArea(res.data.city);
            }
            if (res.data.oneMajor) {
              this.setTwoMajor(res.data.oneMajor);
            }
            this.layout[1].formItems[5].hide = !(res.data.hasPackage === '1');
            this.formRules.subpackageCost.required = res.data.hasPackage === '1';
            this.form = {
              ...this.form,
              ...res.data,
              area: res.data.area.split(','),
              managerName: res.data.manager,
            };
            if (res.data.projectDescribeUrl) {
              this.form = {
                ...this.form,
                projectDescribe: [
                  {
                    fileCode: res.data.projectDescribeUrl,
                    fileName: res.data.fileName,
                  },
                ],
              };
            }
            this.hireFrameWorkTable = {
              contractId: res.data.contractId,
              contractName: res.data.contractName,
            };
            this.opportunitySelectionTable = {
              busiId: res.data.busiId,
              busiName: res.data.busiName,
            };
            // this.layout[0].formItems[6].disabled = true;
            // this.layout[0].formItems[7].disabled = true;
            // this.layout[0].formItems[8].disabled = true;
            // this.layout[0].formItems[9].disabled = true;
            // this.layout[0].formItems[10].disabled = true;
            // this.layout[0].formItems[11].disabled = true;
          }
        });
      }
    },
    // 城市获取
    async setCity(val) {
      this.form = {
        ...this.form,
        province: val,
        city: undefined,
      };
      const options = this.common().provincialCode;
      const findItem = options.filter((option) => option.id === val);

      if (findItem.length === 0) {
        return;
      }
      const city = await this.$getCode(findItem[0].id);

      this.$set(this.layout[0].formItems[7], 'options', city);
    },
    // 区县获取
    async setArea(val) {
      this.form = {
        ...this.form,
        city: val,
        area: undefined,
      };
      const { options } = this.layout[0].formItems[7];
      const findItem = options.filter((option) => option.id === val);

      if (findItem.length === 0) {
        return;
      }
      const area = await this.$getCode(findItem[0].id, 'area');

      this.$set(this.layout[0].formItems[8], 'options', area);
    },
    // 二级专业获取
    async setTwoMajor(val) {
      this.form = {
        ...this.form,
        oneMajor: val,
        twoMajor: undefined,
      };
      const options = this.common().majorCode;
      const findItem = options.filter((option) => option.id === val);

      if (findItem.length === 0) {
        return;
      }

      const twoMajor = await this.$getCode(findItem[0].id);

      this.$set(this.layout[0].formItems[10], 'options', twoMajor);
    },
    // 变更操作
    handleChangeAll() {
      const {
        subpackageCost,
        safeProductionCost,
        travelCost,
        projectArtificialCost,
        housesCost,
        materialCost,
        equipmentLeaseCost,
        companyArtificialCost,
        carCost,
        depreciationAmortizeCost,
        operationCost,
        officeCost,
        otherCost,
        communicationCost,
        taxesCost,
      } = this.form;

      this.form = {
        ...this.form,
        estimatedCost:
          parseFloat(subpackageCost || 0) +
          parseFloat(safeProductionCost || 0) +
          parseFloat(travelCost || 0) +
          parseFloat(projectArtificialCost || 0) +
          parseFloat(housesCost || 0) +
          parseFloat(materialCost || 0) +
          parseFloat(equipmentLeaseCost || 0) +
          parseFloat(companyArtificialCost || 0) +
          parseFloat(carCost || 0) +
          parseFloat(depreciationAmortizeCost || 0) +
          parseFloat(operationCost || 0) +
          parseFloat(officeCost || 0) +
          parseFloat(otherCost || 0) +
          parseFloat(communicationCost || 0) +
          parseFloat(taxesCost || 0),
      };
    },
    submitFormItem() {
      this.$refs.supplyFormItem.submitForm();
    },
    // 修改数据
    changeForm(val) {
      this.form = {
        ...val,
      };
    },
    // 提交数据
    submitForm(val) {
      console.log('this.data', this.data);
      const { configType, row } = this.data;

      let param = {
        ...val,
        area: val.area.join(','),
        contractId: this.hireFrameWorkTable.contractId,
        busiId: this.opportunitySelectionTable.busiId,
      };

      if (val.projectDescribe && val.projectDescribe[0]) {
        param = {
          ...param,
          projectDescribeUrl: val.projectDescribe[0].fileCode,
          fileName: val.projectDescribe[0].fileName,
        };
      }
      let api = addSelf;

      if (configType === 'edit') {
        param = {
          id: row.id,
          ...param,
        };
        api = updateSelf;
      }
      delete param.projectDescribe;
      const message = configType === 'add' ? '新增成功' : '修改成功';

      // 修改自建项目
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
    // 关闭预览
    closeEdit() {
      this.peopleShow = false;
      this.peopleData = {};
    },
    // 成功预览
    successEdit(selectTable) {
      console.log('selectTable', selectTable);
      this.selectTable = selectTable;
      this.form = {
        ...this.form,
        manager: selectTable.username,
        managerName: selectTable.realName,
        managerMobile: selectTable.mobile,
      };
      this.closeEdit();
    },
    // 关闭商机选择
    closeopportunitySelection() {
      this.opportunitySelectionShow = false;
      this.opportunitySelectionData = {};
    },
    // 成功商机选择
    successopportunitySelection(selectTable) {
      console.log('selectTable', selectTable);
      this.opportunitySelectionTable = selectTable;
      // 获取商机详情
      getBusinessOpportunityById(selectTable.id).then(async (res) => {
        if (res && res.code === '200') {
          if (res.data.province) {
            await this.setCity(res.data.province);
          }
          if (res.data.city) {
            await this.setArea(res.data.city);
          }
          if (res.data.oneMajor) {
            this.setTwoMajor(res.data.oneMajor);
          }
          this.form = {
            ...this.form,
            busiId: selectTable.busiId,
            busiName: selectTable.busiName,
            name: res.data.busiName,
            province: res.data.province,
            city: res.data.city,
            oneMajor: res.data.oneMajor,
            twoMajor: res.data.twoMajor,
            manager: res.data.projectManager,
            managerName: res.data.projectManager,
            managerMobile: res.data.mobile,
            deptId: res.data.productionCenter,
            marketType: res.data.marketType,
          };
        }
      });
      this.closeopportunitySelection();
    },
    // 关闭承揽框架
    closehireFrameWork() {
      this.hireFrameWorkShow = false;
      this.hireFrameWorkData = {};
    },
    // 成功选择承揽框架
    async successhireFrameWork(selectTable) {
      this.hireFrameWorkTable = selectTable;
      if (selectTable.provinceId) {
        await this.setCity(selectTable.provinceId);
      }
      let { cityId } = selectTable;

      if (cityId.indexOf(',') > -1) {
        cityId = cityId.split(',')[0];
      }
      if (cityId) {
        await this.setArea(cityId);
      }
      let { majorId } = selectTable;

      if (majorId.indexOf(',') > -1) {
        majorId = majorId.split(',')[0];
      }
      if (majorId) {
        await this.setTwoMajor(majorId);
      }
      this.form = {
        ...this.form,
        contractId: selectTable.contractId,
        contractName: selectTable.contractName,
        consignor: selectTable.consignorId,
        subject: selectTable.subjectId,
        province: selectTable.provinceId,
        city: cityId,
        oneMajor: majorId,
        name: selectTable.contractName,
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
#selfBaseInfo {
}
</style>
