import { useState, useEffect } from "react";
import { MarqueeApiResponse } from "@/types/marquee";
import { fetchMarqueeData } from "@/utils/fetchMarqueeData";

interface UseMarqueeReturn {
  data: MarqueeApiResponse | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useMarquee(): UseMarqueeReturn {
  const [data, setData] = useState<MarqueeApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const marqueeData = await fetchMarqueeData();
      setData(marqueeData);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Произошла ошибка при загрузке данных",
      );
      console.error("useMarquee error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const refetch = async () => {
    await fetchData();
  };

  return {
    data,
    loading,
    error,
    refetch,
  };
}
