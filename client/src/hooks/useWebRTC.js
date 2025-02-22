import { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';

// const socket = io('http://localhost:5000');
const socket = io(import.meta.env.VITE_SIGNALING_SERVER || 'http://localhost:5000');


export const useWebRTC = (roomId) => {
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const peerConnection = useRef(null);

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to signaling server');
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from signaling server');
    });
  }, []);
  const servers = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
      { urls: 'stun:stun2.l.google.com:19302' },
      {
        urls: 'turn:your-turn-server.com', // Add a TURN server here
        username: 'username',
        credential: 'password'
      }
    ]
  };
  const setupPeerConnection = () => {
    peerConnection.current = new RTCPeerConnection(servers);

    // Add local stream tracks to peer connection
    localStream?.getTracks().forEach(track => {
      peerConnection.current.addTrack(track, localStream);
    });

    peerConnection.current.oniceconnectionstatechange = () => {
      console.log('ICE Connection State:', peerConnection.current.iceConnectionState);
    };

    // In useWebRTC hook
    peerConnection.current.onconnectionstatechange = () => {
      console.log('Connection state:', peerConnection.current.connectionState);
    };

    peerConnection.current.onsignalingstatechange = () => {
      console.log('Signaling state:', peerConnection.current.signalingState);
    };

    // Handle remote stream
    peerConnection.current.ontrack = (event) => {
      setRemoteStream(event.streams[0]);
    };

    // In useWebRTC hook
    peerConnection.current.onicecandidateerror = (event) => {
      console.error('ICE candidate error:', event);
    };

    // ICE Candidate handling
    peerConnection.current.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit('candidate', { candidate: event.candidate, roomId });
      }
    };
  };

  const startCall = async () => {
    try {
      // In startCall function
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720 },
        audio: true
      });
      setLocalStream(stream);
      setupPeerConnection();
    } catch (error) {
      console.error('Error accessing media devices:', error);
    }
  };

  useEffect(() => {
    socket.on('offer', async (offer) => {
      if (!peerConnection.current) setupPeerConnection();
      await peerConnection.current.setRemoteDescription(offer);
      const answer = await peerConnection.current.createAnswer();
      await peerConnection.current.setLocalDescription(answer);
      socket.emit('answer', { answer, roomId });
    });

    socket.on('answer', async (answer) => {
      await peerConnection.current.setRemoteDescription(answer);
    });

    socket.on('candidate', async (candidate) => {
      try {
        await peerConnection.current.addIceCandidate(candidate);
      } catch (error) {
        console.error('Error adding ICE candidate:', error);
      }
    });

    return () => {
      socket.off('offer');
      socket.off('answer');
      socket.off('candidate');
    };
  }, []);

  return { localStream, remoteStream, startCall };
};