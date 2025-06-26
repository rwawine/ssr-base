import type { SliderControls } from "@/types";
import styles from "./SliderHeroBanner.module.css";

interface SliderNavigationProps {
  slidesCount: number;
  currentSlide: number;
  controls: Pick<SliderControls, "goToSlide" | "goToPrev" | "goToNext">;
}

export function SliderNavigation({
  slidesCount,
  currentSlide,
  controls,
}: SliderNavigationProps) {
  if (slidesCount <= 1) return null;

  return (
    <>
      {/* Навигационные кнопки */}
      <div className={styles.navigation}>
        <button
          className={styles.prevBtn}
          onClick={controls.goToPrev}
          aria-label="Предыдущий слайд"
          type="button"
        >
          ‹
        </button>
        <button
          className={styles.nextBtn}
          onClick={controls.goToNext}
          aria-label="Следующий слайд"
          type="button"
        >
          ›
        </button>
      </div>

      {/* Буллеты */}
      <div className={styles.bullets}>
        {Array.from({ length: slidesCount }, (_, index) => (
          <button
            key={index}
            className={`${styles.bullet} ${index === currentSlide ? styles.bulletActive : ""}`}
            onClick={() => controls.goToSlide(index)}
            aria-label={`Перейти к слайду ${index + 1}`}
            aria-current={index === currentSlide ? "true" : "false"}
            type="button"
          >
            <div className={styles.bulletBar} />
          </button>
        ))}
      </div>
    </>
  );
}
