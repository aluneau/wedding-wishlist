import { useState } from "react";

function AddItems() {
  const [form, setForm] = useState({
    name: "",
    description: "",
    imageUrl: "",
    amazonUrl: "",
    password: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("http://localhost:8080/api/items", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Admin-Key": form.password },
      body: JSON.stringify(form),
    });
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-2xl shadow-md space-y-5">
      <h2 className="text-2xl font-semibold text-gray-800">Add Item</h2>
      < form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 space-y-4" >
        <input name="password"
          placeholder="password"
          className="input input-bordered w-full"
          type="password"
          onChange={handleChange}
          value={form.password}
        />
        <input
          name="name"
          placeholder="Item name"
          className="input input-bordered w-full"
          onChange={handleChange}
          value={form.name}
        />
        <input
          name="description"
          placeholder="Description"
          className="input input-bordered w-full"
          onChange={handleChange}
          value={form.description}
        />
        <input
          name="imageUrl"
          placeholder="Image URL"
          className="input input-bordered w-full"
          onChange={handleChange}
          value={form.imageUrl}
        />
        <input
          name="amazonUrl"
          placeholder="Amazon Link"
          className="input input-bordered w-full"
          onChange={handleChange}
          value={form.amazonUrl}
        />
        <button type="submit" className="btn btn-primary w-full">Add Item</button>
      </form >
    </div >
  );
}

export default AddItems;

