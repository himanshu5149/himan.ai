/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";
import { 
  Send, 
  Copy, 
  Check, 
  RefreshCw, 
  User, 
  Settings, 
  Layout, 
  Type, 
  Smile, 
  Target,
  Image as ImageIcon,
  MoreHorizontal,
  ThumbsUp,
  MessageSquare,
  Repeat,
  Share2,
  Twitter,
  Github,
  Globe,
  Link as LinkIcon,
  Edit2,
  Save,
  Trash2,
  History,
  X,
  Search,
  Filter,
  Calendar,
  Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const TONES = ['Bold', 'Inspirational', 'Educational', 'Conversational', 'Humble', 'Provocative'];
const AUDIENCES = ['Founders', 'Job Seekers', 'Marketers', 'Engineers', 'Sales People', 'General Professionals'];
const LENGTHS = ['Short', 'Medium', 'Long'];

export default function App() {
  const [idea, setIdea] = useState('');
  const [audience, setAudience] = useState('Founders');
  const [tone, setTone] = useState('Bold');
  const [length, setLength] = useState('Short');
  const [creatorName, setCreatorName] = useState('Himanshu');
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [twitterUrl, setTwitterUrl] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [generatedPost, setGeneratedPost] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [drafts, setDrafts] = useState<{id: string, content: string, timestamp: number, scheduledAt?: number}[]>([]);
  const [showDrafts, setShowDrafts] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'draft' | 'scheduled'>('all');
  const [showScheduler, setShowScheduler] = useState(false);
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleGenerate = async () => {
    if (!idea.trim()) {
      setError('Please enter an idea first.');
      return;
    }

    setIsGenerating(true);
    setError('');
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
      const model = "gemini-3.1-pro-preview";
      
      const prompt = `
        You are a professional LinkedIn ghostwriter.
        Your task is to turn the following idea into a high-performing LinkedIn post.

        Goal:
        - Make the post engaging, relatable, and valuable
        - Optimize for readability and engagement
        - Keep it authentic and human (not robotic)

        Instructions:
        - Start with a strong hook (1–2 lines max)
        - Use short sentences and line breaks
        - Write at a 6th–8th grade reading level
        - Use a conversational tone
        - Avoid jargon and buzzwords
        - Include a clear takeaway or lesson
        - End with a soft call-to-action (question or opinion prompt)

        Structure:
        1. Hook
        2. Context / story
        3. Insight or lesson
        4. Actionable takeaway
        5. Call-to-action

        Input idea: ${idea}
        Audience: ${audience}
        Tone: ${tone}
        Length: ${length}
        Creator Name: ${creatorName}

        Output only the polished LinkedIn post ready to publish. No preamble or commentary.
      `;

      const result = await ai.models.generateContent({
        model,
        contents: prompt,
      });

      const text = result.text;
      if (text) {
        setGeneratedPost(text.trim());
      } else {
        throw new Error("No content generated.");
      }
    } catch (err: any) {
      console.error(err);
      setError('Failed to generate post. Please check your API key or try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedPost);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const saveDraft = () => {
    if (!generatedPost.trim()) return;
    const newDraft = {
      id: Math.random().toString(36).substr(2, 9),
      content: generatedPost,
      timestamp: Date.now()
    };
    setDrafts([newDraft, ...drafts]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const schedulePost = () => {
    if (!generatedPost.trim() || !scheduledDate || !scheduledTime) return;
    
    const scheduledAt = new Date(`${scheduledDate}T${scheduledTime}`).getTime();
    if (isNaN(scheduledAt)) {
      setError('Invalid date or time.');
      return;
    }

    const newDraft = {
      id: Math.random().toString(36).substr(2, 9),
      content: generatedPost,
      timestamp: Date.now(),
      scheduledAt
    };
    setDrafts([newDraft, ...drafts]);
    setShowScheduler(false);
    setScheduledDate('');
    setScheduledTime('');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const deleteDraft = (id: string) => {
    setDrafts(drafts.filter(d => d.id !== id));
  };

  const loadDraft = (content: string) => {
    setGeneratedPost(content);
    setShowDrafts(false);
  };

  return (
    <div className="min-h-screen bg-[#F4F2EE] text-[#1D2226] font-sans selection:bg-[#0A66C2]/20">
      {/* Header */}
      <header className="bg-white border-b border-[#EBEBEB] sticky top-0 z-10 px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-[#0A66C2] p-1.5 rounded">
              <Layout className="text-white w-5 h-5" />
            </div>
            <h1 className="font-bold text-xl tracking-tight">himanwriter.ai</h1>
          </div>
          <div className="flex items-center gap-4 text-[#666666]">
            <button 
              onClick={() => setShowDrafts(!showDrafts)}
              className="flex items-center gap-2 hover:text-[#0A66C2] transition-colors font-semibold text-sm"
            >
              <History className="w-5 h-5" />
              My Drafts ({drafts.length})
            </button>
            <Settings className="w-5 h-5 cursor-pointer hover:text-[#1D2226] transition-colors" />
            <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden border border-[#EBEBEB]">
              {profilePic ? (
                <img src={profilePic} alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                <User className="w-full h-full p-1 text-gray-400" />
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 relative">
        {/* Drafts Sidebar Overlay */}
        <AnimatePresence>
          {showDrafts && (
            <motion.div
              initial={{ opacity: 0, x: 300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 300 }}
              className="fixed right-0 top-0 h-full w-80 bg-white shadow-2xl z-50 border-l border-[#EBEBEB] p-6 overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-bold text-lg flex items-center gap-2">
                  <History className="w-5 h-5 text-[#0A66C2]" />
                  My Drafts
                </h2>
                <button onClick={() => setShowDrafts(false)} className="p-1 hover:bg-gray-100 rounded-full">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#666666]" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search drafts..."
                    className="w-full pl-10 pr-4 py-2 bg-[#F9FAFB] border border-[#EBEBEB] rounded-lg text-sm focus:ring-2 focus:ring-[#0A66C2] outline-none"
                  />
                </div>
                <div className="flex gap-2">
                  {(['all', 'draft', 'scheduled'] as const).map((status) => (
                    <button
                      key={status}
                      onClick={() => setFilterStatus(status)}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                        filterStatus === status
                          ? 'bg-[#0A66C2] text-white'
                          : 'bg-[#F9FAFB] text-[#666666] border border-[#EBEBEB] hover:bg-gray-50'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
              
              {drafts.length === 0 ? (
                <div className="text-center py-12 text-[#666666]">
                  <p className="text-sm">No drafts saved yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {drafts
                    .filter(d => {
                      const matchesSearch = d.content.toLowerCase().includes(searchQuery.toLowerCase());
                      const matchesFilter = 
                        filterStatus === 'all' || 
                        (filterStatus === 'scheduled' && d.scheduledAt) || 
                        (filterStatus === 'draft' && !d.scheduledAt);
                      return matchesSearch && matchesFilter;
                    })
                    .map(draft => (
                    <div key={draft.id} className="p-4 bg-[#F9FAFB] border border-[#EBEBEB] rounded-xl hover:border-[#0A66C2] transition-all group">
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          draft.scheduledAt ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {draft.scheduledAt ? 'Scheduled' : 'Draft'}
                        </span>
                        {draft.scheduledAt && (
                          <span className="text-[10px] text-emerald-600 flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(draft.scheduledAt).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                      <p className="text-sm line-clamp-3 mb-3 text-[#1D2226]">{draft.content}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-[#666666]">
                          Created {new Date(draft.timestamp).toLocaleDateString()}
                        </span>
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => loadDraft(draft.content)}
                            className="p-1.5 hover:bg-[#0A66C2]/10 text-[#0A66C2] rounded-lg"
                            title="Load Draft"
                          >
                            <RefreshCw className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => deleteDraft(draft.id)}
                            className="p-1.5 hover:bg-red-50 text-red-500 rounded-lg"
                            title="Delete Draft"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Left Column: Inputs */}
        <div className="lg:col-span-5 space-y-6">
          <section className="bg-white rounded-xl shadow-sm border border-[#EBEBEB] overflow-hidden">
            <div className="p-6 space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-[#666666] flex items-center gap-2">
                  <Smile className="w-4 h-4" />
                  Your Idea
                </label>
                <textarea
                  value={idea}
                  onChange={(e) => setIdea(e.target.value)}
                  placeholder="e.g., Most people fail on LinkedIn because they try to sound professional instead of being real."
                  className="w-full h-32 p-4 bg-[#F9FAFB] border border-[#EBEBEB] rounded-lg focus:ring-2 focus:ring-[#0A66C2] focus:border-transparent outline-none transition-all resize-none text-[15px]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-[#666666] flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    Audience
                  </label>
                  <select
                    value={audience}
                    onChange={(e) => setAudience(e.target.value)}
                    className="w-full p-2.5 bg-[#F9FAFB] border border-[#EBEBEB] rounded-lg focus:ring-2 focus:ring-[#0A66C2] outline-none text-sm"
                  >
                    {AUDIENCES.map(a => <option key={a} value={a}>{a}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-[#666666] flex items-center gap-2">
                    <Type className="w-4 h-4" />
                    Tone
                  </label>
                  <select
                    value={tone}
                    onChange={(e) => setTone(e.target.value)}
                    className="w-full p-2.5 bg-[#F9FAFB] border border-[#EBEBEB] rounded-lg focus:ring-2 focus:ring-[#0A66C2] outline-none text-sm"
                  >
                    {TONES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-[#666666] flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Creator Name
                  </label>
                  <input
                    type="text"
                    value={creatorName}
                    onChange={(e) => setCreatorName(e.target.value)}
                    className="w-full p-2.5 bg-[#F9FAFB] border border-[#EBEBEB] rounded-lg focus:ring-2 focus:ring-[#0A66C2] outline-none text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-[#666666] flex items-center gap-2">
                    <ImageIcon className="w-4 h-4" />
                    Profile Pic
                  </label>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full p-2.5 bg-[#F9FAFB] border border-[#EBEBEB] rounded-lg text-sm text-[#666666] hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                  >
                    {profilePic ? 'Change Photo' : 'Upload Photo'}
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    className="hidden"
                    accept="image/*"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-[#666666] flex items-center gap-2">
                  <LinkIcon className="w-4 h-4" />
                  Social Links
                </label>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 bg-[#F9FAFB] border border-[#EBEBEB] rounded-lg px-3 py-1.5 focus-within:ring-2 focus-within:ring-[#0A66C2]">
                    <Twitter className="w-4 h-4 text-[#1DA1F2]" />
                    <input
                      type="text"
                      value={twitterUrl}
                      onChange={(e) => setTwitterUrl(e.target.value)}
                      placeholder="Twitter URL"
                      className="bg-transparent outline-none text-sm w-full"
                    />
                  </div>
                  <div className="flex items-center gap-2 bg-[#F9FAFB] border border-[#EBEBEB] rounded-lg px-3 py-1.5 focus-within:ring-2 focus-within:ring-[#0A66C2]">
                    <Github className="w-4 h-4 text-[#181717]" />
                    <input
                      type="text"
                      value={githubUrl}
                      onChange={(e) => setGithubUrl(e.target.value)}
                      placeholder="GitHub URL"
                      className="bg-transparent outline-none text-sm w-full"
                    />
                  </div>
                  <div className="flex items-center gap-2 bg-[#F9FAFB] border border-[#EBEBEB] rounded-lg px-3 py-1.5 focus-within:ring-2 focus-within:ring-[#0A66C2]">
                    <Globe className="w-4 h-4 text-[#666666]" />
                    <input
                      type="text"
                      value={websiteUrl}
                      onChange={(e) => setWebsiteUrl(e.target.value)}
                      placeholder="Personal Website"
                      className="bg-transparent outline-none text-sm w-full"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-[#666666]">Post Length</label>
                <div className="flex gap-2">
                  {LENGTHS.map(l => (
                    <button
                      key={l}
                      onClick={() => setLength(l)}
                      className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                        length === l 
                        ? 'bg-[#0A66C2] text-white shadow-md shadow-[#0A66C2]/20' 
                        : 'bg-[#F9FAFB] text-[#666666] border border-[#EBEBEB] hover:bg-gray-50'
                      }`}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full py-4 bg-[#0A66C2] hover:bg-[#004182] text-white rounded-full font-bold text-lg flex items-center justify-center gap-3 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                {isGenerating ? (
                  <RefreshCw className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                )}
                {isGenerating ? 'Drafting...' : 'Generate Post'}
              </button>

              {error && (
                <p className="text-red-500 text-sm text-center font-medium">{error}</p>
              )}
            </div>
          </section>
        </div>

        {/* Right Column: Preview */}
        <div className="lg:col-span-7">
          <div className="sticky top-24 space-y-4">
            <div className="flex items-center justify-between px-2">
              <h2 className="text-sm font-bold text-[#666666] uppercase tracking-wider">Preview</h2>
              {generatedPost && (
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="flex items-center gap-2 text-sm font-semibold text-[#666666] hover:text-[#0A66C2]"
                  >
                    {isEditing ? <Save className="w-4 h-4" /> : <Edit2 className="w-4 h-4" />}
                    {isEditing ? 'Save Edit' : 'Edit'}
                  </button>
                  <div className="relative">
                    <button
                      onClick={() => setShowScheduler(!showScheduler)}
                      className="flex items-center gap-2 text-sm font-semibold text-[#666666] hover:text-[#0A66C2]"
                    >
                      <Calendar className="w-4 h-4" />
                      Schedule
                    </button>
                    <AnimatePresence>
                      {showScheduler && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute right-0 top-full mt-2 w-64 bg-white shadow-xl border border-[#EBEBEB] rounded-xl p-4 z-20"
                        >
                          <h4 className="font-bold text-sm mb-3">Schedule Post</h4>
                          <div className="space-y-3">
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-[#666666] uppercase">Date</label>
                              <div className="relative">
                                <Calendar className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-[#666666]" />
                                <input
                                  type="date"
                                  value={scheduledDate}
                                  onChange={(e) => setScheduledDate(e.target.value)}
                                  className="w-full pl-7 pr-2 py-1.5 bg-[#F9FAFB] border border-[#EBEBEB] rounded-lg text-xs outline-none focus:ring-2 focus:ring-[#0A66C2]"
                                />
                              </div>
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold text-[#666666] uppercase">Time</label>
                              <div className="relative">
                                <Clock className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-[#666666]" />
                                <input
                                  type="time"
                                  value={scheduledTime}
                                  onChange={(e) => setScheduledTime(e.target.value)}
                                  className="w-full pl-7 pr-2 py-1.5 bg-[#F9FAFB] border border-[#EBEBEB] rounded-lg text-xs outline-none focus:ring-2 focus:ring-[#0A66C2]"
                                />
                              </div>
                            </div>
                            <button
                              onClick={schedulePost}
                              className="w-full py-2 bg-[#0A66C2] text-white rounded-lg text-xs font-bold hover:bg-[#004182] transition-colors"
                            >
                              Confirm Schedule
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  <button
                    onClick={saveDraft}
                    className="flex items-center gap-2 text-sm font-semibold text-[#666666] hover:text-[#0A66C2]"
                  >
                    <History className="w-4 h-4" />
                    Save Draft
                  </button>
                  <button
                    onClick={copyToClipboard}
                    className="flex items-center gap-2 text-sm font-semibold text-[#0A66C2] hover:underline"
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {copied ? 'Copied!' : 'Copy Post'}
                  </button>
                </div>
              )}
            </div>

            <AnimatePresence mode="wait">
              {generatedPost ? (
                <motion.div
                  key="post"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white rounded-xl shadow-sm border border-[#EBEBEB] overflow-hidden"
                >
                  {/* LinkedIn Post Header */}
                  <div className="p-4 flex items-start justify-between">
                    <div className="flex gap-3">
                      <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden border border-[#EBEBEB] flex-shrink-0">
                        {profilePic ? (
                          <img src={profilePic} alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        ) : (
                          <User className="w-full h-full p-2 text-gray-400" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-bold text-[15px] hover:text-[#0A66C2] hover:underline cursor-pointer">{creatorName}</h3>
                        <p className="text-xs text-[#666666]">Founder & Visionary • 1st</p>
                        <div className="flex items-center gap-2 mt-1">
                          {twitterUrl && <Twitter className="w-3 h-3 text-[#1DA1F2]" />}
                          {githubUrl && <Github className="w-3 h-3 text-[#181717]" />}
                          {websiteUrl && <Globe className="w-3 h-3 text-[#666666]" />}
                          <p className="text-[10px] text-[#666666] flex items-center gap-1">
                            Just now • 🌐
                          </p>
                        </div>
                      </div>
                    </div>
                    <MoreHorizontal className="w-5 h-5 text-[#666666] cursor-pointer" />
                  </div>

                  {/* Post Content */}
                  <div className="px-4 pb-4 text-[15px] leading-relaxed text-[#1D2226]">
                    {isEditing ? (
                      <textarea
                        value={generatedPost}
                        onChange={(e) => setGeneratedPost(e.target.value)}
                        className="w-full h-64 p-3 bg-[#F9FAFB] border border-[#0A66C2] rounded-lg focus:ring-2 focus:ring-[#0A66C2] outline-none resize-none"
                      />
                    ) : (
                      <div className="whitespace-pre-wrap">{generatedPost}</div>
                    )}
                  </div>

                  {/* LinkedIn Post Footer */}
                  <div className="border-t border-[#EBEBEB] px-4 py-2 flex items-center justify-between text-[#666666]">
                    <div className="flex items-center gap-1">
                      <div className="flex -space-x-1">
                        <div className="w-4 h-4 rounded-full bg-[#0A66C2] flex items-center justify-center">
                          <ThumbsUp className="w-2.5 h-2.5 text-white" />
                        </div>
                      </div>
                      <span className="text-xs">0</span>
                    </div>
                    <div className="text-xs hover:text-[#0A66C2] cursor-pointer">0 comments • 0 reposts</div>
                  </div>

                  <div className="border-t border-[#EBEBEB] px-2 py-1 flex items-center justify-around">
                    <button className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded transition-colors text-[#666666] font-semibold text-sm">
                      <ThumbsUp className="w-5 h-5" /> Like
                    </button>
                    <button className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded transition-colors text-[#666666] font-semibold text-sm">
                      <MessageSquare className="w-5 h-5" /> Comment
                    </button>
                    <button className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded transition-colors text-[#666666] font-semibold text-sm">
                      <Repeat className="w-5 h-5" /> Repost
                    </button>
                    <button className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded transition-colors text-[#666666] font-semibold text-sm">
                      <Share2 className="w-5 h-5" /> Send
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-white/50 border-2 border-dashed border-[#EBEBEB] rounded-xl h-[400px] flex flex-col items-center justify-center text-[#666666] p-8 text-center"
                >
                  <div className="bg-white p-4 rounded-full shadow-sm mb-4">
                    <Layout className="w-8 h-8 text-[#0A66C2]" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">Your post will appear here</h3>
                  <p className="text-sm max-w-xs">Enter your idea on the left and click generate to see the magic happen.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-6xl mx-auto p-8 text-center text-[#666666] text-sm">
        <p>© 2026 himanwriter.ai. Built for creators.</p>
      </footer>
    </div>
  );
}
