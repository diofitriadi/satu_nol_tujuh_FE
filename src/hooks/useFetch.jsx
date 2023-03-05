import { useState, useEffect } from "react";

function useFetch(url, options = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${options.token}`, // token digunakan untuk auth
        },
        ...options, // opsi tambahan untuk fetch, misalnya method, body, dll
      });
      const responseData = await response.json();
      setData(responseData);
      setLoading(false);
    }

    fetchData();
  }, [url, options]);

  return { data, loading };
}

export default useFetch;
