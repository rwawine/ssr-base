import type { Slide } from "@/types";

export async function fetchHeroSlides(): Promise<Slide[]> {
  try {
    // // Проверяем кэш sessionStorage (если на клиенте)
    // if (typeof window !== "undefined") {
    //   const cachedData = sessionStorage.getItem("heroSlides");
    //   const cachedTimestamp = sessionStorage.getItem("heroSlidesTimestamp");
    //   const now = Date.now();
    //   if (
    //     cachedData &&
    //     cachedTimestamp &&
    //     now - parseInt(cachedTimestamp) < 3600000
    //   ) {
    //     const parsedData = JSON.parse(cachedData);
    //     return Array.isArray(parsedData) ? parsedData : [];
    //   }
    // }

    const response = await fetch(
      "https://admin.dilavia.by/api/slajder-na-glavnoj-straniczes?populate=image",
    );

    if (!response.ok) {
      console.error(
        "Failed to fetch hero slides:",
        response.status,
        response.statusText,
      );
      return [];
    }

    const data = await response.json();
    const slides: Slide[] = data.data || [];

    // // Кэшируем данные (если на клиенте)
    // if (typeof window !== "undefined" && Array.isArray(slides)) {
    //   sessionStorage.setItem("heroSlides", JSON.stringify(slides));
    //   sessionStorage.setItem("heroSlidesTimestamp", Date.now().toString());
    // }

    return slides;
  } catch (error) {
    console.error("Error fetching hero slides:", error);
    return [];
  }
}
