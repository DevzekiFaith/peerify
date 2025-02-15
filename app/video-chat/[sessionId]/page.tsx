"use client"

import { useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import Peer from 'peerjs';
import { useAuthContext } from '@/components/auth/auth-provider';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Mic, MicOff, Video, VideoOff, Phone } from 'lucide-react';

export default function VideoChat() {
  const { sessionId } = useParams();
  const { user } = useAuthContext();
  const [peer, setPeer] = useState<Peer>();
  const [stream, setStream] = useState<MediaStream>();
  const [remoteStream, setRemoteStream] = useState<MediaStream>();
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);
  
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!user) return;

    const initPeer = async () => {
      const newPeer = new Peer(user.uid);
      
      try {
        const userMedia = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true
        });
        setStream(userMedia);
        
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = userMedia;
        }

        newPeer.on('call', (call) => {
          call.answer(userMedia);
          call.on('stream', (remoteStream) => {
            if (remoteVideoRef.current) {
              remoteVideoRef.current.srcObject = remoteStream;
              setRemoteStream(remoteStream);
            }
          });
        });

        setPeer(newPeer);
      } catch (err) {
        console.error('Failed to get media devices:', err);
      }
    };

    initPeer();

    return () => {
      stream?.getTracks().forEach(track => track.stop());
      peer?.destroy();
    };
  }, [user, peer, stream]);

  const toggleAudio = () => {
    if (stream) {
      stream.getAudioTracks().forEach(track => {
        track.enabled = !audioEnabled;
      });
      setAudioEnabled(!audioEnabled);
    }
  };

  const toggleVideo = () => {
    if (stream) {
      stream.getVideoTracks().forEach(track => {
        track.enabled = !videoEnabled;
      });
      setVideoEnabled(!videoEnabled);
    }
  };

  const endCall = () => {
    stream?.getTracks().forEach(track => track.stop());
    peer?.destroy();
    window.close();
  };

  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="p-4">
          <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden">
            <video
              ref={localVideoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-4 left-4 text-white text-sm">
              You
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden">
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-4 left-4 text-white text-sm">
              Remote User
            </div>
          </div>
        </Card>
      </div>

      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2">
        <Card className="p-4">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="icon"
              onClick={toggleAudio}
              className={!audioEnabled ? 'bg-red-500 text-white' : ''}
            >
              {audioEnabled ? <Mic /> : <MicOff />}
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={toggleVideo}
              className={!videoEnabled ? 'bg-red-500 text-white' : ''}
            >
              {videoEnabled ? <Video /> : <VideoOff />}
            </Button>
            <Button
              variant="destructive"
              size="icon"
              onClick={endCall}
            >
              <Phone className="rotate-225" />
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}