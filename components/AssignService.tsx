"use client"

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"

export default function AssignService({ technicians = [], requests = [], onAssign, tractor = [], parts = [] }: any) {
  const [selectedTechnician, setSelectedTechnician] = useState<string | null>(null)
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null)
  const [selectedTractor, setSelectedTractor] = useState<string | null>(null)
  const [selectedMaintenance, setSelectedMaintenance] = useState<string | null>(null)
  const [selectedProblem, setSelectedProblem] = useState<string | null>(null)
  const [selectedParts, setSelectedParts] = useState<any[]>([])
  const [selectedQuantities, setSelectedQuantities] = useState<{
    [key: string]: number
  }>({})
  const [selectedPriority, setSelectedPriority] = useState<string | null>(null)

  // Safe data filtering to prevent undefined errors
  const safeTechnicians = Array.isArray(technicians)
    ? technicians.filter((tech) => tech && tech._id && tech.firstName && tech.lastName)
    : []

  const safeRequests = Array.isArray(requests) ? requests.filter((req) => req && req.id && req.description) : []

  const safeTractors = Array.isArray(tractor) ? tractor.filter((item) => item && item._id && item.name) : []

  const safeParts = Array.isArray(parts) ? parts.filter((part) => part && part._id && part.partName) : []

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
      }))

      if (onAssign) {
        onAssign(
          selectedTechnician,
          selectedRequest,
          selectedTractor,
          selectedMaintenance,
          selectedProblem,
          selectedPriority,
          partsWithQuantities,
        )
      }

      // Reset form after successful assignment
      setSelectedTechnician(null)
      setSelectedRequest(null)
      setSelectedTractor(null)
      setSelectedMaintenance(null)
      setSelectedProblem(null)
      setSelectedParts([])
      setSelectedQuantities({})
      setSelectedPriority(null)
    }
  }

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
  ]

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
  ]

  const priorities = ["low", "medium", "high", "urgent"]

  function handlePartSelection(partId: string) {
    setSelectedParts((prev) => {
      if (prev.includes(partId)) {
        // Remove part & quantity
        const filtered = prev.filter((id) => id !== partId)
        setSelectedQuantities((qtys) => {
          const newQt = { ...qtys }
          delete newQt[partId]
          return newQt
        })
        return filtered
      } else {
        // Add part with default quantity 1
        setSelectedQuantities((qtys) => ({ ...qtys, [partId]: 1 }))
        return [...prev, partId]
      }
    })
  }

  function handleQuantityChange(partId: string, quantity: number) {
    setSelectedQuantities((qtys) => ({ ...qtys, [partId]: quantity }))
  }

  // Show message if no data is available
  if (safeTechnicians.length === 0 && safeTractors.length === 0 && safeParts.length === 0) {
    return (
      <div className="w-full flex justify-end">
        <Button disabled className="bg-gray-400 my-4">
          No Data Available
        </Button>
      </div>
    )
  }

  return (
    <Dialog>
      <DialogTrigger asChild className="w-full flex justify-end">
        <div>
          <Button className="bg-orange-400 my-4">Assign Service</Button>
        </div>
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Assign Service Request</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {/* Service Request Dropdown */}
          {safeRequests.length > 0 ? (
            <Select onValueChange={(value) => setSelectedRequest(value)} value={selectedRequest || ""}>
              <SelectTrigger>
                <SelectValue placeholder="Select a Service Request" />
              </SelectTrigger>
              <SelectContent>
                {safeRequests.map((request: any) => (
                  <SelectItem key={request.id} value={request.id + request.description}>
                    {request.description} (ID: {request.id})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <div className="text-sm text-gray-500 p-2 border rounded">No service requests available</div>
          )}

          {/* Technician Dropdown */}
          {safeTechnicians.length > 0 ? (
            <Select onValueChange={(value) => setSelectedTechnician(value)} value={selectedTechnician || ""}>
              <SelectTrigger>
                <SelectValue placeholder="Select a Technician" />
              </SelectTrigger>
              <SelectContent>
                {safeTechnicians.map((technician: any) => (
                  <SelectItem key={technician._id} value={technician._id}>
                    <div className="flex flex-col">
                      <span>
                        {technician.firstName} {technician.lastName}
                      </span>
                      <span className="text-xs text-gray-500">
                        {technician.specialty || "General"} • {technician.status || "active"}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <div className="text-sm text-gray-500 p-2 border rounded">No technicians available</div>
          )}

          {/* Tractor Dropdown */}
          {safeTractors.length > 0 ? (
            <Select onValueChange={(value) => setSelectedTractor(value)} value={selectedTractor || ""}>
              <SelectTrigger>
                <SelectValue placeholder="Select a Tractor" />
              </SelectTrigger>
              <SelectContent>
                {safeTractors.map((item: any) => (
                  <SelectItem key={item._id} value={item._id}>
                    <div className="flex flex-col">
                      <span>
                        {item.tractorId || "Unknown ID"} - {item.name}
                      </span>
                      <span className="text-xs text-gray-500">
                        Hours: {item.tractorInfo?.hours || item.hours || "N/A"}
                        {item.model && ` • Model: ${item.model}`}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <div className="text-sm text-gray-500 p-2 border rounded">No tractors available</div>
          )}

          {/* Maintenance Dropdown */}
          <Select onValueChange={(value) => setSelectedMaintenance(value)} value={selectedMaintenance || ""}>
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
          <Select onValueChange={(value) => setSelectedProblem(value)} value={selectedProblem || ""}>
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
          <Select onValueChange={(value) => setSelectedPriority(value)} value={selectedPriority || ""}>
            <SelectTrigger>
              <SelectValue placeholder="Select Priority" />
            </SelectTrigger>
            <SelectContent>
              {priorities.map((priority, index) => (
                <SelectItem key={index} value={priority}>
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        priority === "high"
                          ? "bg-red-500"
                          : priority === "urgent"
                            ? "bg-red-700"
                            : priority === "medium"
                              ? "bg-yellow-500"
                              : "bg-blue-500"
                      }`}
                    />
                    {priority.charAt(0).toUpperCase() + priority.slice(1)}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Parts Selection */}
          {safeParts.length > 0 ? (
            <div>
              <h4 className="font-medium mb-2">Select Parts Needed</h4>
              <div className="space-y-2 max-h-40 overflow-y-auto border rounded p-2">
                {safeParts.map((part: any) => (
                  <div key={part._id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`part-${part._id}`}
                      value={part._id}
                      checked={selectedParts.includes(part._id)}
                      onChange={() => handlePartSelection(part._id)}
                      className="mr-2"
                    />
                    <label htmlFor={`part-${part._id}`} className="flex-1 text-sm">
                      <div className="flex flex-col">
                        <span>{part.partName}</span>
                        <span className="text-xs text-gray-500">
                          Number: {part.partNumber || "N/A"} • Stock: {part.stockQuantity || part.quantity || 0}
                        </span>
                      </div>
                    </label>
                    {/* Quantity input for this part */}
                    {selectedParts.includes(part._id) && (
                      <input
                        type="number"
                        min={1}
                        max={part.stockQuantity || part.quantity || 999}
                        value={selectedQuantities[part._id] || 1}
                        onChange={(e) => {
                          let val = Number(e.target.value)
                          const maxStock = part.stockQuantity || part.quantity || 999
                          if (val > maxStock) val = maxStock
                          if (val < 1) val = 1
                          handleQuantityChange(part._id, val)
                        }}
                        className="w-16 border rounded px-1 text-sm"
                        aria-label={`Quantity for ${part.partName}`}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-sm text-gray-500 p-2 border rounded">No parts available</div>
          )}

          {/* Assign Button */}
          <Button
            className="w-full bg-orange-400 hover:bg-orange-500"
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
            Assign Service Request
          </Button>

          {/* Show what's missing */}
          {(!selectedTechnician ||
            !selectedRequest ||
            !selectedTractor ||
            !selectedMaintenance ||
            !selectedProblem ||
            !selectedPriority ||
            selectedParts.length === 0) && (
            <div className="text-xs text-gray-500 mt-2">
              Please fill in all required fields to assign the service request.
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
