<template>
  <div id="mainContent" class="h1">
    <div class="cont-left pos-f" :style="{ width: openMenu ? '55px' : '220px' }">
      <SideMenu
        :openMenu="openMenu"
        :default-active="tageActive"
        :menuData="menuData"
        @on-select="openMenuSelect"
      ></SideMenu>
    </div>

    <header id="topHeader">
      <span class="main-header-title">
        <!-- <span class="system_logo"></span>
        <span> 经营管理系统 </span> -->
        <img src="~common/images/mainView/logo1.png" />
      </span>
      <flex inline align="center">
        <!-- <div class="h-handler address fs14"> -->
        <!-- <em class="iconfont iconditu-dibiao"></em>{{ currentProvince.deptName }} -->
        <!-- </div> -->
        <!-- <div class="h-handler">
          <span class="fs14">
            <img class="avatar" src="~common/images/user.png" />
            {{ userName }}
          </span>
        </div> -->
        <el-dropdown>
          <span class="h-handler dropdown-link fs14">
            <img class="avatar" src="~common/images/mainView/user.png" alt="" />
            {{ userName }}
            <em class="el-icon-arrow-down el-icon--right"></em>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item
              @click.native="
                openMenuSelect({
                  icon: 'iconfont icon-mimaffffffpx',
                  name: 'adminUser',
                  title: '个人中心',
                  query: {
                    userId,
                  },
                })
              "
            >
              <em class="iconfont icon-edit"></em>
              个人中心
            </el-dropdown-item>
            <el-dropdown-item
              @click.native="
                openMenuSelect({
                  icon: 'iconfont icon-mimaffffffpx',
                  name: 'updatePassword',
                  title: '修改密码',
                })
              "
            >
              <em class="iconfont icon-edit"></em>
              修改密码
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <div class="h-handler">
          <el-button type="text" icon="iconfont icon-tuichu" class="quit-button" @click="_outUserLogin">
            退出</el-button
          >
          <!-- <i class="iconfont icon-tuichu"></i> -->
        </div>
      </flex>
    </header>

    <div class="cont-right pos-a" :style="{ left: openMenu ? '55px' : '220px' }">
      <tabs
        @close-type="closeType"
        :menuTagsData="menuTagsData"
        @delTage="delTage"
        @on-select="_tageActive"
        :defaultTage="tageActive"
      ></tabs>
      <!-- <div class="pageTitle">
        <span
          :style="{color:(currentRouteName==item.name?'#065BDC':'#606060')}"
          v-for="(item, index) in currentTitleList"
          :key="index"
        >
          <span>{{item.title}}</span>
          <span style="padding:0 5px" v-if="index!=currentTitleList.length-1">/</span>
        </span>
      </div> -->
      <div v-if="true" class="breadcrumb flexRow flexCenter flexBetween">
        <!-- <img src="~common/images/logo.png" alt="" /> -->
        <span class="openPage">{{ breadcrumb[breadcrumb.length - 1].meta.title }}</span>
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item
            :to="index === 0 || item.meta.closeBack ? false : { name: item.name }"
            v-for="(item, index) in breadcrumb"
            :key="index"
            >{{ item.meta.title }}</el-breadcrumb-item
          >
        </el-breadcrumb>
      </div>
      <div
        class="back"
        :style="{
          display: this.$route.matched[this.$route.matched.length - 1].name === 'edit' ? 'block' : 'none',
        }"
      >
        <el-button type="primary" class="quit-button" @click="goBack">
          <em class="el-icon-back"></em>
          返回
        </el-button>
      </div>
      <!-- :include="keepAliveName" :max="8" -->
      <!-- exclude="combination" -->
      <keep-alive :exclude="'dealwithInfo,qualificationOverview'">
        <router-view
          ref="keepAlive229"
          class="mainContent"
          :style="{
            paddingBottom: contentPaddingBottom,
          }"
        >
        </router-view>
      </keep-alive>
    </div>
    <!-- 修改密码弹框 -->
    <el-dialog title="密码" :visible.sync="modifyShow" width="30%" @open="onOpen" @close="canceledit">
      <div v-if="modifyShow">
        <FormItem
          ref="modifyPassWord"
          :layout="[{ title: '修改密码', formItems: pw.formItems }]"
          :rules="pw.formRules"
          :disabled="pw.inputDisabled"
          :isEdit="pw.isEdit"
          :form.sync="pw.form"
          :midway="pw.midway"
          @submit="checkPass"
          :labelWidth="'120px'"
        ></FormItem>
        <el-alert
          title="密码必须同时包含大写字母、小写字母、数字和特殊字符且至少8位"
          type="error"
          :closable="false"
          :show-icon="showIcon"
        >
        </el-alert>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="modifyShow = false">取 消</el-button>
        <el-button type="primary" @click="confirmModify">确 定</el-button>
      </span>
    </el-dialog>
    <!-- loading -->
    <!-- <div class="loading-bg" v-if="$Loading"></div>
    <div class="loading noselect pos-f" v-if="$Loading">
      <i class="iconfont icon-jiazailoading-A mr-5 anim-rotate anim-loop el-anim"></i>
      <span class="f-13">正在加载，请稍后...</span>
    </div> -->
  </div>
</template>

<script>
import Flex from '@/components/flex';
import Tabs from 'components/tabs/tabs';
import SideMenu from 'components/sideMenu/sideMenu';
import FormItem from '@/components/formItem';
import Config from '@/config';
import { encrypt } from 'util/jsencrypt';
import { getPublicKey, updatePassword } from 'api/user';
// import dialogCont from 'components/dialog';
import { mapGetters, mapMutations, mapActions } from 'vuex';
export default {
  name: 'mainContent',
  data() {
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        return callback(new Error('原密码不能为空'));
      }
      this.pw.form.oldPassword = value;
      callback();

      return value;
    };

    const validatePass2 = (rule, value, callback) => {
      const regex = new RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$', 'u');

      this.pw.form.newPassword = value;
      this.showIcon = false;
      if (value === '') {
        callback(new Error('请输入密码'));
        // 标记 regex.test(value) === false
      } else if (regex.test(value)) {
        this.showIcon = true;
        callback(new Error(' '));
      } else {
        if (this.pw.form.confirmNewPassword === '') {
        } else {
          this.$refs.modifyPassWord.$refs.formData.validateField('confirmNewPassword');
        }
        callback();
      }

      return value;
    };

    const checkNewPass = (rule, value, callback) => {
      this.pw.form.confirmNewPassword = value;
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value === this.pw.form.newPassword) {
        callback();
      } else {
        callback(new Error('两次输入密码不一致!'));
      }

      return value;
    };

    return {
      dialog: {
        note: false, // 便签
        content: '', // 便签内容
      },
      menuActiveClass: false, // 当前被选中菜单
      menuBdWidth: '0px', // 右侧宽度
      openMenu: false, // logo
      zoom: false, // 是否全屏
      openUserCenter: false, // 个人头像下的菜单栏
      currentRouteName: '', // 当前路由name
      pw: {
        formItems: [
          {
            label: '用户账户',
            value: this.$store.state.user.userName,
            required: false,
            span: 24,
          },
          {
            label: '原密码',
            prop: 'oldPassword',
            inputType: 'inputPassWord',
            required: true,
            span: 24,
          },
          {
            label: '新密码',
            prop: 'newPassword',
            inputType: 'inputPassWord',
            required: true,
            span: 24,
          },
          {
            label: '确认密码',
            prop: 'confirmNewPassword',
            inputType: 'inputPassWord',
            required: true,
            span: 24,
          },
        ],
        formRules: {
          oldPassword: [
            {
              required: true,
              validator: validatePass,
              trigger: 'blur',
            },
          ],
          newPassword: [
            {
              required: true,
              validator: validatePass2,
              trigger: 'blur',
            },
          ],
          confirmNewPassword: [
            {
              required: true,
              validator: checkNewPass,
              trigger: 'blur',
            },
          ],
        },
        form: {
          username: '',
          oldPassword: '',
          newPassword: '',
          confirmNewPassword: '',
        },
        inputDisabled: false,
        isEdit: false,
        midway: true,
      },
      modifyShow: false,
      showIcon: false,
      // currentTitleList:[]//当前路由标题列表
    };
  },
  methods: {
    ...mapMutations([
      'setMenuTags',
      'setDelMenuTage',
      'setOpenPage',
      'setMenuTagsList',
      'setCloseAllTab',
      'set_keepAliveRouter',
    ]),
    ...mapActions({
      userLoginOut: 'user/userLoginOut',
    }),
    // 页面刷新
    _refreshPage() {
      window.location.reload();
      this.$router.push({
        name: 'indexPage',
      });
    },
    // 点击左侧菜单添加tage
    openMenuSelect(list) {
      this.setOpenPage(list.name);
      this.setMenuTags(list);
      this.$router.push({
        name: list.name,
        query: {
          ...list.query,
        },
      });
    },
    // 关闭当前tage
    delTage(name) {
      this.setDelMenuTage(name);
      this.$router.push({
        name: this.openPage,
      });
    },
    // 当前选中的tage
    _tageActive(toName) {
      this.setOpenPage(toName);
    },
    // 个人头像下的菜单栏
    _openUserCenter(flag) {
      this.openUserCenter = flag;
    },
    // 打开侧栏
    _openMenu() {
      this.openMenu = !this.openMenu;
    },
    // 窗口缩放
    _zoom() {
      this.zoom = !this.zoom;
    },
    // 退出登录
    _outUserLogin() {
      this.userLoginOut()
        .then()
        .catch((err) => {
          this.$notify.error({
            title: '失败',
            message: err,
            position: 'bottom-right',
          });
        });
    },
    // tab当前关闭菜单方式
    closeType(type) {
      if (!this.menuTags.length) {
        return;
      }
      switch (type) {
        case 'all': // 关闭全部
          this.setOpenPage('indexPage');
          // 首页没有打开过缓存则在首页进行关闭操作
          if (this.keepAliveName.some((i) => i === 'indexPage')) {
            this.setMenuTagsList([]);
            this.set_keepAliveRouter('indexPage');
          } else {
            this.setCloseAllTab(true);
            // 清空操作放在首页进行 (没有缓存下首页打开有需要时间,会有卡顿情况)
            this.setMenuTagsList([]);
            // this.set_keepAliveRouter('indexPage');
          }

          break;
        case 'other': // 关闭其他
          if (this.menuTags.length === 1 && this.menuTags[0].name === this.openPage) {
            return;
          }
          for (let i = 0; i < this.menuTags.length; i++) {
            if (this.menuTags[i].name === this.openPage) {
              const a = this.menuTags.slice(i, i + 1);

              this.setMenuTagsList(a);

              return;
            }
          }
          break;
        default:
      }

      this.$router.push({
        name: this.openPage,
      });
    },
    goBack() {
      this.$router.go(-1);
    },
    // 取消修改密码
    canceledit() {
      this.modifyShow = false;
      this.showIcon = false;
      this.pw.form = {
        username: '',
        oldPassword: '',
        newPassword: '',
        confirmNewPassword: '',
      };
    },
    // 打开修改密码弹框
    onOpen() {
      this.pw.form.username = this.userName;
      this.pw.formItems[0].value = this.userName;
    },
    handleCommand(command) {
      if (command === 'modify') {
        this.modifyShow = true;
      }
    },
    confirmModify() {
      this.$refs.modifyPassWord.submitForm();
    },
    async _getPublicKey() {
      const res = await getPublicKey({});

      if (res.code === '200') {
        return res.data.key;
      }
    },
    _updatePassword(params) {
      updatePassword(params).then((res) => {
        if (res.code === '200') {
          this.$notify({
            title: '成功',
            message: '密码已修改，请重新登录',
            position: 'bottom-right',
            type: 'success',
          });
          this._outUserLogin();
        }
      });
    },
    // 最后确认后调接口修改
    async checkPass(formData) {
      const publicKey = await this._getPublicKey();

      const params = {
        confirmNewPassword: encrypt(formData.confirmNewPassword, publicKey),
        newPassword: encrypt(formData.newPassword, publicKey),
        oldPassword: encrypt(formData.oldPassword, publicKey),
        publicKey,
      };

      this._updatePassword(params);
    },
  },
  computed: {
    ...mapGetters(['menuList', 'menuTags', 'openPage', 'keepAliveName', 'breadcrumb']),
    // 左侧菜单列表
    menuData() {
      return this.menuList;
    },
    // 当前打开的tags路由列表
    menuTagsData() {
      return this.menuTags;
    },
    // 当前选中的tage
    tageActive() {
      if (this.openPage === Config.homeName) {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.$router.push(Config.homeName);
      }

      return this.openPage;
    },
    userName() {
      return this.$store.state.user.username;
    },
    userId() {
      return this.$store.state.user.userId;
    },
    // 菜单标题
    // currentTitleList () {
    //   let currentTitleList = []; // 当前路由标题列表
    //   this.currentRouteName = this.$route.name;
    //   this.$route.matched.map(item => {
    //     currentTitleList.push({
    //       name: item.name,
    //       title: item.meta.title
    //     });
    //   });
    //   return currentTitleList;
    // },
    contentPaddingBottom() {
      const { name: routeName, query } = this.$route;

      if (['landTradeConfig'].includes(routeName) && ['add', 'edit'].includes(query.configType)) {
        return '90px';
      }

      return '0';
    },
  },
  components: {
    Tabs,
    SideMenu,
    Flex,
    FormItem,
  },
};
</script>

<style lang="less">
@import './main.less';
#mainContent {
  .pageTitle {
    margin: 10px 0px 0px 20px;
    padding-bottom: 10px;
    border-bottom: 1px solid #dddddd;
    font-size: 16px;
  }
  .breadcrumb {
    padding: 10px 20px;
    .openPage {
      font-size: 16px;
      font-weight: 600;
      color: #2d2d2d;
    }
    .el-breadcrumb {
      font-size: 12px;
    }
    .el-breadcrumb__separator {
      margin: 0 2px;
      color: #2d2d2d;
    }
    .el-breadcrumb__inner {
      color: #2d2d2d;
      font-weight: 400;
    }
    .el-breadcrumb__item:last-child .el-breadcrumb__inner {
      color: #ef272c;
      font-weight: bold;
    }
  }
  .back {
    margin: 10px 0px 10px 20px;
  }
  .mainContent {
    height: calc(100vh - 140px);
    background: #ffffff;
    padding: 20px;
    padding-top: 0;
    box-sizing: border-box;
    position: relative;
  }

  .noteBox {
    border: 0;
    width: 100%;
  }

  .transformRotate {
  }
  .icon-tuichu {
    width: 20px;
  }
}
</style>
