<template>
  <v-main>
    <v-container fluid fill-height>
      <v-layout align-center justify-center>
        <v-flex xs12 sm8 md4>
          <v-card class="elevation-12">
            <v-toolbar dark color="primary">
              <v-toolbar-title>Login form</v-toolbar-title>
            </v-toolbar>
            <v-card-text>
              <v-form ref="form" lazy-validation>
                <v-text-field
                  prepend-icon="mdi-account"
                  label="Login"
                  type="text"
                  v-model="username"
                  :rules="rules.required"
                ></v-text-field>
                <v-text-field
                  id="password"
                  :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                  prepend-icon="mdi-lock"
                  label="Password"
                  :type="showPassword ? 'text' : 'password'"
                  v-model="password"
                  :rules="rules.required"
                  @click:append="showPassword = !showPassword"
                ></v-text-field>
              </v-form>
            </v-card-text>
            <v-card-actions class="pb-10">
              <v-spacer></v-spacer>
              <v-btn
                color="primary"
                class="px-5"
                @click="login"
                :disabled="loading"
              >
                <v-progress-circular
                  v-if="loading"
                  indeterminate
                  class="mr-2"
                ></v-progress-circular>
                <span v-if="!loading">Login</span>
                <span v-if="loading">Logging in</span>
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </v-main>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      loading: false,
      showPassword: false,
      username: "",
      password: "",
      rules: {
        required: [(value) => !!value || "Required."],
      },
    };
  },

  props: {
    source: String,
  },
  methods: {
    login() {
      if (!this.$refs.form.validate()) {
        return false;
      }
      this.loading = true;
      let username = this.username;
      let password = this.password;
      const data = {
        username: username,
        password: password,
      };

      this.$store
        .dispatch("login", data)
        .then(() => {
          //if (
           // this.$store.getters.userRole === "ADMIN" ||
           // this.$store.getters.userRole === "RESBAKUNA"
          //) {
          //  this.$router.push("/admin");
          //} else if (this.$store.getters.userRole === "VALIDATOR") {
          //  this.$router.push("/validator");
          //} else {
            this.$router.push("/Activated");
          //}
          this.loading = false;
        })
        .catch((err) => {
          this.loading = false;
          alert(err);
          console.log(err);
        });
    },
  },

  created() {
    // console.log(this.$store.getters.isLoggedIn)
    if (this.$store.getters.isLoggedIn) {
      return this.$router.push({ path: `/${this.userRole.toLowerCase()}` });
    }
  },

  computed: {
    userRole() {
      return this.$store.getters.userRole;
    },
  },
};
</script>

<style></style>
