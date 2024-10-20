import axios from "axios";
import React, { useEffect, useState, useContext } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import ViewPermissionsPop from "../components/ViewPermissionsPop";
import { AuthContext } from "../context/AuthContext";
function ListAllRolesPage() {
  const [data, setData] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [permissionData, setPermissionData] = useState({});
  const { authToken } = useContext(AuthContext);

  function togglePopup(permissionId, permissionName) {
    setIsOpen(!isOpen);
    setPermissionData({
      permissionId,
      permissionName,
    });
    // console.log(permissionId, permissionName);
    return;
  }

  const fetchRoles = async () => {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken.access}`,
      },
    };

    try {
      const result = await axios.get(
        "/proxy/roles/list_role_with_permission/",
        config
      );
      if (result && result.data) {
        // console.log(result.data);
        setData(result.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  return (
    <>
      <div className="overflow-x-auto shadow-lg rounded-lg">
        <table className="min-w-full table-auto border-collapse border border-gray-200">
          <thead>
            <tr className="w-full bg-blue-500 text-white uppercase text-sm leading-normal">
              <th className="px-4 py-2 border border-gray-300">Role ID</th>
              <th className="px-4 py-2 border border-gray-300">Role Name</th>
              <th className="px-4 py-2 border border-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {data.map((item) => (
              <tr
                key={item.role_id}
                className="border-b border-gray-200  bg:white even:bg-gray-200"
              >
                <td className="py-3 px-6 text-left font-semibold text-md border border-gray-300">
                  {item.role_id}
                </td>
                <td className="py-3 px-6 text-left font-semibold text-md border border-gray-300">
                  {item.name}
                </td>
                <td className="py-3 px-6 text-left font-semibold text-md border border-gray-300">
                  <div className="flex justify-center gap-4">
                    <button
                      onClick={() =>
                        togglePopup(
                          item.role_permissions.map(
                            (item) => item.permission_id
                          ),
                          item.role_permissions.map((item) => item.name)
                        )
                      }
                      className="bg-blue-500 text-white font-semibold px-4 py-2 rounded-md  transition duration-300 hover:bg-blue-600"
                    >
                      View Permissions
                    </button>
                    <button className="bg-lime-600 text-white font-semibold px-4 py-2 rounded-md w-24 transition duration-300 hover:bg-lime-700">
                      Update
                    </button>
                    <button className="bg-red-500 text-white font-semibold px-4 py-2 rounded-md w-24 transition duration-300 hover:bg-red-600">
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 transition-opacity">
          <div
            onClick={togglePopup}
            className="absolute top-10 right-4 w-10 h-10 text-white cursor-pointer text-2xl z-50"
          >
            &#x2715;
          </div>
          <div>
            <ViewPermissionsPop permissionData={permissionData} />
          </div>
        </div>
      )}
    </>
  );
}

export default ListAllRolesPage;
