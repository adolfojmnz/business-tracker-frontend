import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getProductList } from "@/app/api/requesters";
import { getCategoryList } from "@/app/api/requesters";

const ProductList = () => {
  const router = useRouter();

  // Products
  const [productsError, setProductsError] = useState(null);
  const [products, setProduct] = useState([]);
  const [filters, setFilters] = useState({});
  const [shoudlFetchProducts, setShouldFetchProducts] = useState(true);

  // Categories
  const [categories, setCategories] = useState([]);
  const [categoriesError, setCategoriesError] = useState(null);
  const [shouldFetchCategories, setShouldFetchCategories] = useState(true);

  useEffect(() => {
    if (shoudlFetchProducts) {
      fetchProducts(filters);
      setShouldFetchProducts(false);
    }
    if (shouldFetchCategories) {
      fetchCategories({});
      setShouldFetchCategories(false);
    }
  }, [shoudlFetchProducts, shouldFetchCategories]);

  const fetchProducts = async (filters) => {
    try {
      const response = await getProductList(filters);
      if (response.ok) {
        const data = await response.json();
        setProduct(data);
      } else {
        const status = response.status;
        const statusText = response.statusText;
        throw new Error(`Request failed with status: ${status} ${statusText}`);
      }
    } catch (error) {
      setProductsError(error);
    }
  };

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
      setProductsError(error);
    }
  };

  const handlerowClick = (productID) => {
    router.push(`/products/${productID}`);
  };

  const handleApplyFilters = () => {
    setShouldFetchProducts(true);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    let updatedValue = value;
    
    if (value === "-- All --") {
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
          <label className="block mb-2 font-medium">Name</label>
          <input
            type="text"
            name="name"
            placeholder="E.g. Pork Meat"
            className="w-full p-2 border rounded focus:outline-none mb-2"
          />
          <label className="blick mb-2 font-medium">Categories</label>
          <select
            name="category"
            className="w-full p-2 border border-gray-200 mb-2"
          >
            <option>-- All --</option>
            {categories !== null ? (
              categories.map((category, index) => (
                <option key={index} value={category.id}>
                  {category.name}
                </option>
              ))
            ) : (
              currenciesError ? (
                <option disabled>{categoriesError}</option>
              ) : (
                <option disabled>Loading...</option>
              )
            )}
          </select>
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

  const productsTableHead = () => {
    return (
      <thead>
        <tr className="bg-gray-100">
          <th className="py-2 px-4 border-b text-center w-1/9">Name</th>
          <th className="py-2 px-4 border-b text-center w-2/9">Cost (USD)</th>
          <th className="py-2 px-4 border-b text-center w-1/9">Sale Price (USD)</th>
          <th className="py-2 px-4 border-b text-center w-1/9">Stock</th>
          <th className="py-2 px-4 border-b text-center w-1/9">Category</th>
          <th className="py-2 px-4 border-b text-center w-1/9">Added</th>
        </tr>
      </thead>
    );
  };

  const productsTableBody = () => {
    return (
      <tbody>
        {products.length > 0 ? (
          products.map((product, index) => (
            <tr
              key={index}
              className="hover:bg-[#d3d3d3]"
              onClick={() => handlerowClick(product.id)}
            >
              <td className="py-2 px-4 border-b text-center w-1/9">{product.name}</td>
              <td className="py-2 px-4 border-b text-center w-1/9">{product.cost}</td>
              <td className="py-2 px-4 border-b text-center w-1/9">{product.price}</td>
              <td className="py-2 px-4 border-b text-center w-1/9">
                {product.stock} {product.unit_symbol}
              </td>
              <td className="py-2 px-4 border-b text-center w-1/9">{product.category_name}</td>
              <td className="py-2 px-4 border-b text-center w-1/9">{product.added_on.slice(0,10)}</td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={12} className="py-2 px-4 text-center w-1/9">
              No products found.
            </td>
          </tr>
        )}
      </tbody>
    );
  };

  return (
    <div className="p-4">
      <h2 className="text-center text-2xl font-bold">Products</h2>
      <br />
      {productsError ? (
        <div>
          <p className="text-center">{`${productsError}`}</p>
        </div>
      ) : (
        <div className="grid grid-cols-6 gap-4">
          <div className="col-span-5 border rounded">
            <table className="w-full border-collapse">
              {productsTableHead()}
              {productsTableBody()}
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

export default ProductList;