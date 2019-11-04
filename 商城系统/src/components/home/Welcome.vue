<template>
  <div>
    <h3>Welcome</h3>
    <div>{{namelist}}</div>
    <el-checkbox-group v-model="namelist">
      <el-checkbox border :label="item" v-for="(item, i) in namelist" :key="i"></el-checkbox>
    </el-checkbox-group>
  </div>
</template>

<script>
export default {
  data() {
    return {
      namelist: ['zs', 'ls', 'ceshi', 'aaaa']
    }
  }
}
</script>
