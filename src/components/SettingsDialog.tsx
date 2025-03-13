
import React, { useState } from 'react';
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

const SettingsDialog: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [provider, setProvider] = useState<string>('openai');
  const [apiKey, setApiKey] = useState<string>('');
  const [theme, setTheme] = useState<string>('dark');
  const [systemPrompt, setSystemPrompt] = useState<string>('');
  const { toast } = useToast();

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
        >
          <Settings size={18} className="hover:rotate-90 transition-transform duration-300" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] backdrop-blur-xl bg-background/95 border-white/10">
        <DialogHeader>
          <DialogTitle className="text-xl">Settings</DialogTitle>
          <DialogDescription>
            Configure your AI assistant preferences.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <Tabs defaultValue="provider" className="w-full">
            <TabsList className="grid grid-cols-4 mb-4">
              <TabsTrigger value="provider">Provider</TabsTrigger>
              <TabsTrigger value="apikey">API Key</TabsTrigger>
              <TabsTrigger value="theme">Theme</TabsTrigger>
              <TabsTrigger value="prompt">System Prompt</TabsTrigger>
            </TabsList>
            
            {/* Provider Selection Tab */}
            <TabsContent value="provider" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="provider">Select Provider</Label>
                <Select 
                  value={provider} 
                  onValueChange={(value) => setProvider(value)}
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
              </div>

              <div className="space-y-2">
                <Label htmlFor="model">Select Model</Label>
                {provider === 'openai' && (
                  <Select>
                    <SelectTrigger id="model">
                      <SelectValue placeholder="Select a model" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gpt-4">GPT-4</SelectItem>
                      <SelectItem value="gpt-4o">GPT-4o</SelectItem>
                      <SelectItem value="gpt-4o-mini">GPT-4o-mini</SelectItem>
                    </SelectContent>
                  </Select>
                )}

                {provider === 'anthropic' && (
                  <Select>
                    <SelectTrigger id="model">
                      <SelectValue placeholder="Select a model" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="claude-3.5-sonnet">Claude 3.5 Sonnet</SelectItem>
                      <SelectItem value="claude-3.7-sonnet">Claude 3.7 Sonnet</SelectItem>
                      <SelectItem value="claude-3.7-thinking">Claude 3.7 Sonnet Thinking</SelectItem>
                    </SelectContent>
                  </Select>
                )}

                {provider === 'gemini' && (
                  <Select>
                    <SelectTrigger id="model">
                      <SelectValue placeholder="Select a model" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gemini-2.0-flash">Gemini 2.0 Flash</SelectItem>
                      <SelectItem value="gemini-2.0-thinking">Gemini 2.0 Thinking Experimental</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </div>
            </TabsContent>
            
            {/* API Key Tab */}
            <TabsContent value="apikey" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="apikey">API Key</Label>
                <Input
                  id="apikey"
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Enter your API key"
                />
                <p className="text-xs text-muted-foreground">
                  Your API key is stored locally and never sent to our servers.
                </p>
              </div>
            </TabsContent>
            
            {/* Theme Tab */}
            <TabsContent value="theme" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="theme">Theme</Label>
                <Select value={theme} onValueChange={(value) => setTheme(value)}>
                  <SelectTrigger id="theme">
                    <SelectValue placeholder="Select a theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>
            
            {/* System Prompt Tab */}
            <TabsContent value="prompt" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="systemprompt">System Prompt</Label>
                <Textarea
                  id="systemprompt"
                  value={systemPrompt}
                  onChange={(e) => setSystemPrompt(e.target.value)}
                  placeholder="Enter a system prompt to guide the AI behavior"
                  className="min-h-[150px]"
                />
                <p className="text-xs text-muted-foreground">
                  The system prompt helps define how the AI responds to your prompts.
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
