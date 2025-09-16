using System.ComponentModel.DataAnnotations;

public class InvoiceBaseModel
{
    [Required]
    public string Title { get; set; }
    [Required]
    public string InvoiceNumber { get; set; }///C:\Users\umema\source\repos\InvoiceApp.API\InvoiceApp.API\ViewModel\InvoiceViewModel.cs
    [Required]
    public decimal Amount { get; set; }

    public DateTime InvoiceDate { get; set; }

    public string Action { get; set; }  // A / E / D
}

public class InvoiceAddModel : InvoiceBaseModel
{

}

public class InvoiceUpdateModel : InvoiceBaseModel
{
    public Guid Id { get; set; }
}

public class InvoiceDeleteModel
{
    public Guid Id { get; set; }
}

public class InvoiceViewModel : InvoiceBaseModel
{
    public Guid Id { get; set; }
    //public string CreatedBy { get; set; }
    //public DateTime CreatedAt { get; set; }
}
