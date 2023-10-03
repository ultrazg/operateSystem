<template>
  <div id="base">
    <FormItem
      ref="supplyFormItem"
      :layout="layout"
      :rules="formRules"
      :disabled="inputDisabled"
      :isEdit="isEdit"
      :labelWidth="'140px'"
      :form.sync="form"
      @submit="(form) => formItemSubmitForm(form, 'supplyFormItem')"
    >
      <!-- 绑定承揽框架 -->
      <template slot="hireFramework">
        <otherBtnList v-if="data.configType !== 'detail'">
          <ul class="flexRow">
            <li
              v-for="(item, index) in hireFrameworkBtnLists"
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
          ref="hireFrameworkTable"
          col-align="left"
          :data="hireFrameworkData"
          :cols="hireFrameworkCols"
          :selection="false"
          :operator="data.configType !== 'detail'"
          :showPage="false"
          operator-width="110"
          :hideDefaultIndex="true"
          reserveSelection
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
                  tableFrameworkAction('edit', {
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
                  tableFrameworkAction('save', {
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
                  tableFrameworkAction('del', {
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

      <!-- 采购需求(单位:元) -->
      <template slot="purchaseDemandFramework">
        <otherBtnList v-if="data.configType !== 'detail'">
          <ul class="flexRow">
            <li
              v-for="(item, index) in purchaseDemandBtnLists"
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
          ref="procurementResultsTable"
          col-align="left"
          :data="purchaseDemandTableData"
          :cols="purchaseDemandTableCols"
          :selection="false"
          :operator="data.configType !== 'detail'"
          :showPage="false"
          operator-width="80"
          :hideDefaultIndex="true"
          reserveSelection
        >
          <template slot-scope="scope" slot="operator">
            <flex>
              <el-button
                type="text"
                size="small"
                title="编辑"
                icon="iconfont icon-bianji"
                v-if="!scope.row.editPurchaseDemandRow"
                @click.prevent.stop="
                  tablePurchaseDemandAction('edit', {
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
                v-if="scope.row.editPurchaseDemandRow"
                icon="iconfont icon-baocun1"
                @click.prevent.stop="
                  tablePurchaseDemandAction('save', {
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
                  tablePurchaseDemandAction('del', {
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
    <!-- <wrapper :key="'purchaseDemand'" :title="'采购需求(单位:元)'" :isFold="false">

    </wrapper> -->

    <!-- 采购结果(单位:元) -->
    <wrapper :key="'procurementResults'" :title="'采购结果(单位:元)'" :isFold="false">
      <otherBtnList v-if="data.configType !== 'detail'">
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
        ref="procurementResultsTable"
        col-align="left"
        :data="tableData"
        :cols="tableCols"
        :selection="false"
        :operator="data.configType !== 'detail'"
        :showPage="false"
        operator-width="80"
        :hideDefaultIndex="true"
        reserveSelection
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

    <!-- 备注 -->
    <FormItem
      ref="remarkFormItem"
      :layout="remarkFormItemLayout"
      :rules="remarkFormItemFormRules"
      :disabled="inputDisabled"
      :isEdit="isEdit"
      :form.sync="form"
      @submit="(form) => formItemSubmitForm(form, 'remarkFormItem')"
    />
    <hireFrameWorkSelect
      ref="hireFrameWorkSelect"
      :highlightCurrentRow="false"
      :show="hireFrameWorkShow"
      :data="hireFrameWorkData"
      @cancel="closehireFrameWork"
      @success="successhireFrameWork"
    />
    <frameworkUnits :show="unitShow" :data="unitData" @cancel="closeEdit" @success="successEdit" />
  </div>
</template>

<script>
import FormItem from '@/components/formItem';
import Wrapper from '@/components/wrapper';
import PageTable from '@/components/page-table';
import Flex from '@/components/flex';
import hireFrameWorkSelect from '@/view/common/hireFrameWorkSelect';
import frameworkUnits from '@/view/common/frameworkUnits';
import otherBtnList from '@/components/headerTitle/otherBtnList';
import { getPurchaseInfoById, editPurchase, addPurchase } from '@/api/marketMiddleStage/purchaseList';
export default {
  name: 'baseInfo',
  components: {
    FormItem,
    Wrapper,
    PageTable,
    otherBtnList,
    Flex,
    hireFrameWorkSelect,
    frameworkUnits,
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
        proportion: 0,
      },
      layout: [
        {
          title: '项目概况',
          formItems: [
            {
              label: '采购项目编号',
              prop: 'purchaseProdId',
              inputType: 'input',
              disabled: true,
              span: 12,
            },
            {
              label: '采购项目名称',
              prop: 'prodName',
              inputType: 'input',
              span: 12,
            },
            {
              label: '所属生产中心',
              prop: 'productionCenter',
              inputType: 'select',
              span: 12,
              options: this.common().productionCenterCode,
            },
            {
              label: '项目归属',
              prop: 'projectBelong',
              inputType: 'select',
              span: 12,
              options: this.common().projectBelong,
            },
            {
              label: '省份',
              prop: 'province',
              inputType: 'select',
              span: 12,
              options: this.common().provincialAllCode,
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
              multiple: true,
              onChange: (val) => {
                this.form = {
                  ...this.form,
                  city: val,
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
              label: '项目预估收入(不含税)',
              prop: 'prodIncome',
              inputType: 'input',
              span: 12,
            },
            {
              label: '年度',
              prop: 'year',
              inputType: 'input',
              span: 12,
            },
            {
              label: '甲方项目编号',
              prop: 'prodId',
              hide: true,
              inputType: 'input',
              span: 12,
            },
            {
              label: '项目工期',
              prop: 'prodDate',
              inputType: 'input',
              span: 12,
            },
            {
              label: '税率',
              prop: 'taxRate',
              inputType: 'select',
              multiple: true,
              span: 12,
              options: this.common().taxRateCode,
            },
            {
              label: '是否联合拓展',
              prop: 'isUnion',
              inputType: 'select',
              span: 12,
              options: this.common().bondIsCancel,
              onChange: (val) => {
                this.form = {
                  ...this.form,
                  isUnion: val,
                };
                this.layout[1].hide = !(val === 'true');
                this.formRules.proportion.required = val === 'true';
              },
            },
            {
              label: '付款方式',
              prop: 'paymentType',
              inputType: 'select',
              span: 12,
              options: this.common().paymentType,
            },
          ],
        },
        {
          title: '联合拓展信息(单位:万元)',
          hide: true,
          formItems: [
            {
              label: '合作方名称',
              prop: 'partnerName',
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
              label: '是否具有资质',
              prop: 'qualification',
              inputType: 'select',
              options: this.common().bondIsCancel,
              span: 12,
            },
            {
              label: '分成比例(%)',
              prop: 'proportion',
              inputType: 'inputNumber',
              span: 12,
            },
          ],
        },
        {
          title: '绑定承揽框架',
          render: 'hireFramework',
          formItems: [],
        },
        {
          title: '采购需求(单位:元)',
          render: 'purchaseDemandFramework',
          formItems: [
            // {
            //   label: '拦标价(不含税)',
            //   prop: 'stopBiddingPrice',
            //   inputType: 'input',
            //   span: 12,
            // },
            // {
            //   label: '不含税预购金额',
            //   prop: 'purchaseAmountNotRate',
            //   inputType: 'input',
            //   span: 12,
            // },
            // {
            //   label: '预估增值税金额',
            //   prop: 'addedValueTax',
            //   inputType: 'input',
            //   span: 12,
            // },
            // {
            //   label: '含税预购金额',
            //   prop: 'purchaseAmount',
            //   inputType: 'input',
            //   span: 12,
            // },
            // {
            //   label: '计划份额',
            //   prop: 'planLot',
            //   inputType: 'input',
            //   span: 12,
            // },
            // {
            //   label: '合同期限',
            //   prop: 'contractDeadline',
            //   inputType: 'dataPicker',
            //   span: 12,
            // },
          ],
        },
        {
          title: '采购方案',
          formItems: [
            {
              label: '代理机构名称',
              prop: 'agencyName',
              inputType: 'input',
              span: 12,
            },
            {
              label: '首次采购方式',
              prop: 'purchaseType',
              inputType: 'select',
              span: 12,
              options: this.common().purchaseType,
            },
            {
              label: '主观分值占比',
              prop: 'PBTScore',
              inputType: 'input',
              span: 12,
            },
            {
              label: '商务技术分占比',
              prop: 'BScoreProportion',
              inputType: 'input',
              span: 12,
            },
            {
              label: '是否需要审议',
              prop: 'isNeedReview',
              inputType: 'select',
              span: 12,
              options: this.common().submitCode,
            },
            {
              label: '其他',
              prop: 'planOthers',
              inputType: 'input',
              span: 12,
            },
          ],
        },
        {
          title: '关键节点',
          formItems: [
            {
              label: '采购委托时间',
              prop: 'purchaseEntrust',
              inputType: 'dataPicker',
              span: 12,
            },
            {
              label: '公告/文件发出时间',
              prop: 'announcement',
              inputType: 'dataPicker',
              span: 12,
            },
            {
              label: '评审报告时间',
              prop: 'reviewReport',
              inputType: 'dataPicker',
              span: 12,
            },
            {
              label: '中标通知书',
              prop: 'biddingLetter',
              inputType: 'dataPicker',
              span: 12,
            },
          ],
        },
      ],
      // 必填内容
      formRules: {
        productionCenter: {
          required: true,
          message: '请选择所属生产中心',
          trigger: 'blur',
        },
        auditPeople: {
          required: true,
          message: '请选择项目归属',
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
        prodIncome: {
          required: true,
          message: '请输入项目预估收入(不含税)',
          trigger: 'blur',
        },
        year: {
          required: true,
          message: '请输入年度',
          trigger: 'blur',
        },
        prodId: {
          required: false,
          message: '请输入甲方项目编号',
          trigger: 'blur',
        },
        taxRate: {
          required: true,
          message: '请选择税率',
          trigger: 'blur',
        },
        isUnion: {
          required: true,
          message: '请选择是否联合拓展',
          trigger: 'blur',
        },
        paymentType: {
          required: true,
          message: '请选择付款方式',
          trigger: 'blur',
        },
        proportion: {
          required: false,
          message: '请输入分成比例',
          trigger: 'blur',
        },
        announcement: {
          required: true,
          message: '请选择公告/文件发出时间',
          trigger: 'blur',
        },

        reviewReport: {
          required: true,
          message: '请选择评审报告时间',
          trigger: 'blur',
        },
        biddingLetter: {
          required: true,
          message: '请选择中标通知书',
          trigger: 'blur',
        },
        stopBiddingPrice: {
          required: true,
          message: '请输入拦标价(不含税)',
          trigger: 'blur',
        },
        purchaseAmountNotRate: {
          required: true,
          message: '请输入不含税预购金额',
          trigger: 'blur',
        },
        addedValueTax: {
          required: true,
          message: '请输入预估增值税金额',
          trigger: 'blur',
        },
        purchaseAmount: {
          required: true,
          message: '请输入含税预购金额',
          trigger: 'blur',
        },
        planLot: {
          required: true,
          message: '请输入计划份额',
          trigger: 'blur',
        },
        contractDeadline: {
          required: true,
          message: '请输入合同期限',
          trigger: 'blur',
        },
        agencyName: {
          required: true,
          message: '请输入代理机构名称',
          trigger: 'blur',
        },
        purchaseType: {
          required: true,
          message: '请输入首次采购方式',
          trigger: 'blur',
        },
        PBTScore: {
          required: true,
          message: '请输入主观分值占比',
          trigger: 'blur',
        },
        BScoreProportion: {
          required: true,
          message: '请输入商务技术分占比',
          trigger: 'blur',
        },
        isNeedReview: {
          required: true,
          message: '请选择是否需要审议',
          trigger: 'blur',
        },
      },
      hireFrameworkData: [],
      hireFrameworkCols: [
        {
          label: '框架名称',
          prop: 'contractName',
          align: 'center',
        },
        {
          label: '框架编号',
          prop: 'contractId',
          align: 'center',
        },
        {
          label: '专业',
          prop: 'major',
          align: 'center',
        },
        {
          label: '省份',
          prop: 'province',
          align: 'center',
        },
        {
          label: '城市',
          prop: 'city',
          align: 'center',
        },
        {
          label: '委托方',
          prop: 'city',
          align: 'center',
        },
        {
          label: '主体',
          prop: 'subject',
          align: 'center',
        },
      ],
      hireFrameworkBtnLists: [
        {
          label: '新增',
          click: () => this.addHireFrameworkRow(),
        },
      ],
      hireFrameWorkShow: false,
      hireFrameWorkData: false,
      hireFrameWorkTable: false,
      hireFrameWorkIndex: -1,
      unitData: {},
      unitShow: false,
      tableData: [],
      tableCols: [
        {
          label: '中标人',
          prop: 'unitName',
          width: 150,
          align: 'center',
          render: (h, scope) => {
            const d = scope.row;

            let html = scope.row.unitName;

            if (d.editRow) {
              html = (
                <el-input
                  class="editInput"
                  value={scope.row[scope.column.property] || ''}
                  onFocus={(val) => {
                    this.unitData = {
                      index: scope.$index,
                    };
                    this.unitShow = true;
                  }}
                ></el-input>
              );
            }

            return <div>{html}</div>;
          },
        },
        {
          label: '中标份额',
          prop: 'winnerLot',
          width: 150,
          align: 'center',
          render: (h, scope) => {
            const d = scope.row;

            let html = scope.row.winnerLot;

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
          label: '中标报价',
          prop: 'discountRate',
          width: 150,
          align: 'center',
          render: (h, scope) => {
            const d = scope.row;

            let html = scope.row.discountRate;

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
          label: '中标后执行价格',
          prop: 'performPrice',
          width: 150,
          align: 'center',
          render: (h, scope) => {
            const d = scope.row;

            let html = scope.row.performPrice;

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
          label: '合同控制金额(不含税)',
          prop: 'contractAmountNoRate',
          width: 150,
          align: 'center',
          render: (h, scope) => {
            const d = scope.row;

            let html = scope.row.contractAmountNoRate;

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
          label: '税率',
          prop: 'taxRate',
          width: 170,
          align: 'center',
          render: (h, scope) => {
            const d = scope.row;

            return (
              <div>
                {
                  <el-select
                    class="editInput"
                    multiple
                    disabled={!d.editRow}
                    value={scope.row[scope.column.property] || ''}
                    onChange={(val) => {
                      this.changeSelect(val, scope.$index, scope.column.property);
                    }}
                  >
                    {this.common().taxRateCode.map((data) => (
                      <el-option label={data.name} value={data.code}></el-option>
                    ))}
                  </el-select>
                }
              </div>
            );
          },
        },
        {
          label: '合同税额',
          prop: 'contractRate',
          width: 100,
          align: 'center',
          render: (h, scope) => {
            const d = scope.row;
            const { contractRate, taxRate } = scope.row;

            let html = contractRate;

            if (d.editRow) {
              html = (
                <el-input
                  class="editInput"
                  disabled={!taxRate || taxRate.length === 1}
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
          label: '合同控制金额(含税)',
          prop: 'contractAmount',
          width: 150,
          align: 'center',
          render: (h, scope) => {
            const d = scope.row;
            const { contractAmount, taxRate } = scope.row;

            let html = contractAmount;

            if (d.editRow) {
              html = (
                <el-input
                  class="editInput"
                  disabled={!taxRate || taxRate.length === 1}
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
          label: '预估比例(%)',
          prop: 'estimate',
          align: 'center',
          width: 100,
          render: (h, scope) => {
            const d = scope.row;
            const { estimate } = scope.row;

            let html = estimate;

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
          label: '收入金额(不含税)',
          prop: 'income',
          width: 100,
          align: 'center',
          render: (h, scope) => {
            const d = scope.row;
            const { income } = scope.row;

            let html = income;

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
          label: '合作比例(%)',
          prop: 'ratio',
          align: 'center',
          render: (h, scope) => {
            const d = scope.row;
            const { ratio } = scope.row;

            let html = ratio;

            if (d.editRow) {
              html = (
                <el-input
                  class="editInput"
                  disabled
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
          label: '项目毛利率(%)',
          prop: 'projectProfitRate',
          align: 'center',
          render: (h, scope) => {
            const d = scope.row;
            const { projectProfitRate } = scope.row;

            let html = projectProfitRate;

            if (d.editRow) {
              html = (
                <el-input
                  class="editInput"
                  disabled
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
        // {
        //   label: '其他',
        //   prop: 'resultOthers',
        //   align: 'center',
        //   render: (h, scope) => {
        //     const d = scope.row;

        //     let html = scope.row.resultOthers;

        //     if (d.editRow) {
        //       html = (
        //         <el-input
        //           class="editInput"
        //           value={scope.row[scope.column.property] || ''}
        //           onInput={(val) => {
        //             this.changeInput(val, scope.$index, scope.column.property);
        //           }}
        //         ></el-input>
        //       );
        //     }

        //     return <div>{html}</div>;
        //   },
        // },
      ],
      purchaseDemandTableData: [],
      purchaseDemandTableCols: [
        {
          label: '标段名称',
          prop: 'sectionName',
          width: 120,
          align: 'center',
          render: (h, scope) => {
            const d = scope.row;

            let html = scope.row.sectionName;

            if (d.editPurchaseDemandRow) {
              html = (
                <el-input
                  class="editInput"
                  value={scope.row[scope.column.property] || ''}
                  onInput={(val) => {
                    this.changePurchaseDemandInput(val, scope.$index, scope.column.property);
                  }}
                ></el-input>
              );
            }

            return <div>{html}</div>;
          },
        },
        {
          label: '拦标价(不含税)',
          prop: 'stopBiddingPrice',
          width: 120,
          align: 'center',
          render: (h, scope) => {
            const d = scope.row;

            let html = scope.row.stopBiddingPrice;

            if (d.editPurchaseDemandRow) {
              html = (
                <el-input
                  class="editInput"
                  value={scope.row[scope.column.property] || ''}
                  onInput={(val) => {
                    this.changePurchaseDemandInput(val, scope.$index, scope.column.property);
                  }}
                ></el-input>
              );
            }

            return <div>{html}</div>;
          },
        },
        {
          label: '不含税预购金额',
          prop: 'purchaseAmountNotRate',
          width: 120,
          align: 'center',
          render: (h, scope) => {
            const d = scope.row;

            let html = scope.row.purchaseAmountNotRate;

            if (d.editPurchaseDemandRow) {
              html = (
                <el-input-number
                  precision={2}
                  class="editInput"
                  controls={false}
                  value={scope.row[scope.column.property] || ''}
                  onInput={(val) => {
                    this.changePurchaseDemandInput(val, scope.$index, scope.column.property);
                  }}
                ></el-input-number>
              );
            }

            return <div>{html}</div>;
          },
        },
        {
          label: '预估增值税金额',
          prop: 'addedValueTax',
          width: 120,
          align: 'center',
          render: (h, scope) => {
            const d = scope.row;

            let html = scope.row.addedValueTax;

            if (d.editPurchaseDemandRow) {
              html = (
                <el-input-number
                  precision={2}
                  class="editInput"
                  controls={false}
                  value={scope.row[scope.column.property] || ''}
                  onInput={(val) => {
                    this.changePurchaseDemandInput(val, scope.$index, scope.column.property);
                  }}
                ></el-input-number>
              );
            }

            return <div>{html}</div>;
          },
        },
        {
          label: '含税预购金额',
          prop: 'purchaseAmount',
          width: 120,
          align: 'center',
          render: (h, scope) => {
            const d = scope.row;

            let html = scope.row.purchaseAmount;

            if (d.editPurchaseDemandRow) {
              html = (
                <el-input-number
                  precision={2}
                  class="editInput"
                  controls={false}
                  value={scope.row[scope.column.property] || ''}
                  onInput={(val) => {
                    this.changePurchaseDemandInput(val, scope.$index, scope.column.property);
                  }}
                ></el-input-number>
              );
            }

            return <div>{html}</div>;
          },
        },
        {
          label: '计划份额',
          prop: 'planLot',
          width: 120,
          align: 'center',
          render: (h, scope) => {
            const d = scope.row;

            let html = scope.row.planLot;

            if (d.editPurchaseDemandRow) {
              html = (
                <el-input
                  class="editInput"
                  value={scope.row[scope.column.property] || ''}
                  onInput={(val) => {
                    this.changePurchaseDemandInput(val, scope.$index, scope.column.property);
                  }}
                ></el-input>
              );
            }

            return <div>{html}</div>;
          },
        },
        {
          label: '合同期限',
          prop: 'contractDeadline',
          align: 'center',
          render: (h, scope) => {
            const d = scope.row;
            const { contractDeadline } = scope.row;

            let html = contractDeadline;

            if (d.editPurchaseDemandRow) {
              html = (
                <el-date-picker
                  class="editInput"
                  type="datetime"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                  value={scope.row[scope.column.property] || ''}
                  onInput={(val) => {
                    this.changePurchaseDemandInput(val, scope.$index, scope.column.property);
                  }}
                ></el-date-picker>
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
      purchaseDemandBtnLists: [
        {
          label: '新增',
          click: () => this.addPurchaseDemandRow(),
        },
      ],
      remarkFormItemLayout: [
        {
          title: '备注',
          formItems: [
            {
              label: '备注',
              prop: 'remark',
              inputType: 'input',
              span: 12,
            },
          ],
        },
      ],
      remarkFormItemFormRules: {},
      formChange: [],
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
    formChange(val) {
      console.log('val', val);
      const valArray = [...new Set(val)];

      if (valArray.length === 2) {
        this.submitForm(this.form);
      }
    },
  },
  methods: {
    // 请求数据
    reqDetail() {
      const { row } = this.data;

      if (row && row.id) {
        // 获取采购详情
        getPurchaseInfoById(row.id).then((res) => {
          if (res && res.code === '200') {
            if (res.data.province) {
              this.setCity(res.data.province);
            }
            if (res.data.oneMajor) {
              this.setTwoMajor(res.data.oneMajor);
            }
            this.form = {
              ...this.form,
              ...res.data,
              taxRate: res.data.taxRate.split(','),
              city: res.data.city.split(','),
            };
            this.layout[1].hide = !(this.form.isUnion === 'true');
            this.formRules.proportion.required = this.form.isUnion === 'true';
            this.tableData = res.data.purchaseResultDto;
            this.purchaseDemandTableData = res.data.demandList;
            this.hireFrameworkData = res.data.hireFrameworkDtoList;
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
      const options = this.common().provincialAllCode;
      const findItem = options.filter((option) => option.id === province);

      if (findItem.length === 0) {
        return;
      }
      const city = await this.$getCode(findItem[0].id);

      console.log('city', city);
      this.$set(this.layout[0].formItems[5], 'options', city);
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

      this.$set(this.layout[0].formItems[7], 'options', twoMajor);
    },
    submitFormItem() {
      this.$refs.supplyFormItem.submitForm();
      this.$refs.remarkFormItem.submitForm();
    },
    // 提交数据
    submitForm(val) {
      console.log('this.data', this.data);
      const { configType, row } = this.data;
      const id = configType === 'add' ? '' : this.form.id;

      if (this.editPurchaseDemandRow || this.editRow) {
        this.$notifyError('请先保存当前新增行数据再进行添加操作');

        return;
      }
      let parames = {
        ...val,
        taxRate: val.taxRate.join(','),
        city: val.city.join(','),
        proportion: `${val.proportion}`,
        hireFrameworkDtoList: this.hireFrameworkData,
        isNeedReview: `${val.isNeedReview}`,
        purchaseResultDto: this.tableData,
        demandList: this.purchaseDemandTableData,
      };

      if (parames.isUnion === 'false') {
        delete parames.partnerName;
        delete parames.registerCapital;
        delete parames.qualification;
      }

      let api = addPurchase;
      // 新增采购信息

      let message = '新增成功';

      if (id) {
        parames = {
          ...parames,
          id: `${id}`,
        };
        message = '更新成功';
        api = editPurchase;
      }
      api(parames).then((res) => {
        if (res.code === '200') {
          this.$notify({
            title: '成功',
            message,
            type: 'success',
            position: 'bottom-right',
          });
          this.$emit('success');
          this.formChange = [];
        }
      });
    },
    // 取消提交
    cancelForm() {
      this.form = {};
      this.formChange = [];
      this.$refs.supplyFormItem.cancelForm();
      this.$refs.remarkFormItem.cancelForm();
    },
    formItemSubmitForm(val, type) {
      // 备注
      const params = {
        ...val,
      };

      this.form = {
        ...this.form,
        ...params,
      };
      this.formChange.push(type);
    },
    // 绑定新承揽框架
    addHireFrameworkRow() {
      this.hireFrameWorkShow = true;
      this.hireFrameWorkIndex = -1;
      if (this.$refs.hireFrameWorkSelect) {
        this.$refs.hireFrameWorkSelect.onRowChange(this.hireFrameworkData);
      }
    },
    // 关闭新承揽框架
    closehireFrameWork() {
      this.hireFrameWorkShow = false;
      // this.hireFrameWorkIndex = -1;
      this.hireFrameWorkData = {};
    },
    // 成功绑定新承揽框架
    successhireFrameWork(selectTable) {
      console.log('selectTable', selectTable, this.hireFrameWorkIndex);
      this.hireFrameWorkTable = selectTable;
      if (this.hireFrameWorkIndex === -1) {
        this.hireFrameworkData = this.hireFrameworkData.concat(selectTable);
      } else {
        this.hireFrameworkData.splice(this.hireFrameWorkIndex, 1, ...selectTable);
      }
      this.$nextTick(() => {
        this.closehireFrameWork();
      });
    },
    // 添加行
    addPurchaseDemandRow() {
      console.log('addPurchaseDemandRow');
      if (this.editPurchaseDemandRow) {
        this.$notifyError('请先保存当前新增行数据再进行添加操作');

        return;
      }

      this.editPurchaseDemandRow = true;
      const list = {
        editPurchaseDemandRow: this.editPurchaseDemandRow,
      };

      this.purchaseDemandTableData.unshift(list);
      this.purchaseDemandTableData.splice(1, 0);
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

      this.tableData.unshift(list);
      this.tableData.splice(1, 0);
    },
    // 对表单操作
    tableAction(type, row) {
      if (type === 'edit') {
        this.tableData[row.index] = {
          ...this.tableData[row.index],
          editRow: true,
        };
        this.editRow = true;
        this.tableData.splice(1, 0);
      }
      if (type === 'save') {
        this.handleUpdateSplit(row.index);
      }
      if (type === 'del') {
        this.tableData.splice(row.index, 1);
        this.editRow = false;
      }
    },
    tableFrameworkAction(type, row) {
      console.log('row', row);
      if (type === 'edit') {
        this.hireFrameWorkIndex = row.index;
        this.hireFrameWorkShow = true;
        if (this.$refs.hireFrameWorkSelect) {
          this.$refs.hireFrameWorkSelect.onRowChange([this.hireFrameworkData[row.index]]);
        }
      }
      if (type === 'del') {
        this.hireFrameworkData.splice(row.index, 1);
      }
    },
    handleUpdateSplit(index) {
      const {
        unitName,
        winnerLot,
        discountRate,
        contractAmount,
        performPrice,
        contractAmountNoRate,
        income,
        ratio,
        projectProfitRate,
      } = this.tableData[index];

      if (
        !unitName ||
        !winnerLot ||
        !discountRate ||
        !contractAmount ||
        !performPrice ||
        !contractAmountNoRate ||
        !income ||
        !ratio ||
        !projectProfitRate
      ) {
        this.$notifyError(
          '请先完整输入信息:中标人、中标份额、中标报价、中标后执行价格、合同控制金额、收入金额(不含税)、合作比例(%)、项目毛利率(%)',
        );

        return;
      }
      this.tableData[index] = {
        ...this.tableData[index],
        editRow: false,
      };
      this.tableData.splice(1, 0);
      this.editRow = false;
    },
    handlePurchaseDemand(index) {
      const {
        sectionName,
        stopBiddingPrice,
        purchaseAmountNotRate,
        addedValueTax,
        purchaseAmount,
        planLot,
        contractDeadline,
      } = this.purchaseDemandTableData[index];

      if (
        !sectionName ||
        !stopBiddingPrice ||
        !purchaseAmountNotRate ||
        !addedValueTax ||
        !purchaseAmount ||
        !planLot ||
        !contractDeadline
      ) {
        this.$notifyError(
          '请先完整输入信息:标段名称、拦标价(不含税)、不含税预购金额、预估增值税金额、含税预购金额、计划份额、合同期限',
        );

        return;
      }
      this.purchaseDemandTableData[index] = {
        ...this.purchaseDemandTableData[index],
        editPurchaseDemandRow: false,
      };
      this.purchaseDemandTableData.splice(1, 0);
      this.editPurchaseDemandRow = false;
    },
    // 输入框改变
    changeInput(val, index, name) {
      if (name === 'contractAmountNoRate') {
        this.tableData[index] = {
          ...this.tableData[index],
          ...this.changeAmount({
            ...this.tableData[index],
          }),
        };
        const { income, contractRate } = this.tableData[index];

        if (income) {
          const rationValue = (parseFloat(val || 0) / parseFloat(income || 0)).toFixed(2);

          this.tableData[index] = {
            ...this.tableData[index],
            ratio: rationValue || 0,
            projectProfitRate: (1 - parseFloat(rationValue || 0)).toFixed(2),
          };
        }
      }
      // 合作比例
      if (name === 'income') {
        const { contractAmountNoRate } = this.tableData[index];

        if (val) {
          const rationValue = (parseFloat(contractAmountNoRate || 0) / parseFloat(val || 0)).toFixed(2);

          this.tableData[index] = {
            ...this.tableData[index],
            projectProfitRate: (1 - parseFloat(rationValue || 0)).toFixed(2),
            ratio: rationValue,
          };
        }
      }
      this.tableData[index] = {
        ...this.tableData[index],
        [name]: val,
      };
      this.tableData.splice(1, 0);
    },
    // 下拉框改变
    changeSelect(val, index, name, idName) {
      const item = this.tableData.map((data, i) => {
        if (i === index) {
          let addObj = {};

          if (idName && val instanceof Object) {
            addObj = {
              [idName]: val.id,
            };
          }
          if (name === 'taxRate') {
            if (val.length === 1) {
              addObj = {
                ...addObj,
                ...this.changeAmount({
                  ...data,
                  taxRate: val,
                }),
              };
            } else {
              addObj = {
                ...addObj,
                taxRate: val,
                contractAmount: undefined,
                contractRate: undefined,
              };
            }
          }

          return {
            ...data,
            [name]: val instanceof Object ? val.name : val,
            ...addObj,
          };
        }

        return data;
      });

      console.log('item', item);
      this.tableData = item;
    },
    // 修改输入框
    changePurchaseDemandInput(val, index, name) {
      this.purchaseDemandTableData[index] = {
        ...this.purchaseDemandTableData[index],
        [name]: val,
      };
      this.purchaseDemandTableData.splice(1, 0);
    },
    // 对表单操作
    tablePurchaseDemandAction(type, row) {
      if (type === 'edit') {
        this.purchaseDemandTableData[row.index] = {
          ...this.purchaseDemandTableData[row.index],
          editPurchaseDemandRow: true,
        };
        this.editPurchaseDemandRow = true;
        this.purchaseDemandTableData.splice(1, 0);
      }
      if (type === 'save') {
        this.handlePurchaseDemand(row.index);
      }
      if (type === 'del') {
        this.purchaseDemandTableData.splice(row.index, 1);
        this.editPurchaseDemandRow = false;
      }
    },
    // 修改数额
    changeAmount(data) {
      const { contractAmountNoRate, taxRate } = data;

      if (taxRate && taxRate.length === 1) {
        const taxRetaValue = taxRate[0].split('_')[1];
        const contractRate = ((parseFloat(contractAmountNoRate || 0) * parseFloat(taxRetaValue || 0)) / 100).toFixed(2);

        return {
          ...data,
          contractRate,
          contractAmount: (parseFloat(contractAmountNoRate || 0) + parseFloat(contractRate || 0)).toFixed(2),
        };
      }

      return {};
    },
    // 关闭预览
    closeEdit() {
      this.unitShow = false;
      this.unitData = {};
    },
    // 成功预览
    successEdit(selectTable) {
      const { data } = selectTable;

      this.tableData[data.index] = {
        ...this.tableData[data.index],
        unitName: selectTable.name,
        unitId: selectTable.id,
      };
      this.tableData.splice(1, 0);
      this.closeEdit();
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
