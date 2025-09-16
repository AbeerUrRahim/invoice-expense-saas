using InvoiceApp.API;
using InvoiceApp.API.Enums;
using InvoiceApp.API.Data; 

namespace InvoiceApp.API.Common
{
    public static class Builder
    {
        public static IManager MakeManagerClass(ModuleClassName moduleClass, AppDbContext context)
        {
            switch (moduleClass)
            {
                case ModuleClassName.Invoice:
                    return new InvoiceManager(context);
                case ModuleClassName.Expense:
                    return new ExpenseManager(context);


                default:
                    throw new ArgumentException("Invalid ModuleClassName");
            }
        }
    }
}
