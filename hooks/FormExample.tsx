"use client"
import React, { useState } from "react";
import { z } from "zod";

const recipeSchema = z.object({
  title: z.string().min(1, "Title is required"),
  ingredients: z.string().min(1, "Ingredients are required"),
});

type RecipeFormValues = z.infer<typeof recipeSchema>;

const FormExample: React.FC = () => {
  const [formData, setFormData] = useState<RecipeFormValues>({
    title: "",
    ingredients: "",
  });
  const [errors, setErrors] = useState<Partial<RecipeFormValues>>({});
  const [isOpen, setIsOpen] = useState(false);

  const validateForm = (data: RecipeFormValues) => {
    try {
      recipeSchema.parse(data);
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const formattedErrors: Partial<RecipeFormValues> = {};
        error.errors.forEach((err) => {
          const path = err.path[0] as keyof RecipeFormValues;
          formattedErrors[path] = err.message;
        });
        setErrors(formattedErrors);
      }
      return false;
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isOpen) setIsOpen(false); // Close the form if it's open
    if (validateForm(formData)) {
      console.log("Form Data:", formData);
      setFormData({ title: "", ingredients: "" }); // Reset form data
      // Handle successful submission
    }
  };

  return (
    <div>
      <div className="flex justify-end">
      <button className="bg-primary text-white px-4 py-2 rounded-lg" onClick={()=>setIsOpen(true)}>+ Add Ingredient</button>
      </div>
      {isOpen &&
      <div className="absolute top-0 bg-slate-300 left-0 w-full h-screen flex items-center justify-center"><form onSubmit={handleSubmit} className="space-y-4 p-4  bg-white shadow-md rounded-md z-10 p-4 py-8 w-96 relative ">
        <h2 className="text-2xl font-semibold mb-4">Add a New Recipe</h2>
        <button className="absolute border-none cursor-pointer text-[2rem] top-2 right-2 text-red-500" onClick={()=>setIsOpen(false)}>X</button>
        <div>
          <label className="block font-semibold">Recipe Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="border rounded p-2 w-full"
          />
          {errors.title && (
            <p className="text-red-500">{errors.title}</p>
          )}
        </div>
        <div>
          <label className="block font-semibold">Ingredients</label>
          <textarea
            name="ingredients"
            value={formData.ingredients}
            onChange={handleChange}
            className="border rounded p-2 w-full"
          />
          {errors.ingredients && (
            <p className="text-red-500">{errors.ingredients}</p>
          )}
        </div>
        <button
          type="submit" 
          className="bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600"
        >
          Submit
        </button>
      </form></div>}
    </div>
  );
};

export default FormExample;