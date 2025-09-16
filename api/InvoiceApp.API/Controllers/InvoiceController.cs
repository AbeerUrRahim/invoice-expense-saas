using API.Processor;
using API.Processor.Invoice;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text;

namespace API.Controllers.Invoice;

[ApiController]
//[Route("api/v{version:apiVersion}/[controller]")]
[Route("api/v1/[controller]")]
[Authorize] // ✅ Authorization enabled
public class InvoiceController : ControllerBase
{
    private readonly IProcessor<InvoiceBaseModel> _IProcessor;

    public InvoiceController(IProcessor<InvoiceBaseModel> IProcessor)
    {
        _IProcessor = IProcessor;
    }

    [HttpGet]
    [Route("GetInvoice")]
    public async Task<IActionResult> GetInvoice()
    {
        try
        {
            var result = await _IProcessor.ProcessGet( User);
            return Ok(result);
        }
        catch (Exception e)
        {
            string innerexp = e.InnerException != null ? " Inner Error: " + e.InnerException.ToString() : "";
            return BadRequest(e.Message + innerexp);
        }
    }

    [HttpGet]
    [Route("GetInvoiceById/{id}")]
    public async Task<IActionResult> GetInvoiceById( Guid id)
    {
        try
        {
            var result = await _IProcessor.ProcessGetById(id,  User);
            return Ok(result.data);
        }
        catch (Exception e)
        {
            string innerexp = e.InnerException != null ? " Inner Error: " + e.InnerException.ToString() : "";
            return BadRequest(e.Message + innerexp);
        }
    }

    [HttpPost]
    [Route("AddInvoice")]
    public async Task<IActionResult> AddInvoice(InvoiceAddModel Invoice)
    {
        try
        {
            var result = await _IProcessor.ProcessPost(Invoice, User);
            return Ok(result);
        }
        catch (Exception e)
        {
            string innerexp = e.InnerException != null ? " Inner Error: " + e.InnerException.ToString() : "";
            return BadRequest(e.Message + innerexp);
        }
    }

    [HttpPut]
    [Route("UpdateInvoice")]
    public async Task<IActionResult> UpdateInvoice(InvoiceUpdateModel Invoice)
    {
        try
        {
            var result = await _IProcessor.ProcessPut(Invoice, User);
            return Ok(result);
        }
        catch (Exception e)
        {
            string innerexp = e.InnerException != null ? " Inner Error: " + e.InnerException.ToString() : "";
            return BadRequest(e.Message + innerexp);
        }
    }

    [HttpDelete]
    [Route("DeleteInvoice/{id}")]
    public async Task<IActionResult> DeleteInvoice(Guid id)
    {
        try
        {
            var result = await _IProcessor.ProcessDelete(id, User);
            return Ok(result);
        }
        catch (Exception e)
        {
            string innerexp = e.InnerException != null ? " Inner Error: " + e.InnerException.ToString() : "";
            return BadRequest(e.Message + innerexp);
        }
    }
    [HttpGet("download-csv")]
    public async Task<IActionResult> DownloadCsv()
    {
        var csvBytes = await _IProcessor.GenerateCsv(User);

        return File(csvBytes, "text/csv", "Invoices.csv");
    }


}
