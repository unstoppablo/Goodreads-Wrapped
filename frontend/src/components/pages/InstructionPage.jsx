// InstructionPage.jsx
import React, { useState, useEffect } from "react";
import { Upload, AlertCircle, Loader2, BookOpen, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import instructionsImage from "../media/Instructions.jpeg";

const InstructionPage = ({ onPageComplete }) => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [isValidating, setIsValidating] = useState(false);
  const [isValidated, setIsValidated] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [analysisError, setAnalysisError] = useState(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let progressInterval;
    if (isAnalyzing) {
      progressInterval = setInterval(() => {
        setProgress((prev) => Math.min(prev + 2, 95));
      }, 400);
    }
    return () => clearInterval(progressInterval);
  }, [isAnalyzing]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.name.endsWith(".csv")) {
      setFile(file);
      setError("");
      setIsValidated(false);
      validateFile(file);
    } else {
      setError("Please upload a valid CSV file from Goodreads");
      setFile(null);
      setIsValidated(false);
    }
  };

  const validateFile = async (file) => {
    try {
      setIsValidating(true);
      const formData = new FormData();
      formData.append("file", file);

      const API_BASE_URL =
        import.meta.env.VITE_API_BASE_URL || "http://192.168.50.232:5001";
      const response = await fetch(`${API_BASE_URL}/validate`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);

      const result = await response.json();

      if (result.status) {
        setIsValidated(true);
        setError("");
        // Remove automatic handleProceed call
      } else {
        setError(result.error || "Invalid Goodreads file");
        setIsValidated(false);
      }
    } catch (err) {
      setError("Validation failed. Please try again.");
      setIsValidated(false);
    } finally {
      setIsValidating(false);
    }
  };

  const handleProceed = async () => {
    if (isValidated && file) {
      try {
        console.log("File size before sending:", file.size);
        const fileReader = new FileReader();
        fileReader.onload = async (e) => {
          const content = e.target.result;
          console.log("File content length:", content.length);
        };
        fileReader.readAsText(file);
        console.log("Starting analysis");
        setIsAnalyzing(true);
        setProgress(0);

        const formData = new FormData();
        formData.append("file", file);

        // Log the formData contents
        const formDataEntries = Array.from(formData.entries());
        console.log("FormData contents:", formDataEntries);

        const API_BASE_URL =
          import.meta.env.VITE_API_BASE_URL || "http://192.168.50.232:5001";

        console.log("Sending request to:", `${API_BASE_URL}/analyze`);
        const response = await fetch(`${API_BASE_URL}/analyze`, {
          method: "POST",
          body: formData,
        });

        console.log("Response received:", response.status);
        const result = await response.json();
        console.log("Analysis result:", result);

        setTimeout(() => {
          onPageComplete(result);
        }, 1000);
      } catch (err) {
        setAnalysisError(err.message);
        setProgress(0);
      }
    }
  };

  if (isAnalyzing) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 w-full max-w-lg mx-auto space-y-8">
        <div className="text-2xl md:text-3xl font-bold text-center flex items-center justify-center gap-3 text-white">
          <BookOpen className="w-8 h-8 animate-pulse" />
          {analysisError ? "Analysis Failed" : "Analyzing your books..."}
        </div>

        <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-white transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        {analysisError ? (
          <>
            <p className="text-red-500 text-center">{analysisError}</p>
            <button
              onClick={() => {
                setIsAnalyzing(false);
                setAnalysisError(null);
              }}
              className="w-full px-6 py-3 bg-red-600 hover:bg-red-700 rounded-lg transition-all duration-300"
            >
              Try Again
            </button>
          </>
        ) : (
          <p className="text-white text-center">
            {isReady ? (
              <span className="flex items-center justify-center gap-2">
                <Sparkles className="w-5 h-5" />
                Analysis complete!
              </span>
            ) : (
              "This will take about a minute..."
            )}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 w-full max-w-lg mx-auto space-y-8">
      <h1 className="text-2xl md:text-4xl font-bold text-center text-white">
        Your Reading Journey Awaits
      </h1>

      <div className="space-y-4 flex flex-col items-start w-full">
        <div className="text-lg text-white flex items-start">
          <span className="mr-2">1.</span>
          <span>Sign into GoodReads</span>
        </div>

        <div className="text-lg text-white flex items-start">
          <span className="mr-2">2.</span>
          <span>
            <a
              href="https://www.goodreads.com/review/import"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              Export your GoodReads Library
            </a>
          </span>
        </div>

        <div className="text-lg text-white flex items-start">
          <span className="mr-2">3.</span>
          <span>Wait for export to complete</span>
        </div>

        <div className="w-full flex justify-center">
          <img
            src={instructionsImage}
            alt="GoodReads export completion example"
            className="rounded-lg border border-white/10 w-full max-w-sm"
          />
        </div>

        <div className="text-lg text-white flex items-start">
          <span className="mr-2">4.</span>
          <span className="flex-1">Select the "Your export..." link</span>
        </div>

        <div className="text-lg text-white flex items-start">
          <span className="mr-2">5.</span>
          <span>
            <label className="block text-blue-400 hover:text-blue-300 cursor-pointer">
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="hidden"
              />
              {file ? file.name : "Upload your file here"}
            </label>
          </span>
        </div>
      </div>

      {error && (
        <div className="w-full max-w-sm text-red-500 text-center">{error}</div>
      )}

      <Button
        onClick={handleProceed}
        disabled={!file || !isValidated || isValidating}
        className={`w-full max-w-sm ${
          isValidated
            ? "bg-blue-600 hover:bg-blue-700"
            : file
            ? "bg-red-600 hover:bg-red-700"
            : ""
        }`}
      >
        {!file ? (
          "Awaiting File"
        ) : isValidating ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Validating...
          </>
        ) : !isValidated ? (
          "Invalid CSV"
        ) : (
          "Proceed"
        )}
      </Button>

      <p className="text-sm text-white/80 text-center">
        Your data remains private and is processed entirely on your device
      </p>
    </div>
  );
};

export default InstructionPage;
