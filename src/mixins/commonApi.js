/**
 * 公共请求
 */
import { mapGetters, mapMutations } from 'vuex';
import store from '@/store';
import {
  dealWithStatus,
  businessCode,
  majorCode,
  provincialCode,
  constructionCode,
  subjectCode,
  verifyStatusCode,
  busiResourceCode,
  tenderStateInfo,
  tenderWin,
  selectListByParentCode,
  productionCenterCode,
  tenderProgress,
  tenderResult,
  projectBelong,
  documentType,
  cooperationLevelCode,
  purchaseModality,
  purchaseType,
  marketType,
  opportunityCategory,
  expandType,
  dictionaryListByConditions,
  operationType,
  tenderType,
  bondIsCancel,
  payType,
  position,
  invoiceType,
  typeData,
  resultData,
  getcityErpByParentCode,
} from '@/api/common';

const commonApi = () => ({
  data() {
    return {
      dealWithStatus: this.common && this.common.dealWithStatus,
      businessCode: this.common && this.common.businessCode,
      judgeResult: this.common && this.common.judgeResult,
      majorCode: this.common && this.common.majorCode,
      provincialCode: this.common && this.common.provincialCode,
      provincialAllCode: this.common && this.common.provincialAllCode,
      constructionCode: this.common && this.common.constructionCode,
      subjectCode: this.common && this.common.subjectCode,
      verifyStatusCode: this.common && this.common.verifyStatusCode,
      busiResourceCode: this.common && this.common.busiResourceCode,
      tenderWin: this.common && this.common.tenderWin,
      constructionModeCode: this.common && this.common.constructionModeCode,
      deptIdCode: this.common && this.common.deptIdCode,
      designUnitCode: this.common && this.common.designUnitCode,
      supervisionUnitCode: this.common && this.common.supervisionUnitCode,
      productionCenterCode: this.common && this.common.productionCenterCode,
      tenderProgress: this.common && this.common.tenderProgress,
      tenderResult: this.common && this.common.tenderResult,
      projectBelong: this.common && this.common.projectBelong,
      documentType: this.common && this.common.documentType,
      cooperationLevelCode: this.common && this.common.cooperationLevelCode,
      purchaseModality: this.common && this.common.purchaseModality,
      purchaseType: this.common && this.common.purchaseType,
      marketType: this.common && this.common.marketType,
      opportunityCategory: this.common && this.common.opportunityCategory,
      tenderStateInfo: this.common && this.common.tenderStateInfo,
      expandType: this.common && this.common.expandType,
      submitCode: this.common && this.common.submitCode,
      taxRateCode: this.common && this.common.taxRateCode,
      fundsType: this.common && this.common.fundsType,
      operationType: this.common && this.common.operationType,
      projectStatusCode: this.common && this.common.projectStatusCode,
      contractTypeCode: this.common && this.common.contractTypeCode,
      taxTypeCode: this.common && this.common.taxTypeCode,
      recordAdjustType: this.common && this.common.recordAdjustType,
      tenderType: this.common && this.common.tenderType,
      bondIsCancel: this.common && this.common.bondIsCancel,
      cooperationMode: this.common && this.common.cooperationMode,
      contractFromCode: this.common && this.common.contractFromCode,
      payType: this.common && this.common.payType,
      isUnion: this.common && this.common.isUnion,
      contractStatus: this.common && this.common.contractStatus,
      position: this.common && this.common.position,
      invoiceStatus: this.common && this.common.invoiceStatus,
      modeType: this.common && this.common.modeType,
      typeData: this.common && this.common.typeData,
      resultData: this.common && this.common.resultData,
      choiceDimension: this.common && this.common.choiceDimension,
      paymentType: this.common && this.common.paymentType,
      qualificationType: this.common && this.common.qualificationType,
      useType: this.common && this.common.useType,
      approvalStatus: this.common && this.common.approvalStatus,
      downloadStatusType: this.common && this.common.downloadStatusType,
      displayStatus: this.common && this.common.displayStatus,
      warningStatus: this.common && this.common.warningStatus,
      education: this.common && this.common.education,
      qualificationStatus: this.common && this.common.qualificationStatus,
      postStatus: this.common && this.common.postStatus,
      cooperationNature: this.common && this.common.cooperationNature,
      stationStatus: this.common && this.common.stationStatus,
      entrustType: this.common && this.common.entrustType,
      settlementType: this.common && this.common.settlementType,
      isHas: this.common && this.common.isHas,
      useStatus: this.common && this.common.useStatus,
      projectType: this.common && this.common.projectType,
      stationType: this.common && this.common.stationType,
      invoiceType: this.common && this.common.invoiceType,
      isJudge: this.common && this.common.isJudge,
      backFill: this.common && this.common.backFill,
      invoiceFeeType: this.common && this.common.invoiceFeeType,
      cooperationInvoiceStatus: this.common && this.common.cooperationInvoiceStatus,
      // taxNumber: this.common && this.common.taxNumber,
      cityErpByParentCode: this.common && this.common.cityErpByParentCode,
      writeOffStatus: this.common && this.common.writeOffStatus,
      instionFeeType: this.common && this.common.instionFeeType,
      goodsType: this.common && this.common.goodsType,
    };
  },
  computed: {
    ...mapGetters(['common']),
    username() {
      return store.state.user.username;
    },
  },
  watch: {
    username(username) {
      setTimeout(() => {
        this.$nextTick(() => {
          if (username) {
            this.getDealWithStatus();
            this.getBusinessCode();
            this.getJudgeResult();
            this.getMajorCode();
            this.getProvincialCode();
            this.getConstructionCode();
            this.getSubjectCode();
            this.getVerifyStatusCode();
            this.getBusiResourceCode();
            this.getTenderWin();
            this.getConstructionModeCode('construction_mode');
            this.getPaymentType('paymentType');
            this.getDeptIdCode('DEPT');
            this.getChoiceDimension('choiceDimension');
            this.getDesignCode('design');
            this.getSupervisionUnitCode('supervisor');
            this.getProductionCenter();
            this.getTenderProgress();
            this.getTenderResult();
            this.getProjectBelong();
            this.getDocumentType();
            this.getSubmitCode();
            this.getTaxRateCode();
            this.getFundsType();
            this.getProjectStatusCode();
            this.getContractTypeCode();
            this.getTaxTypeCode();
            this.getCooperationModeCode();
            this.getContractFromCode('contract_from');
            this.getIsUnionCode('true_or_false');
            this.getContractStatusCode('contract_status');
            this.getModeTypeCode();

            this.getCooperationLevelCodeCode();
            this.getPurchaseModality();
            this.getPurchaseType();
            this.getMarketType();
            this.getOpportunityCategory();
            this.getTenderStateInfo();
            this.getExpandType();
            this.getOperationType();
            this.getRecordAdjustType();
            this.getTenderType();
            this.getBondIsCancel();
            this.getPayType();
            this.getPosition();
            this.getInvoiceStatus();
            this.getTypeData();
            this.getResultData();

            this.getQualificationTypeCode('qualificationType');
            this.getUseTypeCode('qualification_use');
            this.getApprovalStatusCode('APPLY_STATUS');
            this.getEducationCode('education');
            this.getQualificationStatusCode('qualification_status');
            this.getPostStatusCode('post_status');
            this.getCooperationNatureCode('cooperation_nature');
            this.getDownloadStatusType();
            this.getDisplayStatus();
            this.getWarningStatus();
            this.getStationStatus('station_status');
            this.getEntrustType('entrust_type');
            this.getSettlementType('settlement_type');
            this.getIsHas();
            this.getUseStatus();
            this.getProjectType('project_type');
            this.getStationType('station_type');
            this.getInvoiceType('invoice_type');
            this.getIsJudge('');
            this.getBackFill('back_fill');
            this.getInvoiceFeeType('invoice_fee_type');
            this.getCooperationInvoiceStatus('cooperation_invoice_status');
            // this.getTaxNumber('tax_number')
            this.getcityErpByParentCode(20);
            this.getWriteOffStatus('write_off_status');
            this.getInstionFeeType('instionFeeType');
            this.getGoodsType('goods_type');
          }
        });
      }, 1000);
    },
  },
  methods: {
    ...mapMutations(['setCommon']),
    // 获取 财务收入成本管理的固定地市值 下拉框参数
    getcityErpByParentCode(id) {
      if (!(this.common && this.common.cityErpByParentCode && this.common.cityErpByParentCode.length > 0)) {
        getcityErpByParentCode(id).then((res) => {
          if (res.code === '200') {
            this.cityErpByParentCode = res.data.map((item) => ({
              name: item.cityName,
              id: item.cityCode,
              cityErp: item.cityErp,
            }));
            this.setCommon({
              ...this.common,
              cityErpByParentCode: this.cityErpByParentCode,
            });
          }
        });
        this.$forceUpdate();
      }
    },
    // 获取 执行结果 下拉框参数
    getResultData() {
      if (!(this.common && this.common.resultData && this.common.resultData.length > 0)) {
        resultData().then((res) => {
          if (res.code === '200') {
            this.resultData = res.data.map((item) => ({
              name: item.name,
              id: item.code,
            }));
            this.setCommon({
              ...this.common,
              resultData: this.resultData,
            });
          }
        });
        this.$forceUpdate();
      }
    },
    // 获取 类型 下拉框参数
    getTypeData() {
      if (!(this.common && this.common.typeData && this.common.typeData.length > 0)) {
        typeData().then((res) => {
          if (res.code === '200') {
            this.typeData = res.data.map((item) => ({
              name: item.name,
              id: item.code,
            }));
            this.setCommon({
              ...this.common,
              typeData: this.typeData,
            });
          }
        });
        this.$forceUpdate();
      }
    },
    // 获取 职务 下拉框参数
    getPosition() {
      if (!(this.common && this.common.position && this.common.position.length > 0)) {
        position().then((res) => {
          if (res.code === '200') {
            this.position = res.data.map((item) => ({
              name: item.name,
              id: item.code,
            }));
            this.setCommon({
              ...this.common,
              position: this.position,
            });
          }
        });
        this.$forceUpdate();
      }
    },
    // 获取 是否已核销 下拉框参数
    getPayType() {
      if (!(this.common && this.common.payType && this.common.payType.length > 0)) {
        payType().then((res) => {
          if (res.code === '200') {
            this.payType = res.data.map((item) => ({
              name: item.name,
              id: item.code,
            }));
            this.setCommon({
              ...this.common,
              payType: this.payType,
            });
          }
        });
        this.$forceUpdate();
      }
    },
    // 获取 是否已核销 下拉框参数
    getBondIsCancel() {
      if (!(this.common && this.common.bondIsCancel && this.common.bondIsCancel.length > 0)) {
        bondIsCancel().then((res) => {
          if (res.code === '200') {
            this.bondIsCancel = res.data.map((item) => ({
              name: item.name,
              id: item.code,
            }));
            this.setCommon({
              ...this.common,
              bondIsCancel: this.bondIsCancel,
            });
          }
        });
        this.$forceUpdate();
      }
    },
    // 获取 投标形式 下拉框参数
    getTenderType() {
      if (!(this.common && this.common.tenderType && this.common.tenderType.length > 0)) {
        tenderType().then((res) => {
          if (res.code === '200') {
            this.tenderType = res.data.map((item) => ({
              name: item.name,
              id: item.code,
            }));
            this.setCommon({
              ...this.common,
              tenderType: this.tenderType,
            });
          }
        });
        this.$forceUpdate();
      }
    },
    // 获取 购买标书方式 下拉框参数
    getDocumentType() {
      if (!(this.common && this.common.documentType && this.common.documentType.length > 0)) {
        documentType().then((res) => {
          if (res.code === '200') {
            this.documentType = res.data.map((item) => ({
              name: item.name,
              id: item.code,
            }));
            this.setCommon({
              ...this.common,
              documentType: this.documentType,
            });
          }
        });
        this.$forceUpdate();
      }
    },
    // 获取 项目归属 下拉框参数
    getProjectBelong() {
      if (!(this.common && this.common.projectBelong && this.common.projectBelong.length > 0)) {
        projectBelong().then((res) => {
          if (res.code === '200') {
            this.projectBelong = res.data.map((item) => ({
              name: item.name,
              id: item.code,
            }));
            this.setCommon({
              ...this.common,
              projectBelong: this.projectBelong,
            });
          }
        });
        this.$forceUpdate();
      }
    },
    // 获取 投标结果 下拉框参数
    getTenderResult() {
      if (!(this.common && this.common.tenderResult && this.common.tenderResult.length > 0)) {
        tenderResult().then((res) => {
          if (res.code === '200') {
            this.tenderResult = res.data.map((item) => ({
              name: item.name,
              id: item.code,
            }));
            this.setCommon({
              ...this.common,
              tenderResult: this.tenderResult,
            });
          }
        });
        this.$forceUpdate();
      }
    },
    // 获取 投标进度 下拉框参数
    getTenderProgress() {
      if (!(this.common && this.common.tenderProgress && this.common.tenderProgress.length > 0)) {
        tenderProgress().then((res) => {
          if (res.code === '200') {
            this.tenderProgress = res.data.map((item) => ({
              name: item.name,
              id: item.code,
            }));
            this.setCommon({
              ...this.common,
              tenderProgress: this.tenderProgress,
            });
          }
        });
        this.$forceUpdate();
      }
    },
    // 获取 所属生产中心 下拉框参数
    getProductionCenter() {
      if (!(this.common && this.common.productionCenterCode && this.common.productionCenterCode.length > 0)) {
        productionCenterCode().then((res) => {
          if (res.code === '200') {
            this.productionCenterCode = res.data.map((item) => ({
              name: item.name,
              id: item.code,
            }));
            this.setCommon({
              ...this.common,
              productionCenterCode: this.productionCenterCode.filter((codeItem) => codeItem.name !== '创新业务部'),
            });
          }
        });
        this.$forceUpdate();
      }
    },

    // 获取待办状态下拉框参数
    getDealWithStatus() {
      if (!(this.common && this.common.dealWithStatus && this.common.dealWithStatus.length > 0)) {
        dealWithStatus().then((res) => {
          if (res.code === '200') {
            this.dealWithStatus = res.data.map((item) => ({
              name: item.name,
              id: item.code,
            }));
            this.setCommon({
              ...this.common,
              dealWithStatus: this.dealWithStatus,
            });
          }
        });
        this.$forceUpdate();
      }
    },
    // 获取待办状态下拉框参数
    getBusinessCode() {
      if (!(this.common && this.common.businessCode && this.common.businessCode.length > 0)) {
        businessCode().then((res) => {
          if (res.code === '200') {
            this.businessCode = res.data.map((item) => ({
              name: item.name,
              id: item.code,
            }));
            this.setCommon({
              ...this.common,
              businessCode: this.businessCode,
            });
          }
        });
        this.$forceUpdate();
      }
    },
    // 获取待办状态下拉框参数
    getJudgeResult() {
      if (!(this.common && this.common.judgeResult && this.common.judgeResult.length > 0)) {
        this.judgeResult = [
          {
            id: '1',
            name: '同意',
          },
          {
            id: '2',
            name: '不同意',
          },
        ];
        this.setCommon({
          ...this.common,
          judgeResult: this.judgeResult,
        });
        this.$forceUpdate();
      }
    },
    // 获取待办状态下拉框参数
    getSubmitCode() {
      if (!(this.common && this.common.submitCode && this.common.submitCode.length > 0)) {
        this.submitCode = [
          {
            id: 'true',
            name: '是',
          },
          {
            id: 'false',
            name: '否',
          },
        ];
        this.setCommon({
          ...this.common,
          submitCode: this.submitCode,
        });
        this.$forceUpdate();
      }
    },
    // 获取专业状态下拉框参数
    getMajorCode() {
      if (!(this.common && this.common.majorCode && this.common.majorCode.length > 0)) {
        majorCode().then((res) => {
          if (res.code === '200') {
            this.majorCode = res.data.map((item) => ({
              name: item.name,
              id: item.code,
            }));
            this.setCommon({
              ...this.common,
              majorCode: this.majorCode,
            });
          }
        });
        this.$forceUpdate();
      }
    },
    // 获取省份下拉框参数
    getProvincialCode() {
      if (!(this.common && this.common.provincialCode && this.common.provincialCode.length > 0)) {
        provincialCode().then((res) => {
          if (res.code === '200') {
            this.provincialAllCode = res.data.map((item) => ({
              name: item.name,
              id: item.code,
            }));
            this.provincialCode = res.data.map((item) => {
              if (item.name !== '全国') {
                return {
                  name: item.name,
                  id: item.code,
                };
              }
            });
            this.setCommon({
              ...this.common,
              provincialCode: this.provincialCode.filter((item) => Boolean(item)),
              provincialAllCode: this.provincialAllCode,
            });
          }
        });
        this.$forceUpdate();
      }
    },
    // 获取合作单位下拉框参数
    getConstructionCode() {
      if (!(this.common && this.common.constructionCode && this.common.constructionCode.length > 0)) {
        constructionCode().then((res) => {
          if (res.code === '200') {
            this.constructionCode = res.data.map((item) => ({
              name: item.name,
              id: item.code,
            }));
            this.setCommon({
              ...this.common,
              constructionCode: this.constructionCode,
            });
          }
        });
        this.$forceUpdate();
      }
    },
    // 获取主体下拉框参数
    getSubjectCode() {
      if (!(this.common && this.common.subjectCode && this.common.subjectCode.length > 0)) {
        subjectCode().then((res) => {
          if (res.code === '200') {
            this.subjectCode = res.data.map((item) => ({
              name: item.name,
              id: item.code,
            }));
            this.setCommon({
              ...this.common,
              subjectCode: this.subjectCode,
            });
          }
        });
        this.$forceUpdate();
      }
    },
    // 获取审核状态下拉框参数
    getVerifyStatusCode() {
      if (!(this.common && this.common.verifyStatusCode && this.common.verifyStatusCode.length > 0)) {
        verifyStatusCode().then((res) => {
          if (res.code === '200') {
            this.verifyStatusCode = res.data.map((item) => ({
              name: item.name,
              id: item.code,
            }));
            this.setCommon({
              ...this.common,
              verifyStatusCode: this.verifyStatusCode,
            });
          }
        });
        this.$forceUpdate();
      }
    },
    // 商机管理-商机来源下拉框参数
    getBusiResourceCode() {
      if (!(this.common && this.common.busiResourceCode && this.common.busiResourceCode.length > 0)) {
        busiResourceCode().then((res) => {
          if (res.code === '200') {
            this.busiResourceCode = res.data.map((item) => ({
              name: item.name,
              id: item.code,
            }));
            this.setCommon({
              ...this.common,
              busiResourceCode: this.busiResourceCode,
            });
          }
        });
        this.$forceUpdate();
      }
    },
    // 获取建设方式下拉框参数
    getConstructionModeCode(code) {
      if (!(this.common && this.common.constructionModeCode && this.common.constructionModeCode.length > 0)) {
        selectListByParentCode(code).then((res) => {
          if (res.code === '200') {
            this.constructionModeCode = res.data.map((item) => ({
              name: item.name,
              id: item.code,
            }));
            this.setCommon({
              ...this.common,
              constructionModeCode: this.constructionModeCode,
            });
          }
        });
        this.$forceUpdate();
      }
    },
    // 获取付款方式下拉框参数
    getPaymentType(code) {
      if (!(this.common && this.common.paymentType && this.common.paymentType.length > 0)) {
        selectListByParentCode(code).then((res) => {
          if (res.code === '200') {
            this.paymentType = res.data.map((item) => ({
              name: item.name,
              id: item.code,
            }));
            this.setCommon({
              ...this.common,
              paymentType: this.paymentType,
            });
          }
        });
        this.$forceUpdate();
      }
    },
    // 获取框架来源下拉框参数
    getContractFromCode(code) {
      if (!(this.common && this.common.contractFromCode && this.common.contractFromCode.length > 0)) {
        selectListByParentCode(code).then((res) => {
          if (res.code === '200') {
            this.contractFromCode = res.data.map((item) => ({
              name: item.name,
              id: item.code,
            }));
            this.setCommon({
              ...this.common,
              contractFromCode: this.contractFromCode,
            });
          }
        });
        this.$forceUpdate();
      }
    },
    // 获取是否联合拓展下拉框参数
    getIsUnionCode(code) {
      if (!(this.common && this.common.isUnion && this.common.isUnion.length > 0)) {
        selectListByParentCode(code).then((res) => {
          if (res.code === '200') {
            this.isUnion = res.data.map((item) => ({
              name: item.name,
              id: item.code,
            }));
            this.setCommon({
              ...this.common,
              isUnion: this.isUnion,
            });
          }
        });
        this.$forceUpdate();
      }
    },
    // 获取合同状态下拉框参数
    getContractStatusCode(code) {
      if (!(this.common && this.common.contractStatus && this.common.contractStatus.length > 0)) {
        selectListByParentCode(code).then((res) => {
          if (res.code === '200') {
            this.contractStatus = res.data.map((item) => ({
              name: item.name,
              id: item.code,
            }));
            this.setCommon({
              ...this.common,
              contractStatus: this.contractStatus,
            });
          }
        });
        this.$forceUpdate();
      }
    },
    // 获取部门下拉框参数
    getDeptIdCode(code) {
      if (!(this.common && this.common.deptIdCode && this.common.deptIdCode.length > 0)) {
        selectListByParentCode(code).then((res) => {
          if (res.code === '200') {
            this.deptIdCode = res.data.map((item) => ({
              name: item.name,
              id: item.code,
            }));
            this.setCommon({
              ...this.common,
              deptIdCode: this.deptIdCode,
            });
          }
        });
        this.$forceUpdate();
      }
    },
    // 获取维度下拉框参数
    getChoiceDimension(code) {
      if (!(this.common && this.common.choiceDimension && this.common.choiceDimension.length > 0)) {
        selectListByParentCode(code).then((res) => {
          if (res.code === '200') {
            this.choiceDimension = res.data.map((item) => ({
              name: item.name,
              id: item.code,
            }));
            this.setCommon({
              ...this.common,
              choiceDimension: this.choiceDimension,
            });
          }
        });
        this.$forceUpdate();
      }
    },
    // 商机管理-是否中标下拉框参数
    getTenderWin() {
      if (!(this.common && this.common.tenderWin && this.common.tenderWin.length > 0)) {
        tenderWin().then((res) => {
          if (res.code === '200') {
            this.tenderWin = res.data.map((item) => ({
              name: item.name,
              id: item.code,
            }));
            this.setCommon({
              ...this.common,
              tenderWin: this.tenderWin,
            });
          }
        });
        this.$forceUpdate();
      }
    },
    // 获取设计单位下拉框参数
    getDesignCode(code) {
      if (!(this.common && this.common.designUnitCode && this.common.designUnitCode.length > 0)) {
        selectListByParentCode(code).then((res) => {
          if (res.code === '200') {
            this.designUnitCode = res.data.map((item) => ({
              name: item.name,
              id: item.code,
            }));
            this.setCommon({
              ...this.common,
              designUnitCode: this.designUnitCode,
            });
          }
        });
        this.$forceUpdate();
      }
    },
    // 获取监理单位下拉框参数1
    getSupervisionUnitCode(code) {
      if (!(this.common && this.common.supervisionUnitCode && this.common.supervisionUnitCode.length > 0)) {
        selectListByParentCode(code).then((res) => {
          if (res.code === '200') {
            this.supervisionUnitCode = res.data.map((item) => ({
              name: item.name,
              id: item.code,
            }));
            this.setCommon({
              ...this.common,
              supervisionUnitCode: this.supervisionUnitCode,
            });
          }
        });
        this.$forceUpdate();
      }
    },

    // 获取合作级别下拉框参数
    getCooperationLevelCodeCode(code) {
      if (!(this.common && this.common.cooperationLevelCode && this.common.cooperationLevelCode.length > 0)) {
        cooperationLevelCode(code).then((res) => {
          if (res.code === '200') {
            this.cooperationLevelCode = res.data.map((item) => ({
              name: item.name,
              id: item.code,
            }));
            this.setCommon({
              ...this.common,
              cooperationLevelCode: this.cooperationLevelCode,
            });
          }
        });
        this.$forceUpdate();
      }
    },
    // 获取商机管理-采购形式下拉框参数
    getPurchaseModality() {
      if (!(this.common && this.common.purchaseModality && this.common.purchaseModality.length > 0)) {
        purchaseModality().then((res) => {
          if (res.code === '200') {
            this.purchaseModality = res.data.map((item) => ({
              name: item.name,
              id: item.code,
            }));
            this.setCommon({
              ...this.common,
              purchaseModality: this.purchaseModality,
            });
          }
        });
        this.$forceUpdate();
      }
    },
    // 获取采购管理-首次采购方式下拉框参数
    getPurchaseType() {
      if (!(this.common && this.common.purchaseType && this.common.purchaseType.length > 0)) {
        purchaseType().then((res) => {
          if (res.code === '200') {
            this.purchaseType = res.data.map((item) => ({
              name: item.name,
              id: item.code,
            }));
            this.setCommon({
              ...this.common,
              purchaseType: this.purchaseType,
            });
          }
        });
        this.$forceUpdate();
      }
    },

    // 获取商机管理-市场类型下拉框参数
    getMarketType() {
      if (!(this.common && this.common.marketType && this.common.marketType.length > 0)) {
        marketType().then((res) => {
          if (res.code === '200') {
            this.marketType = res.data.map((item) => ({
              name: item.name,
              id: item.code,
            }));
            this.setCommon({
              ...this.common,
              marketType: this.marketType,
            });
          }
        });
        this.$forceUpdate();
      }
    },

    // 获取商机管理-商机类别下拉框参数
    getOpportunityCategory() {
      if (!(this.common && this.common.opportunityCategory && this.common.opportunityCategory.length > 0)) {
        opportunityCategory().then((res) => {
          if (res.code === '200') {
            this.opportunityCategory = res.data.map((item) => ({
              name: item.name,
              id: item.code,
            }));
            this.setCommon({
              ...this.common,
              opportunityCategory: this.opportunityCategory,
            });
          }
        });
        this.$forceUpdate();
      }
    },

    // 获取商机管理-投标状态下拉框参数
    getTenderStateInfo() {
      if (!(this.common && this.common.tenderStateInfo && this.common.tenderStateInfo.length > 0)) {
        tenderStateInfo().then((res) => {
          if (res.code === '200') {
            this.tenderStateInfo = res.data.map((item) => ({
              name: item.name,
              id: item.code,
            }));
            this.setCommon({
              ...this.common,
              tenderStateInfo: this.tenderStateInfo,
            });
          }
        });
        this.$forceUpdate();
      }
    },

    // 获取商机管理-拓展类型下拉框参数
    getExpandType() {
      if (!(this.common && this.common.expandType && this.common.expandType.length > 0)) {
        expandType().then((res) => {
          if (res.code === '200') {
            this.expandType = res.data.map((item) => ({
              name: item.name,
              id: item.code,
            }));
            this.setCommon({
              ...this.common,
              expandType: this.expandType,
            });
          }
        });
        this.$forceUpdate();
      }
    },

    // 获取项目管理-税率下拉框参数
    getTaxRateCode() {
      if (!(this.common && this.common.taxRateCode && this.common.taxRateCode.length > 0)) {
        dictionaryListByConditions({
          data: {
            code: 'tax_rate',
          },
          pageNo: 1,
          pageSize: 1000,
          sorting: 'id desc',
        }).then((res) => {
          if (res.code === '200') {
            this.taxRateCode = res.data.data.map((item) => ({
              ...item,
              name: item.name,
              id: item.code,
            }));
            this.setCommon({
              ...this.common,
              taxRateCode: this.taxRateCode,
            });
          }
        });
        this.$forceUpdate();
      }
    },
    // 获取款项类型
    getFundsType() {
      if (!(this.common && this.common.fundsType && this.common.fundsType.length > 0)) {
        dictionaryListByConditions({
          data: {
            code: 'fundsType',
          },
          pageNo: 1,
          pageSize: 1000,
          sorting: 'id desc',
        }).then((res) => {
          if (res.code === '200') {
            this.fundsType = res.data.data.map((item) => ({
              ...item,
              name: item.name,
              id: item.code,
            }));
            this.setCommon({
              ...this.common,
              fundsType: this.fundsType,
            });
          }
        });
        this.$forceUpdate();
      }
    },
    // 获取项目状态下拉框参数
    getProjectStatusCode() {
      if (!(this.common && this.common.projectStatusCode && this.common.projectStatusCode.length > 0)) {
        dictionaryListByConditions({
          data: {
            code: 'project_status',
          },
          pageNo: 1,
          pageSize: 1000,
          sorting: 'id desc',
        }).then((res) => {
          if (res.code === '200') {
            this.projectStatusCode = res.data.data.map((item) => ({
              ...item,
              name: item.name,
              id: item.code,
            }));
            this.setCommon({
              ...this.common,
              projectStatusCode: this.projectStatusCode,
            });
          }
        });
        this.$forceUpdate();
      }
    },
    // 获取合同类型下拉框参数
    getContractTypeCode() {
      if (!(this.common && this.common.contractTypeCode && this.common.contractTypeCode.length > 0)) {
        dictionaryListByConditions({
          data: {
            code: 'contract_type',
          },
          pageNo: 1,
          pageSize: 1000,
          sorting: 'id desc',
        }).then((res) => {
          if (res.code === '200') {
            this.contractTypeCode = res.data.data.map((item) => ({
              ...item,
              name: item.name,
              id: item.code,
            }));
            this.setCommon({
              ...this.common,
              contractTypeCode: this.contractTypeCode,
            });
          }
        });
        this.$forceUpdate();
      }
    },
    // 获取计税方式下拉框参数
    getTaxTypeCode() {
      if (!(this.common && this.common.taxTypeCode && this.common.taxTypeCode.length > 0)) {
        dictionaryListByConditions({
          data: {
            code: 'TAX_TYPE',
          },
          pageNo: 1,
          pageSize: 1000,
          sorting: 'id desc',
        }).then((res) => {
          if (res.code === '200') {
            this.taxTypeCode = res.data.data.map((item) => ({
              ...item,
              name: item.name,
              id: item.code,
            }));
            this.setCommon({
              ...this.common,
              taxTypeCode: this.taxTypeCode,
            });
          }
        });
        this.$forceUpdate();
      }
    },
    // 获取经营方式下拉框参数
    getModeTypeCode() {
      if (!(this.common && this.common.modeType && this.common.modeType.length > 0)) {
        dictionaryListByConditions({
          data: {
            code: 'mode_type',
          },
          pageNo: 1,
          pageSize: 1000,
          sorting: 'id desc',
        }).then((res) => {
          if (res.code === '200') {
            this.modeType = res.data.data.map((item) => ({
              ...item,
              name: item.name,
              id: item.code,
            }));
            this.setCommon({
              ...this.common,
              modeType: this.modeType,
            });
          }
        });
        this.$forceUpdate();
      }
    },
    // 获取合作模式下拉框参数
    getCooperationModeCode() {
      if (!(this.common && this.common.cooperationMode && this.common.cooperationMode.length > 0)) {
        dictionaryListByConditions({
          data: {
            code: 'cooperation_mode',
          },
          pageNo: 1,
          pageSize: 1000,
          sorting: 'id desc',
        }).then((res) => {
          if (res.code === '200') {
            this.cooperationMode = res.data.data.map((item) => ({
              ...item,
              name: item.name,
              id: item.code,
            }));
            this.setCommon({
              ...this.common,
              cooperationMode: this.cooperationMode,
            });
          }
        });
        this.$forceUpdate();
      }
    },
    // 获取商机使用日志列表-操作类型下拉框参数
    getOperationType() {
      if (!(this.common && this.common.operationType && this.common.operationType.length > 0)) {
        operationType().then((res) => {
          if (res.code === '200') {
            this.operationType = res.data.map((item) => ({
              name: item.name,
              id: item.code,
            }));
            this.setCommon({
              ...this.common,
              operationType: this.operationType,
            });
          }
        });
        this.$forceUpdate();
      }
    },

    // 获取回款管理-款项性质下拉框参数
    getRecordAdjustType() {
      if (!(this.common && this.common.recordAdjustType && this.common.recordAdjustType.length > 0)) {
        dictionaryListByConditions({
          data: {
            code: 'record_adjust_type',
          },
          pageNo: 1,
          pageSize: 1000,
          sorting: 'id desc',
        }).then((res) => {
          if (res.code === '200') {
            this.recordAdjustType = res.data.data.map((item) => ({
              ...item,
              name: item.name,
              id: item.code,
            }));
            this.setCommon({
              ...this.common,
              recordAdjustType: this.recordAdjustType,
            });
          }
        });
        this.$forceUpdate();
      }
    },

    // 获取财务应付管理-委托方下拉框参数
    // getConstruction() {
    //   if (!(this.common && this.common.construction && this.common.construction.length > 0)) {
    //     dictionaryListByConditions({
    //       data: {
    //         code: 'construction',
    //       },
    //       pageNo: 1,
    //       pageSize: 1000,
    //       sorting: 'id desc',
    //     }).then((res) => {
    //       if (res.code === '200') {
    //         this.construction = res.data.data.map((item) => ({
    //           ...item,
    //           name: item.name,
    //           id: item.code,
    //         }));
    //         this.setCommon({
    //           ...this.common,
    //           construction: this.construction,
    //         });
    //       }
    //     });
    //     this.$forceUpdate();
    //   }
    // },

    // 获取财务列账确认-发票类型下拉框参数
    getInvoiceType(code) {
      if (!(this.common && this.common.invoiceType && this.common.invoiceType.length > 0)) {
        invoiceType(code).then((res) => {
          if (res.code === '200') {
            this.invoiceType = res.data.map((item) => ({
              name: item.name,
              id: item.code,
            }));
            this.setCommon({
              ...this.common,
              invoiceType: this.invoiceType,
            });
          }
        });
        this.$forceUpdate();
      }
    },
    // 获取发票状态下拉框参数
    getInvoiceStatus() {
      if (!(this.common && this.common.invoiceStatus && this.common.invoiceStatus.length > 0)) {
        selectListByParentCode('invoiceStatus').then((res) => {
          if (res.code === '200') {
            this.invoiceStatus = res.data.map((item) => ({
              name: item.name,
              id: item.code,
            }));
            this.setCommon({
              ...this.common,
              invoiceStatus: this.invoiceStatus,
            });
          }
        });
        this.$forceUpdate();
      }
    },
    // 获取资质类型方式下拉框参数
    getQualificationTypeCode(code) {
      if (!(this.common && this.common.qualificationType && this.common.qualificationType.length > 0)) {
        selectListByParentCode(code).then((res) => {
          if (res.code === '200') {
            this.qualificationType = res.data.map((item) => ({
              name: item.name,
              id: item.code,
            }));
            this.setCommon({
              ...this.common,
              qualificationType: this.qualificationType,
            });
          }
        });
        this.$forceUpdate();
      }
    },
    // 获取用途类型方式下拉框参数
    getUseTypeCode(code) {
      if (!(this.common && this.common.useType && this.common.useType.length > 0)) {
        selectListByParentCode(code).then((res) => {
          if (res.code === '200') {
            this.useType = res.data.map((item) => ({
              name: item.name,
              id: item.code,
            }));
            this.setCommon({
              ...this.common,
              useType: this.useType,
            });
          }
        });
        this.$forceUpdate();
      }
    },
    // 获取审批类型方式下拉框参数
    getApprovalStatusCode(code) {
      if (!(this.common && this.common.approvalStatus && this.common.approvalStatus.length > 0)) {
        selectListByParentCode(code).then((res) => {
          if (res.code === '200') {
            this.approvalStatus = res.data.map((item) => ({
              name: item.name,
              id: item.code,
            }));
            this.setCommon({
              ...this.common,
              approvalStatus: this.approvalStatus,
            });
          }
        });
        this.$forceUpdate();
      }
    },
    // 获取下载状态下拉框参数
    getDownloadStatusType() {
      if (!(this.common && this.common.downloadStatusType && this.common.downloadStatusType.length > 0)) {
        this.downloadStatusType = [
          {
            name: '未下载',
            id: '0',
          },
          {
            name: '已下载',
            id: '1',
          },
        ];
        this.setCommon({
          ...this.common,
          downloadStatusType: this.downloadStatusType,
        });
        this.$forceUpdate();
      }
    },
    // 获取呈现状态下拉框参数
    getDisplayStatus() {
      if (!(this.common && this.common.displayStatus && this.common.displayStatus.length > 0)) {
        this.displayStatus = [
          {
            name: '不呈现',
            id: '0',
          },
          {
            name: '呈现',
            id: '1',
          },
        ];
        this.setCommon({
          ...this.common,
          displayStatus: this.displayStatus,
        });
        this.$forceUpdate();
      }
    },
    // 获取预警状态下拉框参数
    getWarningStatus() {
      if (!(this.common && this.common.warningStatus && this.common.warningStatus.length > 0)) {
        this.warningStatus = [
          {
            name: '预警',
            id: '0',
          },
          {
            name: '过期',
            id: '1',
          },
        ];
        this.setCommon({
          ...this.common,
          warningStatus: this.warningStatus,
        });
        this.$forceUpdate();
      }
    },
    // 获取学历类型方式下拉框参数
    getEducationCode(code) {
      if (!(this.common && this.common.education && this.common.education.length > 0)) {
        selectListByParentCode(code).then((res) => {
          if (res.code === '200') {
            this.education = res.data.map((item) => ({
              name: item.name,
              id: item.code,
            }));
            this.setCommon({
              ...this.common,
              education: this.education,
            });
          }
        });
        this.$forceUpdate();
      }
    },
    // 获取资质状态下拉框参数
    getQualificationStatusCode(code) {
      if (!(this.common && this.common.qualificationStatus && this.common.qualificationStatus.length > 0)) {
        selectListByParentCode(code).then((res) => {
          if (res.code === '200') {
            this.qualificationStatus = res.data.map((item) => ({
              name: item.name,
              id: item.code,
            }));
            this.setCommon({
              ...this.common,
              qualificationStatus: this.qualificationStatus,
            });
          }
        });
        this.$forceUpdate();
      }
    },
    // 获取人员资质岗位状态下拉框参数
    getPostStatusCode(code) {
      if (!(this.common && this.common.postStatus && this.common.postStatus.length > 0)) {
        selectListByParentCode(code).then((res) => {
          if (res.code === '200') {
            this.postStatus = res.data.map((item) => ({
              name: item.name,
              id: item.code,
            }));
            this.setCommon({
              ...this.common,
              postStatus: this.postStatus,
            });
          }
        });
        this.$forceUpdate();
      }
    },
    // 获取合作性质状态下拉框参数
    getCooperationNatureCode(code) {
      if (!(this.common && this.common.cooperationNature && this.common.cooperationNature.length > 0)) {
        selectListByParentCode(code).then((res) => {
          if (res.code === '200') {
            this.cooperationNature = res.data.map((item) => ({
              name: item.name,
              id: item.code,
            }));
            this.setCommon({
              ...this.common,
              cooperationNature: this.cooperationNature,
            });
          }
        });
        this.$forceUpdate();
      }
    },
    // 获取站点状态下拉框参数
    getStationStatus(code) {
      if (!(this.common && this.common.stationStatus && this.common.stationStatus.length > 0)) {
        selectListByParentCode(code).then((res) => {
          if (res.code === '200') {
            this.stationStatus = res.data.map((item) => ({
              name: item.name,
              id: item.code,
            }));
            this.setCommon({
              ...this.common,
              stationStatus: this.stationStatus,
            });
          }
        });
        this.$forceUpdate();
      }
    },
    // 获取委托模式下拉框参数
    getEntrustType(code) {
      if (!(this.common && this.common.entrustType && this.common.entrustType.length > 0)) {
        selectListByParentCode(code).then((res) => {
          if (res.code === '200') {
            this.entrustType = res.data.map((item) => ({
              name: item.name,
              id: item.code,
            }));
            this.setCommon({
              ...this.common,
              entrustType: this.entrustType,
            });
          }
        });
        this.$forceUpdate();
      }
    },
    // 获取结算方式下拉框参数
    getSettlementType(code) {
      if (!(this.common && this.common.settlementType && this.common.settlementType.length > 0)) {
        selectListByParentCode(code).then((res) => {
          if (res.code === '200') {
            this.settlementType = res.data.map((item) => ({
              name: item.name,
              id: item.code,
            }));
            this.setCommon({
              ...this.common,
              settlementType: this.settlementType,
            });
          }
        });
        this.$forceUpdate();
      }
    },
    getIsHas(code) {
      if (!(this.common && this.common.isHas && this.common.isHas.length > 0)) {
        this.isHas = [
          {
            id: '0',
            name: '无',
          },
          {
            id: '1',
            name: '有',
          },
        ];
        this.setCommon({
          ...this.common,
          isHas: this.isHas,
        });
        this.$forceUpdate();
      }
    },
    getUseStatus(code) {
      if (!(this.common && this.common.useStatus && this.common.useStatus.length > 0)) {
        this.useStatus = [
          {
            id: '1',
            name: '有效',
          },
          {
            id: '2',
            name: '核销',
          },
          {
            id: '3',
            name: '过期',
          },
        ];
        this.setCommon({
          ...this.common,
          useStatus: this.useStatus,
        });
        this.$forceUpdate();
      }
    },
    getIsJudge(code) {
      if (!(this.common && this.common.isJudge && this.common.isJudge.length > 0)) {
        this.isJudge = [
          {
            id: '0',
            name: '否',
          },
          {
            id: '1',
            name: '是',
          },
        ];
        this.setCommon({
          ...this.common,
          isJudge: this.isJudge,
        });
        this.$forceUpdate();
      }
    },
    // 获取合同种类下拉框参数
    getProjectType(code) {
      if (!(this.common && this.common.projectType && this.common.projectType.length > 0)) {
        selectListByParentCode(code).then((res) => {
          if (res.code === '200') {
            this.projectType = res.data.map((item) => ({
              name: item.name,
              id: item.code,
            }));
            this.setCommon({
              ...this.common,
              projectType: this.projectType,
            });
          }
        });
        this.$forceUpdate();
      }
    },
    // 获取站点类型下拉框参数
    getStationType(code) {
      if (!(this.common && this.common.stationType && this.common.stationType.length > 0)) {
        selectListByParentCode(code).then((res) => {
          if (res.code === '200') {
            this.stationType = res.data.map((item) => ({
              name: item.name,
              id: item.code,
            }));
            this.setCommon({
              ...this.common,
              stationType: this.stationType,
            });
          }
        });
        this.$forceUpdate();
      }
    },
    // 获取回填状态类型下拉框参数
    getBackFill(code) {
      if (!(this.common && this.common.backFill && this.common.backFill.length > 0)) {
        selectListByParentCode(code).then((res) => {
          if (res.code === '200') {
            this.backFill = res.data.map((item) => ({
              name: item.name,
              id: item.code,
            }));
            this.setCommon({
              ...this.common,
              backFill: this.backFill,
            });
          }
        });
        this.$forceUpdate();
      }
    },
    // 获取费用类型下拉框参数
    getInvoiceFeeType(code) {
      if (!(this.common && this.common.invoiceFeeType && this.common.invoiceFeeType.length > 0)) {
        selectListByParentCode(code).then((res) => {
          if (res.code === '200') {
            this.invoiceFeeType = res.data.map((item) => ({
              name: item.name,
              id: item.code,
            }));
            this.setCommon({
              ...this.common,
              invoiceFeeType: this.invoiceFeeType,
            });
          }
        });
        this.$forceUpdate();
      }
    },
    // 获取合作发票工单状态下拉框参数
    getCooperationInvoiceStatus(code) {
      if (!(this.common && this.common.cooperationInvoiceStatus && this.common.cooperationInvoiceStatus.length > 0)) {
        selectListByParentCode(code).then((res) => {
          if (res.code === '200') {
            this.cooperationInvoiceStatus = res.data.map((item) => ({
              name: item.name,
              id: item.code,
            }));
            this.setCommon({
              ...this.common,
              cooperationInvoiceStatus: this.cooperationInvoiceStatus,
            });
          }
        });
        this.$forceUpdate();
      }
    },
    // 获取合作发票核销记录状态下拉框
    getWriteOffStatus(code) {
      if (!(this.common && this.common.writeOffStatus && this.common.writeOffStatus.length > 0)) {
        selectListByParentCode(code).then((res) => {
          if (res.code === '200') {
            this.writeOffStatus = res.data.map((item) => ({
              name: item.name,
              id: item.code,
            }));
            this.setCommon({
              ...this.common,
              writeOffStatus: this.writeOffStatus,
            });
          }
        });
        this.$forceUpdate();
      }
    },
    getInstionFeeType(code) {
      if (!(this.common && this.common.instionFeeType && this.common.instionFeeType.length > 0)) {
        this.instionFeeType = [
          {
            id: '0',
            name: '电费',
          },
          {
            id: '1',
            name: '服务费',
          },
        ];
        this.setCommon({
          ...this.common,
          instionFeeType: this.instionFeeType,
        });
        this.$forceUpdate();
      }
    },
    // 获取商品种类
    getGoodsType(code) {
      if (!(this.common && this.common.goodsType && this.common.goodsType.length > 0)) {
        selectListByParentCode(code).then((res) => {
          if (res.code === '200') {
            this.goodsType = res.data.map((item) => ({
              name: item.name,
              id: item.code,
              ...item,
            }));
            this.setCommon({
              ...this.common,
              goodsType: this.goodsType,
            });
          }
        });
        this.$forceUpdate();
      }
    },
    // // 获取委托方下拉框参数
    // getTaxNumber(code) {
    //   if (!(this.common && this.common.taxNumber && this.common.taxNumber.length > 0)) {
    //     selectListByParentCode(code).then((res) => {
    //       if (res.code === '200') {
    //         this.taxNumber = res.data.map((item) => ({
    //           name: item.name,
    //           id: item.id,
    //         }));
    //         this.setCommon({
    //           ...this.common,
    //           taxNumber: this.taxNumber,
    //         });
    //       }
    //     });
    //     this.$forceUpdate();
    //   }
    // },
  },
});

export default commonApi;
