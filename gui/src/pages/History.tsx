
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Search, Download, Clock, FileText } from "lucide-react";
import { useState } from "react";

// Mock transcription history data
const mockHistory = [
  {
    id: 1,
    timestamp: "2024-06-19 14:30:00",
    audio_path: "/audio/meeting-2024-06-19-1430.wav",
    text: "Today's team meeting covered the quarterly review and upcoming project deadlines. We discussed the client feedback on the new feature implementation and decided to prioritize bug fixes before the next release. The marketing team presented their campaign results showing a 23% increase in user engagement.",
    duration: 325, // seconds
    word_count: 687
  },
  {
    id: 2,
    timestamp: "2024-06-19 11:15:00",
    audio_path: "/audio/client-call-2024-06-19-1115.wav", 
    text: "Client expressed satisfaction with the current progress but requested additional features for the mobile application. They emphasized the importance of user experience optimization and suggested implementing voice commands for accessibility.",
    duration: 180,
    word_count: 298
  },
  {
    id: 3,
    timestamp: "2024-06-18 16:45:00",
    audio_path: "/audio/standup-2024-06-18-1645.wav",
    text: "Daily standup summary: Frontend team completed the user authentication flow, backend team deployed the new API endpoints, and QA team identified three critical issues that need immediate attention. Tomorrow's focus will be on resolving the database connection timeout errors.",
    duration: 145,
    word_count: 420
  },
  {
    id: 4,
    timestamp: "2024-06-18 09:20:00", 
    audio_path: "/audio/brainstorm-2024-06-18-0920.wav",
    text: "Brainstorming session for the new product launch. Ideas discussed include gamification elements, social sharing features, and integration with popular productivity tools. The team agreed to prototype the top three concepts by next week.",
    duration: 892,
    word_count: 1120
  },
  {
    id: 5,
    timestamp: "2024-06-17 13:10:00",
    audio_path: "/audio/interview-2024-06-17-1310.wav", 
    text: "Technical interview with senior developer candidate. Discussed their experience with React, Node.js, and cloud architecture. Candidate demonstrated strong problem-solving skills and showed enthusiasm for our company culture and mission.",
    duration: 1800,
    word_count: 1850
  }
];

const History = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredHistory = mockHistory.filter(item => 
    item.text.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

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
            <p>Export all transcriptions to CSV</p>
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
              <p className="text-xs text-slate-600">Total Records</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transcription List */}
      <div className="space-y-4">
        {filteredHistory.map((transcription) => (
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
                      <p>Export to CSV</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredHistory.length === 0 && searchTerm && (
        <div className="text-center py-12">
          <div className="text-slate-400 mb-2">
            <Search className="w-12 h-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-slate-600">No transcriptions found</h3>
          <p className="text-slate-500">Try adjusting your search terms</p>
        </div>
      )}
    </div>
  );
};

export default History;
