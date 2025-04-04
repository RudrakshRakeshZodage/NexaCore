
import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { downloadPDFReport } from "@/lib/pdfReportGenerator";
import { IndianRupee, FileText, ChevronRight, CreditCard, BanknoteIcon, ArrowDownUp, Activity } from "lucide-react";
import QRCodePayment from "@/components/QRCodePayment";

interface Transaction {
  id: string;
  date: string;
  amount: number;
  description: string;
  category: string;
  type: 'income' | 'expense';
}

const Finance = () => {
  const { toast } = useToast();
  
  // Transactions state
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: "tx1",
      date: "2023-10-15",
      amount: 75000,
      description: "Monthly Salary",
      category: "Income",
      type: "income"
    },
    {
      id: "tx2",
      date: "2023-10-16",
      amount: 40000,
      description: "Rent Payment",
      category: "Housing",
      type: "expense"
    },
    {
      id: "tx3",
      date: "2023-10-18",
      amount: 6000,
      description: "Grocery Shopping",
      category: "Food",
      type: "expense"
    },
    {
      id: "tx4",
      date: "2023-10-20",
      amount: 2250,
      description: "Gas Station",
      category: "Transportation",
      type: "expense"
    }
  ]);

  // Goals state
  const [financialGoals, setFinancialGoals] = useState("");
  
  // Handle new payment from QR code
  const handlePaymentComplete = (paymentData: any) => {
    const newTransaction: Transaction = {
      id: `tx${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      amount: paymentData.amount,
      description: `QR Payment - ${paymentData.purpose}`,
      category: "Payment",
      type: "expense"
    };
    
    setTransactions([newTransaction, ...transactions]);
    
    toast({
      title: "Payment Added",
      description: `Your payment of ₹${paymentData.amount} has been recorded.`,
    });
  };

  // Generate finance report
  const handleGenerateReport = async () => {
    try {
      toast({
        title: "Generating Report",
        description: "Please wait while we create your finance report...",
      });
      
      const financeData = {
        transactions,
        goals: financialGoals
      };
      
      await downloadPDFReport(
        financeData, 
        'finance', 
        'NexaCore User'
      );
      
      toast({
        title: "Report Downloaded",
        description: "Your finance report has been generated and downloaded",
      });
    } catch (error) {
      console.error("Error generating report:", error);
      toast({
        title: "Report Error",
        description: "Failed to generate finance report",
        variant: "destructive",
      });
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Finance</h1>
            <p className="text-muted-foreground">Manage your finances and get personalized financial recommendations.</p>
          </div>
          <Button 
            className="bg-nexacore-teal text-nexacore-blue-dark hover:bg-nexacore-teal/90 flex items-center gap-2"
            onClick={handleGenerateReport}
          >
            <FileText size={16} />
            Generate Report
          </Button>
        </div>

        <Tabs defaultValue="transactions" className="w-full">
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="payments">QR Payments</TabsTrigger>
            <TabsTrigger value="goals">Goals</TabsTrigger>
          </TabsList>

          {/* Transactions Tab */}
          <TabsContent value="transactions" className="space-y-4">
            <Card className="bg-nexacore-blue-dark/50 border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <ArrowDownUp className="mr-2 text-nexacore-teal" size={20} />
                  Transaction History
                </CardTitle>
                <CardDescription className="text-white/70">
                  View and manage your recent financial transactions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {transactions.length > 0 ? (
                    transactions.map((transaction) => (
                      <div 
                        key={transaction.id} 
                        className="flex items-center justify-between p-3 rounded-lg bg-white/10"
                      >
                        <div className="flex items-center">
                          <div className={`h-10 w-10 rounded-full flex items-center justify-center mr-3 ${
                            transaction.type === 'income' ? 'bg-green-500/20' : 'bg-red-500/20'
                          }`}>
                            {transaction.type === 'income' ? (
                              <BanknoteIcon className="h-5 w-5 text-green-400" />
                            ) : (
                              <CreditCard className="h-5 w-5 text-red-400" />
                            )}
                          </div>
                          <div>
                            <p className="text-white font-medium">{transaction.description}</p>
                            <p className="text-white/60 text-sm">{transaction.date} • {transaction.category}</p>
                          </div>
                        </div>
                        <div className={`font-medium ${
                          transaction.type === 'income' ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {transaction.type === 'income' ? '+' : '-'}₹{transaction.amount.toFixed(2)}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-10 text-white/60">
                      <Activity className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p>No transactions found</p>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                  View All
                </Button>
                <Button className="bg-nexacore-teal text-nexacore-blue-dark hover:bg-nexacore-teal/90">
                  <IndianRupee className="h-4 w-4 mr-2" />
                  Add Transaction
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* QR Payments Tab */}
          <TabsContent value="payments" className="space-y-4">
            <QRCodePayment onPaymentComplete={handlePaymentComplete} />
          </TabsContent>

          {/* Goals Tab */}
          <TabsContent value="goals" className="space-y-4">
            <Card className="bg-nexacore-blue-dark/50 border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Financial Goals</CardTitle>
                <CardDescription className="text-white/70">
                  Set and track your financial goals
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="mt-4">
                  <h3 className="text-lg font-semibold text-white mb-3">AI-Suggested Goals</h3>
                  
                  <div className="space-y-3">
                    {[
                      {
                        title: "Emergency Fund",
                        description: "Save 3-6 months of expenses for emergencies.",
                        timeframe: "6-12 months"
                      },
                      {
                        title: "Debt Reduction",
                        description: "Pay off high-interest debt like credit cards.",
                        timeframe: "12-18 months"
                      },
                      {
                        title: "Retirement Planning",
                        description: "Contribute to retirement accounts regularly.",
                        timeframe: "Ongoing"
                      }
                    ].map((goal, index) => (
                      <div key={index} className="p-3 rounded-lg bg-white/10">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="text-white font-medium">{goal.title}</h4>
                            <p className="text-white/70 text-sm">{goal.description}</p>
                          </div>
                          <div className="text-nexacore-teal text-sm">
                            {goal.timeframe}
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" className="mt-2 text-white/70 hover:text-white">
                          Add to Goals
                          <ChevronRight className="ml-1 h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Finance;
