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
    <import-info ref="importInfo" @sendFileData="sendFileData"></import-info>

    <cooperation-units :show="unitShow" :data="unitData" @cancel="closeEdit" @success="successEdit" />
  </div>
</template>

<script>
import FormItem from '@/components/formItem';
import ImportInfo from '../../cooperationUnitManagement/Edit/import.vue';
import cooperationUnits from '@/view/common/cooperationUnits';
import {
  updateCooperationQlication,
  getCooperationQlicationById,
  saveCooperationQlication,
} from '@/api/cooperationUnitManagement/index';
import { selectListByParentCode } from '@/api/common';

export default {
  name: 'handleInfo',
  components: {
    FormItem,
    ImportInfo,
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
      action: '/api/cooperationQlication/page/detail',
      /** 输入禁用 */
      inputDisabled: configType === 'detail',
      isEdit: ['add', 'edit'].includes(configType),
      isAdd: ['add'].includes(configType),
      form: {},
      layout: [
        {
          title: '人员资质信息',
          formItems: [
            {
              label: '资质名称',
              inputType: 'input',
              span: 12,
              prop: 'qualificationsName',
            },
            {
              label: '合作信息',
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
              label: '发证机构',
              inputType: 'input',
              span: 12,
              prop: 'qualificationsMechanism',
            },
            {
              label: '证书编码',
              inputType: 'input',
              span: 12,
              prop: 'qualificationsCode',
            },
            {
              label: '人员省份',
              prop: 'userProvince',
              inputType: 'select',
              span: 12,
              options: this.common().provincialCode,
              onChange: (val) => {
                this.setCity(val);
              },
            },
            {
              label: '人员城市',
              prop: 'userCityList',
              inputType: 'select',
              multiple: true,
              span: 12,
              options: [],
              onChange: (val) => {
                this.form = {
                  ...this.form,
                  userCity: [...val],
                };
              },
            },
            {
              label: '报备省份',
              prop: 'quotedProvince',
              inputType: 'select',
              span: 12,
              options: this.common().provincialCode,
              onChange: (val) => {
                this.setCity(val, true);
              },
            },
            {
              label: '报备城市',
              prop: 'quotedCityList',
              inputType: 'select',
              multiple: true,
              span: 12,
              options: [],
              onChange: (val) => {
                this.form = {
                  ...this.form,
                  quotedCity: [...val],
                };
              },
            },
            {
              label: '持证人员',
              inputType: 'input',
              span: 12,
              prop: 'people',
            },
            {
              label: '身份证号码',
              inputType: 'input',
              span: 12,
              prop: 'code',
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
        // this.reqDetail();
        this.getCooperationQlication();
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
    async setCity(province, isQuotedProvince) {
      const options = this.common().provincialCode;
      const findItem = options.filter((option) => option.id === province);

      // eslint-disable-next-line no-negated-condition
      if (!isQuotedProvince) {
        this.form = {
          ...this.form,
          userProvince: findItem[0].id,
          userCity: undefined,
        };
        const city = await this.$getCode(findItem[0].id);

        console.log('city', city);
        this.$set(this.layout[0].formItems[5], 'options', city);
      } else {
        this.form = {
          ...this.form,
          quotedProvince: findItem[0].id,
          quotedCity: undefined,
        };
        const city = await this.$getCode(findItem[0].id);

        console.log('city', city);
        this.$set(this.layout[0].formItems[7], 'options', city);
      }

      console.log(this.layout);
    },
    // 获取资质详情
    getCooperationQlication() {
      const { row } = this.data;

      getCooperationQlicationById(row.id).then((res) => {
        if (res && res.code === '200') {
          this.form = {
            ...this.form,
            ...res.data,
            userCity: [res.data.userCity],
            quotedCity: [res.data.quotedCity],
          };
          console.log(res.data.userProvince);

          if (Boolean(res.data.userProvince)) {
            this.getSelectListByParentCode(res.data.userProvince);
          }
          if (Boolean(res.data.quotedProvince)) {
            this.getSelectListByParentCode(res.data.quotedProvince, true);
          }
        }
      });
    },
    getSelectListByParentCode(province, isQuotedProvince) {
      selectListByParentCode(province).then((res) => {
        if (res && res.code === '200') {
          const cityOptions = res.data.map((item) => ({
            name: item.name,
            id: item.code,
          }));

          // eslint-disable-next-line no-negated-condition
          if (!isQuotedProvince) {
            this.layout[0].formItems[5].options = cityOptions;
          } else {
            this.layout[0].formItems[7].options = cityOptions;
          }

          console.log(this.layout);
          // debugger;
        }
      });
    },
    submitFormItem() {
      this.$refs.supplyFormItem.submitForm();
    },
    submitForm(val) {
      const { configType } = this.data;
      const { userCity, quotedCity, ...newVal } = val;

      console.log('this.data', this.data);
      console.log('this.val', val);

      const param = {
        userCityList: val.userCity,
        quotedCityList: val.quotedCity,
        ...newVal,
      };

      console.log(param);

      // return;

      if (configType === 'edit') {
        updateCooperationQlication(param).then((res) => {
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
        saveCooperationQlication(param).then((res) => {
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
      this.form = {
        ...this.form,
        unitName: selectTable.unitName,
        unitId: selectTable.id,
      };
      // this.form.unitName = selectTable.unitName;
      // this.form.unitId = selectTable.id;
      // this.form = { ...this.form };
      this.closeEdit();
    },

    sendFileData(data) {
      console.log(data);
      this.form.fileCode = data.fileCode;
      this.form.fileName = data.fileName;
    },
  },
  created() {
    if (this.isAdd === false) {
      // this.reqDetail();
      this.getCooperationQlication();
    }
  },
};
</script>

<style lang="less" scoped>
#handle {
}
</style>
