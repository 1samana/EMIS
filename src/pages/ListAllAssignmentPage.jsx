import React, { useState, useEffect,useContext } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { Box, Table, Tbody, Td, Th, Thead, Tr, Text, useToast } from "@chakra-ui/react";
import LoadingGif from "../assets/news-loading.gif";
import { AuthContext } from "../context/AuthContext";


const ListAssignmentsPage = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const toast = useToast();
  
  const { authToken } = useContext(AuthContext);

  const fetchAssignments = async () => {
    setLoading(true);
    const config = {
      headers: {
        Authorization: `Bearer ${authToken.access}`,
      },
    };

    try {
      const response = await axios.get(`/proxy/roles/assignment/listAssignment/`, config);
      setAssignments(response.data);
      setError("");
    } catch (error) {
      console.error("Error fetching assignments:", error);
      setError("Failed to fetch assignments.");
      toast({
        title: "Error fetching assignments",
        description: error.response?.data?.message || "An error occurred while fetching assignments.",
        status: "error",
        position: "top-right",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  if (loading) {
    return (
      <div className="text-3xl font-bold h-screen flex flex-col justify-center items-center ">
        <img src={LoadingGif} alt="Loading..." className="w-52" />
        <p className="text-xl font-semibold">Loading assignment...</p>
      </div>
    );
  }

  return (
    <Box display="flex">
      <Box flex="1" bg="gray.100">

        
        <Text fontSize="2xl" mt="4" textAlign="center">
          List of Assignments
        </Text>

        {error && <Text color="red.500">{error}</Text>}

        <Box p="6" >
          <Table className="min-w-full table-auto border-collapse border border-gray-200">
            <Thead>
              <Tr className="bg-blue-500">
                <Th className="px-4 py-2 border border-gray-300" color="white">Assignment ID</Th>
                <Th className="px-4 py-2 border border-gray-300" color="white">Title</Th>
                <Th className="px-4 py-2 border border-gray-300" color="white">File</Th>
                <Th className="px-4 py-2 border border-gray-300" color="white">Description</Th>
                <Th className="px-4 py-2 border border-gray-300" color="white">Created At</Th>
                <Th className="px-4 py-2 border border-gray-300" color="white">Due Date</Th>
                <Th className="px-4 py-2 border border-gray-300" color="white">Posted By</Th>
                <Th className="px-4 py-2 border border-gray-300" color="white">Subject ID</Th>
              </Tr>
            </Thead>
            <Tbody>
              {assignments.length > 0 ? (
                assignments.map((assignment) => (
                  <Tr key={assignment.assignmentID} className="bg-white even:bg-gray-100">
                    <Td className="px-4 py-2 border border-gray-300">{assignment.assignmentID}</Td>
                    <Td className="px-4 py-2 border border-gray-300">{assignment.assignmentTitle}</Td>
                    <Td className="px-4 py-2 border border-gray-300">{assignment.assignmentInFile || "N/A"}</Td>
                    <Td className="px-4 py-2 border border-gray-300">{assignment.assignmentInText || "N/A"}</Td>
                    <Td className="px-4 py-2 border border-gray-300">{new Date(assignment.created_at).toLocaleString()}</Td>
                    <Td className="px-4 py-2 border border-gray-300">{assignment.due_date}</Td>
                    <Td className="px-4 py-2 border border-gray-300">{assignment.userID}</Td>
                    <Td className="px-4 py-2 border border-gray-300">{assignment.subjectID}</Td>
                  </Tr>
                ))
              ) : (
                <Tr textAlign="center">
                  <Td colSpan="11" textAlign="center">
                    No assignments found.
                  </Td>
                </Tr>
              )}
            </Tbody>
          </Table>
        </Box>
      </Box>
    </Box>
  );
};

export default ListAssignmentsPage;
