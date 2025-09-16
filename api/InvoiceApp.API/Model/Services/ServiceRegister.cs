using API.Processor.Invoice;
using API.Processor;
using API.Processor.Expense;

public static class ServiceRegister
{
    public static void Register(IServiceCollection services)
    {
        ConfigurePayrollProcessor(services);
    }

    private static void ConfigurePayrollProcessor(IServiceCollection services)
    {
        services.AddScoped<IProcessor<InvoiceBaseModel>, InvoiceProcessor>();
        services.AddScoped<IProcessor<ExpenseBaseModel>, ExpenseProcessor>();
    }
}
