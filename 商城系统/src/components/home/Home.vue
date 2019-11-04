<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div class="logo-box">
        <img src="../../assets/images/heima.png" alt="">
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="collapse ? '65px' : '200px'">
        <div class="toggle_bar" @click="collapse=!collapse">|||</div>
        <!-- 左侧的menu菜单 开始 -->
        <el-menu background-color="#333744" text-color="#fff" active-text-color="#409EFF" :unique-opened="true" :collapse="collapse" :collapse-transition="false" :router="true">
          <!-- 子菜单 -->
          <el-submenu :index="item.id + ''" v-for="(item, i) in menulist" :key="item.id" :style="collapse ? 'width: 65px;' : 'width: 200px;'">
            <template slot="title">
              <i :class="['iconfont', iconList[i]]"></i>
              <span>{{item.authName}}</span>
            </template>
            <!-- 子菜单的 Item 项 -->
            <!-- 如果要为 el-menu-item 开启路由模式,需要 通过 index 属性,作为路由要跳转的地址 -->
            <el-menu-item :index="'/' + subItem.path" v-for="subItem in item.children" :key="subItem.id">
              <i class="el-icon-menu"></i>
              <span>{{subItem.authName}}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
        <!-- 左侧menu菜单 结束 -->
      </el-aside>
      <!-- 主体区域 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
// 导入 mixins 中的 行为
import mix from './Home-mixins.js'
export default {
  // 通过 mixins 把外界导入过来的行为,混入到 当前组件中
  mixins: [mix]
}
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
  .el-header {
    background-color: #373d41;
    height: 60px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0;
    padding-right: 20px;
    .logo-box {
      display: flex;
      color: white;
      font-size: 22px;
      align-items: center;
      // 禁止被用户选中
      user-select: none;
      img {
        width: 50px;
        height: 50px;
        margin-right: 10px;
      }
    }
  }

  .el-aside {
    background-color: #333744;
    user-select: none;
  }

  .el-main {
    background-color: #eaedf1;
  }
}

.toggle_bar {
  color: #fff;
  font-size: 12px;
  text-align: center;
  line-height: 25px;
  background-color: #4a5064;
  user-select: none;
  cursor: pointer;
  letter-spacing: 0.1em;
}
</style>
