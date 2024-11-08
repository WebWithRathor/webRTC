import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const peerContext = createContext(null);

export function usePeer() {
  return useContext(peerContext);
}

export const PeerProvider = (props) => {
  const [remoteStream, setRemoteStream] = useState(null);

  // Create a new RTCPeerConnection instance with useMemo
  const peer = useMemo(() => {
    return new RTCPeerConnection();
  }, []);

  const createOffer = useCallback(async () => {
      console.log("Creating offer...");
      const offer = await peer.createOffer();
      await peer.setLocalDescription(new RTCSessionDescription(offer));
      return offer;
  }, [peer]);

  const getAnswer = useCallback(
    async (offer) => {
      await peer.setRemoteDescription(offer);
      const ans = await peer.createAnswer();
      await peer.setLocalDescription(new RTCSessionDescription(ans));
      return ans;
    },
    [peer]
  );

  const setRemoteAns = useCallback(
    async (answer) => {
      await peer.setRemoteDescription(answer);
    },
    [peer]
  );

  const sendStream = useCallback(
    (stream) => {
      const tracks = stream.getTracks();
      tracks.forEach((track) => {
        peer.addTrack(track, stream);
      });
    },
    [peer]
  );

  const trackEvents = useCallback(
    (event) => {
      setRemoteStream(event.streams[0]);
    },
    []
  );

  // Add and remove the track event listener
  useEffect(() => {
    peer.addEventListener("track", trackEvents);

    return () => {
      peer.removeEventListener("track", trackEvents);
    };
  }, [peer, trackEvents]);

  return (
    <peerContext.Provider
      value={{
        peer,
        remoteStream,
        createOffer,
        sendStream,
        getAnswer,
        setRemoteAns,
      }}
    >
      {props.children}
    </peerContext.Provider>
  );
};
