import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getCustomerList } from "@/app/api/requesters";

const CustomerList = () => {
  const router = useRouter();

  // Customers
  const [filters, setFilters] = useState({});
  const [customers, setCustomers] = useState([]);
  const [customersError, setCustomersError] = useState(null);
  const [shoudlFetchCustomers, setShouldFetchCustomers] = useState(true);

  useEffect(() => {
    if (shoudlFetchCustomers) {
      fetchCustomers(filters);
      setShouldFetchCustomers(false);
    }
  }, [shoudlFetchCustomers]);

  const fetchCustomers = async (filters) => {
    try {
      const response = await getCustomerList(filters);
      if (response.ok) {
        const data = await response.json();
        setCustomers(data);
      } else {
        const status = response.status;
        const statusText = response.statusText;
        throw new Error(`Request failed with status: ${status} ${statusText}`);
      }
    } catch (error) {
      setCustomersError(error);
    }
  };

  const handlerowClick = (customerID) => {
    router.push(`/customers/${customerID}`);
  };

  const handleApplyFilters = () => {
    setShouldFetchCustomers(true);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    let updatedValue = value;
    
    if (value === "--SELECT--") {
      updatedValue = "";
    }

    setFilters((prevFiltersData) => ({
      ...prevFiltersData,
      [name]: updatedValue,
    }));
  };

  const filtersForm = () => {
    return (
      <div className="p-4 border rounded shadow bg-gray-100">
        <h2 className="font-semibold text-lg mb-4">Filters</h2>
        <form className="mb-4" onChange={handleFormChange}>
          <label className="block mb-2 font-medium">First Name</label>
          <input
            type="text"
            name="first_name"
            placeholder="E.g. John"
            className="w-full p-2 border rounded focus:outline-none mb-2"
          />
          <label className="block mb-2 font-medium">Last Name</label>
          <input
            type="text"
            name="last_name"
            placeholder="E.g. Smith"
            className="w-full p-2 border rounded focus:outline-none mb-2"
          />
          <label className="block mb-2 font-medium">Alias</label>
          <input
            type="text"
            name="alias"
            placeholder="E.g. Johny"
            className="w-full p-2 border rounded focus:outline-none mb-2"
          />
          <label className="block mb-2 font-medium">ID</label>
          <input
            min="0"
            type="number"
            name="id_card"
            placeholder="E.g. 1234567"
            className="w-full p-2 border rounded focus:outline-none mb-2"
          />
        </form>
        <button
          onClick={handleApplyFilters}
          className="bg-[#6e8a85] text-white font-semibold p-2 rounded w-full"
        >
          Apply Filters
        </button>
      </div>
    )
  }

  const customersTableHead = () => {
    return (
      <thead>
        <tr className="bg-gray-100">
          <th className="py-2 px-4 border-b text-center w-1/9">First Name</th>
          <th className="py-2 px-4 border-b text-center w-2/9">Last Name</th>
          <th className="py-2 px-4 border-b text-center w-1/9">Alias</th>
          <th className="py-2 px-4 border-b text-center w-1/9">ID Card</th>
          <th className="py-2 px-4 border-b text-center w-1/9">Email</th>
          <th className="py-2 px-4 border-b text-center w-1/9">Phone</th>
          <th className="py-2 px-4 border-b text-center w-1/9">Added</th>
        </tr>
      </thead>
    );
  };

  const customersTableBody = () => {
    return (
      <tbody>
        {customers.length > 0 ? (
          customers.map((customer, index) => (
            <tr
              key={index}
              className="hover:bg-[#d3d3d3]"
              onClick={() => handlerowClick(customer.id)}
            >
              <td className="py-2 px-4 border-b text-center w-1/9">{customer.first_name}</td>
              <td className="py-2 px-4 border-b text-center w-1/9">{customer.last_name}</td>
              <td className="py-2 px-4 border-b text-center w-1/9">{customer.alias}</td>
              <td className="py-2 px-4 border-b text-center w-1/9">{customer.id_card}</td>
              <td className="py-2 px-4 border-b text-center w-1/9">{customer.email}</td>
              <td className="py-2 px-4 border-b text-center w-1/9">{customer.phone}</td>
              <td className="py-2 px-4 border-b text-center w-1/9">{formatDateTime(customer.added_on)}</td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={12} className="py-2 px-4 text-center w-1/9">
              No customers found.
            </td>
          </tr>
        )}
      </tbody>
    );
  };

  return (
    <div className="p-4">
      <h2 className="text-center text-2xl font-bold">Customers</h2>
      <br />
      {customersError ? (
        <div>
          <p className="text-center">{`${customersError}`}</p>
        </div>
      ) : (
        <div className="grid grid-cols-6 gap-4">
          <div className="col-span-5 border rounded">
            <table className="w-full border-collapse">
              {customersTableHead()}
              {customersTableBody()}
            </table>
          </div>
          <div>
            {filtersForm()}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerList;

const formatDateTime = (datetimeStr) => {
  return datetimeStr.replace("T", " ").slice(0, 19);
};
