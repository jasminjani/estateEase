import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/registration",
    component: import("../src/views/registrationPage.vue"),
    name: "registration",
    meta: { requiresAuth: false },
  },
  {
    path: "/login",
    component: import("../src/views/loginPage.vue"),
    name: "login",
    meta: { requiresAuth: false },
  },
  {
    path: "/property/dashboard",
    name: "propertyHomepage",
    component: import("../src/views/property/HomePage.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/property/history",
    name: "PropertyHistory",
    component: import("../src/views/property/historyPage.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/contractor/dashboard",
    name: "contractorDashboard",
    component: import("../src/views/contractor/homePage.vue"),
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// router.beforeEach((to, from) => {
//   console.log(from);
//   console.log(document);
//   if (to.meta.requiresAuth && !localStorage.getItem("userinfo")) {
//     console.log(to.meta.requiresAuth);
//     return { name: "login" };
//   }
// });

export default router;
