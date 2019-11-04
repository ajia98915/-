<template>
  <div class="login-container">

    <!-- 登陆框 -->
    <div class="login-box">
      <!-- 头像区域 -->
      <div class="avatar-box">
        <img src="../assets/images/logo.png" alt="">
      </div>

      <!-- 登录表单 -->
      <!-- :model 绑定的是表单的数据对象 -->
      <!-- :rules 是表单的验证规则对象 -->
      <!-- ref 是当前 表单组件的引用对象 -->
      <el-form :model="loginForm" :rules="loginFormRules" ref="loginFormRef">
        <!-- el-form-item 的 prop 属性，专门用来指定校验规则； 所有的校验规则，都在 :rules 所绑定的对象中定义 -->
        <el-form-item prop="username">
          <!-- el-input 是一个文本框，使用 v-model 指令，把文本框的值，双向绑定到了 :model 对象中的属性 -->
          <el-input v-model="loginForm.username">
            <i slot="prefix" class="iconfont icon-user"></i>
          </el-input>
        </el-form-item>

        <el-form-item prop="password">
          <!-- el-input 是一个文本框，使用 v-model 指令，把文本框的值，双向绑定到了 :model 对象中的属性 -->
          <el-input v-model="loginForm.password" type="password">
            <i slot="prefix" class="iconfont icon-3702mima"></i>
          </el-input>
        </el-form-item>

        <el-row>
          <el-col :offset="15">
            <el-button type="primary" @click="login">登录</el-button>
            <el-button type="info" @click="resetForm">重置</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>

  </div>
</template>

<script>
export default {
  data() {
    return {
      // 登录表单数据对象
      loginForm: {
        username: 'admin', // 登录的用户名
        password: '123456' // 登录密码
      },
      // 登录表单的验证规则对象
      loginFormRules: {
        // 用户名的校验规则
        username: [{ required: true, message: '请输入登录名称', trigger: 'blur' }],
        password: [{ required: true, message: '请输入登录密码', trigger: 'blur' }]
      }
    }
  },
  methods: {
    // 点击重置表单项
    resetForm() {
      // console.log(this.$refs.loginFormRef)
      // 调用 resetFields 方法，重置表单
      this.$refs.loginFormRef.resetFields()
    },
    // 点击登录按钮，发起登录请求
    login() {
      // 调用 validate 进行表单的预验证
      this.$refs.loginFormRef.validate(async valid => {
        // 如果验证失败，直接return
        if (!valid) return
        // 验证通过
        const { data: res } = await this.$http.post('login', this.loginForm)
        // 提示登录失败！
        if (res.meta.status !== 200) {
          // 如果登录失败，则移除 之前的 Token，并提示
          window.sessionStorage.removeItem('token')
          return this.$message.error('登录失败！')
        }
        this.$message.success('登录成功！')
        // 把登录成功的Token，记录到 sessionStorage 中
        // 跳转到后台主页
        window.sessionStorage.setItem('token', res.data.token)
        // 使用编程式导航，跳转到后台主页
        this.$router.push('/home')
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login-container {
  background-color: #2b4b6b;
  height: 100%;
  overflow: hidden;
}

.login-box {
  width: 450px;
  height: 304px;
  background-color: #fff;
  border-radius: 4px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.avatar-box {
  width: 130px;
  height: 130px;
  border: 1px solid #eee;
  border-radius: 50%;
  padding: 8px;
  box-shadow: 0 0 10px #eee;
  position: absolute;
  background-color: #fff;
  left: 50%;
  transform: translateX(-50%) translateY(-50%);
  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: #eee;
  }
}

.el-form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
}
</style>
