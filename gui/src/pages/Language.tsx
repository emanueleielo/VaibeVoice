
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Globe, Check, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useSettings } from "@/hooks/useApi";
import { useToast } from "@/components/ui/use-toast";

const languages = [
  { code: null, name: "Automatic Detection", flag: "🌐", popular: true },
  { code: "en", name: "English", flag: "🇬🇧", popular: true },
  { code: "es", name: "Español", flag: "🇪🇸", popular: true },
  { code: "fr", name: "Français", flag: "🇫🇷", popular: true },
  { code: "de", name: "Deutsch", flag: "🇩🇪", popular: true },
  { code: "it", name: "Italiano", flag: "🇮🇹", popular: true },
  { code: "pt", name: "Português", flag: "🇵🇹", popular: true },
  { code: "ru", name: "Русский", flag: "🇷🇺", popular: true },
  { code: "zh", name: "中文", flag: "🇨🇳", popular: true },
  { code: "ja", name: "日本語", flag: "🇯🇵", popular: true },
  { code: "ko", name: "한국어", flag: "🇰🇷", popular: true },
  { code: "ar", name: "العربية", flag: "🇸🇦", popular: false },
  { code: "hi", name: "हिन्दी", flag: "🇮🇳", popular: false },
  { code: "th", name: "ไทย", flag: "🇹🇭", popular: false },
  { code: "vi", name: "Tiếng Việt", flag: "🇻🇳", popular: false },
  { code: "nl", name: "Nederlands", flag: "🇳🇱", popular: false },
  { code: "sv", name: "Svenska", flag: "🇸🇪", popular: false },
  { code: "da", name: "Dansk", flag: "🇩🇰", popular: false },
  { code: "no", name: "Norsk", flag: "🇳🇴", popular: false },
  { code: "fi", name: "Suomi", flag: "🇫🇮", popular: false },
  { code: "pl", name: "Polski", flag: "🇵🇱", popular: false },
  { code: "cs", name: "Čeština", flag: "🇨🇿", popular: false },
  { code: "hu", name: "Magyar", flag: "🇭🇺", popular: false },
  { code: "ro", name: "Română", flag: "🇷🇴", popular: false },
  { code: "tr", name: "Türkçe", flag: "🇹🇷", popular: false },
  { code: "he", name: "עברית", flag: "🇮🇱", popular: false },
  { code: "uk", name: "Українська", flag: "🇺🇦", popular: false }
];

const Language = () => {
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { settings, loading, error, updateSettings } = useSettings();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  // Initialize settings from backend
  useEffect(() => {
    if (settings && settings.transcription_language !== undefined) {
      setSelectedLanguage(settings.transcription_language);
    }
  }, [settings]);

  const handleSaveSettings = async () => {
    try {
      setIsSaving(true);
      await updateSettings({ 
        ...settings,
        transcription_language: selectedLanguage
      });
      toast({
        title: "Language settings saved",
        description: "Your language settings have been saved successfully.",
      });
    } catch (error) {
      toast({
        title: "Error saving settings",
        description: "There was an error saving your language settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const popularLanguages = languages.filter(lang => lang.popular);
  const otherLanguages = languages.filter(lang => !lang.popular);

  const filteredPopular = popularLanguages.filter(lang => 
    lang.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const filteredOther = otherLanguages.filter(lang => 
    lang.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // If there's an error fetching settings, show an error message
  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Language Settings</h1>
          <p className="text-slate-600 mt-1">Choose your preferred transcription language</p>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-lg p-6 flex flex-col items-center justify-center">
          <div className="text-red-500 mb-4">Error loading settings: {error}</div>
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
          <h1 className="text-3xl font-bold text-slate-800">Language Settings</h1>
          <p className="text-slate-600 mt-1">Choose your preferred transcription language</p>
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
        <h1 className="text-3xl font-bold text-slate-800">Language Settings</h1>
        <p className="text-slate-600 mt-1">Choose your preferred transcription language</p>
      </div>

      {/* Current Selection */}
      <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Globe className="w-5 h-5" />
            Current Language
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <span className="text-3xl">
              {languages.find(lang => lang.code === selectedLanguage)?.flag || "🌐"}
            </span>
            <div>
              <h3 className="text-xl font-semibold">
                {languages.find(lang => lang.code === selectedLanguage)?.name || "Automatic Detection"}
              </h3>
              <p className="text-blue-100">
                {selectedLanguage ? `Code: ${selectedLanguage}` : "Automatic language detection"}
              </p>
            </div>
          </div>
          <div className="mt-4 text-sm text-blue-100">
            {selectedLanguage ? 
              "Using a specific language improves transcription accuracy and reduces latency." :
              "Automatic detection may reduce accuracy and increase latency. It's recommended to set a specific language for better results."
            }
          </div>
        </CardContent>
      </Card>

      {/* Popular Languages */}
      <Card className="bg-white/80 backdrop-blur-sm border-slate-200">
        <CardHeader>
          <CardTitle className="text-slate-800">Popular Languages</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredPopular.map((language) => (
              <Button
                key={language.code}
                variant={selectedLanguage === language.code ? "default" : "outline"}
                className={`justify-start h-auto p-4 ${
                  selectedLanguage === language.code 
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white" 
                    : "hover:bg-blue-50 hover:border-blue-200"
                }`}
                onClick={() => setSelectedLanguage(language.code)}
              >
                <div className="flex items-center gap-3 w-full">
                  <span className="text-2xl">{language.flag}</span>
                  <div className="text-left flex-1">
                    <div className="font-medium">{language.name}</div>
                    <div className="text-xs opacity-70">{language.code}</div>
                  </div>
                  {selectedLanguage === language.code && (
                    <Check className="w-4 h-4 ml-auto" />
                  )}
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* All Languages */}
      <Card className="bg-white/80 backdrop-blur-sm border-slate-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-slate-800">All Languages</CardTitle>
            <Badge variant="secondary" className="bg-slate-100 text-slate-600">
              {otherLanguages.length} languages
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredOther.map((language) => (
              <Button
                key={language.code}
                variant={selectedLanguage === language.code ? "default" : "outline"}
                className={`justify-start h-auto p-4 ${
                  selectedLanguage === language.code 
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white" 
                    : "hover:bg-blue-50 hover:border-blue-200"
                }`}
                onClick={() => setSelectedLanguage(language.code)}
              >
                <div className="flex items-center gap-3 w-full">
                  <span className="text-2xl">{language.flag}</span>
                  <div className="text-left flex-1">
                    <div className="font-medium">{language.name}</div>
                    <div className="text-xs opacity-70">{language.code}</div>
                  </div>
                  {selectedLanguage === language.code && (
                    <Check className="w-4 h-4 ml-auto" />
                  )}
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button 
          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
          onClick={handleSaveSettings}
          disabled={loading || isSaving}
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Language Settings"
          )}
        </Button>
      </div>
    </div>
  );
};

export default Language;
