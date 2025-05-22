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
}: any) {
  const [selectedTechnician, setSelectedTechnician] = useState<string | null>(
    null
  );
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null);
  const [selectedTractor, setSelectedTractor] = useState<string | null>(null);

  const handleAssign = () => {
    if (selectedTechnician && selectedRequest && selectedTractor) {
      onAssign(selectedTechnician, selectedRequest, selectedTractor);
    }
  };

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
          <Select onValueChange={(value) => setSelectedRequest(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select a Service Request" />
            </SelectTrigger>
            <SelectContent>
              {requests.map((request: any) => (
                <SelectItem key={request.id} value={request.id}>
                  {request.description} (ID: {request.id})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

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
          <Select onValueChange={(value) => setSelectedTractor(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select a Tractor" />
            </SelectTrigger>
            <SelectContent>
              {tractor.map((technician: any) => (
                <SelectItem key={technician._id} value={technician._id}>
                  {technician.tractorId} {technician.name} <br />
                  <span>
                    hours: {technician.tractorInfo.hours} <br />
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            className="w-full"
            onClick={handleAssign}
            disabled={
              !selectedTechnician || !selectedRequest || !selectedTractor
            }
          >
            Assign
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
