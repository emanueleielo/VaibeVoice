import React, { useState, useEffect, useRef, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Mic, Keyboard } from "lucide-react";
import { useSettings } from "@/hooks/useApi";

const Playground = () => {
  const [text, setText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { settings, loading, error } = useSettings();
  const [recordKey, setRecordKey] = useState("");
  const [startSound, setStartSound] = useState("beep.mp3");
  const [endSound, setEndSound] = useState("stop.mp3");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Initialize settings
  useEffect(() => {
    if (settings) {
      setRecordKey(settings.record_key);
      if (settings.start_sound) {
        setStartSound(settings.start_sound);
      }
      if (settings.end_sound) {
        setEndSound(settings.end_sound);
      }
    }
  }, [settings]);

  // Play sound
  const playSound = (soundFile: string) => {
    if (soundFile === "none") return;

    const audio = new Audio(`/${soundFile}`);
    audio.play().catch(error => {
      console.error("Error playing sound:", error);
    });
  };

  // Handle key down event for recording
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key.toLowerCase() === recordKey.toLowerCase() && !isRecording && !isProcessing) {
      setIsRecording(true);
      // Play start sound
      playSound(startSound);
      // In a real implementation, this would connect to the backend API
      // to start a transcription
    }
  }, [recordKey, isRecording, isProcessing, startSound]);

  // Handle key up event for stopping recording
  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    if (e.key.toLowerCase() === recordKey.toLowerCase() && isRecording) {
      setIsRecording(false);
      setIsProcessing(true);

      // Play end sound
      playSound(endSound);

      // Simulate processing delay
      setTimeout(() => {
        setIsProcessing(false);

        // Get the current cursor position in the textarea
        const textarea = textareaRef.current;
        if (textarea) {
          const cursorPos = textarea.selectionStart;
          const currentText = textarea.value;

          // Sample transcription text (in a real app, this would come from the backend)

          // Insert the transcription at the cursor position
          const newText =
            currentText.substring(0, cursorPos) +
            currentText.substring(cursorPos);

          setText(newText);

        }
      }, 2000);
    }
  }, [recordKey, isRecording, endSound]);

  // Add and remove event listeners
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Playground</h1>
        <p className="text-slate-600 mt-1">Try out the transcription system and see how it works.</p>
      </div>

      {/* How to use section */}
      <Card className="bg-white/80 backdrop-blur-sm border-slate-200">
        <CardHeader>
          <CardTitle className="text-slate-800">How to Use</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-slate-700">
            VaibVoice is an AI-powered transcription system that converts your speech into text and intelligently formats it. 
            Here's how to use it:
          </p>
          <ol className="list-decimal list-inside space-y-2 text-slate-700">
            <li>Place your cursor where you want the transcription to appear</li>
            <li>Press and hold the <span className="font-semibold">{recordKey || "configured"}</span> key</li>
            <li>While holding the key, speak clearly into your microphone</li>
            <li>Release the key when you're finished speaking</li>
            <li>Wait for the system to process your speech</li>
            <li>Your transcription will appear at the cursor position, properly formatted</li>
          </ol>
          <p className="text-slate-700 mt-2">
            <span className="font-semibold">Smart Formatting:</span> VaibVoice will automatically detect the type of content you're dictating 
            (email, message, prompt, etc.) and format it appropriately. For best results, start your dictation with instructions like:
          </p>
          <ul className="list-disc list-inside space-y-1 text-slate-700 ml-4 mt-1">
            <li>"This is an email to my colleague, format it professionally..."</li>
            <li>"Format this as a casual message to my friend..."</li>
            <li>"This is a prompt for an AI system..."</li>
          </ul>
          <p className="text-slate-700 mt-2">
            The AI will understand your instructions, format the content accordingly, and remove the instructions from the final text.
            You can always edit the transcription text directly in the text area if needed.
          </p>
          <p className="text-slate-700 mt-2">
            <span className="font-semibold">Note:</span> The key used for recording can be configured in the Settings page. 
            We recommend using modifier keys like <span className="font-semibold">Control</span>, <span className="font-semibold">Alt</span>, 
            or <span className="font-semibold">Shift</span> for the best experience.
          </p>
        </CardContent>
      </Card>

      {/* Transcription area */}
      <Card className="bg-white/80 backdrop-blur-sm border-slate-200">
        <CardHeader>
          <CardTitle className="text-slate-800">Transcription</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea 
            ref={textareaRef}
            placeholder="Your transcription will appear here..." 
            className="min-h-[200px] text-slate-700"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />

          <div className="flex items-center gap-4">
            {loading ? (
              <div className="flex items-center gap-2 text-slate-600">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading settings...
              </div>
            ) : (
              <div className="flex items-center gap-2 p-2 bg-slate-100 rounded-md">
                <Keyboard className="h-5 w-5 text-slate-600" />
                <span className="text-slate-700">
                  Press and hold <span className="font-semibold">{recordKey || "configured"}</span> key to record
                </span>
              </div>
            )}

            {isRecording && (
              <div className="flex items-center gap-2 text-red-600 animate-pulse">
                <Mic className="h-4 w-4" />
                Recording... (release key to stop)
              </div>
            )}

            {isProcessing && (
              <div className="flex items-center gap-2 text-slate-600">
                <Loader2 className="h-4 w-4 animate-spin" />
                Processing transcription...
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Playground;
