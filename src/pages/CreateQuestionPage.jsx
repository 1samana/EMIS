import React, { useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Textarea,
  useToast,
  Text,
} from "@chakra-ui/react";
import Sidebar from "../components/Sidebar"; 
import Topbar from "../components/Topbar"; 

const CreateQnAPage = () => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const questionData = { question };
    const answerData = { answer };

    console.log("Sending question data:", questionData); 

    try {
      const newToken = JSON.parse(localStorage.getItem("newToken"));
      console.log("Token:", newToken); 

      const config = {
        headers: {
          Authorization: `Bearer ${newToken.access}`,
          "Content-Type": "application/json", 
        },
      };

      // Step 1: Create Question
      const questionResponse = await axios.post(
        `/proxy/roles/community/questions/create/`,
        questionData,
        config
      );

      console.log("Question created:", questionResponse.data); 

      // Step 2: Create Answer if question was created successfully
      if (answer) {
        const questionId = questionResponse.data.id; 
        answerData.questionId = questionId; 

        console.log("Sending answer data:", answerData); 

        const answerResponse = await axios.post(
          `/proxy/roles/community/answers/create/`,
          answerData,
          config
        );

        console.log("Answer created:", answerResponse.data); 
      }

      // Show success message
      toast({
        title: "QnA Created",
        description: "QnA has been created successfully!",
        status: "success",
        position: "top-right",
        duration: 3000,
        isClosable: true,
      });

    
      setQuestion("");
      setAnswer("");
    } catch (error) {
      console.error(
        "Error creating QnA:",
        error.response?.data || error.message
      ); 
      toast({
        title: "Error Creating QnA",
        description:
          error.response?.data?.message ||
          error.message ||
          "An error occurred while creating the QnA.",
        status: "error",
        position: "top-right",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box display="flex">
      <Sidebar />
      <Box flex="1" bg="gray.100">
        <Topbar />
        <Box
          maxW="500px"
          mx="auto"
          mt="5"
          p="6"
          borderWidth="1px"
          borderRadius="lg"
          boxShadow="md"
          bg="white"
        >
          <Text fontSize="2xl" mb="4" textAlign="center">
            Create QnA
          </Text>
          <form onSubmit={handleSubmit}>
            <FormControl isRequired mb="4">
              <FormLabel>Question</FormLabel>
              <Textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Type your question here..."
              />
            </FormControl>
            <FormControl isRequired mb="4">
              <FormLabel>Answer</FormLabel>
              <Textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Type your answer here..."
              />
            </FormControl>
            <Button type="submit" colorScheme="blue" width="full">
              Create QnA
            </Button>
          </form>
        </Box>
      </Box>
    </Box>
  );
};

export default CreateQnAPage;
