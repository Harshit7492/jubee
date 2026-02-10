import { useState } from 'react';
import { Scale, ArrowLeft, Upload, FileText, Download, TrendingUp, AlertCircle } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';

interface PSIToolProps {
  onBack: () => void;
}

interface PSIResult {
  judgmentName: string;
  citation: string;
  psiScore: number;
  courtHierarchy: number;
  benchStrength: number;
  citationFrequency: number;
  judicialTreatment: number;
  contextualMatch: number;
  factualSimilarity: number;
  recommendation: string;
  analysis: string;
}

export function PSITool({ onBack }: PSIToolProps) {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<PSIResult | null>(null);

  const handleAnalyze = () => {
    if (!uploadedFile) return;
    setIsAnalyzing(true);

    setTimeout(() => {
      setResult({
        judgmentName: 'Union of India vs. Azadi Bachao Andolan',
        citation: '(2003) 263 ITR 706 (SC)',
        psiScore: 87,
        courtHierarchy: 95,
        benchStrength: 90,
        citationFrequency: 88,
        judicialTreatment: 82,
        contextualMatch: 78,
        factualSimilarity: 72,
        recommendation: 'Strong Precedent',
        analysis: 'This judgment has high precedential value with frequent citations in subsequent cases. The 5-judge bench strength and consistent judicial treatment make it a reliable precedent for similar matters.'
      });
      setIsAnalyzing(false);
    }, 3000);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 dark:text-green-400';
    if (score >= 60) return 'text-[#F59E0B]';
    return 'text-red-600 dark:text-red-400';
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-green-100 dark:bg-green-500/20';
    if (score >= 60) return 'bg-[#FEF3C7] dark:bg-[#F59E0B]/20';
    return 'bg-red-100 dark:bg-red-500/20';
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="bg-secondary/50 border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onBack} 
              className="w-9 h-9 hover:bg-primary/10"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h3 className="text-xl font-bold text-foreground">Precedent Strength Index</h3>
          </div>
          {result && (
            <Button variant="outline" className="border-border hover:bg-accent font-semibold">
              <Download className="w-4 h-4 mr-2" />
              Download Report
            </Button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Upload Section */}
          {!result && (
            <>
              <div className="bg-card border border-border rounded-xl p-6">
                <label className="block text-sm font-bold text-foreground mb-3">
                  Upload Judgment <span className="text-red-500">*</span>
                </label>
                <div className="border-2 border-dashed border-border rounded-xl p-12 text-center hover:border-primary transition-all cursor-pointer">
                  <input
                    type="file"
                    onChange={(e) => setUploadedFile(e.target.files?.[0] || null)}
                    accept=".pdf"
                    className="hidden"
                    id="psi-file-upload"
                  />
                  <label htmlFor="psi-file-upload" className="cursor-pointer">
                    {uploadedFile ? (
                      <div className="flex items-center justify-center gap-3">
                        <FileText className="w-12 h-12 text-primary" />
                        <div className="text-left">
                          <p className="font-bold text-foreground text-lg">{uploadedFile.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                    ) : (
                      <>
                        <Upload className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                        <p className="text-lg font-semibold text-foreground mb-1">
                          Upload Judgment PDF
                        </p>
                        <p className="text-muted-foreground">
                          We'll analyze its precedential strength
                        </p>
                      </>
                    )}
                  </label>
                </div>
              </div>

              <div className="p-4 bg-gradient-to-r from-primary/10 to-[#FEF3C7] dark:to-[#FBBF24]/20 rounded-xl border border-primary/30">
                <h4 className="text-sm font-bold text-foreground mb-2">📊 What We Analyze</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Court hierarchy and bench strength</li>
                  <li>• Judicial treatment (followed, distinguished, overruled)</li>
                  <li>• Citation frequency in subsequent judgments</li>
                  <li>• Contextual match with your case type</li>
                  <li>• Factual similarity assessment</li>
                </ul>
              </div>

              <Button
                onClick={handleAnalyze}
                disabled={!uploadedFile || isAnalyzing}
                className="w-full h-14 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 text-primary-foreground font-bold shadow-lg shadow-primary/30"
              >
                {isAnalyzing ? (
                  <>Analyzing Precedent Strength...</>
                ) : (
                  <><Scale className="w-5 h-5 mr-2" />Analyze PSI</>
                )}
              </Button>
            </>
          )}

          {/* Results */}
          {result && (
            <div className="space-y-6">
              {/* Header */}
              <div className="bg-card border border-border rounded-xl p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h4 className="text-xl font-bold text-foreground mb-2">{result.judgmentName}</h4>
                    <Badge className="bg-primary text-primary-foreground font-bold">
                      {result.citation}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <div className={`text-5xl font-bold ${getScoreColor(result.psiScore)} mb-1`}>
                      {result.psiScore}
                    </div>
                    <div className="text-sm text-muted-foreground font-semibold">PSI Score</div>
                  </div>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-foreground leading-relaxed">{result.analysis}</p>
                </div>
              </div>

              {/* Score Breakdown */}
              <div className="bg-card border border-border rounded-xl p-6">
                <h4 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  Detailed Score Breakdown
                </h4>
                <div className="space-y-4">
                  {[
                    { label: 'Court Hierarchy & Bench', score: result.courtHierarchy },
                    { label: 'Judicial Treatment', score: result.judicialTreatment },
                    { label: 'Citation Frequency', score: result.citationFrequency },
                    { label: 'Contextual Match', score: result.contextualMatch },
                    { label: 'Factual Similarity', score: result.factualSimilarity }
                  ].map((item) => (
                    <div key={item.label}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold text-foreground">{item.label}</span>
                        <span className={`text-lg font-bold ${getScoreColor(item.score)}`}>
                          {item.score}%
                        </span>
                      </div>
                      <div className="h-3 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full ${getScoreBg(item.score)} transition-all`}
                          style={{ width: `${item.score}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommendation */}
              <div className={`border-2 rounded-xl p-6 ${
                result.psiScore >= 80
                  ? 'bg-green-50 dark:bg-green-500/10 border-green-200 dark:border-green-500/30'
                  : result.psiScore >= 60
                  ? 'bg-[#FEF3C7] dark:bg-[#F59E0B]/10 border-[#F59E0B]/30'
                  : 'bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/30'
              }`}>
                <div className="flex items-center gap-3 mb-3">
                  <AlertCircle className={`w-6 h-6 ${getScoreColor(result.psiScore)}`} />
                  <h4 className="text-lg font-bold text-foreground">Recommendation</h4>
                </div>
                <p className={`text-base font-semibold ${getScoreColor(result.psiScore)}`}>
                  {result.recommendation}
                </p>
              </div>

              <Button
                onClick={() => { setResult(null); setUploadedFile(null); }}
                variant="outline"
                className="w-full h-12 border-border hover:bg-accent font-semibold"
              >
                Analyze Another Judgment
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}