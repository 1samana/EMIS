import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Select,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Text,
  useToast,
} from "@chakra-ui/react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import LoadingGif from "../assets/news-loading.gif";

const BASE_URL = "http://10.5.15.11:8000";

const ListNoticePage = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [facultyBatchSemId, setFacultyBatchSemId] = useState("");
  const toast = useToast();

  const fetchNotices = async (semesterId) => {
    setLoading(true);
    try {
      const newToken = JSON.parse(localStorage.getItem("newToken"));
      const config = {
        headers: {
          Authorization: `Bearer ${newToken.access}`,
        },
      };

      if (semesterId) {
        const response = await axios.get(
          `/proxy/roles/community/filter_notice/?faculty_batch_sem_id=${semesterId}`,
          config
        );

        console.log("API Response:", response.data); // Log the API response

        // Check if response.data is an array
        if (Array.isArray(response.data)) {
          setNotices(response.data); // Set notices to the response data if it is an array
        } else {
          console.error("Expected an array, but got:", response.data);
          setNotices([]); // Clear notices if response is not an array
        }
      } else {
        setNotices([]); // Clear notices if no semester is selected
      }

      setError("");
    } catch (error) {
      console.error("Error fetching notices:", error);
      setError("Failed to fetch notices.");
      toast({
        title: "Error fetching notices",
        description:
          error.response?.data?.message ||
          "An error occurred while fetching notices.",
        status: "error",
        position: "top-right",
        duration: 3000,
        isClosable: true,
      });
      setNotices([]); // Clear notices on error
    } finally {
      setLoading(false); // Ensure loading state is reset
    }
  };

  const handleFilterChange = (e) => {
    const selectedSemesterId = e.target.value;
    setFacultyBatchSemId(selectedSemesterId);
    fetchNotices(selectedSemesterId);
  };

  useEffect(() => {
    fetchNotices(facultyBatchSemId);
  }, [facultyBatchSemId]);

  if (loading) {
    return (
      <div className="text-3xl font-bold h-screen flex flex-col justify-center items-center ">
        <img src={LoadingGif} alt="Loading..." className="w-52" />
        <p className="text-xl font-semibold">Loading Notices...</p>
      </div>
    );
  }

  return (
    <Box display="flex">
      <Sidebar />
      <Box flex="1" bg="gray.100">
        <Topbar />
        <Box
          maxW="950px"
          mx="auto"
          mt="5"
          p="6"
          bg="white"
          borderWidth="1px"
          borderRadius="lg"
          boxShadow="md"
        >
          <Text fontSize="2xl" mb="4" textAlign="center">
            List of Notices
          </Text>

          <Select
            placeholder="Select Semester"
            onChange={handleFilterChange}
            value={facultyBatchSemId}
            mb="4"
          >
            <option value="1">Semester 1</option>
            <option value="2">Semester 2</option>
            <option value="3">Semester 3</option>
          </Select>

          {error && <Text color="red.500">{error}</Text>}

          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Notice Name</Th>
                <Th>Semester</Th>
                <Th>Image</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {notices.length > 0 ? (
                notices.map((notice) => (
                  <Tr key={notice.id} className="bg-white even:bg-gray-100">
                    <Td>{notice.noticeName}</Td>
                    <Td>{notice.faculty_batch_Sem}</Td>
                    <Td className="flex justify-center item-center">
                      <img
                        src={`${BASE_URL}${notice.ImageFile}`}
                        alt="notice-img"
                        className="w-20 h-20"
                      />
                    </Td>
                    <Td>
                      <Button colorScheme="blue" mr={2}>
                        View
                      </Button>
                      <Button colorScheme="red">Delete</Button>
                    </Td>
                  </Tr>
                ))
              ) : (
                <Tr textAlign="center">
                  <Td colSpan="4" textAlign="center">
                    <span className="text-red-500">* </span>Select semester to
                    view notices.
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

export default ListNoticePage;
