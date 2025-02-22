// User2.jsx
import { useWebRTC } from '../hooks/useWebRTC';
import { VideoContainer } from '../components/VideoContainer';
import { useEffect } from 'react';

export const User2 = () => {
  const { localStream, remoteStream, startCall } = useWebRTC('test-room'); // Same for User1

  useEffect(() => {
    startCall();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-screen">
        <div className="bg-gray-800 rounded-lg p-2">
          <VideoContainer stream={localStream} isLocal={true} />
        </div>
        <div className="bg-gray-800 rounded-lg p-2">
          <VideoContainer stream={remoteStream} isLocal={false} />
        </div>
      </div>
    </div>
  );
};

// User2.jsx (similar structure with 'room2')