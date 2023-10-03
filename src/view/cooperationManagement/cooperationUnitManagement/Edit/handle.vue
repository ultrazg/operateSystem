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
    <wrapper title="单位资质信息">
      <otherBtnList style="margin-bottom: 12px">
        <ul class="flexRow">
          <li
            v-for="(item, index) in otherBtnLists"
            :key="index"
            class="flexCenter"
            @click="
              () => {
                item.click();
              }
            "
          >
            <span>{{ item.label }}</span>
          </li>
        </ul>
      </otherBtnList>
      <page-table
        ref="pageTable"
        col-align="left"
        operator-width="90"
        :data="tableData"
        :cols="tableCols"
        :operator="true"
        :showPage="false"
      >
        <template slot-scope="scope" slot="operator">
          <flex>
            <el-button
              type="text"
              size="small"
              title="编辑"
              icon="iconfont icon-bianji"
              @click.prevent.stop="
                tableAction('edit', {
                  index: scope.index,
                  type: 'edit',
                  data: scope.row,
                })
              "
            >
              编辑
            </el-button>
            <el-button
              type="text"
              size="small"
              title="删除"
              icon="iconfont icon-shanchu"
              @click.prevent.stop="
                tableAction('del', {
                  index: scope.index,
                  data: scope.row,
                })
              "
            >
              删除
            </el-button>
          </flex>
        </template>
      </page-table>
    </wrapper>

    <qualification-index
      :show="editshow"
      :data="editdata"
      @cancel="closeEdit"
      @success="successEdit"
    ></qualification-index>
  </div>
</template>

<script>
import FormItem from '@/components/formItem';
import Wrapper from '@/components/wrapper';
import PageTable from '@/components/page-table';
import Flex from '@/components/flex';
import otherBtnList from '@/components/headerTitle/otherBtnList';
import QualificationIndex from './qualificationIndex.vue';
import {
  getCooperationUnitByName,
  getCooperationUnitById,
  updateCooperationUnit,
  saveCooperationUnit,
} from '@/api/cooperationUnitManagement/index';

export default {
  name: 'baseInfo',
  components: {
    FormItem,
    Wrapper,
    PageTable,
    Flex,
    otherBtnList,
    QualificationIndex,
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
        type: '单位',
      },
      layout: [
        {
          title: '合作单位基础数据',
          formItems: [
            {
              label: '单位名称',
              prop: 'name',
              inputType: 'input',
              span: 12,
            },
            {
              label: '识别码',
              prop: 'identificationCode',
              inputType: 'input',
              span: 12,
            },
            {
              label: '注册资金',
              prop: 'registerCapital',
              inputType: 'input',
              span: 12,
            },
            {
              label: '法人',
              prop: 'legalPerson',
              inputType: 'input',
              span: 12,
            },
            {
              label: '联系人',
              prop: 'contactsPeople',
              inputType: 'input',
              span: 12,
            },
            {
              label: '联系电话',
              prop: 'tel',
              inputType: 'input',
              span: 12,
            },
            {
              label: '开户行',
              prop: 'bank',
              inputType: 'input',
              span: 12,
            },
            {
              label: '开户账号',
              prop: 'bankCode',
              inputType: 'input',
              span: 12,
            },
            {
              label: '注册地址',
              prop: 'registerAddress',
              inputType: 'input',
              span: 12,
            },
            {
              label: '办公地址',
              prop: 'officeAddress',
              inputType: 'input',
              span: 12,
            },
            {
              label: '合作级别',
              prop: 'level',
              inputType: 'select',
              span: 12,
              options: this.common().cooperationLevelCode,
              onChange: (val) => {
                this.form.level = val;
              },
            },
            {
              label: '备案人员数量',
              prop: 'userNumber',
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
              label: '合作方编码',
              prop: 'partnerCode',
              inputType: 'input',
              span: 12,
            },
          ],
        },
      ],
      tableData: [],
      tableCols: [
        {
          label: '资质类型',
          prop: 'type',
        },
        {
          label: '颁发机构',
          prop: 'qualificationsMechanism',
        },
        {
          label: '资质名称',
          prop: 'qualificationsName',
        },
        {
          label: '资质编码',
          prop: 'qualificationsCode',
        },
        {
          label: '开始时间',
          prop: 'sDate',
        },
        {
          label: '结束时间',
          prop: 'eDate',
        },
        {
          label: '附件名称',
          prop: 'fileName',
          render: (h, scope) => {
            const d = scope.row;
            const fileHref = `http://localhost:3000/${d.filePath}`;
            // test filepath
            // const fileHref = 'http://localhost:3000/api/fileupload/download?fileCode=de51f1f544464f9284a05bf535d53a66';

            return (
              <div>
                {
                  <el-link class="attachment" href={fileHref} target="_blank">
                    {d.fileName}
                  </el-link>
                }
              </div>
            );
          },
        },
      ],
      formRules: {
        name: {
          required: true,
          message: '请输入名称',
          trigger: 'blur',
        },
        identificationCode: {
          required: true,
          message: '请输入识别码',
          trigger: 'blur',
        },
        bank: {
          required: true,
          message: '请输入开户行',
          trigger: 'blur',
        },
        bankCode: {
          required: true,
          message: '请输入开户账号',
          trigger: 'blur',
        },
        legalPerson: {
          required: true,
          message: '请输入法人',
          trigger: 'blur',
        },
        level: {
          required: true,
          message: '请输入合作级别',
          trigger: 'blur',
        },
        registerCapital: {
          required: true,
          message: '请输入注册资金',
          trigger: 'blur',
        },
        registerAddress: {
          required: true,
          message: '请输入注册地址',
          trigger: 'blur',
        },
        officeAddress: {
          required: true,
          message: '请输入办公地址',
          trigger: 'blur',
        },
      },
      otherBtnLists: [
        {
          label: '新增',
          click: () => this.addQualification(),
        },
      ],

      levelOptions: [], // 级别选项

      editshow: false,
      editdata: {},
      editUnitQlicas: [], // 传递的单位资质信息
    };
  },
  watch: {
    data: {
      immediate: true,
      deep: true,
      handler(val) {
        if (val) {
          console.log('val', val);
          this.inputDisabled = val.configType === 'detail';
          this.isEdit = ['add', 'edit'].includes(val.configType);
          this.isAdd = ['add'].includes(val.configType);
          if (!this.isAdd) {
            this.reqDetail();
          }
        }
      },
    },
  },
  methods: {
    reqDetail() {
      const { row } = this.data;
      const { name, id } = row;

      console.log(row);

      if (row && row.id) {
        if (row.level) {
          const levelItem = this.common().cooperationLevelCode.filter((option) => option.id === row.level);

          const level = levelItem && levelItem[0] && levelItem[0].id;

          // console.log(level);
          row.level = level;
        }

        //   row.level = level;
        //   // this.levelOptions = this.common().cooperationLevelCode;
        //   // this.levelOptions.forEach((item) => {
        //   //   if (row.level === item.name) {
        //   //     row.level = item.id;
        //   //   }
        //   // });
        // }
        this.form = {
          ...this.form,
          ...row,
        };
        // 获取单位详情
        getCooperationUnitById(row.id).then((res) => {
          if (res && res.code === '200') {
            const { cooperationQlicationDtoList } = res.data;

            this.tableData = [...cooperationQlicationDtoList];
            this.form = {
              ...this.form,
              ...res.data,
            };
            // console.log(this.tableData);
          }
        });
      }

      // const findItem = this.common().provincialCode.filter((option) => option.name.includes(row.province));

      // if (findItem) {
      //   const province = findItem[0].id;

      //   this.form.province = province;
      //   this.getCityInfo(province, true, row);
      // }
    },
    submitFormItem() {
      this.$refs.supplyFormItem.submitForm();
    },
    submitForm(val) {
      console.log('this.data', this.data);
      console.log('this.val', val);

      const { configType, row } = this.data;
      const id = configType === 'add' ? '' : this.form.id;
      const editUnitQlicas = this.editUnitQlicas === [] ? this.tableData : this.editUnitQlicas;
      const param = {
        id,
        name: val.name,
        identificationCode: val.identificationCode,
        registerCapital: val.registerCapital,
        legalPerson: val.legalPerson,
        contactsPeople: val.contactsPeople,
        tel: val.tel,
        bank: val.bank,
        bankCode: val.bankCode,
        registerAddress: val.registerAddress,
        officeAddress: val.officeAddress,
        level: val.level,
        userNumber: val.userNumber,
        remark: val.remark,
        editUnitQlicas: this.tableData,
      };
      const message = '处理成功';

      console.log(param);

      if (configType === 'edit') {
        updateCooperationUnit(param).then((res) => {
          if (res && res.code === '200') {
            this.$notify({
              title: '成功',
              message,
              type: 'success',
              position: 'bottom-right',
            });
            this.$emit('success');
          } else {
            this.$emit('success');
          }
        });
      } else if (configType === 'add') {
        Reflect.deleteProperty(param, 'id');
        Reflect.deleteProperty(param, 'editUnitQlicas');
        param.addUnitQlicas = this.tableData; // 重命名参数

        saveCooperationUnit(param).then((res) => {
          if (res && res.code === '200') {
            this.$notify({
              title: '成功',
              message,
              type: 'success',
              position: 'bottom-right',
            });
            this.$emit('success');
          } else {
            this.$emit('success');
          }
        });
      }
    },
    // closeEdit() {
    //   this.peopleShow = false;
    //   this.peopleData = {};
    // },
    successEdit(editUnitQlicas) {
      console.log('editUnitQlicas', editUnitQlicas);
      if (editUnitQlicas.index !== null && editUnitQlicas.index !== undefined) {
        this.tableData[editUnitQlicas.index] = {
          ...this.tableData[editUnitQlicas.index],
          ...editUnitQlicas,
        };
        this.tableData.splice(1, 0);
      } else {
        this.editUnitQlicas.push(editUnitQlicas);
        this.tableData.push(editUnitQlicas);
        this.tableData.splice(1, 0);
      }
      // this.form.nextAuditPeople = selectTable.realName;
      this.closeEdit();
    },
    cancelForm() {
      this.form = {};
      this.cooperateForm = {};
      this.$refs.supplyFormItem.cancelForm();
    },

    tableAction(type, row) {
      console.log('row', row);
      if (type === 'edit') {
        this.editshow = true;
        this.editdata = row;
      } else if (type === 'del') {
        console.log('del');
        this.$confirm('确定删除单位资质信息?', '信息', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(() => {
          this.tableData = [];
        });
      }
    },

    // 新增合作单位资质
    addQualification() {
      console.log('addQualification');
      this.tableAction('edit', {
        type: 'edit',
        data: {},
      });
    },

    // 预览
    // openDialog(state, info = {}) {
    //   this.editshow = true;
    //   this.editdata = info;
    // },
    // 关闭预览
    closeEdit() {
      this.editshow = false;
      this.editdata = {};
    },
  },
};
</script>

<style lang="less" scoped>
#handle {
  .comp-page-table {
    min-height: unset;
  }
}
</style>
