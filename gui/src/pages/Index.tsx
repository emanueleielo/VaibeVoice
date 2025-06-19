
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, FileText, HelpCircle, TrendingUp } from "lucide-react";

// Mock data - in a real app this would come from your transcription database
const mockStats = {
  totalTranscriptions: 1247,
  totalDuration: 342, // in minutes
  totalWords: 45231,
  avgWordsPerMinute: 132,
  todayStats: {
    transcriptions: 7,
    duration: 45, // in minutes
    words: 2340
  },
  recentTranscriptions: [
    { id: 1, text: "Meeting notes for project review...", timestamp: "2 hours ago", duration: 5.2, words: 687 },
    { id: 2, text: "Voice memo about client feedback...", timestamp: "4 hours ago", duration: 2.1, words: 298 },
    { id: 3, text: "Daily standup transcription...", timestamp: "1 day ago", duration: 8.5, words: 1120 },
  ]
};

const Index = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Dashboard</h1>
          <p className="text-slate-600 mt-1">Welcome back! Here's your transcription overview.</p>
        </div>
        <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white">
          <HelpCircle className="w-4 h-4 mr-2" />
          How to Use
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white/80 backdrop-blur-sm border-slate-200 hover:shadow-lg transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Total Transcriptions</CardTitle>
            <FileText className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-800">{mockStats.totalTranscriptions.toLocaleString()}</div>
            <p className="text-xs text-green-600 flex items-center mt-1">
              <TrendingUp className="w-3 h-3 mr-1" />
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-slate-200 hover:shadow-lg transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Total Duration</CardTitle>
            <Clock className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-800">{Math.floor(mockStats.totalDuration / 60)}h {mockStats.totalDuration % 60}m</div>
            <p className="text-xs text-green-600 flex items-center mt-1">
              <TrendingUp className="w-3 h-3 mr-1" />
              +8% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-slate-200 hover:shadow-lg transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Words Transcribed</CardTitle>
            <FileText className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-800">{mockStats.totalWords.toLocaleString()}</div>
            <p className="text-xs text-green-600 flex items-center mt-1">
              <TrendingUp className="w-3 h-3 mr-1" />
              +15% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-slate-200 hover:shadow-lg transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Avg WPM</CardTitle>
            <Clock className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-800">{mockStats.avgWordsPerMinute}</div>
            <p className="text-xs text-slate-500 mt-1">Words per minute</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity & Today's Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white/80 backdrop-blur-sm border-slate-200">
          <CardHeader>
            <CardTitle className="text-slate-800">Recent Transcriptions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {mockStats.recentTranscriptions.map((transcription) => (
              <div key={transcription.id} className="flex items-start justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                <div className="flex-1">
                  <p className="text-sm text-slate-800 font-medium truncate">{transcription.text}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                    <span>{transcription.timestamp}</span>
                    <span>{transcription.duration}min</span>
                    <span>{transcription.words} words</span>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-slate-200">
          <CardHeader>
            <CardTitle className="text-slate-800">Today's Statistics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <div>
                <p className="text-sm text-slate-600">Transcriptions</p>
                <p className="text-2xl font-bold text-slate-800">{mockStats.todayStats.transcriptions}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-500" />
            </div>
            
            <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
              <div>
                <p className="text-sm text-slate-600">Minutes</p>
                <p className="text-2xl font-bold text-slate-800">{mockStats.todayStats.duration}</p>
              </div>
              <Clock className="h-8 w-8 text-purple-500" />
            </div>
            
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <div>
                <p className="text-sm text-slate-600">Words</p>
                <p className="text-2xl font-bold text-slate-800">{mockStats.todayStats.words.toLocaleString()}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
