/* eslint-disable vue/no-use-v-if-with-v-for */
<template>
  <div id="formItem">
    <el-form ref="formData" :model="preForm" :label-position="labelPos" :label-width="labelWidth" :rules="preRules">
      <wrapper
        v-for="(section, sIndex) in layout"
        :key="`section${sIndex}`"
        :title="section.title"
        :isFold="section.isFold"
        v-show="!section.hide"
      >
        <template slot="header-right" v-if="section.headerRight">
          <slot :name="section.name"></slot>
        </template>
        <div class="flexRow formItemName" v-if="section.name">
          <div class="iconfont icon-icon02" />
          {{ section.name }}
        </div>
        <el-row :gutter="labelPos == 'top' ? 20 : 10" :style="rowStyle">
          <template v-for="(item, index) in section.formItems">
            <el-col :key="`item${sIndex}-${index}`" :span="(item && item.span) || 12" v-if="!item.hide">
              <el-form-item
                :label="item && item.label ? `${item && item.label}：` : ``"
                :prop="item && item.prop"
                :class="item.required && 'is-required'"
                v-show="item && !item.hidden"
              >
                <div v-if="item.value && !item.prop">{{ item.value }}</div>
                <div v-else>
                  <!-- 输入框 -->
                  <template v-if="item && item.inputType === 'input'">
                    <el-input
                      v-model.trim="preForm[item.prop]"
                      :disabled="
                        !!item.disabled ? Boolean(item.disabled) : Boolean(section.disabled) || Boolean(disabled)
                      "
                      clearable
                      :maxlength="item.maxlength || 500"
                      :placeholder="item.placeholder ? item.placeholder : `请输入${item.label}`"
                      @input="(val) => onChange(val, item.onChange ? item.onChange : false)"
                      @change="(val) => onChange(val, item.onChange ? item.onChange : false)"
                      @focus="item.onFocus && item.onFocus($event)"
                    >
                      <template slot="prepend" v-if="item.prepend">{{ item.prepend }}</template>
                      <template slot="append" v-if="item.appendStr">{{ item.appendStr }}</template>
                      <el-button
                        class="append"
                        slot="append"
                        v-if="item.append"
                        :icon="item.btnIconClass || 'el-icon-plus'"
                        @click="() => item.onClick()"
                      ></el-button>
                    </el-input>
                  </template>
                  <template v-if="item && item.inputType === 'textarea'">
                    <el-input
                      v-model="preForm[item.prop]"
                      type="textarea"
                      :placeholder="item.placeholder ? item.placeholder : `请输入${item.label}`"
                      :disabled="
                        !!item.disabled ? Boolean(item.disabled) : Boolean(section.disabled) || Boolean(disabled)
                      "
                      clearable
                      :autosize="{
                        minRows: 2,
                        maxRows: 3,
                      }"
                      :maxlength="+item.maxlength"
                      :show-word-limit="item.maxlength ? true : false"
                      @input="change($event)"
                    >
                    </el-input>
                  </template>
                  <!-- 数字输入框 -->
                  <template v-if="item && item.inputType === 'inputNumber'">
                    <el-input-number
                      v-model="preForm[item.prop]"
                      :disabled="
                        !!item.disabled ? Boolean(item.disabled) : Boolean(section.disabled) || Boolean(disabled)
                      "
                      :class="item.class"
                      :min="item.min ? item.min : -Infinity"
                      :max="item.max ? item.max : Infinity"
                      :precision="item.precision !== undefined && item.precision !== null ? item.precision : 2"
                      :step="item.step ? item.step : 1"
                      :controls="item.controls || false"
                      clearable
                      :placeholder="item.placeholder ? item.placeholder : `请输入${item.label}`"
                      @blur="(...val) => inputNumberBlur(...val)"
                      @change="(...val) => inputNumberChange(item.prop, item.onChange ? item.onChange : false, ...val)"
                    >
                    </el-input-number>
                    <div class="append" v-if="item.appendStr">{{ item.appendStr }}</div>
                  </template>
                  <!-- 选择框 -->
                  <template v-if="item && item.inputType === 'select'">
                    <el-select
                      v-model="preForm[item.prop]"
                      :placeholder="item.placeholder ? item.placeholder : `请选择${item.label}`"
                      :disabled="
                        !!item.disabled ? Boolean(item.disabled) : Boolean(section.disabled) || Boolean(disabled)
                      "
                      clearable
                      :filterable="item.filterable || false"
                      :multiple="item.multiple || false"
                      :collapse-tags="false"
                      :allow-create="item.allowCreate"
                      :default-first-option="item.firstOpt"
                      :remote="item.remote"
                      :reserve-keyword="item.reserveKeyword"
                      :remote-method="item.remoteMethod"
                      :value-key="item.valueKey"
                      @focus="item.onFocus && item.onFocus($event)"
                      @change="(val) => onSelectedDrug(val, item, item.onChange ? item.onChange : false)"
                    >
                      <el-option
                        v-for="(option, oIndex) in item.options"
                        :label="option.label || option.name"
                        :value="(item.valueKey && option) || option.id || option.value || option.code || 0"
                        :key="`select-${oIndex}`"
                      />
                      <div
                        class="text-center"
                        v-if="item.pagationShow == true"
                        style="position: sticky; background: #fff; height: 30px; top: 0; z-index: 1"
                      >
                        <el-pagination
                          class="pagination"
                          :layout="item.pagation.layout || 'total, prev, pager, next, jumper'"
                          :current-page="item.pagation.pageNo"
                          :page-size="item.pagation.pageSize"
                          :total="item.pagation.total"
                          @current-change="item.pagation.onCurrentChange($event)"
                          @size-change="item.props.pagation.onPageSizeChange($event)"
                        >
                        </el-pagination>
                      </div>
                    </el-select>
                  </template>
                  <template v-if="item && item.inputType === 'dataPicker'">
                    <el-date-picker
                      v-model="preForm[item.prop]"
                      type="datetime"
                      :placeholder="item.placeholder ? item.placeholder : `请选择${item.label}`"
                      :disabled="
                        !!item.disabled ? Boolean(item.disabled) : Boolean(section.disabled) || Boolean(disabled)
                      "
                      clearable
                      :format="item.formatText || 'yyyy 年 MM 月 dd 日'"
                      :value-format="item.format || 'yyyy-MM-dd'"
                    >
                    </el-date-picker>
                  </template>
                  <template v-if="item && item.inputType === 'year'">
                    <el-date-picker
                      v-model="preForm[item.prop]"
                      type="year"
                      :placeholder="item.placeholder ? item.placeholder : `请选择${item.label}`"
                      :disabled="
                        !!item.disabled ? Boolean(item.disabled) : Boolean(section.disabled) || Boolean(disabled)
                      "
                      clearable
                      format="yyyy 年"
                      :value-format="item.format || 'yyyy'"
                    >
                    </el-date-picker>
                  </template>
                  <template v-if="item && item.inputType === 'month'">
                    <el-date-picker
                      v-model="preForm[item.prop]"
                      type="month"
                      :placeholder="item.placeholder ? item.placeholder : `请选择${item.label}`"
                      :disabled="
                        !!item.disabled ? Boolean(item.disabled) : Boolean(section.disabled) || Boolean(disabled)
                      "
                      clearable
                      format="MM 月"
                      :value-format="item.format || 'MM'"
                    >
                    </el-date-picker>
                  </template>
                  <template v-if="item && item.inputType === 'daterange'">
                    <el-date-picker
                      v-model="preForm[item.prop]"
                      type="daterange"
                      range-separator="-"
                      :start-placeholder="`请选择开始日期`"
                      :end-placeholder="`请选择结束日期`"
                      :disabled="
                        !!item.disabled ? Boolean(item.disabled) : Boolean(section.disabled) || Boolean(disabled)
                      "
                      clearable
                      :format="item.format || 'yyyy 年 MM 月 dd 日'"
                      :value-format="item.formatValue || 'yyyy-MM-dd'"
                    >
                    </el-date-picker>
                  </template>
                  <template v-if="item && item.inputType === 'date'">
                    <el-date-picker
                      v-model="preForm[item.prop]"
                      type="date"
                      :placeholder="item.placeholder ? item.placeholder : `请选择${item.label}`"
                      :disabled="
                        !!item.disabled ? Boolean(item.disabled) : Boolean(section.disabled) || Boolean(disabled)
                      "
                      clearable
                      format="yyyy-MM-dd"
                      :value-format="item.format || 'yyyy-MM-dd'"
                    >
                    </el-date-picker>
                  </template>
                  <!-- 级联选择框 -->
                  <template v-if="item && item.inputType === 'cascader'">
                    <el-cascader
                      v-model="preForm[item.prop]"
                      :placeholder="item.placeholder ? item.placeholder : `请选择${item.label}`"
                      :disabled="
                        !!item.disabled ? Boolean(item.disabled) : Boolean(section.disabled) || Boolean(disabled)
                      "
                      clearable
                      :options="item.options"
                    >
                    </el-cascader>
                  </template>
                  <template v-if="item && item.inputType === 'radio'">
                    <el-radio-group
                      class="radioGroup"
                      v-model="preForm[item.prop]"
                      :disabled="
                        !!item.disabled ? Boolean(item.disabled) : Boolean(section.disabled) || Boolean(disabled)
                      "
                    >
                      <el-radio v-for="ch in item.options" :label="ch.value || ch.id" :key="ch.value || ch.id">
                        {{ ch.text || ch.name }}
                      </el-radio>
                    </el-radio-group>
                  </template>
                  <template v-if="item && item.inputType === 'upload'">
                    <el-upload
                      class="upload"
                      ref="upload"
                      :action="''"
                      :on-remove="(...val) => removeUpload(item, val)"
                      :on-success="(...val) => successUpload(item, val)"
                      :disabled="
                        !!item.disabled ? Boolean(item.disabled) : Boolean(section.disabled) || Boolean(disabled)
                      "
                      :on-error="(...val) => errorUpload(item, val)"
                      :on-progress="(...val) => progressUpload(item, val)"
                      :on-change="(...val) => changeUpload(item, val)"
                      :before-upload="(...val) => beforeUpload(item, val)"
                      :accept="item.accept || ''"
                      :show-file-list="false"
                      :auto-upload="false"
                      :http-request="(...val) => httpRequestUpload(item, val)"
                      :file-list="preForm[item.prop]"
                      :multiple="item.multiple || true"
                      :limit="item.limit || 10"
                    >
                      <slot name="center">
                        <div class="flexRow uploadText">
                          <el-button
                            slot="trigger"
                            size="small"
                            type="primary"
                            class="flexCenter uploadBtn"
                            :disabled="
                              !!item.disabled ? Boolean(item.disabled) : Boolean(section.disabled) || Boolean(disabled)
                            "
                            v-if="!Boolean(item.actionHide)"
                          >
                            <img src="~common/images/admin/add.png" class="add" />
                          </el-button>
                          <!-- prop: {{ preForm[item.prop] }} -->
                          <ul v-if="preForm[item.prop] && preForm[item.prop].length > 0" class="flexRow fileLists">
                            <li
                              v-for="(uploadItem, uploadIndex) in preForm[item.prop]"
                              :key="uploadItem.fileCode"
                              class="flexRow"
                            >
                              <span
                                class="name"
                                @click.prevent.stop="item.download ? downUpload(uploadItem) : () => {}"
                                >{{ uploadItem.fileName }}</span
                              >
                              <span
                                class="iconfont icon-shanchu"
                                @click.prevent.stop="removeUpload(item, uploadIndex)"
                                v-if="!Boolean(item.actionHide)"
                              ></span>
                            </li>
                          </ul>
                          <span v-else>{{ item.placeholder ? item.placeholder : `请上传附件` }}</span>
                        </div>
                      </slot>
                    </el-upload>
                  </template>
                  <template v-if="item && item.inputType === 'custom'">
                    <slot :name="item.prop"></slot>
                  </template>
                </div>
              </el-form-item>
            </el-col>
          </template>
        </el-row>
        <slot :name="section.render"></slot>
      </wrapper>
    </el-form>
    <!-- <div class="handle-footer" v-if="isEdit">
      <el-button class="reset-btn" @click="$ResetForm">
        取消
      </el-button>
      <el-button
        class="submit-btn"
        type="primary"
        :disabled="$Loading"
        @click="submitForm"
      >
        确定
      </el-button>
    </div> -->
  </div>
</template>

<script>
import Wrapper from '@/components/wrapper';
import { uploadFile } from '@/api/user';
export default {
  data() {
    return {
      unChange: true,
      preForm: JSON.parse(JSON.stringify(this.form)),
      preRules: {},
      editTimeoutflag: null,
    };
  },
  components: {
    Wrapper,
  },
  props: {
    form: {
      type: Object,
      default() {
        return {};
      },
    },
    layout: {
      type: Array,
      default() {
        return null;
      },
    },
    isEdit: {
      type: Boolean,
      default() {
        return false;
      },
    },
    inPage: {
      type: String,
      default() {
        return 'infoTrans';
      },
    },
    rules: {
      type: Object,
      default() {
        return {};
      },
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    submit: Function,
    labelWidth: {
      type: String,
      default: '120px',
    },
    labelPos: {
      type: String,
      default: 'right',
    },
    /** el-row对齐方式 */
    pageAlign: {
      type: String,
      default: 'left',
    },
  },
  watch: {
    form: {
      deep: true,
      handler(nowVal, oldVal) {
        // console.log('form变化生效', nowVal, oldVal, JSON.stringify(oldVal) !== JSON.stringify(nowVal));
        // Object.assign('handler', this.preForm, nowVal, JSON.stringify(this.preForm) !== JSON.stringify(nowVal));
        if (JSON.stringify(oldVal) !== JSON.stringify(nowVal)) {
          this.preForm = JSON.parse(JSON.stringify(Object.assign(this.preForm, nowVal)));
        }
      },
    },
    layout: {
      deep: true,
      immediate: true,
      handler(nowVal, oldVal) {
        // this.preRules = {};
        // 暂时先注释校验
        // if (!this.disabled) {
        //   nowVal.forEach((element) => {
        //     this.setRules(element.formItems);
        //   });
        // }

        this.$set(this.layout, nowVal);
        this.$forceUpdate();
      },
    },
    preForm: {
      deep: true,
      handler(nowVal, oldVal) {
        this.$emit('update:form', {
          ...oldVal,
          ...nowVal,
        });
        this.$emit('change', nowVal);
      },
    },
    rules: {
      deep: true,
      immediate: true,
      handler(nowVal) {
        this.preRules = nowVal;
      },
    },
  },
  computed: {
    rowStyle() {
      const { pageAlign } = this;
      const ALIGN = {
        left: 'flex-start',
        center: 'center',
        right: 'flex-end',
      };

      return {
        display: 'flex',
        justifyContent: ALIGN[pageAlign],
        alignItems: 'center',
        flexWrap: 'wrap',
      };
    },
  },
  created() {
    this.$nextTick(() => {
      this.$refs.formData.clearValidate();
    });
  },
  methods: {
    submitForm(type = 'submit') {
      this.$refs.formData.validate((valid) => {
        if (valid) {
          const $this = this;

          this.$emit(type, this.preForm);
        } else {
          this.$notify.error({
            title: '失败',
            message: '请填写完整必填数据!!!',
            position: 'bottom-right',
          });

          return false;
        }
      });
    },
    cancelForm() {
      this.$refs.formData.resetFields();
      this.preForm = {};
    },
    clearValidate() {
      // this.$refs.formData.resetFields();
      this.$refs.formData.clearValidate();
    },
    onChange(val, changeStatus) {
      if (changeStatus) {
        // console.log('this.form', this.preForm);
        if (typeof changeStatus === 'function') {
          changeStatus(val);
        } else {
          this.$emit('onChange', this.preForm);
          this.$emit('onInput', this.preForm);
        }
      }
    },
    onSelectedDrug(val, item, changeStatus) {
      if (changeStatus) {
        // console.log("this.form", this.preForm);
        if (typeof changeStatus === 'function') {
          changeStatus(val);
        } else {
          this.$emit('selectedDrug', val, item);
        }
      }
    },
    change(e) {
      this.$emit('onInput', this.preForm);
      this.$forceUpdate();
    },
    getValue(name) {
      return this.preForm[name];
    },
    getAllValue(name) {
      return this.preForm;
    },
    setValue(name, val) {
      if (!val) {
        this.preForm = {
          ...this.preForm,
          [name]: '',
        };
        delete this.preForm[name];
        this.$forceUpdate();

        return;
      }
      this.$set(this.preForm, name, val);
    },
    inputNumberBlur(...val) {
      // console.log('inputNumberBlur', val);
    },
    inputNumberChange(prop, changeStatus, ...val) {
      const newValue = val[0];
      const oldValue = val[1];

      if (typeof changeStatus === 'function') {
        changeStatus(newValue);
      } else {
        this.$emit('onChange', this.preForm);
        this.$emit('onInput', this.preForm);
      }
      // if (this.editTimeoutflag !== null) {
      //   this.editTimeoutflag = null;
      //   this.$nextTick(() => {
      //     console.log('check', typeof changeStatus === 'function');
      //     if (typeof changeStatus === 'function') {
      //       changeStatus(oldValue);
      //     } else {
      //       this.preForm[prop] = oldValue;
      //       this.$emit('onChange', this.preForm);
      //       this.$emit('onInput', this.preForm);
      //     }
      //   });

      //   return;
      // }
      // this.editTimeoutflag = 'x';
      // setTimeout(() => {
      //   this.editTimeoutflag = null;
      // }, 200);
    },
    setRules(formItems) {
      const preRules = {};

      formItems.forEach((item) => {
        if (this.rules[item.prop]) {
          preRules[item.prop] = this.rules[item.prop];
        } else if (item.required && !item.hide) {
          const message = item.inputType === 'select' ? '请选择' : '请输入';
          const trigger = item.inputType === 'select' ? ['change', 'blur'] : 'blur';

          preRules[item.prop] = [
            {
              required: true,
              message: `${message}${item.label}`,
              trigger,
            },
          ];
        }
      });
      this.preRules = {
        ...this.preRules,
        ...preRules,
      };
    },
    // 文件列表移除文件时的钩子
    removeUpload({ prop }, index) {
      this.preForm = {
        ...this.preForm,
        [prop]: this.preForm[prop].splice(index, 1),
      };
      this.$emit('removeUpload', this.preForm[prop]);
    },
    downUpload(uploadItem) {
      const href = `/api/fileupload/download?fileCode=${uploadItem.fileCode}`;

      window.open(href);
    },
    successUpload({ prop }, val) {
      const response = val[0];
      const file = val[1];
      const fileList = val[2];

      this.$emit('successUpload', {
        response,
        file,
        fileList,
      });
      this.preForm = {
        ...this.preForm,
        [prop]: fileList,
      };
    },
    errorUpload({ prop }, val) {
      const err = val[0];
      const file = val[1];
      const fileList = val[2];

      this.$emit('errorUpload', {
        err,
        file,
        fileList,
      });

      this.preForm = {
        ...this.preForm,
        [prop]: fileList,
      };
    },
    // 文件上传时的钩子
    progress({ prop }, val) {
      const event = val[0];
      const file = val[1];
      const fileList = val[2];

      this.$emit('progress', {
        event,
        file,
        fileList,
        rowIndex: this.rowIndex,
      });
      this.preForm = {
        ...this.preForm,
        [prop]: fileList,
      };
    },
    beforeUpload(prop, val) {
      const file = val[0];

      this.$emit('beforeUpload', {
        file,
        rowIndex: this.rowIndex,
      });
      this.preForm = {
        ...this.preForm,
        [prop]: fileList,
      };
    },
    // 文件状态改变时的钩子，添加文件、上传成功和上传失败时都会被调用
    changeUpload({ prop, params }, val) {
      console.log('changeUpload', val);

      const file = val[0];
      const fileList = val[1];

      this.$emit('changeUpload', {
        file,
        fileList,
        rowIndex: this.rowIndex,
      });
      const wfForm = new FormData();

      wfForm.append('file', file.raw);
      Object.keys(params).forEach((param) => {
        wfForm.append(param, params[param]);
      });
      uploadFile(wfForm).then((res) => {
        if (res.code === '200') {
          const fileCode = res.data;

          const list = fileCode.split(':');
          const fileObj = {
            fileCode: list[1],
            fileName: list[0],
          };

          this.preForm = {
            ...this.preForm,
            [prop]: (this.preForm[prop] || []).concat([fileObj]),
          };
          console.log('this.preForm[prop]', this.preForm);
        }
      });
    },
    httpRequestUpload() {
      this.$emit('httpRequestUpload');
    },
  },
};
</script>

<style lang="less">
#formItem {
  // .comp-wrapper-header{
  //   padding: 0;
  // }
  .el-form-item {
    margin-bottom: 12px;
    // margin-right: 12px;
    .el-input {
      width: 100% !important;
    }
  }
  .formItemName {
    padding-left: 30px;
    align-items: center;
    font-size: 16px;
    margin-bottom: 11px;
    color: #444;
    .iconfont {
      margin-right: 10px;
    }
  }
  .el-input-number {
    width: 100%;
    display: block;
    line-height: 33px;
    height: 35px;
    &.is-without-controls {
      .el-input__inner {
        padding: 6px;
      }
    }
    > span {
      height: 27px;
      top: 50%;
      transform: translateY(-50%);
      display: flex;
      align-items: center;
      justify-content: center;
      // &.el-input-number__increase {
      //   top: 2px;
      // }
    }
    .el-input {
      input {
        text-align: left;
      }
    }
  }
  .radioGroup {
    width: 100%;
    text-align: left;
  }
  .el-button.append {
    padding: 0;
    width: 24px;
    height: 24px;
    background: #ffeede;
    border: 1px solid #f95827;
    color: #f95827;
  }
  .el-input-group__append {
    padding: 2px;
    position: absolute;
    right: 3px;
    top: 2px;
  }
  .upload {
    .el-upload {
      width: 100%;
    }
    .uploadText {
      align-items: center;
      .uploadBtn {
        min-width: 24px;
        width: 24px;
        height: 24px;
        padding: 0;
        background: #ffeede;
        border: 1px solid #f95827;
        margin-right: 10px;
        .add {
          width: 10px;
          height: 10px;
        }
      }
      .fileLists {
        width: 100%;
        li {
          max-width: 100%;
          margin-right: 15px;
          .name {
            display: block;
            max-width: calc(100% - 40px);
            margin-right: 20px;
            overflow: hidden; /*超出部分隐藏*/
            white-space: nowrap; /*不换行*/
            text-overflow: ellipsis; /*超出部分文字以...显示*/
          }
          .iconfont {
            font-size: 12px;
            cursor: pointer;
          }
          &:last-child {
            margin-bottom: 0;
          }
        }
      }
    }
  }
}
.handle-footer {
  height: 70px;
  width: 100%;
  position: fixed;
  bottom: 0;
  left: 0;
  background: #fff;
  box-shadow: 0px -3px 4px 0px rgba(222, 222, 222, 0.5);
  padding: 15px 20px;
  display: flex;
  justify-content: flex-end;
  box-sizing: border-box;
  z-index: 12000;
  button {
    width: 88px;
    height: 40px;
    font-size: 14px;
    font-weight: 400;
  }
  .reset-btn {
    border: 1px solid rgba(37, 115, 241, 1);
    margin-right: 20px;
  }
  .submit-btn {
    background: rgba(37, 115, 241, 1);
  }
}
</style>
