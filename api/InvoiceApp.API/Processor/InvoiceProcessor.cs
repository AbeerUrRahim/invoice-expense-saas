using System;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using InvoiceApp.API.Data;
using InvoiceApp.API.Model;
using InvoiceApp.API.Enums;
using InvoiceApp.API.Common;
using InvoiceApp.API;
using EnumsNET;
using Microsoft.AspNetCore.Mvc;
using System.Text;
using System.IO;

namespace API.Processor.Invoice
{
    public class InvoiceProcessor : IProcessor<InvoiceBaseModel>
    {
        private readonly AppDbContext _context;
        private readonly IManager? _manager;

        public InvoiceProcessor(AppDbContext context)
        {
            _context = context;
            _manager = Builder.MakeManagerClass(InvoiceApp.API.Enums.ModuleClassName.Invoice, _context);
        }

        //Get all invoices
        public async Task<ApiResponse> ProcessGet( ClaimsPrincipal _User)
        {
            ApiResponse apiResponse = new ApiResponse();

            if (_manager != null)
            {
                var response = await _manager.GetAllAsync(_User);
                var _Table = response.data as IEnumerable<InvoiceApp.API.Model.Invoice>;

                if (Convert.ToInt32(response.statusCode) == 200 && _Table != null)
                {
                    var result = (from inv in _Table
                                  select new InvoiceViewModel
                                  {
                                      Id = inv.Id,
                                      Title = inv.Title,
                                      Amount = inv.Amount,
                                      CustomerName = inv.CustomerName,
                                      InvoiceNumber = inv.InvoiceNumber,
                                      InvoiceDate = inv.InvoiceDate,
                                      Remarks = inv.Remarks,
                                      //CreatedAt = inv.CreatedAt,
                                      //CreatedBy = inv.CreatedBy,
                                      //UpdatedAt = inv.UpdatedAt,
                                      //UpdatedBy = inv.UpdatedBy
                                  }).ToList();

                    response.data = result;
                }

                return response;
            }

            apiResponse.statusCode = StatusCodes.Status405MethodNotAllowed.ToString();
            apiResponse.message = "Manager not initialized or Invalid Class.";
            return apiResponse;
        }

        // ✅ Get invoice by Id
        public async Task<ApiResponse> ProcessGetById(Guid _Id, ClaimsPrincipal _User)
        {
            ApiResponse apiResponse = new ApiResponse();

            if (_manager != null)
            {
                var response = await _manager.GetByIdAsync(_Id, _User);
                if (Convert.ToInt32(response.statusCode) == 200)
                {
                    var inv = response.data as InvoiceApp.API.Model.Invoice;
                    if (inv != null)
                    {
                        var viewModel = new InvoiceViewByIdModel
                        {
                            Id = inv.Id,
                            Title = inv.Title,
                            Amount = inv.Amount,
                            CustomerName = inv.CustomerName,
                            InvoiceNumber = inv.InvoiceNumber,
                            InvoiceDate = inv.InvoiceDate,
                            Remarks = inv.Remarks,
                            //CreatedAt = inv.CreatedAt,
                            //CreatedBy = inv.CreatedBy,
                            //UpdatedAt = inv.UpdatedAt,
                            //UpdatedBy = inv.UpdatedBy
                        };

                        response.data = viewModel;
                    }
                }

                return response;
            }

            apiResponse.statusCode = StatusCodes.Status405MethodNotAllowed.ToString();
            apiResponse.message = "Manager not initialized or Invalid Class.";
            return apiResponse;
        }

        // ✅ Create new invoice
        public async Task<ApiResponse> ProcessPost(InvoiceBaseModel _Invoice, ClaimsPrincipal _User)
        {
            ApiResponse apiResponse = new ApiResponse();

            var invoiceModel = _Invoice as InvoiceAddModel;
            if (invoiceModel == null)
            {
                apiResponse.statusCode = StatusCodes.Status405MethodNotAllowed.ToString();
                apiResponse.message = "Invalid Class: Expected InvoiceAddModel.";
                return apiResponse;
            }

            if (_manager is InvoiceManager invoiceManager)
            {
                // generate invoice number automatically
                var lastInvoice = await _context.Invoices
                    .Where(i => i.InvoiceNumber != null)
                    .OrderByDescending(i => i.CreatedAt)
                    .FirstOrDefaultAsync();

                int newNumber = 1;
                if (lastInvoice != null && int.TryParse(lastInvoice.InvoiceNumber, out int lastNum))
                {
                    newNumber = lastNum + 1;
                }

                invoiceModel.InvoiceNumber = newNumber.ToString("D5"); // e.g., 00001, 00002

                return await invoiceManager.CreateAsync(invoiceModel, _User);
            }

            apiResponse.statusCode = StatusCodes.Status500InternalServerError.ToString();
            apiResponse.message = "Manager not initialized or is not an InvoiceManager.";
            return apiResponse;
        }

        //  Update invoice
        public async Task<ApiResponse> ProcessPut(InvoiceBaseModel _Invoice, ClaimsPrincipal _User)
        {
            ApiResponse apiResponse = new ApiResponse();

            var invoiceUpdateModel = _Invoice as InvoiceUpdateModel;
            if (invoiceUpdateModel == null)
            {
                apiResponse.statusCode = StatusCodes.Status405MethodNotAllowed.ToString();
                apiResponse.message = "Invalid Class: Expected InvoiceUpdateModel.";
                return apiResponse;
            }

            if (_manager is InvoiceManager invoiceManager)
            {
                return await invoiceManager.UpdateAsync(invoiceUpdateModel, _User);
            }

            apiResponse.statusCode = StatusCodes.Status500InternalServerError.ToString();
            apiResponse.message = "Manager not initialized or is not an InvoiceManager.";
            return apiResponse;
        }

        // ✅ Delete invoice
        public async Task<ApiResponse> ProcessDelete(Guid _Id, ClaimsPrincipal _User)
        {
            ApiResponse apiResponse = new ApiResponse();

            if (_manager != null)
            {
                return await _manager.DeleteAsync(_Id, _User);
            }

            apiResponse.statusCode = StatusCodes.Status405MethodNotAllowed.ToString();
            apiResponse.message = "Manager not initialized or Invalid Class.";
            return apiResponse;
        }
        public async Task<byte[]> GenerateCsv(ClaimsPrincipal claim)
        {
            //var invoices = await _context.Invoices.ToListAsync();
            var invoices = await _context.Invoices
                .Where(e => e.Action != "D")
                .ToListAsync();

            var csv = new StringBuilder();
            csv.AppendLine("InvoiceNumber,Title,Amount,CustomerName,InvoiceDate");

            foreach (var invoice in invoices)
            {
                csv.AppendLine($"{invoice.InvoiceNumber},{invoice.Title},{invoice.Amount},{invoice.CustomerName},{invoice.InvoiceDate:yyyy-MM-dd}");
            }

            var bytes = Encoding.UTF8.GetBytes(csv.ToString());
            return bytes; // return plain byte[] only
        }

    }
}
