import { store } from "@/store";
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
    name: "PropertyDashboard",
    component: import("../src/views/property/HomePage.vue"),
    meta: { requiresAuth: true, role_id: 1 },
  },
  {
    path: "/property/add-property",
    name: "PropertyAddProperty",
    component: import("../src/views/property/addPropertyPage.vue"),
    meta: { requiresAuth: true, role_id: 1 },
  },
  {
    path: "/property/history",
    name: "PropertyHistory",
    component: import("../src/views/property/historyPage.vue"),
    meta: { requiresAuth: true, role_id: 1 },
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
    path: "/property/review-work/:id",
    name: "PropertyReviewWork",
    component: import("../src/views/property/reviewWorkPage.vue"),
    meta: { requiresAuth: true, role_id: 1 },
  },
  {
    path: "/property/chat",
    name: "PropertyChat",
    component: import("../src/views/property/chatPage.vue"),
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
    path: "/contractor/chat",
    name: "ContractorChat",
    component: import("../src/views/property/chatPage.vue"),
    meta: { requiresAuth: true, role_id: 2 },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  // console.log(from);

  const currentUser = store.state.isAuthModule.currentUser;
  // console.log(currentUser);

  if (to.meta.requiresAuth && !currentUser) {
    // console.log("i am login");
    next({ name: "login" });
  } else if (to.meta.requiresAuth && currentUser) {
    if (to.meta.role_id && currentUser.role_id !== to.meta.role_id) {
      // console.log("i am else if");
      if (currentUser.role_id == 1) {
        // console.log("i am second if");
        next({ name: "PropertyDashboard" });
      } else {
        // console.log("i am second else");
        next({ name: "contractorDashboard" });
      }
    } else {
      // console.log("in else part");
      next();
    }
  } else {
    // console.log("in outer else part");
    next();
  }
});

export default router;
