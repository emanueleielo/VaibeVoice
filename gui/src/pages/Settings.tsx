
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Mic, Settings as SettingsIcon, Volume2, Loader2, Eye, EyeOff, AlertTriangle } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useSettings } from "@/hooks/useApi";
import { useToast } from "@/components/ui/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const Settings = () => {
  const [selectedMicrophone, setSelectedMicrophone] = useState("default");
  const [hotkey, setHotkey] = useState("");
  const [startSound, setStartSound] = useState("beep.mp3");
  const [endSound, setEndSound] = useState("stop.mp3");
  const [apiKey, setApiKey] = useState("");
  const [showApiKey, setShowApiKey] = useState(false);
  const [transcriptionModel, setTranscriptionModel] = useState("gpt-4o-transcribe");
  const [llmModel, setLlmModel] = useState("gpt-4o-mini");
  const { settings, loading, error, updateSettings, resetSettings } = useSettings();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [showResetConfirmation, setShowResetConfirmation] = useState(false);
  const startAudioRef = useRef<HTMLAudioElement | null>(null);
  const endAudioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize settings from backend
  useEffect(() => {
    if (settings) {
      setHotkey(settings.record_key);
      if (settings.openai_api_key) {
        setApiKey(settings.openai_api_key);
      }
      if (settings.transcription_model) {
        setTranscriptionModel(settings.transcription_model);
      }
      if (settings.llm_model) {
        setLlmModel(settings.llm_model);
      }
      if (settings.start_sound) {
        setStartSound(settings.start_sound);
      }
      if (settings.end_sound) {
        setEndSound(settings.end_sound);
      }
    }
  }, [settings]);

  // Play sound preview
  const playSound = (soundFile: string) => {
    if (soundFile === "none") return;

    const audio = new Audio(`/${soundFile}`);
    audio.play().catch(error => {
      console.error("Error playing sound:", error);
      toast({
        title: "Error playing sound",
        description: "There was an error playing the sound. Please try again.",
        variant: "destructive",
      });
    });
  };

  // Handle saving settings
  const handleSaveSettings = async () => {
    try {
      setIsSaving(true);
      await updateSettings({ 
        record_key: hotkey,
        openai_api_key: apiKey,
        transcription_model: transcriptionModel,
        llm_model: llmModel,
        start_sound: startSound,
        end_sound: endSound
      });
      toast({
        title: "Settings saved",
        description: "Your settings have been saved successfully.",
      });
      // Refresh the page after successfully saving settings
      window.location.reload();
    } catch (error) {
      toast({
        title: "Error saving settings",
        description: "There was an error saving your settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Handle resetting settings
  const handleResetSettings = async () => {
    try {
      setIsResetting(true);
      await resetSettings();
      toast({
        title: "Settings reset",
        description: "All settings have been reset to default values and all transcriptions have been deleted.",
      });
      // Close the confirmation dialog
      setShowResetConfirmation(false);
      // Refresh the page after successfully resetting settings
      window.location.reload();
    } catch (error) {
      toast({
        title: "Error resetting settings",
        description: "There was an error resetting your settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsResetting(false);
    }
  };

  // Mock microphone list - in a real app this would come from navigator.mediaDevices.enumerateDevices()
  const microphones = [
    { id: "default", name: "System Default" },
    { id: "mic1", name: "Built-in Microphone" },
    { id: "mic2", name: "USB Headset Microphone" },
    { id: "mic3", name: "External USB Microphone" }
  ];

  const soundOptions = [
    { id: "beep.mp3", name: "Beep" },
    { id: "beep 2.mp3", name: "Beep 2" },
    { id: "blip.mp3", name: "Blip" },
    { id: "car_horn.mp3", name: "Car Horn" },
    { id: "digi beep.mp3", name: "Digital Beep" },
    { id: "stop.mp3", name: "Stop" },
    { id: "none", name: "No Sound" }
  ];

  // If there's an error fetching settings, show an error message
  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Settings</h1>
          <p className="text-slate-600 mt-1">Configure your transcription preferences</p>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-lg p-6 flex flex-col items-center justify-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mb-4" />
          <h3 className="text-lg font-medium text-red-800 mb-2">Error Loading Settings</h3>
          <p className="text-red-700 text-center mb-4">{error}</p>
          <p className="text-red-700 text-center mb-6">
            This could be due to the API server being unavailable or an issue with your configuration.
          </p>
          <Button 
            onClick={() => window.location.reload()} 
            className="bg-red-100 hover:bg-red-200 text-red-800 border border-red-300"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  // If still loading, show a loading spinner
  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Settings</h1>
          <p className="text-slate-600 mt-1">Configure your transcription preferences</p>
        </div>

        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-12 w-12 text-blue-500 animate-spin mb-4" />
          <p className="text-slate-600">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Settings</h1>
        <p className="text-slate-600 mt-1">Configure your transcription preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Control Settings */}
        <Card className="bg-white/80 backdrop-blur-sm border-slate-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-800">
              <SettingsIcon className="w-5 h-5 text-purple-500" />
              Control Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="hotkey" className="text-slate-700">Hotkey to Start Recording</Label>
              {loading ? (
                <div className="flex items-center gap-2 h-10 px-3 py-2 border rounded-md border-slate-200 bg-white/80 backdrop-blur-sm">
                  <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
                  <span className="text-slate-400">Loading...</span>
                </div>
              ) : (
                <Input
                  id="hotkey"
                  value={hotkey}
                  readOnly
                  placeholder="Press key combination..."
                  className="bg-white/80 backdrop-blur-sm border-slate-200"
                  onKeyDown={(e) => {
                    e.preventDefault();
                    // Get the key name
                    const keyName = e.key;
                    // Allow any key, including modifier keys
                    setHotkey(keyName);
                  }}
                />
              )}
              <p className="text-xs text-slate-500">Press the key combination you want to use</p>
              <p className="text-xs text-slate-500">This key will be used for press-and-hold recording in the Playground</p>
            </div>

            <div className="space-y-2">
              <Label className="text-slate-700">Recording Mode</Label>
              <Select defaultValue="push-to-talk">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="push-to-talk">Push to Talk</SelectItem>
                  <SelectItem value="voice-activation" disabled>
                    <div className="flex items-center gap-2">
                      Voice Activation
                      <Badge variant="secondary" className="text-xs">Coming Soon</Badge>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* OpenAI Settings */}
        <Card className="bg-white/80 backdrop-blur-sm border-slate-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-800">
              <SettingsIcon className="w-5 h-5 text-blue-500" />
              OpenAI Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="apiKey" className="text-slate-700">OpenAI API Key</Label>
              {loading ? (
                <div className="flex items-center gap-2 h-10 px-3 py-2 border rounded-md border-slate-200 bg-white/80 backdrop-blur-sm">
                  <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
                  <span className="text-slate-400">Loading...</span>
                </div>
              ) : (
                <div className="relative">
                  <Input
                    id="apiKey"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="Enter your OpenAI API key"
                    className="bg-white/80 backdrop-blur-sm border-slate-200 pr-10"
                    type={showApiKey ? "text" : "password"}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 text-slate-400 hover:text-slate-600"
                    onClick={() => setShowApiKey(!showApiKey)}
                  >
                    {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              )}
              <p className="text-xs text-slate-500">
                <a 
                  href="https://help.openai.com/en/articles/4936850-where-do-i-find-my-openai-api-key" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  Where do I find my OpenAI API key?
                </a>
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="transcriptionModel" className="text-slate-700">Transcription Model</Label>
              {loading ? (
                <div className="flex items-center gap-2 h-10 px-3 py-2 border rounded-md border-slate-200 bg-white/80 backdrop-blur-sm">
                  <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
                  <span className="text-slate-400">Loading...</span>
                </div>
              ) : (
                <Select value={transcriptionModel} onValueChange={setTranscriptionModel}>
                  <SelectTrigger id="transcriptionModel">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gpt-4o-transcribe">gpt-4o-transcribe (More accurate, more expensive)</SelectItem>
                    <SelectItem value="gpt-4o-mini-transcribe">gpt-4o-mini-transcribe (Less accurate, faster, less expensive)</SelectItem>
                    <SelectItem value="whisper-1">whisper-1 (Legacy Whisper model)</SelectItem>
                  </SelectContent>
                </Select>
              )}
              <p className="text-xs text-slate-500">Select the model used for audio transcription</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="llmModel" className="text-slate-700">LLM Model</Label>
              {loading ? (
                <div className="flex items-center gap-2 h-10 px-3 py-2 border rounded-md border-slate-200 bg-white/80 backdrop-blur-sm">
                  <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
                  <span className="text-slate-400">Loading...</span>
                </div>
              ) : (
                <Select value={llmModel} onValueChange={setLlmModel}>
                  <SelectTrigger id="llmModel">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gpt-4o-mini">gpt-4o-mini (Faster, less expensive)</SelectItem>
                    <SelectItem value="gpt-4o">gpt-4o (More capable, more expensive)</SelectItem>
                    <SelectItem value="gpt-4.1-nano">gpt-4.1-nano (Balanced performance)</SelectItem>
                    <SelectItem value="gpt-4.1">gpt-4.1 (Most capable, most expensive)</SelectItem>
                  </SelectContent>
                </Select>
              )}
              <p className="text-xs text-slate-500">Select the model used to improve the transcription once completed</p>
            </div>

          </CardContent>
        </Card>

        {/* Sound Settings */}
        <Card className="bg-white/80 backdrop-blur-sm border-slate-200 lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-800">
              <Volume2 className="w-5 h-5 text-green-500" />
              Sound Notifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-slate-700">Recording Start Sound</Label>
                <Select value={startSound} onValueChange={setStartSound}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {soundOptions.map((sound) => (
                      <SelectItem key={sound.id} value={sound.id}>
                        {sound.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="mt-2"
                  onClick={() => playSound(startSound)}
                >
                  Preview Sound
                </Button>
              </div>

              <div className="space-y-2">
                <Label className="text-slate-700">Recording End Sound</Label>
                <Select value={endSound} onValueChange={setEndSound}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {soundOptions.map((sound) => (
                      <SelectItem key={sound.id} value={sound.id}>
                        {sound.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="mt-2"
                  onClick={() => playSound(endSound)}
                >
                  Preview Sound
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Save and Reset Settings */}
      <div className="flex justify-between">
        <Button 
          className="bg-red-600 hover:bg-red-700 text-white"
          onClick={() => setShowResetConfirmation(true)}
          disabled={loading || isSaving || isResetting}
        >
          {isResetting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Resetting...
            </>
          ) : (
            <>
              <AlertTriangle className="w-4 h-4 mr-2" />
              Reset All
            </>
          )}
        </Button>

        <Button 
          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
          onClick={handleSaveSettings}
          disabled={loading || isSaving || isResetting}
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Settings"
          )}
        </Button>
      </div>

      {/* Reset Confirmation Dialog */}
      <AlertDialog open={showResetConfirmation} onOpenChange={setShowResetConfirmation}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-red-600 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Reset All Settings and Data
            </AlertDialogTitle>
            <AlertDialogDescription>
              <p className="mb-2">This action will:</p>
              <ul className="list-disc pl-5 mb-4 space-y-1">
                <li>Reset all settings to their default values</li>
                <li>Delete <strong>ALL</strong> transcriptions from the database</li>
              </ul>
              <p className="font-semibold">This action cannot be undone. Are you sure you want to continue?</p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isResetting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleResetSettings}
              disabled={isResetting}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isResetting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Resetting...
                </>
              ) : (
                "Yes, Reset Everything"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Settings;
