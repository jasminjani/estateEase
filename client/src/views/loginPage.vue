<template>
  <v-content>
    <v-container fluid fill-height>
      <!-- <v-layout align-center justify-center> -->
      <v-flex xs12 sm8 md4>
        <v-card class="elevation-12" style="width: 50%; margin: 0 auto">
          <v-toolbar dark color="primary">
            <v-toolbar-title class="text-center">Login Page</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-form id="form">
              <v-text-field
                v-model="email.value.value"
                :error-messages="email.errorMessage.value"
                prepend-icon="mdi-account"
                name="email"
                label="Email"
                type="text"
                clearable
              ></v-text-field>
              <v-text-field
                v-model="password.value.value"
                :error-messages="password.errorMessage.value"
                id="password"
                prepend-icon="mdi-lock"
                :append-inner-icon="passVisible ? 'mdi-eye-off' : 'mdi-eye'"
                :type="passVisible ? 'text' : 'password'"
                @click:append-inner="passVisible = !passVisible"
                name="password"
                label="Password"
                clearable
              ></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <!-- <v-spacer></v-spacer> -->
            <v-btn
              class="d-flex"
              style="margin: 0 auto"
              color="primary"
              @click.prevent="login"
              >Login</v-btn
            >
          </v-card-actions>
          <v-card-actions class="d-flex justify-center">
            Create new Account ?
            <router-link :to="{ name: 'registration' }"> Register</router-link>
          </v-card-actions>
        </v-card>
      </v-flex>
      <!-- </v-layout> -->
    </v-container>
  </v-content>
</template>

<script setup>
import { useField, useForm } from "vee-validate";
import { ref } from "vue";
import * as yup from "yup";
import { useRouter } from "vue-router";

const router = useRouter();

const passVisible = ref(false);

const { handleSubmit } = useForm({
  validationSchema: yup.object({
    email: yup.string().required().email().trim(),
    password: yup
      .string()
      .trim()
      .required()
      .min(8)
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/i,
        "Password should contain atleast one uppercase, lowercase, digit and special character"
      ),
    // password(value) {
    //   if (value?.length < 8) {
    //     return "password must be 8 character long";
    //   }
    //   if (
    //     /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/i.test(
    //       value
    //     )
    //   ) {
    //     return true;
    //   }

    //   return "Password should contain atleast one uppercase, lowercase, digit and special character";
    // },
    // email(value) {
    //   if (/^[a-z0-9._-]+@[a-z0-9.-]+\.[a-z]{2,4}$/i.test(value)) return true;

    //   return "Must be a valid email.";
    // },
  }),
});
const password = useField("password");
const email = useField("email");

const login = handleSubmit(async (values) => {
  let res = await fetch(`${process.env.VUE_APP_BASE_URL}/login`, {
    method: "post",
    mode: "cors",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(values, null, 2),
  });
  res = await res.json();
  console.log(res);

  if (res.success) {
    localStorage.setItem("userinfo", JSON.stringify(res.user));
    if (res.user.role_id == 1) {
      router.push({ name: "propertyHomepage" });
    }
    if (res.user.role_id == 2) {
      router.push({ name: "" });
    }
  } else {
    let p = document.createElement("p");
    document.getElementById("form").insertAdjacentElement("afterend", p);
    p.style.color = "red";
    p.style.textAlign = "center";
    p.innerHTML = `${res.message}`;
  }
});
</script>

<style scoped></style>
