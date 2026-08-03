'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare, Send, Sparkles, Bot, User, Copy, Check,
  Trash2, BookOpen, Code, HelpCircle, GraduationCap, Lightbulb, RefreshCw
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  codeSnippet?: string;
}

const SAMPLE_PROMPTS = [
  'Explain AVL Tree rotations with a simple C++ code snippet',
  'Summarize VTU 5th Sem DBMS Module 4 Normalization',
  'Generate 3 practice questions on OS Process Synchronization',
  'How to prepare for Google SDE placement interviews in 3 months?',
  'What is the minimum attendance threshold required to write VTU exams?',
];

export default function StudentAIChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-0',
      sender: 'ai',
      text: 'Hello Harsha! I am your AI Academic & Campus Assistant for CollegePES. I can answer syllabus questions, explain complex computer science concepts, generate exam prep practice questions, debug code, or guide your placement preparation.',
      timestamp: '09:00 AM',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = (textToSend?: string) => {
    const query = textToSend || inputText;
    if (!query.trim()) return;

    const userMsg: ChatMessage = {
      id: 'msg-' + Date.now(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputText('');
    setIsTyping(true);

    // Simulate AI Intelligence Response
    setTimeout(() => {
      let aiText = '';
      let codeSnippet: string | undefined;

      const lower = query.toLowerCase();
      if (lower.includes('avl') || lower.includes('tree') || lower.includes('rotation')) {
        aiText = `An **AVL Tree** is a self-balancing binary search tree where the height difference (balance factor) between left and right subtrees of any node cannot exceed 1. When an insertion causes a balance factor of +2 or -2, four types of rotations are performed: Single Left (LL), Single Right (RR), Left-Right (LR), and Right-Left (RL).`;
        codeSnippet = `struct Node {\n    int key;\n    Node* left;\n    Node* right;\n    int height;\n};\n\nNode* rightRotate(Node* y) {\n    Node* x = y->left;\n    Node* T2 = x->right;\n    x->right = y;\n    y->left = T2;\n    y->height = max(height(y->left), height(y->right)) + 1;\n    x->height = max(height(x->left), height(x->right)) + 1;\n    return x;\n}`;
      } else if (lower.includes('normalization') || lower.includes('dbms') || lower.includes('bcnf')) {
        aiText = `**VTU DBMS Module 4 Summary:**\n- **1NF**: Atomic values, no repeating groups.\n- **2NF**: In 1NF and all non-key attributes are fully functionally dependent on the primary key.\n- **3NF**: In 2NF and no transitive dependencies.\n- **BCNF (Boyce-Codd)**: Strict version of 3NF. For every FD X → Y, X must be a super key.`;
      } else if (lower.includes('attendance') || lower.includes('vtu exam') || lower.includes('threshold')) {
        aiText = `According to VTU and CollegePES academic regulations, a minimum of **75% overall attendance** in each subject is strictly mandatory to be eligible for end-semester examinations. Condonation up to 10% may be granted by the Principal on medical grounds with valid documentation.`;
      } else if (lower.includes('placement') || lower.includes('google') || lower.includes('interview')) {
        aiText = `**3-Month Placement Roadmap:**\n1. **Month 1**: Master Arrays, Strings, Hash Maps, Linked Lists, Trees & Recursion on LeetCode.\n2. **Month 2**: Master Graphs, Dynamic Programming, System Design basics, OS & DBMS core.\n3. **Month 3**: Mock interviews, resume tailoring, and solving company specific past year questions!`;
      } else {
        aiText = `Great question regarding "${query}". Based on your course syllabus (Semester 5 Computer Science), I recommend focusing on core fundamentals, reviewing previous year VTU questions, and practicing code implementations!`;
      }

      const aiMsg: ChatMessage = {
        id: 'msg-' + (Date.now() + 1),
        sender: 'ai',
        text: aiText,
        codeSnippet,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 900);
  };

  const handleCopyCode = (id: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col rounded-3xl bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-[#334155] shadow-xl overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 bg-gradient-to-r from-indigo-900 via-indigo-800 to-violet-900 text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center">
            <Bot className="w-5 h-5 text-indigo-200" />
          </div>
          <div>
            <h2 className="text-base font-bold flex items-center gap-2">
              CollegePES AI Academic Assistant
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500 text-white font-extrabold">ONLINE</span>
            </h2>
            <p className="text-xs text-indigo-200">VTU Syllabus • Code Solver • Placement Guide</p>
          </div>
        </div>
        <button
          onClick={() => setMessages([messages[0]])}
          className="p-2 rounded-xl hover:bg-white/10 text-indigo-200 transition-colors"
          title="Clear Conversation"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Preset Chips */}
      <div className="px-6 py-3 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2 overflow-x-auto scrollbar-none">
        <span className="text-xs font-bold text-slate-400 whitespace-nowrap flex items-center gap-1">
          <Lightbulb className="w-3.5 h-3.5 text-amber-500" /> Quick Prompts:
        </span>
        {SAMPLE_PROMPTS.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(prompt)}
            className="px-3 py-1 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-indigo-500 text-xs text-slate-700 dark:text-slate-300 font-medium whitespace-nowrap transition-all"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Message Stream */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-xs font-bold ${
              msg.sender === 'user'
                ? 'bg-gradient-to-r from-indigo-500 to-violet-600 text-white'
                : 'bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400'
            }`}>
              {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            <div className={`max-w-2xl space-y-2 ${msg.sender === 'user' ? 'text-right' : ''}`}>
              <div className={`inline-block p-4 rounded-2xl text-sm leading-relaxed text-left ${
                msg.sender === 'user'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200/60 dark:border-slate-700/60'
              }`}>
                <p className="whitespace-pre-line">{msg.text}</p>

                {msg.codeSnippet && (
                  <div className="mt-3 rounded-xl bg-slate-900 text-slate-100 overflow-hidden font-mono text-xs border border-slate-800">
                    <div className="px-3 py-1.5 bg-slate-800 flex justify-between items-center text-[10px] text-slate-400">
                      <span>C++ Code Example</span>
                      <button
                        onClick={() => handleCopyCode(msg.id, msg.codeSnippet!)}
                        className="flex items-center gap-1 hover:text-white"
                      >
                        {copiedId === msg.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        {copiedId === msg.id ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                    <pre className="p-3 overflow-x-auto">{msg.codeSnippet}</pre>
                  </div>
                )}
              </div>

              <span className="block text-[10px] text-slate-400 px-1">{msg.timestamp}</span>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-xs text-slate-500 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-600 animate-ping" />
              AI Assistant is thinking...
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Footer Input */}
      <div className="p-4 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800 flex items-center gap-3">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask any academic question, programming doubt, or VTU concept..."
          className="flex-1 px-4 py-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
        />
        <button
          onClick={() => handleSend()}
          disabled={!inputText.trim()}
          className="p-3 rounded-2xl bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-40 transition-all shadow-md"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
