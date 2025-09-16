import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { UpdateExpense, getExpenseById } from "./Api"; // ✅ Expense APIs

const UpdateExpenseForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    id: "",
    expenseNumber: "",
    title: "",
    amount: "",
    category: "",
    paymentMethod: "",
    expenseDate: "",
    notes: "",
    action: "E",
  });

  useEffect(() => {
    const fetchExpense = async () => {
      const token = localStorage.getItem("token");
      if (!token || !id) return;

      try {
        const expense = await getExpenseById(id, token);
        setFormData({
          id: expense.id || "",
          expenseNumber: expense.expenseNumber || "",
          title: expense.title || "",
          amount: expense.amount || "",
          category: expense.category || "",
          paymentMethod: expense.paymentMethod || "",
          expenseDate: expense.expenseDate ? expense.expenseDate.substring(0, 10) : "",
          notes: expense.notes || "",
          action: expense.action || "E",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load expense data.",
          variant: "destructive",
        });
      }
    };
    fetchExpense();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!token) {
      toast({
        title: "Error",
        description: "No authentication token found.",
        variant: "destructive",
      });
      return;
    }

    const payload = { ...formData, action: "E" };

    try {
      const result = await UpdateExpense(payload, token);
      if (result.statusCode == 200) {
        toast({
          title: "Success",
          description: "Expense updated successfully!",
        });
        navigate("/expenses");
      } else {
        toast({
          title: "Error",
          description: result.message || "Update failed",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update expense.",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate("/expenses")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Expenses
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Update Expense</h1>
          <p className="text-muted-foreground">Edit the expense details below</p>
        </div>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Expense Details</CardTitle>
          <CardDescription>Update the expense information</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="expenseNumber">Expense Number *</Label>
              <Input
                id="expenseNumber"
                placeholder="Enter expense number"
                value={formData.expenseNumber}
                onChange={(e) => handleInputChange("expenseNumber", e.target.value)}
                readOnly
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                placeholder="Enter expense title"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Amount *</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.amount}
                onChange={(e) => handleInputChange("amount", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Input
                id="category"
                placeholder="Enter category"
                value={formData.category}
                onChange={(e) => handleInputChange("category", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="paymentMethod">Payment Method *</Label>
              <Input
                id="paymentMethod"
                placeholder="Enter payment method"
                value={formData.paymentMethod}
                onChange={(e) => handleInputChange("paymentMethod", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="expenseDate">Expense Date *</Label>
              <Input
                id="expenseDate"
                type="date"
                value={formData.expenseDate}
                onChange={(e) => handleInputChange("expenseDate", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="remarks">Remarks *</Label>
              <Textarea
                id="remarks"
                placeholder="Enter remarks or notes"
                value={formData.notes}
                onChange={(e) => handleInputChange("notes", e.target.value)}
                rows={4}
                required
              />
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="submit" className="flex-1">
                Update Expense
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/expenses")}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default UpdateExpenseForm;
