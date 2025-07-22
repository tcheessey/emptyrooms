import React, { useContext, useEffect } from "react";
import avatar from "../../assets/img/avatar.png";
import { AuthContext } from "../../LoginRegister/AuthProvider";

export default function Avatar() {
  const { userData } = useContext(AuthContext);

  return (
    <div id='avatar' className='avatar'>
      {userData.username}
    </div>
  );
}
