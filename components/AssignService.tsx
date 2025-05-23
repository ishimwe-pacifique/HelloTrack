/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export default function AssignService({
  technicians,
  requests,
  onAssign,
  tractor,
  parts,
}: any) {
  const [selectedTechnician, setSelectedTechnician] = useState<string | null>(
    null
  );
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null);
  const [selectedTractor, setSelectedTractor] = useState<string | null>(null);
  const [selectedMaintenance, setSelectedMaintenance] = useState<string | null>(
    null
  );
  const [selectedProblem, setSelectedProblem] = useState<string | null>(null);
  const [selectedParts, setSelectedParts] = useState<any[]>([]);
  const [selectedQuantities, setSelectedQuantities] = useState<{
    [key: string]: number;
  }>({});
  const [selectedPriority, setSelectedPriority] = useState<string | null>(null);

  const handleAssign = () => {
    if (
      selectedTechnician &&
      selectedRequest &&
      selectedTractor &&
      selectedMaintenance &&
      selectedProblem &&
      selectedPriority &&
      selectedParts.length > 0
    ) {
      const partsWithQuantities = selectedParts.map((partId) => ({
        partId,
        quantity: selectedQuantities[partId] || 1,
      }));

      onAssign(
        selectedTechnician,
        selectedRequest,
        selectedTractor,
        selectedMaintenance,
        selectedProblem,
        selectedPriority,
        partsWithQuantities
      );
    }
  };

  const maintenanceTasks = [
    "Cleaning the Air Filter",
    "Changing Engine Oil",
    "Replacing the Hydraulic Filter",
    "Replacing the Engine Oil Filter",
    "Replacing the Fuel Filter",
    "Greasing Moving Parts",
    "Checking and Topping Up Coolant",
    "Inspecting and Inflating Tires",
    "Battery Maintenance",
    "Checking Belts and Hoses",
  ];

  const commonProblems = [
    "Clutch Plate Damage",
    "Brake Disc Damage",
    "Hydraulic System Issues",
    "Overheating Engine",
    "Battery Failure",
    "Transmission Problems",
    "Steering Problems",
    "Electrical Failures",
    "Fuel System Blockages",
    "Tyre Punctures or Wear",
  ];

  const priorities = ["low", "medium", "high", "urgent"];
  function handlePartSelection(partId: string) {
    setSelectedParts((prev) => {
      if (prev.includes(partId)) {
        // Remove part & quantity
        const filtered = prev.filter((id) => id !== partId);
        setSelectedQuantities((qtys) => {
          const newQt = { ...qtys };
          delete newQt[partId];
          return newQt;
        });
        return filtered;
      } else {
        // Add part with default quantity 1
        setSelectedQuantities((qtys) => ({ ...qtys, [partId]: 1 }));
        return [...prev, partId];
      }
    });
  }

  function handleQuantityChange(partId: string, quantity: number) {
    setSelectedQuantities((qtys) => ({ ...qtys, [partId]: quantity }));
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Assign Service</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign Service Request</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {/* Service Request Dropdown */}
          <Select onValueChange={(value) => setSelectedRequest(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select a Service Request" />
            </SelectTrigger>
            <SelectContent>
              {requests.map((request: any) => (
                <SelectItem
                  key={request.id}
                  value={request.id + request.description}
                >
                  {request.description} (ID: {request.id})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Technician Dropdown */}
          <Select onValueChange={(value) => setSelectedTechnician(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select a Technician" />
            </SelectTrigger>
            <SelectContent>
              {technicians.map((technician: any) => (
                <SelectItem key={technician._id} value={technician._id}>
                  {technician.firstName} {technician.lastName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Tractor Dropdown */}
          <Select onValueChange={(value) => setSelectedTractor(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select a Tractor" />
            </SelectTrigger>
            <SelectContent>
              {tractor.map((item: any) => (
                <SelectItem key={item._id} value={item._id}>
                  {item.tractorId} {item.name} <br />
                  <span>
                    hours: {item.tractorInfo.hours} <br />
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Maintenance Dropdown */}
          <Select onValueChange={(value) => setSelectedMaintenance(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select Routine Maintenance" />
            </SelectTrigger>
            <SelectContent>
              {maintenanceTasks.map((task, index) => (
                <SelectItem key={index} value={task}>
                  {task}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Common Problems Dropdown */}
          <Select onValueChange={(value) => setSelectedProblem(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select a Common Problem" />
            </SelectTrigger>
            <SelectContent>
              {commonProblems.map((problem, index) => (
                <SelectItem key={index} value={problem}>
                  {problem}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {/* Priority Dropdown */}
          <Select onValueChange={(value) => setSelectedPriority(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select Priority" />
            </SelectTrigger>
            <SelectContent>
              {priorities.map((priority, index) => (
                <SelectItem key={index} value={priority}>
                  {priority}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {/* Parts Dropdown */}
          <div>
            <h4 className="font-medium">Select Parts Needed</h4>
            <div className="space-y-2">
              {parts.map((part: any) => (
                <div key={part.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`part-${part.id}`}
                    value={part.id}
                    checked={selectedParts.includes(part._id)}
                    onChange={() => handlePartSelection(part._id)}
                    className="mr-2"
                  />

                  <label htmlFor={`part-${part._id}`}>
                    {part.partName} (Number: {part.partNumber})
                  </label>

                  {/* Quantity input for this part */}
                  {selectedParts.includes(part._id) && (
                    <input
                      type="number"
                      min={1}
                      max={part.quantity}
                      value={selectedQuantities[part._id] || 1}
                      onChange={(e) => {
                        let val = Number(e.target.value);
                        if (val > part.quantity) val = part.quantity;
                        if (val < 1) val = 1;

                        handleQuantityChange(part._id, val);
                      }}
                      className="w-16 border rounded px-1"
                      aria-label={`Quantity for ${part.partName}`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Assign Button */}
          <Button
            className="w-full bg-orange-400"
            onClick={handleAssign}
            disabled={
              !selectedTechnician ||
              !selectedRequest ||
              !selectedTractor ||
              !selectedMaintenance ||
              !selectedProblem ||
              !selectedPriority ||
              selectedParts.length === 0
            }
          >
            Assign
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
