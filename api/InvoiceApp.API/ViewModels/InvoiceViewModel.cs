using System.ComponentModel.DataAnnotations;

public class InvoiceBaseModel
{
    [Required]
    public string Title { get; set; }

    public string? InvoiceNumber { get; set; }
    [Required]
    public decimal Amount { get; set; }
    [Required]
    public string CustomerName { get; set; }
  

    public DateTime InvoiceDate { get; set; }

    public string? Action { get; set; }  // A / E / D
    public string? Remarks { get; set; }  
}

public class InvoiceAddModel : InvoiceBaseModel
{

}

public class InvoiceUpdateModel : InvoiceBaseModel
{
    [Required]
    public Guid Id { get; set; }
}

public class InvoiceDeleteModel
{
    public Guid Id { get; set; }
}

public class InvoiceViewModel : InvoiceBaseModel
{
    public Guid Id { get; set; }

}
public class InvoiceViewByIdModel : InvoiceBaseModel
{
    public Guid Id { get; set; }
   
}
