import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import axiosClient from "../utils/axiosClient";
import { Send } from 'lucide-react';

function ChatAi({ problem }) {
    const [messages, setMessages] = useState([
        { role: 'model', parts: [{ text: "Hi, How are you" }] },
        { role: 'user', parts: [{ text: "I am Good" }] }
    ]);

    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const onSubmit = async (data) => {

        setMessages(prev => [...prev, { role: 'user', parts: [{ text: data.message }] }]);
        reset();

        try {

            const response = await axiosClient.post("/ai/chat", {
                messages: messages,
                title: problem.title,
                description: problem.description,
                testCases: problem.visibleTestCases,
                startCode: problem.startCode
            });


            setMessages(prev => [...prev, {
                role: 'model',
                parts: [{ text: response.data.message }]
            }]);

        } catch (error) {
            console.error("API Error:", error);
            setMessages(prev => [...prev, {
                role: 'model',
                parts: [{ text: "Error from AI Chatbot" }]
            }]);
        }
    };

    return (

        <div className="flex flex-col h-full max-h-[80vh] min-h-[500px] bg-white rounded-2xl shadow-lg border border-gray-200/80 overflow-hidden transform-gpu font-sans">
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`chat ${msg.role === "user" ? "chat-end" : "chat-start"}`}
                    >
                        <div className="chat-image avatar">
                            <div className="w-10 rounded-full">
                                {msg.role === "user" ?
                                    <div className="flex items-center justify-center w-full h-full bg-blue-100">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-700" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                        </svg>
                                    </div> :
                                    <div className="flex items-center justify-center w-full h-full bg-gray-200">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                                        </svg>
                                    </div>
                                }
                            </div>
                        </div>
                        <div className={`chat-bubble prose ${msg.role === "user" ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-800"}`}>
                            {msg.parts[0].text}
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="sticky bottom-0 p-4 bg-white border-t border-gray-200"
            >
                <div className="flex items-center gap-2">
                    <input
                        placeholder="Ask a question..."
                        className="input input-bordered w-full rounded-full h-12 bg-gray-100 border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-gray-500 focus:ring-1 focus:ring-gray-500 transition-all duration-300"
                        {...register("message", { required: true, minLength: 2 })}
                    />
                    <button
                        type="submit"
                        className="btn btn-circle w-12 h-12 bg-gray-800 hover:bg-gray-900 border-0 text-white transition-all duration-100 transform-gpu active:scale-95 disabled:bg-gray-300"
                        disabled={!!errors.message}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                    </button>
                </div>
            </form>
        </div>
    );
}

export default ChatAi;