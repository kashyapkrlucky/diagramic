import { useState } from "react";

export const useFetch = (url: string) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

  const getData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/${url}`);
      const data = await response.json();
      setData(data);
    } catch (error) {
      setError(error as Error);
    } finally {
      setLoading(false);
    }
  };

  return {
    data,
    loading,
    error,
    getData,
  };
};
