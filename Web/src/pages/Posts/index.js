import { Container } from "react-bootstrap";
import BLogsMasonrySection from "../../components/blogsMasonarySection";
import classes from "./Posts.module.css";
import Hero from "../../components/Hero";
import CategoriesSection from "../../components/Categories";

const Posts = () => {
  return (
    <div className={classes.postSection}>
      <Hero />
      <Container>
        <CategoriesSection />
        <BLogsMasonrySection />
      </Container>
    </div>
  );
};

export default Posts;
