import { useState, useEffect } from "react";
import PropTypes from "prop-types";

import { useRouter } from "next/router";

import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Fab from "@material-ui/core/Fab";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";

import Dishes from "../components/Dishes";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`nav-tabpanel-${index}`}
      aria-labelledby={`nav-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired
};

function a11yProps(index) {
  return {
    id: `nav-tab-${index}`,
    "aria-controls": `nav-tabpanel-${index}`
  };
}

function LinkTab(props) {
  return (
    <Tab
      component="a"
      onClick={(event) => {
        event.preventDefault();
      }}
      {...props}
    />
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper
  },
  panel: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },
  button: {
    margin: theme.spacing(1)
  },
  dishes: {
    marginTop: theme.spacing(2),
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gridGap: "1em"
  },
  fab: {
    position: "fixed",
    bottom: "16px",
    right: "16px"
  }
}));

export default function NavTabs() {
  const classes = useStyles();
  const router = useRouter();
  const [value, setValue] = useState(0);
  const [dishes, setDishes] = useState([]);
  const [selection, setSelection] = useState([]);
  const [initialLoad, setInitialLoad] = useState(true);
  const [user, setUser] = useState([]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    if (initialLoad) {
      setInitialLoad(false);
      let user = JSON.parse(localStorage.getItem("user") || false);
      setUser(user);
      let poll = JSON.parse(localStorage.getItem("poll")) || [];
      let polledDishes = [];
      poll.forEach((selection) => {
        if (selection.user === user.id) {
          setSelection(selection);
        }
        polledDishes = [...polledDishes, ...selection.dishes];
      });
      setDishes(
        polledDishes
          .reduce((acc, dish) => {
            let accIndex = acc.findIndex((accDish) => accDish.id === dish.id);
            if (accIndex !== -1) {
              acc[accIndex].rating += dish.rating;
            } else {
              acc = [...acc, dish];
            }
            return acc;
          }, [])
          .sort((a, b) => b.rating - a.rating)
      );
    }
  }, [initialLoad]);

  useEffect(() => {
    if (!localStorage.getItem("user")) {
      router.push("/");
    }
  });

  const logout = () => {
    localStorage.removeItem("user");
    router.push("/");
  };

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Tabs
          variant="fullWidth"
          value={value}
          onChange={handleChange}
          aria-label="nav tabs example"
        >
          <LinkTab label="Results" href="/create-poll" {...a11yProps(0)} />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
        <Box className={classes.dishes}>
          <Dishes dishes={dishes} selection={selection} view="results"></Dishes>
        </Box>
      </TabPanel>
      <Fab
        color="primary"
        aria-label="add"
        className={classes.fab}
        onClick={logout}
        title="Logout"
      >
        <ExitToAppIcon />
      </Fab>
    </div>
  );
}
