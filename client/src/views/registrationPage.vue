<template>
  <v-content>
    <v-container fluid fill-height>
      <v-flex xs12 sm8 md4>
        <v-card class="elevation-12" style="width: 50%; margin: 0 auto">
          <v-toolbar dark color="primary">
            <v-toolbar-title class="text-center">Register Page</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-form
              :rules="validationSchema"
              ref="registrationFormRef"
              id="form"
            >
              <v-select
                v-model="formData.select"
                :items="items"
                item-value="id"
                item-title="label"
                label="I want to Register as"
                :rules="validationSchema.select"
                prepend-icon="mdi-account-tie"
              ></v-select>
              <v-text-field
                v-model="formData.fname"
                prepend-icon="mdi-account"
                name="fname"
                label="First name"
                type="text"
                :rules="validationSchema.fname"
                clearable
              ></v-text-field>
              <v-text-field
                :rules="validationSchema.lname"
                v-model="formData.lname"
                prepend-icon="mdi-account"
                name="lname"
                label="Last name"
                type="text"
                clearable
              ></v-text-field>
              <v-text-field
                v-model="formData.email"
                :rules="validationSchema.email"
                prepend-icon="mdi-email"
                name="email"
                label="Email"
                type="text"
                clearable
              ></v-text-field>
              <v-text-field
                v-model="formData.phone_no"
                :rules="validationSchema.phone_no"
                prepend-icon="mdi-phone"
                name="phone_no"
                label="Contact no"
                type="text"
                clearable
              ></v-text-field>
              <v-text-field
                v-model="formData.dob"
                :rules="validationSchema.dob"
                prepend-icon="mdi-calendar"
                name="dob"
                label="Date of Birth"
                type="date"
                clearable
              ></v-text-field>
              <v-text-field
                v-model="formData.city"
                :rules="validationSchema.city"
                prepend-icon="mdi-city"
                name="city"
                label="City"
                type="text"
                clearable
              ></v-text-field>
              <v-text-field
                v-model="formData.password"
                :rules="validationSchema.password"
                :append-inner-icon="passVisible ? 'mdi-eye-off' : 'mdi-eye'"
                :type="passVisible ? 'text' : 'password'"
                @click:append-inner="passVisible = !passVisible"
                id="password"
                prepend-icon="mdi-lock"
                name="password"
                label="Password"
                clearable
              ></v-text-field>
              <v-text-field
                v-model="formData.confirmPassword"
                :rules="validationSchema.confirmPassword"
                id="confirmPassword"
                prepend-icon="mdi-lock-check"
                :append-inner-icon="
                  confirmPassVisible ? 'mdi-eye-off' : 'mdi-eye'
                "
                :type="confirmPassVisible ? 'text' : 'password'"
                @click:append-inner="confirmPassVisible = !confirmPassVisible"
                name="confirmPassword"
                label="Confirm Password"
                clearable
              ></v-text-field>
            </v-form>
            <p v-if="errorMsg" class="text-center" style="color: red">
              {{ errorMsg }}
            </p>
          </v-card-text>
          <v-card-actions>
            <v-btn
              class="d-flex"
              style="margin: 0 auto"
              color="primary"
              @click.prevent="register"
              >Register</v-btn
            >
          </v-card-actions>
          <v-card-actions class="d-flex justify-center">
            Already have an Account?
            <router-link :to="{ name: 'login' }">Login</router-link>
          </v-card-actions>
        </v-card>
      </v-flex>
      <!-- </v-layout> -->
    </v-container>
  </v-content>
</template>

<script setup>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const passVisible = ref(false);
const confirmPassVisible = ref(false);
const registrationFormRef = ref(null);
const errorMsg = ref(null);

const validationSchema = {
  select: [
    (value) => {
      return value ? true : "Select an item";
    },
  ],
  fname: [
    (value) => {
      return notNullValidation(value);
    },
  ],
  lname: [
    (value) => {
      return notNullValidation(value);
    },
  ],
  email: [
    (value) => {
      return /^[a-z0-9._-]+@[a-z0-9.-]+\.[a-z]{2,4}$/i.test(value)
        ? true
        : "Required valid email format";
    },
  ],
  phone_no: [
    (value) => {
      return value?.trim()?.length == 10 && /[0-9-]+/.test(value)
        ? true
        : "Phone number should be 10 digits integer";
    },
  ],
  dob: [
    (value) => {
      return new Date(value) < new Date()
        ? true
        : "dob should be less than current date";
    },
  ],
  city: [
    (value) => {
      return notNullValidation(value);
    },
  ],
  password: [
    (value) => {
      return value?.length < 8
        ? "password must be 8 character long"
        : /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/i.test(
            value
          )
        ? true
        : "Password should contain atleast one uppercase, lowercase, digit and special character";
    },
  ],
  confirmPassword: [
    (value) => {
      return value?.length < 8
        ? "password must be 8 character long"
        : !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/i.test(
            value
          )
        ? "confirm Password should contain atleast one uppercase, lowercase, digit and special character"
        : value === formData.password
        ? true
        : "password and confirm password does not matched";
    },
  ],
};

function notNullValidation(value) {
  return value?.trim()?.length > 0 ? true : "required";
}

const formData = reactive({
  select: "",
  fname: "",
  lname: "",
  email: "",
  phone_no: "",
  dob: "",
  city: "",
  password: "",
  confirmPassword: "",
});

const items = ref([
  { id: 1, label: "Property owner" },
  { id: 2, label: "Contrator" },
]);

const register = async () => {
  try {
    const result = await registrationFormRef.value.validate();
    errorMsg.value = null;
    if (result.valid) {
      let formSubmitedData = {
        role_id: formData.select,
        fname: formData.fname,
        lname: formData.lname,
        email: formData.email,
        phone_no: formData.phone_no,
        dob: formData.dob,
        city: formData.city,
        password: formData.password,
      };

      let res = await fetch(`${process.env.VUE_APP_BASE_URL}/add-user`, {
        method: "post",
        mode: "cors",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formSubmitedData),
      });
      res = await res.json();
      console.log("res ", res);

      if (res.success) {
        router.push({ name: "login" });
      } else {
        errorMsg.value = res.message;
      }
    } else {
      console.error("validation failed");
    }
  } catch (error) {
    console.error(error);
    errorMsg.value = "Can not able to Register, please try again";
  }
};
</script>

<style scoped></style>
