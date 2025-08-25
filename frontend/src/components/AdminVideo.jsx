import { useEffect, useState } from 'react';
import axiosClient from '../utils/axiosClient'
import { NavLink } from 'react-router';

const AdminVideo = () => {
    const [problems, setProblems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    useEffect(() => {
        fetchProblems();
    }, []);

    const fetchProblems = async () => {
        try {
            setLoading(true);
            const { data } = await axiosClient.get('/problem/getAllProblem');
            setProblems(data);
        } catch (err) {
            setError('Failed to fetch problems');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this problem?')) return;

        try {
            await axiosClient.delete(`/video/delete/${id}`);
            setProblems(problems.filter(problem => problem._id !== id));
        } catch (err) {
            setError(err);
            console.log(err);
        }
    };


    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="alert alert-error shadow-lg my-4">
                <div>
                    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{error.response.data.error}</span>
                </div>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen overflow-hidden bg-[#F8F9FA] p-4 sm:p-6 font-sans">
           
            <div className="relative container mx-auto">
                <div className="text-center mb-12 motion-safe:animate-fade-in-up">
                    <h1 className="text-5xl font-bold mb-4 text-gray-800">
                        Manage Problem Videos
                    </h1>
                </div>

                <div className="card bg-white shadow-lg border border-gray-200/80 rounded-2xl p-4 transform-gpu motion-safe:animate-fade-in-up" style={{ animationDelay: '150ms' }}>
                    <div className="overflow-x-auto">
                        <table className="table w-full">
                            <thead>
                                <tr className="border-b-2 border-gray-200">
                                    <th className="w-1/12 bg-gray-50 text-left text-xs font-bold text-gray-600 uppercase tracking-wider p-4">#</th>
                                    <th className="w-4/12 bg-gray-50 text-left text-xs font-bold text-gray-600 uppercase tracking-wider p-4">Title</th>
                                    <th className="w-2/12 bg-gray-50 text-left text-xs font-bold text-gray-600 uppercase tracking-wider p-4">Difficulty</th>
                                    <th className="w-2/12 bg-gray-50 text-left text-xs font-bold text-gray-600 uppercase tracking-wider p-4">Tags</th>
                                    <th className="w-3/12 bg-gray-50 text-center text-xs font-bold text-gray-600 uppercase tracking-wider p-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {problems.map((problem, index) => (
                                    <tr key={problem._id} className="hover:bg-gray-50/80 transition-colors duration-200 border-b border-gray-200 last:border-b-0">
                                        <th className="bg-transparent text-gray-700 font-medium p-4">{index + 1}</th>
                                        <td className="bg-transparent text-gray-800 font-semibold p-4">{problem.title}</td>
                                        <td className="bg-transparent p-4">
                                            <span className={`badge border-0 capitalize font-medium py-3 px-3 ${problem.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                                                    problem.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                                                        'bg-red-100 text-red-800'
                                                }`}>
                                                {problem.difficulty}
                                            </span>
                                        </td>
                                        <td className="bg-transparent p-4">
                                            <span className="badge border-0 bg-gray-100 text-gray-800 font-medium py-3 px-3">
                                                {problem.tags}
                                            </span>
                                        </td>
                                        <td className="bg-transparent p-4">
                                            <div className="flex justify-center items-center space-x-2">
                                                <NavLink
                                                    to={`/admin/upload/${problem._id}`}
                                                    className="btn btn-sm bg-gray-800 text-white hover:bg-gray-900 border-0 transition-all duration-200 ease-in-out active:scale-95 gap-1"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path d="M9.25 13.25a.75.75 0 0 0 1.5 0V4.636l2.955 3.129a.75.75 0 0 0 1.09-1.03l-4.25-4.5a.75.75 0 0 0-1.09 0l-4.25 4.5a.75.75 0 1 0 1.09 1.03L9.25 4.636v8.614Z" /><path d="M3.5 12.75a.75.75 0 0 0-1.5 0v2.5A2.75 2.75 0 0 0 4.75 18h10.5A2.75 2.75 0 0 0 18 15.25v-2.5a.75.75 0 0 0-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5Z" /></svg>
                                                    Upload
                                                </NavLink>
                                                <button
                                                    onClick={() => handleDelete(problem._id)}
                                                    className="btn btn-sm bg-red-600 text-white hover:bg-red-700 border-0 transition-all duration-200 ease-in-out active:scale-95 gap-1"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 0 0 6 3.75v.443c-.795.077-1.58.22-2.365.468a.75.75 0 1 0 .23 1.482l.149-.022.841 10.518A2.75 2.75 0 0 0 7.596 19h4.807a2.75 2.75 0 0 0 2.742-2.53l.841-10.52.149.023a.75.75 0 0 0 .23-1.482A41.03 41.03 0 0 0 14 4.193v-.443A2.75 2.75 0 0 0 11.25 1h-2.5ZM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4ZM8.58 7.72a.75.75 0 0 0-1.5.06l.3 7.5a.75.75 0 1 0 1.5-.06l-.3-7.5Zm4.34.06a.75.75 0 1 0-1.5-.06l-.3 7.5a.75.75 0 1 0 1.5.06l.3-7.5Z" clipRule="evenodd" /></svg>
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminVideo;