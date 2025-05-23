import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import axios from "axios";

interface Part {
  _id?: string;
  partName: string;
  partNumber: string;
  quantity: number;
  unitPrice: number;
}

const PartsManagement: React.FC = () => {
  const [parts, setParts] = useState<Part[]>([]);
  const [formData, setFormData] = useState<Part>({
    _id: undefined,
    partName: "",
    partNumber: "",
    quantity: 1,
    unitPrice: 0,
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedPartId, setSelectedPartId] = useState<string | null>(null);

  // Fetch parts from the backend
  useEffect(() => {
    const fetchParts = async () => {
      const response = await axios.get("/api/parts");
      setParts(response.data);
    };
    fetchParts();
  }, []);

  // Handle form input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "quantity" || name === "unitPrice" ? parseFloat(value) : value,
    }));
  };

  // Add or update a part
  const handleSubmit = async () => {
    try {
      if (isEditMode && selectedPartId) {
        // Update part
        await axios.put(`/api/parts?id=${selectedPartId}`, formData);
      } else {
        // Add new part
        await axios.post("/api/parts", formData);
      }

      // Refresh parts list
      const response = await axios.get("/api/parts");
      setParts(response.data);

      // Reset form
      setFormData({ partName: "", partNumber: "", quantity: 1, unitPrice: 0 });
      setIsEditMode(false);
      setSelectedPartId(null);
    } catch (error) {
      console.error("Error saving part:", error);
    }
  };

  // Edit a part
  const handleEdit = (part: Part) => {
    setFormData(part);
    setIsEditMode(true);
    setSelectedPartId(part._id || null);
  };

  // Delete part after confirmation
  const handleDelete = async (deletePartId: string) => {
    console.log(deletePartId);
    if (!deletePartId) return;
    const confirmed = window.confirm(
      "Are you sure you want to delete this part?"
    );
    if (!confirmed) return;
    try {
      await axios.delete(`/api/parts?id=${deletePartId}`);
      const response = await axios.get("/api/parts");
      setParts(response.data);
      // If editing deleted part, reset form
      if (selectedPartId === deletePartId) {
        setFormData({
          partName: "",
          partNumber: "",
          quantity: 1,
          unitPrice: 0,
        });
        setIsEditMode(false);
        setSelectedPartId(null);
      }
    } catch (error) {
      console.error("Error deleting part:", error);
    }
  };
  // View parts table
  return (
    <div className="p-4 text-black">
      <Dialog>
        <DialogTrigger asChild>
          <Button className="bg-orange-400">
            {isEditMode ? "Update Part" : "Add Part"}
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEditMode ? "Update Part" : "Add Part"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label htmlFor="partName" className="block text-sm font-medium">
                Part Name
              </label>
              <Input
                id="partName"
                name="partName"
                value={formData.partName}
                onChange={handleChange}
                placeholder="Part Name"
              />
            </div>
            <div>
              <label htmlFor="partNumber" className="block text-sm font-medium">
                Part Number
              </label>
              <Input
                id="partNumber"
                name="partNumber"
                value={formData.partNumber}
                onChange={handleChange}
                placeholder="Part Number"
              />
            </div>
            <div>
              <label htmlFor="quantity" className="block text-sm font-medium">
                Quantity
              </label>
              <Input
                id="quantity"
                name="quantity"
                type="number"
                value={formData.quantity}
                onChange={handleChange}
                placeholder="Quantity"
              />
            </div>
            <div>
              <label htmlFor="unitPrice" className="block text-sm font-medium">
                Unit Price
              </label>
              <Input
                id="unitPrice"
                name="unitPrice"
                type="number"
                value={formData.unitPrice}
                onChange={handleChange}
                placeholder="Unit Price"
              />
            </div>
            <Button className="w-full" onClick={handleSubmit}>
              {isEditMode ? "Update Part" : "Add Part"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <h2 className="text-xl font-bold mt-6">Parts Inventory</h2>
      <table style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr>
            <th
              style={{
                border: "1px solid #ddd",
                padding: "8px",
                textAlign: "left",
              }}
            >
              Part Name
            </th>
            <th
              style={{
                border: "1px solid #ddd",
                padding: "8px",
                textAlign: "left",
              }}
            >
              Part Number
            </th>
            <th
              style={{
                border: "1px solid #ddd",
                padding: "8px",
                textAlign: "right",
              }}
            >
              Quantity
            </th>
            <th
              style={{
                border: "1px solid #ddd",
                padding: "8px",
                textAlign: "right",
              }}
            >
              Unit Price
            </th>
            <th
              style={{
                border: "1px solid #ddd",
                padding: "8px",
                textAlign: "center",
              }}
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {parts.map((part) => (
            <tr key={part._id} style={{ borderBottom: "1px solid #ddd" }}>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                {part.partName}
              </td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                {part.partNumber}
              </td>
              <td
                style={{
                  border: "1px solid #ddd",
                  padding: "8px",
                  textAlign: "right",
                }}
              >
                {part.quantity}
              </td>
              <td
                style={{
                  border: "1px solid #ddd",
                  padding: "8px",
                  textAlign: "right",
                }}
              >
                ${part.unitPrice.toFixed(2)}
              </td>
              <td
                style={{
                  border: "1px solid #ddd",
                  padding: "8px",
                  textAlign: "center",
                }}
              >
                <Button variant="outline" onClick={() => handleEdit(part)}>
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleDelete(part._id!)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PartsManagement;
