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
import {
  getProjectApproval,
  saveProjectApproval,
  updateProjectApproval,
  getBusinessOpportunityById,
} from '@/api/marketMiddleStage/projectApprovalManagement';
export default {
  name: 'baseInfo',
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
        productionCenter: undefined,
        manager: undefined,
        marketType: undefined,
        purchaseModality: undefined,
        tenderResult: undefined,
        bondIsCancel: undefined,
        subject: this.common().subjectCode[0].id,
      },
      // 协作-立项申请
      layout: [
        {
          title: ['add'].includes(configType) ? '立项申请' : '查看立项申请',
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
              label: '委托方',
              prop: 'consignor',
              inputType: 'select',
              span: 12,
              filterable: true,
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
              label: '项目名称',
              prop: 'name',
              inputType: 'input',
              span: 12,
            },
            {
              label: '建设方式',
              prop: 'constructionMode',
              inputType: 'select',
              span: 12,
              options: this.common().constructionModeCode,
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
              multiple: true,
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
              label: '预估收入(含税)',
              prop: 'estimatedRevenue',
              inputType: 'input',
              span: 12,
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
              label: '部门',
              prop: 'deptId',
              inputType: 'select',
              span: 12,
              options: this.common().deptIdCode,
            },
            {
              label: '预估成本(含税)',
              prop: 'estimatedCost',
              inputType: 'input',
              span: 12,
            },
            {
              label: '计划开工',
              prop: 'startTime',
              inputType: 'dataPicker',
              span: 12,
            },
            {
              label: '计划完工',
              prop: 'endTime',
              inputType: 'dataPicker',
              span: 12,
            },
            {
              label: '设计单位',
              prop: 'designUnit',
              inputType: 'select',
              span: 12,
              options: this.common().designUnitCode,
            },
            {
              label: '建设经理',
              prop: 'constructManager',
              inputType: 'input',
              span: 12,
            },
            {
              label: '经理电话',
              prop: 'constructManagerContact',
              inputType: 'input',
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
              label: '备注',
              prop: 'remark',
              inputType: 'input',
              span: 12,
            },
            {
              label: '描述',
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
          ],
        },
      ],
      // 必填内容
      formRules: {
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
        name: {
          required: true,
          message: '请输入项目名称',
          trigger: 'blur',
        },
        constructionMode: {
          required: true,
          message: '请选择建设方式',
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
        estimatedRevenue: {
          required: true,
          message: '请输入预估收入',
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
        estimatedCost: {
          required: true,
          message: '请输入预估成本',
          trigger: 'blur',
        },
        marketType: {
          required: true,
          message: '请选择市场类型',
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
    // 获取选择列表
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
        getProjectApproval(row.id).then(async (res) => {
          if (res && res.code === '200') {
            if (res.data.province) {
              await this.setCity(res.data.province);
            }
            if (res.data.city) {
              await this.setArea(res.data.city);
            }

            if (res.data.oneMajor) {
              await this.setTwoMajor(res.data.oneMajor);
            }
            this.form = {
              ...this.form,
              ...res.data,
              area: res.data.area.split(','),
              managerName: res.data.manager,
            };
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
    // 城市编码
    async setCity(val, cityId) {
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
      let city = await this.$getCode(findItem[0].id);

      if (cityId) {
        const cityArray = cityId.split(',');

        city = city.filter((cityItem) => cityArray.includes(cityItem.id));
      }
      this.$set(this.layout[0].formItems[7], 'options', city);
    },
    // 区县编码
    async setArea(val, cityId) {
      let cityVal = val;

      if (cityId) {
        cityVal = cityId.split(',')[0];
      }
      this.form = {
        ...this.form,
        city: cityVal,
        area: undefined,
      };
      const { options } = this.layout[0].formItems[7];
      const findItem = options.filter((option) => option.id === cityVal);

      if (findItem.length === 0) {
        return;
      }
      const area = await this.$getCode(findItem[0].id, 'area');

      this.$set(this.layout[0].formItems[8], 'options', area);
    },
    // 二级专业
    async setTwoMajor(val) {
      let oneMajor = val;

      if (oneMajor.indexOf(',') > -1) {
        oneMajor = oneMajor.split(',')[0];
      }
      this.form = {
        ...this.form,
        oneMajor,
        twoMajor: undefined,
      };
      const options = this.common().majorCode;
      const findItem = options.filter((option) => option.id === oneMajor);

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
        id: row.id,
        ...val,
        area: val.area.join(','),
        contractId: this.hireFrameWorkTable.contractId,
        busiId: this.opportunitySelectionTable.busiId,
      };

      let api = updateProjectApproval;

      // 保存立项申请
      if (configType === 'add') {
        param = {
          ...val,
          area: val.area.join(','),
        };
        api = saveProjectApproval;
      }
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
    // 取消
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
      };
      // this.form.manager = selectTable.username;
      // this.form.managerName = selectTable.realName;
      this.closeEdit();
    },
    // 关闭机会选择
    closeopportunitySelection() {
      this.opportunitySelectionShow = false;
      this.opportunitySelectionData = {};
    },
    // 成功选择商机
    successopportunitySelection(selectTable) {
      this.opportunitySelectionTable = selectTable;
      getBusinessOpportunityById(selectTable.id).then(async (res) => {
        if (res && res.code === '200') {
          if (res.data.province) {
            await this.setCity(res.data.province);
          }
          if (res.data.city) {
            await this.setArea(res.data.city);
          }
          if (res.data.oneMajor) {
            await this.setTwoMajor(res.data.oneMajor);
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
            deptId: res.data.productionCenter,
            marketType: res.data.marketType,
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
    // 成功选择承揽框架
    async successhireFrameWork(selectTable) {
      this.hireFrameWorkTable = selectTable;
      console.log('selectTable', selectTable);
      if (selectTable.provinceId) {
        await this.setCity(selectTable.provinceId, selectTable.cityId);
      }
      if (selectTable.city) {
        await this.setArea(selectTable.city, selectTable.cityId);
      }
      if (selectTable.oneMajor) {
        await this.setTwoMajor(selectTable.oneMajor);
      }
      this.form = {
        ...this.form,
        contractId: selectTable.contractId,
        contractName: selectTable.contractName,
        consignor: selectTable.consignorId,
        subject: selectTable.subjectId,
        province: selectTable.provinceId,
        city: selectTable.cityId.split(',')[0],
        oneMajor: selectTable.majorId.split(',')[0],
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
#base {
}
</style>
