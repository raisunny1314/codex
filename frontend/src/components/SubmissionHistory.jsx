import { useState, useEffect } from 'react';
import axiosClient from '../utils/axiosClient';

const SubmissionHistory = ({ problemId }) => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        setLoading(true);
        const response = await axiosClient.get(`/problem/submittedProblem/${problemId}`);
        setSubmissions(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch submission history');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, [problemId]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'accepted': return 'badge-success';
      case 'wrong': return 'badge-error';
      case 'error': return 'badge-warning';
      case 'pending': return 'badge-info';
      default: return 'badge-neutral';
    }
  };

  const formatMemory = (memory) => {
    if (memory < 1024) return `${memory} kB`;
    return `${(memory / 1024).toFixed(2)} MB`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
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
          <span>{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 font-sans">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Submission History
      </h2>

      {submissions.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center flex flex-col items-center gap-4 motion-safe:animate-fade-in-up">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span className="text-gray-600 text-lg">No submissions found for this problem</span>
        </div>
      ) : (
        <div className="motion-safe:animate-fade-in-up">
          <div className="overflow-x-auto bg-white rounded-2xl border border-gray-200/80 shadow-lg">
            <table className="table w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="bg-gray-50 text-left text-xs font-bold text-gray-600 uppercase tracking-wider p-4">#</th>
                  <th className="bg-gray-50 text-left text-xs font-bold text-gray-600 uppercase tracking-wider p-4">Language</th>
                  <th className="bg-gray-50 text-left text-xs font-bold text-gray-600 uppercase tracking-wider p-4">Status</th>
                  <th className="bg-gray-50 text-left text-xs font-bold text-gray-600 uppercase tracking-wider p-4">Runtime</th>
                  <th className="bg-gray-50 text-left text-xs font-bold text-gray-600 uppercase tracking-wider p-4">Memory</th>
                  <th className="bg-gray-50 text-left text-xs font-bold text-gray-600 uppercase tracking-wider p-4">Test Cases</th>
                  <th className="bg-gray-50 text-left text-xs font-bold text-gray-600 uppercase tracking-wider p-4">Submitted</th>
                  <th className="bg-gray-50 text-center text-xs font-bold text-gray-600 uppercase tracking-wider p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {submissions.map((sub, index) => (
                  <tr key={sub._id} className="border-b border-gray-200 last:border-b-0 hover:bg-gray-50/80 transition-colors duration-200">
                    <td className="text-gray-700 font-medium p-4">{index + 1}</td>
                    <td className="font-mono text-gray-800 p-4">{sub.language}</td>
                    <td className="p-4">
                      <span className={`badge border-0 font-medium py-3 px-3 ${getStatusColor(sub.status)}`}>
                        {sub.status.charAt(0).toUpperCase() + sub.status.slice(1)}
                      </span>
                    </td>
                    <td className="font-mono text-gray-800 p-4">{sub.runtime} sec</td>
                    <td className="font-mono text-gray-800 p-4">{formatMemory(sub.memory)}</td>
                    <td className="font-mono text-gray-800 p-4">{sub.testCasesPassed}/{sub.testCasesTotal}</td>
                    <td className="text-gray-600 p-4">{formatDate(sub.createdAt)}</td>
                    <td className="text-center p-4">
                      <button
                        className="btn btn-ghost btn-sm text-gray-600 gap-2 group hover:bg-gray-200 hover:text-gray-900 active:scale-95 transition-all duration-200"
                        onClick={() => setSelectedSubmission(sub)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 transition-transform duration-300 group-hover:scale-110"><path d="M10 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" /><path fillRule="evenodd" d="M.664 10.59a1.651 1.651 0 0 1 0-1.186A10.004 10.004 0 0 1 10 3c4.257 0 7.893 2.66 9.336 6.404a1.651 1.651 0 0 1 0 1.186A10.004 10.004 0 0 1 10 17c-4.257 0-7.893-2.66-9.336-6.404ZM10 15a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z" clipRule="evenodd" /></svg>
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selectedSubmission && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 motion-safe:animate-fade-in">
          <div className="w-11/12 max-w-5xl bg-white rounded-2xl shadow-xl border border-gray-200/80 motion-safe:animate-fade-in-up flex flex-col max-h-[90vh]">
            <header className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50 flex-shrink-0 rounded-t-2xl">
              <h3 className="font-bold text-lg flex items-center gap-2 text-gray-800">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-gray-500"><path fillRule="evenodd" d="M4.25 5.5a.75.75 0 0 0 0 1.5h11.5a.75.75 0 0 0 0-1.5H4.25Zm0 4a.75.75 0 0 0 0 1.5h11.5a.75.75 0 0 0 0-1.5H4.25Zm0 4a.75.75 0 0 0 0 1.5h11.5a.75.75 0 0 0 0-1.5H4.25Z" clipRule="evenodd" /></svg>
                Submission Details: {selectedSubmission.language}
              </h3>
              <button className="btn btn-ghost btn-sm btn-circle" onClick={() => setSelectedSubmission(null)}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" /></svg>
              </button>
            </header>

            <div className="p-6 overflow-y-auto space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                  <div className="text-sm text-gray-600">Status</div>
                  <div className={`mt-1 badge border-0 text-sm p-2 ${getStatusColor(selectedSubmission.status)}`}>{selectedSubmission.status}</div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                  <div className="text-sm text-gray-600">Runtime</div>
                  <div className="font-semibold text-lg text-gray-800">{selectedSubmission.runtime}s</div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                  <div className="text-sm text-gray-600">Memory</div>
                  <div className="font-semibold text-lg text-gray-800">{formatMemory(selectedSubmission.memory)}</div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                  <div className="text-sm text-gray-600">Cases Passed</div>
                  <div className="font-semibold text-lg text-gray-800">{selectedSubmission.testCasesPassed}/{selectedSubmission.testCasesTotal}</div>
                </div>
              </div>

              {selectedSubmission.errorMessage && (
                <div className="alert bg-red-50 text-red-800 border border-red-200">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM8.28 7.22a.75.75 0 0 0-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 1 0 1.06 1.06L10 11.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L11.06 10l1.72-1.72a.75.75 0 0 0-1.06-1.06L10 8.94 8.28 7.22Z" clipRule="evenodd" /></svg>
                  <span>{selectedSubmission.errorMessage}</span>
                </div>
              )}

              <div className="bg-gray-900 rounded-lg border border-gray-700 overflow-hidden">
                <div className="flex justify-between items-center p-2 bg-gray-800">
                  <span className="text-xs font-mono text-gray-400">{selectedSubmission.language} Code</span>
                  <button className="btn btn-ghost btn-xs gap-1 text-gray-300 hover:bg-gray-700" onClick={() => navigator.clipboard.writeText(selectedSubmission.code)}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4"><path d="M7 3.5A1.5 1.5 0 0 1 8.5 2h3.879a1.5 1.5 0 0 1 1.06.44l3.122 3.121A1.5 1.5 0 0 1 17 6.621V16.5a1.5 1.5 0 0 1-1.5 1.5h-7A1.5 1.5 0 0 1 7 16.5v-13Z" /><path d="M5 6.5A1.5 1.5 0 0 1 6.5 5h3A1.5 1.5 0 0 1 11 6.5v3A1.5 1.5 0 0 1 9.5 11h-3A1.5 1.5 0 0 1 5 9.5v-3Z" /></svg>
                    Copy
                  </button>
                </div>
                <pre className="p-4 text-gray-200 overflow-x-auto max-h-[40vh]">
                  <code>{selectedSubmission.code}</code>
                </pre>
              </div>
            </div>
            <div className="mt-auto p-4 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
              <button
                className="btn bg-gray-800 hover:bg-gray-900 border-0 text-white w-full sm:w-auto sm:float-right"
                onClick={() => setSelectedSubmission(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubmissionHistory;