import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
const Login = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({ name: "", email: "", room: "" });
  const [error, setError] = useState("");

  const hendeler = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const fromvalidation = () => {
    if (!data.name) {
      setError("Please Enter A Name");
      return false;
    }
    if (!data.email) {
      setError("Please Enter A Email");
      return false;
    }
    if (!data.name) {
      setError("Please Select A Room Metting");
      return false;
    }
    return true;
  };

  // from submit
  const formSubmit = (e) => {
    e.preventDefault();
    const formValid = fromvalidation();
    if (formValid) {
      fetch("https://secret-ravine-52133.herokuapp.com/user", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((result) => {
          if (result) {
            navigate(`/inbox/${data.room}`, { state: data });
          }
        });
    }
  };

  console.log(data);

  return (
    <div className="flex h-screen justify-center items-center p-5">
      <div className="card w-96 bg-base-100 border">
        <div className="card-body">
          <h2 className="text-center text-xl">WellCome Chat App</h2>

          {/* chating div  */}
          <div className="my-5">
            <form onSubmit={formSubmit}>
              <input
                type="text"
                placeholder="Enter Your Name"
                name="name"
                className="input input-bordered w-full max-w-xs"
                onChange={hendeler}
              />
              <input
                type="email"
                name="email"
                onChange={hendeler}
                placeholder="Enter Your Email"
                className="input input-bordered w-full max-w-xs mt-3"
              />
              <select
                onChange={hendeler}
                name="room"
                className="select select-bordered w-full max-w-xs mt-3"
              >
                <option disabled selected>
                  Selected Room
                </option>
                <option value="personal Metting">Personal Metting</option>
                <option value="group chat">Grup Chat</option>
              </select>
              <input
                type="file"
                placeholder="Enter Your Name"
                className="input input-bordered w-full max-w-xs mt-3"
              />

              <div>
                <input
                  type="submit"
                  className="bg-[#0C2D48] text-white font-medium input input-bordered w-full mt-3"
                  value="Create Room"
                />
              </div>
              {error && <p className="text-red-400">{error}</p>}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
