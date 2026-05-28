import { useContext } from "react";
import { AuthContext } from "../utils/AuthProvider";

export default function Avatar() {
  const { userData } = useContext(AuthContext);

  return (
    <div id='avatar' className='avatar'>
      {userData?.username}
    </div>
  );
}
