
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, CheckCheck, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

interface AttendanceRecord {
  date: string;
  time: string;
  status: 'present' | 'absent';
}

const AttendanceTracker = () => {
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [todayAttendanceCount, setTodayAttendanceCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  
  const today = new Date().toISOString().split('T')[0];

  // Load saved attendance data from localStorage
  useEffect(() => {
    const savedRecords = localStorage.getItem('attendanceRecords');
    if (savedRecords) {
      const parsedRecords = JSON.parse(savedRecords);
      setAttendanceRecords(parsedRecords);
      
      // Count today's attendance entries
      const todayEntries = parsedRecords.filter((record: AttendanceRecord) => record.date === today);
      setTodayAttendanceCount(todayEntries.length);
    }
  }, [today]);

  // Save attendance data to localStorage when updated
  useEffect(() => {
    if (attendanceRecords.length > 0) {
      localStorage.setItem('attendanceRecords', JSON.stringify(attendanceRecords));
    }
  }, [attendanceRecords]);

  const markAttendance = (status: 'present' | 'absent') => {
    if (todayAttendanceCount >= 2) {
      toast({
        title: "Maximum attempts reached",
        description: "You can only mark attendance twice per day",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const now = new Date();
      const record: AttendanceRecord = {
        date: today,
        time: now.toLocaleTimeString(),
        status,
      };
      
      const newRecords = [record, ...attendanceRecords];
      setAttendanceRecords(newRecords);
      setTodayAttendanceCount(todayAttendanceCount + 1);
      
      toast({
        title: "Attendance recorded",
        description: `You have been marked as ${status} at ${record.time}`,
        variant: status === 'present' ? 'default' : 'destructive',
      });
      
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="bg-nexacore-blue-dark/50 border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Calendar className="mr-2 text-nexacore-teal" size={20} />
              Today's Attendance
            </CardTitle>
            <CardDescription className="text-white/70">
              {today} - Mark your attendance for today
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-6">
            <div className="w-full bg-white/5 p-4 rounded-lg text-center">
              <div className="text-4xl font-bold text-white mb-2">
                {todayAttendanceCount} / 2
              </div>
              <div className="text-white/70">
                Attempts used today ({todayAttendanceCount >= 2 ? "Maximum reached" : "Attempts remaining"})
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 w-full">
              <Button 
                className="bg-green-600 hover:bg-green-700 text-white flex items-center justify-center gap-2"
                onClick={() => markAttendance('present')}
                disabled={loading || todayAttendanceCount >= 2}
              >
                <CheckCheck size={18} />
                Present
              </Button>
              <Button 
                className="bg-red-600 hover:bg-red-700 text-white flex items-center justify-center gap-2"
                onClick={() => markAttendance('absent')}
                disabled={loading || todayAttendanceCount >= 2}
              >
                <AlertCircle size={18} />
                Absent
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="bg-nexacore-blue-dark/50 border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Attendance History</CardTitle>
            <CardDescription className="text-white/70">
              Your recent attendance records
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="max-h-[300px] overflow-y-auto pr-2">
              {attendanceRecords.length > 0 ? (
                <div className="space-y-2">
                  {attendanceRecords.map((record, index) => (
                    <div 
                      key={index} 
                      className={`p-3 rounded-md flex items-center justify-between ${
                        record.status === 'present' ? 'bg-green-600/20' : 'bg-red-600/20'
                      }`}
                    >
                      <div>
                        <div className="font-medium text-white">{record.date}</div>
                        <div className="text-sm text-white/70">Time: {record.time}</div>
                      </div>
                      <div>
                        <span 
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            record.status === 'present' 
                              ? 'bg-green-600 text-white' 
                              : 'bg-red-600 text-white'
                          }`}
                        >
                          {record.status.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-white/50">
                  No attendance records found
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              variant="outline" 
              className="w-full border-white/20 text-white hover:bg-white/10"
              onClick={() => {
                setAttendanceRecords([]);
                setTodayAttendanceCount(0);
                localStorage.removeItem('attendanceRecords');
                toast({
                  title: "History cleared",
                  description: "Your attendance history has been reset",
                });
              }}
              disabled={attendanceRecords.length === 0}
            >
              Clear History
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default AttendanceTracker;
