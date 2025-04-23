import axios from "axios";
import { useEffect, useState } from "react";

const useFetch = (url) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    const fetchData = async () => {
      try {
        const response = await axios.get(url, { signal: controller.signal });
        setData(response.data); // Update state only if not aborted
      } catch (error) {
        if (error.name !== "CanceledError") {
          console.error("Error fetching data:", error);
          setError(error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    return () => {
      // console.log("unmount...");
      controller.abort(); // Cancel request on unmount
    };
  }, [url]);

  return { data, loading, error };
};

export default useFetch;
