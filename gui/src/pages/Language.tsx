
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Globe, Check } from "lucide-react";
import { useState } from "react";

const languages = [
  { code: "en-US", name: "English (US)", flag: "🇺🇸", popular: true },
  { code: "en-GB", name: "English (UK)", flag: "🇬🇧", popular: true },
  { code: "es-ES", name: "Español (España)", flag: "🇪🇸", popular: true },
  { code: "es-MX", name: "Español (México)", flag: "🇲🇽", popular: true },
  { code: "fr-FR", name: "Français", flag: "🇫🇷", popular: true },
  { code: "de-DE", name: "Deutsch", flag: "🇩🇪", popular: true },
  { code: "it-IT", name: "Italiano", flag: "🇮🇹", popular: true },
  { code: "pt-BR", name: "Português (Brasil)", flag: "🇧🇷", popular: true },
  { code: "ru-RU", name: "Русский", flag: "🇷🇺", popular: false },
  { code: "zh-CN", name: "中文 (简体)", flag: "🇨🇳", popular: true },
  { code: "zh-TW", name: "中文 (繁體)", flag: "🇹🇼", popular: false },
  { code: "ja-JP", name: "日本語", flag: "🇯🇵", popular: true },
  { code: "ko-KR", name: "한국어", flag: "🇰🇷", popular: false },
  { code: "ar-SA", name: "العربية", flag: "🇸🇦", popular: false },
  { code: "hi-IN", name: "हिन्दी", flag: "🇮🇳", popular: false },
  { code: "th-TH", name: "ไทย", flag: "🇹🇭", popular: false },
  { code: "vi-VN", name: "Tiếng Việt",  flag: "🇻🇳", popular: false },
  { code: "nl-NL", name: "Nederlands", flag: "🇳🇱", popular: false },
  { code: "sv-SE", name: "Svenska", flag: "🇸🇪", popular: false },
  { code: "da-DK", name: "Dansk", flag: "🇩🇰", popular: false },
  { code: "no-NO", name: "Norsk", flag: "🇳🇴", popular: false },
  { code: "fi-FI", name: "Suomi", flag: "🇫🇮", popular: false },
  { code: "pl-PL", name: "Polski", flag: "🇵🇱", popular: false },
  { code: "cs-CZ", name: "Čeština", flag: "🇨🇿", popular: false },
  { code: "hu-HU", name: "Magyar", flag: "🇭🇺", popular: false },
  { code: "ro-RO", name: "Română", flag: "🇷🇴", popular: false },
  { code: "tr-TR", name: "Türkçe", flag: "🇹🇷", popular: false },
  { code: "he-IL", name: "עברית", flag: "🇮🇱", popular: false },
  { code: "uk-UA", name: "Українська", flag: "🇺🇦", popular: false }
];

const Language = () => {
  const [selectedLanguage, setSelectedLanguage] = useState("en-US");
  const [searchTerm, setSearchTerm] = useState("");

  const popularLanguages = languages.filter(lang => lang.popular);
  const otherLanguages = languages.filter(lang => !lang.popular);

  const filteredPopular = popularLanguages.filter(lang => 
    lang.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const filteredOther = otherLanguages.filter(lang => 
    lang.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
              {languages.find(lang => lang.code === selectedLanguage)?.flag}
            </span>
            <div>
              <h3 className="text-xl font-semibold">
                {languages.find(lang => lang.code === selectedLanguage)?.name}
              </h3>
              <p className="text-blue-100">
                Code: {selectedLanguage}
              </p>
            </div>
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
        <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white">
          Save Language Settings
        </Button>
      </div>
    </div>
  );
};

export default Language;
