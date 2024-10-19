import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MyComplaintsPage = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [paginationInfo, setPaginationInfo] = useState({ next: null, previous: null });
  const [editComplaintId, setEditComplaintId] = useState(null);
  const [editFormData, setEditFormData] = useState({ title: '', description: '', suggestion: '' });

  const fetchComplaints = async (page) => {
    setLoading(true);
    try {
      const tokenString = localStorage.getItem('newToken');
      const newToken = tokenString ? JSON.parse(tokenString) : null;

      if (!newToken || !newToken.access) {
        throw new Error('Authorization token is missing or invalid');
      }

      const config = {
        headers: {
          Authorization: `Bearer ${newToken.access}`,
        },
      };

      const response = await axios.get(`/proxy/roles/complaints/mine/?page=${page}`, config);
      console.log("API Response:", response.data);

      if (Array.isArray(response.data)) {
        // Sort complaints from newest to oldest
        const sortedComplaints = response.data.sort((a, b) => new Date(b.date) - new Date(a.date));
        setComplaints(sortedComplaints);
        console.log("Complaints set:", sortedComplaints);
      } else {
        console.warn("No results found in response");
        setComplaints([]);
      }
      setError(null);
    } catch (error) {
      console.error("Error fetching complaints:", error);
      setError(error.message || 'Failed to fetch complaints');
      setComplaints([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({ ...editFormData, [name]: value });
  };

  const startEditing = (complaint) => {
    setEditComplaintId(complaint.complainID);
    setEditFormData({
      title: complaint.title,
      description: complaint.description,
      suggestion: complaint.suggestion,
    });
  };

  const saveEdit = async () => {
    try {
      const tokenString = localStorage.getItem('newToken');
      const newToken = tokenString ? JSON.parse(tokenString) : null;

      const config = {
        headers: {
          Authorization: `Bearer ${newToken.access}`,
        },
      };

      const response = await axios.put(`/proxy/roles/complaints/edit/${editComplaintId}/`, editFormData, config);
      console.log("Edit Response:", response.data);
      
      // Update the complaints state with the edited complaint
      setComplaints(prevComplaints => 
        prevComplaints.map(complaint => 
          complaint.complainID === editComplaintId ? { ...complaint, ...editFormData } : complaint
        )
      );
      setEditComplaintId(null); // Reset the editing state
    } catch (error) {
      console.error("Error editing complaint:", error);
      setError(error.message || 'Failed to edit complaint');
    }
  };

  const deleteComplaint = async (complaintId) => {
    try {
      const tokenString = localStorage.getItem('newToken');
      const newToken = tokenString ? JSON.parse(tokenString) : null;

      const config = {
        headers: {
          Authorization: `Bearer ${newToken.access}`,
        },
      };

      const response = await axios.delete(`/proxy/roles/complaints/delete/${complaintId}/`, config);
      console.log("Delete Response:", response.data);

      // Remove the deleted complaint from the state
      setComplaints(prevComplaints => prevComplaints.filter(complaint => complaint.complainID !== complaintId));
    } catch (error) {
      console.error("Error deleting complaint:", error);
      setError(error.message || 'Failed to delete complaint');
    }
  };

  useEffect(() => {
    fetchComplaints(page);
  }, [page]);

  useEffect(() => {
    console.log("Current complaints:", complaints);
  }, [complaints]);

  return (
    <div className="flex flex-col items-center justify-center p-6 ">
      <h2 className="text-xl font-bold mb-4 ">My Complaints</h2>
      
      {loading ? (
        <p>Loading complaints...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div>
          {complaints.length === 0 ? (
            <p>No complaints found.</p>
          ) : (
            <table className="min-w-full table-auto border-collapse border border-gray-200">
              <thead>
                <tr className="bg-blue-500 text-white text-nowrap ">
                  <th className="px-4 py-2 border border-gray-300">Title</th>
                  <th className="px-4 py-2 border border-gray-300">Description</th>
                  <th className="px-4 py-2 border border-gray-300">Suggestion</th>
                  <th className="px-4 py-2 border border-gray-300">Date</th>
                  <th className="px-4 py-2 border border-gray-300">Status</th>
                  <th className="px-4 py-2 border border-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {complaints.map((complaint) => {
                  const isSolved = complaint.solved; // Check if the complaint is solved

                  return (
                    <tr key={complaint.complainID} className="bg-white even:bg-gray-100">
                      <td className="px-4 py-2 border border-gray-300">{editComplaintId === complaint.complainID ? 
                        <input name="title" value={editFormData.title} onChange={handleEditChange} className="border" /> :
                        complaint.title}
                      </td>
                      <td className="px-4 py-2 border border-gray-300">{editComplaintId === complaint.complainID ? 
                        <input name="description" value={editFormData.description} onChange={handleEditChange} className="border" /> :
                        complaint.description}
                      </td>
                      <td className="px-4 py-2 border border-gray-300">{editComplaintId === complaint.complainID ? 
                        <input name="suggestion" value={editFormData.suggestion} onChange={handleEditChange} className="border" /> :
                        complaint.suggestion}
                      </td>
                      <td className="px-4 py-2 border border-gray-300">{new Date(complaint.date).toLocaleDateString()}</td>
                      <td className="px-4 py-2 border border-gray-300">{isSolved ? 'Solved' : 'Pending'}</td>
                      <td className="px-4 py-2 border border-gray-300">
                        {editComplaintId === complaint.complainID ? (
                          <button onClick={saveEdit} className="bg-green-500 text-white px-2 py-1 rounded">Save</button>
                        ) : (
                          <button 
                            onClick={() => startEditing(complaint)} 
                            className={`bg-blue-600 text-white px-2 py-1 rounded ${isSolved ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={isSolved} // Disable edit button if solved
                          >
                            Edit
                          </button>
                        )}
                        <button
                          onClick={() => deleteComplaint(complaint.complainID)}
                          className={`bg-red-500 text-white px-2 py-1 rounded ml-2 ${isSolved ? 'opacity-50 cursor-not-allowed' : ''}`}
                          disabled={isSolved} // Disable delete button if solved
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}

          
        </div>
      )}
    </div>
  );
};

export default MyComplaintsPage;
