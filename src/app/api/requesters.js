import { useAuth } from "./auth";

export const getFilterParams = (filters) => {
  const filterParams = new URLSearchParams();
  for (const [key, value] of Object.entries(filters)) {
      if (value) {
          filterParams.append(key, value);
      }
  }
  return filterParams.toString();
}

function createRequest(endpoint) {
  return async function (data) {
    const url = `http://localhost:8000/api/v1/${endpoint}`;

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };

    return useAuth(url, options);
  };
}

function updateRequest(endpoint) {
  return async function (objID, data) {
    const url = `http://localhost:8000/api/v1/${endpoint}/${objID}`;

    const options = {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };

    return useAuth(url, options);
  };
}

function getListRequest(endpoint) {
  return async function (filters = null) {
    const base_url = `http://localhost:8000/api/v1/${endpoint}`;
    const url = filters ? `${base_url}?${getFilterParams(filters)}` : base_url;

    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };

    return useAuth(url, options);
  };
}

function getDetailsRequest(endpoint) {
  return async function (objID) {
    const url = `http://localhost:8000/api/v1/${endpoint}/${objID}`;

    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };

    return useAuth(url, options);
  };
}

// Products
export const createProduct = createRequest("products");
export const updateProduct = updateRequest("products");
export const getProductList = getListRequest("products");
export const getProductDetails = getDetailsRequest("products");

// Categories
export const createCategory = createRequest("categories");
export const updateCategory = updateRequest("categories");
export const getCategoryList = getListRequest("categories");
export const getCategoryDetails = getDetailsRequest("categories");

// Orders
export const createOrder = createRequest("orders");
export const updateOrder = updateRequest("orders");
export const getOrderList = getListRequest("orders");
export const getOrderDetails = getDetailsRequest("orders");

// OrdersItems
export const createOrderItem = createRequest("order-items");
export const updateOrderItem = updateRequest("order-items");
export const getOrderItemList = getListRequest("order-items");
export const getOrderItemDetails = getDetailsRequest("order-items");

// Customers
export const createCustomers = createRequest("customers");
export const updateCustomers = updateRequest("customers");
export const getCustomerList = getListRequest("customers");
export const getCustomerDetails = getDetailsRequest("customers");

// Employees
export const createEmployee = createRequest("employees");
export const updateEmployee = updateRequest("employees");
export const getEmployeeList = getListRequest("employees");
export const getEmployeeDetails = getDetailsRequest("employees");