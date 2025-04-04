
import React, { useState, useEffect } from 'react';
import { useToast } from "../hooks/use-toast";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar } from "@/components/ui/calendar";
import DashboardLayout from '@/components/DashboardLayout';
import AttendanceTracker from '@/components/AttendanceTracker';

type Attendance = {
  id: string;
  date: Date;
  status: 'present' | 'absent' | 'late';
  checkInTime?: string;
  checkOutTime?: string;
};

const AttendancePage = () => {
  const { toast } = useToast();
  const [date, setDate] = useState<Date>(new Date());
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [tab, setTab] = useState("overview");

  // Simulated data
  useEffect(() => {
    // This would normally be an API call
    const mockAttendance: Attendance[] = [
      {
        id: '1',
        date: new Date(2025, 3, 1),
        status: 'present',
        checkInTime: '08:45 AM',
        checkOutTime: '05:15 PM'
      },
      {
        id: '2',
        date: new Date(2025, 3, 2),
        status: 'present',
        checkInTime: '09:00 AM',
        checkOutTime: '05:00 PM'
      },
      {
        id: '3',
        date: new Date(2025, 3, 3),
        status: 'late',
        checkInTime: '10:15 AM',
        checkOutTime: '05:30 PM'
      },
      {
        id: '4',
        date: new Date(2025, 3, 4),
        status: 'absent'
      },
      {
        id: '5',
        date: new Date(2025, 3, 5),
        status: 'present',
        checkInTime: '08:50 AM',
        checkOutTime: '05:05 PM'
      }
    ];

    setAttendance(mockAttendance);
  }, []);

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setDate(date);
    }
  };

  const handleCheckIn = () => {
    const now = new Date();
    const formattedTime = now.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existingRecord = attendance.find(record => {
      const recordDate = new Date(record.date);
      recordDate.setHours(0, 0, 0, 0);
      return recordDate.getTime() === today.getTime();
    });

    if (existingRecord && existingRecord.checkInTime) {
      toast({
        title: "Already Checked In",
        description: `You already checked in at ${existingRecord.checkInTime} today.`,
      });
      return;
    }

    const newAttendance = existingRecord
      ? attendance.map(record => {
          if (record.id === existingRecord.id) {
            return {
              ...record,
              status: 'present' as const,
              checkInTime: formattedTime
            };
          }
          return record;
        })
      : [
          ...attendance,
          {
            id: String(attendance.length + 1),
            date: today,
            status: 'present' as const,
            checkInTime: formattedTime
          }
        ];

    setAttendance(newAttendance);
    toast({
      title: "Checked In",
      description: `Successfully checked in at ${formattedTime}`,
    });
  };

  const handleCheckOut = () => {
    const now = new Date();
    const formattedTime = now.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existingRecord = attendance.find(record => {
      const recordDate = new Date(record.date);
      recordDate.setHours(0, 0, 0, 0);
      return recordDate.getTime() === today.getTime();
    });

    if (!existingRecord || !existingRecord.checkInTime) {
      toast({
        title: "Check In Required",
        description: "You need to check in before checking out.",
        variant: "destructive"
      });
      return;
    }

    if (existingRecord.checkOutTime) {
      toast({
        title: "Already Checked Out",
        description: `You already checked out at ${existingRecord.checkOutTime} today.`,
      });
      return;
    }

    const newAttendance = attendance.map(record => {
      if (record.id === existingRecord.id) {
        return {
          ...record,
          checkOutTime: formattedTime
        };
      }
      return record;
    });

    setAttendance(newAttendance);
    toast({
      title: "Checked Out",
      description: `Successfully checked out at ${formattedTime}`,
    });
  };

  const getStats = () => {
    const totalDays = attendance.length;
    const presentDays = attendance.filter(a => a.status === 'present').length;
    const lateDays = attendance.filter(a => a.status === 'late').length;
    const absentDays = attendance.filter(a => a.status === 'absent').length;

    return {
      totalDays,
      presentDays,
      lateDays,
      absentDays,
      presentPercentage: totalDays ? (presentDays / totalDays) * 100 : 0,
      latePercentage: totalDays ? (lateDays / totalDays) * 100 : 0,
      absentPercentage: totalDays ? (absentDays / totalDays) * 100 : 0
    };
  };

  const stats = getStats();

  return (
    <DashboardLayout>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">Attendance Management</h1>
        
        <Tabs defaultValue="overview" onValueChange={setTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="calendar">Calendar</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Present Days</CardTitle>
                  <CardDescription>
                    {stats.presentDays} out of {stats.totalDays} days
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{stats.presentPercentage.toFixed(1)}%</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Late Days</CardTitle>
                  <CardDescription>
                    {stats.lateDays} out of {stats.totalDays} days
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{stats.latePercentage.toFixed(1)}%</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Absent Days</CardTitle>
                  <CardDescription>
                    {stats.absentDays} out of {stats.totalDays} days
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{stats.absentPercentage.toFixed(1)}%</p>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Today's Attendance</CardTitle>
                <CardDescription>
                  {new Date().toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <AttendanceTracker />
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button onClick={handleCheckIn}>Check In</Button>
                <Button onClick={handleCheckOut} variant="outline">Check Out</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Attendance History</CardTitle>
                <CardDescription>
                  Your attendance record for the past days
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableCaption>A list of your attendance records.</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Check In</TableHead>
                      <TableHead>Check Out</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {attendance.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell>{record.date.toLocaleDateString()}</TableCell>
                        <TableCell>
                          <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold
                            ${record.status === 'present' ? 'bg-green-100 text-green-800' : ''}
                            ${record.status === 'late' ? 'bg-yellow-100 text-yellow-800' : ''}
                            ${record.status === 'absent' ? 'bg-red-100 text-red-800' : ''}
                          `}>
                            {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                          </span>
                        </TableCell>
                        <TableCell>{record.checkInTime || '-'}</TableCell>
                        <TableCell>{record.checkOutTime || '-'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="calendar">
            <Card>
              <CardHeader>
                <CardTitle>Attendance Calendar</CardTitle>
                <CardDescription>
                  View your attendance by date
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={handleDateChange}
                  className="rounded-md border"
                />
              </CardContent>
              <CardFooter>
                <div className="w-full">
                  {attendance.find(record => {
                    const recordDate = new Date(record.date);
                    return recordDate.toDateString() === date.toDateString();
                  }) ? (
                    <div>
                      <h3 className="font-medium mb-2">Attendance for {date.toLocaleDateString()}</h3>
                      {(() => {
                        const record = attendance.find(record => {
                          const recordDate = new Date(record.date);
                          return recordDate.toDateString() === date.toDateString();
                        });
                        
                        if (!record) return null;
                        
                        return (
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span>Status:</span>
                              <span className={`font-medium
                                ${record.status === 'present' ? 'text-green-600' : ''}
                                ${record.status === 'late' ? 'text-yellow-600' : ''}
                                ${record.status === 'absent' ? 'text-red-600' : ''}
                              `}>
                                {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                              </span>
                            </div>
                            {record.checkInTime && (
                              <div className="flex justify-between">
                                <span>Check In:</span>
                                <span>{record.checkInTime}</span>
                              </div>
                            )}
                            {record.checkOutTime && (
                              <div className="flex justify-between">
                                <span>Check Out:</span>
                                <span>{record.checkOutTime}</span>
                              </div>
                            )}
                          </div>
                        );
                      })()}
                    </div>
                  ) : (
                    <p className="text-center text-muted-foreground">No attendance record for this date.</p>
                  )}
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default AttendancePage;
