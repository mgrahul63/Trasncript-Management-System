import axios from "axios";
import { useEffect, useState } from "react";

const useFetchLoginStatus = (url) => {
  // const { dispatch } = useData();
  const [userInfo, setUserInfo] = useState();

  useEffect(() => {
    let ignore = false;
    const checkUserLoggedIn = async () => {
      const token = localStorage.getItem("authToken");

      if (token) {
        axios
          .post(
            url,
            { token },
            { headers: { "Content-Type": "application/json" } }
          )
          .then((response) => {
            if (response.status === 200) {
              if (!ignore) setUserInfo(response.data.userInfo);
            }
          })
          .catch((error) => {
            if (error.response) {
              localStorage.removeItem("authToken");
            } else {
              // Handle network or other errors
              console.log("An error occurred. Please try again.");
            }
          });
      }
    };

    checkUserLoggedIn();
    return () => {
      ignore = true;
    };
  }, [url]);
  return { userInfo };
};

export default useFetchLoginStatus;
