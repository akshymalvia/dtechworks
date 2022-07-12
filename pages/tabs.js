import { useState, useEffect } from "react";

import PropTypes from "prop-types";

import { useRouter } from "next/router";

import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import SaveIcon from "@material-ui/icons/Save";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";

import AddDish from "../components/forms/AddDish";
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
    backgroundColor: theme.palette.background.paper,
    height: "calc(100vh - 16px)"
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
  const [initialLoad, setInitialLoad] = useState(true);
  const [addDishFormVisible, setAddDishFormVisible] = useState(false);
  const [poll, setPoll] = useState([]);
  const [dishes, setDishes] = useState([]);
  const [selection, setSelection] = useState({ user: null, dishes: [] });
  const [selectableDishes, setSelectableDishes] = useState([]);
  const [currentUserDishes, setCurrentUserDishes] = useState([]);
  const [dishToEdit, setDishToEdit] = useState({});
  const [user, setUser] = useState({});
  const [warning, setWarning] = useState(false);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const addDish = (dish) => {
    dish.id = Date.now();
    dish.user = user?.id;
    setDishes([...dishes, dish]);
    setAddDishFormVisible(false);
  };

  const editDish = (dish) => {
    setDishToEdit(dish);
    setAddDishFormVisible(true);
  };

  const updateDish = (updatedDish) => {
    let currentDishIndex = dishes.findIndex(
      (dish) => dish.id === updatedDish.id
    );
    let dishesClone = [...dishes];
    dishesClone[currentDishIndex] = updatedDish;
    setDishes(dishesClone);
    setAddDishFormVisible(false);
  };

  const deleteDish = (dishToDelete) => {
    setDishes(dishes.filter((dish) => dish.id !== dishToDelete.id));
  };

  const cancel = () => {
    setAddDishFormVisible(false);
    setDishToEdit({});
  };

  const updateRatings = (updatedSelection) => {
    return updatedSelection.map((dish, index) => {
      dish.rating = 30 - index * 10;
      return dish;
    });
  };

  const updateSelection = (selectedDish, selected) => {
    if (selected) {
      if (selection.dishes.length < 3) {
        setSelection({
          user: user.id,
          dishes: updateRatings([...selection.dishes, selectedDish])
        });
      } else {
        setWarning(true);
      }
    } else {
      setSelection({
        ...selection,
        dishes: updateRatings(
          selection.dishes.filter((dish) => dish.id !== selectedDish.id)
        )
      });
    }
  };

  const hideWarning = () => {
    setWarning(false);
  };

  const saveSelection = () => {
    let pollClone = [...poll];
    let existingSelectionIndex = poll.findIndex(
      (existingSelection) => existingSelection.user === selection.user
    );
    if (existingSelectionIndex !== -1) {
      pollClone[existingSelectionIndex] = selection;
    } else {
      pollClone = [...pollClone, selection];
    }
    localStorage.setItem("poll", JSON.stringify(pollClone));
    router.push("/results");
  };

  useEffect(() => {
    if (initialLoad) {
      setInitialLoad(false);
      setUser(JSON.parse(localStorage.getItem("user") || false));
      setPoll(JSON.parse(localStorage.getItem("poll")) || []);
      setDishes(JSON.parse(localStorage.getItem("dishes")) || []);
    } else {
      localStorage.setItem("dishes", JSON.stringify(dishes));
    }
  }, [dishes]);

  useEffect(() => {
    setCurrentUserDishes(dishes.filter((dish) => dish.user === user?.id));
    setSelectableDishes(dishes.filter((dish) => dish.user !== user?.id));
    setSelection(
      poll.filter((selection) => selection.user === user.id)[0] || {
        user: null,
        dishes: []
      }
    );
  }, [dishes]);

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
          <LinkTab label="Creat Poll" href="/create-poll" {...a11yProps(0)} />
          <LinkTab
            label="Make Selection"
            href="/make-selection"
            {...a11yProps(1)}
          />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
        <span className={classes.panel}>
          <Typography variant="h4" component="span">
            Create Poll
          </Typography>
          {currentUserDishes.length < 2 && (
            <Button
              variant="contained"
              color="primary"
              className={classes.button}
              startIcon={<AddIcon />}
              onClick={() => {
                setAddDishFormVisible(true);
              }}
            >
              Add Dish
            </Button>
          )}
        </span>
        <AddDish
          open={addDishFormVisible}
          onCancel={() => {
            cancel();
          }}
          onAdd={(dish) => {
            addDish(dish);
          }}
          onEdit={(dish) => {
            updateDish(dish);
          }}
          dishToEdit={dishToEdit}
        />
        <Box className={classes.dishes}>
          <Dishes
            dishes={currentUserDishes}
            onDelete={deleteDish}
            onEdit={editDish}
            view="poll"
          ></Dishes>
        </Box>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <span className={classes.panel}>
          <Typography variant="h4" component="span">
            Make Selection
          </Typography>
          {selectableDishes.length > 0 && (
            <Button
              variant="contained"
              color="primary"
              className={classes.button}
              startIcon={<SaveIcon />}
              onClick={saveSelection}
            >
              Save Selection
            </Button>
          )}
        </span>
        <Box className={classes.dishes}>
          <Dishes
            dishes={selectableDishes}
            selection={selection}
            onSelect={updateSelection}
            view="selection"
          ></Dishes>
        </Box>
      </TabPanel>
      <Snackbar open={warning} autoHideDuration={3000} onClose={hideWarning}>
        <Alert onClose={hideWarning} severity="warning">
          You can only select max 3 dishes!
        </Alert>
      </Snackbar>
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
