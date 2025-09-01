import { useState, useRef, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Send, Bot, User } from 'lucide-react';
import { TrialSession, CaseRole, AgentPromptRequest } from '@/types/trial';
import { trialApi } from '@/lib/api';
import { toast } from '@/components/ui/Toaster';
import { formatTime, formatCaseRole } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface TrialChatProps {
  session: TrialSession;
  onRefresh: () => void;
}

const TrialChat = ({ session, onRefresh }: TrialChatProps) => {
  const [input, setInput] = useState('');
  const [selectedAgent, setSelectedAgent] = useState<CaseRole>(CaseRole.JUDGE);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const agentResponseMutation = useMutation({
    mutationFn: ({ sessionId, request }: { sessionId: string; request: AgentPromptRequest }) =>
      trialApi.getAgentResponse(sessionId, request),
    onSuccess: () => {
      setInput('');
      onRefresh();
      toast.success('Response received');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || 'Failed to get agent response');
    },
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [session.transcript]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || agentResponseMutation.isPending) return;

    // Add user message to transcript first
    trialApi.addTranscriptEntry(
      session.id,
      `${formatCaseRole(session.user_role === 'defense' ? CaseRole.DEFENSE : CaseRole.PROSECUTOR)} (You)`,
      input.trim(),
      { user_input: true }
    ).then(() => {
      // Then get agent response
      agentResponseMutation.mutate({
        sessionId: session.id,
        request: {
          prompt: input.trim(),
          agent_role: selectedAgent,
          context: {
            trial_phase: session.current_phase,
            user_role: session.user_role,
          },
        },
      });
    });
  };

  const getMessageIcon = (speaker: string, isUser: boolean) => {
    if (isUser) {
      return <User className="h-5 w-5 text-primary-600" />;
    }
    return <Bot className="h-5 w-5 text-secondary-600" />;
  };

  const getMessageStyle = (speaker: string, isUser: boolean) => {
    if (isUser) {
      return 'bg-primary-50 border-primary-200';
    }
    
    // Different colors for different AI agents
    const agentColors: Record<string, string> = {
      judge: 'bg-purple-50 border-purple-200',
      prosecutor: 'bg-red-50 border-red-200',
      defense: 'bg-blue-50 border-blue-200',
      jury: 'bg-green-50 border-green-200',
      witness: 'bg-yellow-50 border-yellow-200',
    };

    const agentKey = speaker.toLowerCase();
    for (const [key, color] of Object.entries(agentColors)) {
      if (agentKey.includes(key)) {
        return color;
      }
    }
    
    return 'bg-secondary-50 border-secondary-200';
  };

  const availableAgents = [
    { key: CaseRole.JUDGE, label: 'Judge', description: 'Ask for rulings or guidance' },
    { key: CaseRole.PROSECUTOR, label: 'Prosecutor', description: 'Opposing counsel' },
    { key: CaseRole.DEFENSE, label: 'Defense', description: 'Opposing counsel' },
    { key: CaseRole.JURY, label: 'Jury', description: 'Get jury feedback' },
    { key: CaseRole.WITNESS, label: 'Witness', description: 'Question witnesses' },
  ].filter(agent => {
    // Filter out the user's own role
    const userRole = session.user_role === 'defense' ? CaseRole.DEFENSE : CaseRole.PROSECUTOR;
    return agent.key !== userRole;
  });

  return (
    <div className="bg-white rounded-lg shadow-sm border border-secondary-200 h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-secondary-200">
        <h2 className="text-lg font-semibold text-secondary-900">
          Courtroom Proceedings
        </h2>
        <p className="text-sm text-secondary-600">
          Interact with AI agents to conduct your trial
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {session.transcript.length === 0 ? (
          <div className="text-center py-8">
            <Bot className="h-12 w-12 text-secondary-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-secondary-900 mb-2">
              Welcome to the Courtroom
            </h3>
            <p className="text-secondary-600">
              Begin by addressing the judge or other participants. 
              Select who you want to speak to and type your message below.
            </p>
          </div>
        ) : (
          session.transcript.map((message, index) => {
            const isUser = message.metadata?.user_input === true;
            return (
              <div key={index} className="flex space-x-3">
                <div className="flex-shrink-0">
                  {getMessageIcon(message.speaker, isUser)}
                </div>
                <div className="flex-1">
                  <div className={cn(
                    'p-4 rounded-lg border',
                    getMessageStyle(message.speaker, isUser)
                  )}>
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-sm font-medium text-secondary-900">
                        {message.speaker}
                      </h4>
                      {message.timestamp && (
                        <span className="text-xs text-secondary-500">
                          {formatTime(message.timestamp)}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-secondary-700 whitespace-pre-wrap">
                      {message.content}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        )}
        
        {agentResponseMutation.isPending && (
          <div className="flex space-x-3">
            <div className="flex-shrink-0">
              <Bot className="h-5 w-5 text-secondary-400" />
            </div>
            <div className="flex-1">
              <div className="p-4 rounded-lg border bg-secondary-50 border-secondary-200">
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600"></div>
                  <span className="text-sm text-secondary-600">
                    {formatCaseRole(selectedAgent)} is responding...
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <div className="p-4 border-t border-secondary-200">
        {/* Agent Selection */}
        <div className="mb-3">
          <label className="block text-sm font-medium text-secondary-700 mb-2">
            Address to:
          </label>
          <div className="flex flex-wrap gap-2">
            {availableAgents.map((agent) => (
              <button
                key={agent.key}
                onClick={() => setSelectedAgent(agent.key)}
                className={cn(
                  'px-3 py-1 rounded-full text-sm font-medium transition-colors',
                  selectedAgent === agent.key
                    ? 'bg-primary-600 text-white'
                    : 'bg-secondary-100 text-secondary-700 hover:bg-secondary-200'
                )}
                title={agent.description}
              >
                {agent.label}
              </button>
            ))}
          </div>
        </div>

        {/* Message Input */}
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <div className="flex-1">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Address the ${formatCaseRole(selectedAgent).toLowerCase()}...`}
              className="textarea resize-none"
              rows={3}
              disabled={agentResponseMutation.isPending}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                  handleSubmit(e);
                }
              }}
            />
            <p className="text-xs text-secondary-500 mt-1">
              Press Ctrl+Enter to send
            </p>
          </div>
          <button
            type="submit"
            disabled={!input.trim() || agentResponseMutation.isPending}
            className="btn btn-primary btn-md self-start"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default TrialChat;
