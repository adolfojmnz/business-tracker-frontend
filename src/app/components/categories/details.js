import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { formatDateTime } from "../timeFormatter";
import { getCategoryDetails } from "@/app/api/requesters";

const CategoryDetails = () => {
  const router = useRouter();
  const [error, setError] = useState(null);
  const [category, setCategory] = useState(null);

  useEffect(() => {
    if (router.isReady) {
      fetchCategory(router.query.categoryID);
    }
  }, [router.isReady]);

  const fetchCategory = async (categoryID) => {
    try {
      const response = await getCategoryDetails(categoryID);
      if (response.ok) {
        const data = await response.json();
        setCategory(data);
      } else {
        const status = response.status;
        const statusText = response.statusText;
        throw new Error(`Request failed with status: ${status} ${statusText}`);
      }
    } catch (error) {
      setError(error);
    }
  };

  const categoryDetailsTable = (category) => {
    return (
      <table className="w-full border rounded">
        <tbody>
          <tr>
            <td className="py-2 px-4 border-b text-left">Name</td>
            <td className="py-2 px-4 border-b text-right">{category.name}</td>
          </tr>
          <tr>
            <td className="py-2 px-4 border-b text-left">Description</td>
            <td className="py-2 px-4 border-b text-right">{category.description}</td>
          </tr>
          <tr>
            <td className="py-2 px-4 border-b text-left">Added On</td>
            <td className="py-2 px-4 border-b text-right">{formatDateTime(category.added_on)}</td>
          </tr>
          <tr>
            <td className="py-2 px-4 border-b text-left">Last Updated</td>
            <td className="py-2 px-4 border-b text-right">{formatDateTime(category.last_updated)}</td>
          </tr>
        </tbody>
      </table>
    );
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Category Details</h1>
      {error !== null ? (
        <p className="text-center">{`${error}`}</p>
      ) : (
        category ? (
          <>
            {categoryDetailsTable(category)}
          </>
        ) : (
          <p>Category Not Found!</p>
        )
      )}
    </div>
  );
}

export default CategoryDetails;