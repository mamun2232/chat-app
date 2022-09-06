import React, { useEffect, useRef, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { io } from "socket.io-client";
import Moment from "react-moment";
import { MdDeleteForever } from "react-icons/md";
import { AiOutlineSend } from "react-icons/ai";
import { ToastContainer, toast } from "react-toastify";
const Inbox = () => {
  const msgBoxRef = useRef();
  const { RoomName } = useParams();
  const [data, setData] = useState({});
  const [userData, setUserData] = useState({});
  const [message, setMessage] = useState("");
  const [socket, setSocket] = useState();
  const [allMessages, setMessages] = useState([]);
  const [socketMsg, setsocketmsg] = useState([]);
  const location = useLocation();

  useEffect(() => {
    fetch("https://secret-ravine-52133.herokuapp.com/user")
      .then((res) => res.json())
      .then((data) => setMessages(data));
  }, [message, setMessage, socket, socketMsg]);
  useEffect(() => {
    setData(location?.state);
    if (data?.email) {
      fetch(`https://secret-ravine-52133.herokuapp.com/user/${data?.email}`)
        .then((res) => res.json())
        .then((data) => setUserData(data));
    }
  }, [data]);
  const callectTypingMessage = (e) => {
    setMessage(e.target.value);
  };

  const hendelEnter = (e) => (e.keyCode === 13 ? onsabmit() : "");

  useEffect(() => {
    const sockets = io("https://secret-ravine-52133.herokuapp.com");
    setSocket(sockets);
    sockets.on("connect", () => {
      sockets.emit("joinRoom", data?.room);
    });
  }, []);

  useEffect(() => {
    // revice new massage
    const sockets = io("https://secret-ravine-52133.herokuapp.com");
    sockets?.on("getLatestMessage", (newMessage) => {
      // console.log(newMessage);
      // state raka hoise new massage
      setsocketmsg(newMessage);
      msgBoxRef.current.scrollIntoView({ behavior: "smooth" });
      setMessage("");
    });
  }, [socket, allMessages]);

  const onsabmit = () => {
    if (message) {
      const newMessage = { time: new Date(), message, name: data.name };
      // send new message
      socket.emit("newMessage", { newMessage, room: data?.room });
    }
  };

  // message delete
  const messageDeleteHendeler = () => {
    fetch("https://secret-ravine-52133.herokuapp.com/user", {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.deletedCount > 0) {
          toast("All Conversation Deleted");
        }
      });
  };
  return (
    <div className="p-5">
      <div class="card w-full lg:w-1/3 mx-auto   bg-base-100 shadow-xl h-[500px] lg:h-[650px] border mt-10">
        <div className="p-5 flex gap-4 border   justify-between rounded">
          <p>Your {data.room} Chat</p>{" "}
          <p
            onClick={messageDeleteHendeler}
            className="text-2xl text-red-600 cursor-pointer"
          >
            <MdDeleteForever></MdDeleteForever>
          </p>
        </div>
        <div className="h-[600px] p-8 overflow-y-scroll">
          {/* inbox left  */}
          <div className="flex"> </div>
          {allMessages?.map((msg) =>
            data.name === msg.name ? (
              <div className="flex justify-end">
                <div>
                  <div className="px-4 py-2 border bg-[#0C2D48]  rounded-xl mt-3">
                    <small className=" text-slate-300">{msg.name}</small>{" "}
                    <small className="p-0 text-slate-300">
                      <Moment fromNow>{msg.time}</Moment>
                    </small>
                    <p className=" font-normal  text-white">{msg?.message}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex  justify-start">
                {/* inbox right  */}
                <div>
                  <div className="px-5 py-2 border bg-[#050A30] text-white rounded-xl mt-3">
                    <small className="text-slate-300">{msg.name}</small>{" "}
                    <small className="p-0 text-slate-300">
                      <Moment fromNow>{msg.time}</Moment>
                    </small>
                    <p className="font-normal text-white">{msg.message}</p>
                  </div>
                </div>
              </div>
            )
          )}
          <div ref={msgBoxRef}></div>
        </div>

        {/* inbox bottom  */}
        <div className="p-5 flex gap-4 border rounded">
          <input
            value={message}
            onKeyDown={hendelEnter}
            onChange={callectTypingMessage}
            type="text"
            placeholder="Enter Message"
            class="input w-full  input-bordered  "
          />
          <div
            onClick={onsabmit}
            className=" bg-[#0C2D48] flex gap-2 justify-center items-center text-white rounded px-8 w-28"
          >
            <span className="">Send</span>
            <span className="">
              <AiOutlineSend />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Inbox;
