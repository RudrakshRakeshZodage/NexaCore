
import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { MapPin, Clock, Check, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Attendance {
  id: string;
  date: string;
  time: string;
  location: string;
  status: "present" | "absent" | "late";
}

const Attendance = () => {
  const { toast } = useToast();
  const [location, setLocation] = useState<GeolocationCoordinates | null>(null);
  const [locationStatus, setLocationStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [attendanceSubmitted, setAttendanceSubmitted] = useState(false);
  const [attendanceHistory, setAttendanceHistory] = useState<Attendance[]>([]);
  const [isWithinRange, setIsWithinRange] = useState(false);

  // Example campus location (Viva Institute of Technology, Virar coordinates)
  const campusLocation = {
    latitude: 19.4558,
    longitude: 72.8021,
    name: "Viva Institute of Technology, Virar",
    radius: 300, // meters
  };

  // Get user's location when component mounts
  useEffect(() => {
    const storedAttendance = localStorage.getItem("attendance_history");
    if (storedAttendance) {
      setAttendanceHistory(JSON.parse(storedAttendance));
    }
  }, []);

  const checkLocation = () => {
    setLocationStatus("loading");
    
    if (!navigator.geolocation) {
      toast({
        title: "Error",
        description: "Geolocation is not supported by your browser",
        variant: "destructive",
      });
      setLocationStatus("error");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation(position.coords);
        
        // Calculate distance between user and campus
        const distance = calculateDistance(
          position.coords.latitude,
          position.coords.longitude,
          campusLocation.latitude,
          campusLocation.longitude
        );
        
        const withinRange = distance <= campusLocation.radius;
        setIsWithinRange(withinRange);
        
        setLocationStatus("success");
        
        toast({
          title: withinRange ? "Location Verified" : "Outside Campus Range",
          description: withinRange 
            ? `You are within ${Math.round(distance)}m of ${campusLocation.name}` 
            : `You are ${Math.round(distance)}m away from ${campusLocation.name}`,
          variant: withinRange ? "default" : "destructive",
        });
      },
      (error) => {
        console.error(error);
        setLocationStatus("error");
        toast({
          title: "Location Error",
          description: getLocationErrorMessage(error),
          variant: "destructive",
        });
      },
      { enableHighAccuracy: true }
    );
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371e3; // Earth radius in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return distance;
  };

  const getLocationErrorMessage = (error: GeolocationPositionError) => {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        return "You denied the request for geolocation. Please enable location services.";
      case error.POSITION_UNAVAILABLE:
        return "Location information is unavailable. Please try again.";
      case error.TIMEOUT:
        return "The request to get your location timed out. Please try again.";
      default:
        return "An unknown error occurred while retrieving your location.";
    }
  };

  const submitAttendance = () => {
    if (!isWithinRange) {
      toast({
        title: "Cannot Submit Attendance",
        description: "You must be within the campus area to mark attendance",
        variant: "destructive",
      });
      return;
    }

    const now = new Date();
    const newAttendance: Attendance = {
      id: Date.now().toString(),
      date: now.toLocaleDateString(),
      time: now.toLocaleTimeString(),
      location: campusLocation.name,
      status: "present",
    };

    const updatedHistory = [...attendanceHistory, newAttendance];
    setAttendanceHistory(updatedHistory);
    localStorage.setItem("attendance_history", JSON.stringify(updatedHistory));
    
    setAttendanceSubmitted(true);
    
    toast({
      title: "Attendance Submitted",
      description: `Successfully marked present for ${now.toLocaleDateString()}`,
    });
  };

  const resetAttendance = () => {
    setAttendanceSubmitted(false);
    setLocationStatus("idle");
    setLocation(null);
    setIsWithinRange(false);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Attendance</h1>
          <p className="text-muted-foreground">Mark your attendance using GPS location verification.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="bg-nexacore-blue-dark/50 border-white/10 dark:bg-foreground/5 col-span-1 lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-white dark:text-foreground flex items-center gap-2">
                <MapPin className="text-nexacore-teal dark:text-primary" size={20} />
                Location Verification
              </CardTitle>
              <CardDescription className="text-white/70 dark:text-muted-foreground">
                Use your device's GPS to verify your location for attendance
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="bg-white/10 dark:bg-foreground/10 rounded-lg p-4">
                <h3 className="text-lg font-medium text-white dark:text-foreground mb-2">Campus Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-white/70 dark:text-muted-foreground">Name:</p>
                    <p className="text-white dark:text-foreground font-medium">{campusLocation.name}</p>
                  </div>
                  <div>
                    <p className="text-white/70 dark:text-muted-foreground">Attendance Radius:</p>
                    <p className="text-white dark:text-foreground font-medium">{campusLocation.radius} meters</p>
                  </div>
                </div>
              </div>
              
              {!attendanceSubmitted ? (
                <div className="space-y-4">
                  <div className="flex flex-col items-center justify-center p-6 border border-dashed border-white/20 dark:border-border rounded-lg">
                    {locationStatus === "idle" && (
                      <div className="text-center">
                        <MapPin className="w-12 h-12 text-nexacore-teal/50 dark:text-primary/50 mx-auto mb-4" />
                        <p className="text-white/80 dark:text-foreground/80 mb-4">
                          Click the button below to verify your location
                        </p>
                        <Button 
                          onClick={checkLocation}
                          className="bg-nexacore-teal text-nexacore-blue-dark hover:bg-nexacore-teal/90 dark:bg-primary dark:text-primary-foreground dark:hover:bg-primary/90"
                        >
                          <MapPin className="w-4 h-4 mr-2" />
                          Check Location
                        </Button>
                      </div>
                    )}
                    
                    {locationStatus === "loading" && (
                      <div className="text-center">
                        <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] text-nexacore-teal dark:text-primary motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
                          <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
                        </div>
                        <p className="text-white/80 dark:text-foreground/80 mt-4">Getting your location...</p>
                      </div>
                    )}
                    
                    {locationStatus === "success" && (
                      <div className="text-center">
                        {isWithinRange ? (
                          <>
                            <Check className="w-12 h-12 text-green-500 mx-auto mb-4" />
                            <p className="text-white dark:text-foreground font-medium mb-2">
                              Location Verified!
                            </p>
                            <p className="text-white/80 dark:text-foreground/80 mb-4">
                              You are within range of {campusLocation.name}
                            </p>
                            <Button 
                              onClick={submitAttendance}
                              className="bg-green-500 text-white hover:bg-green-600"
                            >
                              <Check className="w-4 h-4 mr-2" />
                              Submit Attendance
                            </Button>
                          </>
                        ) : (
                          <>
                            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                            <p className="text-white dark:text-foreground font-medium mb-2">
                              Outside of Campus Range
                            </p>
                            <p className="text-white/80 dark:text-foreground/80 mb-4">
                              You must be within {campusLocation.radius} meters of {campusLocation.name}
                            </p>
                            <div className="flex gap-3">
                              <Button variant="outline" onClick={resetAttendance}>
                                Reset
                              </Button>
                              <Button 
                                onClick={checkLocation}
                                className="bg-nexacore-teal text-nexacore-blue-dark hover:bg-nexacore-teal/90 dark:bg-primary dark:text-primary-foreground dark:hover:bg-primary/90"
                              >
                                <MapPin className="w-4 h-4 mr-2" />
                                Check Again
                              </Button>
                            </div>
                          </>
                        )}
                      </div>
                    )}
                    
                    {locationStatus === "error" && (
                      <div className="text-center">
                        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                        <p className="text-white dark:text-foreground font-medium mb-2">
                          Location Error
                        </p>
                        <p className="text-white/80 dark:text-foreground/80 mb-4">
                          Could not access your location. Please check your permissions.
                        </p>
                        <Button 
                          onClick={checkLocation}
                          className="bg-nexacore-teal text-nexacore-blue-dark hover:bg-nexacore-teal/90 dark:bg-primary dark:text-primary-foreground dark:hover:bg-primary/90"
                        >
                          Try Again
                        </Button>
                      </div>
                    )}
                  </div>
                  
                  {location && (
                    <div className="bg-white/10 dark:bg-foreground/10 rounded-lg p-4">
                      <h3 className="text-lg font-medium text-white dark:text-foreground mb-2">Your Location</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-white/70 dark:text-muted-foreground">Latitude:</p>
                          <p className="text-white font-mono dark:text-foreground">{location.latitude.toFixed(6)}</p>
                        </div>
                        <div>
                          <p className="text-white/70 dark:text-muted-foreground">Longitude:</p>
                          <p className="text-white font-mono dark:text-foreground">{location.longitude.toFixed(6)}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center p-6 border border-dashed border-green-500/30 rounded-lg bg-green-500/10">
                  <Check className="w-12 h-12 text-green-500 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-white dark:text-foreground mb-2">Attendance Submitted!</h3>
                  <p className="text-white/80 dark:text-foreground/80 mb-4">
                    Your attendance has been successfully recorded for today.
                  </p>
                  <Button 
                    variant="outline"
                    className="border-white/20 text-white hover:bg-white/10 dark:border-foreground/20 dark:text-foreground dark:hover:bg-foreground/10"
                    onClick={resetAttendance}
                  >
                    Mark Another Attendance
                  </Button>
                </div>
              )}
            </CardContent>
            
            <CardFooter>
              <p className="text-xs text-white/50 dark:text-muted-foreground">
                Your location data is used only for attendance verification and is not stored or shared.
              </p>
            </CardFooter>
          </Card>
          
          <Card className="bg-nexacore-blue-dark/50 border-white/10 dark:bg-foreground/5">
            <CardHeader>
              <CardTitle className="text-white dark:text-foreground flex items-center gap-2">
                <Clock className="text-nexacore-teal dark:text-primary" size={20} />
                Attendance History
              </CardTitle>
              <CardDescription className="text-white/70 dark:text-muted-foreground">
                Your recent attendance records
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              {attendanceHistory.length > 0 ? (
                <div className="space-y-3">
                  {attendanceHistory.slice().reverse().slice(0, 5).map((record) => (
                    <div 
                      key={record.id} 
                      className="flex items-center justify-between p-3 bg-white/10 dark:bg-foreground/10 rounded-lg"
                    >
                      <div>
                        <p className="text-white font-medium dark:text-foreground">{record.date}</p>
                        <p className="text-white/70 text-sm dark:text-muted-foreground">{record.time}</p>
                      </div>
                      <Badge
                        className={
                          record.status === "present" 
                            ? "bg-green-500/20 text-green-500 hover:bg-green-500/30" 
                            : record.status === "late"
                            ? "bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/30"
                            : "bg-red-500/20 text-red-500 hover:bg-red-500/30"
                        }
                      >
                        {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 border border-dashed border-white/20 dark:border-foreground/20 rounded-lg">
                  <Clock className="w-10 h-10 text-white/30 dark:text-foreground/30 mx-auto mb-3" />
                  <p className="text-white/60 dark:text-foreground/60">No attendance records yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Attendance;
