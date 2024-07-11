export const getters = {
  getReviewCommentState: (state) => (index) => {
    console.log(index, "index");
    // return {};
  // },
    return state?.reviewComments?.length > index
      ? state.reviewComments[index]
      : { comment: null };
  },

  getAllReviewCommentData: (state) => {
    console.log("getter");
    return state.reviewComments;
  },
};
