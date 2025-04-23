const UserReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_SUCCESS":
      return {
        userInfo: action.payload,
      };
    // Handle other action types...
    default:
      return state;
  }
};

export default UserReducer;
