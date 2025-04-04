
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const LoginSelection = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Welcome to NexaCore</h1>
          <p className="text-gray-600 mt-2">Please select your account type to continue</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="hover:shadow-lg transition-all duration-300">
            <CardHeader className="text-center">
              <CardTitle className="text-xl font-bold">Corporate Employee</CardTitle>
              <CardDescription>
                Access your organization's resources and tools
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <img 
                src="/lovable-uploads/b154ac24-a418-44be-ae17-23e35c7799f8.png" 
                alt="Corporate" 
                className="h-48 object-contain"
              />
            </CardContent>
            <CardFooter className="flex flex-col gap-3">
              <Link to="/login/corporate" className="w-full">
                <Button className="w-full">Login as Corporate Employee</Button>
              </Link>
              <Link to="/signup/corporate" className="w-full">
                <Button variant="outline" className="w-full">Create Corporate Account</Button>
              </Link>
            </CardFooter>
          </Card>
          
          <Card className="hover:shadow-lg transition-all duration-300">
            <CardHeader className="text-center">
              <CardTitle className="text-xl font-bold">Student</CardTitle>
              <CardDescription>
                Access your learning platform and resources
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <img 
                src="/lovable-uploads/b2d57b61-8471-471e-a60e-15490566662d.png" 
                alt="Student" 
                className="h-48 object-contain"
              />
            </CardContent>
            <CardFooter className="flex flex-col gap-3">
              <Link to="/login/student" className="w-full">
                <Button className="w-full">Login as Student</Button>
              </Link>
              <Link to="/signup/student" className="w-full">
                <Button variant="outline" className="w-full">Create Student Account</Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginSelection;
