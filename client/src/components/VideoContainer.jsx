import React, { useRef, useEffect } from 'react';

export const VideoContainer = ({ stream, isLocal }) => {
  const videoRef = useRef();

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
      if (isLocal) {
        videoRef.current.muted = true;
      }
    }
  }, [stream, isLocal]);

  return (
    <video
      ref={videoRef}
      autoPlay
      playsInline
      className={`w-full h-full rounded-lg ${isLocal ? 'mirror' : ''}`}
    />
  );
};