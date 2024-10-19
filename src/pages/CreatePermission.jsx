import axios from "axios";
import React, { useState } from "react";
import { useToast } from "@chakra-ui/react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { MdPersonAdd } from "react-icons/md";
import { FaUserShield } from "react-icons/fa";
import LoadingGif from "../assets/loading-gif.gif";

function CreatePermission() {
  const [role, setRole] = useState("");
  const [permissions, setPermissions] = useState({});
  const [loading, setLoading] = useState(false);
  //   console.log(role);
  //   console.log(permissions);
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!role || Object.keys(permissions).length < 1) {
      toast({
        title: "Please add role and at least one permission",
        status: "error",
        duration: 3000,
        position: "top-right",
        isClosable: true,
      });
      return;
    }

    const newToken = JSON.parse(localStorage.getItem("newToken"));

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${newToken.access}`,
      },
    };

    try {
      setLoading(true);
      const result = await axios.post(
        "/proxy/roles/create_role/",
        { role, permission: permissions },
        config
      );
      //   console.log(result.data);
      if (result.data) {
        const backendMsg = result.data.msg;
        toast({
          title: backendMsg,
          status:
            backendMsg === "Role created Successfully" ? "success" : "error",
          duration: 3000,
          position: "top-right",
          isClosable: true,
        });
        setLoading(false);
      } else {
        const errMsg = error.respone.data.msg;
        toast({
          title: errMsg,
          status: "error",
          duration: 3000,
          position: "top-right",
          isClosable: true,
        });
      }
    } catch (error) {
      const errMsg = error.respone.data.msg;
      toast({
        title: errMsg,
        status: "error",
        duration: 3000,
        position: "top-right",
        isClosable: true,
      });
    }
  };

  return (
        <div className="px-6">
          <div className="container mx-auto mt-10">
            <div>
              <form
                onSubmit={handleSubmit}
                className="bg-white max-w-md mx-auto p-6 rounded-md mt-10 shadow-md space-y-8"
              >
                <p className="text-center text-2xl font-bold">Create Role</p>
                <div>
                  <label
                    htmlFor="role"
                    className="font-semibold flex items-center"
                  >
                    <MdPersonAdd className="mr-3" />
                    Add Role
                  </label>
                  <input
                    id="role"
                    type="text"
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="example: teacher"
                    className="outline-none border border-gray-400 rounded-md px-2 py-2 w-full mt-4 focus:border-blue-700"
                  />
                </div>
                <div>
                  <p className="font-semibold flex items-center">
                    <FaUserShield className="mr-3" />
                    Assign Permissions
                  </p>

                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                      <input
                        id="create-assignment"
                        type="checkbox"
                        className="cursor-pointer"
                        onChange={(e) =>
                          setPermissions((prevPermissions) => ({
                            ...prevPermissions,
                            [e.target.id]: e.target.checked,
                          }))
                        }
                      />{" "}
                      <label
                        className="font-normal cursor-pointer"
                        htmlFor="create-assignment"
                      >
                        create-assignment
                      </label>
                    </div>
                    <div>
                      <input
                        id="update-assignment"
                        type="checkbox"
                        className="cursor-pointer"
                        onChange={(e) =>
                          setPermissions((prevPermissions) => ({
                            ...prevPermissions,
                            [e.target.id]: e.target.checked,
                          }))
                        }
                      />{" "}
                      <label
                        className="font-normal cursor-pointer"
                        htmlFor="update-assignment"
                      >
                        update-assignment
                      </label>
                    </div>
                    <div>
                      <input
                        id="view-assignment"
                        type="checkbox"
                        className="cursor-pointer"
                        onChange={(e) =>
                          setPermissions((prevPermissions) => ({
                            ...prevPermissions,
                            [e.target.id]: e.target.checked,
                          }))
                        }
                      />{" "}
                      <label
                        className="font-normal cursor-pointer"
                        htmlFor="view-assignment"
                      >
                        view-assignment
                      </label>
                    </div>
                    <div>
                      <input
                        id="create-answer"
                        type="checkbox"
                        className="cursor-pointer"
                        onChange={(e) =>
                          setPermissions((prevPermissions) => ({
                            ...prevPermissions,
                            [e.target.id]: e.target.checked,
                          }))
                        }
                      />{" "}
                      <label
                        className="font-normal cursor-pointer"
                        htmlFor="create-answer"
                      >
                        create-answer
                      </label>
                    </div>
                  </div>
                </div>
                <div>
                  <button className="bg-blue-500 text-white px-4 py-2 rounded-md w-full hover:opacity-90 transition-all ease-in-out duration-200">
                    {loading ? (
                      <img
                        src={LoadingGif}
                        alt="loading gif"
                        className="w-5 h-5 mx-auto"
                      />
                    ) : (
                      "Create Role"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
  );
}

export default CreatePermission;
