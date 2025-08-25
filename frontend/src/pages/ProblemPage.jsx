import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import Editor from '@monaco-editor/react';
import { useParams } from 'react-router';
import axiosClient from '../utils/axiosClient';
import SubmissionHistory from '../components/SubmissionHistory';
import ChatAi from "../components/ChatAi"
import Editorial from '../components/Editorial';

const langMap = {
  cpp: 'c++',
  java: 'java',
  javascript: 'javascript'
};


const ProblemPage = () => {
  const [problem, setProblem] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [runResult, setRunResult] = useState(null);
  const [submitResult, setSubmitResult] = useState(null);
  const [activeLeftTab, setActiveLeftTab] = useState('description');
  const [activeRightTab, setActiveRightTab] = useState('code');
  const editorRef = useRef(null);
  let { problemId } = useParams();
  const [copiedSolutionIndex, setCopiedSolutionIndex] = useState(null);

  const { handleSubmit } = useForm();

  useEffect(() => {
    const fetchProblem = async () => {
      setLoading(true);
      try {
        const response = await axiosClient.get(`/problem/getAllProblem/${problemId}`);
        const initialCode = response.data.startCode.find(sc => sc.language === langMap[selectedLanguage]).initialCode;
        setProblem(response.data);
        setCode(initialCode);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching problem:', error);
        setLoading(false);
      }
    };

    fetchProblem();
  }, [problemId]);

  // Update code when language changes
  useEffect(() => {
    if (problem) {
      const initialCode = problem.startCode.find(sc => sc.language === langMap[selectedLanguage]).initialCode;
      setCode(initialCode);
    }
  }, [selectedLanguage, problem]);

  const handleEditorChange = (value) => {
    setCode(value || '');
  };

  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
  };

  const handleLanguageChange = (language) => {
    setSelectedLanguage(language);
  };

  const handleRun = async () => {
    setLoading(true);
    setRunResult(null);

    try {
      const response = await axiosClient.post(`/submission/runCode/${problemId}`, {
        code,
        language: selectedLanguage
      });

      setRunResult(response.data);
      console.log(response.data);
      setLoading(false);
      setActiveRightTab('testcase');

    } catch (error) {
      console.error('Error running code:', error);
      setRunResult({
        success: false,
        error: 'Internal server error'
      });
      setLoading(false);
      setActiveRightTab('testcase');
    }
  };

  const handleSubmitCode = async () => {
    setLoading(true);
    setSubmitResult(null);

    try {
      const response = await axiosClient.post(`/submission/submit/${problemId}`, {
        code: code,
        language: selectedLanguage
      });

      setSubmitResult(response.data);
      console.log(response.data);

      setLoading(false);
      setActiveRightTab('result');

    } catch (error) {
      console.error('Error submitting code:', error);
      setSubmitResult(null);
      setLoading(false);
      setActiveRightTab('result');
    }
  };

  const getLanguageForMonaco = (lang) => {
    switch (lang) {
      case 'javascript': return 'javascript';
      case 'java': return 'java';
      case 'cpp': return 'cpp';
      default: return 'javascript';
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'badge-success';
      case 'medium': return 'badge-warning';
      case 'hard': return 'badge-error';
      default: return 'badge-ghost';
    }
  };

  if (loading && !problem) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#F8F9FA]">
        <div role="status">
          <svg aria-hidden="true" className="w-12 h-12 text-gray-200 animate-spin fill-gray-800" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
          </svg>
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="relative min-h-screen overflow-hidden bg-[#F8F9FA] p-6 font-sans">
        <div className="relative mx-auto max-w-[1400px]">
          <div className="flex gap-6 h-[calc(100vh-3rem)]">

            {/* Left Panel: Clean Card */}
            <aside className="w-1/2 bg-white border border-gray-200 rounded-xl shadow-sm flex flex-col overflow-hidden">
              <nav className="flex items-center gap-2 p-3 bg-white border-b border-gray-200">
                {[
                  { id: 'description', label: 'Description', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h7" /></svg> },
                  { id: 'editorial', label: 'Editorial', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v11.494m0 0a7.5 7.5 0 007.5-7.5H4.5a7.5 7.5 0 007.5 7.5z" /></svg> },
                  { id: 'solutions', label: 'Solutions', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h10l-1-1-1-3M11.25 11.25L12 17m0 0l.75-5.75M12 17l-1.5-5.75M12 17l1.5-5.75M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" /></svg> },
                  { id: 'submissions', label: 'Submissions', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
                  { id: 'CodexAI', label: 'CodexAI', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg> }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveLeftTab(tab.id)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ease-in-out ${activeLeftTab === tab.id ? 'bg-gray-800 text-white shadow-sm' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'}`}
                  >
                    {tab.icon}
                    {tab.label}
                  </button>
                ))}
              </nav>

              <div key={activeLeftTab} className="p-6 overflow-y-auto space-y-6 text-gray-600 animate-[fadeIn_0.3s_ease-in-out]">
                {problem && (
                  <>
                    {activeLeftTab === 'description' && (
                      <section>
                        <div className="flex items-center gap-4 mb-4">
                          <h1 className="text-2xl font-semibold text-gray-900">{problem.title}</h1>
                          <span className={`py-1 px-3 text-xs font-medium rounded-full ${getDifficultyColor(problem.difficulty)}`}>{problem.difficulty.charAt(0).toUpperCase() + problem.difficulty.slice(1)}</span>
                          <span className="py-1 px-3 text-xs font-medium text-gray-700 bg-gray-100 rounded-full">{problem.tags}</span>
                        </div>
                        <article className="prose max-w-none">
                          <div className="whitespace-pre-wrap text-base leading-relaxed text-gray-700">{problem.description}</div>
                        </article>
                        <div className="mt-6">
                          <h3 className="text-xl font-semibold mb-3 text-gray-800">Examples</h3>
                          <div className="grid grid-cols-1 gap-4">
                            {problem.visibleTestCases.map((example, index) => (
                              <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200 transition-all duration-200 hover:border-gray-300 hover:bg-white motion-safe:hover:scale-[1.01]">
                                <h4 className="font-medium text-gray-900 text-lg">Example {index + 1}</h4>
                                <div className="mt-3 text-base font-mono text-gray-500 border-l-2 border-gray-200 pl-4 space-y-2">
                                  <div><strong>Input:</strong> <span className="ml-2 text-gray-800 bg-gray-200 px-2 py-1 rounded-md">{example.input}</span></div>
                                  <div><strong>Output:</strong> <span className="ml-2 text-gray-800 bg-gray-200 px-2 py-1 rounded-md">{example.output}</span></div>
                                  {example.explaination && <div><strong>Explanation:</strong> <span className="ml-2 text-gray-700">{example.explaination}</span></div>}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </section>
                    )}

                    {activeLeftTab === 'editorial' && (
                      <section>
                        <h2 className="text-lg font-semibold mb-2 text-gray-800">Editorial</h2>
                        <div className="whitespace-pre-wrap text-sm leading-relaxed"><Editorial secureUrl={problem.secureUrl} thumbnailUrl={problem.thumbnailUrl} duration={problem.duration} /></div>
                      </section>
                    )}

                    {activeLeftTab === 'solutions' && (
                      <section>
                        <h2 className="text-2xl font-bold mb-6 text-gray-800">Reference Solutions</h2>
                        <div className="space-y-4">
                          {problem.referenceSolution?.length > 0 ? (
                            problem.referenceSolution.map((solution, index) => {
                              const isCopied = copiedSolutionIndex === index;
                              const handleCopy = () => {
                                navigator.clipboard.writeText(solution.completeCode);
                                setCopiedSolutionIndex(index);
                                setTimeout(() => setCopiedSolutionIndex(null), 2000);
                              };
                              return (
                                <div key={index} className="bg-white rounded-lg border border-gray-200 transition-all duration-200 overflow-hidden motion-safe:hover:scale-[1.01] hover:shadow-md">
                                  <header className="flex justify-between items-center p-3 bg-gray-50 border-b border-gray-200">
                                    <h3 className="font-mono text-lg text-gray-800">{problem?.title} - <span className="text-blue-600">{solution?.language}</span></h3>
                                    <button onClick={handleCopy} className="flex items-center gap-2 text-sm text-gray-600 hover:bg-gray-200 rounded-md px-2 py-1 transition-colors duration-150">
                                      {isCopied ? (<><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-green-500"><path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z" clipRule="evenodd" /></svg>Copied!</>) : (<><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-gray-500"><path d="M7 3.5A1.5 1.5 0 0 1 8.5 2h3.879a1.5 1.5 0 0 1 1.06.44l3.122 3.121A1.5 1.5 0 0 1 17 6.621V16.5a1.5 1.5 0 0 1-1.5 1.5h-7A1.5 1.5 0 0 1 7 16.5v-13Z" /><path d="M5 6.5A1.5 1.5 0 0 1 6.5 5h3A1.5 1.5 0 0 1 11 6.5v3A1.5 1.5 0 0 1 9.5 11h-3A1.5 1.5 0 0 1 5 9.5v-3Z" /></svg>Copy Code</>)}
                                    </button>
                                  </header>
                                  <pre className="p-4 bg-gray-50 text-gray-800 text-sm overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent max-h-[50vh]"><code>{solution.completeCode}</code></pre>
                                </div>
                              );
                            })
                          ) : (
                            <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center flex flex-col items-center gap-4">
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-10 h-10 text-gray-400"><path fillRule="evenodd" d="M10 1a4.5 4.5 0 0 0-4.5 4.5V9H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2h-.5V5.5A4.5 4.5 0 0 0 10 1Zm3 8V5.5a3 3 0 1 0-6 0V9h6Z" clipRule="evenodd" /></svg>
                              <h3 className="text-lg font-semibold text-gray-700">Solutions Locked</h3>
                              <p className="text-gray-500">Solutions will become available after you successfully solve the problem.</p>
                            </div>
                          )}
                        </div>
                      </section>
                    )}

                    {activeLeftTab === 'submissions' && (
                      <section><h2 className="text-lg font-semibold mb-3 text-gray-800">My Submissions</h2><div><SubmissionHistory problemId={problemId} /></div></section>
                    )}

                    {activeLeftTab === 'CodexAI' && (
                      <section><h2 className="text-lg font-semibold mb-2 text-gray-800">CodexAI</h2><div className="whitespace-pre-wrap text-sm leading-relaxed"><ChatAi problem={problem}></ChatAi></div></section>
                    )}
                  </>
                )}
              </div>
            </aside>

            {/* Right Panel: Clean Card */}
            <main className="w-1/2 flex flex-col bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
              <div className="flex items-center justify-between bg-white p-3 border-b border-gray-200">
                <div className="flex gap-1 p-1 rounded-lg bg-gray-100">
                  {['code', 'testcase', 'result'].map(tab => (
                    <button key={tab} onClick={() => setActiveRightTab(tab)} className={`px-4 py-1.5 rounded-md font-medium text-sm transition-colors duration-200 ease-in-out ${activeRightTab === tab ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:bg-white/60 hover:text-gray-800'}`}>
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  ))}
                </div>
                <div className="flex items-center p-1 rounded-lg bg-gray-100">
                  {['javascript', 'java', 'cpp'].map((lang) => (
                    <button key={lang} className={`px-3 py-1 text-sm rounded-md transition-colors duration-200 ${selectedLanguage === lang ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:bg-white/60'}`} onClick={() => handleLanguageChange(lang)}>
                      {lang === 'cpp' ? 'C++' : lang === 'javascript' ? 'JavaScript' : 'Java'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex-1 overflow-hidden flex flex-col">
                {activeRightTab === 'code' && (
                  <div className="flex-1 flex flex-col">
                    <div className="flex-1 relative"><Editor height="100%" language={getLanguageForMonaco(selectedLanguage)} value={code} onChange={handleEditorChange} onMount={handleEditorDidMount} theme="vs" options={{ fontSize: 16, minimap: { enabled: false }, scrollbar: { verticalScrollbarSize: 10, horizontalScrollbarSize: 10 } }} /></div>
                    <div className="p-4 border-t border-gray-200 flex justify-between items-center bg-gray-50">
                      <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors" onClick={() => setActiveRightTab('testcase')}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M2 3a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1H2Zm0 8a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1v-1a1 1 0 0 0-1-1H2Z" clipRule="evenodd" /></svg>
                        Console
                      </button>
                      <div className="flex gap-3">
                        <button className={`px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed`} onClick={handleRun} disabled={loading}>Run Code</button>
                        <button className={`px-4 py-2 text-sm font-medium rounded-lg bg-gray-800 text-white hover:bg-gray-900 transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed`} onClick={handleSubmitCode} disabled={loading}>Submit</button>
                      </div>
                    </div>
                  </div>
                )}
                {activeRightTab === 'testcase' && (
                  <div className="p-4 overflow-y-auto flex-1 text-gray-700 animate-[fadeIn_0.3s_ease-in-out]">
                    <h3 className="font-semibold mb-4 text-gray-800">Test Results</h3>
                    {runResult ? (
                      <div className={`${runResult.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'} border p-4 rounded-lg`}>
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h4 className={`font-bold ${runResult.success ? 'text-green-800' : 'text-red-800'}`}>{runResult.success ? 'All test cases passed ✅' : 'Some tests failed ❌'}</h4>
                            <div className="text-sm text-gray-500 mt-1">Runtime: <span className="font-medium">{runResult.runtime ?? 0} sec</span> • Memory: <span className="font-medium">{runResult.memory ?? 0} KB</span></div>
                          </div>
                        </div>
                        <div className="mt-4 grid gap-3">
                          {Array.isArray(runResult?.testCases) && runResult.testCases.length > 0 ? (
                            runResult.testCases.map((tc, i) => (
                              <div key={i} className="p-3 rounded-lg bg-white border border-gray-200">
                                <div className="flex items-center justify-between">
                                  <div className="text-xs font-mono text-gray-500">Input: <span className="ml-2 text-gray-800">{tc.stdin}</span></div>
                                  <div className={`px-2 py-1 text-xs rounded-full font-medium ${((tc.status_id ?? tc.status?.id) === 3) ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{((tc.status_id ?? tc.status?.id) === 3) ? 'Passed' : 'Failed'}</div>
                                </div>
                                <div className="mt-2 grid grid-cols-1 gap-1 text-sm font-mono text-gray-500">
                                  <div><strong>Expected:</strong> <span className="ml-2 text-gray-700">{tc.expected_output ?? tc.expectedOutput ?? '—'}</span></div>
                                  <div><strong>Output:</strong> <span className="ml-2 text-gray-700">{tc.stdout ?? tc.stdout_output ?? tc.output ?? '—'}</span></div>
                                </div>
                              </div>
                            ))
                          ) : (<div className="text-gray-500">No test case results available.</div>)}
                        </div>
                      </div>
                    ) : (<div className="text-gray-500">Click "Run" to test your code.</div>)}
                  </div>
                )}
                {activeRightTab === 'result' && (
                  <div className="p-4 overflow-y-auto flex-1 text-gray-700 animate-[fadeIn_0.3s_ease-in-out]">
                    <h3 className="font-semibold mb-4 text-gray-800">Submission Result</h3>
                    {submitResult ? (
                      <div className={`${submitResult.accepted ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'} border p-4 rounded-lg`}>
                        {submitResult.accepted ? (
                          <div>
                            <h4 className="font-bold text-lg flex items-center gap-2 text-green-800">🎉 Accepted</h4>
                            <div className="mt-3 text-sm text-gray-600 space-y-1">
                              <div>Test Cases Passed: <span className="font-medium text-gray-800">{submitResult.passedTestCases}/{submitResult.totalTestCases}</span></div>
                              <div>Runtime: <span className="font-medium text-gray-800">{submitResult.runtime} sec</span></div>
                              <div>Memory: <span className="font-medium text-gray-800">{submitResult.memory} KB</span></div>
                            </div>
                          </div>
                        ) : (
                          <div>
                            <h4 className="font-bold text-lg text-red-800">❌ {submitResult.error || 'Failed'}</h4>
                            <div className="mt-3 text-sm text-gray-600">Test Cases Passed: <span className="font-medium text-gray-800">{submitResult.passedTestCases}/{submitResult.totalTestCases}</span></div>
                          </div>
                        )}
                      </div>
                    ) : (<div className="text-gray-500">Click "Submit" to evaluate your solution.</div>)}
                  </div>
                )}
              </div>
            </main>
          </div>
        </div>
      </div>

    </>
  );
};

export default ProblemPage;

