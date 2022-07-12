import { useState, useEffect } from "react";

import { useRouter } from "next/router";

import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import Alert from "@material-ui/lab/Alert";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100vh",
    display: "flex",
    alignItems: "center"
  },
  paper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1)
  },
  alert: {
    marginTop: theme.spacing(2)
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  }
}));

const registeredUsers = [
  {
    email: "username1@email.com",
    password: "password1",
    id: 1
  },
  {
    email: "username2@email.com",
    password: "password2",
    id: 2
  },
  {
    email: "username3@email.com",
    password: "password3",
    id: 3
  },
  {
    email: "username4@email.com",
    password: "password4",
    id: 4
  },
  {
    email: "username5@email.com",
    password: "password5",
    id: 5
  },
  {
    email: "username6@email.com",
    password: "password6",
    id: 6
  },
  {
    email: "username7@email.com",
    password: "password7",
    id: 7
  },
  {
    email: "username8@email.com",
    password: "password8",
    id: 8
  },
  {
    email: "username9@email.com",
    password: "password9",
    id: 9
  },
  {
    email: "username10@email.com",
    password: "password10",
    id: 10
  }
];

export default function SignIn() {
  const classes = useStyles();
  const router = useRouter();

  const [user, setUser] = useState({
    email: "",
    password: ""
  });

  const [error, setError] = useState(false);

  const userIsRegistered = (user) => {
    return registeredUsers.find(({ id, email, password }) => {
      if (email === user.email && password === user.password) {
        return { id, email, password };
      } else {
        return false;
      }
    });
  };

  const signIn = (e) => {
    e.preventDefault();
    if (userIsRegistered(user)) {
      setError(false);
      router.push("/tabs");
    } else {
      setError(true);
    }
    localStorage.setItem("user", JSON.stringify(userIsRegistered(user)));
  };

  useEffect(() => {
    if (
      localStorage.getItem("user") &&
      localStorage.getItem("user") !== "undefined"
    ) {
      router.push("/tabs");
    }
  });

  return (
    <Container className={classes.root} component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <form className={classes.form} noValidate>
          <TextField
            error={error}
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            onChange={(e) => {
              setUser({ ...user, email: e.target.value });
            }}
          />
          <TextField
            error={error}
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            onChange={(e) => {
              setUser({ ...user, password: e.target.value });
            }}
          />

          {error && (
            <Alert className={classes.alert} severity="error">
              Please enter valid email address and password.
            </Alert>
          )}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={signIn}
          >
            Sign In
          </Button>
        </form>
      </div>
    </Container>
  );
}
