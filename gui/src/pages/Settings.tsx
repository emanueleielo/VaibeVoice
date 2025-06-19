
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Mic, Settings as SettingsIcon, Volume2 } from "lucide-react";
import { useState } from "react";

const Settings = () => {
  const [selectedMicrophone, setSelectedMicrophone] = useState("default");
  const [hotkey, setHotkey] = useState("F2");
  const [startSound, setStartSound] = useState("beep");
  const [endSound, setEndSound] = useState("chime");

  // Mock microphone list - in a real app this would come from navigator.mediaDevices.enumerateDevices()
  const microphones = [
    { id: "default", name: "System Default" },
    { id: "mic1", name: "Built-in Microphone" },
    { id: "mic2", name: "USB Headset Microphone" },
    { id: "mic3", name: "External USB Microphone" }
  ];

  const soundOptions = [
    { id: "beep", name: "Beep" },
    { id: "chime", name: "Chime" },
    { id: "click", name: "Click" },
    { id: "none", name: "No Sound" }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Settings</h1>
        <p className="text-slate-600 mt-1">Configure your transcription preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Audio Settings */}
        <Card className="bg-white/80 backdrop-blur-sm border-slate-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-800">
              <Mic className="w-5 h-5 text-blue-500" />
              Audio Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="microphone" className="text-slate-700">Microphone</Label>
              <Select value={selectedMicrophone} onValueChange={setSelectedMicrophone}>
                <SelectTrigger>
                  <SelectValue placeholder="Select microphone" />
                </SelectTrigger>
                <SelectContent>
                  {microphones.map((mic) => (
                    <SelectItem key={mic.id} value={mic.id}>
                      {mic.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-slate-700">Test Microphone</Label>
              <Button variant="outline" className="w-full hover:bg-blue-50 hover:border-blue-200">
                <Mic className="w-4 h-4 mr-2" />
                Start Audio Test
              </Button>
            </div>
          </CardContent>
        </Card>

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
              <Input
                id="hotkey"
                value={hotkey}
                onChange={(e) => setHotkey(e.target.value)}
                placeholder="Press key combination..."
                className="bg-white/80 backdrop-blur-sm border-slate-200"
              />
              <p className="text-xs text-slate-500">Press the key combination you want to use</p>
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
                <Button size="sm" variant="outline" className="mt-2">
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
                <Button size="sm" variant="outline" className="mt-2">
                  Preview Sound
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Save Settings */}
      <div className="flex justify-end">
        <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white">
          Save Settings
        </Button>
      </div>
    </div>
  );
};

export default Settings;
