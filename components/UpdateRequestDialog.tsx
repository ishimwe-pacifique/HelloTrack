/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const UpdateRequestDialog = ({ request, onUpdate }: { request: any; onUpdate: (updatedData: any) => void }) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    status: request.status || "",
    notes: request.notes || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = () => {
    onUpdate(formData);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Update</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Service Request</DialogTitle>
          <DialogDescription>
            Make changes to the service request. Click save when you&#39;re done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
         <div className="grid grid-cols-1 gap-2">
  <Label htmlFor="status">Status</Label>
  <select
    id="status"
    name="status"
    value={formData.status}
    onChange={handleChange}
    className="border rounded-md p-2 text-gray-700 focus:ring-orange-500 focus:border-orange-500"
  >
    <option value="pending">Pending</option>
    <option value="in-progress">In-Progress</option>
    <option value="completed">Completed</option>
  </select>
</div>

         <div className="grid grid-cols-1 gap-2">
  <Label htmlFor="description">Description Notes</Label>
  <textarea
    id="description"
    name="notes"
    value={formData.notes || ""}
    onChange={handleChange}
    placeholder="Enter a description"
    className="p-2 border rounded-lg w-full"
  />
</div>

        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateRequestDialog;
