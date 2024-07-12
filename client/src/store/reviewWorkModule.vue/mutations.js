export const mutations = {
  addCommentOnJobLength: (state, comments) => {
    console.log("object", comments);
    state.reviewComments = comments;
    // console.log("object 2",state.reviewComments);
  },

  // addWorkProofIdInComment: (state, { work_proof_id, index }) => {
  //   console.log("state.reviewComments :>> ", { work_proof_id, index });
  //   console.log('state.reviewComments :>> ', state.reviewComments);
  //   state.reviewComments[index].work_proof_id = work_proof_id;
  // },
};
