
import React, { useState, useEffect } from 'react';
import { Settings } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useAI } from '@/contexts/AIContext';

// Define provider types and their models
interface ProviderModels {
  [key: string]: string[];
}

const PROVIDER_MODELS: ProviderModels = {
  openai: ['gpt-4', 'gpt-4o', 'gpt-4o-mini'],
  anthropic: ['claude-3.5-sonnet', 'claude-3.7-sonnet', 'claude-3.7-thinking'],
  gemini: ['gemini-2.0-flash', 'gemini-2.0-thinking']
};

const SettingsDialog: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState<string>('dark');
  const { toast } = useToast();
  const { 
    provider, 
    setProvider, 
    model, 
    setModel, 
    systemPrompt, 
    setSystemPrompt, 
    apiKey, 
    setApiKey 
  } = useAI();

  // Pass the selected provider and its models to the parent component
  const handleProviderChange = (value: string) => {
    setProvider(value);
    
    // Set the first model of the selected provider as default
    setModel(PROVIDER_MODELS[value][0]);
    
    // Here we would normally dispatch an event or call a callback
    // to update the model selection in the Navbar component
    const event = new CustomEvent('providerChanged', { 
      detail: { 
        provider: value, 
        models: PROVIDER_MODELS[value] 
      } 
    });
    window.dispatchEvent(event);
  };

  const handleSave = () => {
    toast({
      title: "Settings Saved",
      description: "Your settings have been saved successfully.",
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="rounded-full hover:bg-white/10 transition-all duration-200"
          data-settings-trigger="true"
        >
          <Settings size={18} className="hover:rotate-90 transition-transform duration-300" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[450px] backdrop-blur-xl bg-background/95 border-white/10">
        <DialogHeader>
          <DialogTitle className="text-xl">Settings</DialogTitle>
          <DialogDescription>
            Configure your AI assistant preferences.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <Tabs defaultValue="apikey" className="w-full">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="provider">Provider</TabsTrigger>
              <TabsTrigger value="apikey">API Key</TabsTrigger>
              <TabsTrigger value="theme">Theme & Prompt</TabsTrigger>
            </TabsList>
            
            {/* Provider Selection Tab */}
            <TabsContent value="provider" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="provider">Select AI Provider</Label>
                <Select 
                  value={provider} 
                  onValueChange={handleProviderChange}
                >
                  <SelectTrigger id="provider">
                    <SelectValue placeholder="Select a provider" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="openai">OpenAI</SelectItem>
                    <SelectItem value="anthropic">Anthropic</SelectItem>
                    <SelectItem value="gemini">Gemini</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-2">
                  Available models will be shown in the main interface dropdown.
                </p>
              </div>
            </TabsContent>
            
            {/* API Key Tab - Set as default tab */}
            <TabsContent value="apikey" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="apikey">API Key for {provider.charAt(0).toUpperCase() + provider.slice(1)}</Label>
                <Input
                  id="apikey"
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Enter your API key"
                  className="border-white/10 bg-white/5"
                />
                <p className="text-xs text-muted-foreground">
                  Your API key is stored locally and never sent to our servers.
                </p>
              </div>
            </TabsContent>
            
            {/* Theme and System Prompt Tab */}
            <TabsContent value="theme" className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="theme">Theme</Label>
                <Select value={theme} onValueChange={(value) => setTheme(value)}>
                  <SelectTrigger id="theme" className="border-white/10 bg-white/5">
                    <SelectValue placeholder="Select a theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="systemprompt">System Prompt</Label>
                <Textarea
                  id="systemprompt"
                  value={systemPrompt}
                  onChange={(e) => setSystemPrompt(e.target.value)}
                  placeholder="Enter a system prompt to guide the AI behavior"
                  className="min-h-[150px] border-white/10 bg-white/5"
                />
                <p className="text-xs text-muted-foreground">
                  The system prompt helps define how the AI responds to your questions.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsDialog;
