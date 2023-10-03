<template>
  <div id="selfBaseInfo">
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
    <cooperationUnits :show="unitShow" :data="unitData" @cancel="closeUnitEdit" @success="successUnitEdit" />
  </div>
</template>

<script>
import FormItem from '@/components/formItem';
import nextAuditPeople from '@/view/common/nextAuditPeople.vue';
import opportunitySelection from '@/view/common/opportunitySelection';
import hireFrameWorkSelect from '@/view/common/hireFrameWorkSelect';
import cooperationUnits from '@/view/common/cooperationUnits';
import { selectListByParentCode } from '@/api/common';
import { addSelf, updateSelf } from '@/api/marketMiddleStage/projectApprovalManagement/oneSelf';
import { selfContractList } from '@/api/marketMiddleStage/contractList';
import { getBusinessOpportunityById } from '@/api/marketMiddleStage/projectApprovalManagement';
export default {
  name: 'selfBaseInfo',
  components: {
    FormItem,
    nextAuditPeople,
    opportunitySelection,
    hireFrameWorkSelect,
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
      form: {},
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
          title: '合作单位信息',
          formItems: [
            {
              label: '合作单位',
              prop: 'unitName',
              inputType: 'input',
              span: 12,
            },
            {
              label: '合作框架',
              prop: 'contractId',
              inputType: 'input',
              span: 12,
            },
            {
              label: '省份',
              prop: 'unitProvince',
              inputType: 'select',
              span: 12,
              options: this.common().provincialCode,
              onChange: (val) => {
                this.setUnitCity(val);
              },
            },
            {
              label: '城市',
              prop: 'unitCity',
              inputType: 'select',
              multiple: true,
              span: 12,
              options: [],
              onChange: (val) => {
                this.form = {
                  ...this.form,
                  unitCity: val,
                };
              },
            },
            {
              label: '一级专业',
              prop: 'oneMajor',
              inputType: 'select',
              span: 12,
              options: this.common().majorCode,
            },
            {
              label: '合作比例',
              prop: 'ratio',
              inputType: 'input',
              span: 12,
            },
            {
              label: '预估比例',
              prop: 'estimate',
              inputType: 'input',
              span: 12,
            },
            {
              label: '有效日期起',
              prop: 'signDate',
              inputType: 'dataPicker',
              span: 12,
            },
            {
              label: '有效日期止',
              prop: 'signDate',
              inputType: 'dataPicker',
              span: 12,
            },
            {
              label: '实际合作比例(0-1)',
              prop: 'ratio',
              inputType: 'inputNumber',
              min: 0,
              max: 1,
              span: 12,
            },
          ],
        },
        {
          title: '合同信息',
          formItems: [
            {
              label: '合同类型',
              prop: 'contractType',
              inputType: 'select',
              span: 12,
              options: this.common().contractTypeCode,
            },
            {
              label: '合同名称',
              prop: 'contractName',
              inputType: 'input',
              span: 12,
            },
            {
              label: '合同编号',
              prop: 'contractNo',
              inputType: 'input',
              span: 12,
            },
            {
              label: '合作框架',
              prop: 'frameworkId',
              inputType: 'input',
              span: 12,
              // 合作框架选择
              onFocus: (val) => {
                this.unitData = {
                  ...this.data,
                  ...this.form,
                };
                this.unitShow = true;
              },
            },
            {
              label: '合作单位',
              prop: 'unitName',
              inputType: 'input',
              disabled: true,
              span: 12,
            },
            {
              label: '省份',
              prop: 'unitProvince',
              inputType: 'select',
              disabled: true,
              options: this.common().provincialCode,
              span: 12,
            },
            {
              label: '城市',
              prop: 'unitCity',
              inputType: 'select',
              options: [],
              multiple: true,
              disabled: true,
              span: 12,
            },
            {
              label: '一级专业',
              prop: 'oneMajor',
              inputType: 'select',
              disabled: true,
              options: this.common().majorCode,
              span: 12,
            },
            {
              label: '合作比例',
              prop: 'ratio',
              inputType: 'input',
              disabled: true,
              span: 12,
            },
            {
              label: '合同总金额(含税)',
              prop: 'contractAll',
              inputType: 'input',
              disabled: true,
              span: 12,
            },
            {
              label: '合同总金额(不含税)',
              prop: 'contractAllNoTax',
              inputType: 'input',
              disabled: true,
              span: 12,
            },
          ],
        },
      ],
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
      unitData: {},
      unitShow: false,
      selectUnitTable: {},
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
        // 获取自建详情
        selfContractList(row.id).then(async (res) => {
          if (res && res.code === '200' && res.data) {
            if (res.data.oneMajor) {
              await this.setTwoMajor(res.data.oneMajor);
            }
            if (res.data.province) {
              await this.setCity(res.data.province);
            }
            if (res.data.city) {
              await this.setArea(res.data.city);
            }
            if (res.data.unitProvince) {
              await this.setUnitCity(res.data.unitProvince);
            }
            this.form = {
              ...this.form,
              ...res.data,
              unitCity: res.data.unitCity.split(','),
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
          }
        });
      }
    },
    // 获取城市
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
    async setUnitCity(val) {
      this.form = {
        ...this.form,
        unitProvince: val,
        unitCity: undefined,
      };
      const options = this.common().provincialCode;
      const findItem = options.filter((option) => option.id === val);

      if (findItem.length === 0) {
        return;
      }
      const city = await this.$getCode(findItem[0].id);

      this.$set(this.layout[1].formItems[3], 'options', city);
      this.$set(this.layout[2].formItems[6], 'options', city);
    },
    // 获取区县
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
    // 获取二级专业
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
    submitFormItem() {
      this.$refs.supplyFormItem.submitForm();
    },
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

      // 新增自建项目
      if (configType === 'edit') {
        param = {
          id: row.id,
          ...param,
        };
        api = updateSelf;
      }
      delete param.projectDescribe;
      const message = configType === 'add' ? '新增成功' : '修改成功';

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
      // 获取商机
      getBusinessOpportunityById(selectTable.id).then((res) => {
        if (res && res.code === '200') {
          if (res.data.province) {
            this.setCity(res.data.province);
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
          };
        }
      });
      this.closeopportunitySelection();
    },
    // 关闭承揽框架选择
    closehireFrameWork() {
      this.hireFrameWorkShow = false;
      this.hireFrameWorkData = {};
    },
    // 成功承揽框架选择
    successhireFrameWork(selectTable) {
      this.hireFrameWorkTable = selectTable;
      console.log('selectTable', selectTable);
      if (selectTable.provinceId) {
        this.setCity(selectTable.provinceId);
      }
      if (selectTable.oneMajor) {
        this.setTwoMajor(selectTable.oneMajor);
      }
      this.form = {
        ...this.form,
        contractId: selectTable.contractId,
        contractName: selectTable.contractName,
        consignor: selectTable.consignorId,
        subject: selectTable.subjectId,
        province: selectTable.provinceId,
        city: selectTable.cityId,
        oneMajor: selectTable.majorId,
        name: selectTable.contractName,
      };
      this.closehireFrameWork();
    },
    // 关闭合作预览
    closeUnitEdit() {
      this.unitShow = false;
      this.unitData = {};
    },
    // 成功合作预览
    successUnitEdit(selectUnitTable) {
      this.selectUnitTable = selectUnitTable;
      this.form = {
        ...this.form,
        unitName: selectUnitTable.unitName,
        frameworkId: selectUnitTable.contractNo,
        province: selectUnitTable.province,
        city: selectUnitTable.city,
        oneMajor: selectUnitTable.oneMajor,
        ratio: selectUnitTable.ratio,
      };
      this.closeUnitEdit();
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
