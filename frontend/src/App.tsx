import { useState, useEffect } from "react";
import axios from "axios";
import {
  Loader2,
  Download,
  Upload,
  Copy,
  Check,
  Video,
  Subtitles,
  Github,
  Film,
  BriefcaseBusiness,
} from "lucide-react";

import { API_URL } from "./config";

interface FileState {
  file: File | null;
  preview: string;
}

const App = () => {
  const [loading, setLoading] = useState(false);
  const [subtitles, setSubtitles] = useState("");
  const [selectedFile, setSelectedFile] = useState<FileState>({
    file: null,
    preview: "",
  });
  const [loadingText, setLoadingText] = useState("Processing");
  const [copied, setCopied] = useState(false);

  const loadingTexts = [
    "Processing your video 🎥",
    "This might take a while ⏳",
    "Analyzing video content 🔍",
    "Generating subtitles 📝",
    "Almost there 🚀",
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (loading) {
      let index = 0;
      interval = setInterval(() => {
        index = (index + 1) % loadingTexts.length;
        setLoadingText(loadingTexts[index]);
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    if (!selectedFile.file) return;

    setLoading(true);
    try {
      const formData = new FormData(e.currentTarget);
      const response = await axios.post(`${API_URL}/api/subs/`, formData);
      setSubtitles(response.data.subs);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setLoadingText(loadingTexts[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      setSelectedFile({ file, preview: url });

      return () => URL.revokeObjectURL(url);
    }
  };

  const handleDownload = (format: "srt" | "txt") => {
    const blob = new Blob([subtitles], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `subtitle.${format}`;
    link.click();
    link.remove();
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(subtitles);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 to-black text-white">
      {/* Header */}
      <nav className="w-full max-w-7xl mx-auto flex justify-between items-center  pt-10">
        <div className="flex items-center gap-2">
          <Film className="w-8 h-8 text-purple-500" />
          <span className=" text-2xl font-light bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text">
            MP4 TITLES
          </span>
        </div>
        <div className=" flex gap-5">
          <a
            href="https://github.com/kapildadhich075/Mp4Titles"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:text-purple-400 transition-colors"
          >
            <Github className="w-6 h-6" />
            <span className="hidden sm:inline">View on GitHub</span>
          </a>
          <a
            href="https://github.com/kapildadhich075/Mp4Titles"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 hover:text-white transition-colors"
          >
            <BriefcaseBusiness className="h-5 w-5" />
            <span className="font-['Inter']">Portfolio</span>
          </a>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8 md:py-16">
        <header className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Subtitles className="w-12 h-12 text-blue-500" />
            <h1 className="text-4xl md:text-5xl font-bold font-['Space_Grotesk'] bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
              Video Subtitle Generator
            </h1>
          </div>
          <p className="text-lg text-gray-400 font-['Inter'] max-w-2xl mx-auto">
            Transform your videos with AI-powered subtitle generation 🎬 ✨
          </p>
        </header>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          <div className="bg-zinc-900/50 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-white/10 shadow-xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block mb-2 text-lg font-medium font-['Inter']">
                  Upload Video File 📹
                </label>
                <div className="relative group">
                  <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-blue-500/30 border-dashed rounded-xl cursor-pointer bg-zinc-800/50 hover:bg-zinc-800/80 transition-all duration-300">
                    <div className="flex flex-col items-center justify-center p-6 text-center">
                      <Upload className="w-10 h-10 mb-3 text-blue-500 group-hover:scale-110 transition-transform" />
                      <p className="mb-2 text-sm font-['Inter']">
                        <span className="font-semibold text-blue-400">
                          Click to upload
                        </span>{" "}
                        or drag & drop
                      </p>
                      <p className="text-xs text-gray-400">
                        Supports MP4, MKV formats
                      </p>
                    </div>
                    <input
                      type="file"
                      name="video"
                      className="hidden"
                      accept="video/*,.mkv"
                      onChange={handleFileChange}
                    />
                  </label>
                </div>

                {selectedFile.file && (
                  <div className="mt-6 space-y-3">
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Video className="w-4 h-4" />
                      <span className="font-['Inter'] truncate">
                        {selectedFile.file.name}
                      </span>
                    </div>
                    <div className="rounded-xl overflow-hidden bg-zinc-800/50 border border-white/10">
                      <video
                        src={selectedFile.preview}
                        controls
                        className="w-full max-h-[400px]"
                      />
                    </div>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={loading || !selectedFile.file}
                className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium rounded-xl hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02] font-['Inter']"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    {loadingText}
                  </div>
                ) : (
                  "Generate Subtitles ✨"
                )}
              </button>
            </form>
          </div>

          {subtitles && (
            <div className="bg-zinc-900/50 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-white/10 shadow-xl">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <h2 className="text-xl font-semibold font-['Space_Grotesk']">
                  Generated Subtitles 📝
                </h2>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-2 px-4 py-2 bg-zinc-800 rounded-lg hover:bg-zinc-700 transition-all duration-300 font-['Inter']"
                  >
                    {copied ? (
                      <Check className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                    {copied ? "Copied! ✅" : "Copy"}
                  </button>
                  <button
                    onClick={() => handleDownload("srt")}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-all duration-300 font-['Inter']"
                  >
                    <Download className="w-4 h-4" />
                    SRT
                  </button>
                  <button
                    onClick={() => handleDownload("txt")}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-500 hover:bg-purple-600 rounded-lg transition-all duration-300 font-['Inter']"
                  >
                    <Download className="w-4 h-4" />
                    TXT
                  </button>
                </div>
              </div>
              <div className="bg-zinc-800/50 rounded-xl p-4 max-h-[500px] overflow-auto border border-white/10">
                <pre className="whitespace-pre-wrap font-mono text-sm text-gray-300">
                  {subtitles}
                </pre>
              </div>
            </div>
          )}
        </div>

        <footer className="mt-12 text-center text-gray-400">
          <div className="flex flex-col items-center gap-2">
            <p className="font-['Inter']">Built with ❤️ by Kapil Dadhich</p>
            <p className="text-sm">
              © {new Date().getFullYear()} MP4 TITLES. All rights reserved. ✨
            </p>
            <a
              href="https://github.com/kapildadhich075"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 hover:text-white transition-colors"
            >
              <Github className="h-5 w-5" />
              <span className="font-['Inter']">Follow me on GitHub 👨‍💻</span>
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default App;
