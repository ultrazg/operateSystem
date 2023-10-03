<template>
  <div id="login">
    <div class="flexRow logoContainer">
      <img src="./images/logo.png" class="img1" />
      <span>经营管理系统</span>
    </div>
    <div class="imagesContainer">
      <img src="./images/i1.png" class="img1" />
      <img src="./images/i2.png" class="img2" />
      <img src="./images/i3.png" class="img3" />
      <img src="./images/arrow.gif" class="gif" />
    </div>
    <div class="content">
      <div class="container">
        <div class="flexColumn cont-login">
          <p class="login-title">欢迎登录 经营管理系统</p>
          <form class="login-form">
            <div class="item">
              <span class="label">
                <span class="iconfont icon-zhanghao" />
                账号</span
              >
              <el-input class="form-input" placeholder="请输入您的账号" v-model="form.username" clearable></el-input>
            </div>
            <div class="item">
              <span class="label">
                <span class="iconfont icon-mima" />
                密码</span
              >
              <el-input
                class="form-input"
                type="password"
                placeholder="请输入您的密码"
                v-model="form.password"
                @keyup.enter.native="loginTo"
                clearable
              ></el-input>
            </div>
            <div class="message" v-if="message">{{ message }}</div>
            <el-button
              :disabled="butDisabled"
              @click="loginTo"
              :class="{ butDisabled: butDisabled }"
              :loading="butDisabled"
              class="form-but"
            >
              <span v-if="butDisabled">登录中...</span>
              <span v-else>登&nbsp;&nbsp;录</span>
            </el-button>
          </form>
        </div>
      </div>
    </div>
    <!-- loading -->
    <div class="loading-bg" v-if="butDisabled"></div>
    <div class="loading noselect pos-f loadingBg" v-if="butDisabled">
      <em class="iconfont icon-jiazailoading-A mr-5 anim-rotate anim-loop el-anim"></em>
      <span class="f-13">登录中，请稍后...</span>
    </div>
  </div>
</template>
<script>
import { mapActions, mapMutations } from 'vuex';
import Config from '@/config';
import routers from 'router/routers';
import { creatMenuByRouters } from 'util/util';
import axios from 'axios';
import { indexInfo } from '@/api/user';
export default {
  name: 'loginPage',
  data() {
    return {
      form: {
        username: 'admin',
        password: '888888',
      },
      butDisabled: false, // 登陆按钮状态
      message: '',
    };
  },
  mounted() {
    // this.$nextTick(() => {});
  },
  methods: {
    ...mapActions({
      userLoginTo: 'user/userLoginTo',
      getUserRoleRouter: 'getUserRoleRouter',
    }),
    ...mapMutations({
      setUserInfo: 'user/setUserInfo',
      setAdminUserDto: 'user/setAdminUserDto',
      setDynamicMenuList: 'setDynamicMenuList',
      setMenuList: 'setMenuList',
      setMenuDataList: 'setMenuDataList',
    }),
    // 登陆
    loginTo() {
      const { username } = this.form;

      const parames = {
        ...this.form,
      };

      if (this.form && this.form.username && this.form.password) {
        this.butDisabled = true;
        this.userLoginTo({ ...parames })
          .then((resData) => {
            this.message = undefined;
            // 获取rolecode传进去
            // const meanlist = resData.mergedPermissions;

            this.getUserRoleRouter(resData).then(() => {
              this.setUserInfo({
                username: resData.realName,
                user: resData.modifyUser,
                userId: resData.id,
                userType: resData.userType,
                province: resData.province,
              });
              indexInfo().then((res) => {
                if (res && res.code === '200') {
                  this.setAdminUserDto(res.data.adminUserDto);
                  this.setMenuDataList(res.data.userMenuList);
                  const menuList = creatMenuByRouters(routers, res.data.userMenuList);
                  // menuList.forEach(menuItem => {})

                  this.$router.addRoutes(menuList);
                  this.$router.options.routes.push(...menuList);
                  this.setMenuList(menuList);
                  this.butDisabled = false;
                  this.$router.push({ name: Config.homeName });
                }
              });
            });
          })
          .catch((err) => {
            this.butDisabled = false;
            // this.$message.error(err);
            this.message = err;
          });
      } else {
        this.message = '请填写您的登陆账号 / 密码 / 验证码';
        this.butDisabled = false;
      }
    },
    gdcaDown() {
      window.open('https://www.gdca.com.cn/customer_service/download/client/', '_blank');
    },
  },
};
</script>
<style lang="less">
#login {
  // background: url(./images/banner.jpg) no-repeat center;
  background-size: 100% 100%;
}
// 重置
.login-form {
  padding: 0 60px;
  .form-input input {
    border: 0;
    border-radius: 0;
    font-size: 14px;
    background-color: transparent;
    height: 34px !important;
  }

  .item {
    overflow: hidden;
    margin-bottom: 20px;
    color: #c4c4c4;
    text-align: left;
    > .label {
      display: block;
      text-align: left;
      font-size: 14px;
      font-weight: 400;
      color: #636363;
      line-height: 20px;
    }
    .form-input {
      width: 100%;
      margin-top: 10px;
      background: rgba(255, 255, 255, 1);
      input {
        // border: 1px solid rgba(170, 170, 170, 1);
        height: 34px;
        background: linear-gradient(270deg, rgba(255, 228, 228, 0) 0%, rgba(255, 255, 255, 0) 100%);
        border: 1px solid;
        border-image: linear-gradient(270deg, rgba(203, 201, 201, 0.52), rgba(197, 197, 197, 1)) 1 1;
        box-shadow: 0px 3px 7px 0px rgba(228, 231, 234, 1);
        &:focus {
          outline: 0;
          border-color: rgba(30, 107, 201, 1);
        }
      }
    }
    .el-input--suffix .el-input__inner:focus {
      border: 1px solid;
      border-image: linear-gradient(270deg, rgba(255, 184, 110, 0.52), #f46c6c) 1 1;
      box-shadow: 0px 2px 4px 0px #f0f0f0;
    }
    .el-input--suffix .el-input__inner {
      padding-right: 35px;
      background: #f5f5f5;
      border: none;
    }
    .el-input--prefix .el-input__inner {
      padding-left: 43px;
    }
    .el-input__prefix {
      // top: 2px;
      top: 1px;
      left: 1px;
      width: 34px;
      height: 32px;
      background: #f8f8f8;
      color: #747474;
    }
    .el-input {
    }
  }

  .butDisabled,
  .butDisabled:hover {
    background-color: #fab6b6;
  }
}
</style>

<style lang="less" scoped>
@import './login.less';
</style>
