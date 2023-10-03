<template>
  <div id="base">
    <FormItem
      ref="supplyFormItem"
      :layout="layout"
      :rules="formRules"
      :disabled="inputDisabled"
      :isEdit="isEdit"
      :form.sync="form"
      :labelWidth="'140px'"
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
    </FormItem>
    <Flex class="writeTable">
      <div class="cooperationInvoice_left">
        <wrapper :key="'firstTable'" :title="'真实发票信息'" :isFold="false">
          <!-- 页面 -->
          <div class="content-view">
            <div class="Modeltable">
              <page-table
                ref="realPageTable"
                col-align="left"
                operator-width="110"
                :loading="loading"
                :data="tableData"
                :cols="tableCols"
                :selection="false"
                :operator="false"
                :hideDefaultIndex="true"
                reserveSelection
                :row-key="getRowKey"
                highlightCurrentRow
                :showPage="false"
                :tableHeight="220"
                @row-click="onRowClick"
              >
              </page-table>
              <div v-show="false" class="nonedata">
                <div>
                  <img src="~common/images/emptyData.png" alt="" />
                  <p>暂无数据，晚点再来吧</p>
                </div>
              </div>
            </div>
          </div>
        </wrapper>
      </div>
      <div class="cooperationInvoice_right">
        <wrapper :key="'secondTable'" :title="'需核销虚拟发票'" :isFold="false">
          <otherBtnList
            style="margin-bottom: 12px"
            v-if="selectTableIndex !== null && selectTableIndex !== undefined && !inputDisabled"
          >
            <ul class="flexRow">
              <li
                v-for="(item, index) in writeOtherBtnLists"
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
          <!-- 页面 -->
          <div class="content-view">
            <div class="Modeltable">
              <page-table
                :key="rightKey"
                ref="rightTopTable"
                col-align="left"
                operator-width="110"
                :loading="rightTopLoading"
                :data="tableData[selectTableIndex] ? tableData[selectTableIndex].writeOffInvoiceRelationList : []"
                :cols="rightTopTableCols"
                :selection="false"
                :operator="!inputDisabled"
                :showPage="false"
                :hideDefaultIndex="true"
                reserveSelection
                highlightCurrentRow
                :row-key="getRowKey"
                @row-click="onRowRightClick"
              >
                <template slot-scope="scope" slot="operator">
                  <flex>
                    <el-button
                      type="text"
                      size="small"
                      title="删除"
                      icon="iconfont icon-shanchu"
                      v-if="!scope.row.id"
                      @click.prevent.stop="
                        tableRightAction('del', {
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
            </div>
          </div>
        </wrapper>
        <wrapper :key="'threeTable'" :title="'虚拟发票对应项目'" :isFold="false">
          <div class="content-view">
            <div class="Modeltable rightBottomTable">
              <page-table
                ref="rightBottomTable"
                col-align="left"
                operator-width="110"
                :loading="rightBottomLoading"
                :data="
                  tableData[selectTableIndex] &&
                  tableData[selectTableIndex].writeOffInvoiceRelationList &&
                  tableData[selectTableIndex].writeOffInvoiceRelationList[rightTopIndex]
                    ? tableData[selectTableIndex].writeOffInvoiceRelationList[rightTopIndex]
                        .writeOffInvoiceRelationDetailList
                    : []
                "
                :cols="rightBottomTableCols"
                :selection="false"
                :operator="false"
                :showPage="false"
                :hideDefaultIndex="true"
                reserveSelection
                :row-key="getRowKey"
              >
              </page-table>
              <div class="flexRow flexCenter addRow" v-if="false" @click="() => tableRightAction('addRow', {})">
                <span class="iconfont icon-jiahao" />
                <span class="text">添加数据</span>
              </div>
            </div>
          </div>
        </wrapper>
      </div>
    </Flex>
    <subpackageInvoice
      :show="subShow"
      :data="subData"
      @cancel="closeSub"
      @success="successSub"
      :highlightCurrentRow="false"
    />
  </div>
</template>

<script>
import subpackageInvoice from '@/view/common/subpackage/subpackageInvoice';
import Wrapper from '@/components/wrapper';
import FormItem from '@/components/formItem';
import PageTable from '@/components/page-table';
import otherBtnList from '@/components/headerTitle/otherBtnList';
import Flex from '@/components/flex';
import { filterRepeat } from '@/util/util';
import { detail, update, add } from '@/api/spliptInvoice/subpackageBatchManagement/writeOff.js';

export default {
  name: 'baseInfo',
  components: {
    Wrapper,
    FormItem,
    PageTable,
    Flex,
    otherBtnList,
    subpackageInvoice,
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
      inputDisabled: configType === 'detailWriteOff',
      isEdit: ['addWriteOff', 'editWriteOff'].includes(configType),
      isAdd: ['addWriteOff'].includes(configType),
      form: {},
      invoiceOtherBtnLists: [
        {
          label: '新增',
          click: () => this.addRow(),
        },
      ],
      writeOtherBtnLists: [
        {
          label: '新增',
          click: () => this.addWriteRow(),
        },
      ],
      layout: [
        {
          title: '发票批次信息',
          formItems: [
            {
              label: '发票总分配金额',
              prop: 'totalAmount',
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
              options: this.common().projectType,
              span: 12,
              onChange: (val) => {
                this.changeRightBottomTableCols(val);
              },
            },
          ],
        },
        {
          title: '',
          render: 'invoice',
        },
        {
          title: '核销信息',
          formItems: [
            {
              label: '虚拟发票已分配总金额',
              prop: 'totalDistribution',
              disabled: true,
              inputType: 'input',
              span: 12,
            },
            {
              label: '虚拟发票核销总金额',
              prop: 'totalWriteOffAmount',
              disabled: true,
              inputType: 'input',
              span: 12,
            },
            {
              label: '虚拟发票待核销金额',
              prop: 'amountToBeWrittenOff',
              disabled: true,
              inputType: 'input',
              span: 12,
            },
          ],
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
      invoiceTableData: [],
      invoiceTableCols: [
        {
          label: '虚拟发票',
          prop: 'fictitiousInvoice',
          hide: true,
          render: (h, scope) => {
            const d = scope.row;
            const html = scope.row.fictitiousInvoice;
            const { isJudge } = this.common();

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
          prop: 'invoiceType',
          width: '100px',
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
      tableData: [],
      // tableData: [
      //   {
      //     createTime: '2022-09-09',
      //     editRow: true,
      //     fictitiousInvoice: '1',
      //     invoiceAmount: 1030,
      //     invoiceCode: '111',
      //     invoiceNumber: '111',
      //     invoiceType: 'invoice_type_01',
      //     noTaxAmount: 1000,
      //     rate: '3',
      //     taxAmount: '30.00',
      //   },
      // ],
      tableCols: [
        {
          label: '分包发票代码',
          prop: 'invoiceCode',
        },
        {
          label: '分包发票号码',
          prop: 'invoiceNumber',
        },
      ],
      selectTableData: {},
      selectTableIndex: null,
      loading: false,
      rightBottomLoading: false,
      rightTopLoading: false,
      rightKey: 0,
      rightTopTableCols: [
        {
          label: '虚拟发票',
          prop: 'fictitiousInvoice',
          render: (h, scope) => {
            const fictitiousInvoice = this.common().isJudge.filter(
              (status) => status.id === scope.row.fictitiousInvoice || status.name === scope.row.fictitiousInvoice,
            );

            return <div>{fictitiousInvoice && fictitiousInvoice[0] && fictitiousInvoice[0].name}</div>;
          },
          align: 'center',
        },
        {
          label: '开票日期',
          prop: 'createTime',
          align: 'center',
          width: '110px',
        },
        {
          label: '分包发票代码',
          prop: 'invoiceCode',
          align: 'center',
          width: '110px',
        },
        {
          label: '分包发票号码',
          prop: 'invoiceNumber',
          align: 'center',
          width: '110px',
        },
        {
          label: '发票金额(不含税)',
          prop: 'noTaxAmount',
          width: '120px',
          align: 'center',
        },
        {
          label: '发票税额',
          prop: 'taxAmount',
          align: 'center',
          width: '110px',
        },
        {
          label: '税率(%)',
          prop: 'rate',
          align: 'center',
          width: '110px',
          render: (h, scope) => {
            const params = this.common().taxRateCode.filter((ele) => ele.code === scope.row.rate);

            return <div>{params && params[0] && params[0].name}</div>;
          },
        },
        {
          label: '发票金额(含税)',
          prop: 'invoiceAmount',
          width: '110px',
          align: 'center',
        },
        {
          label: '已分配金额',
          prop: 'amountAllocated',
          align: 'center',
          width: '110px',
        },
        {
          label: '发票剩余金额',
          prop: 'invoiceBalance',
          width: '110px',
          align: 'center',
        },
        {
          label: '已核销金额',
          prop: 'amountWrittenOff',
          align: 'center',
          width: '110px',
        },
        {
          label: '待核销金额',
          prop: 'amountToBeWrittenOff',
          width: '110px',
          align: 'center',
        },
      ],
      rightTopData: {},
      rightTopIndex: -1,
      rightBottomTableCols: [
        {
          label: '核销金额',
          prop: 'writeOffAmount',
          align: 'center',
          render: (h, scope) => {
            const d = scope.row;

            let html = d.writeOffAmount;

            if (true) {
              html = (
                <el-input-number
                  class="editInput"
                  precision={2}
                  disabled={!this.isEdit}
                  controls={false}
                  value={scope.row[scope.column.property] || undefined}
                  onInput={(val) => {
                    this.changeRightBottomInput(val, scope.$index, scope);
                  }}
                ></el-input-number>
              );
            }

            return <div>{html}</div>;
          },
        },
        {
          label: '待核销金额',
          prop: 'amountToBeWrittenOff',
          align: 'center',
        },
        {
          label: '分配金额',
          prop: 'allocationAmount',
          align: 'center',
        },
        {
          label: '合作合同名称',
          prop: 'contractName',
          align: 'center',
        },
        {
          label: 'ERP编号',
          prop: 'erpNumber',
          align: 'center',
        },
        {
          label: '费用类型',
          prop: 'amountType',
          hide: true,
          render: (h, scope) => {
            const d = scope.row;

            const { invoiceFeeType } = this.common();
            const amountTypeItem = invoiceFeeType.filter((code) => code.id === d.amountType);

            const html = amountTypeItem && amountTypeItem[0] && amountTypeItem[0].name;

            return <div>{html}</div>;
          },
        },
        {
          label: '站点名称',
          prop: 'stationName',
          hide: true,
        },
        {
          label: '承揽订单',
          prop: 'hireContractName',
          align: 'center',
          render: (h, scope) => <div>{scope.row.hireContractName || scope.row.orderName}</div>,
        },
      ],
      subShow: false,
      subData: {},
      subProjectShow: false,
      subProjectData: {},
    };
  },
  mounted() {
    // this.$nextTick(() => {
    // });
  },
  watch: {
    data(val) {
      // this.data = val;
      this.inputDisabled = val.configType === 'detailWriteOff';
      this.isEdit = ['addWriteOff', 'editWriteOff'].includes(val.configType);
      this.isAdd = ['addWriteOff'].includes(val.configType);
      if (!this.isAdd) {
        this.reqDetail();
      }
    },
    invoiceTableData: {
      deep: true,
      handler(val) {
        if (val.length === 0) {
          return;
        }
        let totalAmount = 0;

        let totalDistribution = 0;

        let totalWriteOffAmount = 0;

        let amountToBeWrittenOff = 0;

        this.invoiceTableData.forEach((data) => {
          totalAmount += parseFloat(data.invoiceAmount || 0);
          (data.writeOffInvoiceRelationList || []).forEach((writeOffItem) => {
            totalDistribution += parseFloat(writeOffItem.amountAllocated || 0);
            totalWriteOffAmount += parseFloat(writeOffItem.amountWrittenOff || 0);
            amountToBeWrittenOff += parseFloat(writeOffItem.amountToBeWrittenOff || 0);
          });
        });
        // 1、虚拟发票核销总金额：等于各个虚拟发票本次核销金额累加

        // 2、真实发票剩余金额：等于发票总金额-虚拟发票核销总金额

        // 3、虚拟发票待核销金额：等于每张虚拟发票待核销金额累加
        this.form = {
          ...this.form,
          totalAmount,
          totalDistribution,
          totalWriteOffAmount,
          amountToBeWrittenOff,
        };
      },
    },
    // tableData: {
    //   deep: true,
    //   handler(val, oldVal) {
    //     console.log('tableData', val.length === 0 || JSON.stringify(val) === JSON.stringify(oldVal), val, oldVal);
    //     if (val.length === 0 || JSON.stringify(val) === JSON.stringify(oldVal)) {
    //     }
    //   },
    // },
  },
  methods: {
    reqDetail() {
      const { row } = this.data;

      if (row && row.id) {
        detail(row.id).then((res) => {
          if (res && res.code === '200') {
            this.changeRightBottomTableCols(res.data.projectType);
            this.form = {
              ...this.form,
              ...res.data,
            };
            this.invoiceTableData = res.data.writeOffInvoiceList;
            this.tableData = this.invoiceTableData;
            this.$nextTick(() => {
              if (this.tableData.length > 0) {
                this.$refs.realPageTable.onSetCurrentRow(this.tableData[0].id);
                this.onRowClick(this.tableData[0]);
                if (this.tableData[0].writeOffInvoiceRelationList.length > 0) {
                  this.$nextTick(() => {
                    this.$refs.rightTopTable.onSetCurrentRow(this.tableData[0].writeOffInvoiceRelationList[0].id);
                    this.onRowRightClick(this.tableData[0].writeOffInvoiceRelationList[0]);
                  });
                }
              }
            });
          }
        });
      }
    },
    changeRightBottomTableCols(val) {
      const projectTypeItem = this.common().projectType.filter((project) => project.id === val);

      if (projectTypeItem && projectTypeItem[0]) {
        this.projectType = projectTypeItem[0];
        if (projectTypeItem[0].name === '协作') {
          this.rightBottomTableCols[5].hide = false;
          this.rightBottomTableCols[6].hide = true;
        }
        if (projectTypeItem[0].name === '以租待建') {
          this.rightBottomTableCols[5].hide = true;
          this.rightBottomTableCols[6].hide = false;
        }
        if (projectTypeItem[0].name === '自建') {
          this.rightBottomTableCols[5].hide = true;
          this.rightBottomTableCols[6].hide = true;
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

      this.invoiceTableData.unshift(list);
      this.invoiceTableData.splice(1, 0);
    },
    // 添加行
    addWriteRow() {
      this.subShow = true;
      this.subData = {
        parames: {
          projectType: this.form.projectType,
        },
      };
    },
    // 操作表单
    tableAction(type, row) {
      console.log('row', row);
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
        const { invoiceType, createTime, invoiceCode, invoiceNumber, noTaxAmount, rate } = this.invoiceTableData[index];

        if (!invoiceType || !createTime || !invoiceCode || !invoiceNumber || !noTaxAmount || !rate) {
          this.$notifyError(
            '请先完整输入信息:虚拟发票、发票类型、开票日期、分包发票代码、分包发票号码、发票金额(不含税)、税率(%)',
          );

          return;
        }
        this.invoiceTableData[index] = {
          ...this.invoiceTableData[index],
          editRow: false,
        };
        this.tableData = this.invoiceTableData;
        this.editRow = false;
        this.invoiceTableData.splice(1, 0);
        this.tableData.splice(1, 0);
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
    tableRightAction(type, row) {
      const { index, data } = row;
      const { id } = data;

      if (type === 'addRow') {
        if (this.rightTopIndex === -1) {
          this.$notifyError('请先选中需核销虚拟发票');

          return;
        }
        this.subProjectShow = true;
        this.subProjectData = {};
      }
      if (type === 'del') {
        if (id) {
          this.$notifyError('该数据不可删除');

          return;
        }
        if (
          this.tableData[this.selectTableIndex] &&
          this.tableData[this.selectTableIndex].writeOffInvoiceRelationList
        ) {
          this.tableData[this.selectTableIndex].writeOffInvoiceRelationList.splice(index, 1);
        }
        this.tableData.splice(1, 0);
        this.$refs.rightBottomTable.doLayout();
      }
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
      console.log('val', val, index, name);
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

      this.invoiceTableData = item;
    },
    // 用户数据选择翻页记忆
    getRowKey(row) {
      return row.id;
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
    submitFormItem() {
      this.$refs.supplyFormItem.submitForm();
    },
    submitForm(val) {
      console.log('this.data', this.data);
      const { configType, row } = this.data;
      const id = configType === 'addWriteOff' ? '' : this.form.id;

      let checkDtoList = false;

      let checkDtoDetailList = false;

      this.tableData.forEach((tableItem) => {
        if (!tableItem.writeOffInvoiceRelationList || tableItem.writeOffInvoiceRelationList.length === 0) {
          checkDtoList = true;
        }
        tableItem.writeOffInvoiceRelationList.forEach((dtoItem) => {
          dtoItem.writeOffInvoiceRelationDetailList.forEach((detailItem) => {
            if (!detailItem.writeOffAmount || parseFloat(detailItem.writeOffAmount) === 0) {
              checkDtoDetailList = true;
            }
          });
        });
      });
      if (checkDtoList) {
        this.$notifyError('请先在核销发票下绑定对应的需核销虚拟发票！');

        return;
      }
      if (checkDtoDetailList) {
        this.$notifyError('核销金额不能为0！');

        return;
      }
      let param = {
        ...val,
        writeOffInvoiceList: this.tableData,
      };
      const message = configType === 'addWriteOff' ? '新增成功' : '修改成功';

      let api = add;

      if (configType !== 'addWriteOff') {
        api = update;
        param = {
          ...param,
          id,
        };
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
    cancelForm() {
      this.form = {};
      this.$refs.supplyFormItem.cancelForm();
    },
    // 子项输入框改变
    changeRightBottomInput(val, index, scope) {
      // console.log('changeRightBottomInput', val, index, scope);
      if (!val) {
        return;
      }
      const name = scope.column.property;
      const { row } = scope;
      const targetTable =
        this.tableData[this.selectTableIndex].writeOffInvoiceRelationList[this.rightTopIndex]
          .writeOffInvoiceRelationDetailList;
      const { allocationAmount } = row;

      targetTable[index] = {
        ...targetTable[index],
        [name]: val,
        amountToBeWrittenOff: parseFloat(allocationAmount || 0) - parseFloat(val || 0),
      };
      this.tableData.splice(1, 0);
      this.$nextTick(() => {
        this.changeSumData();
      });
    },
    changeSumData() {
      if (
        this.tableData[this.selectTableIndex] &&
        this.tableData[this.selectTableIndex].writeOffInvoiceRelationList &&
        this.tableData[this.selectTableIndex].writeOffInvoiceRelationList[this.rightTopIndex]
      ) {
        const tagerItem = this.tableData[this.selectTableIndex].writeOffInvoiceRelationList[this.rightTopIndex];
        const { invoiceAmount } = tagerItem;

        let amountAllocated = 0;

        let amountWrittenOff = 0;

        tagerItem.writeOffInvoiceRelationDetailList.forEach((item) => {
          amountAllocated += parseFloat(item.allocationAmount || 0);
          amountWrittenOff += parseFloat(item.writeOffAmount || 0);
        });
        // 1、核销金额：等于该虚拟发票关联项目所核销金额

        // 1、已分配金额：等于该虚拟发票对应项目分配金额；

        // 3、发票剩余金额：等于发票金额(含税)-已分配金额

        // 4、已核销金额：等于该发票对应项目核销金额，

        // 5、待核销金额：等于该虚拟 发票已分配金额-已核销金额
        this.tableData[this.selectTableIndex].writeOffInvoiceRelationList[this.rightTopIndex] = {
          ...this.tableData[this.selectTableIndex].writeOffInvoiceRelationList[this.rightTopIndex],
          amountAllocated,
          invoiceBalance: parseFloat(invoiceAmount || 0) - parseFloat(amountAllocated || 0),
          amountWrittenOff,
          amountToBeWrittenOff: parseFloat(amountAllocated || 0) - parseFloat(amountWrittenOff || 0),
        };
        this.tableData[this.selectTableIndex].writeOffInvoiceRelationList.splice(1, 0);
        console.log(
          'this.tableData[this.selectTableIndex].writeOffInvoiceRelationList[this.rightTopIndex]',
          this.tableData,
        );
        this.invoiceTableData = JSON.parse(JSON.stringify(this.tableData));
        this.invoiceTableData.splice(1, 0);
        this.$refs.rightTopTable.doLayout();
        this.$refs.rightBottomTable.doLayout();
      }
    },
    onRowClick(row, column, event) {
      this.selectTableData = row;
      this.selectTableIndex = this.tableData.findIndex((data) => data.invoiceCode === row.invoiceCode);
    },
    onRowRightClick(row, column, event) {
      this.rightTopData = row;
      const targetTable = this.tableData[this.selectTableIndex].writeOffInvoiceRelationList;

      this.rightTopIndex = targetTable.findIndex((data) => data.invoiceCode === row.invoiceCode);
    },
    closeSub() {
      this.subShow = false;
      this.subData = {};
    },
    successSub(subTable) {
      // this.subTable = subTable;
      const targetTable = this.tableData[this.selectTableIndex].writeOffInvoiceRelationList || [];

      subTable.forEach((subIndex) => {
        const subItem = {
          ...subIndex,
          writeOffInvoiceRelationDetailList: filterRepeat(subIndex.writeOffInvoiceRelationDetailList),
        };

        const subFindexIndex = targetTable.findIndex((tableItem) => tableItem.invoiceId === subIndex.invoiceId);

        if (subFindexIndex > -1) {
          this.tableData[this.selectTableIndex].writeOffInvoiceRelationList[subFindexIndex] = {
            ...this.tableData[this.selectTableIndex].writeOffInvoiceRelationList[subFindexIndex],
            ...subItem,
          };
        } else {
          this.tableData[this.selectTableIndex] = {
            ...this.tableData[this.selectTableIndex],
            writeOffInvoiceRelationList: [
              ...(this.tableData[this.selectTableIndex].writeOffInvoiceRelationList || []),
              { ...subItem },
            ],
          };
        }
      });
      this.tableData[this.selectTableIndex].writeOffInvoiceRelationList.splice(1, 0);
      // console.log('222', this.tableData[this.selectTableIndex].writeOffInvoiceRelationList[this.rightTopIndex]);
      let totalDistribution = 0;

      let totalWriteOffAmount = 0;

      let amountToBeWrittenOff = 0;

      targetTable.forEach((tableItem) => {
        totalDistribution += parseFloat(tableItem.amountAllocated || 0);
        totalWriteOffAmount += parseFloat(tableItem.amountWrittenOff || 0);
        amountToBeWrittenOff += parseFloat(tableItem.amountToBeWrittenOff || 0);
      });
      this.form = {
        ...this.form,
        totalDistribution,
        totalWriteOffAmount,
        amountToBeWrittenOff,
      };
      this.closeSub();
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
  }
  /deep/.writeTable {
    justify-content: space-between !important;
    .cooperationInvoice_left {
      width: 25%;
    }
    .cooperationInvoice_right {
      width: calc(75% - 20px);
    }
  }
  .Modeltable {
    &.rightBottomTable {
      padding: 10px 16px;
      border: 1px solid;
      border-image: linear-gradient(180deg, #dddddd, #d5d5d5) 1 1;
      .comp-page-table {
        margin-bottom: 0;
        padding: 0;
        border: none;
        /deep/.el-input-number {
          width: 100%;
          .el-input__inner {
            text-align: left;
          }
        }
      }
    }
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
</style>
