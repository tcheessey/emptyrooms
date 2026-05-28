import { useContext } from "react";
import { AuthContext } from "../utils/AuthProvider";

export default function Controls() {
  const { logout } = useContext(AuthContext);
  return (
    <div className='home__controls'>
      <div className='home__controls__top'>
        <a href='/me' className='myProfile'>
          Me
        </a>
        <button className='logout' type='button' onClick={logout}>
          Logout
        </button>
      </div>
    </div>
  );
}
