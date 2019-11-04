export default {
  data() {
    // 自定义校验邮箱的规则
    const ckeckEmail = (rule, value, callback) => {
      // 如果没有填写邮箱，直接报错
      if (!value.trim()) return callback(new Error('请添加邮箱地址'))
      // 校验邮箱格式是否OK
      if (/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/.test(value)) {
        callback()
      } else {
        callback(new Error('邮箱格式不正确'))
      }
    }
    return {
      // 用户列表数据，默认为空
      userList: [],
      // 查询参数对象
      queryInfo: {
        // 搜索条件
        query: '',
        // 当前展示的是第几页数据
        pagenum: 1,
        // 每页显示多少条数据
        pagesize: 2
      },
      // 总记录条数
      total: 0,
      // 控制 添加用户对话框的显示与隐藏
      addDialogVisible: false,
      // 添加用户的表单数据
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 添加表单的验证规则对象
      addFormRules: {
        username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        email: [
          { validator: ckeckEmail, trigger: 'blur' },
          { required: true, message: '请输入邮箱', trigger: 'blur' }
        ],
        mobile: [{ required: true, message: '请输入手机号码', trigger: 'blur' }]
      },
      // 控制 编辑对话框是否展示
      editDialogVisible: false,
      // 编辑表单的数据对象
      editForm: {
        username: '',
        email: '',
        mobile: ''
      },
      // 编辑表单的验证规则对象
      editFormRules: {
        email: [
          { validator: ckeckEmail, trigger: 'blur' },
          { required: true, message: '请输入邮箱', trigger: 'blur' }
        ],
        mobile: [{ required: true, message: '请输入手机号码', trigger: 'blur' }]
      },
      // 控制 分配角色对话框的显示和隐藏
      setRoleDialogVisible: false,
      // 要编辑的信息
      editInfo: {},
      // 所有角色列表
      rolesList: [],
      // 被选中的角色Id
      selectedRoleId: ''
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    // 获取用户列表
    async getUserList() {
      const { data: res } = await this.$http.get('users', { params: this.queryInfo })
      if (res.meta.status !== 200) return this.$message.error('获取用户列表失败！')
      // 把用户数据，保存到 userList 中
      this.userList = res.data.users
      // 把总记录条数，保存到data中
      this.total = res.data.total
    },
    // 每当 pageSize 改变，都会触发这个函数
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getUserList()
    },
    // 每当 页码值 改变，都会触发这个函数
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      console.log(newPage)
      this.getUserList()
    },
    // 每当触发 开关的 change，都会调用此方法
    async stateChanged(id, state, user) {
      const { data: res } = await this.$http.put(`users/${id}/state/${state}`)
      if (res.meta.status !== 200) {
        user.mg_state = !user.mg_state
        return this.$message.error('修改用户状态失败！')
      }
    },
    // 只要触发了 添加对话框的关闭，必然会触发此函数
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
    },
    // 点击按钮，添加新用户
    addUser() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('users', this.addForm)
        if (res.meta.status !== 201) return this.$message.error('添加用户失败！')
        this.$message.success('添加用户成功！')
        // 关闭对话框
        this.addDialogVisible = false
        // 刷新用户列表
        this.getUserList()
      })
    },
    // 根据Id删除用户
    async remove(id) {
      // 弹框提示用户，是否要删除数据
      const confirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
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

      // 用户想要删除数据
      const { data: res } = await this.$http.delete('users/' + id)
      if (res.meta.status !== 200) return this.$message.error('删除用户失败！')
      this.$message.success('删除用户成功！')
      // 此时，只是把当前页面上，唯一的一条数据，从数据库中删除了，但是，userList 的长度还为 1
      if (this.userList.length === 1 && this.queryInfo.pagenum > 1) {
        this.queryInfo.pagenum--
      }
      this.getUserList()
    },
    // 点击按钮，展示编辑对话框
    async showEditDialog(id) {
      const { data: res } = await this.$http.get('users/' + id)
      if (res.meta.status !== 200) return this.$message.error('查询用户信息失败！')
      // 把查询到的数据对象，直接赋值给 editForm
      this.editForm = res.data
      this.editDialogVisible = true
    },
    // 编辑对话框关闭，触发这个函数
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    // 点击按钮，保存对用户信息的修改
    saveUserInfo() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put('users/' + this.editForm.id, {
          mobile: this.editForm.mobile,
          email: this.editForm.email
        })

        if (res.meta.status !== 200) return this.$message.error('编辑用户失败！')
        this.$message.success('编辑用户成功！')
        this.getUserList()
        this.editDialogVisible = false
      })
    },
    // 点击按钮，展示分配角色的对话框
    async showSetRoleDialog(userInfo) {
      // 把要编辑的用户信息，保存到 data 中的 editInfo 上
      this.editInfo = userInfo
      // 查询所有角色的列表
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) return this.$message.error('获取角色列表失败！')
      // 把角色列表，保存到 页面的 rolesList 中
      this.rolesList = res.data
      this.setRoleDialogVisible = true
    },
    // 点击按钮，分配角色
    async saveRoleInfo() {
      if (!this.selectedRoleId) return this.$message.warning('请选择要分配的新角色！')
      const { data: res } = await this.$http.put('users/' + this.editInfo.id + '/role', {
        rid: this.selectedRoleId
      })
      if (res.meta.status !== 200) return this.$message.error('分配角色失败！')
      this.$message.success('分配角色成功！')
      this.getUserList()
      this.setRoleDialogVisible = false
    }
  }
}
