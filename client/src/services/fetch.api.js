export const fetchGetAPI = async (url) => {
  try {
    let getRes = await fetch(`${process.env.VUE_APP_BASE_URL}${url}`, {
      mode: "cors",
      credentials: "include",
    });
    return await getRes.json();
  } catch (error) {
    console.error(error);
    return error;
  }
};

export const fetchPostAPI = async (url, bodyPayload) => {
  try {
    let postRes = await fetch(`${process.env.VUE_APP_BASE_URL}${url}`, {
      method: "post",
      mode: "cors",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(bodyPayload),
    });
    return await postRes.json();
  } catch (error) {
    console.error(error);
    return error;
  }
};

export const fetchPostWithFormDataAPI = async (url, formData) => {
  try {
    let postRes = await fetch(`${process.env.VUE_APP_BASE_URL}${url}`, {
      method: "post",
      mode: "cors",
      // headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: formData,
    });
    return await postRes.json();
  } catch (error) {
    console.error(error);
    return error;
  }
};
