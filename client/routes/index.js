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
    meta: { requiresAuth: true, role_id: 1 },
  },
  {
    path: "/property/history",
    name: "PropertyHistory",
    component: import("../src/views/property/historyPage.vue"),
    meta: { requiresAuth: true, role_id: 1 },
  },
  {
    path: "/contractor/dashboard",
    name: "contractorDashboard",
    component: import("../src/views/contractor/homePage.vue"),
    meta: { requiresAuth: true, role_id: 2 },
  },
  {
    path: "/contractor/propertyDetails/:id",
    name: "COntractorPropertyDetails",
    component: import("../src/views/contractor/PropertyDetails.vue"),
    meta: { requiresAuth: true, role_id: 2 },
  },
  {
    path: "/contractor/history",
    name: "ContarctorHistory",
    component: import("../src/views/contractor/historyPage.vue"),
    meta: { requiresAuth: true, role_id: 2 },
  },
  {
    path: "/contractor/upload-work/:p_id/:estimate_id",
    name: "ContractorUploadProof",
    component: import("../src/views/contractor/uploadWorkProof.vue"),
    meta: { requiresAuth: true, role_id: 2 },
  },
  {
    path: "/property/bid-price/:p_id",
    name: "PropertyBidPrice",
    component: import("../src/views/property/acceptrejectProperty.vue"),
    meta: { requiresAuth: true, role_id: 1 },
  },
  {
    path: "/property/propertyDetails/:id",
    name: "PropertyDetails",
    component: import("../src/views/property/viePropertyDetails.vue"),
    meta: { requiresAuth: true, role_id: 1 },
  },
  {
    path: "/property/review-work/:p_id",
    name: "PropertyReviewWork",
    component: import("../src/views/property/reviewWorkPage.vue"),
    meta: { requiresAuth: true, role_id: 1 },
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
