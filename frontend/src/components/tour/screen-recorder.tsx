"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Monitor, StopCircle } from "lucide-react";

interface ScreenRecorderProps {
  isRecording: boolean;
  onStart: () => void;
  onStop: (videoUrl: string) => void;
}

export function ScreenRecorder({
  isRecording,
  onStart,
  onStop,
}: ScreenRecorderProps) {
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordingInterval, setRecordingInterval] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (recordingInterval) {
        clearInterval(recordingInterval);
      }
      if (mediaRecorder && mediaRecorder.state !== "inactive") {
        mediaRecorder.stop();
      }
    };
  }, [mediaRecorder, recordingInterval]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: false
      });

      const chunks: BlobPart[] = [];
      const recorder = new MediaRecorder(stream);

      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        onStop(url);
        stream.getTracks().forEach(track => track.stop());
        if (recordingInterval) {
          clearInterval(recordingInterval);
          setRecordingInterval(null);
        }
        setRecordingTime(0);
      };

      setMediaRecorder(recorder);
      recorder.start();
      onStart();

      const interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      setRecordingInterval(interval);

    } catch (error) {
      console.error("Failed to start recording:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
      mediaRecorder.stop();
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  return (
    <Button
      variant={isRecording ? "destructive" : "outline"}
      onClick={isRecording ? stopRecording : startRecording}
      className="gap-2"
    >
      {isRecording ? (
        <>
          <StopCircle className="h-4 w-4" />
          Stop Recording ({formatTime(recordingTime)})
        </>
      ) : (
        <>
          <Monitor className="h-4 w-4" />
          Record Screen
        </>
      )}
    </Button>
  );
} 