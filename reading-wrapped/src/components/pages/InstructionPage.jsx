import React, { useState } from "react";
import { Upload, AlertCircle, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import instructionsImage from "../media/Instructions.jpeg";

const InstructionPage = ({ onPageComplete }) => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [isValidating, setIsValidating] = useState(false);
  const [isValidated, setIsValidated] = useState(false);

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
    setIsValidating(true);
    try {
      // Here you would call your Python validation script
      // For now, simulating validation with a timeout
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setIsValidated(true);
      setError("");
    } catch (err) {
      setError(
        "Invalid file format. Please ensure this is a Goodreads export file."
      );
      setIsValidated(false);
    } finally {
      setIsValidating(false);
    }
  };

  const handleProceed = () => {
    if (isValidated) {
      onPageComplete();
    }
  };

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
        <Alert
          variant="destructive"
          className="bg-red-900/50 border-red-500/50"
        >
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-white">{error}</AlertDescription>
        </Alert>
      )}

      <Button
        onClick={handleProceed}
        disabled={!file || !isValidated || isValidating}
        className={`w-full max-w-sm ${
          isValidated ? "bg-blue-600 hover:bg-blue-700" : ""
        }`}
      >
        {!file ? (
          "Awaiting File"
        ) : isValidating ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Validating...
          </>
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
