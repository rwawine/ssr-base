import PopularProduct from "@/components/popularProduct/PopularProduct";
import styles from "./page.module.css";

export default function Home() {
  return (
    <>
      <h1 className={styles.title}>Hello World</h1>
      <PopularProduct category="Кровать" />
    </>
  );
}
