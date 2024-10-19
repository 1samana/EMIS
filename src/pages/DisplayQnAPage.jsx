import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import {
  Box,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Text,
  useToast,
  Button,
  Input,
} from "@chakra-ui/react";
import LoadingGif from "../assets/news-loading.gif";

const DisplayQnAPage = () => {
  const [qnas, setQnas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const toast = useToast();

  const fetchQnAs = async () => {
    setLoading(true);
    const newToken = JSON.parse(localStorage.getItem("newToken"));
    const config = {
      headers: {
        Authorization: `Bearer ${newToken.access}`,
      },
    };

    try {
      const response = await axios.get(
        `/proxy/roles/community/getdata/`,
        config
      );
      setQnas(response.data);
      setError("");
    } catch (error) {
      console.error("Error fetching QnAs:", error);
      setError("Failed to fetch QnAs.");
      toast({
        title: "Error fetching QnAs",
        description:
          error.response?.data?.message ||
          "An error occurred while fetching QnAs.",
        status: "error",
        position: "top-right",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteQnA = async (id) => {
    const newToken = JSON.parse(localStorage.getItem("newToken"));
    const config = {
      headers: {
        Authorization: `Bearer ${newToken.access}`,
      },
    };

    try {
      await axios.delete(`/proxy/roles/community/qna/${id}/`, config);
      fetchQnAs(); // Refresh the list after deletion
      toast({
        title: "QnA Deleted",
        description: "QnA has been deleted successfully!",
        status: "success",
        position: "top-right",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error deleting QnA:", error);
      toast({
        title: "Error Deleting QnA",
        description:
          error.response?.data?.message ||
          "An error occurred while deleting the QnA.",
        status: "error",
        position: "top-right",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const filteredQnAs = qnas.filter(
    (qna) =>
      qna.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      qna.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    fetchQnAs();
  }, []);

  if (loading) {
    return (
      <div className="text-3xl font-bold h-screen flex flex-col justify-center items-center ">
        <img src={LoadingGif} alt="Loading..." className="w-52" />
        <p className="text-xl font-semibold">Loading QnAs...</p>
      </div>
    );
  }

  return (
    <Box display="flex">
      
      <Box flex="1" bg="gray.100">
      

        <Text fontSize="2xl" mt="4" textAlign="center">
          List of QnAs
        </Text>

        {error && <Text color="red.500">{error}</Text>}

        <Box p="6">
          <Input
            placeholder="Search QnAs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            mb="4"
          />
          <Table className="min-w-full table-auto border-collapse border border-gray-200">
            <Thead>
              <Tr className="bg-blue-500">
                <Th className="px-4 py-2 border border-gray-300" color="white">
                  QnA ID
                </Th>
                <Th className="px-4 py-2 border border-gray-300" color="white">
                  Question
                </Th>
                <Th className="px-4 py-2 border border-gray-300" color="white">
                  Answer
                </Th>
                <Th className="px-4 py-2 border border-gray-300" color="white">
                  Actions
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {filteredQnAs.length > 0 ? (
                filteredQnAs.map((qna) => (
                  <Tr key={qna.id} className="bg-white even:bg-gray-100">
                    <Td className="px-4 py-2 border border-gray-300">
                      {qna.id}
                    </Td>
                    <Td className="px-4 py-2 border border-gray-300">
                      {qna.question}
                    </Td>
                    <Td className="px-4 py-2 border border-gray-300">
                      {qna.answer}
                    </Td>
                    <Td className="px-4 py-2 border border-gray-300">
                      <Button
                        colorScheme="red"
                        onClick={() => handleDeleteQnA(qna.id)}
                      >
                        Delete
                      </Button>
                      {/* Add Edit functionality button here */}
                    </Td>
                  </Tr>
                ))
              ) : (
                <Tr textAlign="center">
                  <Td colSpan="4" textAlign="center">
                    No QnAs found.
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

export default DisplayQnAPage;
