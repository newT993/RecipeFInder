"use client"
import React, { FC, useEffect, useState } from "react";
import { z } from "zod";

const ingredientSchema = z.object({
  name: z.string().min(1, "Name is required"),
  quantity: z.string().min(1, "Quantity is required"),
  categoryId: z.string().min(1, "Category is required"),
  expiryDate: z.string().optional(),
});

interface FormExampleProps {
  onSubmit: (ingredient: {
    name: string
    quantity: string
    categoryId: string
    expiryDate?: string
  }) => Promise<void>
}

type IngredientFormValues = z.infer<typeof ingredientSchema>;

const FormExample: FC<FormExampleProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<IngredientFormValues>({
    name: "",
    quantity: "",
    categoryId: "",
    expiryDate: "",
  });
  const [errors, setErrors] = useState<Partial<IngredientFormValues>>({});
  const [isOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState<Array<{ id: string; name: string }>>([])


  const validateForm = (data: IngredientFormValues) => {
    try {
      ingredientSchema.parse(data);
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const formattedErrors: Partial<IngredientFormValues> = {};
        error.errors.forEach((err) => {
          const path = err.path[0] as keyof IngredientFormValues;
          formattedErrors[path] = err.message;
        });
        setErrors(formattedErrors);
      }
      return false;
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (validateForm(formData)) {
      try {
        const ingredientData = {
          name: formData.name.trim(),
          quantity: formData.quantity.trim(),
          categoryId: formData.categoryId,
          expiryDate: formData.expiryDate || undefined,
        }
        await onSubmit(ingredientData)
        setFormData({
          name: "",
          quantity: "",
          categoryId: "",
          expiryDate: "",
        })
        setIsOpen(false)
      } catch (error) {
        console.error('Form submission error:', error)
      }
    }
  }

  useEffect(() => {
    const fetchCategories = async () => {
      const response = await fetch('/api/categories')
      const data = await response.json()
      setCategories(data)
    }
    fetchCategories()
  }, [])

  return (
    <div>
      <div className="flex justify-end">
        <button 
          className="bg-primary text-white px-4 py-2 rounded-lg" 
          onClick={() => setIsOpen(true)}
        >
          + Add Ingredient
        </button>
      </div>
      
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-xl p-6 w-96 relative">
            <h2 className="text-2xl font-semibold mb-6">Add New Ingredient</h2>
            <button 
              type="button"
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              onClick={() => setIsOpen(false)}
            >
              ✕
            </button>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter ingredient name"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantity
                </label>
                <input
                  type="text"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="e.g., 500g, 2 pieces"
                />
                {errors.quantity && (
                  <p className="text-red-500 text-sm mt-1">{errors.quantity}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {errors.categoryId && (
                  <p className="text-red-500 text-sm mt-1">{errors.categoryId}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Expiry Date
                </label>
                <input
                  type="date"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
                >
                  Add Ingredient
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default FormExample;