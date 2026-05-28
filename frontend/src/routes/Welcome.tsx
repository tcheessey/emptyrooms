import { useContext, useEffect, useState, type FormEvent } from "react";
import { AuthContext } from "../utils/AuthProvider";
import axios from "axios";

export default function Welcome() {
  const [registerPage, setregisterPage] = useState(false);
  const [username, setusername] = useState("");
  const [password, setpassword] = useState("");
  const [error, seterror] = useState("");

  const { login, register } = useContext(AuthContext);

  useEffect(() => {
    setusername("");
    setpassword("");
    seterror("");
  }, [registerPage]);

  const checkUsername = (un: string) => {
    if (registerPage) {
      axios.get("/api/usernameAvailable/" + un).then((response) => {
        if (!response.data.success) {
          seterror("username already taken");
        } else {
          seterror("");
        }
      });
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (registerPage) {
      register({ username, password }, (errorMessage: string) => {
        seterror(errorMessage);
      });
    } else {
      login({ username, password }, (errorMessage: string) => {
        seterror(errorMessage);
      });
    }
  };

  return (
    <main className='home'>
      <h1>empty rooms</h1>
      {registerPage ? (
        <p>
          Back to{" "}
          <button className='anchor' onClick={() => setregisterPage(false)}>
            login
          </button>
          .
        </p>
      ) : (
        <p>
          Sign in or register{" "}
          <button className='anchor' onClick={() => setregisterPage(true)}>
            here
          </button>
          .
        </p>
      )}
      <form onSubmit={handleSubmit}>
        <input
          value={username}
          name='username'
          type='text'
          placeholder='Username'
          onChange={(e) => setusername(e.target.value)}
          onBlur={(e) => checkUsername(e.target.value)}
        />
        <input
          value={password}
          name='password'
          type='password'
          placeholder='Password'
          onChange={(event) => setpassword(event.target.value)}
        />
        <p className='errorlog'>{error}</p>
        <button type='submit'>
          <span>{registerPage ? "Register" : "Start"}</span>
        </button>
      </form>
    </main>
  );
}
