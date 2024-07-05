<template>
  <!-- <div> -->
  <v-text-field
    prepend-icon="mdi-fire-hydrant"
    name="jobname"
    label="Job name"
    type="text"
    clearable
  ></v-text-field>

  <v-file-input
    name="jobimage"
    label="Upload image"
    accept="image/*"
    chips
    multiple
    clearable
    counter
    show-size
  ></v-file-input>

  <!-- </div> -->

  <v-text-field
    v-model="jobname.value.value"
    :error-messages="jobname.errorMessage.value"
    prepend-icon="mdi-text"
    name="jobname"
    label="Job name"
    type="text"
    clearable
  ></v-text-field>
  <v-textarea
    v-model="job_description.value.value"
    :error-messages="job_description.errorMessage.value"
    prepend-icon="mdi-comment"
    name="job_description"
    label="Job description"
    type="textarea"
    clearable
    counter
  ></v-textarea>

  <v-file-input
    v-model="myFileObject"
    name="jobimage"
    label="Upload image"
    accept="image/*"
    chips
    multiple
    clearable
    counter
    show-size
  ></v-file-input>
</template>
