export default {
  data() {
    return {
      // 所有商品分类列表，默认为空
      cateList: [],
      // 通过 级联选择框，选中的所有分类的Id数组
      selectedCateList: [],
      // 指定 分类级联选择框中数据的对应关系
      cascaderProp: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 设置 Tab 栏中，默认被选中的 页签
      activeName: 'many',
      isok: true,
      // 动态参数列表
      manyTableData: [],
      // 静态参数列表
      onlyTableData: [],
      // 控制添加对话框的显示与隐藏
      addDialogVisible: false,
      // 添加参数的表单
      addForm: {
        attr_name: '' // 要添加的参数的名称
      },
      // 添加表单的校验规则
      addFormRules: {
        attr_name: [{ required: true, message: '请添加参数名称', trigger: 'blur' }]
      },
      // 控制修改对话框的显示与隐藏
      editDialogVisible: false,
      // 编辑表单数据对象
      editForm: {
        attr_name: ''
      },
      // 编辑表单的验证规则对象
      editFormRules: {
        attr_name: [{ required: true, message: '请添加参数名称', trigger: 'blur' }]
      },
      // 控制 文本输入框的显示与隐藏
      inputVisible: false,
      // 文本框中输入的值
      inputValue: ''
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    // 获取所有的商品分类数据
    async getCateList() {
      // 调用 API 接口，获取到所有的商品分类；总共为三级分类
      const { data: res } = await this.$http.get('categories', { params: { type: 3 } })
      // 获取商品分类失败
      if (res.meta.status !== 200) return this.$message.error('获取商品分类失败！')
      this.cateList = res.data
    },
    // 只要级联选择框选中的内容发生了变化，都会触发 change 事件
    handleChange() {
      if (this.selectedCateList.length !== 3) {
        // 如果选中的不是三级分类，则强制清空数组
        this.selectedCateList = []
        this.manyTableData = []
        this.onlyTableData = []
      } else {
        // 选中了三级分类
        this.getTableData()
      }
    },
    // 根据 选中的商品类型，和 商品参数的类型，获取表格数据
    async getTableData() {
      const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, {
        params: { sel: this.activeName }
      })
      // 判断请求是否失败
      if (res.meta.status !== 200) return this.$message.error('获取数据失败！')

      // 把 res.data 数组中，每一个参数项的 attr_vals 属性，使用 空格 分割成 数组
      res.data.forEach(item => {
        const arr = item.attr_vals ? item.attr_vals.split(' ') : []
        item.attr_vals = arr
      })

      // 判断 当前展示的页签是否为 动态参数
      if (this.activeName === 'many') {
        // 为动态参数表格赋值
        this.manyTableData = res.data
      } else {
        // 为静态属性表格赋值
        this.onlyTableData = res.data
      }

      console.log(res)
    },
    // 标签页被点击了
    tabClicked() {
      if (!this.cateId) return
      this.getTableData()
    },
    // 添加对话框关闭事件
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
    },
    // 添加参数
    addParams() {
      // 进行表单的预校验
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return false
        // 发起Post请求，添加新参数
        const { data: res } = await this.$http.post(`categories/${this.cateId}/attributes`, {
          attr_name: this.addForm.attr_name,
          attr_sel: this.activeName
        })

        if (res.meta.status !== 201) return this.$message.error('添加参数失败！')

        // 重新获取表格的数据
        this.getTableData()
        this.addDialogVisible = false
      })
    },
    // 展示编辑参数的对话框
    async showEditDialog(row) {
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes/${row.attr_id}`,
        {
          params: { attr_sel: this.activeName }
        }
      )
      if (res.meta.status !== 200) return this.$message.error('获取参数信息失败！')
      console.log(res)
      this.editForm = res.data
      this.editDialogVisible = true
    },
    // 编辑对话框关闭事件中，重置表单
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    // 点击按钮，保存对参数的修改
    saveEdit() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put(
          `categories/${this.cateId}/attributes/${this.editForm.attr_id}`,
          {
            // 参数项的新名称
            attr_name: this.editForm.attr_name,
            // 参数项的类型
            attr_sel: this.activeName
          }
        )

        if (res.meta.status !== 200) return this.$message.error('更新参数信息失败！')
        this.$message.success('更新参数信息成功！')
        this.editDialogVisible = false
        this.getTableData()
      })
    },
    // 根据Id，删除分类下，对应的参数项
    async remove(id) {
      // 询问用户是否要删除数据
      const confirmResult = await this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)

      // 用户取消了删除
      if (confirmResult !== 'confirm') {
        return this.$message({
          type: 'info',
          message: '已取消删除'
        })
      }

      // 执行删除的业务逻辑
      const { data: res } = await this.$http.delete(`categories/${this.cateId}/attributes/${id}`)
      if (res.meta.status !== 200) return this.$message.error('删除参数失败！')
      this.$message.success('删除参数成功！')
      this.getTableData()
    },
    // 每当文本框失去焦点，或者在文本框中摁下了 enter 键，触发这个函数
    async handleInputConfirm(row) {
      // 如果失去焦点的时候，文本中没有值，则直接隐藏输入框，并return
      if (this.inputValue.trim().length === 0) {
        this.inputValue = ''
        this.inputVisible = false
        return
      }
      // 当文本框失去焦点的时候，如果文本框中有值，则把值 push 到 attr_vals 数组中
      row.attr_vals.push(this.inputValue.trim())
      // 立即清空文本框中的值
      this.inputValue = ''
      this.inputVisible = false

      // 发起请求，把最新的 attr_vals 字符串，提交到服务器保存
      const { data: res } = await this.$http.put(
        `categories/${row.cat_id}/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          // 因为服务器保存的 attr_vals 是字符串，所以应该把 数组，重新还原成字符串之后，提交到服务器保存
          attr_vals: row.attr_vals.join(' ')
        }
      )
      if (res.meta.status !== 200) return this.$message.error('更新参数失败！')
    },
    // 点击按钮，展示 文本输入框
    showInput() {
      this.inputVisible = true
      // 当文本框展示出来以后，立即获得焦点
      // $nextTick() 方法的作用，就是当页面上的元素被重新渲染之后，才会执行 回调函数中的代码
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    // 点击关闭Tag的时候，删除对应的 Tag 数据
    async tagClosed(row, i) {
      // 根据索引，从 row.attr_vals 数组中，删除对应的 Tag 数据
      row.attr_vals.splice(i, 1)
      // 把最新的 row.attr_vals 数据，保存到服务器
      const { data: res } = await this.$http.put(
        `categories/${row.cat_id}/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          // 因为服务器保存的 attr_vals 是字符串，所以应该把 数组，重新还原成字符串之后，提交到服务器保存
          attr_vals: row.attr_vals.join(' ')
        }
      )
      if (res.meta.status !== 200) return this.$message.error('更新参数失败！')
    }
  },
  // 计算属性
  computed: {
    // 计算属性，在定义的时候，一定要被定义为一个方法
    // 但是，在页面上使用计算属性的时候，直接当作属性来用就行
    // 而且，在计算属性中，必须 return 一个 计算的结果
    isDisabled: function() {
      // 计算属性的特性：计算属性中，所以来的 数据，只要发生了变化，那么，就会立即 对计算属性重新求值
      if (this.selectedCateList.length === 3) return false
      return true
    },
    // 当前选中的三级分类的Id
    // 如果选中了三级分类，则值为数字；如果没有选中三级分类，则值为 null
    cateId: function() {
      if (this.selectedCateList.length === 3) return this.selectedCateList[2]
      return null
    }
  },
  watch: {
    selectedCateList: function() {
      if (this.selectedCateList.length === 3) return (this.isok = false)
      this.isok = true
    }
  }
}
