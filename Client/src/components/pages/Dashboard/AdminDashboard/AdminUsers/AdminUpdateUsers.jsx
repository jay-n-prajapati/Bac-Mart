import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import RegisterUser from "../../../Register/register-user";

function AdminUpdateUsers() {
  const { id } = useParams();
  const [userData, setUserData] = useState({ name: "" });

  useEffect(() => {
    axios
      .get(`http://localhost:3000/users/${id}`)
      .then((res) => {
        setUserData(res.data);
      })
      .catch((err) => toast.error(err));
  }, []);

  return <RegisterUser isFromAdmin={true} userData={userData} />;
}

export default AdminUpdateUsers;
