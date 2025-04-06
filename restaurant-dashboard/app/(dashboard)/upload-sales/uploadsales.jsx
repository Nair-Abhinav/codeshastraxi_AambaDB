// // "use client"
// // import { useState, useRef } from 'react'

// // export default function Home() {
// //   const [query, setQuery] = useState('')
// //   const [response, setResponse] = useState('')
// //   const [graphId, setGraphId] = useState(null)
// //   const [isProcessing, setIsProcessing] = useState(false)
// //   const [isUploading, setIsUploading] = useState(false)
// //   const fileInput = useRef(null)
// //   const [selectedFile, setSelectedFile] = useState(null)

// //   const handleFileSelect = (e) => {
// //     setSelectedFile(e.target.files?.[0])
// //   }

// //   const handleUpload = async () => {
// //     if (!selectedFile) return

// //     setIsUploading(true)
// //     setResponse('Uploading file...')

// //     try {
// //       const formData = new FormData()
// //       formData.append('file', selectedFile)

// // // First upload to Next.js backend
// // const uploadResponse = await fetch('/api/upload', {
// //   method: 'POST',
// //   body: formData
// // })

// // if (!uploadResponse.ok) {
// //   const uploadResult = await uploadResponse.json()
// //   throw new Error(uploadResult.error || 'Upload to server failed')
// // }

// // const uploadResult = await uploadResponse.json()
// // setResponse(`File uploaded successfully. ${uploadResult.vectorDbStatus || ''}`)

// // Let the Next.js backend handle the Flask API call
// // This is already implemented in your /api/upload route

// //     setQuery('')
// //   } catch (error) {
// //     console.error('Upload error:', error)
// //     setResponse(`Error: ${error.message}. If this persists, try with a different file format or encoding.`)
// //   } finally {
// //     setIsUploading(false)
// //     setSelectedFile(null)
// //     if (fileInput.current) fileInput.current.value = ''
// //   }
// // }

// // In the handleQuery function
// // const handleQuery = async () => {
// //   if (!query.trim()) return;

// //   setIsProcessing(true);
// //   setResponse('Processing...');
// //   setGraphId(null);

// //   try {
// //     // First check if vector DB files exist in the directory
// //     const checkVectorStore = await fetch('http://localhost:5000/check_vectordb', {
// //       method: 'GET',
// //     });

// //     const vectorStoreStatus = await checkVectorStore.json();
// //     if (!vectorStoreStatus.exists) {
// //       setResponse('Please upload a file first to create the knowledge base.');
// //       return;
// //     }

// // Proceed with query since vector DB exists
// //     const res = await fetch('http://localhost:5000/query', {
// //       method: 'POST',
// //       headers: { 'Content-Type': 'application/json' },
// //       body: JSON.stringify({ query })
// //     });

// //     const data = await res.json();
// //     setResponse(data.response);
// //     if (data.graph_id) {
// //       setGraphId(data.graph_id);
// //     }
// //   } catch (error) {
// //     setResponse(`Error: ${error.message}`);
// //   } finally {
// //     setIsProcessing(false);
// //   }
// // };

// // // In the render section
// // {graphId && (
// //   <div className="mt-4">
// //     <img
// //       src={`http://localhost:5000/graph/${graphId}`}
// //       alt="Data visualization"
// //       className="w-full h-auto"
// //       onError={(e) => {
// //         e.target.style.display = 'none';
// //         setResponse(response + '\n\nFailed to load visualization.');
// //       }}
// //     />
// //   </div>
// // )}

// // //works
// // const handleQuery = async () => {
// //   if (!query.trim()) return

// //   setIsProcessing(true)
// //   setResponse('Processing...')
// //   setGraphId(null)

// //   try {
// //     const res = await fetch('http://localhost:5000/query', {
// //       method: 'POST',
// //       headers: { 'Content-Type': 'application/json' },
// //       body: JSON.stringify({ query })
// //     })

// //     const data = await res.json()
// //     setResponse(data.response)
// //     setGraphId(data.graph_id)
// //   } catch (error) {
// //     setResponse(`Error: ${error.message}`)
// //   } finally {
// //     setIsProcessing(false)
// //   }
// // }

// //   return (
// //     < className="container mx-auto p-4 max-w-2xl">
// //       <h1 className="text-3xl font-bold mb-8">Data Analysis Assistant</h1>

// //       <div className="mb-8">
// //         <input
// //           type="file"
// //           ref={fileInput}
// //           onChange={handleFileSelect}
// //           accept=".csv,.xlsx,.pdf"
// //           className="mb-2"
// //         />
// //         <button
// //           onClick={handleUpload}
// //           disabled={!selectedFile || isUploading}
// //           className={`px-4 py-2 rounded ${
// //             !selectedFile || isUploading
// //               ? 'bg-gray-400'
// //               : 'bg-green-600 text-white hover:bg-green-700'
// //           }`}
// //         >
// //           {isUploading ? 'Uploading...' : 'Upload File'}
// //         </button>
// //       </div>

// //       <div className="mb-6">
// //         <textarea
// //           value={query}
// //           onChange={(e) => setQuery(e.target.value)}
// //           placeholder="Ask about your data or request visualizations..."
// //           className="w-full p-3 border rounded mb-4 h-32"
// //         />
// //         <button
// //           onClick={handleQuery}
// //           disabled={isProcessing}
// //           className={`px-6 py-2 rounded ${
// //             isProcessing ? 'bg-gray-400' : 'bg-blue-600 text-white hover:bg-blue-700'
// //           }`}
// //         >
// //           {isProcessing ? 'Analyzing...' : 'Ask'}
// //         </button>
// //       </div>

// // <    {response && (
// //         <div className="mb-6 p-4 bg-white rounded shadow">
// //           <p className="whitespace-pre-wrap mb-4">{response}</p>
// //           {graphId && (
// //             <img
// //               src={`http://localhost:5000/graph/${graphId}`}
// //               alt="Data visualization"
// //               className="w-full h-64 object-contain"
// //               onError={(e) => {
// //                 e.target.style.display = 'none'
// //                 setResponse(response + '\n\n(Visualization failed to load)')
// //               }}
// //             />
// //           )}
// //         </div>
// //       )}
// //     </div>
// //   )
// // }

// //works
// // File: pages/index.js
// // "use client"
// // import { useState, useRef } from 'react';
// // import Head from 'next/head';

// // export default function Home() {
// //   const [file, setFile] = useState(null);
// //   const [isUploading, setIsUploading] = useState(false);
// //   const [uploadStatus, setUploadStatus] = useState('');
// //   const [query, setQuery] = useState('');
// //   const [response, setResponse] = useState('');
// //   const [isQuerying, setIsQuerying] = useState(false);
// //   const [graphType, setGraphType] = useState('bar');
// //   const [graphData, setGraphData] = useState(null);
// //   const fileInputRef = useRef(null);

// //   const handleFileChange = (e) => {
// //     const selectedFile = e.target.files[0];
// //     if (selectedFile) {
// //       setFile(selectedFile);
// //       setUploadStatus('');
// //     }
// //   };

// //   const handleUpload = async () => {
// //     if (!file) return;

// //     setIsUploading(true);
// //     setUploadStatus('');

// //     try {
// //       const formData = new FormData();
// //       formData.append('file', file);

// //       const response = await fetch('/api/upload', {
// //         method: 'POST',
// //         body: formData
// //       });

// //       const data = await response.json();

// //       if (response.ok) {
// //         setUploadStatus('Upload successful!');
// //         // Clear the file input
// //         if (fileInputRef.current) {
// //           fileInputRef.current.value = '';
// //         }
// //         setFile(null);
// //       } else {
// //         setUploadStatus(`Upload failed: ${data.error}`);
// //       }
// //     } catch (error) {
// //       setUploadStatus(`Upload error: ${error.message}`);
// //     } finally {
// //       setIsUploading(false);
// //     }
// //   };

// //   const handleQuery = async () => {
// //     if (!query.trim()) {
// //       setResponse('Please enter a query.');
// //       return;
// //     }

// //     setIsQuerying(true);
// //     setResponse('Thinking...');
// //     setGraphData(null);

// //     try {
// //       const response = await fetch('http://localhost:5000/query', {
// //         method: 'POST',
// //         headers: {
// //           'Content-Type': 'application/json',
// //         },
// //         body: JSON.stringify({ query }),

// //       });

// //       const data = await response.json();

// //       if (response.ok) {
// //         setResponse(data.response);
// //         console.log("DATA DATA",data.response)
// //         if (data.graph_data) {
// //           setGraphData(data.graph_data);
// //         }
// //       } else {
// //         setResponse(`Query failed: ${data.error}`);
// //       }
// //     } catch (error) {
// //       setResponse(`Error: ${error.message}`);
// //     } finally {
// //       setIsQuerying(false);
// //     }
// //   };

// //   const handleGenerateGraph = async () => {
// //     if (!query.trim()) {
// //       setResponse('Please enter a query for the graph.');
// //       return;
// //     }

// //     setIsQuerying(true);
// //     setResponse('Generating graph...');

// //     try {
// //       const response = await fetch('http://localhost:5000/generate-graph', {
// //         method: 'POST',
// //         headers: {
// //           'Content-Type': 'application/json',
// //         },
// //         body: JSON.stringify({ query, graphType }),
// //       });

// //       const data = await response.json();

// //       if (response.ok) {
// //         setResponse(data.response);
// //         setGraphData(data.graph_data);
// //       } else {
// //         setResponse(`Graph generation failed: ${data.error}`);
// //       }
// //     } catch (error) {
// //       setResponse(`Error: ${error.message}`);
// //     } finally {
// //       setIsQuerying(false);
// //     }
// //   };

// //   return (
// //     <div className="container mx-auto px-4 py-8">
// //       <Head>
// //         <title>RAG App with Data Visualization</title>
// //         <meta name="description" content="Upload files, query data, and visualize insights" />
// //         <link rel="icon" href="/favicon.ico" />
// //       </Head>

// //       <main>
// //         <h1 className="text-3xl font-bold mb-6">RAG Data Assistant</h1>

// //         <div className="bg-gray-100 p-6 rounded-lg mb-8">
// //           <h2 className="text-xl font-semibold mb-4">Upload Document</h2>
// //           <div className="flex flex-col md:flex-row gap-4">
// //             <input
// //               type="file"
// //               ref={fileInputRef}
// //               onChange={handleFileChange}
// //               accept=".csv,.pdf"
// //               className="border p-2 rounded"
// //             />
// //             <button
// //               onClick={handleUpload}
// //               disabled={isUploading || !file}
// //               className={`px-4 py-2 rounded ${
// //                 isUploading || !file
// //                   ? 'bg-gray-400'
// //                   : 'bg-blue-500 hover:bg-blue-600 text-white'
// //               }`}
// //             >
// //               {isUploading ? 'Uploading...' : 'Upload'}
// //             </button>
// //           </div>
// //           {uploadStatus && (
// //             <p className={`mt-2 ${uploadStatus.includes('success') ? 'text-green-600' : 'text-red-600'}`}>
// //               {uploadStatus}
// //             </p>
// //           )}
// //         </div>

// //         <div className="bg-gray-100 p-6 rounded-lg mb-8">
// //           <h2 className="text-xl font-semibold mb-4">Ask Questions About Your Data</h2>
// //           <div className="mb-4">
// //             <textarea
// //               value={query}
// //               onChange={(e) => setQuery(e.target.value)}
// //               placeholder="Ask a question about your data or request a specific graph..."
// //               className="w-full p-3 border rounded"
// //               rows="3"
// //             ></textarea>
// //           </div>
// //           <div className="flex flex-col md:flex-row gap-4">
// //             <button
// //               onClick={handleQuery}
// //               disabled={isQuerying}
// //               className={`px-4 py-2 rounded ${
// //                 isQuerying
// //                   ? 'bg-gray-400'
// //                   : 'bg-blue-500 hover:bg-blue-600 text-white'
// //               }`}
// //             >
// //               {isQuerying ? 'Processing...' : 'Get Answer'}
// //             </button>
// //             <div className="flex items-center">
// //               <select
// //                 value={graphType}
// //                 onChange={(e) => setGraphType(e.target.value)}
// //                 className="border p-2 rounded"
// //               >
// //                 <option value="bar">Bar Chart</option>
// //                 <option value="line">Line Chart</option>
// //                 <option value="pie">Pie Chart</option>
// //                 <option value="scatter">Scatter Plot</option>
// //               </select>
// //               <button
// //                 onClick={handleGenerateGraph}
// //                 disabled={isQuerying}
// //                 className={`ml-2 px-4 py-2 rounded ${
// //                   isQuerying
// //                     ? 'bg-gray-400'
// //                     : 'bg-green-500 hover:bg-green-600 text-white'
// //                 }`}
// //               >
// //                 Generate Graph
// //               </button>
// //             </div>
// //           </div>
// //         </div>

// //         {response && (
// //           <div className="bg-white border p-6 rounded-lg mb-8">
// //             <h3 className="text-lg font-semibold mb-2">Response:</h3>
// //             <div className="whitespace-pre-wrap">{response}</div>
// //           </div>
// //         )}

// //         {graphData && (
// //           <div className="bg-white border p-6 rounded-lg">
// //             <h3 className="text-lg font-semibold mb-2">Visualization:</h3>
// //             <div className="aspect-video w-full bg-gray-200 flex items-center justify-center">
// //               <img src={`data:image/png;base64,${graphData}`} alt="Data visualization" />
// //             </div>
// //           </div>
// //         )}
// //       </main>
// //     </div>
// //   );
// // }

// // modified v0 code

// // import { ChatInterface } from "@/app/smartanalyst/chat-interface"
// // import '@/app/smartanalyst/styles.css'

// // export default function Home() {
// //   return (
// //     <main className="flex min-h-screen flex-col">
// //       <ChatInterface />
// //     </main>
// //   )
// // }

// // gpt ui

// // 'use client';

// // import { useState } from 'react';
// // import { FaPlus, FaPaperPlane } from 'react-icons/fa';

// // export default function ChatUI() {
// //   const [messages, setMessages] = useState([
// //     { id: 1, sender: 'AI', text: 'Hi there! How can I help with your project today?', time: '10:00 AM' },
// //     { id: 2, sender: 'User', text: 'I need help designing a new landing page for our product.', time: '10:02 AM' },
// //     { id: 3, sender: 'AI', text: "Sure, I'd be happy to help! What kind of product is it, and what's the target audience?", time: '10:03 AM' },
// //   ]);

// //   const [input, setInput] = useState('');

// //   const sendMessage = () => {
// //     if (!input.trim()) return;
// //     const newMessage = { id: messages.length + 1, sender: 'User', text: input, time: new Date().toLocaleTimeString() };
// //     setMessages([...messages, newMessage]);
// //     setInput('');
// //   };

// //   return (
// //     <div className="h-screen bg-black text-white flex">
// //       {/* Sidebar */}
// //       <div className="w-1/4 bg-gray-900 p-4">
// //         <button className="flex items-center gap-2 bg-gray-800 px-4 py-2 w-full rounded-lg text-left text-white hover:bg-gray-700">
// //           <FaPlus /> New Conversation
// //         </button>
// //         <div className="mt-4">
// //           {['Project Discussion', 'Design Feedback', 'API Integration'].map((chat, index) => (
// //             <div key={index} className="p-3 bg-gray-800 mt-2 rounded-lg cursor-pointer hover:bg-gray-700">
// //               {chat}
// //               <p className="text-xs text-gray-400">almost 2 years ago</p>
// //             </div>
// //           ))}
// //         </div>
// //       </div>

// //       {/* Chat Section */}
// //       <div className="flex-1 flex flex-col bg-gray-950 p-4">
// //         <div className="text-xl font-bold pb-4 border-b border-gray-700">Project Discussion</div>
// //         <div className="flex-1 overflow-auto space-y-4 p-4">
// //           {messages.map((msg) => (
// //             <div key={msg.id} className={`flex ${msg.sender === 'User' ? 'justify-end' : 'justify-start'}` }>
// //               <div className={`p-3 rounded-lg max-w-xs ${msg.sender === 'User' ? 'bg-blue-600' : 'bg-gray-800'}`}>
// //                 <p>{msg.text}</p>
// //                 <p className="text-xs text-gray-400 text-right">{msg.time}</p>
// //               </div>
// //             </div>
// //           ))}
// //         </div>

// //         {/* Input Box */}
// //         <div className="flex items-center bg-gray-800 p-3 rounded-lg mt-2">
// //           <input
// //             type="text"
// //             className="flex-1 bg-transparent outline-none text-white px-2"
// //             placeholder="Type your message..."
// //             value={input}
// //             onChange={(e) => setInput(e.target.value)}
// //             onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
// //           />
// //           <button onClick={sendMessage} className="p-2 bg-blue-600 rounded-lg hover:bg-blue-500">
// //             <FaPaperPlane />
// //           </button>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// // ChatInterface.jsx
// // app/components/ChatInterface.jsx
// // "use client"
// // import React, { useState, useRef, useEffect } from 'react';

// // export default function Home() {
// //   // State for conversations sidebar
// //   const [conversations, setConversations] = useState([
// //     { id: 1, title: 'Project Discussion', time: 'almost 2 years ago', active: true },
// //     { id: 2, title: 'Design Feedback', time: 'almost 2 years ago', active: false },
// //     { id: 3, title: 'API Integration', time: 'almost 2 years ago', active: false },
// //   ]);

// //   // State for messages in the current conversation
// //   const [messages, setMessages] = useState([
// //     { id: 1, sender: 'AI', content: 'Hi there! How can I help with your data analysis today?', time: '10:00 AM' },
// //   ]);

// //   // State for the message input and file handling
// //   const [messageInput, setMessageInput] = useState('');
// //   const fileInputRef = useRef(null);
// //   const [selectedFiles, setSelectedFiles] = useState([]);

// //   // State for processing status
// //   const [isProcessing, setIsProcessing] = useState(false);

// //   // Reference to auto-scroll messages
// //   const messagesEndRef = useRef(null);

// //   // Function to scroll to the bottom of messages
// //   const scrollToBottom = () => {
// //     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
// //   };

// //   // Auto-scroll when messages update
// //   useEffect(() => {
// //     scrollToBottom();
// //   }, [messages]);

// //   // Function to handle creating a new conversation
// //   const handleNewConversation = () => {
// //     const newConversation = {
// //       id: conversations.length + 1,
// //       title: 'New Conversation',
// //       time: 'just now',
// //       active: true,
// //     };

// //     setConversations(prevConversations => 
// //       prevConversations.map(conv => ({...conv, active: false})).concat(newConversation)
// //     );
// //     setMessages([{
// //       id: 1,
// //       sender: 'AI',
// //       content: 'Hi there! How can I help with your data analysis today?',
// //       time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
// //     }]);
// //   };

// //   // Function to select a different conversation
// //   const handleSelectConversation = (id) => {
// //     setConversations(prevConversations => 
// //       prevConversations.map(conv => ({...conv, active: conv.id === id}))
// //     );
// //   };

// //   // Function to handle file uploads
// //   const handleFileUpload = (e) => {
// //     const files = Array.from(e.target.files);
// //     if (files.length > 0) {
// //       setSelectedFiles(prev => [...prev, ...files]);
// //     }
// //   };

// //   // Function to trigger file input click
// //   const triggerFileInput = () => {
// //     fileInputRef.current.click();
// //   };

// //   // Function to remove a file from the selected files
// //   const removeFile = (index) => {
// //     setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
// //   };

// //   // Function to handle file upload to the server
// //   const handleUploadFile = async (file) => {
// //     setIsProcessing(true);

// //     try {
// //       const formData = new FormData();
// //       formData.append('file', file);

// //       // Upload to Next.js backend
// //       const uploadResponse = await fetch('/api/upload', {
// //         method: 'POST',
// //         body: formData
// //       });

// //       if (!uploadResponse.ok) {
// //         const uploadResult = await uploadResponse.json();
// //         throw new Error(uploadResult.error || 'Upload to server failed');
// //       }

// //       const uploadResult = await uploadResponse.json();
// //       return uploadResult.vectorDbStatus || 'File processed successfully.';
// //     } catch (error) {
// //       console.error('Upload error:', error);
// //       return `Error: ${error.message}. If this persists, try with a different file format or encoding.`;
// //     }
// //   };

// //   // Function to send a query to the backend
// //   const handleQuery = async (query) => {
// //     try {
// //       // First check if vector DB files exist in the directory
// //       const checkVectorStore = await fetch('http://localhost:5000/check_vectordb', {
// //         method: 'GET',
// //       });

// //       const vectorStoreStatus = await checkVectorStore.json();
// //       if (!vectorStoreStatus.exists) {
// //         return {
// //           response: 'Please upload a file first to create the knowledge base.',
// //           graph_id: null
// //         };
// //       }

// //       // Proceed with query since vector DB exists
// //       const res = await fetch('http://localhost:5000/query', {
// //         method: 'POST',
// //         headers: { 'Content-Type': 'application/json' },
// //         body: JSON.stringify({ query })
// //       });

// //       return await res.json();
// //     } catch (error) {
// //       console.error('Query error:', error);
// //       return {
// //         response: `Error: ${error.message}`,
// //         graph_id: null
// //       };
// //     }
// //   };

// //   // Main function to handle sending a message
// //   const handleSendMessage = async () => {
// //     if (messageInput.trim() === '' && selectedFiles.length === 0) return;

// //     const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

// //     // Create and add user message
// //     const newUserMessage = {
// //       id: messages.length + 1,
// //       sender: 'user',
// //       content: messageInput || "Uploaded file(s)", // Add default text if no input
// //       time: currentTime,
// //       files: selectedFiles.map(file => ({ name: file.name, type: file.type })), // Store file metadata
// //     };

// //     setMessages(prev => [...prev, newUserMessage]);

// //     // Save the files for processing
// //     const filesToProcess = [...selectedFiles];

// //     // Clear input and files
// //     setMessageInput('');
// //     setSelectedFiles([]);
// //     setIsProcessing(true);

// //     // Add AI "thinking" message
// //     const processingMessageId = messages.length + 2;
// //     const processingMessage = {
// //       id: processingMessageId,
// //       sender: 'AI',
// //       content: 'Processing your request...',
// //       time: currentTime,
// //       isProcessing: true,
// //     };

// //     setMessages(prev => [...prev, processingMessage]);

// //     try {
// //       let responseContent = '';
// //       let graphId = null;

// //       // Handle file uploads if any
// //       if (filesToProcess.length > 0) {
// //         const uploadResponses = await Promise.all(
// //           filesToProcess.map(file => handleUploadFile(file))
// //         );

// //         responseContent = uploadResponses.join('\n');
// //       }

// //       // Handle query if there's text input
// //       if (messageInput.trim() !== '') {
// //         const queryResult = await handleQuery(messageInput);
// //         responseContent += (responseContent ? '\n\n' : '') + queryResult.response;
// //         graphId = queryResult.graph_id;
// //       }

// //       // If no response content, provide a fallback
// //       if (!responseContent) {
// //         responseContent = "I've received your files. You can now ask questions about the data.";
// //       }

// //       // Update the AI response
// //       const finalResponse = {
// //         id: processingMessageId,
// //         sender: 'AI',
// //         content: responseContent,
// //         time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
// //         graphId: graphId,
// //       };

// //       setMessages(prev => prev.map(msg => 
// //         msg.id === processingMessageId ? finalResponse : msg
// //       ));
// //     } catch (error) {
// //       // Handle errors
// //       const errorResponse = {
// //         id: processingMessageId,
// //         sender: 'AI',
// //         content: `Error: ${error.message}`,
// //         time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
// //       };

// //       setMessages(prev => prev.map(msg => 
// //         msg.id === processingMessageId ? errorResponse : msg
// //       ));
// //     } finally {
// //       setIsProcessing(false);
// //     }
// //   };

// //   return (
// //     <div className="flex h-screen bg-[#111111] text-white">
// //       {/* Sidebar */}
// //       <div className="w-96 flex-shrink-0 border-r border-[#222222] bg-[#1a1a1a]">
// //         {/* New Conversation Button */}
// //         <div className="p-4">
// //           <button 
// //             onClick={handleNewConversation}
// //             className="w-full p-3 rounded-lg flex items-center justify-center gap-2 bg-[#242424] hover:bg-[#2a2a2a] transition-colors"
// //           >
// //             <span className="text-xl">+</span>
// //             <span>New Conversation</span>
// //           </button>
// //         </div>

// //         {/* Conversation List */}
// //         <div className="overflow-y-auto max-h-[calc(100vh-80px)]">
// //           {conversations.map(conversation => (
// //             <div 
// //               key={conversation.id}
// //               onClick={() => handleSelectConversation(conversation.id)}
// //               className={`p-4 cursor-pointer ${
// //                 conversation.active 
// //                   ? 'bg-[#242424]' 
// //                   : 'hover:bg-[#1e1e1e]'
// //               }`}
// //             >
// //               <div className="font-medium">{conversation.title}</div>
// //               <div className="text-sm text-gray-400">{conversation.time}</div>
// //             </div>
// //           ))}
// //         </div>
// //       </div>

// //       {/* Main Chat Area */}
// //       <div className="flex-1 flex flex-col bg-[#111111]">
// //         {/* Header */}
// //         <div className="flex justify-between items-center p-4 border-b border-[#222222]">
// //           <div className="font-bold">
// //             {conversations.find(conv => conv.active)?.title || 'Project Discussion'}
// //           </div>
// //           <div className="flex gap-2">
// //             {isProcessing && (
// //               <div className="text-sm text-gray-400 flex items-center gap-2">
// //                 <span className="animate-pulse">Processing</span>
// //                 <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
// //               </div>
// //             )}
// //             <button className="p-2 rounded-full text-gray-400 hover:text-white">
// //               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
// //                 <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12z" clipRule="evenodd" />
// //               </svg>
// //             </button>
// //           </div>
// //         </div>

// //         {/* Messages */}
// //         <div className="flex-1 overflow-y-auto p-4 space-y-4">
// //           {messages.map(message => (
// //             <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
// //               <div className={`max-w-[70%] ${message.isProcessing ? 'opacity-60' : ''}`}>
// //                 {message.sender === 'AI' && (
// //                   <div className="flex items-center gap-2 mb-1">
// //                     <div className="w-8 h-8 rounded-full flex items-center justify-center bg-[#333333] text-white">
// //                       AI
// //                     </div>
// //                   </div>
// //                 )}

// //                 <div className={`rounded-lg p-3 ${
// //                   message.sender === 'user' 
// //                     ? 'bg-white text-black' 
// //                     : 'bg-[#333333] text-white'
// //                 }`}>
// //                   <div className="whitespace-pre-wrap">{message.content}</div>

// //                   {/* Display files in user messages */}
// //                   {message.files && message.files.length > 0 && (
// //                     <div className="mt-2 space-y-2">
// //                       {message.files.map((file, index) => (
// //                         <div key={index} className="p-2 rounded flex items-center bg-[#444444]">
// //                           <span className="truncate">{file.name}</span>
// //                         </div>
// //                       ))}
// //                     </div>
// //                   )}

// //                   {/* Display graph if available in AI message */}
// //                   {message.graphId && (
// //                     <div className="mt-3 bg-[#222222] rounded-lg overflow-hidden">
// //                       <img 
// //                         src={`http://localhost:5000/graph/${message.graphId}`}
// //                         alt="Data visualization"
// //                         className="w-full h-auto max-h-64 object-contain"
// //                         onError={(e) => {
// //                           e.target.style.display = 'none';
// //                         }}
// //                       />
// //                     </div>
// //                   )}
// //                 </div>

// //                 <div className="text-xs text-gray-400 mt-1">
// //                   {message.time}
// //                 </div>
// //               </div>
// //             </div>
// //           ))}
// //           <div ref={messagesEndRef} />
// //         </div>

// //         {/* File Preview Area */}
// //         {selectedFiles.length > 0 && (
// //           <div className="px-4 py-2 flex flex-wrap gap-2 bg-[#1a1a1a]">
// //             {selectedFiles.map((file, index) => (
// //               <div key={index} className="p-2 rounded-lg flex items-center gap-2 bg-[#333333]">
// //                 <span className="truncate max-w-[150px]">{file.name}</span>
// //                 <button 
// //                   onClick={() => removeFile(index)}
// //                   className="text-red-500 hover:text-red-700"
// //                 >
// //                   ×
// //                 </button>
// //               </div>
// //             ))}
// //           </div>
// //         )}

// //         {/* Input Area */}
// //         <div className="p-4 border-t border-[#222222]">
// //           <div className="flex rounded-lg overflow-hidden bg-[#222222]">
// //             <button 
// //               onClick={triggerFileInput} 
// //               className="p-3 text-gray-400 hover:text-white"
// //               disabled={isProcessing}
// //             >
// //               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
// //                 <path fillRule="evenodd" d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z" clipRule="evenodd" />
// //               </svg>
// //             </button>

// //             <input
// //               type="text"
// //               value={messageInput}
// //               onChange={(e) => setMessageInput(e.target.value)}
// //               placeholder={isProcessing ? "Processing..." : "Ask about your data or upload a file..."}
// //               className="flex-1 p-3 outline-none bg-[#222222] text-white"
// //               onKeyPress={(e) => e.key === 'Enter' && !isProcessing && handleSendMessage()}
// //               disabled={isProcessing}
// //             />

// //             <button 
// //               onClick={handleSendMessage}
// //               className={`p-3 ${
// //                 (messageInput.trim() === '' && selectedFiles.length === 0) || isProcessing
// //                   ? 'text-gray-600'
// //                   : 'text-gray-400 hover:text-white'
// //               }`}
// //               disabled={(messageInput.trim() === '' && selectedFiles.length === 0) || isProcessing}
// //             >
// //               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transform rotate-90" viewBox="0 0 20 20" fill="currentColor">
// //                 <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
// //               </svg>
// //             </button>

// //             <input 
// //               type="file" 
// //               ref={fileInputRef} 
// //               className="hidden" 
// //               onChange={handleFileUpload}
// //               multiple
// //               accept=".csv,.xlsx,.pdf"
// //               disabled={isProcessing}
// //             />
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }


// // 3rd version without sidebar
// // "use client"
// // import React, { useState, useRef, useEffect } from 'react';

// // export function SmartAnalyst() {
// //   // State for messages in the current conversation
// //   const [messages, setMessages] = useState([
// //     { id: 1, sender: 'AI', content: 'Hi there! How can I help with your data analysis today?', time: '10:00 AM' },
// //   ]);

// //   // State for the message input and file handling
// //   const [messageInput, setMessageInput] = useState('');
// //   const fileInputRef = useRef(null);
// //   const [selectedFiles, setSelectedFiles] = useState([]);

// //   // State for processing status
// //   const [isProcessing, setIsProcessing] = useState(false);

// //   // Reference to auto-scroll messages
// //   const messagesEndRef = useRef(null);

// //   // Function to scroll to the bottom of messages
// //   const scrollToBottom = () => {
// //     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
// //   };

// //   // Auto-scroll when messages update
// //   useEffect(() => {
// //     scrollToBottom();
// //   }, [messages]);

// //   // Function to handle file uploads
// //   const handleFileUpload = (e) => {
// //     const files = Array.from(e.target.files);
// //     if (files.length > 0) {
// //       setSelectedFiles(prev => [...prev, ...files]);
// //     }
// //   };

// //   // Function to trigger file input click
// //   const triggerFileInput = () => {
// //     fileInputRef.current.click();
// //   };

// //   // Function to remove a file from the selected files
// //   const removeFile = (index) => {
// //     setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
// //   };

// //   // Function to handle file upload to the server
// //   const handleUploadFile = async (file) => {
// //     setIsProcessing(true);

// //     try {
// //       const formData = new FormData();
// //       formData.append('file', file);

// //       // Upload to Next.js backend
// //       const uploadResponse = await fetch('/api/upload', {
// //         method: 'POST',
// //         body: formData
// //       });

// //       if (!uploadResponse.ok) {
// //         const uploadResult = await uploadResponse.json();
// //         throw new Error(uploadResult.error || 'Upload to server failed');
// //       }

// //       const uploadResult = await uploadResponse.json();
// //       return uploadResult.vectorDbStatus || 'File processed successfully.';
// //     } catch (error) {
// //       console.error('Upload error:', error);
// //       return `Error: ${error.message}. If this persists, try with a different file format or encoding.`;
// //     }
// //   };

// //   // Function to send a query to the backend
// //   const handleQuery = async (query) => {
// //     try {
// //       // First check if vector DB files exist in the directory
// //       const checkVectorStore = await fetch('http://localhost:5000/check_vectordb', {
// //         method: 'GET',
// //       });

// //       const vectorStoreStatus = await checkVectorStore.json();
// //       if (!vectorStoreStatus.exists) {
// //         return {
// //           response: 'Please upload a file first to create the knowledge base.',
// //           graph_id: null
// //         };
// //       }

// //       // Proceed with query since vector DB exists
// //       const res = await fetch('http://localhost:5000/query', {
// //         method: 'POST',
// //         headers: { 'Content-Type': 'application/json' },
// //         body: JSON.stringify({ query })
// //       });

// //       return await res.json();
// //     } catch (error) {
// //       console.error('Query error:', error);
// //       return {
// //         response: `Error: ${error.message}`,
// //         graph_id: null
// //       };
// //     }
// //   };

// //   // Main function to handle sending a message
// //   const handleSendMessage = async () => {
// //     if (messageInput.trim() === '' && selectedFiles.length === 0) return;

// //     const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

// //     // Create and add user message
// //     const newUserMessage = {
// //       id: messages.length + 1,
// //       sender: 'user',
// //       content: messageInput || "Uploaded file(s)", // Add default text if no input
// //       time: currentTime,
// //       files: selectedFiles.map(file => ({ name: file.name, type: file.type })), // Store file metadata
// //     };

// //     setMessages(prev => [...prev, newUserMessage]);

// //     // Save the files for processing
// //     const filesToProcess = [...selectedFiles];

// //     // Clear input and files
// //     setMessageInput('');
// //     setSelectedFiles([]);
// //     setIsProcessing(true);

// //     // Add AI "thinking" message
// //     const processingMessageId = messages.length + 2;
// //     const processingMessage = {
// //       id: processingMessageId,
// //       sender: 'AI',
// //       content: 'Processing your request...',
// //       time: currentTime,
// //       isProcessing: true,
// //     };

// //     setMessages(prev => [...prev, processingMessage]);

// //     try {
// //       let responseContent = '';
// //       let graphId = null;

// //       // Handle file uploads if any
// //       if (filesToProcess.length > 0) {
// //         const uploadResponses = await Promise.all(
// //           filesToProcess.map(file => handleUploadFile(file))
// //         );

// //         responseContent = uploadResponses.join('\n');
// //       }

// //       // Handle query if there's text input
// //       if (messageInput.trim() !== '') {
// //         const queryResult = await handleQuery(messageInput);
// //         responseContent += (responseContent ? '\n\n' : '') + queryResult.response;
// //         graphId = queryResult.graph_id;
// //       }

// //       // If no response content, provide a fallback
// //       if (!responseContent) {
// //         responseContent = "I've received your files. You can now ask questions about the data.";
// //       }

// //       // Update the AI response
// //       const finalResponse = {
// //         id: processingMessageId,
// //         sender: 'AI',
// //         content: responseContent,
// //         time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
// //         graphId: graphId,
// //       };

// //       setMessages(prev => prev.map(msg => 
// //         msg.id === processingMessageId ? finalResponse : msg
// //       ));
// //     } catch (error) {
// //       // Handle errors
// //       const errorResponse = {
// //         id: processingMessageId,
// //         sender: 'AI',
// //         content: `Error: ${error.message}`,
// //         time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
// //       };

// //       setMessages(prev => prev.map(msg => 
// //         msg.id === processingMessageId ? errorResponse : msg
// //       ));
// //     } finally {
// //       setIsProcessing(false);
// //     }
// //   };

// //   // Clear conversation function
// //   const clearConversation = () => {
// //     setMessages([{
// //       id: 1,
// //       sender: 'AI',
// //       content: 'Hi there! How can I help with your data analysis today?',
// //       time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
// //     }]);
// //   };

// //   return (
// //     <div className="flex flex-col h-full bg-[#111111] text-white relative">
// //       {/* Main Chat Area */}
// //       <div className="flex-1 flex flex-col bg-[#111111] h-full pb-24">
// //         {/* Header */}
// //         <div className="flex justify-between items-center p-4 border-b border-[#222222]">
// //           <div className="font-bold">Smart Analyst</div>
// //           <div className="flex gap-2">
// //             {isProcessing && (
// //               <div className="text-sm text-gray-400 flex items-center gap-2">
// //                 <span className="animate-pulse">Processing</span>
// //                 <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
// //               </div>
// //             )}
// //             <button 
// //               onClick={clearConversation}
// //               className="p-2 rounded-full text-gray-400 hover:text-white"
// //               title="Clear conversation"
// //             >
// //               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
// //                 <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
// //               </svg>
// //             </button>
// //           </div>
// //         </div>

// //         {/* Messages */}
// //         <div className="flex-1 overflow-y-auto p-4 space-y-4">
// //           {messages.map(message => (
// //             <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
// //               <div className={`max-w-[70%] ${message.isProcessing ? 'opacity-60' : ''}`}>
// //                 {message.sender === 'AI' && (
// //                   <div className="flex items-center gap-2 mb-1">
// //                     <div className="w-8 h-8 rounded-full flex items-center justify-center bg-[#333333] text-white">
// //                       AI
// //                     </div>
// //                   </div>
// //                 )}

// //                 <div className={`rounded-lg p-3 ${
// //                   message.sender === 'user' 
// //                     ? 'bg-white text-black' 
// //                     : 'bg-[#333333] text-white'
// //                 }`}>
// //                   <div className="whitespace-pre-wrap">{message.content}</div>

// //                   {/* Display files in user messages */}
// //                   {message.files && message.files.length > 0 && (
// //                     <div className="mt-2 space-y-2">
// //                       {message.files.map((file, index) => (
// //                         <div key={index} className="p-2 rounded flex items-center bg-[#444444]">
// //                           <span className="truncate">{file.name}</span>
// //                         </div>
// //                       ))}
// //                     </div>
// //                   )}

// //                   {/* Display graph if available in AI message */}
// //                   {message.graphId && (
// //                     <div className="mt-3 bg-[#222222] rounded-lg overflow-hidden">
// //                       <img 
// //                         src={`http://localhost:5000/graph/${message.graphId}`}
// //                         alt="Data visualization"
// //                         className="w-full h-auto max-h-64 object-contain"
// //                         onError={(e) => {
// //                           e.target.style.display = 'none';
// //                         }}
// //                       />
// //                     </div>
// //                   )}
// //                 </div>

// //                 <div className="text-xs text-gray-400 mt-1">
// //                   {message.time}
// //                 </div>
// //               </div>
// //             </div>
// //           ))}
// //           <div ref={messagesEndRef} />
// //         </div>
// //       </div>

// //       {/* Fixed Input Area at Bottom - With margin to match sidebar */}
// //       <div className="fixed bottom-0 left-[308px] right-0 bg-[#111111] border-t border-[#222222]">
// //         {/* File Preview Area */}
// //         {selectedFiles.length > 0 && (
// //           <div className="px-4 py-2 flex flex-wrap gap-2 bg-[#1a1a1a]">
// //             {selectedFiles.map((file, index) => (
// //               <div key={index} className="p-2 rounded-lg flex items-center gap-2 bg-[#333333]">
// //                 <span className="truncate max-w-[150px]">{file.name}</span>
// //                 <button 
// //                   onClick={() => removeFile(index)}
// //                   className="text-red-500 hover:text-red-700"
// //                 >
// //                   ×
// //                 </button>
// //               </div>
// //             ))}
// //           </div>
// //         )}

// //         {/* Input Field */}
// //         <div className="p-4">
// //           <div className="flex rounded-lg overflow-hidden bg-[#222222]">
// //             <button 
// //               onClick={triggerFileInput} 
// //               className="p-3 text-gray-400 hover:text-white"
// //               disabled={isProcessing}
// //             >
// //               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
// //                 <path fillRule="evenodd" d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z" clipRule="evenodd" />
// //               </svg>
// //             </button>

// //             <input
// //               type="text"
// //               value={messageInput}
// //               onChange={(e) => setMessageInput(e.target.value)}
// //               placeholder={isProcessing ? "Processing..." : "Ask about your data or upload a file..."}
// //               className="flex-1 p-3 outline-none bg-[#222222] text-white"
// //               onKeyPress={(e) => e.key === 'Enter' && !isProcessing && handleSendMessage()}
// //               disabled={isProcessing}
// //             />

// //             <button 
// //               onClick={handleSendMessage}
// //               className={`p-3 ${
// //                 (messageInput.trim() === '' && selectedFiles.length === 0) || isProcessing
// //                   ? 'text-gray-600'
// //                   : 'text-gray-400 hover:text-white'
// //               }`}
// //               disabled={(messageInput.trim() === '' && selectedFiles.length === 0) || isProcessing}
// //             >
// //               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transform rotate-90" viewBox="0 0 20 20" fill="currentColor">
// //                 <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
// //               </svg>
// //             </button>

// //             <input 
// //               type="file" 
// //               ref={fileInputRef} 
// //               className="hidden" 
// //               onChange={handleFileUpload}
// //               multiple
// //               accept=".csv,.xlsx,.pdf"
// //               disabled={isProcessing}
// //             />
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// // 4th code
// "use client"
// import React, { useState, useRef, useEffect } from 'react';
// import Image from 'next/image';
// import file_icon from '@/public/file_icon.png';

// export function SmartAnalyst() {
//   // State for messages in the current conversation
//   const [messages, setMessages] = useState([
//     { id: 1, sender: 'AI', content: 'Hi there! How can I help with your data analysis today?', time: '10:00 AM' },
//   ]);

//   // State for the message input and file handling
//   const [messageInput, setMessageInput] = useState('');
//   const fileInputRef = useRef(null);
//   const [selectedFiles, setSelectedFiles] = useState([]);

//   // State for processing status
//   const [isProcessing, setIsProcessing] = useState(false);

//   // State for user email
//   const [userEmail, setUserEmail] = useState('');
//   const [showEmailInput, setShowEmailInput] = useState(false);

//   // Reference to auto-scroll messages
//   const messagesEndRef = useRef(null);

//   // Function to scroll to the bottom of messages
//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   };

//   // Auto-scroll when messages update
//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   // Debug email state changes
//   useEffect(() => {
//     if (userEmail) {
//       console.log(`Email address set: ${userEmail}`);
//     }
//   }, [userEmail]);

//   // Function to handle file uploads
//   const handleFileUpload = (e) => {
//     const files = Array.from(e.target.files);
//     if (files.length > 0) {
//       setSelectedFiles(prev => [...prev, ...files]);
//     }
//   };

//   // Function to trigger file input click
//   const triggerFileInput = () => {
//     fileInputRef.current.click();
//   };

//   // Function to remove a file from the selected files
//   const removeFile = (index) => {
//     setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
//   };

//   // Function to extract email from text
//   const extractEmail = (text) => {
//     const emailPattern = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;
//     const match = text.match(emailPattern);
//     return match ? match[0] : null;
//   };

//   // Function to handle file upload to the server
//   const handleUploadFile = async (file) => {
//     setIsProcessing(true);

//     try {
//       const formData = new FormData();
//       formData.append('file', file);

//       // Upload to Next.js backend
//       const uploadResponse = await fetch('/api/upload', {
//         method: 'POST',
//         body: formData
//       });

//       if (!uploadResponse.ok) {
//         const uploadResult = await uploadResponse.json();
//         throw new Error(uploadResult.error || 'Upload to server failed');
//       }

//       const uploadResult = await uploadResponse.json();
//       return uploadResult.vectorDbStatus || 'File processed successfully.';
//     } catch (error) {
//       console.error('Upload error:', error);
//       return `Error: ${error.message}. If this persists, try with a different file format or encoding.`;
//     }
//   };

//   // Function to send a query to the backend
//   const handleQuery = async (query) => {
//     try {
//       // Extract email if present in the query
//       const extractedEmail = extractEmail(query);
//       if (extractedEmail && extractedEmail !== userEmail) {
//         setUserEmail(extractedEmail);
//       }

//       // First check if vector DB files exist in the directory
//       const checkVectorStore = await fetch('http://localhost:5000/check_vectordb', {
//         method: 'GET',
//       });

//       const vectorStoreStatus = await checkVectorStore.json();
//       if (!vectorStoreStatus.exists) {
//         return {
//           response: 'Please upload a file first to create the knowledge base.',
//           graph_id: null
//         };
//       }

//       // Add special keywords for report generation
//       let modifiedQuery = query;
//       if (query.toLowerCase().includes('create report') ||
//         query.toLowerCase().includes('generate report')) {
//         console.log("Report generation detected in query");
//       }

//       if (query.toLowerCase().includes('send email') ||
//         query.toLowerCase().includes('email this')) {
//         console.log("Email request detected in query");
//       }

//       // Proceed with query since vector DB exists
//       const res = await fetch('http://localhost:5000/query', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           query: modifiedQuery,
//           email: userEmail || null  // Send the user's email if available
//         })
//       });

//       const result = await res.json();
//       console.log("Backend response:", result); // Log the backend response for debugging

//       return result;
//     } catch (error) {
//       console.error('Query error:', error);
//       return {
//         response: `Error: ${error.message}`,
//         graph_id: null
//       };
//     }
//   };

//   // Function to generate and download a PDF report
//   const handleGenerateReport = async () => {
//     if (messages.length <= 1) {
//       // No conversation to report
//       return;
//     }

//     try {
//       setIsProcessing(true);
//       console.log("Generating PDF report for download...");

//       // Get the last user query to use for report generation
//       const lastUserMessage = [...messages].reverse().find(m => m.sender === 'user');
//       if (!lastUserMessage) {
//         throw new Error("No user message found to generate report");
//       }

//       const response = await fetch('http://localhost:5000/download_report', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           query: lastUserMessage.content,
//           email: userEmail || null
//         })
//       });

//       if (!response.ok) {
//         const errorData = await response.text();
//         throw new Error(`Failed to generate report: ${errorData}`);
//       }

//       console.log("Report generated successfully, downloading...");

//       // Create a blob from the PDF stream
//       const blob = await response.blob();

//       // Create a link and trigger download
//       const url = URL.createObjectURL(blob);
//       const link = document.createElement('a');
//       link.href = url;
//       link.download = 'data_analysis_report.pdf';
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);

//       // Add a message about the report
//       const reportMessage = {
//         id: messages.length + 1,
//         sender: 'AI',
//         content: 'I\'ve generated a PDF report based on our conversation. It has been downloaded to your device.',
//         time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
//       };

//       setMessages(prev => [...prev, reportMessage]);

//     } catch (error) {
//       console.error('Report generation error:', error);
//       const errorMessage = {
//         id: messages.length + 1,
//         sender: 'AI',
//         content: `Error generating report: ${error.message}`,
//         time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
//       };
//       setMessages(prev => [...prev, errorMessage]);
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   // Function to send report via email
//   const handleSendReportByEmail = async () => {
//     if (!userEmail) {
//       setShowEmailInput(true);
//       return;
//     }

//     try {
//       setIsProcessing(true);

//       // Create a specific query for email report generation
//       const emailReportQuery = `generate report and send it by email to ${userEmail}`;
//       console.log("Sending email report request with query:", emailReportQuery);

//       const result = await fetch('http://localhost:5000/query', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           query: emailReportQuery,
//           email: userEmail
//         })
//       });

//       const response = await result.json();
//       console.log("Email report response:", response);

//       const emailMessage = {
//         id: messages.length + 1,
//         sender: 'AI',
//         content: response.response || `I've sent the report to ${userEmail}.`,
//         time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
//         emailSent: true
//       };

//       setMessages(prev => [...prev, emailMessage]);

//     } catch (error) {
//       console.error('Email sending error:', error);

//       const errorMessage = {
//         id: messages.length + 1,
//         sender: 'AI',
//         content: `Error sending email: ${error.message}`,
//         time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
//       };

//       setMessages(prev => [...prev, errorMessage]);
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   // Function to handle email submission
//   const handleEmailSubmit = (e) => {
//     e.preventDefault();
//     setShowEmailInput(false);

//     // If email was set and we were trying to send a report
//     if (userEmail) {
//       handleSendReportByEmail();
//     }
//   };

//   // Main function to handle sending a message
//   const handleSendMessage = async () => {
//     if (messageInput.trim() === '' && selectedFiles.length === 0) return;

//     const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

//     // Check for email in message
//     const extractedEmail = extractEmail(messageInput);
//     if (extractedEmail) {
//       setUserEmail(extractedEmail);
//     }

//     // Create and add user message
//     const newUserMessage = {
//       id: messages.length + 1,
//       sender: 'user',
//       content: messageInput || "Uploaded file(s)", // Add default text if no input
//       time: currentTime,
//       files: selectedFiles.map(file => ({ name: file.name, type: file.type })), // Store file metadata
//     };

//     setMessages(prev => [...prev, newUserMessage]);

//     // Save the files for processing
//     const filesToProcess = [...selectedFiles];

//     // Clear input and files
//     setMessageInput('');
//     setSelectedFiles([]);
//     setIsProcessing(true);

//     // Add AI "thinking" message
//     const processingMessageId = messages.length + 2;
//     const processingMessage = {
//       id: processingMessageId,
//       sender: 'AI',
//       content: 'Processing your request...',
//       time: currentTime,
//       isProcessing: true,
//     };

//     setMessages(prev => [...prev, processingMessage]);

//     try {
//       let responseContent = '';
//       let graphId = null;
//       let reportAvailable = false;
//       let emailSent = false;

//       // Handle file uploads if any
//       if (filesToProcess.length > 0) {
//         const uploadResponses = await Promise.all(
//           filesToProcess.map(file => handleUploadFile(file))
//         );

//         responseContent = uploadResponses.join('\n');
//       }

//       // Handle query if there's text input
//       if (messageInput.trim() !== '') {
//         const queryResult = await handleQuery(messageInput);
//         responseContent += (responseContent ? '\n\n' : '') + queryResult.response;
//         graphId = queryResult.graph_id;
//         reportAvailable = queryResult.report || false;
//         emailSent = queryResult.email_sent || false;
//       }

//       // If no response content, provide a fallback
//       if (!responseContent) {
//         responseContent = "I've received your files. You can now ask questions about the data.";
//       }

//       // Update the AI response
//       const finalResponse = {
//         id: processingMessageId,
//         sender: 'AI',
//         content: responseContent,
//         time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
//         graphId: graphId,
//         reportAvailable: reportAvailable,
//         emailSent: emailSent
//       };

//       setMessages(prev => prev.map(msg =>
//         msg.id === processingMessageId ? finalResponse : msg
//       ));
//     } catch (error) {
//       // Handle errors
//       const errorResponse = {
//         id: processingMessageId,
//         sender: 'AI',
//         content: `Error: ${error.message}`,
//         time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
//       };

//       setMessages(prev => prev.map(msg =>
//         msg.id === processingMessageId ? errorResponse : msg
//       ));
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   // Clear conversation function
//   const clearConversation = () => {
//     setMessages([{
//       id: 1,
//       sender: 'AI',
//       content: 'Hi there! How can I help with your data analysis today?',
//       time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
//     }]);
//   };

//   return (
//     <div className="flex flex-col h-[480px] bg-[#111111] text-white relative ml-[4px]">
//       {/* Main Chat Area - Remove the pb-24 to allow the content to extend to the input */}
//       <div className="flex-1 flex flex-col bg-[#111111] h-full">
//         {/* Header */}
//         <div className="flex justify-between items-center p-4 border-b border-[#222222]">
//           <div className="font-bold">Smart Analyst</div>
//           <div className="flex gap-2">
//             {/* Always visible email setup button */}
//             <button
//               onClick={() => setShowEmailInput(true)}
//               className="p-1 text-xs bg-[#333333] rounded hover:bg-[#444444] flex items-center gap-1"
//               title="Set Email for Reports"
//             >
//               <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
//                 <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
//                 <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
//               </svg>
//               {userEmail ? "Change Email" : "Set Email"}
//             </button>

//             {isProcessing && (
//               <div className="text-sm text-gray-400 flex items-center gap-2">
//                 <span className="animate-pulse">Processing</span>
//                 <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
//               </div>
//             )}

//             {/* Email display and report controls */}
//             {userEmail && (
//               <div className="flex items-center mr-4">
//                 <div className="text-xs text-gray-400 mr-2">Email: {userEmail}</div>
//                 <button
//                   onClick={handleGenerateReport}
//                   className="p-1 text-xs bg-[#333333] rounded hover:bg-[#444444] mr-2"
//                   title="Download PDF Report"
//                   disabled={isProcessing}
//                 >
//                   Download Report
//                 </button>
//                 <button
//                   onClick={handleSendReportByEmail}
//                   className="p-1 text-xs bg-[#333333] rounded hover:bg-[#444444] mr-1"
//                   title="Email Report"
//                   disabled={isProcessing}
//                 >
//                   Email Report
//                 </button>
//                 <button
//                   onClick={() => setUserEmail('')}
//                   className="p-1 text-xs bg-red-900 rounded hover:bg-red-800 ml-1"
//                   title="Clear Email"
//                 >
//                   ×
//                 </button>
//               </div>
//             )}

//             <button
//               onClick={clearConversation}
//               className="p-2 rounded-full text-gray-400 hover:text-white"
//               title="Clear conversation"
//             >
//               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
//                 <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
//               </svg>
//             </button>
//           </div>
//         </div>

//         {/* Email input dialog */}
//         {showEmailInput && (
//           <div className="absolute top-0 left-0 right-0 bottom-0 bg-black/50 flex items-center justify-center z-10">
//             <form onSubmit={handleEmailSubmit} className="bg-[#222222] p-4 rounded-lg shadow-lg w-96">
//               <h3 className="text-lg font-semibold mb-4">Enter your email address</h3>
//               <input
//                 type="email"
//                 value={userEmail}
//                 onChange={(e) => setUserEmail(e.target.value)}
//                 placeholder="your.email@example.com"
//                 className="w-full p-2 mb-4 bg-[#333333] border border-[#444444] rounded text-white"
//                 required
//               />
//               <div className="flex justify-end gap-2">
//                 <button
//                   type="button"
//                   onClick={() => setShowEmailInput(false)}
//                   className="px-4 py-2 bg-[#333333] rounded"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="px-4 py-2 bg-blue-600 rounded"
//                 >
//                   Submit
//                 </button>
//               </div>
//             </form>
//           </div>
//         )}

//         {/* Messages - Modified to use absolute bottom positioning to extend to the input */}
//         <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-32">
//           {messages.map(message => (
//             <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
//               <div className={`max-w-[70%] ${message.isProcessing ? 'opacity-60' : ''}`}>
//                 {message.sender === 'AI' && (
//                   <div className="flex items-center gap-2 mb-1">
//                     <div className="w-8 h-8 rounded-full flex items-center justify-center bg-[#333333] text-white">
//                       AI
//                     </div>
//                   </div>
//                 )}

//                 <div className={`rounded-lg p-3 ${message.sender === 'user'
//                     ? 'bg-white text-black'
//                     : 'bg-[#333333] text-white'
//                   }`}>
//                   <div className="whitespace-pre-wrap">{message.content}</div>

//                   {/* Display files in user messages */}
//                   {message.files && message.files.length > 0 && (
//                     <div className="mt-2 space-y-2">
//                       {message.files.map((file, index) => (
//                         <div key={index} className="p-2 rounded flex items-center bg-[#444444]">
//                           <span className="truncate">{file.name}</span>
//                         </div>
//                       ))}
//                     </div>
//                   )}

//                   {/* Display graph if available in AI message */}
//                   {message.graphId && (
//                     <div className="mt-3 bg-[#222222] rounded-lg overflow-hidden">
//                       <img
//                         src={`http://localhost:5000/graph/${message.graphId}`}
//                         alt="Data visualization"
//                         className="w-full h-auto max-h-64 object-contain"
//                         onError={(e) => {
//                           e.target.style.display = 'none';
//                         }}
//                       />
//                     </div>
//                   )}

//                   {/* Display report/email actions if available */}
//                   {message.reportAvailable && (
//                     <div className="mt-3 flex gap-2">
//                       <button
//                         onClick={handleGenerateReport}
//                         className="px-2 py-1 text-xs bg-[#444444] rounded hover:bg-[#555555] text-white"
//                         disabled={isProcessing}
//                       >
//                         Download Report
//                       </button>
//                       <button
//                         onClick={() => {
//                           if (!userEmail) setShowEmailInput(true);
//                           else handleSendReportByEmail();
//                         }}
//                         className="px-2 py-1 text-xs bg-[#444444] rounded hover:bg-[#555555] text-white"
//                         disabled={isProcessing}
//                       >
//                         Email Report
//                       </button>
//                     </div>
//                   )}

//                   {/* Email notification */}
//                   {message.emailSent && (
//                     <div className="mt-2 text-xs text-green-500">
//                       ✓ Email sent successfully
//                     </div>
//                   )}
//                 </div>

//                 <div className="text-xs text-gray-400 mt-1">
//                   {message.time}
//                 </div>
//               </div>
//             </div>
//           ))}
//           <div ref={messagesEndRef} />
//         </div>
//       </div>

//       {/* Floating action buttons for reports */}
//       {messages.length > 1 && (
//         <div className="fixed bottom-20 right-6 z-10">
//           <div className="flex flex-col gap-2">
//             <button
//               onClick={handleGenerateReport}
//               className="p-3 bg-blue-600 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
//               title="Download Report"
//               disabled={isProcessing}
//             >
//               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
//                 <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
//               </svg>
//             </button>
//             <button
//               onClick={() => {
//                 if (!userEmail) setShowEmailInput(true);
//                 else handleSendReportByEmail();
//               }}
//               className="p-3 bg-green-600 rounded-full shadow-lg hover:bg-green-700 transition-colors"
//               title="Email Report"
//               disabled={isProcessing}
//             >
//               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
//                 <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
//                 <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
//               </svg>
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Fixed Input Area at Bottom */}
//       <div className="fixed bottom-0 left-[308px] right-6 bg-[#111111] border-t border-[#222222]">
//         {/* File Preview Area */}
//         {selectedFiles.length > 0 && (
//           <div className="px-4 py-2 flex flex-wrap gap-2 bg-[#1a1a1a]">
//             {selectedFiles.map((file, index) => (
//               <div key={index} className="p-2 rounded-lg flex items-center gap-2 bg-[#333333]">
//                 <span className="truncate max-w-[150px]">{file.name}</span>
//                 <button
//                   onClick={() => removeFile(index)}
//                   className="text-red-500 hover:text-red-700"
//                 >
//                   ×
//                 </button>
//               </div>
//             ))}
//           </div>
//         )}

//         {/* Input Field */}
//         <div className="p-4">
//           <div className="flex rounded-lg overflow-hidden bg-[#222222]">
//             <button
//               onClick={triggerFileInput}
//               className="p-3 text-gray-400 hover:text-white"
//               disabled={isProcessing}
//             >
//               <Image
//                 src={file_icon}
//                 alt="File Icon"
//                 width={20}
//                 height={20}
//               />
//             </button>

//             <input
//               type="text"
//               value={messageInput}
//               onChange={(e) => setMessageInput(e.target.value)}
//               placeholder={isProcessing ? "Processing..." : "Ask about your data, upload a file, or request a report..."}
//               className="flex-1 p-3 outline-none bg-[#222222] text-white"
//               onKeyPress={(e) => e.key === 'Enter' && !isProcessing && handleSendMessage()}
//               disabled={isProcessing}
//             />

//             <button
//               onClick={handleSendMessage}
//               className={`p-3 ${(messageInput.trim() === '' && selectedFiles.length === 0) || isProcessing
//                   ? 'text-gray-600'
//                   : 'text-gray-400 hover:text-white'
//                 }`}
//               disabled={(messageInput.trim() === '' && selectedFiles.length === 0) || isProcessing}
//             >
//               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transform rotate-90" viewBox="0 0 20 20" fill="currentColor">
//                 <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
//               </svg>
//             </button>

//             <input
//               type="file"
//               ref={fileInputRef}
//               className="hidden"
//               onChange={handleFileUpload}
//               multiple
//               accept=".csv,.xlsx,.pdf"
//               disabled={isProcessing}
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// mpdofied version

"use client"
import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import file_icon from '@/public/file_icon.png';
import { db } from '../../Firebase';
import { collection, addDoc, serverTimestamp, getDocs, query, where } from "firebase/firestore";

export function SmartAnalyst() {
  // State for messages in the current conversation
  const [messages, setMessages] = useState([
    { id: 1, sender: 'AI', content: 'Hi there! How can I help with your data analysis today?', time: '10:00 AM' },
  ]);

  // State for the message input and file handling
  const [messageInput, setMessageInput] = useState('');
  const fileInputRef = useRef(null);
  const [selectedFiles, setSelectedFiles] = useState([]);

  // State for processing status
  const [isProcessing, setIsProcessing] = useState(false);

  // State for user email
  const [userEmail, setUserEmail] = useState('');
  const [showEmailInput, setShowEmailInput] = useState(false);

  // State for toast notifications
  const [toast, setToast] = useState({
    show: false,
    message: '',
    type: ''
  });

  // Reference to auto-scroll messages
  const messagesEndRef = useRef(null);

  // Function to scroll to the bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Auto-scroll when messages update
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Debug email state changes
  useEffect(() => {
    if (userEmail) {
      console.log(`Email address set: ${userEmail}`);
    }
  }, [userEmail]);

  // Function to send FCM notifications
  // Function to send FCM notifications - updated to use a single hardcoded token
// Fix for the sendNotificationToUsers function

const sendNotificationToUsers = async (notificationData) => {
  try {
    // Call your API endpoint that handles FCM notification sending
    const response = await fetch('/api/notification', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        notification: {
          title: notificationData.title,
          body: notificationData.body
          // Remove icon and click_action from here
        },
        android: {
          notification: {
            icon: 'notification_icon',
            clickAction: 'OPEN_ANOMALY_DETAILS'
          }
        },
        webpush: {
          notification: {
            icon: '/notification-icon.png',
            actions: [
              {
                action: 'view',
                title: 'View Anomaly'
              }
            ]
          }
        },
        data: notificationData.data,
        priority: 'high'
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`Failed to send notification: ${errorData}`);
    }

    const result = await response.json();
    console.log('Notification sent successfully:', result);
    return result;
  } catch (error) {
    console.error('Error sending notification:', error);
    throw error;
  }
};
  // Function to handle reporting anomaly to Firebase
  const handleReportToFirebase = async (message) => {
    try {
      // Prepare anomaly data with both backend response and hardcoded values
      const anomalyData = {
        // Hardcoded values
        name: "Krishna Naudiyal",         // Hardcoded name
        contactPhone: "8779509901",  // Hardcoded phone
        flagged: false,                // Initially false
        
        // Data from backend response
        anomalyType: message.anomalyType || "Unknown", 
        anomalySeverity: message.anomalySeverity || "Unknown",
        anomalyCount: message.anomalyCount || 0,
        description: message.anomalyDescription || "No description provided",
        
        // Metadata
        timestamp: serverTimestamp(),
        reportedAt: new Date().toISOString(),
        queryText: message.content || "No query provided"
      };

      // Add to Firebase collection
      const docRef = await addDoc(collection(db, "anomaly"), anomalyData);
      
      console.log("Report sent to Firebase with ID:", docRef.id);
      
      // Send FCM notification
      await sendNotificationToUsers({
        title: `${message.anomalySeverity || 'Unknown'} Severity Anomaly Reported`,
        body: `${message.anomalyType || 'Unknown'} anomaly detected. Description: ${message.anomalyDescription || 'No description provided'}.`,
        data: {
          anomalyId: docRef.id,
          type: message.anomalyType || 'Unknown',
          severity: message.anomalySeverity || 'Unknown',
          url: '/anomalies/details/' + docRef.id
        }
      });
      
      // Show toast notification
      setToast({
        show: true,
        message: "Anomaly reported successfully! Notifications sent.",
        type: "success"
      });
      
      // Hide toast after 3 seconds
      setTimeout(() => {
        setToast({ show: false, message: '', type: '' });
      }, 3000);
      
      // Update the message to show it's been flagged
      setMessages(prev => prev.map(msg => 
        msg.id === message.id ? {...msg, flagged: true} : msg
      ));
      
    } catch (error) {
      console.error("Error reporting to Firebase:", error);
      
      // Show error toast
      setToast({
        show: true,
        message: "Failed to report anomaly. Please try again.",
        type: "error"
      });
      
      // Hide toast after 3 seconds
      setTimeout(() => {
        setToast({ show: false, message: '', type: '' });
      }, 3000);
    }
  };

  // Function to handle file uploads
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setSelectedFiles(prev => [...prev, ...files]);
    }
  };

  // Function to trigger file input click
  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  // Function to remove a file from the selected files
  const removeFile = (index) => {
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
  };

  // Function to extract email from text
  const extractEmail = (text) => {
    const emailPattern = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;
    const match = text.match(emailPattern);
    return match ? match[0] : null;
  };

  // Function to handle file upload to the server
  const handleUploadFile = async (file) => {
    setIsProcessing(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      // Upload to Next.js backend
      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      if (!uploadResponse.ok) {
        const uploadResult = await uploadResponse.json();
        throw new Error(uploadResult.error || 'Upload to server failed');
      }

      const uploadResult = await uploadResponse.json();
      return uploadResult.vectorDbStatus || 'File processed successfully.';
    } catch (error) {
      console.error('Upload error:', error);
      return `Error: ${error.message}. If this persists, try with a different file format or encoding.`;
    }
  };

  // Function to send a query to the backend
  const handleQuery = async (query) => {
    try {
      // Extract email if present in the query
      const extractedEmail = extractEmail(query);
      if (extractedEmail && extractedEmail !== userEmail) {
        setUserEmail(extractedEmail);
      }

      // First check if vector DB files exist in the directory
      const checkVectorStore = await fetch('http://localhost:5000/check_vectordb', {
        method: 'GET',
      });

      const vectorStoreStatus = await checkVectorStore.json();
      if (!vectorStoreStatus.exists) {
        return {
          response: 'Please upload a file first to create the knowledge base.',
          graph_id: null
        };
      }

      // Add special keywords for report generation
      let modifiedQuery = query;
      if (query.toLowerCase().includes('create report') ||
        query.toLowerCase().includes('generate report')) {
        console.log("Report generation detected in query");
      }

      if (query.toLowerCase().includes('send email') ||
        query.toLowerCase().includes('email this')) {
        console.log("Email request detected in query");
      }

      // Proceed with query since vector DB exists
      const res = await fetch('http://localhost:5000/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: modifiedQuery,
          email: userEmail || null  // Send the user's email if available
        })
      });

      const result = await res.json();
      console.log("Backend response:", result); // Log the backend response for debugging

      return result;
    } catch (error) {
      console.error('Query error:', error);
      return {
        response: `Error: ${error.message}`,
        graph_id: null
      };
    }
  };

  // Function to generate and download a PDF report
  const handleGenerateReport = async () => {
    if (messages.length <= 1) {
      // No conversation to report
      return;
    }

    try {
      setIsProcessing(true);
      console.log("Generating PDF report for download...");

      // Get the last user query to use for report generation
      const lastUserMessage = [...messages].reverse().find(m => m.sender === 'user');
      if (!lastUserMessage) {
        throw new Error("No user message found to generate report");
      }

      const response = await fetch('http://localhost:5000/download_report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: lastUserMessage.content,
          email: userEmail || null
        })
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Failed to generate report: ${errorData}`);
      }

      console.log("Report generated successfully, downloading...");

      // Create a blob from the PDF stream
      const blob = await response.blob();

      // Create a link and trigger download
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'data_analysis_report.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Add a message about the report
      const reportMessage = {
        id: messages.length + 1,
        sender: 'AI',
        content: 'I\'ve generated a PDF report based on our conversation. It has been downloaded to your device.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages(prev => [...prev, reportMessage]);

    } catch (error) {
      console.error('Report generation error:', error);
      const errorMessage = {
        id: messages.length + 1,
        sender: 'AI',
        content: `Error generating report: ${error.message}`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsProcessing(false);
    }
  };

  // Function to send report via email
  const handleSendReportByEmail = async () => {
    if (!userEmail) {
      setShowEmailInput(true);
      return;
    }

    try {
      setIsProcessing(true);

      // Create a specific query for email report generation
      const emailReportQuery = `generate report and send it by email to ${userEmail}`;
      console.log("Sending email report request with query:", emailReportQuery);

      const result = await fetch('http://localhost:5000/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: emailReportQuery,
          email: userEmail
        })
      });

      const response = await result.json();
      console.log("Email report response:", response);

      const emailMessage = {
        id: messages.length + 1,
        sender: 'AI',
        content: response.response || `I've sent the report to ${userEmail}.`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        emailSent: true
      };

      setMessages(prev => [...prev, emailMessage]);

    } catch (error) {
      console.error('Email sending error:', error);

      const errorMessage = {
        id: messages.length + 1,
        sender: 'AI',
        content: `Error sending email: ${error.message}`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsProcessing(false);
    }
  };

  // Function to handle email submission
  const handleEmailSubmit = (e) => {
    e.preventDefault();
    setShowEmailInput(false);

    // If email was set and we were trying to send a report
    if (userEmail) {
      handleSendReportByEmail();
    }
  };

  // Main function to handle sending a message
  const handleSendMessage = async () => {
    if (messageInput.trim() === '' && selectedFiles.length === 0) return;

    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Check for email in message
    const extractedEmail = extractEmail(messageInput);
    if (extractedEmail) {
      setUserEmail(extractedEmail);
    }

    // Create and add user message
    const newUserMessage = {
      id: messages.length + 1,
      sender: 'user',
      content: messageInput || "Uploaded file(s)", // Add default text if no input
      time: currentTime,
      files: selectedFiles.map(file => ({ name: file.name, type: file.type })), // Store file metadata
    };

    setMessages(prev => [...prev, newUserMessage]);

    // Save the files for processing
    const filesToProcess = [...selectedFiles];

    // Clear input and files
    setMessageInput('');
    setSelectedFiles([]);
    setIsProcessing(true);

    // Add AI "thinking" message
    const processingMessageId = messages.length + 2;
    const processingMessage = {
      id: processingMessageId,
      sender: 'AI',
      content: (
        <div className="flex items-center gap-2">
          Thinking...
          <div className="h-4 w-4 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
        </div>
      ),
      time: currentTime,
      isProcessing: true,
    };

    setMessages(prev => [...prev, processingMessage]);

    try {
      let responseContent = '';
      let graphId = null;
      let reportAvailable = false;
      let emailSent = false;

      // Handle file uploads if any
      if (filesToProcess.length > 0) {
        const uploadResponses = await Promise.all(
          filesToProcess.map(file => handleUploadFile(file))
        );

        responseContent = uploadResponses.join('\n');
      }

      // Handle query if there's text input
      if (messageInput.trim() !== '') {
        const queryResult = await handleQuery(messageInput);
        responseContent += (responseContent ? '\n\n' : '') + queryResult.response;
        graphId = queryResult.graph_id;
        reportAvailable = queryResult.report || false;
        emailSent = queryResult.email_sent || false;
        
        // Store anomaly information from the backend response
        const anomalyType = queryResult.primary_anomaly?.type || null;
        const anomalySeverity = queryResult.severity || null;
        const anomalyCount = queryResult.anomaly_count || 0;
        const anomalyDescription = queryResult.primary_anomaly?.description || null;

        // Update the AI response
        const finalResponse = {
          id: processingMessageId,
          sender: 'AI',
          content: responseContent,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          graphId: graphId,
          reportAvailable: reportAvailable,
          emailSent: emailSent,
          anomalyType: anomalyType,
          anomalySeverity: anomalySeverity,
          anomalyCount: anomalyCount,
          anomalyDescription: anomalyDescription,
          flagged: false
        };

        setMessages(prev => prev.map(msg =>
          msg.id === processingMessageId ? finalResponse : msg
        ));
      } else {
        // If no query was provided (just file upload)
        const finalResponse = {
          id: processingMessageId,
          sender: 'AI',
          content: responseContent || "I've received your files. You can now ask questions about the data.",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        setMessages(prev => prev.map(msg =>
          msg.id === processingMessageId ? finalResponse : msg
        ));
      }
    } catch (error) {
      // Handle errors
      const errorResponse = {
        id: processingMessageId,
        sender: 'AI',
        content: `Error: ${error.message}`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages(prev => prev.map(msg =>
        msg.id === processingMessageId ? errorResponse : msg
      ));
    } finally {
      setIsProcessing(false);
    }
  };

  // Clear conversation function
  const clearConversation = () => {
    setMessages([{
      id: 1,
      sender: 'AI',
      content: 'Hi there! How can I help with your data analysis today?',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]);
  };

  return (
    <div className="flex flex-col h-[480px] bg-[#111111] text-white relative ml-[4px]">
      {/* Toast notification */}
      {toast.show && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-2 rounded-md shadow-lg flex items-center ${
          toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'
        }`}>
          <div className="mr-2">
            {toast.type === 'success' ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            )}
          </div>
          <div className="text-white">{toast.message}</div>
        </div>
      )}

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-[#111111] h-full">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-[#222222]">
          <div className="font-bold">Smart Analyst</div>
          <div className="flex gap-2">
            {/* Email setup button */}
            <button
              onClick={() => setShowEmailInput(true)}
              className="p-1 text-xs bg-[#333333] rounded hover:bg-[#444444] flex items-center gap-1"
              title="Set Email for Reports"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
              {userEmail ? "Change Email" : "Set Email"}
            </button>

            {isProcessing && (
              <div className="text-sm text-gray-400 flex items-center gap-2">
                <span className="animate-pulse">Processing</span>
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              </div>
            )}

            {/* Email display and report controls */}
            {userEmail && (
              <div className="flex items-center mr-4">
                <div className="text-xs text-gray-400 mr-2">Email: {userEmail}</div>
                <button
                  onClick={handleGenerateReport}
                  className="p-1 text-xs bg-[#333333] rounded hover:bg-[#444444] mr-2"
                  title="Download PDF Report"
                  disabled={isProcessing}
                >
                  Download Report
                </button>
                <button
                  onClick={handleSendReportByEmail}
                  className="p-1 text-xs bg-[#333333] rounded hover:bg-[#444444] mr-1"
                  title="Email Report"
                  disabled={isProcessing}
                >
                  Email Report
                </button>
                <button
                  onClick={() => setUserEmail('')}
                  className="p-1 text-xs bg-red-900 rounded hover:bg-red-800 ml-1"
                  title="Clear Email"
                >
                  ×
                </button>
              </div>
            )}

            <button
              onClick={clearConversation}
              className="p-2 rounded-full text-gray-400 hover:text-white"
              title="Clear conversation"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>

        {/* Email input dialog */}
        {showEmailInput && (
          <div className="absolute top-0 left-0 right-0 bottom-0 bg-black/50 flex items-center justify-center z-10">
            <form onSubmit={handleEmailSubmit} className="bg-[#222222] p-4 rounded-lg shadow-lg w-96">
              <h3 className="text-lg font-semibold mb-4">Enter your email address</h3>
              <input
                type="email"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                placeholder="your.email@example.com"
                className="w-full p-2 mb-4 bg-[#333333] border border-[#444444] rounded text-white"
                required
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowEmailInput(false)}
                  className="px-4 py-2 bg-[#333333] rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 rounded"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Messages container */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-32">
          {messages.map(message => (
            <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[70%] ${message.isProcessing ? 'opacity-60' : ''}`}>
                {message.sender === 'AI' && (
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center bg-[#333333] text-white">
                      AI
                    </div>
                  </div>
                )}

                <div className={`rounded-lg p-3 ${message.sender === 'user'
                    ? 'bg-white text-black'
                    : 'bg-[#333333] text-white'
                  }`}>
                  <div className="whitespace-pre-wrap">{message.content}</div>

                  {/* Display files in user messages */}
                  {message.files && message.files.length > 0 && (
                    <div className="mt-2 space-y-2">
                      {message.files.map((file, index) => (
                        <div key={index} className="p-2 rounded flex items-center bg-[#444444]">
                          <span className="truncate">{file.name}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Display graph if available in AI message */}
                  {message.graphId && (
                    <div className="mt-3 bg-[#222222] rounded-lg overflow-hidden">
                      <img
                        src={`http://localhost:5000/graph/${message.graphId}`}
                        alt="Data visualization"
                        className="w-full h-auto max-h-64 object-contain"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    </div>
                  )}

                  {/* Display anomaly info and report button if there's an anomaly */}
                  {message.sender === 'AI' && message.anomalyType && message.anomalyType !== "none" && (
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center text-xs">
                        <span className={`px-2 py-1 rounded ${
                          message.anomalySeverity === 'High' ? 'bg-red-700' :
                          message.anomalySeverity === 'Medium' ? 'bg-yellow-700' :
                          'bg-blue-700'
                        }`}>
                          {message.anomalySeverity} severity
                        </span>
                        <span className="ml-2 text-gray-400">
                          {message.anomalyType}
                        </span>
                      </div>
                      <button
                        onClick={() => handleReportToFirebase(message)}
                        className={`px-2 py-1 text-xs ${
                          message.flagged ? 'bg-gray-600' : 'bg-red-700 hover:bg-red-600'
                        } rounded text-white ml-2`}
                        disabled={message.flagged}
                      >
                        {message.flagged ? "Reported" : "Report Issue"}
                      </button>
                    </div>
                  )}

                  {/* Display report/email actions if available */}
                  {message.reportAvailable && (
                    <div className="mt-3 flex gap-2">
                      <button
                        onClick={handleGenerateReport}
                        className="px-2 py-1 text-xs bg-[#444444] rounded hover:bg-[#555555] text-white"
                        disabled={isProcessing}
                      >
                        Download Report
                      </button>
                      <button
                        onClick={() => {
                          if (!userEmail) setShowEmailInput(true);
                          else handleSendReportByEmail();
                        }}
                        className="px-2 py-1 text-xs bg-[#444444] rounded hover:bg-[#555555] text-white"
                        disabled={isProcessing}
                      >
                        Email Report
                      </button>
                    </div>
                  )}

                  {/* Email notification */}
                  {message.emailSent && (
                    <div className="mt-2 text-xs text-green-500">
                      ✓ Email sent successfully
                    </div>
                  )}
                </div>

                <div className="text-xs text-gray-400 mt-1">
                  {message.time}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Floating action buttons for reports */}
      {messages.length > 1 && (
        <div className="fixed bottom-20 right-6 z-10">
          <div className="flex flex-col gap-2">
            <button
              onClick={handleGenerateReport}
              className="p-3 bg-blue-600 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
              title="Download Report"
              disabled={isProcessing}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
            <button
              onClick={() => {
                if (!userEmail) setShowEmailInput(true);
                else handleSendReportByEmail();
              }}
              className="p-3 bg-green-600 rounded-full shadow-lg hover:bg-green-700 transition-colors"
              title="Email Report"
              disabled={isProcessing}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Fixed Input Area at Bottom */}
      <div className="fixed bottom-0 left-[308px] right-6 bg-[#111111] border-t border-[#222222]">
        {/* File Preview Area */}
        {selectedFiles.length > 0 && (
          <div className="px-4 py-2 flex flex-wrap gap-2 bg-[#1a1a1a]">
            {selectedFiles.map((file, index) => (
              <div key={index} className="p-2 rounded-lg flex items-center gap-2 bg-[#333333]">
                <span className="truncate max-w-[150px]">{file.name}</span>
                <button
                  onClick={() => removeFile(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Input Field */}
        <div className="p-4">
          <div className="flex rounded-lg overflow-hidden bg-[#222222]">
            <button
              onClick={triggerFileInput}
              className="p-3 text-gray-400 hover:text-white"
              disabled={isProcessing}
            >
              <Image
                src={file_icon}
                alt="File Icon"
                width={20}
                height={20}
              />
            </button>

            <input
              type="text"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              placeholder={isProcessing ? "Processing..." : "Ask about your data, upload a file, or request a report..."}
              className="flex-1 p-3 outline-none bg-[#222222] text-white"
              onKeyPress={(e) => e.key === 'Enter' && !isProcessing && handleSendMessage()}
              disabled={isProcessing}
            />

            <button
              onClick={handleSendMessage}
              className={`p-3 ${(messageInput.trim() === '' && selectedFiles.length === 0) || isProcessing
                  ? 'text-gray-600'
                  : 'text-gray-400 hover:text-white'
                }`}
              disabled={(messageInput.trim() === '' && selectedFiles.length === 0) || isProcessing}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transform rotate-90" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
              </svg>
            </button>

            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileUpload}
              multiple
              accept=".csv,.xlsx,.pdf"
              disabled={isProcessing}
            />
          </div>
        </div>
      </div>
    </div>
  );
}