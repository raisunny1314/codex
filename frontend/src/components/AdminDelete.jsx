import { useEffect, useState } from 'react';
import axiosClient from '../utils/axiosClient';

const AdminDelete = () => {
    const [problems, setProblems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState(""); 

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
            await axiosClient.delete(`/problem/delete/${id}`);
            setProblems(problems.filter(problem => problem._id !== id));
        } catch (err) {
            setError('Failed to delete problem');
            console.error(err);
        }
    };

  
    const filteredProblems = problems.filter(p =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p._id.toLowerCase().includes(searchTerm.toLowerCase())
    );

   
    if (loading) {
        return (
            <div className="relative min-h-screen flex justify-center items-center bg-slate-900">
                <div className="absolute inset-0">
                    <div className="absolute bottom-0 left-[-20%] right-0 top-[-10%] h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle_farthest-side,rgba(255,0,1,0.15),rgba(255,255,255,0))]"></div>
                    <div className="absolute bottom-0 right-[-20%] top-[-10%] h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle_farthest-side,rgba(255,0,1,0.15),rgba(255,255,255,0))]"></div>
                </div>
                <span className="loading loading-spinner loading-lg text-error"></span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="relative min-h-screen p-4 bg-slate-900">
                <div className="absolute inset-0">
                    <div className="absolute bottom-0 left-[-20%] right-0 top-[-10%] h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle_farthest-side,rgba(255,0,1,0.15),rgba(255,255,255,0))]"></div>
                </div>
                <div className="relative card bg-red-500/10 backdrop-blur-lg border border-red-500/50 shadow-lg my-4 max-w-2xl mx-auto">
                    <div className="card-body flex-row items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        <span className="text-red-300">{error}</span>
                    </div>
                </div>
            </div>
        );
    }

    return (

        <div className="relative min-h-screen overflow-hidden bg-[#F8F9FA] p-4 sm:p-6 font-sans">
         

            <div className="relative container mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 motion-safe:animate-fade-in-up">
                    <h1 className="text-4xl font-bold text-gray-800">
                        Manage Problems
                    </h1>
                    <input
                        type="text"
                        placeholder="Search by title or ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="input input-bordered w-full md:w-80 h-12 bg-white border-gray-300 placeholder:text-gray-400 focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500 transition-all duration-300"
                    />
                </div>

                <div className="card bg-white shadow-lg border border-gray-200/80 rounded-2xl p-4 transform-gpu motion-safe:animate-fade-in-up" style={{ animationDelay: '150ms' }}>
                    <div className="overflow-x-auto">
                        <table className="table w-full">
                            <thead>
                                <tr className="border-b-2 border-gray-200">
                                    <th className="w-1/12 bg-gray-50 text-left text-xs font-bold text-gray-600 uppercase tracking-wider p-4">#</th>
                                    <th className="w-4/12 bg-gray-50 text-left text-xs font-bold text-gray-600 uppercase tracking-wider p-4">Title</th>
                                    <th className="w-2/12 bg-gray-50 text-left text-xs font-bold text-gray-600 uppercase tracking-wider p-4">Difficulty</th>
                                    <th className="w-3/12 bg-gray-50 text-left text-xs font-bold text-gray-600 uppercase tracking-wider p-4">Tags</th>
                                    <th className="w-2/12 bg-gray-50 text-right text-xs font-bold text-gray-600 uppercase tracking-wider p-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredProblems.map((problem, index) => (
                                    <tr key={problem._id} className="hover:bg-gray-50/80 transition-colors duration-200">
                                        <th className="bg-transparent text-gray-700 font-medium border-b border-gray-200 p-4">{index + 1}</th>
                                        <td className="bg-transparent text-gray-800 font-medium border-b border-gray-200 p-4">{problem.title}</td>
                                        <td className="bg-transparent border-b border-gray-200 p-4">
                                            <span className={`badge border-0 capitalize font-medium py-3 px-3 ${problem.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                                                    problem.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                                                        'bg-red-100 text-red-800'
                                                }`}>
                                                {problem.difficulty}
                                            </span>
                                        </td>
                                        <td className="bg-transparent border-b border-gray-200 p-4">
                                            <span className="badge border-0 bg-blue-100 text-blue-800 font-medium py-3 px-3">
                                                {problem.tags}
                                            </span>
                                        </td>
                                        <td className="bg-transparent border-b border-gray-200 p-4">
                                            <div className="flex justify-end">
                                                <button
                                                    onClick={() => handleDelete(problem._id)}
                                                    className="btn btn-sm bg-red-600 text-white border-red-600 hover:bg-red-700 hover:border-red-700 transition-all duration-200 active:scale-95"
                                                >
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

export default AdminDelete;