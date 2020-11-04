<template>
  <a-form
    layout="inline"
    :model="formInline"
    @submit="handleSubmit"
    @submit.native.prevent
    style="margin:20px"
  >
    <a-form-item>
      <a-input v-model:value="formInline.userName" placeholder="用户名">
        <template v-slot:prefix
          ><UserOutlined style="color:rgba(0,0,0,.25)"
        /></template>
      </a-input>
    </a-form-item>
    <a-form-item>
      <a-input
        v-model:value="formInline.passWord"
        type="password"
        placeholder="密码"
      >
        <template v-slot:prefix
          ><LockOutlined style="color:rgba(0,0,0,.25)"
        /></template>
      </a-input>
    </a-form-item>
    <a-form-item>
      <a-button
        type="primary"
        html-type="submit"
        :disabled="formInline.userName === '' || formInline.password === ''"
      >
        登录
      </a-button>
    </a-form-item>
  </a-form>
</template>
<script>
import { UserOutlined, LockOutlined } from "@ant-design/icons-vue";
import { login } from "../api/login";
export default {
  components: {
    UserOutlined,
    LockOutlined
  },
  data() {
    return {
      formInline: {
        userName: "",
        passWord: ""
      }
    };
  },
  methods: {
    handleSubmit(e) {
      login(this.formInline).then(res => {
        console.log(res);
        if (res.data.msg === "登录成功") {
          window.localStorage.setItem("AD-MGT-TOKEN", res.data.data);
          this.$router.push("/newAd");
        }
      });
    }
  }
};
</script>
