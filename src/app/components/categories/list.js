import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getCategoryList } from "@/app/api/requesters";

const CategoryList = () => {
  const router = useRouter();

  // Categories
  const [categoriesError, setCategoriesError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({});
  const [shoudlFetchCategories, setShouldFetchCategories] = useState(true);

  useEffect(() => {
    if (shoudlFetchCategories) {
      fetchCategories(filters);
      setShouldFetchCategories(false);
    }
  }, [shoudlFetchCategories]);

  const fetchCategories = async (filters) => {
    try {
      const response = await getCategoryList(filters);
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      } else {
        const status = response.status;
        const statusText = response.statusText;
        throw new Error(`Request failed with status: ${status} ${statusText}`);
      }
    } catch (error) {
      setCategoriesError(error);
    }
  };

  const handlerowClick = (categoryID) => {
    router.push(`/categories/${categoryID}`);
  };

  const handleApplyFilters = () => {
    setShouldFetchCategories(true);
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

  const categoriesTableHead = () => {
    return (
      <thead>
        <tr className="bg-gray-100">
          <th className="py-2 px-4 border-b text-center w-1/9">Name</th>
          <th className="py-2 px-4 border-b text-center w-1/9">Description</th>
          <th className="py-2 px-4 border-b text-center w-2/9">Added</th>
          <th className="py-2 px-4 border-b text-center w-2/9">Last Updated</th>
        </tr>
      </thead>
    );
  };

  const categoriesTableBody = () => {
    return (
      <tbody>
        {categories.length > 0 ? (
          categories.map((category, index) => (
            <tr
              key={index}
              className="hover:bg-[#d3d3d3]"
              onClick={() => handlerowClick(category.id)}
            >
              <td className="py-2 px-4 border-b text-center w-1/9">{category.name}</td>
              <td className="py-2 px-4 border-b text-center w-1/9">{category.description.slice(0, 30)}</td>
              <td className="py-2 px-4 border-b text-center w-1/9">{formatDateTime(category.added_on)}</td>
              <td className="py-2 px-4 border-b text-center w-1/9">{formatDateTime(category.last_updated)}</td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={12} className="py-2 px-4 text-center w-1/9">
              No categories found.
            </td>
          </tr>
        )}
      </tbody>
    );
  };

  return (
    <div className="p-4">
      <h2 className="text-center text-2xl font-bold">Categories</h2>
      <br />
      {categoriesError ? (
        <div>
          <p className="text-center">{`${categoriesError}`}</p>
        </div>
      ) : (
        <div className="grid grid-cols-6 gap-4">
          <div className="col-span-5 border rounded">
            <table className="w-full border-collapse">
              {categoriesTableHead()}
              {categoriesTableBody()}
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

export default CategoryList;

const formatDateTime = (datetimeStr) => {
  return datetimeStr.replace("T", " ").slice(0, 19);
};
