
import React from 'react';
import DashboardLayout from "@/components/DashboardLayout";
import AttendanceTracker from "@/components/AttendanceTracker";
import { motion } from "framer-motion";

const Attendance = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <motion.div 
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Attendance</h1>
            <p className="text-muted-foreground">Mark your daily attendance and view your attendance history.</p>
          </div>
        </motion.div>

        <AttendanceTracker />
      </div>
    </DashboardLayout>
  );
};

export default Attendance;
