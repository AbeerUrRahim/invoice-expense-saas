import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { addInvoice } from "./Api";

const AddInvoiceForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    Title: "",
    Amount: "",
    CustomerName: "",
    InvoiceDate: "",
    Remarks: "",
    Action: null, // backend expects this, keep null
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.Title || !formData.Amount || !formData.CustomerName || !formData.InvoiceDate || !formData.Remarks) {
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
        description: "You must be logged in to add an invoice.",
        variant: "destructive",
      });
      return;
    }

    try {
      const result = await addInvoice({ ...formData, Action: null }, token);
      toast({
        title: "Success",
        description: "Invoice created successfully!",
      });
      navigate("/invoices");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create invoice.",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/5 flex items-center justify-center px-3 py-6">
      <div className="w-full max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate("/invoices")} className="self-start">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Invoices
          </Button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Create New Invoice</h1>
            <p className="text-muted-foreground text-sm sm:text-base">Add a new invoice to your system</p>
          </div>
        </div>

        {/* Card */}
        <Card className="w-full shadow-lg">
          <CardHeader>
            <CardTitle>Invoice Details</CardTitle>
            <CardDescription>Fill in the invoice information below</CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="Title">Title *</Label>
                <Input
                  id="Title"
                  placeholder="Enter invoice title"
                  value={formData.Title}
                  onChange={(e) => handleInputChange("Title", e.target.value)}
                  required
                />
              </div>

              {/* Amount + Date side by side on desktop */}
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
                  <Label htmlFor="InvoiceDate">Invoice Date *</Label>
                  <Input
                    id="InvoiceDate"
                    type="date"
                    value={formData.InvoiceDate}
                    onChange={(e) => handleInputChange("InvoiceDate", e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Customer Name */}
              <div className="space-y-2">
                <Label htmlFor="CustomerName">Customer Name *</Label>
                <Input
                  id="CustomerName"
                  placeholder="Enter customer name"
                  value={formData.CustomerName}
                  onChange={(e) => handleInputChange("CustomerName", e.target.value)}
                  required
                />
              </div>

              {/* Remarks dropdown */}
              <div className="space-y-2">
                <Label htmlFor="Remarks">Remarks *</Label>
                <select
                  id="Remarks"
                  value={formData.Remarks}
                  onChange={(e) => handleInputChange("Remarks", e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  required
                >
                  <option value="" disabled>
                    Select a status
                  </option>
                  <option value="Paid">Paid</option>
                  <option value="Pending">Pending</option>
                  <option value="Overdue">Overdue</option>
                </select>
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button type="submit" className="flex-1">
                  Create Invoice
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/invoices")}
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

export default AddInvoiceForm;
