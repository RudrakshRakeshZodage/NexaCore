
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { 
  Wallet, 
  CreditCard, 
  DollarSign, 
  BarChart4, 
  PiggyBank, 
  Plus, 
  Scan, 
  Send, 
  Receipt, 
  UserPlus,
  QrCode,
  AlertCircleIcon
} from "lucide-react";

const Finance = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Financial details state
  const [income, setIncome] = useState("");
  const [expenses, setExpenses] = useState<{
    category: string;
    amount: string;
  }[]>([]);
  const [newExpense, setNewExpense] = useState({
    category: "food",
    amount: ""
  });
  const [employmentStatus, setEmploymentStatus] = useState("");
  const [financialGoals, setFinancialGoals] = useState("");
  
  // Payment system state
  const [upiId, setUpiId] = useState("");
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [receiveDialogOpen, setReceiveDialogOpen] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentRecipient, setPaymentRecipient] = useState("");
  const [monthlyLimit, setMonthlyLimit] = useState("");
  
  // Transaction history
  const [transactions, setTransactions] = useState<{
    id: string;
    type: "sent" | "received";
    amount: string;
    party: string;
    timestamp: string;
    status: "success" | "pending" | "failed";
  }[]>([
    {
      id: "tx-001",
      type: "sent",
      amount: "250.00",
      party: "Ahmed Khan",
      timestamp: "2023-07-10T14:32:45",
      status: "success"
    },
    {
      id: "tx-002",
      type: "received",
      amount: "1500.00",
      party: "Mom",
      timestamp: "2023-07-05T09:15:30",
      status: "success"
    },
    {
      id: "tx-003",
      type: "sent",
      amount: "125.50",
      party: "Grocery Store",
      timestamp: "2023-06-28T18:45:12",
      status: "success"
    },
    {
      id: "tx-004",
      type: "sent",
      amount: "75.00",
      party: "Movie Tickets",
      timestamp: "2023-06-25T20:10:05",
      status: "failed"
    }
  ]);
  
  // AI recommendations
  const [recommendations, setRecommendations] = useState({
    budgeting: [
      "Create a 50/30/20 budget: 50% needs, 30% wants, 20% savings",
      "Track your expenses daily using a budgeting app",
      "Cut non-essential subscriptions to save monthly",
      "Plan meals in advance to reduce food expenses"
    ],
    income: [
      "Offer tutoring services in subjects you excel at",
      "Explore freelance opportunities on platforms like Fiverr",
      "Consider part-time work on weekends",
      "Sell unused items online for extra cash"
    ],
    investment: [
      "Start with a small emergency fund in a high-yield savings account",
      "Learn about low-cost index funds for long-term growth",
      "Consider micro-investment apps to begin with small amounts",
      "Explore digital gold or government bonds as safe investment options"
    ],
    savings: [
      "Set up automatic transfers to a separate savings account",
      "Challenge yourself to a no-spend day once a week",
      "Save all unexpected income like gifts or bonuses",
      "Use the 30-day rule before making large purchases"
    ]
  });
  
  // Handle adding a new expense
  const handleAddExpense = () => {
    if (newExpense.amount && Number(newExpense.amount) > 0) {
      setExpenses([...expenses, { ...newExpense }]);
      setNewExpense({
        category: "food",
        amount: ""
      });
    }
  };
  
  // Handle removing an expense
  const handleRemoveExpense = (index: number) => {
    setExpenses(expenses.filter((_, i) => i !== index));
  };
  
  // Calculate total expenses
  const calculateTotalExpenses = () => {
    return expenses.reduce((total, expense) => total + Number(expense.amount), 0).toFixed(2);
  };
  
  // Calculate remaining budget
  const calculateRemainingBudget = () => {
    const totalIncome = Number(income) || 0;
    const totalExpenses = expenses.reduce((total, expense) => total + Number(expense.amount), 0);
    return (totalIncome - totalExpenses).toFixed(2);
  };
  
  // Handle making a payment
  const handleMakePayment = () => {
    if (paymentAmount && paymentRecipient) {
      const newTransaction = {
        id: `tx-${Math.random().toString(36).substring(2, 8)}`,
        type: "sent" as const,
        amount: paymentAmount,
        party: paymentRecipient,
        timestamp: new Date().toISOString(),
        status: "success" as const
      };
      
      setTransactions([newTransaction, ...transactions]);
      setPaymentDialogOpen(false);
      
      // Reset payment form
      setPaymentAmount("");
      setPaymentRecipient("");
      
      toast({
        title: "Payment Successful",
        description: `You sent ${paymentAmount} to ${paymentRecipient}`,
      });
    }
  };
  
  // Handle receiving a payment
  const handleReceivePayment = () => {
    // In a real app, this would generate a payment link or QR code
    setReceiveDialogOpen(false);
    
    toast({
      title: "Payment Request Created",
      description: "Share the QR code or payment link with the sender.",
    });
  };
  
  // Save financial details
  const saveFinancialDetails = () => {
    toast({
      title: "Financial Details Saved",
      description: "Your financial information has been successfully saved.",
    });
  };
  
  // Generate AI recommendations
  const generateRecommendations = () => {
    toast({
      title: "Recommendations Updated",
      description: "AI has analyzed your financial data and updated your recommendations.",
    });
  };
  
  // Transaction status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100";
      case "failed":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100";
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Finance Dashboard</h1>
            <p className="text-muted-foreground">Manage your finances and get personalized recommendations</p>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              onClick={generateRecommendations}
              className="flex items-center gap-2"
            >
              <BarChart4 size={16} />
              Update Recommendations
            </Button>
            <Button onClick={saveFinancialDetails}>Save Financial Data</Button>
          </div>
        </div>
        
        <Tabs defaultValue="budget" className="w-full">
          <TabsList className="grid grid-cols-1 md:grid-cols-3 mb-8">
            <TabsTrigger value="budget">Budget</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="recommendations">AI Recommendations</TabsTrigger>
          </TabsList>
          
          {/* Budget Tab */}
          <TabsContent value="budget" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Income & Employment</CardTitle>
                <CardDescription>
                  Enter your monthly income and employment status
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="income">Monthly Income</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
                      <Input 
                        id="income" 
                        type="number" 
                        placeholder="Enter your monthly income" 
                        className="pl-10"
                        value={income}
                        onChange={(e) => setIncome(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="employmentStatus">Employment Status</Label>
                    <Select value={employmentStatus} onValueChange={setEmploymentStatus}>
                      <SelectTrigger id="employmentStatus">
                        <SelectValue placeholder="Select employment status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="student">Student</SelectItem>
                        <SelectItem value="part_time">Part-Time Employed</SelectItem>
                        <SelectItem value="full_time">Full-Time Employed</SelectItem>
                        <SelectItem value="freelance">Freelancer</SelectItem>
                        <SelectItem value="unemployed">Unemployed</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Expenses</CardTitle>
                <CardDescription>
                  Track your monthly expenses by category
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="expenseCategory">Expense Category</Label>
                    <Select 
                      value={newExpense.category} 
                      onValueChange={(value) => setNewExpense({...newExpense, category: value})}
                    >
                      <SelectTrigger id="expenseCategory">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="food">Food & Groceries</SelectItem>
                        <SelectItem value="rent">Rent & Housing</SelectItem>
                        <SelectItem value="utilities">Utilities</SelectItem>
                        <SelectItem value="transport">Transportation</SelectItem>
                        <SelectItem value="education">Education</SelectItem>
                        <SelectItem value="entertainment">Entertainment</SelectItem>
                        <SelectItem value="health">Healthcare</SelectItem>
                        <SelectItem value="clothing">Clothing</SelectItem>
                        <SelectItem value="misc">Miscellaneous</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="expenseAmount">Amount</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
                      <Input 
                        id="expenseAmount" 
                        type="number" 
                        placeholder="0.00" 
                        className="pl-10"
                        value={newExpense.amount}
                        onChange={(e) => setNewExpense({...newExpense, amount: e.target.value})}
                      />
                    </div>
                  </div>
                </div>
                
                <Button 
                  onClick={handleAddExpense} 
                  size="sm" 
                  className="mt-2 flex items-center gap-2"
                >
                  <Plus size={16} />
                  Add Expense
                </Button>
                
                {expenses.length > 0 ? (
                  <div className="border rounded-md overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Category</TableHead>
                          <TableHead className="text-right">Amount</TableHead>
                          <TableHead className="w-[100px]"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {expenses.map((expense, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">
                              {expense.category.charAt(0).toUpperCase() + expense.category.slice(1)}
                            </TableCell>
                            <TableCell className="text-right">{Number(expense.amount).toFixed(2)}</TableCell>
                            <TableCell>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => handleRemoveExpense(index)}
                                className="h-8 w-8 p-0"
                              >
                                <span className="sr-only">Remove</span>
                                <AlertCircleIcon size={16} />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                        <TableRow>
                          <TableCell className="font-bold">Total</TableCell>
                          <TableCell className="text-right font-bold">{calculateTotalExpenses()}</TableCell>
                          <TableCell></TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No expenses added yet.</p>
                )}
                
                {income && expenses.length > 0 && (
                  <div className="mt-4 p-4 bg-primary/10 rounded-md space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Income:</span>
                      <span>{Number(income).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Expenses:</span>
                      <span>{calculateTotalExpenses()}</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between items-center">
                      <span className="font-medium">Remaining:</span>
                      <span className={`font-bold ${
                        Number(calculateRemainingBudget()) >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                      }`}>
                        {calculateRemainingBudget()}
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Financial Goals</CardTitle>
                <CardDescription>
                  Set your short and long-term financial goals
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="financialGoals">Your Financial Goals</Label>
                  <Textarea 
                    id="financialGoals" 
                    placeholder="E.g. Save for a laptop, create an emergency fund, etc." 
                    value={financialGoals}
                    onChange={(e) => setFinancialGoals(e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Payments Tab */}
          <TabsContent value="payments" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Payment System</CardTitle>
                  <CardDescription>
                    Send and receive payments via UPI
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="upiId">Your UPI ID</Label>
                    <div className="flex gap-2">
                      <Input 
                        id="upiId" 
                        placeholder="yourname@upi" 
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                      />
                      <Button variant="outline" size="icon">
                        <QrCode size={16} />
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Link your UPI ID to make and receive payments
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <Button 
                      onClick={() => setPaymentDialogOpen(true)} 
                      className="flex items-center gap-2"
                    >
                      <Send size={16} />
                      Send Money
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setReceiveDialogOpen(true)} 
                      className="flex items-center gap-2"
                    >
                      <Receipt size={16} />
                      Receive Money
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Payment Limits</CardTitle>
                  <CardDescription>
                    Set monthly spending limits
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="monthlyLimit">Monthly Limit</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
                      <Input 
                        id="monthlyLimit" 
                        type="number" 
                        placeholder="Set a monthly limit" 
                        className="pl-10"
                        value={monthlyLimit}
                        onChange={(e) => setMonthlyLimit(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  {monthlyLimit && transactions.length > 0 && (
                    <div className="space-y-2 mt-4">
                      <div className="flex justify-between text-sm">
                        <span>Spent this month</span>
                        <span>
                          {transactions
                            .filter(tx => tx.type === "sent" && new Date(tx.timestamp).getMonth() === new Date().getMonth())
                            .reduce((sum, tx) => sum + Number(tx.amount), 0).toFixed(2)
                          }
                        </span>
                      </div>
                      
                      <Progress 
                        value={(transactions
                          .filter(tx => tx.type === "sent" && new Date(tx.timestamp).getMonth() === new Date().getMonth())
                          .reduce((sum, tx) => sum + Number(tx.amount), 0) / Number(monthlyLimit)) * 100
                        } 
                        className="h-2"
                      />
                      
                      <p className="text-xs text-muted-foreground">
                        {Number(monthlyLimit) - transactions
                          .filter(tx => tx.type === "sent" && new Date(tx.timestamp).getMonth() === new Date().getMonth())
                          .reduce((sum, tx) => sum + Number(tx.amount), 0) > 0 
                          ? `${(Number(monthlyLimit) - transactions
                              .filter(tx => tx.type === "sent" && new Date(tx.timestamp).getMonth() === new Date().getMonth())
                              .reduce((sum, tx) => sum + Number(tx.amount), 0)).toFixed(2)} remaining this month`
                          : "Monthly limit exceeded"
                        }
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Transaction History</CardTitle>
                <CardDescription>
                  View your recent transactions
                </CardDescription>
              </CardHeader>
              <CardContent>
                {transactions.length > 0 ? (
                  <div className="border rounded-md overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead className="text-right">Amount</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {transactions.map((transaction) => (
                          <TableRow key={transaction.id}>
                            <TableCell>
                              {new Date(transaction.timestamp).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              {transaction.type === "sent" ? `To: ${transaction.party}` : `From: ${transaction.party}`}
                            </TableCell>
                            <TableCell className={`text-right ${
                              transaction.type === "received" ? "text-green-600 dark:text-green-400" : ""
                            }`}>
                              {transaction.type === "received" ? "+" : "-"}{transaction.amount}
                            </TableCell>
                            <TableCell>
                              <Badge className={getStatusColor(transaction.status)}>
                                {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-8">No transactions yet</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* AI Recommendations Tab */}
          <TabsContent value="recommendations" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PiggyBank size={18} />
                    Budgeting Tips
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recommendations.budgeting.map((tip, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <span className="bg-primary/20 text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center mt-0.5">
                          {index + 1}
                        </span>
                        <p>{tip}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Wallet size={18} />
                    Income Generation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recommendations.income.map((tip, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <span className="bg-primary/20 text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center mt-0.5">
                          {index + 1}
                        </span>
                        <p>{tip}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart4 size={18} />
                    Investment Ideas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recommendations.investment.map((tip, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <span className="bg-primary/20 text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center mt-0.5">
                          {index + 1}
                        </span>
                        <p>{tip}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign size={18} />
                    Savings Strategies
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recommendations.savings.map((tip, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <span className="bg-primary/20 text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center mt-0.5">
                          {index + 1}
                        </span>
                        <p>{tip}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Personalized Financial Plan</CardTitle>
                <CardDescription>
                  Get a detailed financial plan based on your data
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <p className="text-sm text-muted-foreground">
                  Our AI can generate a comprehensive financial plan tailored to your specific situation, 
                  including budgeting strategies, saving goals, and investment recommendations.
                </p>
              </CardContent>
              <CardFooter>
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/reports')}
                  className="flex items-center gap-2"
                >
                  <FileTextIcon size={16} />
                  Generate Financial Report
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Send Money Dialog */}
      <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Send Money</DialogTitle>
            <DialogDescription>
              Send money to friends, family, or businesses
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="paymentAmount">Amount</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
                <Input 
                  id="paymentAmount" 
                  type="number" 
                  placeholder="0.00" 
                  className="pl-10"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="paymentRecipient">Recipient</Label>
              <div className="flex gap-2">
                <Input 
                  id="paymentRecipient" 
                  placeholder="Name or UPI ID" 
                  value={paymentRecipient}
                  onChange={(e) => setPaymentRecipient(e.target.value)}
                />
                <Button variant="outline" size="icon">
                  <UserPlus size={16} />
                </Button>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox id="saveRecipient" />
              <label
                htmlFor="saveRecipient"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Save recipient for future payments
              </label>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setPaymentDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleMakePayment} disabled={!paymentAmount || !paymentRecipient}>
              Send Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Receive Money Dialog */}
      <Dialog open={receiveDialogOpen} onOpenChange={setReceiveDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Receive Money</DialogTitle>
            <DialogDescription>
              Generate a payment request link or QR code
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="receiveAmount">Request Amount (Optional)</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
                <Input 
                  id="receiveAmount" 
                  type="number" 
                  placeholder="0.00" 
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="border rounded-md p-4 flex items-center justify-center">
              <div className="w-48 h-48 bg-primary/10 flex items-center justify-center">
                <QrCode size={120} className="text-primary" />
              </div>
            </div>
            
            <div className="flex justify-center">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Scan size={16} />
                Scan to Pay
              </Button>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setReceiveDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleReceivePayment}>
              Create Payment Link
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Finance;
