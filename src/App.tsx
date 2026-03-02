import React, { useState } from 'react';
import { 
  Search, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  ExternalLink, 
  Loader2, 
  History,
  Info,
  ArrowRight,
  Shield
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Markdown from 'react-markdown';
import { verifyInformation, type VerificationResult } from './services/verificationService';
import { cn } from './lib/utils';

export default function App() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<Array<{ input: string; veracity: string }>>([]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await verifyInformation(input);
      setResult(data);
      setHistory(prev => [{ input: input.slice(0, 50) + (input.length > 50 ? '...' : ''), veracity: data.veracity }, ...prev].slice(0, 5));
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const getVeracityIcon = (veracity: string) => {
    switch (veracity) {
      case 'True': return <CheckCircle2 className="w-8 h-8 text-emerald-500" />;
      case 'False': return <XCircle className="w-8 h-8 text-rose-500" />;
      case 'Misleading': return <AlertTriangle className="w-8 h-8 text-amber-500" />;
      case 'Partially True': return <Info className="w-8 h-8 text-blue-500" />;
      default: return <HelpCircle className="w-8 h-8 text-slate-400" />;
    }
  };

  const getVeracityColor = (veracity: string) => {
    switch (veracity) {
      case 'True': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'False': return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'Misleading': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Partially True': return 'bg-blue-50 text-blue-700 border-blue-200';
      default: return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-1.5 rounded-lg">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">VERITAS</h1>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <a href="#" className="hover:text-indigo-600 transition-colors">How it works</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">Methodology</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">API</a>
          </nav>
          <div className="flex items-center gap-4">
            <button className="text-sm font-medium text-slate-600 hover:text-slate-900">Sign In</button>
            <button className="bg-slate-900 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-slate-800 transition-colors">
              Get Started
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 tracking-tight"
          >
            Verify the Truth in Real-Time
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-slate-600 max-w-2xl mx-auto"
          >
            Instant news verification powered by advanced AI and credible global sources. 
            Combat misinformation with data-driven insights in any language.
          </motion.p>
        </div>

        {/* Search Bar */}
        <div className="max-w-3xl mx-auto mb-16">
          <form onSubmit={handleVerify} className="relative group">
            <div className="absolute inset-0 bg-indigo-500/10 rounded-2xl blur-xl group-focus-within:bg-indigo-500/20 transition-all duration-500" />
            <div className="relative flex items-center bg-white border-2 border-slate-200 rounded-2xl p-2 focus-within:border-indigo-500 transition-all shadow-sm">
              <Search className="w-6 h-6 text-slate-400 ml-3" />
              <input 
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Paste an article URL or enter a claim to verify..."
                className="flex-1 px-4 py-3 bg-transparent outline-none text-slate-900 placeholder:text-slate-400"
              />
              <button 
                disabled={loading || !input.trim()}
                className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    Verify
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
          
          {/* Quick Stats/History */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-xs font-medium text-slate-500">
            <div className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              1.2M+ Claims Verified
            </div>
            <div className="w-1 h-1 bg-slate-300 rounded-full" />
            <div className="flex items-center gap-1">
              <History className="w-3.5 h-3.5" />
              Recent: {history.length > 0 ? history[0].input : 'No recent searches'}
            </div>
          </div>
        </div>

        {/* Results Section */}
        <AnimatePresence mode="wait">
          {loading && (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-3xl mx-auto text-center py-12"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-50 mb-6">
                <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Analyzing Sources</h3>
              <p className="text-slate-500">Cross-referencing with global news databases and credible archives...</p>
            </motion.div>
          )}

          {error && (
            <motion.div 
              key="error"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-3xl mx-auto bg-rose-50 border border-rose-200 rounded-2xl p-6 flex items-start gap-4"
            >
              <AlertTriangle className="w-6 h-6 text-rose-500 shrink-0" />
              <div>
                <h3 className="font-semibold text-rose-900">Verification Failed</h3>
                <p className="text-rose-700 text-sm">{error}</p>
              </div>
            </motion.div>
          )}

          {result && (
            <motion.div 
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl mx-auto space-y-8"
            >
              {/* Verdict Card */}
              <div className={cn(
                "border rounded-3xl p-8 shadow-sm transition-all",
                getVeracityColor(result.veracity)
              )}>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-white p-3 rounded-2xl shadow-sm">
                      {getVeracityIcon(result.veracity)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-bold uppercase tracking-wider opacity-70">Verdict</span>
                        <div className="w-1 h-1 bg-current rounded-full opacity-30" />
                        <span className="text-sm font-bold">{result.confidence}% Confidence</span>
                      </div>
                      <h3 className="text-3xl font-bold mb-2">{result.veracity}</h3>
                      <p className="text-lg font-medium opacity-90 leading-snug">
                        {result.summary}
                      </p>
                    </div>
                  </div>
                  <div className="flex md:flex-col items-center md:items-end gap-2">
                    <div className="text-xs font-bold uppercase tracking-widest opacity-50 mb-1">Reliability Score</div>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div 
                          key={i} 
                          className={cn(
                            "w-8 h-1.5 rounded-full",
                            i <= (result.confidence / 20) ? "bg-current" : "bg-current opacity-20"
                          )} 
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Detailed Analysis */}
                <div className="lg:col-span-2 space-y-6">
                  <section className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
                    <h4 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                      <Info className="w-5 h-5 text-indigo-600" />
                      Detailed Analysis
                    </h4>
                    <div className="markdown-body">
                      <Markdown>{result.analysis}</Markdown>
                    </div>
                  </section>
                </div>

                {/* Sources & Sidebar */}
                <div className="space-y-6">
                  <section className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
                    <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                      <ExternalLink className="w-4 h-4 text-indigo-600" />
                      Credible Sources
                    </h4>
                    <div className="space-y-3">
                      {result.sources.length > 0 ? result.sources.map((source, idx) => (
                        <a 
                          key={idx}
                          href={source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block p-3 rounded-xl border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50 transition-all group"
                        >
                          <div className="text-sm font-semibold text-slate-900 line-clamp-1 group-hover:text-indigo-700">
                            {source.title}
                          </div>
                          <div className="text-[10px] text-slate-500 truncate mt-1">
                            {new URL(source.url).hostname}
                          </div>
                        </a>
                      )) : (
                        <p className="text-sm text-slate-500 italic">No direct links available.</p>
                      )}
                    </div>
                  </section>

                  <section className="bg-slate-900 text-white rounded-3xl p-6 shadow-sm overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                      <Shield className="w-24 h-24" />
                    </div>
                    <h4 className="text-sm font-bold uppercase tracking-wider mb-2 relative z-10">Methodology</h4>
                    <p className="text-xs text-slate-400 leading-relaxed relative z-10">
                      Veritas uses a multi-layered verification process. We cross-reference claims against 
                      verified news archives, government records, and academic databases in real-time.
                    </p>
                    <button className="mt-4 text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 relative z-10">
                      Learn more <ArrowRight className="w-3 h-3" />
                    </button>
                  </section>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty State / Features */}
        {!result && !loading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            {[
              {
                icon: <Search className="w-6 h-6 text-indigo-600" />,
                title: "Real-Time Search",
                desc: "Accesses the latest web data to verify breaking news as it happens."
              },
              {
                icon: <ShieldCheck className="w-6 h-6 text-emerald-600" />,
                title: "Credible Sources",
                desc: "Prioritizes high-authority domains, official statements, and peer-reviewed data."
              },
              {
                icon: <AlertTriangle className="w-6 h-6 text-amber-600" />,
                title: "Bias Detection",
                desc: "Identifies misleading framing and emotional manipulation in text."
              }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + (i * 0.1) }}
                className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm"
              >
                <div className="mb-4">{feature.icon}</div>
                <h4 className="font-bold text-slate-900 mb-2">{feature.title}</h4>
                <p className="text-sm text-slate-600 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-12">
        <div className="max-w-5xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-indigo-600" />
            <span className="font-bold tracking-tight">VERITAS</span>
          </div>
          <div className="flex gap-8 text-sm text-slate-500">
            <a href="#" className="hover:text-slate-900">Privacy Policy</a>
            <a href="#" className="hover:text-slate-900">Terms of Service</a>
            <a href="#" className="hover:text-slate-900">Contact</a>
          </div>
          <div className="text-sm text-slate-400">
            © 2026 Veritas AI. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
