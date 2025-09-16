import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom"; // ✅ Added useParams
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import {UpdateInvoice,  getInvoiceById } from "./Api"; // ✅ merged imports


const UpdateInvoiceForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    id:"",
    title: "",
    amount: "",
    customerName: "",
    invoiceDate: "",
    remarks: "",
    action: "E",
  });

  useEffect(() => {
    const fetchInvoice = async () => {
      const token = localStorage.getItem("token");

      if (!token || !id) return;
      try {
        const invoice = await getInvoiceById(id, token);
        setFormData({
            id: invoice.id || "",
          title: invoice.title || "",
          amount: invoice.amount || "",
          customerName: invoice.customerName || "",
          invoiceDate: invoice.invoiceDate ? invoice.invoiceDate.substring(0, 10) : "",
          remarks: invoice.remarks || "",
          action: invoice.action || null,
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load invoice data.",
          variant: "destructive",
        });
      }
    };
    fetchInvoice();
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
      const result = await UpdateInvoice( payload, token);
      // If your API returns a success property, check it here
      if (result.statusCode==200) {
        toast({
          title: "Success",
          description: "Invoice updated successfully!",
        });
        navigate("/invoices");
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
        description: "Failed to update invoice.",
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
        <Button variant="ghost" size="sm" onClick={() => navigate("/invoices")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Invoices
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Update Invoice</h1>
          <p className="text-muted-foreground">Edit the invoice details below</p>
        </div>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Invoice Details</CardTitle>
          <CardDescription>Update the invoice information</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                placeholder="Enter invoice title"
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
              <Label htmlFor="customerName">Customer Name *</Label>
              <Input
                id="customerName"
                placeholder="Enter customer name"
                value={formData.customerName}
                onChange={(e) => handleInputChange("customerName", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="invoiceDate">Invoice Date *</Label>
              <Input
                id="invoiceDate"
                type="date"
                value={formData.invoiceDate}
                onChange={(e) => handleInputChange("invoiceDate", e.target.value)}
                required
              />
            </div>

          <div className="space-y-2">
  <Label htmlFor="remarks">Remarks *</Label>
  <select
    id="remarks"
    value={formData.remarks}
    onChange={(e) => handleInputChange("remarks", e.target.value)}
    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
    required
  >
    <option value="" disabled>Select a status</option>
    <option value="Paid">Paid</option>
    <option value="Pending">Pending</option>
    <option value="Overdue">Overdue</option>
    <option value="Cancelled">Cancelled</option>
  </select>
</div>
            <div className="flex gap-4 pt-4">
              <Button type="submit" className="flex-1">
                Update Invoice
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/invoices")}
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

export default UpdateInvoiceForm;
