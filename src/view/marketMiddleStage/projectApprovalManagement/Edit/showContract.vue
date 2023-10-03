<template>
  <!--展示合同详情-->
  <dialog-cont
    @on-cancel="canceledit('cancel')"
    @on-close="canceledit('close')"
    @on-confirm="confirmedit"
    @on-open="openedit"
    appendToBody
    :title="`${title}`"
    width="950px"
    :visible.sync="dialogShow"
    :confirmShow="!inputDisabled"
    :customClass="'showContract'"
    ref="dialog"
  >
    <div class="scrollView" :style="{ height: scrollHeight }">
      <FormItem
        ref="supplyFormItem"
        :layout="layout"
        :rules="formRules"
        :disabled="inputDisabled"
        :form.sync="form"
        @submit="submitForm"
      />
      <wrapper title="合作合同累计金额信息">
        <otherBtnList>
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
          operator-width="110"
          :data="tableData"
          :cols="tableCols"
          :selection="false"
          :operator="false"
          :showPage="false"
          reserveSelection
          :row-key="getRowKey"
        >
          <!-- <template slot-scope="scope" slot="operator">
            <flex>
              <el-button
                type="text"
                size="small"
                title="查看"
                icon="iconfont icon-yulan"
                @click.prevent.stop="
                  openDialog('detail', {
                    row: scope.row,
                    type: 'base',
                    configType: 'detail',
                  })
                "
              >
              </el-button>
            </flex>
          </template> -->
        </page-table>
      </wrapper>
      <FormItem
        ref="unitFormItem"
        :layout="unitLayout"
        :rules="formRules"
        :disabled="inputDisabled"
        :form.sync="form"
        @submit="submitForm"
      />
      <addContract :show="contractShow" :data="contractData" @cancel="closeEdit" @success="successEdit" />
    </div>
  </dialog-cont>
</template>

<script>
import dialogCont from '@/components/dialog';
import FormItem from '@/components/formItem';
import PageTable from '@/components/page-table';
import otherBtnList from '@/components/headerTitle/otherBtnList';
import wrapper from '@/components/wrapper';
// import Flex from '@/components/flex';
import addContract from './addContract';
import { selectByCondition } from '@/api/marketMiddleStage/projectApprovalManagement';
import { cooContractList } from '@/api/marketMiddleStage/contractList';
export default {
  name: 'showContract',
  components: {
    dialogCont,
    FormItem,
    wrapper,
    PageTable,
    addContract,
    otherBtnList,
    // Flex,
  },
  props: {
    data: {},
    show: {
      type: Boolean,
      default: false,
    },
  },
  inject: ['common'],
  data() {
    const { configType } = this.data;

    console.log('configType', configType);

    return {
      inputDisabled: configType === 'detail',
      isEdit: ['add', 'edit'].includes(configType),
      isAdd: ['add'].includes(configType),
      scrollHeight: 'auto',
      title: '合作合同查看',
      form: {
        constructionTax: 0,
        constructionAll: undefined,
        contractAll: undefined,
        materialAll: undefined,
        provisionalTax: undefined,
        other: undefined,
        security: undefined,
      },
      layout: [
        {
          title: '项目基础信息',
          formItems: [
            {
              label: 'ERP编号',
              prop: 'erpNumber',
              inputType: 'input',
              span: 12,
            },
            {
              label: '项目名称',
              prop: 'projectName',
              inputType: 'input',
              span: 12,
            },
            {
              label: '生产中心',
              prop: 'deptId',
              inputType: 'select',
              span: 12,
              options: this.common().productionCenterCode,
            },
            {
              label: '设计单位',
              prop: 'designUnit',
              inputType: 'select',
              span: 12,
              options: this.common().designUnitCode,
            },
            {
              label: '监理单位',
              prop: 'supervisionUnit',
              inputType: 'select',
              span: 12,
              options: this.common().supervisionUnitCode,
            },
            {
              label: '建设单位',
              prop: 'constructions',
              inputType: 'select',
              span: 12,
              options: this.common().constructionCode,
            },
            {
              label: '项目状态',
              prop: 'projectstatus',
              inputType: 'select',
              span: 12,
              options: this.common().projectStatusCode,
            },
            {
              label: '预估收入',
              prop: 'estimatedRevenue',
              inputType: 'input',
              span: 12,
            },
            {
              label: '预估成本',
              prop: 'estimatedCost',
              inputType: 'input',
              span: 12,
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
              label: '开工时间',
              prop: 'startTime',
              inputType: 'dataPicker',
              span: 12,
            },
            {
              label: '完工时间',
              prop: 'endTime',
              inputType: 'dataPicker',
              span: 12,
            },
          ],
        },
      ],
      unitLayout: [
        {
          title: '单位合作信息',
          formItems: [
            {
              label: '合作单位',
              prop: 'name',
              inputType: 'input',
              span: 12,
            },
            {
              label: '合作框架编号',
              prop: 'contractId',
              inputType: 'input',
              span: 12,
            },
            {
              label: '专业',
              prop: 'oneMajor',
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
          ],
        },
        {
          title: '合作合同基本信息',
          formItems: [
            {
              label: 'ERP编号',
              prop: 'erpId',
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
              label: '合同类型',
              prop: 'erpId',
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
              label: '订单编号',
              prop: 'orderId',
              inputType: 'input',
              span: 12,
            },
            {
              label: '计税方式',
              prop: 'taxType',
              inputType: 'select',
              span: 12,
              options: this.common().taxTypeCode,
            },
            {
              label: '文件数',
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
              label: '签订日期',
              prop: 'signDate',
              inputType: 'dataPicker',
              span: 12,
            },
            {
              label: '创建人',
              prop: 'createPeople',
              inputType: 'input',
              span: 12,
            },
            {
              label: '创建时间',
              prop: 'createTime',
              inputType: 'dataPicker',
              span: 12,
            },
            {
              label: '备注',
              prop: 'remark',
              inputType: 'textarea',
              span: 24,
            },
          ],
        },
        {
          title: '合作合同累计金额信息',
          formItems: [
            {
              label: '合同金额',
              prop: 'contractAll',
              inputType: 'inputNumber',
              span: 12,
            },
            {
              label: '总施工费',
              prop: 'constructionAll',
              inputType: 'inputNumber',
              span: 12,
            },
            {
              label: '总材料费',
              prop: 'materialAll',
              inputType: 'inputNumber',
              span: 12,
            },
            {
              label: '施工费',
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

                if (!construction || !constructionRate) {
                  this.form.constructionTax = 0;

                  return;
                }
                const taxRetaValue = constructionRate.split('_')[1];

                const amountTax = ((parseFloat(construction || 0) * parseFloat(taxRetaValue || 0)) / 100).toFixed(2);
                // console.log(amountTax);

                this.form.constructionTax = amountTax;

                // 合计
                this.form.constructionAll = parseFloat(construction || 0) + parseFloat(amountTax || 0);

                // 合同总额

                this.form.contractAll = this.getContractAll();
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

                if (!construction || !constructionRate) {
                  this.form.constructionTax = 0;

                  return;
                }

                const amountTax = ((parseFloat(construction) * parseFloat(taxRetaValue)) / 100).toFixed(2);
                // console.log(amountTax);

                this.form.constructionTax = amountTax;

                // 合计
                this.form.constructionAll = parseFloat(construction) + parseFloat(amountTax);
                // 合同总额

                this.form.contractAll = this.getContractAll();
              },
            },
            {
              label: '施工税',
              prop: 'constructionTax',
              inputType: 'inputNumber',
              span: 12,
            },
            {
              label: '材料费',
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

                if (!material || !materialRate) {
                  this.form.materialTax = 0;

                  return;
                }
                const taxRetaValue = materialRate.split('_')[1];

                const amountTax = ((parseFloat(material || 0) * parseFloat(taxRetaValue || 0)) / 100).toFixed(2);
                // console.log(amountTax);

                this.form.materialTax = amountTax;
                this.form.materialAll = parseFloat(material) + parseFloat(amountTax);

                // 合同总额
                this.form.contractAll = this.getContractAll();
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

                if (!material || !materialRate) {
                  this.form.materialTax = 0;

                  return;
                }

                const amountTax = ((parseFloat(material) * parseFloat(taxRetaValue)) / 100).toFixed(2);
                // console.log(amountTax);

                this.form.materialTax = amountTax;
                this.form.materialAll = parseFloat(material) + parseFloat(amountTax);

                // 合同总额

                this.form.contractAll = this.getContractAll();
              },
            },
            {
              label: '材料税',
              prop: 'materialTax',
              inputType: 'inputNumber',
              span: 12,
            },
            {
              label: '预缴税',
              prop: 'provisionalTax',
              inputType: 'inputNumber',
              span: 12,
              onChange: (val) => {
                if (this.form.provisionalTax === val) {
                  return;
                }
                this.form = {
                  ...this.form,
                  provisionalTax: val,
                };

                this.form.contractAll = this.getContractAll();
              },
            },
            {
              label: '安全费',
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
                this.form.contractAll = this.getContractAll();
              },
            },
            {
              label: '其他费用',
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
                this.form.contractAll = this.getContractAll();
              },
            },
          ],
        },
      ],
      reqData: {},
      formRules: {},
      otherBtnLists: [
        {
          label: '新增',
          click: () => this.addRow(),
        },
      ],
      tableData: [],
      tableCols: [
        {
          label: 'ERP编码',
          prop: 'erpNumber',
        },
        {
          label: '累计已收分包发票',
          prop: 'fbinvoiceTotalAmount',
        },
        {
          label: '累计应付款',
          prop: 'payableTotalAmount',
        },
        {
          label: '累计付款',
          prop: 'paymentTotalAmount',
        },
        {
          label: '累计已收预缴税票',
          prop: 'pretaxTotalAmount',
        },
      ],
      contractShow: false,
      contractData: {},
    };
  },
  computed: {
    dialogShow: {
      get() {
        return this.show;
      },
      set(v) {
        console.log('set');
      },
    },
  },
  methods: {
    // 打开预览
    openedit() {
      const { configType } = this.data;

      this.inputDisabled = configType === 'detail';
      this.isEdit = ['add', 'edit'].includes(configType);
      this.isAdd = ['add'].includes(configType);
      this.reqDetail();
    },
    // 请求数据
    reqDetail() {
      const { row } = this.data;

      if (row && row.cooContractId) {
        this.getSelectByCondition(row.cooContractId);
        this.getDateil(row.cooContractId);
      }
    },
    // 获取数据
    getDateil(cooContractId) {
      cooContractList(cooContractId).then((res) => {
        if (res && res.code) {
          this.reqData = res.data;
          if (res.data.province) {
            this.setCity(res.data.province);
          }
          if (res.data.oneMajor) {
            this.setTwoMajor(res.data.oneMajor);
          }
          this.form = {
            ...this.form,
            ...res.data,
          };
        }
      });
    },
    // 获取城市
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

      console.log('city', city);
      this.$set(this.unitLayout[0].formItems[4], 'options', city);
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

    getSelectByCondition(cooContractId) {
      const parames = {
        data: {
          contractId: cooContractId,
        },
        pageSize: 10000,
        sorting: 'id desc',
      };

      // 查看合作合同
      selectByCondition(parames).then((res) => {
        if (res && res.code) {
          const { data } = res.data;

          this.tableData = data;
        }
      });
    },
    // 获取所有合同
    getContractAll() {
      const { provisionalTax, constructionAll, materialAll, other, security } = this.form;

      return (
        parseFloat(constructionAll === undefined ? 0 : constructionAll) +
        parseFloat(materialAll === undefined ? 0 : materialAll) +
        parseFloat(provisionalTax === undefined ? 0 : provisionalTax) +
        parseFloat(other === undefined ? 0 : other) +
        parseFloat(security === undefined ? 0 : security)
      );
    },
    // 提交数据
    submitForm(val) {
      const param = {};

      // updateProjectProcessStatus(param).then((res) => {
      //   if (res.code === '200') {
      //     this.$notify({
      //       title: '成功',
      //       message,
      //       type: 'success',
      //       position: 'bottom-right',
      //     });
      //     this.$emit('success');
      //   }
      // });
    },
    // 用户数据选择翻页记忆
    getRowKey(row) {
      return row.id;
    },
    // 添加行
    addRow() {
      this.contractShow = true;
      this.contractData = {
        configType: 'add',
        row: {
          ...this.data.row,
          contractId: this.reqData.cooperationFrameworkDto.contractId,
        },
      };
    },
    // 关闭预览
    closeEdit() {
      this.contractShow = false;
      this.peopleData = {};
    },

    // 成功预览
    successEdit(selectTable) {
      const { row } = this.data;

      this.getSelectByCondition(row.cooContractId);
      this.closeEdit();
    },
    // 关闭预览
    closeedit() {
      this.canceledit();
    },
    // 取消预览
    canceledit(type) {
      this.$emit('cancel', type);
    },
    // 提交数据
    confirmedit() {
      this.closeedit();
      this.$emit('success');
    },
    // 成功提交
    successSubmit() {
      this.closeedit();
      this.$emit('success');
    },
  },
};
</script>

<style lang="less">
.showContract {
  .comp-page-table {
    min-height: auto;
  }
  .comp-wrapper {
    #otherBtnList {
      margin-bottom: 10px;
    }
  }
}
</style>
