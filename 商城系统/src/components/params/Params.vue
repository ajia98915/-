<template>
  <div>
    <!-- 头部面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <!-- 头部的警告区域 -->
      <el-alert title="注意：只允许为第三级分类设置相关参数！" type="warning" show-icon :closable="false">
      </el-alert>

      <!-- 商品分类选择区域 -->
      <el-row>
        <el-col :span="24">
          <span>选择商品分类：</span>
          <!-- 选择商品的 级联选择框 -->
          <el-cascader expand-trigger="hover" :options="cateList" :props="cascaderProp" v-model="selectedCateList" @change="handleChange">
          </el-cascader>
        </el-col>
      </el-row>

      <!-- Tab 栏区域 -->
      <el-tabs v-model="activeName" @tab-click="tabClicked">
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary" size="mini" :disabled="isDisabled" @click="addDialogVisible = true">添加参数</el-button>
          <el-table :data="manyTableData" border stripe>
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!-- Start：实现动态编辑标签 -->
                <el-tag :key="i" v-for="(tag, i) in scope.row.attr_vals" closable :disable-transitions="false" @close="tagClosed(scope.row, i)">
                  {{tag}}
                </el-tag>
                <!-- 文本输入框 -->
                <el-input class="input-new-tag" v-if="inputVisible" v-model="inputValue" ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm(scope.row)" @blur="handleInputConfirm(scope.row)">
                </el-input>
                <!-- 按钮 -->
                <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
                <!-- Ended：实现动态编辑标签 -->
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row)">修改</el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini" @click="remove(scope.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button type="primary" size="mini" :disabled="isDisabled" @click="addDialogVisible = true">添加属性</el-button>
          <el-table :data="onlyTableData" border stripe>
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!-- Start：实现动态编辑标签 -->
                <el-tag :key="i" v-for="(tag, i) in scope.row.attr_vals" closable :disable-transitions="false" @close="tagClosed(scope.row, i)">
                  {{tag}}
                </el-tag>
                <!-- 文本输入框 -->
                <el-input class="input-new-tag" v-if="inputVisible" v-model="inputValue" ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm(scope.row)" @blur="handleInputConfirm(scope.row)">
                </el-input>
                <!-- 按钮 -->
                <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
                <!-- Ended：实现动态编辑标签 -->
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="属性名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row)">修改</el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini" @click="remove(scope.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 添加动态参数 和 静态属性的对话框 -->
    <el-dialog :title="activeName === 'many' ? '添加动态参数' : '添加静态属性'" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
      <!-- 添加的表单 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="80px">
        <el-form-item :label="activeName === 'many' ? '动态参数' : '静态属性'" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改动态参数 和 静态属性的对话框 -->
    <el-dialog :title="activeName === 'many' ? '修改动态参数' : '修改静态属性'" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
      <!-- 修改参数的表单 -->
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="80px">
        <el-form-item :label="activeName === 'many' ? '动态参数' : '静态属性'" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveEdit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import mix from './Params-mixins.js'
export default {
  mixins: [mix]
}
</script>

<style lang="less" scoped>
.el-alert {
  margin-bottom: 15px;
}

.el-tag {
  margin: 10px 5px;
}

.el-tabs {
  margin-top: 15px;
}

.input-new-tag {
  width: 150px;
}
</style>
