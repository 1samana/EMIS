import React, { useEffect, useState } from "react";
import axios from "axios";

const BASE_URL = "http://10.5.15.11:8000";

const ProfilePage = () => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProfile = async () => {
    const storedToken = localStorage.getItem("newToken");

    if (!storedToken) {
      setError("No access token found. Please log in again.");
      setLoading(false);
      return;
    }

    const newToken = JSON.parse(storedToken);

    if (!newToken?.access) {
      setError("Invalid token. Please log in again.");
      setLoading(false);
      return;
    }

    const config = {
      headers: {
        Authorization: `Bearer ${newToken.access}`,
      },
    };

    try {
      const response = await axios.get("/proxy/user/profile/", config);
      console.log("API Response: ", response.data);
      setProfileData(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching profile: ", error);
      setError("Error fetching profile data");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) {
    return <p className="text-center text-gray-500">Loading...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  if (!profileData || !profileData.profile) {
    return <p className="text-center text-gray-500">No profile data found</p>;
  }

  const { profile, role } = profileData;

  return (
    <div className="container mx-auto my-8 max-w-3xl mt-8">
      
      <div className="bg-white shadow-lg rounded-lg p-8 mt-24">
        <div className="flex items-center space-x-6 mb-8">
          <img
            src={`${BASE_URL}${profile.Photo}`}
            onClick={() => window.open(`${BASE_URL}${profile.Photo}`)}
            alt="Profile"
            className="w-32 h-32 rounded-full border-4 border-indigo-500 shadow-lg object-cover"
          />
          <div>
            <p className="text-2xl font-bold text-gray-800">{profile.Father_name}</p>
            <p className="text-lg text-indigo-500">{role}</p>
          </div>
        </div>

        <div className="mt-6">
          <p className="text-lg text-gray-600">
            <strong className="text-indigo-600">Address:</strong> {profile.address}
          </p>
          <p className="text-lg text-gray-600">
            <strong className="text-indigo-600">Phone Number:</strong> {profile.phone_no}
          </p>
          <p className="text-lg text-gray-600">
            <strong className="text-indigo-600">Father's Name:</strong> {profile.Father_name}
          </p>
          <p className="text-lg text-gray-600">
            <strong className="text-indigo-600">Mother's Name:</strong> {profile.Mother_name}
          </p>
          <p className="text-lg text-gray-600">
            <strong className="text-indigo-600">Parents' Phone Number:</strong> {profile.Parents_phone_no}
          </p>
          <p className="text-lg text-gray-600">
            <strong className="text-indigo-600">Date of Birth:</strong> {profile.DOB}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
