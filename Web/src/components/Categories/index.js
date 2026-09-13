import { categories } from "../../assets/helper/DummyData";
import styles from "./Categorie.module.css";

const CategoriesSection = () => {
  return (
    <section className={styles.section}>
      <div className={styles.sectionHeader}>
        <p className={styles.label}>EXPLORE CATEGORIES</p>
        <h2 className={styles.heading}>
          Empowering Your Well-Being with <br />
          <span className={styles.highlight}>Expert Insights!</span>
        </h2>
        <p className={styles.description}>
          Discover valuable information on mental health, fitness, cancer
          awareness, sleep health, nutrition, and heart health to lead a better
          life.
        </p>
      </div>

      <div className={styles.grid}>
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <div key={category.id} className={styles.card}>
              <div className={styles.imageWrapper}>
                <img
                  src={category.image}
                  alt={category.title}
                  layout="fill"
                  objectFit="cover"
                />
              </div>
              <div className={styles.iconWrapper}>
                <Icon size={24} />
              </div>
              <div className={styles.cardContent}>
                <h3 className={styles.cardTitle}>{category.title}</h3>
                <p className={styles.cardDesc}>{category.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default CategoriesSection;
