"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Monitor, StopCircle, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
  const [error, setError] = useState<string>("");
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
      setError("");
      setRecordedChunks([]);

      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          cursor: "always",
          displaySurface: "monitor",
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        },
      });

      // Handle stream stop
      stream.getVideoTracks()[0].addEventListener("ended", () => {
        stopRecording();
      });

      const recorder = new MediaRecorder(stream, {
        mimeType: getSupportedMimeType(),
      });

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          setRecordedChunks((prev) => [...prev, event.data]);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(recordedChunks, { type: getSupportedMimeType() });
        const url = URL.createObjectURL(blob);
        onStop(url);
        stream.getTracks().forEach((track) => track.stop());
        if (recordingInterval) {
          clearInterval(recordingInterval);
          setRecordingInterval(null);
        }
        setRecordingTime(0);
      };

      recorder.onerror = (event) => {
        setError("Recording failed: " + event.error);
        stream.getTracks().forEach((track) => track.stop());
      };

      setMediaRecorder(recorder);
      recorder.start(1000); // Collect data every second
      onStart();

      // Start recording timer
      const interval = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
      setRecordingInterval(interval);
    } catch (error) {
      console.error("Error starting screen recording:", error);
      setError("Failed to start recording. Please make sure you have granted screen sharing permissions.");
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

  const getSupportedMimeType = () => {
    const types = [
      "video/webm;codecs=vp9,opus",
      "video/webm;codecs=vp8,opus",
      "video/webm",
    ];

    for (const type of types) {
      if (MediaRecorder.isTypeSupported(type)) {
        return type;
      }
    }

    return "video/webm";
  };

  return (
    <div className="flex flex-col items-start gap-2">
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

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center gap-2 text-sm text-destructive"
          >
            <AlertCircle className="h-4 w-4" />
            {error}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 