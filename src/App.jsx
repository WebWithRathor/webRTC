import React, { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSocket } from "./contexts/Socket";

const App = () => {
  const [data, setData] = useState({
    name: "",
    email: "",
  });
  const navigate = useNavigate();
  const socket = useSocket();
  

  const handleSubmit = useCallback(() => {
    socket.emit('room-join',data);
    navigate("/stream", { state: { data } });
  }, [data]);

  return (
    <div className="">
      <input
        value={data.name}
        onChange={(e) => setData({ ...data, name: e.target.value })}
        type="text"
        placeholder="Name"
      />
      <input
        value={data.email}
        onChange={(e) => setData({ ...data, email: e.target.value })}
        type="email"
        placeholder="Email"
      />
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
};

export default App;
