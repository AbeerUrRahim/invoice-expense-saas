import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { addExpense } from "./Api";   // ✅ import API

const AddExpenseForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    Title: "",
    Category: "",
    Amount: "",
    ExpenseDate: "",
    Notes: "",
    Action: null,
    PaymentMethod: ""
  });

  const categories = [
    "Office Supplies",
    "Software",
    "Travel",
    "Marketing",
    "Utilities",
    "Equipment",
    "Meals & Entertainment",
    "Professional Services",
    "Insurance",
    "Other"
  ];

  const paymentMethods = ["Cash", "Credit Card", "Bank Transfer", "Cheque", "Other"];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.Category || !formData.Amount || !formData.ExpenseDate || !formData.Title || !formData.PaymentMethod) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      toast({
        title: "Error",
        description: "You must be logged in to add an expense.",
        variant: "destructive",
      });
      return;
    }

    try {
      const result = await addExpense(formData, token);
      if (result?.statusCode == 200) {
        toast({
          title: "Success",
          description: "Expense created successfully!",
        });
        navigate("/Expenses");
      } else if (result?.statusCode === 409) {
        toast({
          title: "Error",
          description: "An expense with the same title already exists.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: result?.message || "Failed to create expense.",
          variant: "destructive",
        });
      }
    } catch (error) {
      if (error.response?.status === 409) {
        toast({
          title: "Error",
          description: "An expense with the same title already exists.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to create expense.",
          variant: "destructive",
        });
      }
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/5 flex items-center justify-center px-3 py-6">
      <div className="w-full max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate("/expenses")} className="self-start">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Expenses
          </Button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Add New Expense</h1>
            <p className="text-muted-foreground text-sm sm:text-base">Record a new business expense</p>
          </div>
        </div>

        {/* Card */}
        <Card className="w-full shadow-lg">
          <CardHeader>
            <CardTitle>Expense Details</CardTitle>
            <CardDescription>Fill in the expense information below</CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="Title">Title *</Label>
                <Input
                  id="Title"
                  placeholder="Enter expense title"
                  value={formData.Title}
                  onChange={(e) => handleInputChange("Title", e.target.value)}
                  required
                />
              </div>

              {/* Category + Payment Method side by side on larger screens */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="Category">Category *</Label>
                  <Select
                    value={formData.Category}
                    onValueChange={(value) => handleInputChange("Category", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select expense category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="PaymentMethod">Payment Method *</Label>
                  <Select
                    value={formData.PaymentMethod}
                    onValueChange={(value) => handleInputChange("PaymentMethod", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                    <SelectContent>
                      {paymentMethods.map((method) => (
                        <SelectItem key={method} value={method}>
                          {method}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Amount + Date side by side */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="Amount">Amount *</Label>
                  <Input
                    id="Amount"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.Amount}
                    onChange={(e) => handleInputChange("Amount", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ExpenseDate">Date *</Label>
                  <Input
                    id="ExpenseDate"
                    type="date"
                    value={formData.ExpenseDate}
                    onChange={(e) => handleInputChange("ExpenseDate", e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <Label htmlFor="Remarks">Remarks / Notes</Label>
                <Textarea
                  id="Remarks"
                  placeholder="Enter expense description or notes"
                  value={formData.Notes}
                  onChange={(e) => handleInputChange("Notes", e.target.value)}
                  rows={4}
                />
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button type="submit" className="flex-1">
                  Add Expense
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/expenses")}
                  className="flex-1 sm:flex-none"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AddExpenseForm;
