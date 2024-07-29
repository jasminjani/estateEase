<template>
  <v-content>
    <v-container fluid fill-height>
      <v-flex xs12 sm8 md4>
        <v-card class="elevation-12" style="width: 50%; margin: 0 auto">
          <v-toolbar dark color="primary">
            <v-toolbar-title class="text-center">Login Page</v-toolbar-title>
          </v-toolbar>
          <v-form id="form">
            <v-card-text>
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
            </v-card-text>
            <v-card-actions>
              <v-btn
                class="d-flex"
                style="margin: 0 auto"
                color="primary"
                @click.prevent="login"
                >Login</v-btn
              >
            </v-card-actions>
          </v-form>
          <v-card-actions class="d-flex justify-center">
            Create new Account ?
            <router-link :to="{ name: 'registration' }"> Register</router-link>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-container>
  </v-content>
</template>

<script setup>
import { useField, useForm } from "vee-validate";
import { computed, ref } from "vue";
import * as yup from "yup";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

const router = useRouter();
const store = useStore();

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
  }),
});
const password = useField("password");
const email = useField("email");

const login = handleSubmit(async (values) => {
  try {
    await store.dispatch("userLogin", values);

    const roleId = computed(() => store.getters.getRoleId);
    // const roleId = store.getters.getRoleId;

    if (roleId.value) {
      if (roleId.value == 1) {
        router.push({ name: "PropertyDashboard" });
      }
      if (roleId.value == 2) {
        router.push({ name: "contractorDashboard" });
      }
    }
  } catch (error) {
    console.error(error);
  }
});
</script>

<style scoped></style>
