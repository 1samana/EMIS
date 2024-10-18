import React, { useState, useEffect } from "react";
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
  Button,
  Input,
  useToast,
} from "@chakra-ui/react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

const AllAttendancePage = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [error, setError] = useState("");
  const [userID, setUserID] = useState("");
  const [subjectID, setSubjectID] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  const toast = useToast();

  const token = JSON.parse(localStorage.getItem("newToken"));
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token.access}`,
    },
  };

  const fetchAttendanceData = async () => {
    try {
      const response = await axios.get(
        "/proxy/roles/attendance/getdata/",
        config
      );
      if (Array.isArray(response.data)) {
        setAttendanceData(response.data);
      }
      setError("");
    } catch (error) {
      setError("Failed to fetch attendance data.");
    }
  };

  useEffect(() => {
    fetchAttendanceData();
  }, []);

  const fetchAttendanceForStudent = async () => {
    if (!userID) {
      setError("Please enter a User ID");
      return;
    }

    try {
      const response = await axios.get(
        `/proxy/roles/attendance/getdata/?userID=${userID}`,
        config
      );
      setAttendanceData(response.data);
      setError("");
    } catch (error) {
      setError("Failed to fetch student attendance.");
    }
  };

  const fetchAttendanceForSubject = async () => {
    if (!subjectID) return;
    try {
      const response = await axios.get(
        `/proxy/roles/attendance/getdata/?subjectID=${subjectID}`,
        config
      );
      setAttendanceData(response.data);
    } catch (error) {
      toast({
        title: "Failed to fetch attendance data for the subject.",
        status: "error",
        duration: 3000,
        position: "top-right",
        isClosable: true,
      });
    }
  };

  const fetchAttendanceForDate = async () => {
    if (!selectedDate) return;
    try {
      const response = await axios.get(
        `/proxy/roles/attendance/getdata/?date=${selectedDate}`,
        config
      );
      setAttendanceData(response.data);
    } catch (error) {
      setError("Failed to fetch attendance data for the date.");
    }
  };

  const fetchAttendanceForUserAndSubject = async () => {
    if (!userID || !subjectID) {
      toast({
        title: "Please enter both User ID and Subject ID",
        status: "error",
        duration: 3000,
        position: "top-right",
        isClosable: true,
      });
      return;
    }

    try {
      const response = await axios.get(
        `/proxy/roles/attendance/getdata/?subjectID=${subjectID}&userID=${userID}`,
        config
      );
      setAttendanceData(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  // Function to handle attendance update
  const updateAttendance = async (record) => {
    const newStatus = record.status === "True" ? "False" : "True";
    try {
      await axios.put(
        `/proxy/roles/attendance/editAttendance/${record.id}/`,
        {
          status: newStatus,
          date: record.date,
        },
        config
      );

      toast({
        title: "Attendance updated successfully!",
        status: "success",
        duration: 3000,
        position: "top-right",
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Failed to update attendance.",
        status: "error",
        duration: 3000,
        position: "top-right",
        isClosable: true,
      });
    }
  };

  const deleteAttendance = async (recordID) => {
    try {
      await axios.delete(`/proxy/roles/attendance/deleteAttendance/`, {
        data: { id: recordID },
        headers: config.headers,
      });

      fetchAttendanceData();
      toast({
        title: "Attendance deleted successfully!",
        status: "success",
        duration: 3000,
        position: "top-right",
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Failed to delete attendance.",
        status: "error",
        duration: 3000,
        position: "top-right",
        isClosable: true,
      });
    }
  };

  return (
    <Box display="flex" height="100vh" backgroundColor="transparent">
      <Sidebar />

      <Box
        flex="1"
        display="flex"
        flexDirection="column"
        backgroundColor="transparent"
      >
        <Topbar />

        <Box p="6" flex="1" overflowY="auto" backgroundColor="transparent">
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb="4"
          >
            <Box display="flex" width="100%" justifyContent="" gap="10">
              <Box display="flex" flexDirection="column" gap="4">
                <Input
                  placeholder="User ID"
                  borderColor="blue.500"
                  onChange={(e) => setUserID(e.target.value)}
                  mr="2"
                />
                <Button
                  onClick={fetchAttendanceForStudent}
                  colorScheme="blue"
                  fontSize="sm"
                >
                  Fetch User Attendance
                </Button>
              </Box>

              <Box display="flex" flexDirection="column" gap="4">
                <Input
                  placeholder="Subject ID"
                  borderColor="blue.500"
                  onChange={(e) => setSubjectID(e.target.value)}
                  mr="2"
                />
                <Button
                  onClick={fetchAttendanceForSubject}
                  colorScheme="blue"
                  fontSize="sm"
                >
                  Fetch Subject Attendance
                </Button>
              </Box>

              <Box display="flex" flexDirection="column" gap="4">
                <Input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  borderColor="blue.500"
                  mr="2"
                />

                <Button
                  onClick={fetchAttendanceForDate}
                  colorScheme="blue"
                  fontSize="sm"
                >
                  Fetch Date Attendance
                </Button>
              </Box>

              <Box>
                <Box display="flex" flexDirection="column" gap="4">
                  <Box display="flex">
                    <Input
                      type="text"
                      onChange={(e) => setUserID(e.target.value)}
                      placeholder="User ID"
                      borderColor="blue.500"
                      mr="2"
                      required
                    />
                    <Input
                      type="text"
                      onChange={(e) => setSubjectID(e.target.value)}
                      placeholder="Subject ID"
                      borderColor="blue.500"
                      mr="2"
                      required
                    />
                  </Box>

                  <Button
                    onClick={fetchAttendanceForUserAndSubject}
                    colorScheme="blue"
                    fontSize="sm"
                  >
                    Fetch attendance
                  </Button>
                </Box>
              </Box>
            </Box>
          </Box>

          <Table
            variant="striped"
            colorScheme="gray"
            borderColor="gray.300"
            borderWidth="1px"
            borderStyle="solid"
          >
            <Thead bg="blue.500">
              <Tr>
                <Th color="white" borderColor="gray.300" borderWidth="1px">
                  Subject
                </Th>
                <Th color="white" borderColor="gray.300" borderWidth="1px">
                  Semester
                </Th>
                <Th color="white" borderColor="gray.300" borderWidth="1px">
                  Date
                </Th>
                <Th color="white" borderColor="gray.300" borderWidth="1px">
                  User ID
                </Th>
                <Th color="white" borderColor="gray.300" borderWidth="1px">
                  Status
                </Th>
                <Th color="white" borderColor="gray.300" borderWidth="1px">
                  Actions
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {attendanceData.length > 0 ? (
                attendanceData.map((attendance, index) => (
                  <React.Fragment key={index}>
                    {attendance.records &&
                      attendance.records.map((record, i) => (
                        <Tr key={i} bg="transparent">
                          <Td borderColor="gray.300" borderWidth="1px">
                            {attendance.subject}
                          </Td>
                          <Td borderColor="gray.300" borderWidth="1px">
                            {attendance.faculty_batch_sem}
                          </Td>
                          <Td borderColor="gray.300" borderWidth="1px">
                            {attendance.date}
                          </Td>
                          <Td borderColor="gray.300" borderWidth="1px">
                            {record.userID}
                          </Td>
                          <Td borderColor="gray.300" borderWidth="1px">
                            {record.status === "True" ? (
                              <span className="text-green-500 font-semibold">
                                Present
                              </span>
                            ) : (
                              <span className="text-red-500 font-semibold">
                                Absent
                              </span>
                            )}
                          </Td>
                          <Td borderColor="gray.300" borderWidth="1px">
                            <Button
                              size="sm"
                              colorScheme="blue"
                              mr="2"
                              onClick={() => updateAttendance(record)}
                            >
                              Update
                            </Button>
                            <Button
                              size="sm"
                              colorScheme="red"
                              onClick={() => deleteAttendance(record.userID)}
                            >
                              Delete
                            </Button>
                          </Td>
                        </Tr>
                      ))}
                  </React.Fragment>
                ))
              ) : (
                <Tr>
                  <Td
                    colSpan="6"
                    textAlign="center"
                    borderColor="gray.300"
                    borderWidth="1px"
                  >
                    No attendance records available.
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

export default AllAttendancePage;
