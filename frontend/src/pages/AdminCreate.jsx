import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axiosClient from '../utils/axiosClient';
import { useNavigate } from 'react-router';

// Zod schema matching the problem schema
const problemSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().min(1, 'Description is required'),
    difficulty: z.enum(['easy', 'medium', 'hard']),
    tags: z.enum(['array', 'LinkedList', 'graph', 'dp']),
    visibleTestCases: z.array(
        z.object({
            input: z.string().min(1, 'Input is required'),
            output: z.string().min(1, 'Output is required'),
            explaination: z.string().min(1, 'Explanation is required')
        })
    ).min(1, 'At least one visible test case required'),
    hiddenTestCases: z.array(
        z.object({
            input: z.string().min(1, 'Input is required'),
            output: z.string().min(1, 'Output is required')
        })
    ).min(1, 'At least one hidden test case required'),
    startCode: z.array(
        z.object({
            language: z.enum(['c++', 'java', 'javascript']),
            initialCode: z.string().min(1, 'Initial code is required')
        })
    ).length(3, 'All three languages required'),
    referenceSolution: z.array(
        z.object({
            language: z.enum(['c++', 'java', 'javascript']),
            completeCode: z.string().min(1, 'Complete code is required')
        })
    ).length(3, 'All three languages required')
});

function AdminCreate() {
    const navigate = useNavigate();
    const {
        register,
        control,
        handleSubmit,
        formState: { errors }
    } = useForm({
        resolver: zodResolver(problemSchema),
        defaultValues: {
            startCode: [
                { language: 'c++', initialCode: '' },
                { language: 'java', initialCode: '' },
                { language: 'javascript', initialCode: '' }
            ],
            referenceSolution: [
                { language: 'c++', completeCode: '' },
                { language: 'java', completeCode: '' },
                { language: 'javascript', completeCode: '' }
            ]
        }
    });

    const {
        fields: visibleFields,
        append: appendVisible,
        remove: removeVisible
    } = useFieldArray({
        control,
        name: 'visibleTestCases'
    });

    const {
        fields: hiddenFields,
        append: appendHidden,
        remove: removeHidden
    } = useFieldArray({
        control,
        name: 'hiddenTestCases'
    });

    const onSubmit = async (data) => {
        try {
            await axiosClient.post('/problem/create', data);
            alert('Problem created successfully!');
            navigate('/');
        } catch (error) {
            alert(`Error: ${error.response?.data?.message || error.message}`);
        }
    };

    return (
        <>
              <div className="relative min-h-screen overflow-hidden bg-[#F8F9FA] font-sans">
                           <div className="relative container mx-auto p-4 sm:p-6 animate-[fadeIn_0.5s_ease-in-out]">
                    <h1 className="text-4xl font-bold mb-8 text-center text-red-900">
                        Create New Problem
                    </h1>

                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="max-w-5xl mx-auto space-y-8"
                    >
                        {/* Basic Information Card */}
                        <div className="card bg-white shadow-lg border border-gray-200/80 rounded-2xl p-6 sm:p-8">
                            <h2 className="text-2xl font-bold mb-6 border-b border-gray-200 pb-4 text-gray-900">
                                Basic Information
                            </h2>
                            <div className="space-y-4">
                                {/* Title */}
                                <div className="form-control">
                                    <label className="label font-medium text-gray-700">Title</label>
                                    <input
                                        {...register("title", { required: "Title is required" })}
                                        className={`input input-bordered w-full h-12 bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500 transition-all duration-300 ${errors.title ? "input-error border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
                                        placeholder="e.g., Two Sum"
                                    />
                                    {errors.title && <span className="text-red-600 text-sm mt-1">{errors.title.message}</span>}
                                </div>

                                {/* Description */}
                                <div className="form-control">
                                    <label className="label font-medium text-gray-700">Description</label>
                                    <textarea
                                        {...register("description", { required: "Description is required" })}
                                        className={`textarea textarea-bordered h-32 w-full bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500 transition-all duration-300 ${errors.description ? "textarea-error border-red-500 focus:border-red-500 focus:ring-red-500" : ""}`}
                                        placeholder="Describe the problem clearly..."
                                    />
                                    {errors.description && <span className="text-red-600 text-sm mt-1">{errors.description.message}</span>}
                                </div>

                                {/* Difficulty + Tag */}
                                <div className="flex flex-col md:flex-row gap-4">
                                    <div className="form-control w-full">
                                        <label className="label font-medium text-gray-700">Difficulty</label>
                                        <select {...register("difficulty", { required: "Difficulty is required" })} className={`select select-bordered w-full h-12 bg-gray-50 border-gray-300 text-gray-900 focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500 ${errors.difficulty && "select-error border-red-500"}`}>
                                            <option value="easy">Easy</option>
                                            <option value="medium">Medium</option>
                                            <option value="hard">Hard</option>
                                        </select>
                                    </div>
                                    <div className="form-control w-full">
                                        <label className="label font-medium text-gray-700">Tag</label>
                                        <select {...register("tags", { required: "Tag is required" })} className={`select select-bordered w-full h-12 bg-gray-50 border-gray-300 text-gray-900 focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500 ${errors.tags && "select-error border-red-500"}`}>
                                            <option value="array">Array</option>
                                            <option value="LinkedList">Linked List</option>
                                            <option value="graph">Graph</option>
                                            <option value="dp">Dynamic Programming</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Test Cases Card */}
                        <div className="card bg-white shadow-lg border border-gray-200/80 rounded-2xl p-6 sm:p-8">
                            <h2 className="text-2xl font-bold mb-6 border-b border-gray-200 pb-4 text-gray-900">
                                Test Cases
                            </h2>

                            {/* Visible Test Cases */}
                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between items-center">
                                    <h3 className="font-semibold text-lg text-gray-800">Visible Test Cases</h3>
                                    <button type="button" onClick={() => appendVisible({ input: "", output: "", explaination: "" })} className="btn btn-sm bg-gray-800 text-white hover:bg-gray-900 active:scale-95">
                                        + Add Case
                                    </button>
                                </div>
                                {visibleFields.map((field, index) => (
                                    <div key={field.id ?? index} className="border border-gray-200 p-4 rounded-xl bg-gray-50 space-y-3">
                                        <div className="flex justify-end">
                                            <button type="button" onClick={() => removeVisible(index)} className="btn btn-xs btn-ghost text-red-500 hover:bg-red-50">Remove</button>
                                        </div>
                                        <input {...register(`visibleTestCases.${index}.input`)} placeholder="Input" className="input input-bordered w-full bg-white border-gray-300 text-gray-900 focus:border-gray-500 focus:ring-1 focus:ring-gray-500" />
                                        <input {...register(`visibleTestCases.${index}.output`)} placeholder="Output" className="input input-bordered w-full bg-white border-gray-300 text-gray-900 focus:border-gray-500 focus:ring-1 focus:ring-gray-500" />
                                        <textarea {...register(`visibleTestCases.${index}.explaination`)} placeholder="Explanation (Optional)" className="textarea textarea-bordered w-full bg-white border-gray-300 text-gray-900 focus:border-gray-500 focus:ring-1 focus:ring-gray-500" />
                                    </div>
                                ))}
                            </div>

                            {/* Hidden Test Cases */}
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <h3 className="font-semibold text-lg text-gray-800">Hidden Test Cases</h3>
                                    <button type="button" onClick={() => appendHidden({ input: "", output: "" })} className="btn btn-sm bg-gray-800 text-white hover:bg-gray-900 active:scale-95">
                                        + Add Case
                                    </button>
                                </div>
                                {hiddenFields.map((field, index) => (
                                    <div key={field.id ?? index} className="border border-gray-200 p-4 rounded-xl bg-gray-50 space-y-3">
                                        <div className="flex justify-end">
                                            <button type="button" onClick={() => removeHidden(index)} className="btn btn-xs btn-ghost text-red-500 hover:bg-red-50">Remove</button>
                                        </div>
                                        <input {...register(`hiddenTestCases.${index}.input`)} placeholder="Input" className="input input-bordered w-full bg-white border-gray-300 text-gray-900 focus:border-gray-500 focus:ring-1 focus:ring-gray-500" />
                                        <input {...register(`hiddenTestCases.${index}.output`)} placeholder="Output" className="input input-bordered w-full bg-white border-gray-300 text-gray-900 focus:border-gray-500 focus:ring-1 focus:ring-gray-500" />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Code Templates Card */}
                        <div className="card bg-white shadow-lg border border-gray-200/80 rounded-2xl p-6 sm:p-8">
                            <h2 className="text-2xl font-bold mb-6 border-b border-gray-200 pb-4 text-gray-900">
                                Code Templates
                            </h2>
                            <div className="space-y-8">
                                {["C++", "Java", "JavaScript"].map((lang, index) => (
                                    <div key={lang} className="space-y-4">
                                        <h3 className="font-semibold text-lg text-gray-800">{lang}</h3>
                                        <div className="form-control">
                                            <label className="label font-medium text-gray-700">Initial Code</label>
                                            <textarea {...register(`startCode.${index}.initialCode`)} className="textarea textarea-bordered font-mono w-full bg-gray-900 text-gray-100 rounded-lg border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500" rows={6} placeholder="Starter template..." />
                                        </div>
                                        <div className="form-control">
                                            <label className="label font-medium text-gray-700">Reference Solution</label>
                                            <textarea {...register(`referenceSolution.${index}.completeCode`)} className="textarea textarea-bordered font-mono w-full bg-gray-900 text-gray-100 rounded-lg border-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500" rows={6} placeholder="Solution code..." />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <button type="submit" className="btn btn-lg bg-gray-800 hover:bg-red-500 w-full text-white text-lg active:scale-[0.98] transition-transform duration-200 ease-in-out">
                            Create Problem
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}

export default AdminCreate;