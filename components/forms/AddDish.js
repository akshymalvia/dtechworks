import { useState, useEffect } from "react";

import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Box from "@material-ui/core/Box";

import { DropzoneArea } from "material-ui-dropzone";

const useStyles = makeStyles((theme) => ({
  dropzone: {
    marginTop: theme.spacing(2)
  }
}));

export default function AddDish({ open, onCancel, onAdd, onEdit, dishToEdit }) {
  const classes = useStyles();

  const [dish, setDish] = useState({
    id: null,
    name: "",
    description: "",
    picture: {},
    rating: null,
    user: null
  });

  const [editMode, setEditMode] = useState(false);

  const fileToDataUri = (files) => {
    let reader = new FileReader();
    reader.addEventListener("load", () => {
      setDish({ ...dish, picture: reader.result });
    });
    if (files && files.length && Object.keys(files[0]).length) {
      reader.readAsDataURL(files[0]);
    }
  };

  const dataUriToFile = (dataUri) => {
    if (typeof dataUri === "string") {
      var byteString = atob(dataUri.split(",")[1]);
      var mimeString = dataUri.split(",")[0].split(":")[1].split(";")[0];

      var ab = new ArrayBuffer(byteString.length);
      var ia = new Uint8Array(ab);
      for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }

      return new Blob([ab], { type: mimeString });
    }
  };

  const submit = () => {
    editMode ? onEdit(dish) : onAdd(dish);
    setDish({
      id: null,
      name: "",
      description: "",
      picture: [{}],
      user: null
    });
  };

  const cancel = () => {
    setDish({
      id: null,
      name: "",
      description: "",
      picture: [{}],
      user: null
    });
    onCancel();
  };

  const setEditableDish = () => {
    if (editMode) {
      let editableDish = { ...dishToEdit };
      editableDish.picture = dataUriToFile(editableDish.picture);
      setDish(editableDish);
    }
  };

  useEffect(() => {
    setEditMode(Boolean(Object.keys(dishToEdit).length));
  }, [dishToEdit]);

  return (
    <div>
      <Dialog
        open={open}
        onClose={() => cancel()}
        onEnter={setEditableDish}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">
          {editMode ? "Edit Dish" : "Add Dish"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            You can add two dishes at a time to the poll, you need to provide
            dish name, description and picture.
          </DialogContentText>
          <TextField
            autoFocus
            required
            margin="dense"
            id="name"
            label="Dish name"
            type="text"
            fullWidth
            value={dish.name}
            onChange={(e) => {
              setDish({ ...dish, name: e.target.value });
            }}
          />
          <TextField
            autoFocus
            required
            margin="dense"
            id="description"
            label="Dish description"
            type="text"
            multiline
            fullWidth
            rows={3}
            rowsMax={5}
            value={dish.description}
            onChange={(e) => {
              setDish({ ...dish, description: e.target.value });
            }}
          />
          <Box className={classes.dropzone}>
            <DropzoneArea
              required
              initialFiles={[dish.picture]}
              onChange={(files) => {
                fileToDataUri(files);
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => cancel()} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={() => {
              submit();
            }}
            color="primary"
          >
            {editMode ? "Save" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
