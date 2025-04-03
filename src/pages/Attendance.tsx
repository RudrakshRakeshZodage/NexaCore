
import { useState, useEffect, useCallback } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, CheckCircle, XCircle, Loader2 } from "lucide-react";

// We'll simulate the campus location
const CAMPUS_LOCATION = {
  latitude: 19.4559,
  longitude: 72.8211,
  name: "VIVA Institute of Technology",
  address: "Shirgaon, Veer Sawarkar road, Tal, East, Chandansar, Virar, Vasai, Maharashtra 401305"
};

// Maximum allowed distance in meters
const MAX_DISTANCE = 5000; // Very permissive to make it work in the demo

const Attendance = () => {
  const { toast } = useToast();
  const [currentLocation, setCurrentLocation] = useState<GeolocationCoordinates | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [attendanceStatus, setAttendanceStatus] = useState<'none' | 'success' | 'error'>('none');
  const [attendanceHistory, setAttendanceHistory] = useState<Array<{
    date: string;
    time: string;
    status: string;
  }>>([
    { date: '2023-12-01', time: '09:15 AM', status: 'Present' },
    { date: '2023-12-02', time: '09:02 AM', status: 'Present' },
    { date: '2023-12-03', time: '09:10 AM', status: 'Present' },
    { date: '2023-12-04', time: '08:55 AM', status: 'Present' },
    { date: '2023-12-05', time: '09:30 AM', status: 'Late' },
  ]);
  const [attendanceMessage, setAttendanceMessage] = useState("");
  const [distance, setDistance] = useState<number | null>(null);
  
  // Function to calculate distance between two points using Haversine formula
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c;
    
    return d; // Distance in meters
  };
  
  // Function to get current location
  const getCurrentLocation = useCallback(() => {
    setIsLoading(true);
    
    // For demo purposes, we'll simulate a location near the campus
    // Comment this section in production and uncomment the actual geolocation code
    const simulatedPosition = {
      coords: {
        latitude: CAMPUS_LOCATION.latitude + (Math.random() * 0.001 - 0.0005),
        longitude: CAMPUS_LOCATION.longitude + (Math.random() * 0.001 - 0.0005),
        accuracy: 10,
        altitude: null,
        altitudeAccuracy: null,
        heading: null,
        speed: null
      }
    };
    
    // Create a proper GeolocationCoordinates object
    const geoCoords: GeolocationCoordinates = {
      latitude: simulatedPosition.coords.latitude,
      longitude: simulatedPosition.coords.longitude,
      accuracy: simulatedPosition.coords.accuracy,
      altitude: null,
      altitudeAccuracy: null,
      heading: null,
      speed: null,
      // Add the required toJSON method
      toJSON: function() {
        return {
          latitude: this.latitude,
          longitude: this.longitude,
          accuracy: this.accuracy,
          altitude: this.altitude,
          altitudeAccuracy: this.altitudeAccuracy,
          heading: this.heading,
          speed: this.speed
        };
      }
    };
    
    setCurrentLocation(geoCoords);
    
    const dist = calculateDistance(
      geoCoords.latitude,
      geoCoords.longitude,
      CAMPUS_LOCATION.latitude,
      CAMPUS_LOCATION.longitude
    );
    
    setDistance(dist);
    setIsLoading(false);
    
    // Uncomment this section for actual geolocation in production
    /*
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation(position.coords);
          
          const dist = calculateDistance(
            position.coords.latitude,
            position.coords.longitude,
            CAMPUS_LOCATION.latitude,
            CAMPUS_LOCATION.longitude
          );
          
          setDistance(dist);
          setIsLoading(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          toast({
            title: "Location Error",
            description: `Could not get your location: ${error.message}`,
            variant: "destructive",
          });
          setIsLoading(false);
        }
      );
    } else {
      toast({
        title: "Geolocation Not Supported",
        description: "Your browser does not support geolocation",
        variant: "destructive",
      });
      setIsLoading(false);
    }
    */
  }, [toast]);
  
  const markAttendance = () => {
    setIsLoading(true);
    
    setTimeout(() => {
      if (!currentLocation) {
        setAttendanceStatus('error');
        setAttendanceMessage("Could not determine your location. Please try again.");
        setIsLoading(false);
        return;
      }
      
      // Always set as present for demo purposes
      setAttendanceStatus('success');
      setAttendanceMessage("Your attendance has been marked successfully!");
      
      const now = new Date();
      const formattedDate = now.toISOString().split('T')[0];
      const formattedTime = now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
      
      setAttendanceHistory(prev => [
        { 
          date: formattedDate, 
          time: formattedTime, 
          status: "Present" 
        },
        ...prev
      ]);
      
      toast({
        title: "Attendance Marked",
        description: "Your attendance has been recorded successfully.",
      });
      
      setIsLoading(false);
    }, 1500);
  };
  
  // Get location when component mounts
  useEffect(() => {
    getCurrentLocation();
  }, [getCurrentLocation]);
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Attendance</h1>
            <p className="text-muted-foreground">Mark your attendance and view your history</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-2 bg-nexacore-blue-dark/50 border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Mark Attendance</CardTitle>
              <CardDescription className="text-white/70">
                Your current location will be verified
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="bg-white/10 p-4 rounded-lg">
                  <div className="flex items-start gap-3">
                    <MapPin className="text-nexacore-teal mt-1" size={20} />
                    <div>
                      <h3 className="font-medium text-white">Campus Location</h3>
                      <p className="text-white/70 text-sm">{CAMPUS_LOCATION.name}</p>
                      <p className="text-white/70 text-sm">{CAMPUS_LOCATION.address}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white/10 p-4 rounded-lg">
                  <div className="flex items-start gap-3">
                    <MapPin className={`mt-1 ${currentLocation ? 'text-nexacore-teal' : 'text-red-400'}`} size={20} />
                    <div>
                      <h3 className="font-medium text-white flex items-center">
                        Your Current Location
                        {isLoading && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
                      </h3>
                      {currentLocation ? (
                        <>
                          <p className="text-white/70 text-sm">
                            Coordinates: {currentLocation.latitude.toFixed(6)}, {currentLocation.longitude.toFixed(6)}
                          </p>
                          {distance !== null && (
                            <p className="text-white/70 text-sm">
                              Distance from campus: {(distance / 1000).toFixed(2)} km
                            </p>
                          )}
                        </>
                      ) : (
                        <p className="text-red-400 text-sm">Location not available</p>
                      )}
                    </div>
                  </div>
                </div>
                
                {attendanceStatus !== 'none' && (
                  <div className={`p-4 rounded-lg ${
                    attendanceStatus === 'success' ? 'bg-green-500/20' : 'bg-red-500/20'
                  }`}>
                    <div className="flex items-start gap-3">
                      {attendanceStatus === 'success' ? (
                        <CheckCircle className="text-green-400 mt-1" size={20} />
                      ) : (
                        <XCircle className="text-red-400 mt-1" size={20} />
                      )}
                      <div>
                        <h3 className={`font-medium ${
                          attendanceStatus === 'success' ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {attendanceStatus === 'success' ? 'Success' : 'Error'}
                        </h3>
                        <p className="text-white/70 text-sm">{attendanceMessage}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button 
                variant="outline" 
                className="border-white/20 text-white hover:bg-white/10"
                onClick={getCurrentLocation}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Refreshing
                  </>
                ) : (
                  <>
                    <MapPin className="mr-2 h-4 w-4" />
                    Refresh Location
                  </>
                )}
              </Button>
              
              <Button 
                className="bg-nexacore-teal text-nexacore-blue-dark hover:bg-nexacore-teal/90"
                onClick={markAttendance}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Mark Attendance
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="bg-nexacore-blue-dark/50 border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Attendance History</CardTitle>
              <CardDescription className="text-white/70">
                Your recent attendance records
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {attendanceHistory.map((entry, index) => (
                  <div key={index} className="flex items-center justify-between bg-white/5 p-3 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col">
                        <span className="text-white text-sm">{entry.date}</span>
                        <span className="text-white/70 text-xs">{entry.time}</span>
                      </div>
                    </div>
                    <Badge 
                      className={`px-2 py-1 ${
                        entry.status === 'Present' 
                          ? 'bg-green-500/20 text-green-400' 
                          : entry.status === 'Late' 
                            ? 'bg-yellow-500/20 text-yellow-400' 
                            : 'bg-red-500/20 text-red-400'
                      }`}
                    >
                      {entry.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Attendance;
