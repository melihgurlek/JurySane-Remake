import { useState, useRef, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Send, Bot, User } from 'lucide-react';
import { TrialSession, CaseRole, AgentPromptRequest } from '@/types/trial';
import { trialApi } from '@/lib/api';
import { toast } from '@/components/ui/Toaster';
import { formatTime, formatCaseRole } from '@/lib/utils';
import { cn } from '@/lib/utils';
import '../../styles/trial-components.css';

interface TrialChatProps {
  session: TrialSession;
  onRefresh: () => void;
}

const TrialChat = ({ session, onRefresh }: TrialChatProps) => {
  const [input, setInput] = useState('');
  const [selectedAgent, setSelectedAgent] = useState<CaseRole>(CaseRole.JUDGE);
  const [selectedWitness, setSelectedWitness] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const agentResponseMutation = useMutation({
    mutationFn: ({ sessionId, request }: { sessionId: string; request: AgentPromptRequest }) =>
      trialApi.getAgentResponse(sessionId, request),
    onSuccess: () => {
      onRefresh();
      toast.success('Response received');
    },
    onError: (error: any) => {
      console.error('Agent response error:', error);
      const errorMessage = error.response?.data?.detail || error.message || 'Failed to get agent response';
      toast.error(errorMessage);
    },
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [session.transcript]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || agentResponseMutation.isPending) return;

    const userMessage = input.trim();
    const userRoleString = session.user_role === 'defense' ? 'defense' : 'prosecutor';
    const speaker = `${formatCaseRole(userRoleString)} (You)`;

    try {
      // Add user message to transcript first
      console.log('Adding transcript entry:', { sessionId: session.id, speaker, content: userMessage });
      const updatedSession = await trialApi.addTranscriptEntry(
        session.id,
        speaker,
        userMessage,
        { user_input: true }
      );
      console.log('Transcript entry added successfully, updated session:', updatedSession);
      console.log('Transcript length:', updatedSession.transcript.length);

      // Refresh the session to show the new message
      onRefresh();

      // Clear input immediately for better UX
      setInput('');

      // Then get agent response
      const context: any = {
        trial_phase: session.current_phase,
        user_role: session.user_role,
      };

      // Add witness context if talking to a witness
      if (selectedAgent === CaseRole.WITNESS && selectedWitness) {
        context.witness_name = selectedWitness;
      }

      console.log('Getting agent response:', { sessionId: session.id, agentRole: selectedAgent, context });
      agentResponseMutation.mutate({
        sessionId: session.id,
        request: {
          prompt: userMessage,
          agent_role: selectedAgent,
          context,
        },
      });
    } catch (error: any) {
      console.error('Failed to add transcript entry:', error);
      const errorMessage = error.response?.data?.detail || error.message || 'Failed to send message';
      toast.error(errorMessage);
    }
  };

  const getMessageIcon = (speaker: string, isUser: boolean) => {
    if (isUser) {
      return <User className="h-5 w-5 text-primary-600" />;
    }
    return <Bot className="h-5 w-5 text-secondary-600" />;
  };

  const getMessageStyle = (speaker: string, isUser: boolean) => {
    if (isUser) {
      return {
        icon: 'bg-blue-600',
        iconText: 'U',
      };
    }
    
    // Different colors for different AI agents
    const agentStyles: Record<string, { icon: string; iconText: string }> = {
      judge: { icon: 'bg-purple-500', iconText: 'J' },
      prosecutor: { icon: 'bg-red-500', iconText: 'P' },
      defense: { icon: 'bg-blue-500', iconText: 'D' },
      jury: { icon: 'bg-green-500', iconText: 'J' },
      witness: { icon: 'bg-yellow-500', iconText: 'W' },
    };

    const agentKey = speaker.toLowerCase();
    for (const [key, style] of Object.entries(agentStyles)) {
      if (agentKey.includes(key)) {
        return style;
      }
    }
    
    return { icon: 'bg-gray-500', iconText: 'A' };
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

  // Get available witnesses for witness selection
  const availableWitnesses = session.participants
    .filter(p => p.role === CaseRole.WITNESS)
    .map(p => ({ name: p.name, description: p.description || 'Witness' }));

  return (
    <div className="trial-chat h-full flex flex-col">
      {/* Messages */}
      <div className="trial-chat-messages flex-1">
        {session.transcript.length === 0 ? (
          <div className="trial-chat-welcome">
            <Bot className="trial-chat-welcome-icon" />
            <h3 className="trial-chat-welcome-title">
              Welcome to the Courtroom
            </h3>
            <p className="trial-chat-welcome-text">
              Begin by addressing the judge or other participants. 
              Select who you want to speak to and type your message below.
            </p>
          </div>
        ) : (
          session.transcript.map((message, index) => {
            const isUser = message.metadata?.user_input === true;
            const messageStyle = getMessageStyle(message.speaker, isUser);
            return (
              <div key={index} className="trial-message">
                <div className={cn("trial-message-icon", messageStyle.icon)}>
                  <span className="text-white text-sm font-medium">
                    {messageStyle.iconText}
                  </span>
                </div>
                <div className="trial-message-content">
                  <div className="trial-message-bubble">
                    <div className="trial-message-header">
                      <h4 className="trial-message-speaker">
                        {message.speaker}
                      </h4>
                      {message.timestamp && (
                        <span className="trial-message-time">
                          {formatTime(message.timestamp)}
                        </span>
                      )}
                    </div>
                    <p className="trial-message-text">
                      {message.content}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        )}
        
        {agentResponseMutation.isPending && (
          <div className="trial-message">
            <div className="trial-message-icon bg-gray-500">
              <span className="text-white text-sm font-medium">A</span>
            </div>
            <div className="trial-message-content">
              <div className="trial-message-bubble">
                <div className="trial-message-loading-content">
                  <div className="trial-message-loading-spinner"></div>
                  <span className="trial-message-loading-text">
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
      <div className="trial-chat-input">
        {/* Agent Selection */}
        <div className="trial-agent-selection">
          <label className="trial-agent-label">
            Address to:
          </label>
          <div className="trial-agent-buttons">
            {availableAgents.map((agent) => (
              <button
                key={agent.key}
                onClick={() => setSelectedAgent(agent.key)}
                className={cn(
                  'trial-agent-button',
                  selectedAgent === agent.key ? 'trial-agent-button-active' : 'trial-agent-button-inactive'
                )}
                title={agent.description}
              >
                {agent.label}
              </button>
            ))}
          </div>
        </div>

        {/* Witness Selection */}
        {selectedAgent === CaseRole.WITNESS && availableWitnesses.length > 0 && (
          <div className="trial-witness-selection">
            <label className="trial-witness-label">
              Select witness:
            </label>
            <select
              value={selectedWitness}
              onChange={(e) => setSelectedWitness(e.target.value)}
              className="trial-witness-select"
            >
              <option value="">Choose a witness...</option>
              {availableWitnesses.map((witness) => (
                <option key={witness.name} value={witness.name}>
                  {witness.name} - {witness.description}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Message Input */}
        <form onSubmit={handleSubmit} className="trial-message-form">
          <div className="trial-message-input-container">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                selectedAgent === CaseRole.WITNESS && selectedWitness
                  ? `Question ${selectedWitness}...`
                  : `Address the ${formatCaseRole(selectedAgent).toLowerCase()}...`
              }
              className="trial-message-textarea"
              rows={3}
              disabled={agentResponseMutation.isPending || (selectedAgent === CaseRole.WITNESS && !selectedWitness)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                  handleSubmit(e);
                }
              }}
            />
            <p className="trial-message-hint">
              Press Ctrl+Enter to send
            </p>
          </div>
          <button
            type="submit"
            disabled={!input.trim() || agentResponseMutation.isPending || (selectedAgent === CaseRole.WITNESS && !selectedWitness)}
            className="trial-send-button"
          >
            <Send className="trial-send-icon" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default TrialChat;
