import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink } from "react-router";
import { logoutUser } from "../authSlice";
import { useEffect, useState } from "react";
import axiosClient from "../utils/axiosClient";

function Homepage() {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const [Problems, setProblems] = useState([]);
    const [Solvedproblems, setSolvedProblems] = useState([]);

    const [filters, setFilter] = useState({
        difficulty: "all",
        tags: "all",
        status: "all"
    });

    useEffect(() => {
        const fetchProblem = async () => {
            try {
                const { data } = await axiosClient.get("/problem/getAllProblem");
                setProblems(data);
            } catch (err) {
                console.error("Error Fetching problem", err);
            }
        };

        const fetchSolvedProblem = async () => {
            try {
                const { data } = await axiosClient.get("/problem/problemSolvedUser");
                setSolvedProblems(data);
            } catch (err) {
                console.error("Error Fetching solved problems", err);
            }
        };

        fetchProblem();
        if (user) fetchSolvedProblem();
    }, [user]);

    const handleLogout = () => {
        dispatch(logoutUser());
        setSolvedProblems([]);
    };

    // Filtering Logic
    const filteredProblem = Problems.filter(problem => {
        const difficultyMatch =
            filters.difficulty === "all" ||
            problem.difficulty.toLowerCase() === filters.difficulty;

        const tagMatch =
            filters.tags === "all" ||
            (Array.isArray(problem.tags)
                ? problem.tags.map(t => t.toLowerCase()).includes(filters.tags)
                : problem.tags.toLowerCase() === filters.tags);

        let statusMatch = true;
        if (filters.status === "solved") {
            statusMatch = Solvedproblems.some(sp => sp._id === problem._id);
        } else if (filters.status === "unsolved") {
            statusMatch = !Solvedproblems.some(sp => sp._id === problem._id);
        }

        return difficultyMatch && tagMatch && statusMatch;
    });

    // Dropdown filters config
    const filtersConfig = [
        {
            type: "status",
            default: "Status",
            options: [
                { label: "All Problems", value: "all" },
                { label: "Solved Problems", value: "solved" },
                { label: "Unsolved Problems", value: "unsolved" }
            ]
        },
        {
            type: "difficulty",
            default: "Difficulty",
            options: [
                { label: "All Difficulties", value: "all" },
                { label: "Easy", value: "easy" },
                { label: "Medium", value: "medium" },
                { label: "Hard", value: "hard" }
            ]
        },
        {
            type: "tags",
            default: "Tags",
            options: [
                { label: "All Tags", value: "all" },
                { label: "Array", value: "array" },
                { label: "Linked List", value: "linked list" },
                { label: "Graph", value: "graph" }
            ]
        }
    ];

    return (
        <>
            <div className="relative min-h-screen bg-[#F8F9FA] font-sans">
                <div className="relative min-h-screen">
                    {/* Navbar */}
                    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-lg border-b border-gray-200/80 px-4 sm:px-6">
                        <div className="navbar max-w-7xl mx-auto">
                            <div className="flex-1">
                                <Link
                                    to="/"
                                    className="btn btn-ghost text-xl font-bold text-gray-800 transition-colors duration-200 hover:bg-gray-100"
                                >
                                    Codex
                                </Link>
                            </div>
                            <div className="flex-none">
                                <div className="dropdown dropdown-end">
                                    <div
                                        tabIndex={0}
                                        role="button"
                                        className="btn btn-ghost normal-case text-gray-700 hover:bg-gray-100 transition-transform duration-200 ease-in-out"
                                    >
                                        {user?.first_name}
                                    </div>
                                    <ul
                                        tabIndex={0}
                                        className="mt-3 p-2 shadow-lg menu menu-sm dropdown-content bg-white/95 backdrop-blur-lg rounded-xl w-52 border border-gray-200/80 z-[1]"
                                    >
                                        <li className="text-gray-700 rounded-lg transition-colors duration-200 hover:bg-gray-100">
                                            <button onClick={handleLogout}>Logout</button>
                                        </li>
                                        {user?.role === "admin" && (
                                            <li className="text-gray-700 rounded-lg transition-colors duration-200 hover:bg-gray-100">
                                                <NavLink to="/admin">Admin</NavLink>
                                            </li>
                                        )}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </nav>

                    {/* Filters */}
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
                        <div className="flex flex-col sm:flex-row flex-wrap gap-4 justify-start mb-8">
                            {filtersConfig.map(filter => (
                                <div key={filter.type} className="dropdown w-full sm:w-auto">
                                    <div
                                        tabIndex={0}
                                        role="button"
                                        className="btn h-12 justify-between w-full sm:w-56 bg-white border-gray-300 text-gray-700 font-normal hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 ease-in-out"
                                    >
                                        <div className="flex items-center gap-2">
                                            <span>
                                                {
                                                    filter.options.find(
                                                        opt => opt.value === filters[filter.type]
                                                    )?.label || filter.default
                                                }
                                            </span>
                                        </div>
                                        <svg
                                            className="w-4 h-4 opacity-50"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M19 9l-7 7-7-7"
                                            />
                                        </svg>
                                    </div>
                                    <ul
                                        tabIndex={0}
                                        className="dropdown-content menu p-2 shadow-lg bg-white rounded-xl w-full sm:w-56 border border-gray-200/80 z-[1]"
                                    >
                                        {filter.options.map(opt => (
                                            <li
                                                key={opt.value}
                                                className="text-gray-700 rounded-lg transition-colors duration-200 hover:bg-gray-100"
                                            >
                                                <a
                                                    onClick={() =>
                                                        setFilter({
                                                            ...filters,
                                                            [filter.type]: opt.value
                                                        })
                                                    }
                                                >
                                                    {opt.label}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>

                        {/* Problems List */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-[fadeIn_0.5s_ease-in-out]">
                            {filteredProblem.map(problem => (
                                <div
                                    key={problem._id}
                                    className="card bg-white shadow-md border border-gray-200/80 transition-all duration-300 hover:shadow-xl hover:-translate-y-1.5"
                                >
                                    <div className="card-body p-6">
                                        <div className="flex items-start justify-between mb-4">
                                            <h2 className="card-title text-xl font-bold text-gray-800 leading-tight">
                                                <NavLink
                                                    to={`/problem/${problem._id}`}
                                                    className="link link-hover text-gray-800 transition-colors duration-200 hover:text-blue-600"
                                                >
                                                    {problem.title}
                                                </NavLink>
                                            </h2>
                                            {Solvedproblems.some(
                                                sp => sp._id === problem._id
                                            ) && (
                                                    <div className="badge badge-lg bg-blue-100 text-blue-800 border-blue-200 font-semibold py-3 px-3">
                                                        Solved
                                                    </div>
                                                )}
                                        </div>

                                        <div className="flex flex-wrap gap-2">
                                            <div
                                                className={`badge ${getDifficultyBadgeColor(
                                                    problem.difficulty
                                                )} capitalize font-medium py-3 px-3`}
                                            >
                                                {problem.difficulty}
                                            </div>
                                            <div className="badge bg-gray-100 text-gray-800 border-gray-200 capitalize font-medium py-3 px-3">
                                                {Array.isArray(problem.tags)
                                                    ? problem.tags.join(", ")
                                                    : problem.tags}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

const getDifficultyBadgeColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
        case "easy":
            return "badge-success";
        case "medium":
            return "badge-warning";
        case "hard":
            return "badge-error";
        default:
            return "badge-neutral";
    }
};

export default Homepage;
