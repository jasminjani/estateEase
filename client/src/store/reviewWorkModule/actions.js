export const actions = {
  addCommentOnJobLength: ({ commit }, comments) => {
    try {
      commit("addCommentOnJobLength", comments);
    } catch (error) {
      console.error(error);
    }
  },

  // addWorkProofIdInComment: ({ commit }, payload) => {
  //   commit("addWorkProofIdInComment", payload);
  // },

  // addReviewComments: ({ commit }, propertyData) => {
  //   try {
  //     propertyData.jobs.map((element) => {
  //       commit("addJobComment", element);
  //     });
  //   } catch (error) {
  //     console.error(error);
  //   }
  // },
};
