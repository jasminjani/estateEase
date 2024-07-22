import { store } from "@/store";
import { computed } from "vue";
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
    path: "/property/chat/:id/:p_id",
    name: "PropertyChat",
    component: import("../src/views/property/chatPage.vue"),
    meta: { requiresAuth: true, role_id: 1 },
  },
  {
    path: "/property/payment/success/:contracter_id/:p_id",
    name: "PaymentSuccess",
    component: import("../src/views/property/paymentSuccess.vue"),
    meta: { requiresAuth: true, role_id: 1 },
  },
  {
    path: "/property/payment/failure",
    name: "PaymentFailure",
    component: import("../src/views/property/paymentFailed.vue"),
    meta: { requiresAuth: true, role_id: 1 },
  },
  {
    path: "/property/payment/:p_id",
    name: "PropertyPayment",
    component: import("../src/views/property/paymentPage.vue"),
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
    path: "/contractor/chat/:id/:p_id",
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

  const currentUser = computed(() => store.getters.getCurrentUser);
  // console.log(currentUser.value);

  if (to.meta.requiresAuth && !currentUser.value) {
    // console.log("i am login");
    next({ name: "login" });
  } else if (to.meta.requiresAuth && currentUser.value) {
    if (to.meta.role_id && currentUser.value.role_id !== to.meta.role_id) {
      // console.log("i am else if");
      if (currentUser.value.role_id == 1) {
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
