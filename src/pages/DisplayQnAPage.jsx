import React, { useState, useEffect } from "react";
import axios from "axios";

const DisplayQnAPage = () => {
  const [qnaData, setQnaData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all QnA data
        const response = await axios.get("/community/getdata/");
        setQnaData(response.data);
      } catch (error) {
        console.error("Error fetching QnA data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>Display QnA</h1>
      <ul>
        {qnaData.map((qna) => (
          <li key={qna.id}>
            <strong>Question:</strong> {qna.question}
            <br />
            <strong>Answer:</strong> {qna.answer}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DisplayQnAPage;
