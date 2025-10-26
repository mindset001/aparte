"use client";
import { useState } from "react";
import { notification } from "antd";
import { useAppSelector } from "../../store";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Card } from "../ui/card";

export default function ApartmentUploadForm() {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    location: "",
    images: [] as File[],
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value, files } = e.target as HTMLInputElement;
    if (name === "images" && files) {
      setForm((prev) => ({ ...prev, images: Array.from(files) }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!isAuthenticated) {
      setError("You must be logged in to upload an apartment.");
      return;
    }
    if (!form.title || !form.description || !form.price || !form.location) {
      setError("All fields are required.");
      return;
    }
    if (!user?.uuid) {
      setError("User not authenticated. Please log in again.");
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("price", form.price);
      formData.append("location", form.location);
      form.images.forEach((file, idx) => formData.append("images", file));
      formData.append("ownerUuid", user.uuid);
      const res = await fetch(process.env.NEXT_PUBLIC_API_BASE_URL + "apartments", {
        method: "POST",
        body: formData,
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Upload failed");
      setSuccess(true);
      setForm({ title: "", description: "", price: "", location: "", images: [] });
      notification.success({
        message: "Apartment Uploaded",
        description: "Your apartment has been uploaded successfully!",
        placement: "topRight"
      });
    } catch (err: any) {
      setError(err.message);
      setSuccess(false);
      notification.error({
        message: "Upload Failed",
        description: err.message,
        placement: "topRight"
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-lg p-0 overflow-hidden shadow-2xl border-0 bg-white/90">
      <div className="px-10 py-12 flex flex-col gap-8">
        <div className="text-center">
          <h2 className="text-2xl font-extrabold text-indigo-800 mb-2">Upload Apartment</h2>
          <p className="text-gray-500 text-base">Fill in the details to list your apartment</p>
        </div>
        {success ? (
          <div className="text-green-600 text-center font-medium">Apartment uploaded successfully!</div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <Input name="title" type="text" placeholder="Title" value={form.title} onChange={handleChange} required className="bg-gray-50" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} required className="bg-gray-50 w-full min-h-[80px] rounded-md border border-gray-300 p-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
              <Input name="price" type="number" placeholder="Price" value={form.price} onChange={handleChange} required className="bg-gray-50" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <Input name="location" type="text" placeholder="Location" value={form.location} onChange={handleChange} required className="bg-gray-50" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Images</label>
              <Input name="images" type="file" multiple accept="image/*" onChange={handleChange} className="bg-gray-50" />
            </div>
            <Button type="submit" className="w-full mt-2 cursor-pointer" disabled={loading}>
              {loading ? "Uploading..." : "Upload"}
            </Button>
            {error && <div className="text-red-600 mt-2">{error}</div>}
          </form>
        )}
      </div>
    </Card>
  );
}
