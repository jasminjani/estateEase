<template>
  <v-content>
    <v-container fluid fill-height>
      <!-- <v-layout align-center justify-center> -->
      <v-flex xs12 sm8 md4>
        <v-card class="elevation-12" style="width: 50%; margin: 0 auto">
          <v-toolbar dark color="primary">
            <v-toolbar-title class="text-center">Register Page</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-form :rules="validationSchema" ref="formRef" id="form">
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
          </v-card-text>
          <v-card-actions>
            <!-- <v-spacer></v-spacer> -->
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
import { ref } from "vue";
import { useRouter } from "vue-router";
const router = useRouter();

// import * as yup from "yup";

// import { useForm } from "vee-validate";
const passVisible = ref(false);
const confirmPassVisible = ref(false);

const formRef = ref(null);
const validationSchema = {
  select: [
    (value) => {
      if (value) return true;

      return "Select an item.";
    },
  ],
  fname: [
    (value) => {
      if (value?.length >= 1) return true;

      return "Fill first name";
    },
  ],
  lname: [
    (value) => {
      if (value?.length >= 1) return true;

      return "Fill last name";
    },
  ],
  email: [
    (value) => {
      if (/^[a-z0-9._-]+@[a-z0-9.-]+\.[a-z]{2,4}$/i.test(value)) return true;

      return "Must be a valid email.";
    },
  ],
  phone_no: [
    (value) => {
      if (value?.length > 9 && /[0-9-]+/.test(value) && value?.length < 11)
        return true;

      return "Phone number needs to be 10 digits integer.";
    },
  ],
  dob: [
    (value) => {
      console.log("date value", new Date(value) < new Date());
      if (new Date(value) < new Date()) return true;

      return "dob should be less than current date";
    },
  ],
  city: [
    (value) => {
      if (value?.length >= 1) return true;

      return "Fill city name";
    },
  ],
  password: [
    (value) => {
      if (value?.length < 8) {
        return "password must be 8 character long";
      }
      if (
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/i.test(
          value
        )
      ) {
        return true;
      }

      return "Password should caontain atleast one uppercase, lowercase, digit and special character";
    },
  ],
  confirmPassword: [
    (value) => {
      if (value?.length < 8) {
        return "password must be 8 character long";
      }
      if (
        !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/i.test(
          value
        )
      ) {
        return "confirm Password should caontain atleast one uppercase, lowercase, digit and special character";
      }

      if (!(value === formData.value.password)) {
        return "password and confirm password does not matched";
      }
      return true;
    },
  ],
};

// const select = useField("select");
// const fname = useField("fname");
// const lname = useField("lname");
// const email = useField("email");
// const phone_no = useField("phone_no");
// const dob = useField("dob");
// const city = useField("city");
// const password = useField("password");
// const confirmPassword = useField("confirmPassword");

const formData = ref({
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
    console.log("formRef.value :>> ", await formRef.value.validate());
    // const formVerify = formRef.value;

    const result = await formRef.value.validate();
    console.log("res ", result.valid);

    if (result.valid == true) {
      let formSubmitedData = {
        role_id: formData.value.select,
        fname: formData.value.fname,
        lname: formData.value.lname,
        email: formData.value.email,
        phone_no: formData.value.phone_no,
        dob: formData.value.dob,
        city: formData.value.city,
        password: formData.value.password,
      };
      console.log(formSubmitedData);

      let res = await fetch(`${process.env.VUE_APP_BASE_URL}/add-user`, {
        method: "post",
        mode: "cors",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formSubmitedData),
      });
      res = await res.json();
      console.log(res);

      if (res.success) {
        console.log(router);
        router.push({ name: "login" });
      } else {
        let p = document.createElement("p");
        document.getElementById("form").insertAdjacentElement("afterend", p);
        p.style.color = "red";
        p.style.textAlign = "center";
        p.innerHTML = `${res.message}`;
      }
    } else {
      console.log("object");
    }
  } catch (error) {
    console.error(error);
  }
};
</script>

<style scoped></style>
