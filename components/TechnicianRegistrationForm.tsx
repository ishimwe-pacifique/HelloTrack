/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "./ui/button";
import Modal from "react-modal";
import axios from "axios";

type TechnicianFormData = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  specialty?: string;
  experienceYears?: number;
  certifications?: string;
  status?: string;
};

export default function TechnicianForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TechnicianFormData>();
  const [modalIsOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const onSubmit = async (data: TechnicianFormData) => {
    try {
      const response = await axios.post("/api/technician", data);
      if (response.status === 201) {
        alert("Technician registered successfully!");
        closeModal();
      }
    } catch (error:any) {
      alert("Error registering technician: " + error);
    }
  };

  return (
    <>
      <div className="flex justify-end">
        <Button onClick={openModal}>Register Technician</Button>
      </div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Modal"
        bodyOpenClassName="overflow-hidden"
        style={customStyles}
      >
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="max-w-2xl h-[80vh] overflow-y-auto z-30 mx-auto p-6 text-black shadow-md rounded-lg flex flex-col gap-4"
        >
          <h1 className="text-2xl font-bold mb-6">Register Technician</h1>
          <div>
            <label>First Name*</label>
            <input
              {...register("firstName", { required: true })}
              className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-300 text-black"
            />
            {errors.firstName && (
              <p className="text-red-500">First name is required</p>
            )}
          </div>

          <div>
            <label>Last Name*</label>
            <input
              {...register("lastName", { required: true })}
              className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-300 text-black"
            />
            {errors.lastName && (
              <p className="text-red-500">Last name is required</p>
            )}
          </div>

          <div>
            <label>Email*</label>
            <input
              type="email"
              {...register("email", { required: true })}
              className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-300 text-black"
            />
            {errors.email && <p className="text-red-500">Email is required</p>}
          </div>

          <div>
            <label>Phone Number*</label>
            <input
              {...register("phoneNumber", { required: true })}
              className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-300 text-black"
            />
            {errors.phoneNumber && (
              <p className="text-red-500">Phone number is required</p>
            )}
          </div>

          <div>
            <label>Specialty</label>
            <input
              {...register("specialty")}
              className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-300 text-black"
            />
          </div>

          <div>
            <label>Years of Experience</label>
            <input
              type="number"
              {...register("experienceYears", { valueAsNumber: true })}
              className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-300 text-black"
            />
          </div>

          <div>
            <label>Certifications (comma separated)</label>
            <input
              {...register("certifications")}
              className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-300 text-black"
            />
          </div>

          <div>
            <label>Status</label>
            <select {...register("status")} className="border p-2 w-full">
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {/* Normal submit button */}
          <Button
            type="submit"
            className="bg-orange-600 text-white px-4 py-2 rounded-lg"
          >
            Register
          </Button>
        </form>
      </Modal>
    </>
  );
}
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
