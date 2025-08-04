import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Eye, 
  EyeOff, 
  Edit3, 
  Trash2, 
  Bookmark, 
  Globe, 
  Key,
  Tag,
  Search,
  Filter,
  PlusCircle,
  Shield,
  Zap,
  BookOpen,
  Download,
  Upload,
  Save,
  RefreshCw,
  LogOut,
  Settings,
  Copy,
  Edit2,
  Github,
  Heart
} from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { useDatabase } from '@/hooks/useDatabase';
import ExportImportModal from '@/components/ExportImportModal';
import EditModal from '@/components/EditModal';

// Types
interface App {
  id: string;
  name: string;
  description: string;
  url?: string;
  apiKeyId?: string;
  createdAt: string;
}

interface ApiKey {
  id: string;
  name: string;
  key: string;
  createdAt: string;
  lastUsed?: string;
  isActive: boolean;
}

interface Bookmark {
  id: string;
  title: string;
  url: string;
  tags: string[];
  createdAt: string;
}

const Dashboard = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'apps' | 'apiKeys' | 'bookmarks'>('apps');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTag, setFilterTag] = useState('all');
  
  // Database hooks
  const {
    apps,
    apiKeys,
    bookmarks,
    loading,
    addApp,
    updateApp,
    deleteApp,
    addApiKey,
    updateApiKey,
    deleteApiKey,
    addBookmark,
    updateBookmark,
    deleteBookmark
  } = useDatabase();

  const [newApp, setNewApp] = useState<Omit<App, 'id' | 'createdAt'>>({ 
    name: '', 
    description: '', 
    url: '', 
    apiKeyId: '' 
  });
  
  const [newApiKey, setNewApiKey] = useState<Omit<ApiKey, 'id' | 'createdAt'>>({ 
    name: '', 
    key: '', 
    lastUsed: undefined, 
    isActive: true 
  });
  
  const [newBookmark, setNewBookmark] = useState<Omit<Bookmark, 'id' | 'createdAt'>>({ 
    title: '', 
    url: '', 
    tags: [] 
  });

  const [showApiKey, setShowApiKey] = useState<Record<string, boolean>>({});
  
  // Edit modal state
  const [editModal, setEditModal] = useState<{
    isOpen: boolean;
    type: 'app' | 'apiKey' | 'bookmark' | null;
    data: any;
  }>({
    isOpen: false,
    type: null,
    data: null
  });

  // Get all unique tags for filtering
  const allTags = Array.from(new Set(bookmarks.flatMap(b => b.tags)));

  // Filter data based on search and filter
  const filteredApps = apps.filter(app => 
    app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredApiKeys = apiKeys.filter(key => 
    key.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    key.key.includes(searchTerm)
  );

  const filteredBookmarks = bookmarks.filter(bookmark => {
    const matchesSearch = 
      bookmark.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bookmark.url.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterTag === 'all') return matchesSearch;
    return matchesSearch && bookmark.tags.includes(filterTag);
  });

  const handleAddApp = async () => {
    if (!newApp.name.trim()) {
      toast({ title: "Error", description: "Please enter an app name" });
      return;
    }
    
    try {
      await addApp(newApp);
      setNewApp({ name: '', description: '', url: '', apiKeyId: '' });
      toast({ title: "Success", description: "App added successfully" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to add app" });
    }
  };

  const handleAddApiKey = async () => {
    if (!newApiKey.name.trim() || !newApiKey.key.trim()) {
      toast({ title: "Error", description: "Please enter both name and key" });
      return;
    }
    
    try {
      await addApiKey(newApiKey);
      setNewApiKey({ name: '', key: '', lastUsed: undefined, isActive: true });
      toast({ title: "Success", description: "API key added successfully" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to add API key" });
    }
  };

  const handleAddBookmark = async () => {
    if (!newBookmark.title.trim() || !newBookmark.url.trim()) {
      toast({ title: "Error", description: "Please enter both title and URL" });
      return;
    }
    
    try {
      await addBookmark(newBookmark);
      setNewBookmark({ title: '', url: '', tags: [] });
      toast({ title: "Success", description: "Bookmark added successfully" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to add bookmark" });
    }
  };

  const handleDeleteApp = async (id: string) => {
    try {
      await deleteApp(id);
      toast({ title: "Success", description: "App deleted successfully" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete app" });
    }
  };

  const handleDeleteApiKey = async (id: string) => {
    try {
      await deleteApiKey(id);
      toast({ title: "Success", description: "API key deleted successfully" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete API key" });
    }
  };

  const handleDeleteBookmark = async (id: string) => {
    try {
      await deleteBookmark(id);
      toast({ title: "Success", description: "Bookmark deleted successfully" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete bookmark" });
    }
  };

  const toggleApiKeyVisibility = (id: string) => {
    setShowApiKey(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Open edit modal
  const openEditModal = (type: 'app' | 'apiKey' | 'bookmark', data: any) => {
    setEditModal({
      isOpen: true,
      type,
      data
    });
  };

  // Handle edit save
  const handleEditSave = async (updatedData: any) => {
    try {
      if (editModal.type === 'app') {
        await updateApp(updatedData.id, updatedData);
        toast({ title: "Success", description: "Application updated successfully" });
      } else if (editModal.type === 'apiKey') {
        await updateApiKey(updatedData.id, updatedData);
        toast({ title: "Success", description: "API key updated successfully" });
      } else if (editModal.type === 'bookmark') {
        await updateBookmark(updatedData.id, updatedData);
        toast({ title: "Success", description: "Bookmark updated successfully" });
      }
      
      setEditModal({ isOpen: false, type: null, data: null });
    } catch (error) {
      toast({ 
        title: "Error", 
        description: "Failed to update item",
        variant: "destructive" 
      });
    }
  };

  // Export data to JSON
  const exportData = () => {
    const data = {
      apps,
      apiKeys,
      bookmarks
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ai-manager-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({ title: "Export Complete", description: "Your data has been exported successfully" });
  };

  // Import data from JSON
  // Import data (now accepts parsed data directly from modal)
  const importData = async (data: any) => {
    try {
      // Clear existing data
      for (const app of apps) await deleteApp(app.id);
      for (const key of apiKeys) await deleteApiKey(key.id);
      for (const bookmark of bookmarks) await deleteBookmark(bookmark.id);
      
      // Add imported data
      for (const app of data.apps || []) {
        await addApp({
          name: app.name,
          description: app.description,
          url: app.url,
          apiKeyId: app.apiKeyId
        });
      }
      
      for (const key of data.apiKeys || []) {
        await addApiKey({
          name: key.name,
          key: key.key,
          lastUsed: key.lastUsed,
          isActive: key.isActive
        });
      }
      
      for (const bookmark of data.bookmarks || []) {
        await addBookmark({
          title: bookmark.title,
          url: bookmark.url,
          tags: bookmark.tags
        });
      }
      
      toast({ title: "Import Complete", description: "Your data has been imported successfully" });
    } catch (error) {
      toast({ title: "Import Error", description: "Failed to import data. Please check the file format.", variant: "destructive" });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4">Loading your data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <img 
                src="/myvault-logo.png" 
                alt="My Vault Logo" 
                className="w-10 h-10 md:w-12 md:h-12 rounded-lg shadow-lg"
              />
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-pink-400 to-purple-500 bg-clip-text text-transparent">
                My Vault
              </h1>
            </div>
            <div className="flex gap-2 items-center">
              <div className="flex gap-2">
              <Badge variant="secondary">
                <Zap className="w-3 h-3 mr-1" />
                {apps.length} Apps
              </Badge>
              <Badge variant="secondary">
                <Key className="w-3 h-3 mr-1" />
                {apiKeys.length} Keys
              </Badge>
              <Badge variant="secondary">
                <Bookmark className="w-3 h-3 mr-1" />
                {bookmarks.length} Bookmarks
              </Badge>
              </div>
              <div className="border-l border-gray-700 h-8 mx-2"></div>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-pink-400"
                onClick={() => {
                  window.location.href = '/settings';
                }}
              >
                <Settings className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-red-400"
                onClick={() => {
                  sessionStorage.removeItem('authenticated');
                  window.location.href = '/';
                }}
              >
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          </div>
          <p className="text-gray-400">
            Your secure vault for API keys, applications, and bookmarks
          </p>
        </header>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700 shadow-lg border border-gray-700/50 hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium glass-pink-glow-subtle">AI Applications</p>
                  <p className="text-2xl font-bold mt-1 glass-pink-glow-strong">{apps.length}</p>
                </div>
                <Shield className="w-8 h-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700 shadow-lg border border-gray-700/50 hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium glass-pink-glow-subtle">API Keys</p>
                  <p className="text-2xl font-bold mt-1 glass-pink-glow-strong">{apiKeys.length}</p>
                </div>
                <Key className="w-8 h-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700 shadow-lg border border-gray-700/50 hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium glass-pink-glow-subtle">Bookmarks</p>
                  <p className="text-2xl font-bold mt-1 glass-pink-glow-strong">{bookmarks.length}</p>
                </div>
                <Bookmark className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search..."
              className="pl-10 bg-gray-800/50 backdrop-blur-sm border-gray-700 text-white placeholder:text-gray-500 shadow-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2">
            <select
              className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-md px-3 py-2 text-white shadow-lg"
              value={filterTag}
              onChange={(e) => setFilterTag(e.target.value)}
            >
              <option value="all">All Tags</option>
              {allTags.map(tag => (
                <option key={tag} value={tag}>{tag}</option>
              ))}
            </select>
            
            <Button 
              variant="outline" 
              className="border-gray-700 text-white hover:bg-gray-800/50 hover:text-pink-400 shadow-lg"
              onClick={() => {
                setActiveTab('apps');
                setSearchTerm('');
                setFilterTag('all');
              }}
            >
              <Filter className="w-4 h-4 mr-2" />
              Reset Filters
            </Button>
          </div>
        </div>

        {/* Export/Import Controls */}
        <div className="flex flex-wrap gap-2 mb-6">
          <ExportImportModal
            data={{ apps, apiKeys, bookmarks }}
            onImport={importData}
            mode="export"
            trigger={
              <Button className="bg-green-600 hover:bg-green-700 shadow-lg">
                <Download className="w-4 h-4 mr-2" />
                Export Data
              </Button>
            }
          />
          
          <ExportImportModal
            data={{ apps, apiKeys, bookmarks }}
            onImport={importData}
            mode="import"
            trigger={
              <Button 
                variant="outline"
                className="border-gray-700 text-white hover:bg-gray-800/50 hover:text-pink-400 shadow-lg"
              >
                <Upload className="w-4 h-4 mr-2" />
                Import Data
              </Button>
            }
          />
          
          <Button 
            variant="outline"
            className="border-gray-700 text-white hover:bg-gray-800/50 hover:text-pink-400 shadow-lg"
            onClick={() => window.location.reload()}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh Data
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-700 mb-6">
          <button
            className={`px-4 py-2 font-medium text-sm flex items-center gap-2 ${
              activeTab === 'apps'
                ? 'text-blue-400 border-b-2 border-blue-400'
                : 'text-gray-400 hover:text-white'
            }`}
            onClick={() => setActiveTab('apps')}
          >
            <Shield className="w-4 h-4" />
            AI Applications
          </button>
          <button
            className={`px-4 py-2 font-medium text-sm flex items-center gap-2 ${
              activeTab === 'apiKeys'
                ? 'text-blue-400 border-b-2 border-blue-400'
                : 'text-gray-400 hover:text-white'
            }`}
            onClick={() => setActiveTab('apiKeys')}
          >
            <Key className="w-4 h-4" />
            API Keys
          </button>
          <button
            className={`px-4 py-2 font-medium text-sm flex items-center gap-2 ${
              activeTab === 'bookmarks'
                ? 'text-blue-400 border-b-2 border-blue-400'
                : 'text-gray-400 hover:text-white'
            }`}
            onClick={() => setActiveTab('bookmarks')}
          >
            <Bookmark className="w-4 h-4" />
            Bookmarks
          </button>
        </div>

        {/* Content based on active tab */}
        {activeTab === 'apps' && (
          <div className="space-y-6">
            {/* Add App Form */}
            <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700 shadow-lg border border-gray-700/50 hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PlusCircle className="w-5 h-5 text-pink-500" />
                  <span className="glass-pink-glow">Add New AI Application</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    placeholder="Application Name"
                    className="bg-gray-800/50 backdrop-blur-sm border-gray-700 text-white shadow-lg"
                    value={newApp.name}
                    onChange={(e) => setNewApp({...newApp, name: e.target.value})}
                  />
                  <Input
                    placeholder="Description"
                    className="bg-gray-800/50 backdrop-blur-sm border-gray-700 text-white shadow-lg"
                    value={newApp.description}
                    onChange={(e) => setNewApp({...newApp, description: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    placeholder="URL (optional)"
                    className="bg-gray-800/50 backdrop-blur-sm border-gray-700 text-white shadow-lg"
                    value={newApp.url}
                    onChange={(e) => setNewApp({...newApp, url: e.target.value})}
                  />
                  <Input
                    placeholder="API Key ID (optional)"
                    className="bg-gray-800/50 backdrop-blur-sm border-gray-700 text-white shadow-lg"
                    value={newApp.apiKeyId}
                    onChange={(e) => setNewApp({...newApp, apiKeyId: e.target.value})}
                  />
                </div>
                <Button 
                  onClick={handleAddApp}
                  className="bg-blue-600 hover:bg-blue-700 shadow-lg"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Application
                </Button>
              </CardContent>
            </Card>

            {/* Apps List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredApps.map(app => (
                <Card 
                  key={app.id} 
                  className="bg-gray-800/50 backdrop-blur-sm border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-700/50 hover:border-blue-500/50"
                >
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg glass-pink-glow">{app.name}</CardTitle>
                      <div className="flex gap-1">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => openEditModal('app', app)}
                          className="text-gray-400 hover:text-pink-400"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDeleteApp(app.id)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-gray-300 text-sm">{app.description}</p>
                    {app.url && (
                      <div className="flex items-center gap-2 text-sm">
                        <Globe className="w-4 h-4 text-blue-400" />
                        <a 
                          href={app.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:underline truncate"
                        >
                          {app.url}
                        </a>
                      </div>
                    )}
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-400">
                        Created: {app.createdAt}
                      </span>
                      <Badge variant="secondary">
                        {app.apiKeyId ? 'Connected' : 'Not Connected'}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'apiKeys' && (
          <div className="space-y-6">
            {/* Add API Key Form */}
            <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700 shadow-lg border border-gray-700/50 hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="w-5 h-5 text-pink-500" />
                  <span className="glass-pink-glow">Add New API Key</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    placeholder="Key Name"
                    className="bg-gray-800/50 backdrop-blur-sm border-gray-700 text-white shadow-lg"
                    value={newApiKey.name}
                    onChange={(e) => setNewApiKey({...newApiKey, name: e.target.value})}
                  />
                  <Input
                    placeholder="API Key"
                    className="bg-gray-800/50 backdrop-blur-sm border-gray-700 text-white shadow-lg"
                    value={newApiKey.key}
                    onChange={(e) => setNewApiKey({...newApiKey, key: e.target.value})}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={newApiKey.isActive}
                    onChange={(e) => setNewApiKey({...newApiKey, isActive: e.target.checked})}
                    className="rounded"
                  />
                  <label htmlFor="isActive" className="text-sm glass-pink-glow-subtle">Active Key</label>
                </div>
                <Button 
                  onClick={handleAddApiKey}
                  className="bg-purple-600 hover:bg-purple-700 shadow-lg"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add API Key
                </Button>
              </CardContent>
            </Card>

            {/* API Keys List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredApiKeys.map(key => (
                <Card 
                  key={key.id} 
                  className="bg-gray-800/50 backdrop-blur-sm border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-700/50 hover:border-purple-500/50"
                >
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg glass-pink-glow">{key.name}</CardTitle>
                      <div className="flex gap-1">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => toggleApiKeyVisibility(key.id)}
                          className="text-gray-400 hover:text-pink-400 transition-colors"
                        >
                          {showApiKey[key.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => openEditModal('apiKey', key)}
                          className="text-gray-400 hover:text-pink-400"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDeleteApiKey(key.id)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2 group">
                      <Key className="w-4 h-4 text-purple-400 flex-shrink-0" />
                      <span 
                        className={`font-mono text-sm break-all transition-all duration-300 cursor-pointer flex-1 ${
                          showApiKey[key.id] 
                            ? 'text-pink-300 hover:text-pink-400' 
                            : 'api-key-masked'
                        }`}
                        onClick={async () => {
                          await navigator.clipboard.writeText(key.key);
                          toast({ 
                            title: "Copied!", 
                            description: "API key copied to clipboard" 
                          });
                        }}
                        title="Click to copy"
                      >
                        {showApiKey[key.id] ? key.key : key.key.replace(/.(?=.{4})/g, '*')}
                      </span>
                      <Copy className="w-3 h-3 text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-400">
                        Created: {key.createdAt}
                      </span>
                      <Badge 
                        className={key.isActive 
                          ? "bg-green-500/20 text-green-400 border-green-500/50" 
                          : "bg-gray-500/20 text-gray-400 border-gray-500/50"}
                      >
                        {key.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    {key.lastUsed && (
                      <p className="text-xs text-gray-400">
                        Last used: {key.lastUsed}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'bookmarks' && (
          <div className="space-y-6">
            {/* Add Bookmark Form */}
            <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700 shadow-lg border border-gray-700/50 hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bookmark className="w-5 h-5 text-pink-500" />
                  <span className="glass-pink-glow">Add New Bookmark</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  placeholder="Bookmark Title"
                  className="bg-gray-800/50 backdrop-blur-sm border-gray-700 text-white shadow-lg"
                  value={newBookmark.title}
                  onChange={(e) => setNewBookmark({...newBookmark, title: e.target.value})}
                />
                <Input
                  placeholder="URL"
                  className="bg-gray-800/50 backdrop-blur-sm border-gray-700 text-white shadow-lg"
                  value={newBookmark.url}
                  onChange={(e) => setNewBookmark({...newBookmark, url: e.target.value})}
                />
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Tags (comma separated)"
                    className="bg-gray-800/50 backdrop-blur-sm border-gray-700 text-white shadow-lg"
                    value={newBookmark.tags.join(', ')}
                    onChange={(e) => setNewBookmark({...newBookmark, tags: e.target.value.split(',').map(t => t.trim()).filter(t => t)})}
                  />
                </div>
                <Button 
                  onClick={handleAddBookmark}
                  className="bg-green-600 hover:bg-green-700 shadow-lg"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Bookmark
                </Button>
              </CardContent>
            </Card>

            {/* Bookmarks List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBookmarks.map(bookmark => (
                <Card 
                  key={bookmark.id} 
                  className="bg-gray-800/50 backdrop-blur-sm border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-700/50 hover:border-green-500/50"
                >
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg glass-pink-glow">{bookmark.title}</CardTitle>
                      <div className="flex gap-1">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => openEditModal('bookmark', bookmark)}
                          className="text-gray-400 hover:text-pink-400"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDeleteBookmark(bookmark.id)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Globe className="w-4 h-4 text-green-400" />
                      <a 
                        href={bookmark.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-green-400 hover:underline truncate"
                      >
                        {bookmark.url}
                      </a>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {bookmark.tags.map(tag => (
                        <Badge key={tag} variant="secondary">
                          <Tag className="w-3 h-3 mr-1" />
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <p className="text-xs text-gray-400">
                      Created: {bookmark.createdAt}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editModal.type && (
        <EditModal
          isOpen={editModal.isOpen}
          onClose={() => setEditModal({ isOpen: false, type: null, data: null })}
          onSave={handleEditSave}
          type={editModal.type}
          data={editModal.data}
        />
      )}

      {/* Footer */}
      <footer className="mt-16 py-6 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <img src="/myvault-logo.png" alt="My Vault" className="h-8 w-8" />
              <span className="text-gray-400 text-sm">
                My Vault © {new Date().getFullYear()}
              </span>
            </div>
            
            <div className="flex items-center gap-6">
              <a
                href="https://github.com/webdevtodayjason/MyVault"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-400 hover:text-pink-400 transition-colors"
              >
                <Github className="w-5 h-5" />
                <span className="text-sm">View on GitHub</span>
              </a>
              
              <div className="flex items-center gap-1 text-gray-400 text-sm">
                Made with <Heart className="w-4 h-4 text-pink-500 fill-pink-500" /> for developers
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;