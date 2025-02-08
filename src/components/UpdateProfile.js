import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Navbar } from "./Navbar";

export const UpdateProfile = () => {
  const navigate = useNavigate();
  const userId = sessionStorage.getItem("userId"); // Get userId from session storage
  const [userData, setUserData] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (!userId) return;

        console.log("Fetching user data for ID:", userId);
        const response = await axios.get(`https://www.elearningbackend.bitecodes.com/api/auth/user/${userId}`);
        
        if (response.data) {
          console.log("API Response:", response.data);
          setUserData(response.data);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [userId]);

  // Handle profile image selection
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setProfileImage(file);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUpdating(true);

    const formData = new FormData(e.target);
    const userDataUpdated = Object.fromEntries(formData);
    let newProfileUrl = userData.profileurl;

    try {
      // Upload image if selected
      if (profileImage) {
        const imageForm = new FormData();
        imageForm.append("thumbnailUrl", profileImage);

        const uploadResponse = await axios.post("https://www.elearningbackend.bitecodes.com/upload/profilephoto", imageForm, {
          headers: { "Content-Type": "multipart/form-data" }
        });

        newProfileUrl = `${uploadResponse.data}`;
      }

      // Prepare updated user object
      const updatedUser = {
        username: userDataUpdated.username,
        name: userDataUpdated.fullName,
        email: userDataUpdated.email,
        phonenum: userDataUpdated.phone,
        state: userDataUpdated.state,
        profileurl: newProfileUrl,
      };

      // Send update request
      const response = await axios.put(`https://www.elearningbackend.bitecodes.com/api/auth/update/${userId}`, updatedUser);

      if (response.status === 200) {
        setSuccess(true);
        setTimeout(() => {
          navigate("/profile");
        }, 2000);
      }
    } catch (error) {
      console.error("Update failed:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  if (!userData) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <p className="text-lg font-semibold text-gray-600">Loading profile...</p>
      </div>
    );
  }

  return (
    <div id="webcrumbs">
      <div className="w-full min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
        <Navbar />

        <main className="p-8">
          <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md overflow-hidden transition-transform hover:scale-[1.02]">
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="flex flex-col items-center mb-8">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-blue-100">
                    <img src={userData.profileurl} alt="Profile" className="w-full h-full object-cover" />
                  </div>
                  <label htmlFor="profilePhoto" className="absolute left-0 bottom-0 right-0 bg-blue-600 p-2 rounded-full cursor-pointer hover:bg-blue-700 transition-colors">
                    <span className="material-symbols-outlined text-white">Upload Photo</span>
                    <input type="file" id="profilePhoto" name="profilePhoto" className="hidden" accept="image/*" onChange={handleImageChange} />
                  </label>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Full Name</label>
                  <input type="text" name="fullName" defaultValue={userData.name} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all" placeholder="Enter your full name" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Email Address</label>
                  <input type="email" name="email" defaultValue={userData.email} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all" placeholder="Enter your email" disabled />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Phone Number</label>
                  <input type="tel" name="phone" defaultValue={userData.phonenum} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all" placeholder="Enter your phone number" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Username</label>
                  <input type="text" name="username" defaultValue={userData.username} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all" placeholder="Choose a username" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">State</label>
                  <select name="state" defaultValue={userData.state} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all">
  <option value="">Select your state</option>
  <option value="Andhra Pradesh">Andhra Pradesh</option>
  <option value="Arunachal Pradesh">Arunachal Pradesh</option>
  <option value="Assam">Assam</option>
  <option value="Bihar">Bihar</option>
  <option value="Chhattisgarh">Chhattisgarh</option>
  <option value="Goa">Goa</option>
  <option value="Gujarat">Gujarat</option>
  <option value="Haryana">Haryana</option>
  <option value="Himachal Pradesh">Himachal Pradesh</option>
  <option value="Jharkhand">Jharkhand</option>
  <option value="Karnataka">Karnataka</option>
  <option value="Kerala">Kerala</option>
  <option value="Madhya Pradesh">Madhya Pradesh</option>
  <option value="Maharashtra">Maharashtra</option>
  <option value="Manipur">Manipur</option>
  <option value="Meghalaya">Meghalaya</option>
  <option value="Mizoram">Mizoram</option>
  <option value="Nagaland">Nagaland</option>
  <option value="Odisha">Odisha</option>
  <option value="Punjab">Punjab</option>
  <option value="Rajasthan">Rajasthan</option>
  <option value="Sikkim">Sikkim</option>
  <option value="Tamil Nadu">Tamil Nadu</option>
  <option value="Telangana">Telangana</option>
  <option value="Tripura">Tripura</option>
  <option value="Uttar Pradesh">Uttar Pradesh</option>
  <option value="Uttarakhand">Uttarakhand</option>
  <option value="West Bengal">West Bengal</option>
  <option disabled>───────────</option>
  <option value="Andaman and Nicobar Islands">Andaman and Nicobar Islands</option>
  <option value="Chandigarh">Chandigarh</option>
  <option value="Dadra and Nagar Haveli and Daman and Diu">Dadra and Nagar Haveli and Daman and Diu</option>
  <option value="Lakshadweep">Lakshadweep</option>
  <option value="Delhi">Delhi</option>
  <option value="Puducherry">Puducherry</option>
  <option value="Ladakh">Ladakh</option>
  <option value="Jammu and Kashmir">Jammu and Kashmir</option>
</select>

                </div>
              </div>

              <div className="flex space-x-4">
                <button type="submit" className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 active:bg-blue-800 transform transition-all hover:-translate-y-1">
                  {isUpdating ? "Updating..." : "Update Profile"}
                </button>
              </div>

              {success && (
                <div className="mt-4 flex justify-center">
                  <div className="w-6 h-6 bg-green-500 rounded-full animate-ping"></div>
                  <span className="ml-2 text-green-600">Profile updated successfully! Redirecting...</span>
                </div>
              )}
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};
