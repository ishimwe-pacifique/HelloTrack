/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import axios from "axios";
import Modal from "react-modal";
import { Button } from "./ui/button";

interface TractorOwner {
  name: string;
  phoneNumber: string;
  email: string;
  physicalAddress: string;
  location: string;
  assignedTractor: string;
  newRegistrationNumber: string;
  tractorId: string;
  welcomeEmailStatus: string;
}

const TractorRegistrationForm: React.FC = () => {
  const [modalIsOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const [formData, setFormData] = useState<TractorOwner>({
    name: "",
    phoneNumber: "",
    email: "",
    physicalAddress: "",
    location: "",
    assignedTractor: "",
    newRegistrationNumber: "",
    tractorId: "",
    welcomeEmailStatus: "",
  });

  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/tractor-owners", formData);
      if (response.status === 201) {
        setSuccessMessage("Tractor owner registered successfully!");
        setErrorMessage(null);
        setFormData({
          name: "",
          phoneNumber: "",
          email: "",
          physicalAddress: "",
          location: "",
          assignedTractor: "",
          newRegistrationNumber: "",
          tractorId: "",
          welcomeEmailStatus: "",
        });
      }
    } catch (error: any) {
      setErrorMessage(error.response?.data?.message || "Something went wrong!");
      setSuccessMessage(null);
    }
  };

  return (
    <>
      <div className="flex justify-end">
        <Button onClick={openModal}>Register Tractor</Button>
      </div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Modal"
         bodyOpenClassName="overflow-hidden" 
        style={customStyles}
      >
        <div className="max-w-2xl h-[80vh] overflow-y-auto z-30 mx-auto mt-10 p-6 text-black shadow-md rounded-lg">
          <h1 className="text-2xl font-bold mb-6">
            Register Tractor Owner
          </h1>

          {successMessage && (
            <div className="p-3 mb-4 text-green-700 bg-green-100 border border-green-400 rounded">
              {successMessage}
            </div>
          )}

          {errorMessage && (
            <div className="p-3 mb-4 text-red-700 bg-red-100 border border-red-400 rounded">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Name */}
            <div className="mb-4">
              <label
                htmlFor="name"
                className="block text-black font-medium mb-2"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-300 text-black"
                placeholder="Enter full name"
                required
              />
            </div>

            {/* Phone Number */}
            <div className="mb-4">
              <label
                htmlFor="phoneNumber"
                className="block text-black font-medium mb-2"
              >
                Phone Number
              </label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-300 text-black"
                placeholder="Enter phone number"
                required
              />
            </div>

            {/* Email */}
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-black font-medium mb-2"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-300 text-black"
                placeholder="Enter email address"
                required
              />
            </div>

            {/* Physical Address */}
            <div className="mb-4">
              <label
                htmlFor="physicalAddress"
                className="block text-black font-medium mb-2"
              >
                Physical Address
              </label>
              <textarea
                id="physicalAddress"
                name="physicalAddress"
                value={formData.physicalAddress}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-300 text-black"
                placeholder="Enter physical address"
                rows={3}
                required
              />
            </div>

            {/* Location */}
            <div className="mb-4">
              <label
                htmlFor="location"
                className="block text-black font-medium mb-2"
              >
                Location
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-300 text-black"
                placeholder="Enter location"
                required
              />
            </div>

            {/* Assigned Tractor */}
            <div className="mb-4">
              <label
                htmlFor="assignedTractor"
                className="block text-black font-medium mb-2"
              >
                Assigned Tractor
              </label>
              <input
                type="text"
                id="assignedTractor"
                name="assignedTractor"
                value={formData.assignedTractor}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-300 text-black"
                placeholder="Enter assigned tractor name/model"
                required
              />
            </div>

            {/* New Registration Number */}
            <div className="mb-4">
              <label
                htmlFor="newRegistrationNumber"
                className="block text-black font-medium mb-2"
              >
                New Registration Number
              </label>
              <input
                type="text"
                id="newRegistrationNumber"
                name="newRegistrationNumber"
                value={formData.newRegistrationNumber}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-300 text-black"
                placeholder="Enter registration number"
                required
              />
            </div>

            {/* Tractor ID */}
            <div className="mb-4">
              <label
                htmlFor="tractorId"
                className="block text-black font-medium mb-2"
              >
                Tractor ID
              </label>
              <input
                type="text"
                id="tractorId"
                name="tractorId"
                value={formData.tractorId}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-300 text-black"
                placeholder="Enter tractor ID"
                required
              />
            </div>

            {/* Welcome Email Status */}
            <div className="mb-4">
              <label
                htmlFor="welcomeEmailStatus"
                className="block text-black font-medium mb-2"
              >
                Welcome Email Status
              </label>
              <input
                type="text"
                id="welcomeEmailStatus"
                name="welcomeEmailStatus"
                value={formData.welcomeEmailStatus}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-300 text-black"
                placeholder="Enter email status (e.g., sent, pending)"
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full"
            >
              Register Tractor Owner
            </Button>
          </form>
        </div>
      </Modal>
    </>
  );
};

export default TractorRegistrationForm;
const customStyles = {
  overlay: {
    zIndex: 9999,
    backgroundColor: "rgba(0, 0, 0, 0.75)",
  },
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    padding: 0,
    borderRadius: "12px",
    border: "none",
    width: "90%", // Adjust width for responsiveness
    maxWidth: "600px",
  },
};
