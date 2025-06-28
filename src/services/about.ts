// Типы для данных из API
export interface AboutData {
  T1: string;
  T2: string;
  t3: string;
  t3_5: string;
  t4: string;
  t5: string;
  t5_5: string;
  image1: Array<{
    url: string;
    formats: {
      thumbnail: { url: string };
      small: { url: string };
      medium: { url: string };
      large: { url: string };
    };
  }>;
  image2: Array<{
    url: string;
    formats: {
      thumbnail: { url: string };
      small: { url: string };
      medium: { url: string };
      large: { url: string };
    };
  }>;
  inf: Array<{
    t1: string;
    t2: string;
    t3: string;
  }>;
}

interface ApiResponse {
  data: AboutData;
}

// Дефолтные данные для fallback
const defaultAboutData: AboutData = {
  T1: "О компании «Dilavia»",
  T2: "Наша компания предлагает вам современную мебель. Мы самостоятельно разрабатываем конструкцию и удобную дизайнерскую мебель, опираясь на тренды индустрии.",
  t3: "Интерьер... Мы видим его как творчество, индивидуальность",
  t3_5: "Над проектами работает большая команда, все материалы проходят контроль качества, опытные технологи прорабатывают каждый сантиметр изделий, толщину наполнителя, эргономику посадки.",
  t4: "Благодаря опыту и технологиям производства, мы получаем результат – мебель, которая будет радовать вас долгие годы.",
  t5: "Фабрика мебели Dilavia – это собственное производство, расположенное в Беларуси.",
  t5_5: "Выстроив долгосрочные отношения с лучшими поставщиками материалов (фурнитуры, тканей, механизмов), мы гарантируем 100% результат и готовы радовать Вас низкими ценами.",
  image1: [],
  image2: [],
  inf: [
    {
      t1: "Экологически чистые материалы",
      t2: "Европейские поставщики тканей и фурнитуры",
      t3: "Контроль качества на каждом этапе производства",
    },
  ],
};

/**
 * Получает данные страницы "О компании" из API
 * @returns Promise<AboutData> - данные страницы
 */
export async function getAboutData(): Promise<AboutData> {
  try {
    const response = await fetch(
      "https://admin.dilavia.by/api/about?populate=*",
      {
        next: { revalidate: 60 }, // Кэширование на 30 минут
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: ApiResponse = await response.json();

    if (!data.data) {
      throw new Error("Invalid API response structure");
    }

    return data.data;
  } catch (error) {
    console.error("Error fetching about data:", error);

    // В продакшене можно добавить отправку ошибки в систему мониторинга
    // await logError('getAboutData', error);

    // Возвращаем дефолтные данные в случае ошибки
    return defaultAboutData;
  }
}

/**
 * Получает данные страницы "О компании" с обработкой ошибок
 * @returns Promise<AboutData> - данные страницы или дефолтные значения
 */
export async function getAboutDataSafe(): Promise<AboutData> {
  try {
    return await getAboutData();
  } catch (error) {
    console.error("Failed to fetch about data, using defaults:", error);
    return defaultAboutData;
  }
}
