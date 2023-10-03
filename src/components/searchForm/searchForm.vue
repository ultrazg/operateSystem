<template>
  <div id="searchForm">
    <div class="openBtn" v-if="searchItem.length > showNum" @click="setSenior">
      <em class="iconfont" :class="senior ? 'el-icon-caret-bottom' : 'el-icon-caret-top'"></em>
    </div>
    <!-- <el-button
      class="seniorBtn f-12 cl f-l"
      size="small"
      v-if="searchItem.length > 2"
      @click="setSenior"
    >
      {{ senior ? "高级查询" : "取消高级查询" }}
    </el-button> -->
    <el-form class="searchFrom" :label-position="labelPos" :label-width="'100px'" :model="formData" ref="formRef">
      <div style="width: 100%; overflow: hidden">
        <el-row class="searchItem">
          <template v-for="(item, index) in searchItem" :span="item.span || 6">
            <el-form-item
              :key="`formItem${newKeys[index + 1]}`"
              class="form-group"
              :label="`${item.label ? item.label : ''}${item.label ? (item.label.indexOf('：') > -1 ? '' : '：') : ''}`"
              :label-width="`${!item.label ? '0px' : item.labelWidth ? item.labelWidth : '100px'}`"
              :prop="item.props.fieldName"
              :rules="item.props.rules"
              v-if="!item.hide && !(senior && index > showNum - 1)"
            >
              <form-item v-model="formData[item.props.fieldName]" :item="item" @input="changeValue">
                <template :slot="item.props.fieldName" v-if="item && item.type === 'custom'">
                  <slot :name="item.props.fieldName"></slot>
                </template>
              </form-item>
            </el-form-item>
          </template>
          <div class="btnInfo text-center cl" v-if="searchBtnVisible">
            <el-button class="submitBtn f-12 cl f-l" size="small" @click="onSearch">
              <!-- <i class="iconfont icon-chaxun"></i> -->
              查询</el-button
            >
            <!-- <el-button
              class="seniorBtn f-12 cl f-l"
              size="small"
              v-if="searchItem.length > 2"
              @click="setSenior"
            >
              {{ senior ? "高级查询" : "取消高级查询" }}
            </el-button> -->
            <el-button class="f-12 resetBtn cl f-l" size="small" @click="onReset">
              <!-- <i class="iconfont icon-reset"></i> -->
              清空</el-button
            >
          </div>
          <div class="flexRow search" :class="addBtnVisible || otherBtnVisible ? 'hasbtnList' : ''">
            <div class="btnList addBtn" @click="addBtn" v-if="addBtnVisible">
              <em class="iconfont icon-xinzeng f-12" v-if="addBtnIconfont"></em>
              <span class="pos-r">{{ addTitleBtn }}</span>
            </div>
            <div class="btnList addBtn" @click="addBtn301" v-if="addBtnVisible301">
              <em class="iconfont icon-xinzeng f-12" v-if="addBtnIconfont"></em>
              <span class="pos-r">{{ addTitleBtn301 }}</span>
            </div>
            <div class="btnList delBtn" @click="delBtn" v-if="delBtnVisible">
              <em class="iconfont icon-shanchu f-12"></em>
              <span class="pos-r">{{ delTitleBtn }}</span>
            </div>

            <otherBtnList :anBoolean="anBoolean" v-if="otherBtnVisible">
              <ul>
                <li
                  v-for="(item, index) in otherBtnLists"
                  :key="index"
                  class="flexCenter"
                  v-if="!item.hide"
                  :class="item.disabled ? 'disabled' : ''"
                  @click="() => otherClick(item)"
                >
                  <span>{{ item.label }}</span>
                </li>
              </ul>
            </otherBtnList>
          </div>
        </el-row>
      </div>
    </el-form>
  </div>
</template>
<script>
import formItem from './formItem';
import { createUniqueString } from 'util/searchFormTools';
import otherBtnList from '../headerTitle/otherBtnList';
export default {
  props: {
    // label width
    labelWidth: {
      type: String,
      default: '70px',
    },
    labelPos: {
      type: String,
      default: 'right',
    },
    // 所有的搜索组件
    searchItems: {
      type: Array,
      required: true,
      default: () => [],
    },
    addTitleBtn: {
      type: String,
      default: '新增',
    },
    addTitleBtn301: {
      type: String,
      default: '新增',
    },
    delTitleBtn: {
      type: String,
      default: '删除',
    },
    search: {
      type: Boolean,
      default: true,
    },
    // 添加按钮显示
    addBtnVisible: {
      type: Boolean,
      default: false,
    },
    addBtnVisible301: {
      type: Boolean,
      default: false,
    },
    delBtnVisible: {
      type: Boolean,
      default: false,
    },
    // 是否显示查询按钮
    otherBtnVisible: {
      type: Boolean,
      default: false,
    },
    otherBtnLists: {
      type: Array,
      default: null,
    },
    addBtnIconfont: {
      type: Boolean,
      default: false,
    },
    an: Number,
    showNum: {
      type: Number,
      default: 3,
    },
    open: {
      type: Boolean,
      default: false,
    },
    searchBtnVisible: {
      // 是否显示查询清空按钮
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      formData: {},
      senior: false,
      searchItem: [],
      anBoolean: 0,
    };
  },
  watch: {
    searchItemsCoby: {
      handler(newVal, oval) {
        if (newVal !== oval && this.searchItems.length > 0) {
          this.searchItem = this.searchItems.filter((value) => value);
          this.addInitValue();
        }
      },
      immediate: true,
      deep: true,
    },
    formData: {
      deep: true,
      handler(val) {
        this.$emit('onChange', val);
      },
    },
  },
  computed: {
    // 生成唯一Key字符串标识
    newKeys() {
      return this.searchItem.map((v) => createUniqueString());
    },
    // 更深层次检测searchItems变化
    searchItemsCoby() {
      return JSON.parse(JSON.stringify(this.searchItems));
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.searchItem = this.searchItems.filter((value) => value);
      // this.senior = this.searchItem.length > this.showNum;
      // this.addInitValue();
    });
  },
  methods: {
    changeValue(val) {
      const key = Object.keys(val)[0];

      this.formData = {
        ...this.formData,
        [key]: val[key],
      };
    },
    // 校验
    onValidate(callback) {
      this.$refs.formRef.validate((valid) => {
        if (valid) {
          callback();
        }
      });
    },
    // 搜索按钮传给父组件
    onSearch() {
      this.onValidate(() => {
        // 选择框“全部”选项过滤赋值
        const formData = {};

        Object.keys(this.formData).forEach((data) => {
          if (this.formData[data] !== 'null' && this.formData[data] !== '') {
            formData[data] = this.formData[data];
          }
        });
        this.$emit('onSearch', formData);
      });
    },
    onReset() {
      this.formData = {};
      this.$refs.formRef.resetFields();
      this.forceUpdate(); // 重置组件
      this.$emit('onReset');
    },
    onResetField(name) {
      this.formData[name] = undefined;
      this.$refs.formRef.resetField(name);
    },
    // 添加初始值
    async addInitValue() {
      let obj = {
        ...this.formData,
      };
      // console.log('this.searchItem', this.searchItem)

      await this.searchItem.forEach((v, index) => {
        if (v.initValue !== undefined) {
          obj = {
            ...obj,
            [v.props.fieldName]: v.initValue,
          };
        }
        if (this.formData[v.props.fieldName]) {
          obj = {
            ...obj,
            [v.props.fieldName]: this.formData[v.props.fieldName],
          };
        }
        if (v.type === 'select') {
          const itemIndex =
            v.props.options && v.props.options.findIndex((option) => option.id === obj[v.props.fieldName]);

          if (itemIndex < 0) {
            obj[v.props.fieldName] = undefined;
          }
        }
      });
      this.$nextTick(() => {
        this.formData = {
          ...obj,
        };
      });
    },
    forceUpdate() {
      // this.addInitValue();
      this.$forceUpdate();
    },
    setSenior() {
      this.senior = !this.senior;
      if (this.senior) {
        this.searchItem.forEach((item, index) => {
          if (index > this.showNum - 1) {
            delete this.formData[item.props.fieldName];
          }
        });
      }
    },
    otherClick(item) {
      if (item.disabled) {
        this.$notifyError('请先选择列表数据');

        return;
      }
      this.anBoolean = 1;
      item.click();
    },
    // 点击新增按钮
    addBtn() {
      this.$emit('onAddBtn', true);
    },
    delBtn() {
      this.$emit('onDelBtn', true);
    },
    exportBtn() {
      this.$emit('onExportBtn');
    },
    addBtn301() {
      this.$emit('onAddBtn301', true);
    },
    getFormData() {
      return this.formData;
    },
  },
  components: {
    formItem,
    otherBtnList,
  },
};
</script>
<style lang="less">
#searchForm {
  // display: inline-block;
  // float: left;
  .openBtn {
    cursor: pointer;
    width: 16px;
    height: 16px;
    line-height: 16px;
    color: #e81f37;
    background: #e3e3e3;
    display: inline-block;
    position: absolute;
    right: 0;
    top: 0;
    text-align: center;
    i {
      font-size: 12px;
      line-height: inherit;
    }
  }
}
.searchFrom {
  // justify-content: flex-end;
  .el-row {
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    margin-bottom: -10px;
    /deep/.el-col {
      margin-bottom: 10px;
      // margin-right: 10px;
      .el-form-item {
        margin-bottom: 0px;
      }
    }
  }
  .searchItem {
    // margin-left: 20px;
    display: inline-flex;
    vertical-align: middle;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: flex-end;
    label {
      height: 30px;
      line-height: 30px;
    }
  }
  .btnInfo {
    margin-bottom: 10px;
    overflow: hidden;
    display: inline-block;
    vertical-align: middle;
  }
  button {
    min-width: 70px;
    font-size: 14px !important;
    font-weight: 400;
    // margin-bottom: 10px;
    border-radius: 0 !important;
  }
  .form-group {
    margin-right: 10px;
    float: left;
  }
  .submitBtn,
  .seniorBtn,
  .resetBtn {
    margin-left: 0px !important;
    margin-right: 10px;
    // background: rgba(37, 115, 241, 1) !important;
    background: linear-gradient(135deg, #f7660d 0%, #f00a00 100%) !important;
    color: #fff;
    &:hover,
    &:focus,
    &:active {
      color: #fff;
    }
    span {
      i {
        vertical-align: inherit;
      }
    }
  }
  .resetBtn {
    margin-left: 0px !important;
    margin-right: 10px;
    color: #323232;
    background: #fff7f5 !important;
    border: 1px solid #f14d51;

    &:hover,
    &:focus,
    &:active {
      background-color: #fff;
      color: #323232;
    }
  }
  .submitBtn,
  .seniorBtn,
  .resetBtn {
    height: 30px;
    line-height: 0;
    span {
      // line-height: 0;
    }
  }
  .search {
    // display: inline-block;
    margin: 0px 0 10px 0px;
    vertical-align: middle;
    align-items: center;
    .btnList {
      min-width: 70px;
      padding: 0 10px;
      background: linear-gradient(135deg, #f7660d 0%, #f00a00 100%);
      font-size: 14px;
      color: #fff;
      cursor: pointer;
      display: inline-block;
      vertical-align: middle;
      text-align: center;
      // flex-direction: row;
      // align-items: center;
      // justify-content: center;
      margin-right: 10px;
      box-sizing: border-box;
      height: 30px;
      line-height: 30px;
      &.delBtn {
        background: rgba(255, 255, 255, 1);
        border: 1px solid #f00a00;
        color: #f00a00;
      }
    }
    .addBtn {
      height: 30px;
      line-height: 30px;
    }
  }
}
</style>
