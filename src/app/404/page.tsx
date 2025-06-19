import styles from './NotFound.module.css'

export default function Page() {

  return (
    <>
      <div className={styles.container}>

        <div className={styles.content}>
          <h1 className={styles.title}>404</h1>
          <h2 className={styles.subtitle}>Страница не найдена</h2>
          <p className={styles.description}>
            К сожалению, запрашиваемая страница не существует или была перемещена.
          </p>
          <div className={styles.actions}>
            <button
              className={styles.button}
            >
              Вернуться назад
            </button>
            <button
              className={`${styles.button} ${styles.primary}`}
            >
              На главную
            </button>
          </div>
        </div>
      </div>
    </>
  )
} 