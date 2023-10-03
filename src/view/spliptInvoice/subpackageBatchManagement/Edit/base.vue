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
    >
      <template slot="invoice">
        <otherBtnList style="margin-bottom: 12px" v-if="form.projectType && !inputDisabled">
          <ul class="flexRow">
            <li
              v-for="(item, index) in invoiceOtherBtnLists"
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
          :showPage="false"
          :operator="!inputDisabled"
          :row-key="getRowKey"
          :data="invoiceTableData"
          :cols="invoiceTableCols"
        >
          <template slot-scope="scope" slot="operator">
            <flex>
              <el-button
                type="text"
                size="small"
                title="编辑"
                icon="iconfont icon-bianji"
                v-if="!scope.row.editRow && !scope.row.id"
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
                v-if="!scope.row.id"
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
      </template>
      <template slot="allocation">
        <page-table
          ref="allocationPageTable"
          col-align="left"
          :showPage="false"
          :operator="false"
          :expand="true"
          :row-key="getRowKey"
          :data="
            invoiceTableData.filter(
              (dataItem) => !dataItem.editRow || (dataItem.expandTableData && dataItem.expandTableData.length !== 0),
            )
          "
          :cols="allocationTableCols"
          hideDefaultIndex
        >
          <template slot-scope="scope" slot="expand">
            <div class="expandInfo">
              <page-table
                class="childPageTable"
                ref="childPageTable"
                col-align="left"
                :showPage="false"
                :selection="false"
                :operator="!inputDisabled"
                :row-key="getRowKey"
                :data="expandTableData[scope.index].expandTableData"
                :cols="expandTableCols"
              >
                <template slot-scope="sonScope" slot="operator">
                  <flex>
                    <el-button
                      type="text"
                      size="small"
                      title="编辑"
                      icon="iconfont icon-bianji"
                      v-if="
                        !sonScope.row.editRow &&
                        (!sonScope.row.id || (form.projectType === '2' && !scope.row.hireContractId))
                      "
                      @click.prevent.stop="
                        expendAction('edit', {
                          index: scope.index,
                          sonIndex: sonScope.index,
                          data: sonScope.row,
                        })
                      "
                    >
                      编辑
                    </el-button>
                    <el-button
                      type="text"
                      size="small"
                      title="保存"
                      v-if="
                        sonScope.row.editRow &&
                        (!sonScope.row.id || (form.projectType === '2' && !scope.row.hireContractId))
                      "
                      icon="iconfont icon-baocun1"
                      @click.prevent.stop="
                        expendAction('save', {
                          index: scope.index,
                          sonIndex: sonScope.index,
                          data: sonScope.row,
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
                      v-if="!sonScope.row.id"
                      @click.prevent.stop="
                        expendAction('del', {
                          index: scope.index,
                          sonIndex: sonScope.index,
                          data: sonScope.row,
                        })
                      "
                    >
                      删除
                    </el-button>
                  </flex>
                </template>
              </page-table>
              <div
                class="flexRow flexCenter addRow"
                v-if="!inputDisabled"
                @click="
                  () =>
                    expendAction('addRow', {
                      index: scope.index,
                      data: scope.row,
                    })
                "
              >
                <span class="iconfont icon-jiahao" />
                <span class="text">添加数据</span>
              </div>
            </div>
          </template>
        </page-table>
      </template>
    </FormItem>
    <ProjectSelect
      :show="projectShow"
      :typeData="projectType"
      :data="projectData"
      customClass="subpackageProjectSelect"
      @cancel="closeProject"
      @success="successProject"
    />
    <!-- 承揽合同 -->
    <hireNameWorkSelect
      ref="hireNameWorkSelect"
      title="选择承揽订单"
      :highlightCurrentRow="false"
      :show="hireNameShow"
      :data="hireNameData"
      @cancel="closeHireName"
      @success="successHireName"
    />
    <!-- 以租代建合同 -->
    <instionContractSelect
      :show="instionContractShow"
      :data="instionContractData"
      :typeData="projectType"
      customClass="instionContractSelect"
      @cancel="closeInstionContract"
      @success="successInstionContract"
    />
  </div>
</template>

<script>
import FormItem from '@/components/formItem';
import PageTable from '@/components/page-table';
import otherBtnList from '@/components/headerTitle/otherBtnList';
import Flex from '@/components/flex';
import hireNameWorkSelect from '@/view/common/hireNameWorkSelect';
import ProjectSelect from '@/view/common/projectInfo/projectSelect.vue';
import instionContractSelect from '@/view/common/spliptInvoice/instionContractSelect.vue';
import {
  detail,
  getFee,
  add,
  update,
  getErpNumber,
} from '@/api/spliptInvoice/subpackageBatchManagement/distribution.js';

export default {
  name: 'baseInfo',
  components: {
    FormItem,
    PageTable,
    Flex,
    otherBtnList,
    hireNameWorkSelect,
    ProjectSelect,
    instionContractSelect,
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
      invoiceOtherBtnLists: [
        {
          label: '新增',
          click: () => this.addRow(),
        },
      ],
      projectType: {},
      layout: [
        {
          title: '发票批次信息',
          formItems: [
            {
              label: '发票总分配金额',
              prop: 'invoiceDistributionTotalAmount',
              disabled: true,
              inputType: 'input',
              span: 12,
            },
            {
              label: '合作发票批次',
              prop: 'batchNumber',
              disabled: true,
              inputType: 'input',
              span: 12,
            },
            {
              label: '合作发票批次名称',
              prop: 'batchName',
              inputType: 'input',
              span: 12,
            },
            {
              label: '项目种类',
              prop: 'projectType',
              inputType: 'select',
              disabled: false,
              options: this.common().projectType,
              span: 12,
              onChange: (val) => {
                this.changeExpandTableCols(val);
              },
            },
          ],
        },
        {
          title: '',
          render: 'invoice',
        },
        {
          title: '项目批次信息',
          formItems: [
            {
              label: '分配总金额',
              prop: 'totalAmount',
              disabled: true,
              inputType: 'input',
              span: 12,
            },
            {
              label: '发票剩余分配金额',
              prop: 'remainingAllocationAmount',
              disabled: true,
              inputType: 'input',
              span: 12,
            },
            {
              label: '项目剩余开票金额',
              prop: 'remainingInvoicedAmount',
              disabled: true,
              inputType: 'input',
              span: 12,
            },
          ],
        },
        {
          title: '',
          render: 'allocation',
        },
      ],
      formRules: {
        batchName: {
          required: true,
          message: '请输入合作发票批次名称',
          trigger: 'blur',
        },
        projectType: {
          required: true,
          message: '请选择项目种类',
          trigger: 'blur',
        },
      },
      editRow: false,
      // invoiceTableData: [
      //   {
      //     createTime: '2022-09-08',
      //     editRow: false,
      //     expandTableData: [],
      //     fictitiousInvoice: '1',
      //     invoiceAmount: 1030,
      //     invoiceCode: '1',
      //     invoiceNumber: '1',
      //     invoiceType: 'invoice_type_01',
      //     noTaxAmount: 1000,
      //     rate: '3',
      //     taxAmount: '30.00',
      //   },
      // ],
      invoiceTableData: [],
      invoiceTableCols: [
        {
          label: '虚拟发票',
          prop: 'fictitiousInvoice',
          render: (h, scope) => {
            const d = scope.row;
            const { isJudge } = this.common();
            const isJudgeItem = isJudge.filter((code) => code.id === d.fictitiousInvoice);

            const html = isJudgeItem && isJudgeItem[0] && isJudgeItem[0].name;

            if (d.editRow) {
              return (
                <div>
                  {
                    <el-select
                      class="editInput"
                      value={scope.row[scope.column.property] || ''}
                      onChange={(val) => {
                        this.changeSelect(val, scope.$index, scope.column.property);
                      }}
                    >
                      {isJudge.map((data) => (
                        <el-option label={data.name} value={data.id}></el-option>
                      ))}
                    </el-select>
                  }
                </div>
              );
            }

            return <div>{html}</div>;
          },
        },
        {
          label: '发票类型',
          width: '100px',
          prop: 'invoiceType',
          render: (h, scope) => {
            const d = scope.row;

            const { invoiceType } = this.common();
            const invoiceItem = invoiceType.filter((code) => code.id === d.invoiceType);

            const html = invoiceItem && invoiceItem[0] && invoiceItem[0].name;

            if (d.editRow) {
              return (
                <div>
                  {
                    <el-select
                      class="editInput"
                      value={scope.row[scope.column.property] || ''}
                      onChange={(val) => {
                        this.changeSelect(val, scope.$index, scope.column.property);
                      }}
                    >
                      {invoiceType.map((data) => (
                        <el-option label={data.name} value={data.id}></el-option>
                      ))}
                    </el-select>
                  }
                </div>
              );
            }

            return <div>{html}</div>;
          },
        },
        {
          label: '开票日期',
          prop: 'createTime',
          width: '120px',
          render: (h, scope) => {
            const d = scope.row;
            const html = scope.row.createTime;

            if (d.editRow) {
              return (
                <div>
                  {
                    <el-date-picker
                      class="editInput"
                      type="datetime"
                      format="yyyy-MM-dd"
                      value-format="yyyy-MM-dd"
                      value={scope.row[scope.column.property] || ''}
                      onInput={(val) => {
                        this.changeInput(val, scope.$index, scope.column.property);
                      }}
                    ></el-date-picker>
                  }
                </div>
              );
            }

            return <div>{html}</div>;
          },
        },
        {
          label: '分包发票代码',
          prop: 'invoiceCode',
          width: '120px',
          render: (h, scope) => {
            const d = scope.row;

            let html = scope.row.invoiceCode;

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
          label: '分包发票号码',
          prop: 'invoiceNumber',
          width: '120px',
          render: (h, scope) => {
            const d = scope.row;

            let html = scope.row.invoiceNumber;

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
          label: '发票金额(不含税)',
          prop: 'noTaxAmount',
          width: '120px',
          render: (h, scope) => {
            const d = scope.row;

            let html = scope.row.noTaxAmount;

            if (d.editRow) {
              html = (
                <el-input-number
                  class="editInput"
                  precision={2}
                  controls={false}
                  value={scope.row[scope.column.property] || undefined}
                  onInput={(val) => {
                    this.changeInput(val, scope.$index, scope.column.property);
                  }}
                ></el-input-number>
              );
            }

            return <div>{html}</div>;
          },
        },
        {
          label: '税率(%)',
          prop: 'rate',
          width: '100px',
          render: (h, scope) => {
            const d = scope.row;
            const { taxRateCode } = this.common();
            const rateItem = taxRateCode.filter((code) => code.code === d.rate);

            const html = rateItem && rateItem[0] && rateItem[0].name;

            if (d.editRow) {
              return (
                <div>
                  {
                    <el-select
                      class="editInput"
                      value={scope.row[scope.column.property] || ''}
                      onChange={(val) => {
                        this.changeSelect(val, scope.$index, scope.column.property);
                      }}
                    >
                      {taxRateCode.map((data) => (
                        <el-option label={data.name} value={data.code}></el-option>
                      ))}
                    </el-select>
                  }
                </div>
              );
            }

            return <div>{html}</div>;
          },
        },
        {
          label: '发票税额',
          prop: 'taxAmount',
        },
        {
          label: '发票金额(含税)',
          prop: 'invoiceAmount',
          width: '120px',
        },
        {
          label: '发票剩余分配金额',
          prop: 'distributionBalance',
          width: '120px',
        },
      ],
      allocationTableCols: [
        {
          label: '虚拟发票',
          prop: 'fictitiousInvoice',
          render: (h, scope) => {
            const fictitiousInvoice = this.common().isJudge.filter(
              (status) => status.id === scope.row.fictitiousInvoice,
            );

            return <div>{fictitiousInvoice && fictitiousInvoice[0] && fictitiousInvoice[0].name}</div>;
          },
        },
        {
          label: '开票日期',
          prop: 'createTime',
        },
        {
          label: '分包发票代码',
          prop: 'invoiceCode',
        },
        {
          label: '分包发票号码',
          prop: 'invoiceNumber',
        },
        {
          label: '发票金额(不含税)',
          prop: 'noTaxAmount',
          width: '120px',
        },
        {
          label: '发票税额',
          prop: 'taxAmount',
        },
        {
          label: '税率(%)',
          prop: 'rate',
          render: (h, scope) => {
            const params = this.common().taxRateCode.filter((ele) => ele.code === scope.row.rate);

            return <div>{params && params[0] && params[0].name}</div>;
          },
        },
        {
          label: '发票金额(含税)',
          prop: 'invoiceAmount',
          width: '120px',
        },
        {
          label: '已分配金额',
          hide: false,
          prop: 'amountAllocated',
        },
        {
          label: '发票剩余分配金额',
          prop: 'distributionBalance',
          width: '120px',
        },
      ],
      projectData: {},
      projectShow: false,
      expendEditRow: false,
      projectIndex: undefined,
      // expandTableData: [
      //   {
      //     createTime: '2022-09-08',
      //     editRow: false,
      //     index: 0,
      //     expandTableData: [],
      //     fictitiousInvoice: '1',
      //     invoiceAmount: 1030,
      //     invoiceCode: '1',
      //     invoiceNumber: '1',
      //     invoiceType: 'invoice_type_01',
      //     noTaxAmount: 1000,
      //     rate: '3',
      //     taxAmount: '30.00',
      //   },
      // ],
      expandTableData: [{}],
      expandTableCols: [
        {
          label: '合作合同名称',
          prop: 'contractName',
          width: '120px',
          render: (h, scope) => {
            const d = scope.row;
            const { projectType } = this.form;

            let html = scope.row.contractName;

            // console.log('d', d);
            if (d.editRow && !d.invoiceId) {
              html = (
                <el-input
                  class="editInput"
                  value={scope.row[scope.column.property] || ''}
                  onFocus={(val) => {
                    // 当项目种类是以租代建时
                    if (projectType === '3') {
                      this.instionContractData = {};
                      this.instionContractShow = true;
                      this.projectIndex = d.index;
                    } else {
                      this.projectIndex = d.index;
                      this.projectData = {
                        ...this.data,
                        ...this.form,
                      };
                      this.projectShow = true;
                    }
                  }}
                ></el-input>
              );
            }

            return <div>{html}</div>;
          },
        },
        {
          label: '合作合同总金额(含税)',
          prop: 'contractAmount',
          width: '150px',
          hide: false,
        },
        {
          label: '总成本金额',
          prop: 'amountAll',
          hide: true,
          width: '120px',
        },
        {
          label: 'ERP编号',
          prop: 'erpNumber',
          width: '100px',
        },
        {
          label: '费用类型',
          prop: 'amountType',
          width: '120px',
          hide: true,
          render: (h, scope) => {
            const d = scope.row;
            const { invoiceFeeType, instionFeeType } = this.common();
            const { projectType } = this.form;
            const feeOptions = projectType === '3' ? instionFeeType : invoiceFeeType;
            const amountTypeItem = feeOptions.filter((code) => code.id === d.amountType);
            const html = amountTypeItem && amountTypeItem[0] && amountTypeItem[0].name;

            if (d.editRow) {
              return (
                <div>
                  {
                    <el-select
                      class="editInput"
                      value={scope.row[scope.column.property] || ''}
                      onChange={(val) => {
                        this.changeExpandSelect(val, scope.$index, scope);
                      }}
                    >
                      {feeOptions.map((data) => (
                        <el-option label={data.name} value={data.id}></el-option>
                      ))}
                    </el-select>
                  }
                </div>
              );
            }

            return <div>{html}</div>;
          },
        },
        {
          label: '站点名称',
          prop: 'stationName',
          hide: true,
          width: '100px',
        },
        {
          label: '开始日期',
          prop: 'startTime',
          width: '120px',
          hide: true,
        },
        {
          label: '结束日期',
          prop: 'endTime',
          width: '120px',
          hide: true,
        },
        {
          label: '项目剩余开票金额',
          prop: 'remainingInvoicedAmount',
          width: '120px',
        },
        {
          label: '承揽订单',
          prop: 'hireContractId',
          width: '120px',
          hide: false,
          render: (h, scope) => {
            const d = scope.row;
            const html = d.orderName;

            if (d.editRow) {
              return (
                <div>
                  {
                    <el-select
                      class="editInput"
                      value={scope.row[scope.column.property] || ''}
                      onChange={(val) => {
                        this.changeExpandSelect(val, scope.$index, scope);
                      }}
                    >
                      {(scope.row.hireContractList || []).map((data) => (
                        <el-option label={data.orderId} value={data.id}></el-option>
                      ))}
                    </el-select>
                  }
                </div>
              );
            }

            return <div>{html}</div>;
          },
        },
        {
          label: '承揽订单金额',
          prop: 'orderAmount',
          width: '120px',
          hide: false,
        },
        {
          label: '合作比例(%)',
          prop: 'cooperationRatio',
          width: '120px',
        },
        {
          label: '对应总包金额',
          prop: 'totalPackageAmount',
          width: '120px',
          render: (h, scope) => {
            const d = scope.row;
            const html = scope.row.totalPackageAmount;
            const { projectType } = this.form;

            if (d.editRow && projectType === '3' && d.amountType === '1') {
              return (
                <div>
                  {
                    <el-input-number
                      class="editInput"
                      precision={2}
                      controls={false}
                      value={scope.row[scope.column.property] || ''}
                      onInput={(val) => {
                        this.changeExpandInput(val, scope.$index, scope);
                      }}
                    ></el-input-number>
                  }
                </div>
              );
            }

            return <div>{html}</div>;
          },
        },
        {
          label: '分配金额',
          prop: 'distributeAmount',
          width: '120px',
          render: (h, scope) => {
            const d = scope.row;
            const html = scope.row.distributeAmount;

            if (d.editRow) {
              return (
                <div>
                  {
                    <el-input
                      class="editInput"
                      precision={2}
                      controls={false}
                      value={scope.row[scope.column.property] || ''}
                      onInput={(val) => {
                        this.changeExpandInput(val, scope.$index, scope);
                      }}
                    ></el-input>
                  }
                </div>
              );
            }

            return <div>{html}</div>;
          },
        },
      ],
      hireNameShow: false,
      hireNameData: {},
      hireNameTable: {},
      hireNameIndex: -1,
      instionContractShow: false,
      instionContractData: {},
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
    expandTableData: {
      deep: true,
      handler(val) {
        if (val.length === 0) {
          return;
        }
        let invoiceDistributionTotalAmount = 0;

        let totalAmount = 0;

        let remainingAllocationAmount = 0;

        let remainingInvoicedAmount = 0;
        // 1.分配总金额

        this.expandTableData.forEach((data) => {
          remainingAllocationAmount += parseFloat(data.distributionBalance || 0);
          invoiceDistributionTotalAmount += parseFloat(data.invoiceAmount || 0);
          data.expandTableData.forEach((expandData) => {
            totalAmount += parseFloat(expandData.distributeAmount || 0);
            remainingInvoicedAmount += parseFloat(expandData.remainingInvoicedAmount || 0);
          });
        });
        this.form = {
          ...this.form,
          invoiceDistributionTotalAmount,
          totalAmount,
          remainingAllocationAmount,
          remainingInvoicedAmount,
        };
      },
    },
  },
  methods: {
    reqDetail() {
      const { row } = this.data;

      if (row && row.id) {
        detail(row.id).then((res) => {
          if (res && res.code === '200') {
            this.changeExpandTableCols(res.data.projectType);
            this.layout[0].formItems[3].disabled = true;
            this.form = {
              ...this.form,
              ...res.data,
            };
            this.invoiceTableData = res.data.cooperationInvoiceList.map((listItem) => {
              let expandTableData = [];

              if (listItem.cooperationInvoiceDetailDtoList && listItem.cooperationInvoiceDetailDtoList.length > 0) {
                expandTableData = listItem.cooperationInvoiceDetailDtoList.map((dtoItem, dtoIndex) => ({
                  ...dtoItem,
                  index: dtoIndex,
                }));
              }

              return {
                ...listItem,
                expandTableData,
              };
            });
            this.expandTableData = JSON.parse(JSON.stringify(this.invoiceTableData));
          }
        });
      }
    },
    changeExpandTableCols(val) {
      const projectTypeItem = this.common().projectType.filter((project) => project.id === val);

      if (projectTypeItem && projectTypeItem[0]) {
        this.projectType = projectTypeItem[0];
        if (projectTypeItem[0].name === '协作') {
          this.allocationTableCols[8].hide = false;
          this.expandTableCols[1].hide = false;
          this.expandTableCols[2].hide = true;
          this.expandTableCols[4].hide = false;
          this.expandTableCols[5].hide = true;
          this.expandTableCols[6].hide = true;
          this.expandTableCols[7].hide = true;
          this.expandTableCols[8].label = '项目剩余开票金额';
          this.expandTableCols[9].hide = false;
          this.expandTableCols[10].hide = false;
        }
        if (projectTypeItem[0].name === '以租代建') {
          this.allocationTableCols[8].hide = false;
          this.expandTableCols[1].hide = true;
          this.expandTableCols[2].hide = false;
          this.expandTableCols[4].hide = false;
          this.expandTableCols[5].hide = false;
          this.expandTableCols[6].hide = false;
          this.expandTableCols[7].hide = false;
          this.expandTableCols[8].label = '站点剩余开票金额';
          this.expandTableCols[9].hide = true;
          this.expandTableCols[10].hide = true;
        }
        if (projectTypeItem[0].name === '自建') {
          this.allocationTableCols[8].hide = true;
          this.expandTableCols[1].hide = false;
          this.expandTableCols[2].hide = true;
          this.expandTableCols[4].hide = true;
          this.expandTableCols[5].hide = true;
          this.expandTableCols[6].hide = true;
          this.expandTableCols[7].hide = true;
          this.expandTableCols[8].label = '项目剩余开票金额';
          this.expandTableCols[9].hide = false;
          this.expandTableCols[10].hide = false;
        }
      }
    },
    // 添加行
    addRow() {
      console.log('addRow');
      if (this.editRow) {
        this.$notifyError('请先保存当前新增行数据再进行添加操作');

        return;
      }

      this.editRow = true;
      const list = {
        editRow: this.editRow,
      };

      this.invoiceTableData.push(list);
      this.invoiceTableData.splice(1, 0);
    },
    // 操作表单
    tableAction(type, row) {
      const { index, id } = row;

      if (type === 'edit') {
        this.invoiceTableData[index] = {
          ...this.invoiceTableData[index],
          editRow: true,
        };
        this.editRow = true;
        this.invoiceTableData.splice(1, 0);
      }
      if (type === 'save') {
        const { fictitiousInvoice, invoiceType, createTime, invoiceCode, invoiceNumber, noTaxAmount, rate } =
          this.invoiceTableData[index];

        if (
          !fictitiousInvoice ||
          !invoiceType ||
          !createTime ||
          !invoiceCode ||
          !invoiceNumber ||
          !noTaxAmount ||
          !rate
        ) {
          this.$notifyError(
            '请先完整输入信息:虚拟发票、发票类型、开票日期、分包发票代码、分包发票号码、发票金额(不含税)、税率(%)',
          );

          return;
        }
        // 当存在分配合同时
        if (this.invoiceTableData[index].expandTableData) {
          this.invoiceTableData[index].expandTableData = [...this.invoiceTableData[index].expandTableData];
        } else {
          // 当不存在分配合同时
          this.invoiceTableData[index].expandTableData = [];
        }
        this.invoiceTableData[index] = {
          ...this.invoiceTableData[index],
          editRow: false,
        };
        this.editRow = false;
        this.expendEditRow = false;
        this.expandTableData = JSON.parse(JSON.stringify(this.invoiceTableData));
        this.invoiceTableData.splice(1, 0);
      }
      if (type === 'del') {
        if (id) {
          this.$notifyError('该数据不可删除');

          return;
        }
        this.invoiceTableData.splice(index, 1);
        this.editRow = false;
      }
    },
    expendAction(type, row) {
      const { sonIndex, index, data } = row;
      const { id, erpNumber, hireContractId } = data;

      // console.log('expendAction', sonIndex, index, id);

      if (type === 'del') {
        if (id) {
          this.$notifyError('该数据不可删除');

          return;
        }
        this.expandTableData[index].expandTableData.splice(sonIndex, 1);
        this.invoiceTableData = JSON.parse(JSON.stringify(this.expandTableData));
        this.expendEditRow = false;
        this.$nextTick(() => {
          this.countDistributionBalance(index);
        });
      }
      if (type === 'edit') {
        this.expandTableData[index].expandTableData[sonIndex] = {
          ...this.expandTableData[index].expandTableData[sonIndex],
          editRow: true,
        };
        if (this.form.projectType === '2' && !hireContractId && id) {
          getErpNumber(erpNumber).then((res) => {
            if (res && res.code === '200') {
              this.expandTableData[index].expandTableData[sonIndex] = {
                ...this.expandTableData[index].expandTableData[sonIndex],
                hireContractList: res.data,
              };
            }
          });
        }
        this.expendEditRow = true;
        this.expandTableData[index].expandTableData.splice(1, 0);
      }
      if (type === 'save') {
        const { contractName, distributeAmount, amountType, stationName } =
          this.expandTableData[index].expandTableData[sonIndex];

        if (this.projectType.name === '自建') {
          if (!contractName || !distributeAmount) {
            this.$notifyError('请先完整输入信息:合作合同名称、分配金额');

            return;
          }
        } else if (this.projectType.name === '协作') {
          if (!contractName || !distributeAmount || !amountType) {
            this.$notifyError('请先完整输入信息:合作合同名称、分配金额、费用类型');

            return;
          }
        } else if (!contractName || !distributeAmount || !stationName) {
          this.$notifyError('请先完整输入信息:合作合同名称、分配金额、站点名称');

          return;
        }
        // 自动计算：发票剩余分配金额
        let AlldistributeAmount = 0;

        this.expandTableData[index].expandTableData.forEach((dataItem) => {
          AlldistributeAmount += parseFloat(dataItem.distributeAmount);
        });
        const { invoiceAmount } = this.expandTableData[index];

        this.expandTableData[index] = {
          ...this.expandTableData[index],
          distributeAmount: parseFloat(invoiceAmount || 0) - parseFloat(AlldistributeAmount || 0),
        };
        //
        this.expandTableData[index].expandTableData[sonIndex] = {
          ...this.expandTableData[index].expandTableData[sonIndex],
          distributeAmount: Number(distributeAmount).toFixed(2),
          editRow: false,
        };
        this.expendEditRow = false;
        this.expandTableData[index].expandTableData.splice(1, 0);
      }
      if (type === 'addRow') {
        if (this.expendEditRow) {
          this.$notifyError('请先保存当前新增行数据再进行添加操作');

          return;
        }
        // console.log('this.expandTableData[index]', this.expandTableData[index]);
        this.expandTableData[index].expandTableData.push({
          index,
          // 用id判断是否是刚新加的数据
          // id: index,
          editRow: true,
        });
        // console.log('expandTableData', this.expandTableData);
        this.expandTableData.splice(1, 0);
        this.expendEditRow = true;
      }
    },
    // 用户数据选择翻页记忆
    getRowKey(row) {
      return row.id;
    },
    // 输入框改变
    changeInput(val, index, name) {
      this.invoiceTableData[index] = {
        ...this.invoiceTableData[index],
        [name]: val,
      };

      if (name === 'rate' || name === 'noTaxAmount') {
        this.invoiceTableData[index] = {
          ...this.invoiceTableData[index],
          ...this.changeInvoiceAmount({
            ...this.invoiceTableData[index],
          }),
        };
      }

      this.invoiceTableData.splice(1, 0);
    },
    // 下拉框改变
    changeSelect(val, index, name, idName) {
      const item = this.invoiceTableData.map((data, i) => {
        if (i === index) {
          let addObj = {};

          if (idName && val instanceof Object) {
            addObj = {
              [idName]: val.id,
            };
          }

          if (name === 'rate' || name === 'noTaxAmount') {
            addObj = {
              ...addObj,
              [name]: val,
              ...this.changeInvoiceAmount({
                ...data,
                [name]: val,
              }),
            };
          }

          return {
            ...data,
            [name]: val instanceof Object ? val.name : val,
            ...addObj,
          };
        }

        return data;
      });

      // console.log('item', item);
      this.invoiceTableData = item;
    },
    // 动态改变发票税率、发票金额(含税)
    changeInvoiceAmount(data) {
      const { rate, noTaxAmount } = data;

      if (rate && noTaxAmount) {
        const taxRetaValue = rate.split('_')[1];
        const taxAmount = ((parseFloat(noTaxAmount || 0) * parseFloat(taxRetaValue || 0)) / 100).toFixed(2);

        return {
          ...data,
          taxAmount,
          invoiceAmount: parseFloat(noTaxAmount || 0) + parseFloat(taxAmount || 0),
        };
      }

      return {};
    },
    // 子项输入框改变
    changeExpandInput(val, index, scope) {
      // console.log('scope', scope);
      const name = scope.column.property;
      const parentIndex = scope.row.index;
      const { projectType } = this.form;

      this.expandTableData[parentIndex] = {
        ...this.expandTableData[parentIndex],
        expandTableData: this.expandTableData[parentIndex].expandTableData.map((expand, expandIndex) => {
          if (expandIndex === index) {
            if (name === 'distributeAmount') {
              const checkPass = parseFloat(val || 0) > parseFloat(expand.remainingInvoicedAmount || 0);

              if (checkPass) {
                this.$notifyError('分配金额不能大于项目剩余开票金额');

                return {
                  ...expand,
                };
              } else if (projectType === '3' && expand && expand.amountType === '0' && !checkPass) {
                return {
                  ...expand,
                  [name]: val,
                  totalPackageAmount: val,
                };
              } else if (projectType === '3' && expand && expand.amountType === '1' && !checkPass) {
                let { cooperationRatio } = expand;

                if (expand.cooperationRatio.indexOf(',') > -1) {
                  cooperationRatio = expand.cooperationRatio.split(',')[1];
                }
                const checkAmount = parseFloat(val || 0) / parseFloat(cooperationRatio / 100 || 0);

                console.log('checkAmount', checkAmount);

                return {
                  ...expand,
                  [name]: val,
                  totalPackageAmount:
                    cooperationRatio && (Number(cooperationRatio) === 0 ? 0 : Number(checkAmount).toFixed(2)),
                };
              }
              const checkNum = parseFloat(val || 0) / parseFloat(expand.cooperationRatio || 0);

              console.log('expand', expand);

              console.log('checkNum', checkNum);

              return {
                ...expand,
                [name]: val,
                totalPackageAmount:
                  expand.cooperationRatio && (Number(expand.cooperationRatio) === 0 ? 0 : Number(checkNum).toFixed(2)),
              };
            }
          }

          return {
            ...expand,
          };
        }),
      };
      this.expandTableData.splice(1, 0);
      this.invoiceTableData = JSON.parse(JSON.stringify(this.expandTableData));
      this.invoiceTableData.splice(1, 0);
      this.$nextTick(() => {
        this.countDistributionBalance(parentIndex);
      });
    },
    // 子项下拉框改变
    changeExpandSelect(val, index, scope, idName) {
      const name = scope.column.property;
      const parentIndex = scope.row.index;

      // console.log('val', val, index, name);
      const item = this.expandTableData[parentIndex].expandTableData.map(async (data, i) => {
        if (i === index) {
          let addObj = {};

          if (idName && val instanceof Object) {
            addObj = {
              [idName]: val.id,
            };
          }
          if (name === 'amountType') {
            if (!scope.row.contractId) {
              this.$notifyError('请先选择对应的合作合同！');

              return;
            }
            const remainingInvoicedAmount = await this.getFeeData(val, scope.row.contractId || '');

            this.expandTableData[parentIndex].expandTableData[i] = {
              ...this.expandTableData[parentIndex].expandTableData[i],
              [name]: val instanceof Object ? val.name : val,
              remainingInvoicedAmount,
            };
            this.expandTableData.splice(1, 0);
            this.invoiceTableData = JSON.parse(JSON.stringify(this.expandTableData));
            this.$nextTick(() => {
              this.countDistributionBalance(parentIndex);
            });
          }
          if (name === 'hireContractId') {
            const findItem = (scope.row.hireContractList || []).filter(
              (hireContractItem) => hireContractItem.id === val,
            );

            const orderName = findItem && findItem[0] && findItem[0].orderName;
            const orderAmount = findItem && findItem[0] && findItem[0].contractAmount;

            this.expandTableData[parentIndex].expandTableData[i] = {
              ...this.expandTableData[parentIndex].expandTableData[i],
              [name]: val instanceof Object ? val.name : val,
              orderName,
              orderAmount,
            };
            this.expandTableData.splice(1, 0);
            this.invoiceTableData = JSON.parse(JSON.stringify(this.expandTableData));
            this.invoiceTableData.splice(1, 0);
            this.$nextTick(() => {
              this.countDistributionBalance(parentIndex);
            });
          }

          return {
            ...data,
            [name]: val instanceof Object ? val.name : val,
            ...addObj,
          };
        }

        return data;
      });

      // this.expandTableData[parentIndex].expandTableData = item;
    },
    getFeeData(type, id) {
      return new Promise((resolve, reject) => {
        getFee({
          type,
          id,
        }).then((res) => {
          if (res && res.code === '200') {
            resolve(res.data);
          }
        });
      });
    },
    closeHireName() {
      this.hireNameShow = false;
      // this.hireNameIndex = -1;
      this.hireNameData = [];
    },
    successHireName(selectTable) {
      // console.log('selectTable', selectTable, this.hireNameIndex);
      this.hireNameTable = selectTable;
      const targetTable = this.expandTableData[this.hireNameIndex].expandTableData;

      targetTable[targetTable.length - 1] = {
        ...targetTable[targetTable.length - 1],
        orderName: selectTable.orderName,
        hireContractId: selectTable.orderId,
        cooperationRatio: selectTable.cooperationRatio,
        totalPackageAmount: selectTable.totalPackageAmount,
        // 承揽订单金额
        orderAmount: selectTable.orderAmount,
      };
      this.expandTableData[this.hireNameIndex].expandTableData.splice(1, 0);
      this.$nextTick(() => {
        this.closeHireName();
      });
    },
    // 关闭合作合同
    closeProject() {
      this.projectShow = false;
      this.projectData = {};
    },
    // 成功合作合同
    successProject(selectTable) {
      // console.log('selectTable', selectTable, this.projectIndex);
      // console.log(
      //   'this.expandTableData[this.projectIndex]',
      //   this.projectIndex,
      //   this.expandTableData[this.projectIndex],
      // );
      this.selectTable = selectTable;
      const tagetList = this.expandTableData[this.projectIndex].expandTableData;

      tagetList[tagetList.length - 1] = {
        ...tagetList[tagetList.length - 1],
        erpNumber: selectTable.erpNumber,
        contractAmount: selectTable.contractAllAmount,
        stationName: selectTable.stationName,
        remainingInvoicedAmount: selectTable.remainingInvoicedAmount,
        contractName: selectTable.contractName,
        contractId: selectTable.contractId,
        cooperationContractId: selectTable.contractId,
        cooperationRatio: selectTable.cooperationRatio,
        totalPackageAmount: selectTable.totalPackageAmount,
        hireContractList: selectTable.hireContractList,
        amountType: null,
        hireContractId: null,
        orderName: null,
        orderAmount: null,
      };
      tagetList.splice(1, 0);
      this.invoiceTableData = JSON.parse(JSON.stringify(this.expandTableData));
      this.closeProject();
      this.countDistributionBalance(this.projectIndex);
    },
    // 关闭合作合同
    closeInstionContract() {
      this.instionContractShow = false;
      this.instionContractData = {};
    },
    // 成功合作合同
    successInstionContract(selectTable) {
      console.log('selectTable', selectTable, this.projectIndex);
      // console.log(
      //   'this.expandTableData[this.projectIndex]',
      //   this.projectIndex,
      //   this.expandTableData[this.projectIndex],
      // );
      this.selectTable = selectTable;
      const tagetList = this.expandTableData[this.projectIndex].expandTableData;

      tagetList[tagetList.length - 1] = {
        ...tagetList[tagetList.length - 1],
        erpNumber: selectTable.erpNumber,
        contractAmount: selectTable.contractAllAmount,
        stationName: selectTable.stationName,
        remainingInvoicedAmount: selectTable.remainingInvoicedAmount,
        contractName: selectTable.contractName,
        contractId: selectTable.contractId,
        cooperationContractId: selectTable.contractId,
        cooperationRatio: selectTable.cooperationRatio,
        totalPackageAmount: selectTable.totalPackageAmount,
        hireContractList: selectTable.hireContractList,
        amountAll: selectTable.amountAll,
        startTime: selectTable.startTime,
        endTime: selectTable.endTime,
        amountType: selectTable.amountType,
        costId: selectTable.costId,
        costType: selectTable.costType,
        hireContractId: null,
        orderName: null,
        orderAmount: null,
      };
      tagetList.splice(1, 0);
      this.invoiceTableData = JSON.parse(JSON.stringify(this.expandTableData));
      this.closeInstionContract();
      this.countDistributionBalance(this.projectIndex);
    },
    countDistributionBalance(projectIndex) {
      // let distributionBalance = 0;

      let amountAllocated = 0;

      this.expandTableData[projectIndex].expandTableData.forEach((item) => {
        // distributionBalance += parseFloat(item.remainingInvoicedAmount || 0);
        amountAllocated += parseFloat(item.distributeAmount || 0);
      });
      const { invoiceAmount } = this.invoiceTableData[projectIndex];

      this.invoiceTableData[projectIndex] = {
        ...this.invoiceTableData[projectIndex],
        distributionBalance: parseFloat(invoiceAmount || 0) - parseFloat(amountAllocated || 0),
        amountAllocated,
      };
      this.expandTableData = JSON.parse(JSON.stringify(this.invoiceTableData));
      this.expandTableData.splice(1, 0);
      this.invoiceTableData.splice(1, 0);
    },
    submitFormItem() {
      this.$refs.supplyFormItem.submitForm();
    },
    submitForm(val) {
      console.log('this.data', this.data);
      const { configType, row } = this.data;
      // 合作发票集合

      let checkDtoList = false;
      const cooperationInvoiceList = this.expandTableData.map((expandTableData) => {
        // 合作发票合同集合
        const cooperationInvoiceDetailDtoList = expandTableData.expandTableData.map((cooperationInvoiceDetailDto) => ({
          ...cooperationInvoiceDetailDto,
        }));

        if (cooperationInvoiceDetailDtoList.length === 0) {
          checkDtoList = true;
        }
        const returnParames = {
          ...expandTableData,
          // rate: expandTableData.rate.split('_')[1],
          cooperationInvoiceDetailDtoList,
        };

        delete returnParames.expandTableData;

        return returnParames;
      });

      if (checkDtoList) {
        this.$notifyError('请先在分配发票下绑定对应的合作合同！');

        return;
      }
      let param = {
        ...val,
        cooperationInvoiceList,
      };

      const message = configType === 'add' ? '新增成功' : '修改成功';

      let api = add;

      if (configType !== 'add') {
        api = update;
        param = {
          ...param,
          id: this.form.id,
        };
      }
      api(param).then((res) => {
        if (res && res.code === '200') {
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
    cancelForm() {
      this.form = {};
      this.$refs.supplyFormItem.cancelForm();
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
  /deep/.comp-page-table {
    min-height: auto;
    td {
      &.el-table__expanded-cell {
        padding-left: 48px;
        padding-top: 0;
        padding-bottom: 0;
        border-right: none;
      }
    }
    &.childPageTable {
      padding: 0;
      border: 1px solid #fce8e0;
      border-top: none;
      border-right: none;
      border-bottom: none;
      margin-bottom: 0;
      th {
        background: #fff2ed;
        border-color: #fce8e0;
      }
      tbody {
        tr {
          td {
            border-color: #fce8e0;
          }
          &:nth-of-type(2n) {
            background: #fffbfa;
          }
        }
      }
    }
    .expandInfo {
      .addRow {
        height: 36px;
        background: #ffffff;
        border: 1px solid #fce8e0;
        cursor: pointer;
        .iconfont {
          font-size: 10px;
          color: #f14d51;
          margin-right: 10px;
        }
        .text {
          font-size: 12px;
          font-family: PingFangSC, PingFangSC-Regular;
          font-weight: 400;
          text-align: left;
          color: #ef2d32;
        }
      }
    }
  }
}
</style>
<style lang="less">
.subpackageProjectSelect,
.instionContractSelect {
  #PageTable {
    max-height: 500px;
    overflow-y: auto;
  }
}
</style>
