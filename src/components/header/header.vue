<template>
    <el-col :span="24" class="topbar-wrap">
      <div class="topbar-logo topbar-btn">
        <!--<a href="/"><img src="../../assets/logo.png" style="width:42px;margin-top: 5px;"></a>-->
      </div>
      <div class="topbar-title topbar-btn">
        <span>丫头的世界</span>
      </div>
      <div class="topbar-account topbar-btn">
        <el-dropdown trigger="click">
          <span class="el-dropdown-link userinfo-inner"><i class="iconfont icon-user"></i> {{sysUserName}}  <i class="iconfont icon-down"></i></span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item><router-link to="/user/profile">个人信息</router-link></el-dropdown-item>
            <el-dropdown-item><router-link :to="'/user/changepwd'">修改密码</router-link></el-dropdown-item>
            <el-dropdown-item divided @click.native="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </el-col>
</template>

<script>
import { bus } from '../../bus.js'
  export default {
    created(){
      bus.$on('setUserName', (text) => {
        this.sysUserName = text;
      })
    },
    data () {
      return {
        sysUserName: '',
        sysUserAvatar: '',
      }
    },
    
  }
</script>
<style>
  .el-menu-item, .el-submenu__title {
    color: #fff;
  }
  .el-submenu__title:hover {
    background-color: #00C1DE;
  }
  .el-submenu .el-menu-item {
    background-color: #333744
  }
  .el-submenu .el-menu-item:hover {
    background-color: #4A5064
  }
  .el-submenu .el-menu-item.is-active, .el-menu-item.is-active,
  .el-submenu .el-menu-item.is-active:hover, .el-menu-item.is-active:hover {
    background-color: #00C1DE;
    color: #fff;
  }
  .el-menu .iconfont{
    vertical-align: baseline;
    margin-right: 6px;
  }

  .warp-breadcrum{
    padding: 10px 0px;
    border-bottom: 1px solid #efefef;
  }
  .warp-main{
    padding-top: 20px;
  }
</style>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  .container {
    position: absolute;
    top: 0px;
    bottom: 0px;
    width: 100%;

    .topbar-wrap {
      height: 50px;
      line-height: 50px;
      background: #373d41;
      padding: 0px;

      .topbar-btn {
        color: #fff;
      }
      .topbar-btn:hover {
        background-color: #4A5064;
      }
      .topbar-logo {
        float: left;
        text-align: center;
        width: 49px;
        border-right: 1px solid #000;
        line-height: 26px;
      }
      .topbar-title {
        float: left;
        text-align: center;
        width: 129px;
        border-right: 1px solid #000;
      }
      .topbar-account {
        float: right;
        padding-right: 12px;
      }
      .userinfo-inner{
        cursor: pointer;
        color: #fff;
        padding-left: 10px;
      }
    }
    .main {
      display: flex;
      position: absolute;
      top: 50px;
      bottom: 0px;
      overflow: hidden;
    }
    aside {
      flex: 0 0 180px;
      width: 180px;
      .el-menu {
        height: 100%;
        border-radius: 0px;
        background-color: #333744;
      }
      .collapsed {
        width: 50px;
        .submenu {
          position: absolute;
          top: 0px;
          left: 50px;
          z-index: 9999;
          height: auto;
          display: none;
        }
      }
    }
    .menu-collapsed {
      flex: 0 0 50px;
      width: 50px;
    }
    .menu-expanded {
      flex: 0 0 180px;
      width: 180px;
    }
    .menu-toggle {
      background: #4A5064;
      text-align: center;
      color: white;
      height: 26px;
      line-height: 30px;
    }
    .content-container {
      background: #fff;
      flex: 1;
      overflow-y: auto;
      padding: 10px;

      .content-wrapper {
        background-color: #fff;
        box-sizing: border-box;
      }
    }
  }
</style>
