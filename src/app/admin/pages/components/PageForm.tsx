// "use client";

// import { useForm } from "react-hook-form";
// import { PageDetails } from "@/types/pages";
// import { useRouter } from "next/navigation";
// import { createPage } from "@/app/admin/pages/actions/create"; // Adjust the import path as necessary
// import { updatePage } from "@/app/admin/pages/actions/update"; // Adjust the import path as necessary
// import { useState } from "react";

// // src/app/admin/pages/components/PageForm.tsx

// interface PageFormField {
//   name: string; // The name of the field, used for form registration
//   label: string; // The label displayed for the field
//   type: 'text' | 'textarea' | 'select' | 'file'; // Specify the type of input
//   required?: boolean; // Indicates if the field is required
//   placeholder?: string; // Placeholder text for the input
//   options?: Array<{ value: string; label: string }>; // Options for select fields
// }

// interface PageFormProps {
//   defaultValues?: PageDetails; // Default values for the form
//   isLoading?: boolean; // Loading state for the form submission
//   fields: PageFormField[]; // Array of fields to render in the form
// }

// export default function PageForm({
//   defaultValues,
//   isLoading,
//   fields,
// }: PageFormProps) {
//   const router = useRouter();
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm<PageDetails>({
//     defaultValues: {
//       title: defaultValues?.title || "",
//       content: defaultValues?.content || {},
//     },
//   });

//   const [file, setFile] = useState<File | null>(null); // State to hold the file

//   const onSubmit = async (data: PageDetails) => {
//     try {
//       const formData = new FormData();
//       formData.append("title", data.title);
//       formData.append("content", JSON.stringify(data.content));
//       if (file) {
//         formData.append("file", file); // Append the file to the form data
//       }

//       let response;
//       if (defaultValues) {
//         // If defaultValues exist, we are updating an existing page
//         response = await updatePage(formData, defaultValues.id); // Call the update action
//       } else {
//         // Otherwise, we are creating a new page
//         response = await createPage(formData); // Call the create action
//       }

//       if (response.success) {
//         router.refresh();
//       } else {
//         console.error(response.error);
//       }
//     } catch (error) {
//       console.error("Error saving page:", error);
//     }
//   };

//   const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const selectedFile = event.target.files?.[0];
//     if (selectedFile) {
//       setFile(selectedFile); // Set the file state
//     } else {
//       setFile(null);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
//       <div className="space-y-8">
//         {fields.map((field) => (
//           <div key={field.name} className="form-control w-full">
//             <label className="label">
//               <span className="label-text">{field.label}</span>
//             </label>
//             {field.type === "textarea" ? (
//               <textarea
//                 {...register(field.name, { required: field.required })}
//                 className={`textarea textarea-bordered w-full ${errors[field.name] ? "textarea-error" : ""}`}
//                 placeholder={field.placeholder}
//               />
//             ) : field.type === "select" ? (
//               <select
//                 {...register(field.name, { required: field.required })}
//                 className={`select select-bordered w-full ${errors[field.name] ? "select-error" : ""}`}
//               >
//                 {field.options?.map((option) => (
//                   <option key={option.value} value={option.value}>
//                     {option.label}
//                   </option>
//                 ))}
//               </select>
//             ) : (
//               <input
//                 type={field.type}
//                 {...register(field.name, { required: field.required })}
//                 className={`input input-bordered w-full ${errors[field.name] ? "input-error" : ""}`}
//                 placeholder={field.placeholder}
//               />
//             )}
//             {errors[field.name] && (
//               <label className="label">
//                 <span className="label-text-alt text-error">
//                   {errors[field.name].message}
//                 </span>
//               </label>
//             )}
//           </div>
//         ))}

//         {/* File Upload Section */}
//         <div className="form-control w-full">
//           <label className="label">
//             <span className="label-text">Upload File</span>
//           </label>
//           <input
//             type="file"
//             accept="*"
//             onChange={handleFileChange}
//             className="file-input file-input-bordered w-full"
//           />
//         </div>
//       </div>
//       <div className="flex items-center justify-between">
//         <button type="submit" disabled={isLoading} className="btn btn-primary">
//           {isLoading
//             ? "Saving..."
//             : defaultValues
//               ? "Save Changes"
//               : "Create Page"}
//         </button>
//       </div>
//     </form>
//   );
// }
