import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
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
  Collapse,
  FormControl,
  FormLabel,
  Flex,
} from "@chakra-ui/react";
import { AuthContext } from "../context/AuthContext";
import LoadingGif from "../assets/news-loading.gif";

const DisplayQnAPage = () => {
  const [qnas, setQnas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedQnAId, setExpandedQnAId] = useState(null);
  const [userID, setUserID] = useState("");
  const [subjectID, setSubjectID] = useState("");
  const toast = useToast();
  const { authToken } = useContext(AuthContext);

  const fetchQnAs = async () => {
    setLoading(true);
    const config = {
      headers: {
        Authorization: `Bearer ${authToken.access}`,
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

  const handleFilterQuestions = async () => {
    setLoading(true);
    const config = {
      headers: {
        Authorization: `Bearer ${authToken.access}`,
      },
    };

    try {
      const response = await axios.post(
        `/proxy/roles/community/filterQuestions/`,
        { userID, subjectID },
        config
      );
      setQnas(response.data);
      setError("");
    } catch (error) {
      console.error("Error filtering questions:", error);
      setError("Failed to filter questions.");
      toast({
        title: "Error filtering questions",
        description:
          error.response?.data?.message ||
          "An error occurred while filtering questions.",
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
    const config = {
      headers: {
        Authorization: `Bearer ${authToken.access}`,
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

  const filteredQnAs = qnas.filter((qna) =>
    qna.questionName.toLowerCase().includes(searchTerm.toLowerCase())
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
      <Box flex="1">
        <Text fontSize="2xl" mt="4" textAlign="center">
          List of QnAs
        </Text>

        {error && <Text color="red.500">{error}</Text>}

        <Box p="6">
          {/* Flex container for horizontal filtering */}
          <Flex mb="6" alignItems="center" gap="4" direction={{ base: 'column', md: 'row' }}>
  <FormControl flex="1">
    <Input
      placeholder="Enter User ID"
      value={userID}
      onChange={(e) => setUserID(e.target.value)}
      backgroundColor="white"    
      borderColor="gray.300"
      _hover={{ borderColor: 'gray.500' }}
      _focus={{ borderColor: 'teal.500' }}
      padding="6"
      borderRadius="md"
    />
  </FormControl>
  
  <FormControl flex="1">
    <Input
      placeholder="Enter Subject ID"
      value={subjectID}
      onChange={(e) => setSubjectID(e.target.value)}
      backgroundColor="white"    
      borderColor="gray.300"
      _hover={{ borderColor: 'gray.500' }}
      _focus={{ borderColor: 'teal.500' }}
      padding="6"
      borderRadius="md"
    />
  </FormControl>
  
  <Input
    placeholder="Search QnAs..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    backgroundColor="white"  
    flex="2"
    borderColor="gray.300"
    _hover={{ borderColor: 'gray.500' }}
    _focus={{ borderColor: 'teal.500' }}
    padding="6"
    borderRadius="md"
  />
</Flex>

<Button
  bg="blue.600"       
  color="white"       
  _hover={{ bg: "blue.700" }}  
  _active={{ bg: "blue.800" }} 
  onClick={handleFilterQuestions}
  size="lg"
  boxShadow="lg"
  paddingX="8"
>
  Filter Questions
</Button>


          <Table className="min-w-full table-auto border-collapse border border-gray-200">
            <Thead>
              <Tr className="bg-blue-500">
                <Th className="px-4 py-2 border border-gray-300" color="white">
                  QnA ID
                </Th>
                <Th className="px-4 py-2 border border-gray-300" color="white">
                  Subject ID
                </Th>
                <Th className="px-4 py-2 border border-gray-300" color="white">
                  Posted By
                </Th>
                <Th className="px-4 py-2 border border-gray-300" color="white">
                  Date
                </Th>
                <Th className="px-4 py-2 border border-gray-300" color="white">
                  Question
                </Th>
                <Th className="px-4 py-2 border border-gray-300" color="white">
                  Actions
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {filteredQnAs.length > 0 ? (
                filteredQnAs.map((qna) => (
                  <React.Fragment key={qna.qid}>
                    <Tr className="bg-white even:bg-gray-100">
                      <Td className="px-4 py-2 border border-gray-300">
                        {qna.qid}
                      </Td>
                      <Td className="px-4 py-2 border border-gray-300">
                        {qna.subjectID}
                      </Td>
                      <Td className="px-4 py-2 border border-gray-300">
                        {qna.userID}
                      </Td>
                      <td className="px-4 py-2 border border-gray-300">
                        {new Date(qna.date).toLocaleString()}
                      </td>
                      <Td className="px-4 py-2 border border-gray-300">
                        {qna.questionName}
                      </Td>
                      <Td className="px-4 py-2 border border-gray-300">
                        <Button
                          colorScheme="blue"
                          onClick={() => {
                            setExpandedQnAId(
                              expandedQnAId === qna.qid ? null : qna.qid
                            );
                          }}
                        >
                          {expandedQnAId === qna.qid
                            ? "Hide Answers"
                            : "Answers"}
                        </Button>
                        <Button
                          colorScheme="red"
                          ml="2"
                          onClick={() => handleDeleteQnA(qna.qid)}
                        >
                          Delete
                        </Button>
                      </Td>
                    </Tr>
                    <Tr className="bg-blue-100">
                      <Td colSpan="6" p={0}>
                        <Collapse in={expandedQnAId === qna.qid}>
                          <Box p={4}>
                            <Text fontSize="lg" fontWeight="bold">
                              Answers:
                            </Text>
                            <Table variant="simple" size="sm">
                              <Thead>
                                <Tr>
                                  <Th>Answer ID</Th>
                                  <Th>User ID</Th>
                                  <Th>Answer</Th>
                                  <Th>Created At</Th>
                                  <Th>Updated At</Th>
                                </Tr>
                              </Thead>
                              <Tbody>
                                {qna.answers.map((answer) => (
                                  <Tr key={answer.aid}>
                                    <Td>{answer.aid}</Td>
                                    <Td>{answer.userID}</Td>
                                    <Td>{answer.answerName}</Td>
                                    <td>
                                      {new Date(
                                        answer.created_at
                                      ).toLocaleString()}
                                    </td>
                                    <td>
                                      {new Date(
                                        answer.updated_at
                                      ).toLocaleString()}
                                    </td>
                                  </Tr>
                                ))}
                              </Tbody>
                            </Table>
                          </Box>
                        </Collapse>
                      </Td>
                    </Tr>
                  </React.Fragment>
                ))
              ) : (
                <Tr textAlign="center">
                  <Td colSpan="6" textAlign="center">
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
