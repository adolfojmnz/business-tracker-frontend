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

function createObject(endpoint) {
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

function updateObject(endpoint) {
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

function getObjectList(endpoint) {
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

function getObjectDetails(endpoint) {
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

function getObjectAnalitics(endpoint) {
  return async function (objID) {
    const url = `http://localhost:8000/api/v1/${endpoint}/${objID}/analitics`;

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
export const createProduct = createObject("products");
export const updateProduct = updateObject("products");
export const getProductList = getObjectList("products");
export const getProductDetails = getObjectDetails("products");
export const getProductAnalitics = getObjectAnalitics("products");

// Categories
export const createCategory = createObject("categories");
export const updateCategory = updateObject("categories");
export const getCategoryList = getObjectList("categories");
export const getCategoryDetails = getObjectDetails("categories");

// Orders
export const createOrder = createObject("orders");
export const updateOrder = updateObject("orders");
export const getOrderList = getObjectList("orders");
export const getOrderDetails = getObjectDetails("orders");

// OrdersItems
export const createOrderItem = createObject("order-items");
export const updateOrderItem = updateObject("order-items");
export const getOrderItemList = getObjectList("order-items");
export const getOrderItemDetails = getObjectDetails("order-items");

// Customers
export const createCustomers = createObject("customers");
export const updateCustomers = updateObject("customers");
export const getCustomerList = getObjectList("customers");
export const getCustomerDetails = getObjectDetails("customers");

// Employees
export const createEmployee = createObject("employees");
export const updateEmployee = updateObject("employees");
export const getEmployeeList = getObjectList("employees");
export const getEmployeeDetails = getObjectDetails("employees");