<template>
  <div id="base">
    <FormItem
      ref="supplyFormItem"
      :layout="layout"
      :rules="formRules"
      :disabled="true"
      :isEdit="false"
      :form.sync="form"
      @submit="(form) => changeForm(form)"
    />
    <wrapper title="合作合同累计金额" v-if="false">
      <otherBtnList v-if="showPageTableBtn">
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
        :selection="false"
        :operator="showOperator"
        :row-key="getRowKey"
        reserveSelection
        hideDefaultIndex
        :page-current="page.current"
        :total="page.total"
        :page-size="page.pageSize"
        :showSummary="showSummary"
        :summaryMethod="summaryMethod"
        @current-change="onCurrentChange"
        @size-change="onPageSizeChange"
      >
        <template slot-scope="scope" slot="operator">
          <flex>
            <el-button
              type="text"
              size="small"
              title="编辑"
              icon="iconfont icon-bianji"
              v-if="!scope.row.editRow"
              @click.prevent.stop="
                tableAction('edit', {
                  index: scope.index,
                  data: scope.row,
                })
              "
            >
              编辑
            </el-button>
            <el-button
              type="text"
              size="small"
              title="保存"
              v-if="scope.row.editRow"
              icon="iconfont icon-baocun1"
              @click.prevent.stop="
                tableAction('save', {
                  index: scope.index,
                  data: scope.row,
                })
              "
            >
              保存
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
    <FormItem
      ref="otherFormItem"
      :layout="otherLayout"
      :rules="formRules"
      :disabled="inputDisabled"
      :isEdit="isEdit"
      :form.sync="form"
      @submit="submitForm"
    />
  </div>
</template>

<script>
import FormItem from '@/components/formItem';
import wrapper from '@/components/wrapper';
import Flex from '@/components/flex';
import PageTable from '@/components/page-table';
import otherBtnList from '@/components/headerTitle/otherBtnList';

import {
  updatecooperationContract,
  addcooperationContractTemp,
  updatecooperationContractTemp,
  cooContractList,
  selectByCondition,
} from '@/api/marketMiddleStage/contractList';

export default {
  name: 'baseInfo',
  components: {
    FormItem,
    wrapper,
    PageTable,
    Flex,
    otherBtnList,
  },
  props: {
    show: Boolean,
    data: {},
    extraData: {
      type: Object,
      default: () => ({}),
    },
  },
  inject: ['common'],
  data() {
    const { configType } = this.data;

    return {
      /** 输入禁用 */
      inputDisabled: configType === 'detail',
      isEdit: ['add', 'edit'].includes(configType),
      isAdd: ['add'].includes(configType),
      projectForm: {},
      form: {
        constructionTax: 0,
        constructionAll: 0,
        contractAll: 0,
        materialAll: 0,
        materialTax: 0,
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
              prop: 'erpId',
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
              prop: 'deptName',
              inputType: 'select',
              span: 12,
              options: this.common().productionCenterCode,
            },
            {
              label: '设计单位',
              prop: 'design', // 修改前是：deptId, 旧系统用的是： design
              inputType: 'select',
              span: 12,
              options: this.common().designUnitCode,
            },
            {
              label: '监理单位',
              prop: 'supervision', // 修改前是：projectName, 旧系统用的是： supervision
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
              options: this.common().constructionCode,
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
      otherLayout: [
        {
          title: '单位合作信息',
          disabled: true,
          formItems: [
            {
              label: '合作单位',
              prop: 'unitName',
              inputType: 'input',
              span: 12,
            },
            {
              label: '合作框架编号',
              prop: 'cooperationFramework',
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
              multiple: false,
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
              prop: 'contractId',
              inputType: 'input',
              span: 12,
            },
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
              disabled: true,
              inputType: 'inputNumber',
              span: 12,
            },
            {
              label: '总施工费',
              disabled: true,
              prop: 'constructionAll',
              inputType: 'inputNumber',
              span: 12,
            },
            {
              label: '总材料费',
              disabled: true,
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
                const taxRetaValue = constructionRate.split('_')[1];

                if (!constructionRate || !construction) {
                  this.form = {
                    ...this.form,
                    construction: val,
                    constructionTax: 0,
                  };

                  return;
                }
                const amountTax = ((parseFloat(construction || 0) * parseFloat(taxRetaValue || 0)) / 100).toFixed(2);

                console.log(amountTax);

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

                if (!constructionRate || !construction) {
                  this.form = {
                    ...this.form,
                    constructionRate: val,
                    constructionTax: 0,
                  };

                  return;
                }
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
              label: '施工税',
              prop: 'constructionTax',
              disabled: true,
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

                if (!materialRate || !material) {
                  this.form = {
                    ...this.form,
                    material: val,
                    materialTax: 0,
                  };

                  return;
                }
                const taxRetaValue = materialRate.split('_')[1];
                const amountTax = ((parseFloat(material || 0) * parseFloat(taxRetaValue || 0)) / 100).toFixed(2);
                // console.log(amountTax);

                this.form.materialTax = amountTax;
                this.form.materialAll = parseFloat(material || 0) + parseFloat(amountTax || 0);

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

                if (!materialRate || !material) {
                  this.form = {
                    ...this.form,
                    materialRate: val,
                    materialTax: 0,
                  };

                  return;
                }

                const amountTax = ((parseFloat(material || 0) * parseFloat(taxRetaValue || 0)) / 100).toFixed(2);
                // console.log(amountTax);

                this.form.materialTax = amountTax;
                this.form.materialAll = parseFloat(material || 0) + parseFloat(amountTax || 0);

                // 合同总额

                this.form.contractAll = this.getContractAll();
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
      // 必填内容
      formRules: {
        erpId: {
          required: true,
          message: '请输入ERP编号',
          trigger: 'blur',
        },
        contractNo: {
          required: true,
          message: '请输入合同编号',
          trigger: 'blur',
        },
        contractType: {
          required: true,
          message: '请输入合同类型',
          trigger: 'blur',
        },
        contractName: {
          required: true,
          message: '请输入合同名称',
          trigger: 'blur',
        },
        orderId: {
          required: true,
          message: '请输入订单编号',
          trigger: 'blur',
        },
        taxType: {
          required: true,
          message: '请输入计税方式',
          trigger: 'blur',
        },
        contractAll: {
          required: true,
          message: '请输入合同金额',
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
        construction: {
          required: true,
          message: '请选择施工费',
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
        provisionalTax: {
          required: true,
          message: '请输入预缴税',
          trigger: 'blur',
        },
        security: {
          required: true,
          message: '请输入安全费',
          trigger: 'blur',
        },
        other: {
          required: true,
          message: '请输入其他费用',
          trigger: 'blur',
        },
      },
      page: {
        current: 1,
        pageSize: 10,
        total: 0,
      },
      tableData: [],
      tableCols: [
        {
          label: 'ERP编码',
          prop: 'erpNumber',
        },
        {
          label: '累计已收分包发票',
          prop: 'fbinvoiceTotalAmount',
          render: (h, scope) => {
            const d = scope.row;

            let html = scope.row.fbinvoiceTotalAmount;

            if (d.editRow) {
              html = (
                <el-input
                  class="editInput"
                  value={scope.row[scope.column.property] || ''}
                  onInput={(val) => {
                    this.changeInput(val, scope.$index, scope.column.property);
                  }}
                ></el-input>
              );
            }

            return <div>{html}</div>;
          },
        },
        {
          label: '累计应付款',
          prop: 'payableTotalAmount',
          render: (h, scope) => {
            const d = scope.row;

            let html = scope.row.payableTotalAmount;

            if (d.editRow) {
              html = (
                <el-input
                  class="editInput"
                  value={scope.row[scope.column.property] || ''}
                  onInput={(val) => {
                    this.changeInput(val, scope.$index, scope.column.property);
                  }}
                ></el-input>
              );
            }

            return <div>{html}</div>;
          },
        },
        {
          label: '累计付款',
          prop: 'paymentTotalAmount',
          render: (h, scope) => {
            const d = scope.row;

            let html = scope.row.paymentTotalAmount;

            if (d.editRow) {
              html = (
                <el-input
                  class="editInput"
                  value={scope.row[scope.column.property] || ''}
                  onInput={(val) => {
                    this.changeInput(val, scope.$index, scope.column.property);
                  }}
                ></el-input>
              );
            }

            return <div>{html}</div>;
          },
        },
        {
          label: '累计已收预缴税票',
          prop: 'pretaxTotalAmount',
          render: (h, scope) => {
            const d = scope.row;

            let html = scope.row.pretaxTotalAmount;

            if (d.editRow) {
              html = (
                <el-input
                  class="editInput"
                  value={scope.row[scope.column.property] || ''}
                  onInput={(val) => {
                    this.changeInput(val, scope.$index, scope.column.property);
                  }}
                ></el-input>
              );
            }

            return <div>{html}</div>;
          },
        },
      ],
      otherBtnLists: [
        {
          label: '新增',
          click: () => this.addRow(),
        },
      ],
      formChange: [],
      editRow: false,
      reqData: {},
      showPageTableBtn: false,
      showOperator: false,
      showSummary: false,
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
        cooContractList(row.id).then(async (res) => {
          if (res && res.code === '200') {
            this.reqData = res.data;
            // const { cooperationContractDto, cooperationFrameworkDto, cooperationUnitDto, detailsDto, projectBaseInfo } =
            //   res.data;

            // this.projectForm = {
            //   ...projectBaseInfo,
            // };
            if (res.data.province) {
              await this.setCity(res.data.province);
            }
            if (res.data.oneMajor) {
              await this.setTwoMajor(res.data.oneMajor);
            }
            this.form = {
              ...this.form,
              ...res.data,
              // remark: cooperationContractDto.remark,
              // id: `${cooperationContractDto.id}`,
            };
            console.log('this.form', this.form);
            this.getDataAllList();
          }
        });
      }
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

      this.$set(this.otherLayout[0].formItems[4], 'options', city);
      console.log('setCity-this.form', this.form);
    },
    // 获取二级专业
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
    // 获取所有合同
    getContractAll() {
      const { provisionalTax, constructionAll, materialAll, other, security } = this.form;

      return (
        parseFloat(constructionAll || 0) +
        parseFloat(materialAll || 0) +
        parseFloat(provisionalTax || 0) +
        parseFloat(other || 0) +
        parseFloat(security || 0)
      );
    },
    // 请求某页数据
    onCurrentChange(val) {
      this.page.current = val;
      this.getDataAllList();
    },
    // 改变请求条数
    onPageSizeChange(val) {
      this.page.pageSize = val;
      this.onCurrentChange(1);
    },
    // 获取所有/查询数据列表
    getDataAllList() {
      // const { cooperationContractDto } = this.reqData;
      const parames = {
        data: {
          contractId: this.reqData.id,
        },
        pageNo: this.page.current,
        pageSize: this.page.pageSize,
        sorting: 'id desc',
      };

      // 根据查询条件获取合同列表
      selectByCondition(parames).then((res) => {
        if (res.code === '200') {
          const { data, total } = res.data;

          this.tableData = data;
          this.page.total = total;
        }
      });
    },
    changeForm(val) {
      // this.projectForm = {
      //   ...this.projectForm,
      //   ...val,
      // };
    },
    submitFormItem() {
      this.$refs.otherFormItem.submitForm();
    },
    // 提交数据
    submitForm(val) {
      const { configType, row } = this.data;
      const id = configType === 'add' ? '' : this.form.id;

      let param = {
        ...val,
      };

      const api = updatecooperationContract;
      // 更新合作合同

      let message = '新增成功';

      if (id) {
        param = {
          ...param,
          id: `${id}`,
        };
        message = '更新成功';
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
      this.formChange = [];
      this.$refs.supplyFormItem.cancelForm();
      this.$refs.otherFormItem.cancelForm();
    },
    // 用户数据选择翻页记忆
    getRowKey(row) {
      return row.id;
    },
    // 添加行
    addRow() {
      if (this.editRow) {
        this.$notifyError('请先保存当前新增行数据再进行添加操作');

        return;
      }

      this.editRow = true;
      const list = {
        editRow: this.editRow,
      };

      this.tableData.unshift(list);
      this.tableData.splice(1, 0);
    },
    // 操作表单
    tableAction(type, row) {
      // console.log('row', row);
      if (type === 'edit') {
        this.tableData[row.index] = {
          ...this.tableData[row.index],
          editRow: true,
        };
        this.editRow = true;
        this.tableData.splice(1, 0);
        // console.log('this.tableData', this.tableData);
      }
      if (type === 'save') {
        this.handleUpdateSplit(row.index);
      }
      if (type === 'del') {
        this.tableData.splice(row.index, 1);
        this.editRow = false;
      }
    },
    // 保存
    handleUpdateSplit(index) {
      const { fbinvoiceTotalAmount, payableTotalAmount, paymentTotalAmount, pretaxTotalAmount, id } =
        this.tableData[index];

      const a = parseFloat(fbinvoiceTotalAmount) + parseFloat(pretaxTotalAmount);

      if (parseFloat(payableTotalAmount) > a) {
        this.$notifyError('累计应付款金额 不能大于 累计分包发票 + 累计预缴税 的总额');

        return;
      }
      if (parseFloat(paymentTotalAmount) > parseFloat(payableTotalAmount)) {
        this.$notifyError('累计付款金额 不能大于 累计应付款金额');

        return;
      }
      if (!fbinvoiceTotalAmount || !payableTotalAmount || !paymentTotalAmount || !pretaxTotalAmount) {
        this.$notifyError('请先完整输入信息:累计已收分包发票、累计应付款、累计付款、累计已收预缴税票');

        return;
      }
      // const { projectBaseInfo, cooperationContractDto } = this.reqData;

      let parames = {
        contractId: `${this.reqData.id}`,
        erpNumber: this.reqData.erpNumber,
        fbinvoiceTotalAmount: `${fbinvoiceTotalAmount}`,
        payableTotalAmount: `${payableTotalAmount}`,
        paymentTotalAmount: `${paymentTotalAmount}`,
        pretaxTotalAmount: `${pretaxTotalAmount}`,
      };

      let api = addcooperationContractTemp;

      let message = '新增成功';

      if (id) {
        parames = {
          ...parames,
          id: `${id}`,
        };
        message = '更新成功';
        api = updatecooperationContractTemp;
        // 更新累计付款
      }
      api(parames).then((res) => {
        if (res && res.code === '200') {
          this.$notify({
            title: '成功',
            message,
            type: 'success',
            position: 'bottom-right',
          });
          this.tableData[index] = {
            ...this.tableData[index],
            editRow: false,
          };
          this.editRow = false;
          this.tableData.splice(1, 0);
          this.getDataAllList();
        }
      });
    },
    // 输入框改变
    changeInput(val, index, name) {
      this.tableData[index] = {
        ...this.tableData[index],
        [name]: val,
      };
      this.tableData.splice(1, 0);
    },
    init() {
      // console.log('extraData', this.extraData);
      const keyList = Object.keys(this.extraData);

      if (keyList.length) {
        this.showPageTableBtn = this.extraData.showBtn;
        this.showOperator = this.extraData.showBtn;
        this.showSummary = this.extraData.showSummary;
        if (this.extraData.cancelRules) {
          this.formRules = {};
        }
      }
    },
    // 总和
    summaryMethod(param) {
      const { columns, data } = param;
      const sums = [];
      const paySchedule = data.length ? data[0].paySchedule : '';

      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = this.extraData.paySchedule && paySchedule ? `付款进度:${paySchedule}` : '';

          return;
        }
        const values = data.map((item) => Number(item[column.property]));

        sums[index] = values.reduce((prev, curr) => {
          const value = Number(curr);

          if (!isNaN(value)) {
            return prev + curr;
          }

          return prev;
        }, 0);
        // sums[index] = sums[index].toFixed(2);
      });

      return sums;
    },
  },
  created() {
    if (this.isAdd === false) {
      this.reqDetail();
    }
    this.init();
  },
};
</script>

<style lang="less" scoped>
#base {
  #PageTable {
    min-height: auto;
  }
  .comp-wrapper {
    #otherBtnList {
      margin-bottom: 10px;
    }
  }
}
</style>
