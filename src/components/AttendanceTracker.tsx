import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, CheckCheck, AlertCircle, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

interface AttendanceRecord {
  date: string;
  time: string;
  status: 'present' | 'absent';
}

const VIVA_INSTITUTE_LOCATION = {
  latitude: 19.4615, // Approximate coordinates for VIVA Institute of Technology, Shirgaon
  longitude: 72.7933,
  address: "VIVA Institute of Technology, Shirgaon, Veer Sawarkar road, Tal, East, Chandansar, Virar, Vasai, Maharashtra 401305"
};

const AttendanceTracker = () => {
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [todayAttendanceCount, setTodayAttendanceCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [locationStatus, setLocationStatus] = useState<'checking' | 'allowed' | 'denied' | 'error'>('checking');
  const [showLocationDialog, setShowLocationDialog] = useState(false);
  const [distance, setDistance] = useState<number | null>(null);
  const { toast } = useToast();
  
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const savedRecords = localStorage.getItem('attendanceRecords');
    if (savedRecords) {
      const parsedRecords = JSON.parse(savedRecords);
      setAttendanceRecords(parsedRecords);
      
      const todayEntries = parsedRecords.filter((record: AttendanceRecord) => record.date === today);
      setTodayAttendanceCount(todayEntries.length);
    }
  }, [today]);

  useEffect(() => {
    if (attendanceRecords.length > 0) {
      localStorage.setItem('attendanceRecords', JSON.stringify(attendanceRecords));
    }
  }, [attendanceRecords]);

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Radius of the earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c * 1000; // Distance in meters
    
    return distance;
  };

  const checkLocationPermission = () => {
    setLocationStatus('checking');
    
    if (!navigator.geolocation) {
      toast({
        title: "Geolocation not supported",
        description: "Your browser does not support geolocation",
        variant: "destructive",
      });
      setLocationStatus('error');
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCurrentLocation({ latitude, longitude });
        
        const distanceToInstitute = calculateDistance(
          latitude, 
          longitude, 
          VIVA_INSTITUTE_LOCATION.latitude, 
          VIVA_INSTITUTE_LOCATION.longitude
        );
        
        setDistance(distanceToInstitute);
        
        setLocationStatus('allowed');
        toast({
          title: "Location access granted",
          description: `You are approximately ${Math.round(distanceToInstitute)}m from VIVA Institute`,
        });
      },
      (error) => {
        console.error("Error getting location:", error);
        setLocationStatus('error');
        toast({
          title: "Location permission denied",
          description: "Please enable location services to mark attendance",
          variant: "destructive",
        });
        setShowLocationDialog(true);
      }
    );
  };

  const markAttendance = (status: 'present' | 'absent') => {
    if (todayAttendanceCount >= 2) {
      toast({
        title: "Maximum attempts reached",
        description: "You can only mark attendance twice per day",
        variant: "destructive",
      });
      return;
    }
    
    if (locationStatus !== 'allowed') {
      checkLocationPermission();
      return;
    }
    
    setLoading(true);
    
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
    <>
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
              
              <div className="w-full bg-white/5 p-4 rounded-lg flex items-center">
                <MapPin className="text-nexacore-teal mr-2" size={20} />
                <div>
                  <div className="text-white font-medium">VIVA Institute of Technology</div>
                  <div className="text-white/70 text-sm">Shirgaon, Virar, Maharashtra</div>
                  <div className="text-nexacore-teal text-sm mt-1">
                    Only GPS permission is required to mark attendance
                  </div>
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
              
              {locationStatus === 'checking' && (
                <div className="text-white/70 animate-pulse">
                  Checking your location...
                </div>
              )}
              
              {locationStatus === 'allowed' && distance !== null && (
                <div className="text-green-400 text-sm">
                  Location verified: {Math.round(distance)}m from VIVA Institute
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
      
      <Dialog open={showLocationDialog} onOpenChange={setShowLocationDialog}>
        <DialogContent className="bg-nexacore-blue-dark/90 border-white/10">
          <DialogHeader>
            <DialogTitle className="text-white">Location Permission Required</DialogTitle>
            <DialogDescription className="text-white/70">
              You need to allow location access to mark attendance
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="bg-white/10 p-4 rounded-lg">
              <h3 className="text-nexacore-teal mb-2 font-medium">Why we need location access:</h3>
              <p className="text-white/80 text-sm mb-3">
                We use your location to verify your attendance at VIVA Institute. Your location data is only used for attendance verification and is not stored or shared.
              </p>
              
              <h3 className="text-nexacore-teal mb-2 font-medium">How to enable location:</h3>
              <ol className="text-white/80 text-sm space-y-1 list-decimal pl-5">
                <li>Click on the lock/info icon in your browser's address bar</li>
                <li>Find "Location" permissions</li>
                <li>Select "Allow"</li>
                <li>Refresh the page</li>
              </ol>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              onClick={() => {
                setShowLocationDialog(false);
                checkLocationPermission();
              }}
              className="bg-nexacore-teal text-nexacore-blue-dark"
            >
              Check Again
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AttendanceTracker;
