import useBreadcrumbs from "use-react-router-breadcrumbs";
import { Link } from "react-router-dom";
import Tab from "widgets/Tab/Tab";
import arrow from "shared/images/Arrow.svg";
import classes from "./Breadcrumbs.module.scss";
import { routes } from "./BreadcrumbsRoutes";

const Breadcrumbs = () => {
  const breadcrumbs = useBreadcrumbs(routes);

  return (
    <div className={classes.breadcrumbs}>
      {breadcrumbs.map(({ match, breadcrumb }, index) => (
        <div key={match.pathname} className={classes.breadcrumb_item}>
          {index !== 0 && (
            <img src={arrow} alt="→" className={classes.arrow_icon} />
          )}
          {index === breadcrumbs.length - 1 ? (
            <Tab label={breadcrumb} />
          ) : (
            <Link to={match.pathname} className={classes.tab_link}>
              <Tab label={breadcrumb} />
            </Link>
          )}
        </div>
      ))}
    </div>
  );
};

export default Breadcrumbs;
