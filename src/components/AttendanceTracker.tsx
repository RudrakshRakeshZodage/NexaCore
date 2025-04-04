
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { Calendar, Clock, UserCheck, AlertCircle } from "lucide-react";

// Types
interface AttendanceRecord {
  id: string;
  timestamp: Date;
  status: 'present' | 'absent' | 'late';
}

const AttendanceTracker: React.FC = () => {
  const { toast } = useToast();
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [attemptsToday, setAttemptsToday] = useState(0);
  const [loading, setLoading] = useState(false);

  // Load records from local storage on component mount
  useEffect(() => {
    const storedRecords = localStorage.getItem('attendanceRecords');
    if (storedRecords) {
      const parsedRecords = JSON.parse(storedRecords).map((record: any) => ({
        ...record,
        timestamp: new Date(record.timestamp)
      }));
      setAttendanceRecords(parsedRecords);
    }
    
    // Check attempts for today
    countAttemptsToday();
  }, []);

  // Count how many attempts were made today
  const countAttemptsToday = () => {
    const today = new Date().toDateString();
    const storedRecords = localStorage.getItem('attendanceRecords');
    
    if (storedRecords) {
      const parsedRecords = JSON.parse(storedRecords);
      const todayAttempts = parsedRecords.filter(
        (record: any) => new Date(record.timestamp).toDateString() === today
      ).length;
      
      setAttemptsToday(todayAttempts);
    }
  };

  // Mark attendance
  const markAttendance = (status: 'present' | 'absent' | 'late') => {
    setLoading(true);
    
    // Check if already marked twice today
    if (attemptsToday >= 2) {
      toast({
        title: "Daily limit reached",
        description: "You've already marked attendance twice today",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }
    
    setTimeout(() => {
      const newRecord: AttendanceRecord = {
        id: Date.now().toString(),
        timestamp: new Date(),
        status,
      };
      
      const updatedRecords = [newRecord, ...attendanceRecords];
      setAttendanceRecords(updatedRecords);
      setAttemptsToday(attemptsToday + 1);
      
      // Save to local storage
      localStorage.setItem('attendanceRecords', JSON.stringify(updatedRecords));
      
      toast({
        title: "Attendance Recorded",
        description: `You've been marked as ${status} for today`,
      });
      
      setLoading(false);
    }, 1000);
  };

  // Format date for display
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  // Format time for display
  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    }).format(date);
  };

  // Get the status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present':
        return 'text-green-500';
      case 'late':
        return 'text-yellow-500';
      case 'absent':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="bg-nexacore-blue-dark/50 border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <UserCheck className="mr-2 text-nexacore-teal" size={20} />
              Mark Attendance
            </CardTitle>
            <CardDescription className="text-white/70">
              Record your attendance for today ({attemptsToday}/2 attempts used)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button 
                className="bg-green-600 hover:bg-green-700 text-white"
                onClick={() => markAttendance('present')}
                disabled={loading || attemptsToday >= 2}
              >
                Mark Present
              </Button>
              <Button 
                className="bg-yellow-600 hover:bg-yellow-700 text-white"
                onClick={() => markAttendance('late')}
                disabled={loading || attemptsToday >= 2}
              >
                Mark Late
              </Button>
              <Button 
                className="bg-red-600 hover:bg-red-700 text-white"
                onClick={() => markAttendance('absent')}
                disabled={loading || attemptsToday >= 2}
              >
                Mark Absent
              </Button>
            </div>
            
            {attemptsToday >= 2 && (
              <div className="mt-4 p-3 bg-red-900/30 border border-red-800/50 rounded-md flex items-center">
                <AlertCircle className="text-red-400 mr-2" size={18} />
                <p className="text-white/90 text-sm">You've reached the maximum attendance attempts for today (2/2).</p>
              </div>
            )}
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
              Your attendance records
            </CardDescription>
          </CardHeader>
          <CardContent>
            {attendanceRecords.length === 0 ? (
              <div className="text-center py-8 text-white/70">
                No attendance records yet
              </div>
            ) : (
              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                {attendanceRecords.map((record) => (
                  <motion.div
                    key={record.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="p-3 bg-white/5 rounded-md flex flex-col sm:flex-row sm:items-center justify-between"
                  >
                    <div className="flex items-center">
                      {record.status === 'present' && <UserCheck className="text-green-500 mr-2" size={18} />}
                      {record.status === 'late' && <Clock className="text-yellow-500 mr-2" size={18} />}
                      {record.status === 'absent' && <AlertCircle className="text-red-500 mr-2" size={18} />}
                      <span className={`capitalize font-medium ${getStatusColor(record.status)}`}>
                        {record.status}
                      </span>
                    </div>
                    
                    <div className="flex items-center mt-2 sm:mt-0">
                      <div className="flex items-center mr-4 text-white/70">
                        <Calendar className="mr-1" size={14} />
                        <span className="text-sm">{formatDate(record.timestamp)}</span>
                      </div>
                      <div className="flex items-center text-white/70">
                        <Clock className="mr-1" size={14} />
                        <span className="text-sm">{formatTime(record.timestamp)}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default AttendanceTracker;
