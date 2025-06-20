
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, FileText, TrendingUp, Loader2, AlertTriangle } from "lucide-react";
import { useStats } from "@/hooks/useApi";
import { useApiKeyStatus } from "@/hooks/useApiKeyStatus";
import { formatDistanceToNow } from 'date-fns';
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Index = () => {
  const { stats, loading, error } = useStats();
  const { isApiKeySet, loading: apiKeyLoading } = useApiKeyStatus();

  // Format timestamp for display
  const formatTimestamp = (timestamp: string) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch (e) {
      return timestamp;
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh]">
        <Loader2 className="h-12 w-12 text-blue-500 animate-spin mb-4" />
        <p className="text-slate-600">Loading dashboard data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh]">
        <div className="bg-red-100 text-red-800 p-4 rounded-lg max-w-md text-center">
          <p className="font-medium">Error loading dashboard data</p>
          <p className="text-sm mt-1">{error}</p>
          <p className="text-sm mt-4">Please make sure the API server is running.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Dashboard</h1>
          <p className="text-slate-600 mt-1">Welcome back! Here's your transcription overview.</p>
        </div>
      </div>

      {/* API Key Warning Banner */}
      {!apiKeyLoading && !isApiKeySet && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="font-medium text-amber-800">OpenAI API Key Required</h3>
            <p className="text-amber-700 text-sm mt-1">
              You need to set your OpenAI API key for the application to function properly. 
              Without an API key, transcription features will be disabled.
            </p>
            <Button 
              asChild
              size="sm" 
              variant="outline" 
              className="mt-2 bg-amber-100 border-amber-200 text-amber-800 hover:bg-amber-200"
            >
              <Link to="/settings">Go to Settings</Link>
            </Button>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white/80 backdrop-blur-sm border-slate-200 hover:shadow-lg transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Total Transcriptions</CardTitle>
            <FileText className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-800">{stats?.totalTranscriptions.toLocaleString() || 0}</div>
            <p className="text-xs text-slate-500 mt-1">All time</p>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-slate-200 hover:shadow-lg transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Total Duration</CardTitle>
            <Clock className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-800">
              {stats ? (
                stats.totalDuration >= 60 
                  ? `${Math.floor(stats.totalDuration / 60)}h ${stats.totalDuration % 60}m` 
                  : `${stats.totalDuration}m`
              ) : '0m'}
            </div>
            <p className="text-xs text-slate-500 mt-1">Recording time</p>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-slate-200 hover:shadow-lg transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Words Transcribed</CardTitle>
            <FileText className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-800">{stats?.totalWords.toLocaleString() || 0}</div>
            <p className="text-xs text-slate-500 mt-1">Total words</p>
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm border-slate-200 hover:shadow-lg transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">Avg WPM</CardTitle>
            <Clock className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-800">{stats?.avgWordsPerMinute || 0}</div>
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
            {stats && stats.recentTranscriptions.length > 0 ? (
              stats.recentTranscriptions.map((transcription) => (
                <div key={transcription.id} className="flex items-start justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                  <div className="flex-1">
                    <p className="text-sm text-slate-800 font-medium truncate">{transcription.text}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                      <span>{formatTimestamp(transcription.timestamp)}</span>
                      <span>{(transcription.duration / 60).toFixed(1)}min</span>
                      <span>{transcription.words} words</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-slate-500">
                <p>No recent transcriptions found</p>
              </div>
            )}
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
                <p className="text-2xl font-bold text-slate-800">{stats?.todayStats.transcriptions || 0}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-500" />
            </div>

            <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
              <div>
                <p className="text-sm text-slate-600">Minutes</p>
                <p className="text-2xl font-bold text-slate-800">{stats?.todayStats.duration || 0}</p>
              </div>
              <Clock className="h-8 w-8 text-purple-500" />
            </div>

            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <div>
                <p className="text-sm text-slate-600">Words</p>
                <p className="text-2xl font-bold text-slate-800">{stats?.todayStats.words.toLocaleString() || 0}</p>
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
