import styles from "./BusinessApplication.module.scss";
import BusinessApplicationCard from "./components/BusinessApplicationCard/BusinessApplication";

export default function BusinessApplication() {


  return (
    <div className={styles.main}>
      <BusinessApplicationCard />
      <BusinessApplicationCard /> 
      <BusinessApplicationCard />
    </div>
  );
}
