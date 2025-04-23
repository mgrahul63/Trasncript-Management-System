import axios from "axios";

const QueryFetchData = async ({ queryKey }) => {
  try {
    const response = await axios.get(
      `http://localhost/versity/backend/api/${queryKey?.[0]}.php${
        queryKey[1]?.studentId || queryKey[1]?.registerId
          ? `?${
              queryKey[1]?.studentId
                ? `studentId=${queryKey[1]?.studentId}`
                : ""
            }${queryKey[1]?.studentId && queryKey[1]?.registerId ? "&" : ""}${
              queryKey[1]?.registerId
                ? `registerId=${queryKey[1]?.registerId}`
                : ""
            }`
          : ""
      }`
    );

    if (response.data.status === 1) {
      return response.data.data || []; // Successful response
    }

    // If status is 0, throw an error with the message
    throw new Error(response?.data?.message || "Error fetching data");
  } catch (error) {
    // Log the error for debugging and throw it so react-query catches it
    console.error("Error during data fetching:", error);
    throw error; // Throw the error without modifying it, so React Query can catch it
  }
};

export { QueryFetchData };
