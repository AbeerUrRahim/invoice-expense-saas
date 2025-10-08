const API_BASE_URL = (import.meta?.env?.VITE_API_BASE_URL ?? "https://localhost:7290/api/");

export async function loginUser(email, password) {
  const response = await fetch(`${API_BASE_URL}Auth/Login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ Username: email,Password:  password }),
  });
  return response.json();
}

export async function registerUser(data) {
  return await fetch(`${API_BASE_URL}Auth/Register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export async function addInvoice(data, token) {
  const response = await fetch(`${API_BASE_URL}v1/Invoice/AddInvoice`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
}
//getinvoicebyid Invoice
export async function getInvoiceById(id, token) {
    console.log("token id",id,token);
  const response = await fetch(`${API_BASE_URL}v1/Invoice/GetInvoiceById/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    }
  });
  if (!response.ok) {
    throw new Error("Failed to fetch invoice");
  }
  return response.json();
}
//get invoice
export async function getInvoices(token) {
  const response = await fetch(`${API_BASE_URL}v1/Invoice/GetInvoice`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    }
  });
  if (!response.ok) {
    throw new Error("Failed to fetch invoices");
  }
  return response.json();
}
//update invoice
export const UpdateInvoice = async ( payload, token) => {
  const response = await fetch(`${API_BASE_URL}v1/Invoice/UpdateInvoice`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token.trim()}`, 
    },
    body: JSON.stringify(payload),
  });

  return response.json();
};
//DeleteInvoice
export async function DeleteInvoices(id, token) {
  const response = await fetch(`${API_BASE_URL}v1/Invoice/DeleteInvoice/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    }
  });
  if (!response.ok) {
    throw new Error("Failed to fetch invoices");
  }
  return response.json();
}
//add expense
export async function addExpense(data, token) {
  const response = await fetch(`${API_BASE_URL}v1/Expense/AddExpense`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
}
//Getexpense
export async function getExpenses(token) {
  const response = await fetch(`${API_BASE_URL}v1/Expense/GetExpense`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    }
  });
  if (!response.ok) {
    throw new Error("Failed to fetch Expenses");
  }
  return response.json();
}
//getexpensebyid Expense
export async function getExpenseById(id, token) {
    console.log("token id",id,token);
  const response = await fetch(`${API_BASE_URL}v1/Expense/GetExpenseById/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    }
  });
  if (!response.ok) {
    throw new Error("Failed to fetch expenses");
  }
  return response.json();
}
  //UpdateExpense
export const UpdateExpense = async ( payload, token) => {
  const response = await fetch(`${API_BASE_URL}v1/Expense/UpdateExpense`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token.trim()}`, 
    },
    body: JSON.stringify(payload),
  });

  return response.json();
};
//DeleteExpense
export async function deleteExpense(id, token) {
  const response = await fetch(`${API_BASE_URL}v1/Expense/DeleteExpense/${id}`, {
    method: "DELETE",
    headers:  {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`  
       }
  });
  if (!response.ok) {
    throw new Error("Failed to fetch expenses");
  }
  return response.json();
}
//Invoice csv generation
export async function downloadInvoicesCsv(token) {
  const response = await fetch(`${API_BASE_URL}v1/Invoice/download-csv`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error("Failed to download CSV");
  }
  const blob = await response.blob();
  return blob;
}
//Dashboard Api
export async function fetchDashboardData(token) {
  const res = await fetch(`${API_BASE_URL}Dashboard`, {
    method: "GET",
    headers: { "Content-Type": "application/json",
     "Authorization": `Bearer ${token}`
     },

  });

  if (!res.ok) {
    throw new Error("Failed to fetch dashboard data");
  }

  return res.json();
}