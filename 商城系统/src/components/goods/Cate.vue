<template>
  <div>
    <!-- 头部面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
      <!-- 树形表格 -->
      <tree-table style="margin-top: 15px;" :data="cateList" :columns="columns" border :selection-type="false" :expand-type="false" show-index index-text="#">
        <!-- 定义一个模板 -->
        <template slot="isok" slot-scope="scope">
          <i class="el-icon-circle-check" style="color: #20B2AA;" v-if="scope.row.cat_deleted === false"></i>
          <i class="el-icon-circle-close" style="color: red;" v-else></i>
        </template>
        <!-- 自定义 order 模板列 -->
        <template slot="order" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag type="success" size="mini" v-else-if="scope.row.cat_level === 1">二级</el-tag>
          <el-tag type="warning" size="mini" v-else>三级</el-tag>
        </template>
        <!-- 自定义 opt 模板列 -->
        <template slot="opt" slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.cat_id)">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="remove(scope.row.cat_id)">删除</el-button>
        </template>
      </tree-table>

      <!-- 分页区域 -->
      <el-pagination @current-change="handleCurrentChange" :current-page="queryInfo.pagenum" :page-size="queryInfo.pagesize" layout="total, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </el-card>

    <!-- 添加分类的对话框 -->
    <el-dialog title="添加分类" :visible.sync="addCateDialogVisible" width="50%" @close="addDialogClosed">
      <!-- 添加分类的表单 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
        <el-form-item label="分类名称：" prop="cat_name">
          <el-input v-model="addForm.cat_name"></el-input>
        </el-form-item>
        <!-- 注意：父级分类，不需要设置为 必填项 -->
        <el-form-item label="父级分类：">
          <el-cascader expand-trigger="hover" :options="parentCateList" :props="cascaderProp" v-model="selectedCateList" @change="cascaderChanged" change-on-select clearable style="width: 100%;">
          </el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑分类信息 -->
    <el-dialog title="修改分类" :visible.sync="editCateDialogVisible" width="50%" @close="editDialogClosed">
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
        <el-form-item label="分类名称：" prop="cat_name">
          <el-input v-model="editForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveCateInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import mix from './Cate-mixins.js'
export default {
  mixins: [mix]
}
</script>

<style lang="less" scoped>
</style>
