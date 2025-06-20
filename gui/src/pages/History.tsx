
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Search, Download, Clock, FileText, Loader2 } from "lucide-react";
import { useState } from "react";
import { useTranscriptions } from "@/hooks/useApi";

const History = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { transcriptions, loading, error } = useTranscriptions();

  const filteredHistory = transcriptions.filter(item => 
    item.text.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.round(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh]">
        <Loader2 className="h-12 w-12 text-blue-500 animate-spin mb-4" />
        <p className="text-slate-600">Loading transcription history...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh]">
        <div className="bg-red-100 text-red-800 p-4 rounded-lg max-w-md text-center">
          <p className="font-medium">Error loading transcription history</p>
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
          <h1 className="text-3xl font-bold text-slate-800">Transcription History</h1>
          <p className="text-slate-600 mt-1">View and manage all your transcription records</p>
        </div>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white">
              <Download className="w-4 h-4 mr-2" />
              Export All
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Coming soon</p>
          </TooltipContent>
        </Tooltip>
      </div>

      {/* Search and Stats - Properly aligned */}
      <div className="flex gap-6 items-stretch">
        <div className="flex-1">
          <div className="relative h-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search transcriptions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/80 backdrop-blur-sm border-slate-200 h-full"
            />
          </div>
        </div>
        <Card className="bg-white/80 backdrop-blur-sm border-slate-200 min-w-[12rem]">
          <CardContent className="py-4 px-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-slate-800">{filteredHistory.length}</div>
              <p className="text-xs text-slate-600">
                {searchTerm ? 'Matching Records' : 'Total Records'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transcription List */}
      <div className="space-y-4">
        {filteredHistory.length > 0 ? (
          filteredHistory.map((transcription) => (
            <Card key={transcription.id} className="bg-white/80 backdrop-blur-sm border-slate-200 hover:shadow-lg transition-all">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg text-slate-800">
                    Transcription #{transcription.id}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      <Clock className="w-3 h-3 mr-1" />
                      {formatDuration(transcription.duration)}
                    </Badge>
                    <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                      <FileText className="w-3 h-3 mr-1" />
                      {transcription.word_count} words
                    </Badge>
                  </div>
                </div>
                <p className="text-sm text-slate-500">{formatDate(transcription.timestamp)}</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <p className="text-slate-700 leading-relaxed">{transcription.text}</p>
                  </div>
                  <div className="flex justify-end">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button size="sm" variant="outline" className="hover:bg-blue-50 hover:border-blue-200">
                          <Download className="w-4 h-4 mr-2" />
                          Export
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Coming soon</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-12 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-lg">
            <div className="text-slate-400 mb-2">
              <FileText className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-slate-600">No transcriptions found</h3>
            {searchTerm ? (
              <p className="text-slate-500">Try adjusting your search terms</p>
            ) : (
              <p className="text-slate-500">Start recording to create transcriptions</p>
            )}
          </div>
        )}
      </div>

    </div>
  );
};

export default History;
