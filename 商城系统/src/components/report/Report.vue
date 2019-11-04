<template>
  <div>

    <!-- 头部面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <!-- 为 ECharts 准备一个具备大小（宽高）的 DOM -->
      <div ref="main" id="main" style="width: 750px;height:400px;"></div>
    </el-card>
  </div>
</template>

<script>
import mix from './Report-mixins.js'
export default {
  mixins: [mix]
}
</script>

<style lang="less" scoped>
</style>
