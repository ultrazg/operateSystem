<template>
  <div id="Edit">
    <FormItem
      ref="supplyFormItem"
      :layout="layout"
      :rules="formRules"
      :disabled="inputDisabled"
      :isEdit="isEdit"
      :form.sync="form"
      @submit="submitForm"
    />
    <import-info ref="importInfo" :data="fileData" @sendFileData="sendFileData"></import-info>
  </div>
</template>

<script>
import FormItem from '@/components/formItem';
import ImportInfo from './import.vue';
import { updateCooperationUnit } from '@/api/cooperationUnitManagement/index';

export default {
  name: 'qualificationEdit',
  components: {
    FormItem,
    ImportInfo,
  },
  props: {
    show: Boolean,
    qualificationData: {},
  },
  inject: ['common'],
  data() {
    const { configType } = this.qualificationData;

    return {
      /** 输入禁用 */
      inputDisabled: configType === 'detail',
      isEdit: ['add', 'edit'].includes(configType),
      isAdd: ['add'].includes(configType),
      form: {
        type: '单位',
      },
      layout: [
        {
          title: '单位资质信息',
          formItems: [
            {
              label: '资质类型',
              prop: 'type',
              inputType: 'input',
              span: 12,
              disabled: true,
            },
            {
              label: '颁发机构',
              prop: 'qualificationsMechanism',
              inputType: 'input',
              span: 12,
            },
            {
              label: '资质名称',
              prop: 'qualificationsName',
              inputType: 'input',
              span: 12,
            },
            {
              label: '资质编码',
              prop: 'qualificationsCode',
              inputType: 'input',
              span: 12,
            },
            {
              label: '开始时间',
              prop: 'sDate',
              inputType: 'dataPicker',
              span: 12,
            },
            {
              label: '结束时间',
              prop: 'eDate',
              inputType: 'dataPicker',
              span: 12,
            },
          ],
        },
      ],
      formRules: {
        // type: {
        //   required: true,
        //   message: '请输入名称',
        //   trigger: 'blur',
        // },
        qualificationsMechanism: {
          required: true,
          message: '请输入名称',
          trigger: 'blur',
        },
        qualificationsName: {
          required: true,
          message: '请输入名称',
          trigger: 'blur',
        },
        qualificationsCode: {
          required: true,
          message: '请输入名称',
          trigger: 'blur',
        },
        sDate: {
          required: true,
          message: '请输入名称',
          trigger: 'blur',
        },
        eDate: {
          required: true,
          message: '请输入名称',
          trigger: 'blur',
        },
      },
      otherBtnLists: [
        {
          label: '新增',
          click: () => this.addQualification(),
        },
      ],
      editUnitQlicas: {}, // 单位资质参数对象
      fileData: [],
      // cooperationQlicationDtoList: [],
    };
  },
  watch: {
    qualificationData: {
      immediate: true,
      handler(val) {
        if (val) {
          console.log('val', val);
          this.inputDisabled = val.type === 'detail';
          this.isEdit = ['add', 'edit'].includes(val.type);
          this.isAdd = ['add'].includes(val.type);
          if (!this.isAdd) {
            this.reqDetail();
          }
        }
      },
    },
  },
  methods: {
    reqDetail() {
      const { data } = this.qualificationData;

      // const { name } = row;

      // return;

      if (data && data.qualificationsName) {
        this.form = {
          ...this.form,
          ...data,
        };
        if (data.fileName && data.fileCode) {
          this.fileData = [
            {
              name: data.fileName,
              status: '上传成功',
              uid: data.uid,
              size: data.size,
            },
          ];
        }
      }

      // // 获取单位详情
      // getCooperationUnitByName(name).then((res) => {
      //   console.log(res);
      //   if (res.code === '200') {
      //     const { cooperationQlicationDtoList } = res.data;

      //     this.tableData = [...cooperationQlicationDtoList];
      //     // console.log(data, total);
      //     // this.tableData = data;
      //     // this.page.total = total;
      //   }
      // });
    },
    submitFormItem() {
      this.$refs.supplyFormItem.submitForm();
    },
    submitForm(val) {
      // console.log('this.qualificationData', this.qualificationData);
      // console.log(val.type, val.qualificationsMechanism, val.qualificationsName);
      // const { configType, row } = this.data;

      this.editUnitQlicas = {
        ...this.editUnitQlicas,
        index: this.qualificationData.index,
        type: val.type,
        qualificationsMechanism: val.qualificationsMechanism,
        qualificationsName: val.qualificationsName,
        qualificationsCode: val.qualificationsCode,
        sDate: val.sDate,
        eDate: val.eDate,
      };
      // console.log(this.editUnitQlicas);
      this.$emit('getUnitQlicasData', this.editUnitQlicas);
      // debugger;

      // const param = {
      //   editUnitQlicas: {
      //     qualificationsType: val.qualificationsType,
      //     qualificationsMechanism: val.qualificationsMechanism,
      //     qualificationsName: val.qualificationsName,
      //     qualificationsCode: val.qualificationsCode,
      //     sDate: val.sDate,
      //     eDate: val.eDate,
      //   },
      // };
      // const message = '处理成功';

      // return;
    },
    // closeEdit() {
    //   this.peopleShow = false;
    //   this.peopleData = {};
    // },
    successEdit(selectTable) {
      console.log('selectTable', selectTable);
      this.selectTable = selectTable;
      // this.form.nextAuditPeople = selectTable.realName;
      this.closeEdit();
    },
    cancelForm() {
      this.form = {};
      this.cooperateForm = {};
      this.fileData = [];
      this.$refs.supplyFormItem.cancelForm();
    },

    tableAction(type, row) {
      console.log('row', row);
      if (type === 'del') {
        console.log('del');
      }
    },

    // 新增合作单位资质
    addQualification() {
      console.log('addQualification');
    },

    sendFileData(data) {
      console.log(data);
      this.editUnitQlicas.size = data.size;
      this.editUnitQlicas.uid = data.uid;
      this.editUnitQlicas.fileCode = data.fileCode;
      this.editUnitQlicas.fileName = data.fileName;
    },
  },
};
</script>

<style lang="less" scoped>
#Edit {
}
</style>
