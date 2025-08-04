import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Save, X, Tag } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  type: 'app' | 'apiKey' | 'bookmark';
  data: any;
}

const EditModal = ({ isOpen, onClose, onSave, type, data }: EditModalProps) => {
  const [formData, setFormData] = useState<any>({});
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    if (data) {
      setFormData({
        ...data,
        tags: data.tags || []
      });
    }
  }, [data]);

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  const handleAddTag = () => {
    if (tagInput.trim() && type === 'bookmark') {
      setFormData({
        ...formData,
        tags: [...(formData.tags || []), tagInput.trim()]
      });
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((tag: string) => tag !== tagToRemove)
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      handleAddTag();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg bg-gray-900/95 backdrop-blur-xl border-gray-700 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="glass-pink-glow-strong">
            Edit {type === 'app' ? 'Application' : type === 'apiKey' ? 'API Key' : 'Bookmark'}
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Make changes to your {type === 'app' ? 'application' : type === 'apiKey' ? 'API key' : 'bookmark'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Name/Title Field */}
          <div className="space-y-2">
            <Label className="glass-pink-glow-subtle">
              {type === 'bookmark' ? 'Title' : 'Name'}
            </Label>
            <Input
              value={formData.name || formData.title || ''}
              onChange={(e) => setFormData({
                ...formData,
                [type === 'bookmark' ? 'title' : 'name']: e.target.value
              })}
              className="bg-gray-800/50 border-gray-700 text-white focus:border-pink-500/50"
              placeholder={`Enter ${type === 'bookmark' ? 'title' : 'name'}`}
            />
          </div>

          {/* Description Field (Apps only) */}
          {type === 'app' && (
            <div className="space-y-2">
              <Label className="glass-pink-glow-subtle">Description</Label>
              <Textarea
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="bg-gray-800/50 border-gray-700 text-white focus:border-pink-500/50 min-h-[80px]"
                placeholder="Enter description"
              />
            </div>
          )}

          {/* URL Field (Apps and Bookmarks) */}
          {(type === 'app' || type === 'bookmark') && (
            <div className="space-y-2">
              <Label className="glass-pink-glow-subtle">URL</Label>
              <Input
                value={formData.url || ''}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                className="bg-gray-800/50 border-gray-700 text-white focus:border-pink-500/50"
                placeholder="https://example.com"
                type="url"
              />
            </div>
          )}

          {/* API Key Field (API Keys only) */}
          {type === 'apiKey' && (
            <div className="space-y-2">
              <Label className="glass-pink-glow-subtle">API Key</Label>
              <Input
                value={formData.key || ''}
                onChange={(e) => setFormData({ ...formData, key: e.target.value })}
                className="bg-gray-800/50 border-gray-700 text-white focus:border-pink-500/50 font-mono text-sm"
                placeholder="sk_test_..."
                type="password"
              />
            </div>
          )}

          {/* Active Status (API Keys only) */}
          {type === 'apiKey' && (
            <div className="flex items-center justify-between space-x-2">
              <Label className="glass-pink-glow-subtle">Active Status</Label>
              <Switch
                checked={formData.isActive || false}
                onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                className="data-[state=checked]:bg-green-500"
              />
            </div>
          )}

          {/* API Key ID (Apps only) */}
          {type === 'app' && (
            <div className="space-y-2">
              <Label className="glass-pink-glow-subtle">API Key ID (Optional)</Label>
              <Input
                value={formData.apiKeyId || ''}
                onChange={(e) => setFormData({ ...formData, apiKeyId: e.target.value })}
                className="bg-gray-800/50 border-gray-700 text-white focus:border-pink-500/50"
                placeholder="Link to API key"
              />
            </div>
          )}

          {/* Tags (Bookmarks only) */}
          {type === 'bookmark' && (
            <div className="space-y-2">
              <Label className="glass-pink-glow-subtle">Tags</Label>
              <div className="flex gap-2">
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="bg-gray-800/50 border-gray-700 text-white focus:border-pink-500/50"
                  placeholder="Add a tag and press Enter"
                />
                <Button
                  type="button"
                  onClick={handleAddTag}
                  variant="outline"
                  size="sm"
                  className="border-gray-700 hover:bg-gray-800/50 hover:text-pink-400"
                >
                  <Tag className="w-4 h-4" />
                </Button>
              </div>
              {formData.tags && formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.tags.map((tag: string, index: number) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="bg-gray-800/50 text-pink-400 border-gray-700 cursor-pointer hover:bg-red-500/20 hover:text-red-400"
                      onClick={() => handleRemoveTag(tag)}
                    >
                      {tag} ×
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="border-gray-700 text-gray-400 hover:bg-gray-800/50 hover:text-white"
          >
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditModal;