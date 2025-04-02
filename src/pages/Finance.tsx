
import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { downloadPDFReport } from "@/lib/pdfReportGenerator";
import { PlusCircle, FileText, ChevronRight, CreditCard, BanknoteIcon, ArrowDownUp, Activity } from "lucide-react";
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
  
  // Budget state
  const [monthlyIncome, setMonthlyIncome] = useState("");
  const [savingsTarget, setSavingsTarget] = useState(20);
  const [housingBudget, setHousingBudget] = useState(30);
  const [foodBudget, setFoodBudget] = useState(15);
  const [transportBudget, setTransportBudget] = useState(10);
  const [utilitiesBudget, setUtilitiesBudget] = useState(10);
  const [entertainmentBudget, setEntertainmentBudget] = useState(10);
  const [otherBudget, setOtherBudget] = useState(5);
  
  // Transactions state
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: "tx1",
      date: "2023-10-15",
      amount: 1500,
      description: "Monthly Salary",
      category: "Income",
      type: "income"
    },
    {
      id: "tx2",
      date: "2023-10-16",
      amount: 800,
      description: "Rent Payment",
      category: "Housing",
      type: "expense"
    },
    {
      id: "tx3",
      date: "2023-10-18",
      amount: 120,
      description: "Grocery Shopping",
      category: "Food",
      type: "expense"
    },
    {
      id: "tx4",
      date: "2023-10-20",
      amount: 45.50,
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
      description: `Your payment of $${paymentData.amount} has been recorded.`,
    });
  };

  // Save budget settings
  const handleSaveBudget = () => {
    toast({
      title: "Budget Saved",
      description: "Your budget settings have been saved successfully.",
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
        budget: {
          monthlyIncome,
          savingsTarget,
          categories: {
            housing: housingBudget,
            food: foodBudget,
            transport: transportBudget,
            utilities: utilitiesBudget,
            entertainment: entertainmentBudget,
            other: otherBudget
          }
        },
        transactions,
        goals: financialGoals
      };
      
      await downloadPDFReport(
        financeData, 
        'finance', 
        'NexaCore User', 
        { includeTimestamp: true }
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
            <p className="text-muted-foreground">Manage your finances, budget, and get personalized financial recommendations.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={handleSaveBudget}
            >
              <CreditCard size={16} />
              Save Budget
            </Button>
            <Button 
              className="bg-nexacore-teal text-nexacore-blue-dark hover:bg-nexacore-teal/90 flex items-center gap-2"
              onClick={handleGenerateReport}
            >
              <FileText size={16} />
              Generate Report
            </Button>
          </div>
        </div>

        <Tabs defaultValue="budget" className="w-full">
          <TabsList className="grid grid-cols-4 mb-8">
            <TabsTrigger value="budget">Budget</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="payments">QR Payments</TabsTrigger>
            <TabsTrigger value="goals">Goals</TabsTrigger>
          </TabsList>

          {/* Budget Tab */}
          <TabsContent value="budget" className="space-y-4">
            <Card className="bg-nexacore-blue-dark/50 border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Budget Allocation</CardTitle>
                <CardDescription className="text-white/70">
                  Set your monthly income and allocate your budget
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="monthlyIncome" className="text-white">Monthly Income (USD)</Label>
                  <Input 
                    id="monthlyIncome" 
                    placeholder="Enter your monthly income" 
                    value={monthlyIncome}
                    onChange={(e) => setMonthlyIncome(e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  />
                </div>
                
                <div className="space-y-6 mt-6">
                  <h3 className="text-xl font-semibold text-white">Budget Allocation (%)</h3>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="savingsTarget" className="text-white">Savings</Label>
                        <span className="text-white/70">{savingsTarget}%</span>
                      </div>
                      <Slider 
                        id="savingsTarget"
                        value={[savingsTarget]} 
                        min={0} 
                        max={50} 
                        step={1} 
                        onValueChange={(value) => setSavingsTarget(value[0])}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="housingBudget" className="text-white">Housing</Label>
                        <span className="text-white/70">{housingBudget}%</span>
                      </div>
                      <Slider 
                        id="housingBudget"
                        value={[housingBudget]} 
                        min={0} 
                        max={60} 
                        step={1} 
                        onValueChange={(value) => setHousingBudget(value[0])}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="foodBudget" className="text-white">Food</Label>
                        <span className="text-white/70">{foodBudget}%</span>
                      </div>
                      <Slider 
                        id="foodBudget"
                        value={[foodBudget]} 
                        min={0} 
                        max={30} 
                        step={1} 
                        onValueChange={(value) => setFoodBudget(value[0])}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="transportBudget" className="text-white">Transportation</Label>
                        <span className="text-white/70">{transportBudget}%</span>
                      </div>
                      <Slider 
                        id="transportBudget"
                        value={[transportBudget]} 
                        min={0} 
                        max={30} 
                        step={1} 
                        onValueChange={(value) => setTransportBudget(value[0])}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="utilitiesBudget" className="text-white">Utilities</Label>
                        <span className="text-white/70">{utilitiesBudget}%</span>
                      </div>
                      <Slider 
                        id="utilitiesBudget"
                        value={[utilitiesBudget]} 
                        min={0} 
                        max={30} 
                        step={1} 
                        onValueChange={(value) => setUtilitiesBudget(value[0])}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="entertainmentBudget" className="text-white">Entertainment</Label>
                        <span className="text-white/70">{entertainmentBudget}%</span>
                      </div>
                      <Slider 
                        id="entertainmentBudget"
                        value={[entertainmentBudget]} 
                        min={0} 
                        max={30} 
                        step={1} 
                        onValueChange={(value) => setEntertainmentBudget(value[0])}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="otherBudget" className="text-white">Other</Label>
                        <span className="text-white/70">{otherBudget}%</span>
                      </div>
                      <Slider 
                        id="otherBudget"
                        value={[otherBudget]} 
                        min={0} 
                        max={30} 
                        step={1} 
                        onValueChange={(value) => setOtherBudget(value[0])}
                      />
                    </div>
                  </div>
                  
                  <div className="p-4 bg-white/10 rounded-lg">
                    <h4 className="text-white mb-2">Total Allocation</h4>
                    <div className="flex items-center justify-between">
                      <span className="text-white/80">
                        {savingsTarget + housingBudget + foodBudget + transportBudget + utilitiesBudget + entertainmentBudget + otherBudget}%
                      </span>
                      <span className={`text-${
                        savingsTarget + housingBudget + foodBudget + transportBudget + utilitiesBudget + entertainmentBudget + otherBudget === 100
                          ? "nexacore-teal"
                          : "nexacore-orange"
                      }`}>
                        {savingsTarget + housingBudget + foodBudget + transportBudget + utilitiesBudget + entertainmentBudget + otherBudget === 100
                          ? "Budget balanced!"
                          : "Budget should total 100%"}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

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
                          {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
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
                  <PlusCircle className="h-4 w-4 mr-2" />
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
                <div className="space-y-2">
                  <Label htmlFor="financialGoals" className="text-white">Your Financial Goals</Label>
                  <Textarea 
                    id="financialGoals" 
                    placeholder="Describe your financial goals..." 
                    value={financialGoals}
                    onChange={(e) => setFinancialGoals(e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50 min-h-[100px]"
                  />
                </div>
                
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
