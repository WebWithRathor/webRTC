import React, { useCallback, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useSocket } from "../contexts/Socket";
import { usePeer } from "../contexts/Peer";
import ReactPlayer from "react-player";

const Streaming = () => {
  const location = useLocation();
  const socket = useSocket();
  const data = location.state?.data;
  const {
    peer,
    sendStream,
    remoteStream,
    createOffer,
    getAnswer,
    setRemoteAns,
  } = usePeer();
  console.log(remoteStream);

  const [myStream, setMyStream] = useState(null);

  // Handle joining and making a call
  const handleJoin = useCallback(
    async ({ email }) => {
      const offer = await createOffer();
      socket.emit("call", { email: data.email, offer });
    },
    [createOffer, data, socket]
  );

  // Handle incoming call and answering
  const handleIncomingCall = useCallback(
    async ({ email, offer }) => {
      const answer = await getAnswer(offer);
      socket.emit("answer", { email, answer });
    },
    [getAnswer, socket]
  );

  // Handle received answer
  const handleAnswerReceived = useCallback(
    async ({ email, answer }) => {
      await setRemoteAns(answer);
    },
    [setRemoteAns]
  );

  const handleNegotiation = useCallback(async () => {
    try {
      const offer = await createOffer();
      socket.emit("nego-want", { email: data.email, offer });
    } catch (error) {
      console.error("Error creating offer:", error);
    }
  }, [peer, socket, data.email]);

  const handleNegoIncom = useCallback(
    async ({ offer }) => {
      try {
        const answer = await getAnswer(offer);
        socket.emit("nego-answer", { email: data.email, answer });
      } catch (error) {
        console.error("Error creating answer:", error);
      }
    },
    [peer, socket, data.email]
  );

  const handleFinal = useCallback(async ({ answer }) => {
    await peer.setRemoteDescription(answer);
  }, []);

  // Socket event listeners
  useEffect(() => {
    socket.on("joined", handleJoin);
    socket.on("incoming-call", handleIncomingCall);
    socket.on("answerRecieved", handleAnswerReceived);
    socket.on("nego-incom", handleNegoIncom);
    socket.on("nego-final", handleFinal);
    return () => {
      socket.off("nego-final", handleFinal);
      socket.off("nego-incom", handleNegoIncom);
      socket.off("answerRecieved", handleAnswerReceived);
      socket.off("incoming-call", handleIncomingCall);
      socket.off("joined", handleJoin);
    };
  }, [handleJoin, handleIncomingCall, handleAnswerReceived, socket]);

  // Get user media (audio)
  const getUserMedia = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setMyStream(stream);
    } catch (error) {
      console.error("Error accessing audio stream:", error);
    }
  }, []);

  useEffect(() => {
    peer.addEventListener("negotiationneeded", handleNegotiation);
    return () => {
      peer.removeEventListener("negotiationneeded", handleNegotiation);
    };
  }, []);

  useEffect(() => {
    getUserMedia();
  }, [getUserMedia]);

  return (
    <div className="streaming-container">
      <h1>Streaming Data</h1>
      {data ? (
        <div>
          <p>
            <strong>Name:</strong> {data.name}
          </p>
          <p>
            <strong>Email:</strong> {data.email}
          </p>
          <button onClick={() => sendStream(myStream)}>Send Stream</button>
          <ReactPlayer  playing url={myStream} />
          <ReactPlayer  playing url={remoteStream} />
        </div>
      ) : (
        <p>No data available</p>
      )}
    </div>
  );
};

export default Streaming;
