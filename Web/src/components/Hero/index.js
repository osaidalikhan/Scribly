import { ChevronDown } from "react-feather";
import styles from "./Hero.module.css";
import heroImage from "../../assets/Images/hero.jpg";
export default function Hero() {
  return (
    <section className={styles.heroSection}>
      <div className={styles.backgroundWrapper}>
        <div className={styles.backgroundOverlay}></div>
        <div className={styles.backgroundImage}>
          <img
            src={heroImage}
            alt="Hero Image"
            layout="fill"
            objectFit="cover"
            quality={100}
          />
        </div>
      </div>

      <div className={styles.container}>
        <div className={styles.content}>
          <h1 className={styles.title}>You Deserve to Grow</h1>
          <p className={styles.subtitle}>
            The best stories to help you start, grow, and monetize your business
          </p>
          <p className={styles.description}>
            Real stories, step-by-step guides, and expert insights — all written
            by handpicked contributors to help you start, grow, and monetize
            your business.
          </p>

          <div className={styles.buttons}>
            <button size="lg" className="primary-button">
              Get Started
            </button>
            <button size="lg" variant="outline" className="border-button">
              Explore
            </button>
          </div>
        </div>
      </div>

      <div className={styles.bottomArrow}>
        <ChevronDown />
      </div>
    </section>
  );
}
