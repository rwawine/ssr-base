export interface Slide {
  id: number;
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  image: {
    url: string;
    formats?: {
      [key: string]: { url: string };
    };
  }[];
}

export async function fetchHeroSlides(): Promise<Slide[]> {
  // Проверяем кэш sessionStorage (если на клиенте)
  if (typeof window !== 'undefined') {
    const cachedData = sessionStorage.getItem('heroSlides');
    const cachedTimestamp = sessionStorage.getItem('heroSlidesTimestamp');
    const now = Date.now();
    if (cachedData && cachedTimestamp && (now - parseInt(cachedTimestamp)) < 3600000) {
      return JSON.parse(cachedData);
    }
  }

  const response = await fetch('https://admin.dilavia.by/api/slajder-na-glavnoj-straniczes?populate=image');
  const data = await response.json();
  const slides: Slide[] = data.data;

  // Кэшируем данные (если на клиенте)
  if (typeof window !== 'undefined') {
    sessionStorage.setItem('heroSlides', JSON.stringify(slides));
    sessionStorage.setItem('heroSlidesTimestamp', Date.now().toString());
  }

  return slides;
} 