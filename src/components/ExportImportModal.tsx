import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Download, 
  Upload, 
  Copy, 
  FileJson, 
  FileText, 
  FileSpreadsheet,
  CheckCircle,
  AlertCircle,
  FileDown
} from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import {
  toJSON,
  toMarkdown,
  toCSV,
  getCSVTemplate,
  parseCSV,
  copyToClipboard,
  downloadFile
} from '@/utils/dataConverters';

interface ExportImportModalProps {
  data: {
    apps: any[];
    apiKeys: any[];
    bookmarks: any[];
  };
  onImport: (data: any) => void;
  trigger: React.ReactNode;
  mode: 'export' | 'import';
}

const ExportImportModal = ({ data, onImport, trigger, mode }: ExportImportModalProps) => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  // Handle copy to clipboard
  const handleCopy = async (format: 'json' | 'markdown') => {
    const content = format === 'json' ? toJSON(data) : toMarkdown(data);
    const success = await copyToClipboard(content);
    
    if (success) {
      setCopied(format);
      toast({
        title: "Copied!",
        description: `Data copied to clipboard in ${format.toUpperCase()} format`
      });
      setTimeout(() => setCopied(null), 2000);
    } else {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive"
      });
    }
  };

  // Handle download
  const handleDownload = (format: 'json' | 'csv' | 'template') => {
    const date = new Date().toISOString().split('T')[0];
    
    if (format === 'json') {
      downloadFile(toJSON(data), `ai-manager-export-${date}.json`, 'application/json');
      toast({
        title: "Downloaded!",
        description: "JSON file downloaded successfully"
      });
    } else if (format === 'csv') {
      downloadFile(toCSV(data), `ai-manager-export-${date}.csv`, 'text/csv');
      toast({
        title: "Downloaded!",
        description: "CSV file downloaded successfully"
      });
    } else if (format === 'template') {
      downloadFile(getCSVTemplate(), 'ai-manager-import-template.csv', 'text/csv');
      toast({
        title: "Template Downloaded!",
        description: "Use this template to prepare your import data"
      });
    }
  };

  // Handle file import
  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const content = e.target?.result as string;
        let importedData;
        
        if (file.name.endsWith('.json')) {
          importedData = JSON.parse(content);
        } else if (file.name.endsWith('.csv')) {
          importedData = parseCSV(content);
        } else {
          throw new Error('Unsupported file format');
        }
        
        onImport(importedData);
        setIsOpen(false);
        toast({
          title: "Import Complete",
          description: "Your data has been imported successfully"
        });
      } catch (error) {
        toast({
          title: "Import Error",
          description: "Failed to import data. Please check the file format.",
          variant: "destructive"
        });
      }
    };
    reader.readAsText(file);
  };

  if (mode === 'export') {
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          {trigger}
        </DialogTrigger>
        <DialogContent className="max-w-2xl bg-gray-900 border-gray-700">
          <DialogHeader>
            <DialogTitle className="glass-pink-glow-strong">Export Data</DialogTitle>
            <DialogDescription>
              Choose how you want to export your data
            </DialogDescription>
          </DialogHeader>
          
          <Tabs defaultValue="clipboard" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-gray-800">
              <TabsTrigger value="clipboard">Copy to Clipboard</TabsTrigger>
              <TabsTrigger value="download">Download File</TabsTrigger>
            </TabsList>
            
            <TabsContent value="clipboard" className="space-y-4">
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-lg glass-pink-glow">Copy Options</CardTitle>
                  <CardDescription>
                    Copy your data to clipboard in your preferred format
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button
                    onClick={() => handleCopy('json')}
                    className="bg-blue-600 hover:bg-blue-700 justify-start"
                    disabled={copied === 'json'}
                  >
                    {copied === 'json' ? (
                      <CheckCircle className="w-4 h-4 mr-2" />
                    ) : (
                      <FileJson className="w-4 h-4 mr-2" />
                    )}
                    {copied === 'json' ? 'Copied!' : 'Copy as JSON'}
                  </Button>
                  
                  <Button
                    onClick={() => handleCopy('markdown')}
                    className="bg-purple-600 hover:bg-purple-700 justify-start"
                    disabled={copied === 'markdown'}
                  >
                    {copied === 'markdown' ? (
                      <CheckCircle className="w-4 h-4 mr-2" />
                    ) : (
                      <FileText className="w-4 h-4 mr-2" />
                    )}
                    {copied === 'markdown' ? 'Copied!' : 'Copy as Markdown'}
                  </Button>
                </CardContent>
              </Card>
              
              <div className="bg-blue-500/10 border border-blue-500/50 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-blue-500 mt-0.5" />
                  <div className="text-sm">
                    <p className="text-blue-400 font-medium">Clipboard Formats</p>
                    <p className="text-blue-300/80">JSON: Best for reimporting data</p>
                    <p className="text-blue-300/80">Markdown: Best for documentation</p>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="download" className="space-y-4">
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-lg glass-pink-glow">Download Options</CardTitle>
                  <CardDescription>
                    Download your data as a file
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button
                    onClick={() => handleDownload('json')}
                    className="bg-green-600 hover:bg-green-700 justify-start"
                  >
                    <FileJson className="w-4 h-4 mr-2" />
                    Download JSON
                  </Button>
                  
                  <Button
                    onClick={() => handleDownload('csv')}
                    className="bg-orange-600 hover:bg-orange-700 justify-start"
                  >
                    <FileSpreadsheet className="w-4 h-4 mr-2" />
                    Download CSV
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-lg glass-pink-glow">CSV Template</CardTitle>
                  <CardDescription>
                    Download a template for importing data via CSV
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    onClick={() => handleDownload('template')}
                    variant="outline"
                    className="border-gray-700 text-white hover:bg-gray-800/50"
                  >
                    <FileDown className="w-4 h-4 mr-2" />
                    Download CSV Template
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          <div className="text-center text-xs text-gray-500">
            <p>Total: {data.apps.length} apps, {data.apiKeys.length} keys, {data.bookmarks.length} bookmarks</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Import mode
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-xl bg-gray-900 border-gray-700">
        <DialogHeader>
          <DialogTitle className="glass-pink-glow-strong">Import Data</DialogTitle>
          <DialogDescription>
            Import your data from a JSON or CSV file
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-lg glass-pink-glow">Step 1: Download Template</CardTitle>
              <CardDescription>
                Get the CSV template to prepare your data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => handleDownload('template')}
                variant="outline"
                className="border-gray-700 text-white hover:bg-gray-800/50 w-full"
              >
                <FileDown className="w-4 h-4 mr-2" />
                Download CSV Template
              </Button>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-lg glass-pink-glow">Step 2: Upload File</CardTitle>
              <CardDescription>
                Select a JSON or CSV file to import
              </CardDescription>
            </CardHeader>
            <CardContent>
              <label className="cursor-pointer">
                <input 
                  type="file" 
                  accept=".json,.csv" 
                  className="hidden" 
                  onChange={handleFileImport}
                />
                <Button 
                  variant="default"
                  className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 w-full"
                  asChild
                >
                  <span>
                    <Upload className="w-4 h-4 mr-2" />
                    Choose File to Import
                  </span>
                </Button>
              </label>
            </CardContent>
          </Card>
          
          <div className="bg-yellow-500/10 border border-yellow-500/50 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-yellow-500 mt-0.5" />
              <div className="text-sm">
                <p className="text-yellow-400 font-medium">Important</p>
                <p className="text-yellow-300/80">Importing will replace all existing data</p>
                <p className="text-yellow-300/80">Make sure to export a backup first</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExportImportModal;