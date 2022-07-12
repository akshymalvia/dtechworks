import { useState, useEffect } from "react";

import { makeStyles, ThemeProvider } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
// import Rating from "@material-ui/lab/Rating";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Favorite from "@material-ui/icons/Favorite";
import FavoriteBorder from "@material-ui/icons/FavoriteBorder";

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 345
  },
  media: {
    height: 140
  },
  actions: {
    justifyContent: "space-between",
    alignItems: "center"
  },
  formControlLabel: {
    marginRight: theme.spacing(1)
  }
}));

export default function Dish({
  id,
  name,
  description,
  picture,
  rating,
  onDelete,
  onEdit,
  onSelect,
  view,
  addedBy,
  selection
}) {
  const classes = useStyles();

  const [user, setUser] = useState({});
  const [initialLoad, setInitialLoad] = useState(true);

  useEffect(() => {
    if (initialLoad) {
      setInitialLoad(false);
      setUser(JSON.parse(localStorage.getItem("user") || false));
    }
  }, [initialLoad]);

  return (
    <Card className={classes.root}>
      <CardActionArea>
        <CardMedia title={name} className={classes.media} image={picture} />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {name}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            {description}
          </Typography>
        </CardContent>
      </CardActionArea>

      {view === "poll" && (
        <CardActions className={classes.actions}>
          <Button size="small" color="primary" onClick={onDelete}>
            Delete
          </Button>
          <Button size="small" color="primary" onClick={onEdit}>
            Edit
          </Button>
        </CardActions>
      )}

      {view === "selection" && (
        <CardActions className={classes.actions}>
          <FormControlLabel
            control={
              <Checkbox
                icon={<FavoriteBorder />}
                checkedIcon={<Favorite />}
                onChange={(e) => onSelect(e.target.checked)}
                name="checkedH"
                checked={selection?.dishes.find((dish) => dish.id === id)}
              />
            }
            label="Select"
          />
        </CardActions>
      )}

      {view === "results" && (
        <CardActions className={classes.actions}>
          <Typography variant="body2" color="textSecondary" component="p">
            {rating} Points
          </Typography>
          {addedBy === user.id && (
            <Typography variant="body2" color="textSecondary" component="p">
              Added by you
            </Typography>
          )}
          {selection.dishes.find((dish) => dish.id === id) && (
            <Typography variant="body2" color="textSecondary" component="p">
              Selected by you
            </Typography>
          )}
        </CardActions>
      )}
    </Card>
  );
}
