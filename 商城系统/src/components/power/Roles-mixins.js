export default {
  data() {
    return {
      // 所有角色列表
      rolesList: [],
      // 控制 添加角色对话框的显示与隐藏
      addDialogVisible: false,
      // 添加表单的数据对象
      addForm: {
        roleName: '', // 角色名称
        roleDesc: '' // 角色描述
      },
      // 添加表单的验证规则对象
      addFormRules: {
        roleName: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
        roleDesc: [{ required: true, message: '请输入角色描述', trigger: 'blur' }]
      },
      // 控制 编辑对话框的显示与隐藏
      editDialogVisible: false,
      // 编辑角色的数据对象
      editForm: {
        roleName: '',
        roleDesc: ''
      },
      // 编辑表单的验证规则对象
      editFormRules: {
        roleName: [{ required: true, message: '请填写角色名称', trigger: 'blur' }],
        roleDesc: [{ required: true, message: '请填写角色描述', trigger: 'blur' }]
      },
      // 控制 分配权限对话框的显示与隐藏
      setRightDialogVisible: false,
      // 权限树形结构对应的数据
      rightTree: [],
      // 树形结构中，每个节点和数据之间的对应关系
      treeProp: {
        // 指定要展示的节点内容
        label: 'authName',
        // 指定嵌套关系
        children: 'children'
      },
      // 默认情况下，角色已经拥有的三级权限Id数组
      defaultCheckedKeys: [],
      // 即将要分配权限的角色id
      roleId: ''
    }
  },
  created() {
    this.getRolesList()
  },
  methods: {
    // 获取所有角色列表
    async getRolesList() {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) return this.$message.error('获取角色列表失败！')
      this.rolesList = res.data
      // console.log(res)
    },
    // 添加角色对话框关闭，触发这个函数
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
    },
    // 添加新角色
    addRoles() {
      // 验证表单
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('roles', this.addForm)
        if (res.meta.status !== 201) return this.$message.error('添加角色失败！')
        this.$message.success('添加角色成功！')
        this.getRolesList()
        this.addDialogVisible = false
      })
    },
    // 点击按钮，展示编辑角色的对话框
    async showEditDialog(id) {
      const { data: res } = await this.$http.get('roles/' + id)
      if (res.meta.status !== 200) return this.$message.error('查询角色信息失败！')
      this.editForm = res.data
      this.editDialogVisible = true
    },
    // 编辑对话框的关闭事件
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    // 点击按钮，保存角色信息
    saveRolesInfo() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put('roles/' + this.editForm.roleId, this.editForm)
        if (res.meta.status !== 200) return this.$message.error('编辑角色信息失败！')
        this.$message.success('编辑角色信息成功！')
        this.getRolesList()
        this.editDialogVisible = false
      })
    },
    async removeRoles(id) {
      // 提示用户是否要删除
      const confirmResult = await this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)

      // 取消了删除
      if (confirmResult !== 'confirm') {
        return this.$message({
          type: 'info',
          message: '已取消删除'
        })
      }

      // 走删除的业务逻辑
      const { data: res } = await this.$http.delete('roles/' + id)
      if (res.meta.status !== 200) return this.$message.error('删除角色失败！')
      this.$message.success('删除角色成功！')
      this.getRolesList()
    },
    // 根据 权限Id，删除指定角色下指定的权限
    async removeRight(role, rightId) {
      // 询问用户是否要删除权限
      const confirmResult = await this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)

      // 用户不想删除
      if (confirmResult !== 'confirm') {
        return this.$message({
          type: 'info',
          message: '已取消删除'
        })
      }

      // 删除权限
      const { data: res } = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
      if (res.meta.status !== 200) return this.$message.error('删除权限失败！')
      // console.log(res)
      // 把服务器返回的最新的权限数组，赋值给 当前角色的 children 属性
      role.children = res.data
      // this.getRolesList()
    },
    // 点击按钮，展示分配权限的对话框
    async showSetRightDialog(role) {
      // 预先，把角色Id存储到data上的 roleId 属性中
      this.roleId = role.id
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) return this.$message.error('获取所有权限失败！')
      this.rightTree = res.data
      // 调用递归，获取指定角色下，所有三级权限的Id
      const keys = []
      this.getLeafId(role, keys)
      this.defaultCheckedKeys = keys
      this.setRightDialogVisible = true
    },
    // 递归获取角色下所有三级权限Id
    getLeafId(node, keyArr) {
      if (!node.children) {
        return keyArr.push(node.id)
      }
      node.children.forEach(item => this.getLeafId(item, keyArr))
    },
    // 点击按钮，分配权限
    async saveRights() {
      // 获取全选的key数组
      const k1 = this.$refs.tree.getCheckedKeys()
      // 获取半选的key数组
      const k2 = this.$refs.tree.getHalfCheckedKeys()
      // 拼接出所有被勾选的权限的Id
      const idstr = [...k1, ...k2].join(',')

      const { data: res } = await this.$http.post(`roles/${this.roleId}/rights`, { rids: idstr })
      if (res.meta.status !== 200) return this.$message.error('分配权限失败！')
      this.$message.success('分配权限成功！')
      // 重新获取 table 数据
      this.getRolesList()
      this.setRightDialogVisible = false
    }
  }
}
