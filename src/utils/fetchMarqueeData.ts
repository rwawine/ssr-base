import { MarqueeApiResponse } from '@/types/marquee';

const MARQUEE_API_URL = 'https://admin.dilavia.by/api/karusel-s-preimushhestvami?populate[0]=item&populate[1]=item.imageUrl';

export async function fetchMarqueeData(): Promise<MarqueeApiResponse> {
  try {
    const response = await fetch(MARQUEE_API_URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // Добавляем кэширование для оптимизации производительности
      next: { revalidate: 3600 }, // Кэшируем на 1 час
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: MarqueeApiResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching marquee data:', error);
    throw new Error('Failed to fetch marquee data');
  }
}

// Функция для получения только изображений из данных marquee
export function extractImagesFromMarqueeData(data: MarqueeApiResponse): string[] {
  return data.data.item
    .filter((item): item is import('@/types/marquee').MarqueeSlideItem => 
      item.__component === 'shared.slide-item'
    )
    .map(item => item.imageUrl.url);
}

// Функция для получения только заголовков из данных marquee
export function extractTitlesFromMarqueeData(data: MarqueeApiResponse): string[] {
  return data.data.item
    .filter((item): item is import('@/types/marquee').MarqueeTitleItem => 
      item.__component === 'shared.title-item'
    )
    .map(item => item.text);
} 