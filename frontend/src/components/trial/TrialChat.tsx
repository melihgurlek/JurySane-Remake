import { useState, useRef, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Send, Bot } from 'lucide-react';
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
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [isUserScrolledUp, setIsUserScrolledUp] = useState(false);
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);

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

  const automaticResponseMutation = useMutation({
    mutationFn: (sessionId: string) => trialApi.getAutomaticAgentResponse(sessionId),
    onSuccess: () => {
      onRefresh();
      toast.success('Automatic response received');
    },
    onError: (error: any) => {
      console.error('Automatic response error:', error);
      const errorMessage = error.response?.data?.detail || error.message || 'Failed to get automatic response';
      if (error.response?.status !== 400) { // Don't show error if it's user's turn
        toast.error(errorMessage);
      }
    },
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    setIsUserScrolledUp(false);
    setShowScrollToBottom(false);
  };

  const handleScroll = () => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const { scrollTop, scrollHeight, clientHeight } = container;
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
    
    setIsUserScrolledUp(!isNearBottom);
    setShowScrollToBottom(!isNearBottom);
  };

  useEffect(() => {
    // Only auto-scroll if user hasn't manually scrolled up
    if (!isUserScrolledUp) {
      scrollToBottom();
    }
  }, [session.transcript, isUserScrolledUp]);

  // Check if it's the user's turn
  const isUserTurn = () => {
    const userRole = session.user_role === 'defense' ? 'defense' : 'prosecutor';
    // Handle both string and enum cases
    const currentTurn = session.current_turn;
    if (typeof currentTurn === 'string') {
      return currentTurn === userRole;
    } else if (currentTurn && typeof currentTurn === 'object' && 'value' in currentTurn) {
      return (currentTurn as any).value === userRole;
    }
    return false;
  };

  // Get display name for turn indicator
  const getTurnDisplayName = (turn: any) => {
    if (typeof turn === 'string') {
      return turn.charAt(0).toUpperCase() + turn.slice(1);
    } else if (turn && typeof turn === 'object' && 'value' in turn) {
      return (turn as any).value.charAt(0).toUpperCase() + (turn as any).value.slice(1);
    }
    return null;
  };

  // Handle automatic agent responses
  const handleAutomaticResponse = async () => {
    if (!isUserTurn() && session.current_turn && !automaticResponseMutation.isPending) {
      try {
        await automaticResponseMutation.mutateAsync(session.id);
      } catch (error) {
        // Error handling is done in the mutation
      }
    }
  };

  // Auto-trigger agent responses when it's their turn
  useEffect(() => {
    if (session.current_turn && !isUserTurn()) {
      const timer = setTimeout(() => {
        handleAutomaticResponse();
      }, 1000); // 1 second delay to avoid rapid firing
      
      return () => clearTimeout(timer);
    }
  }, [session.current_turn, session.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || agentResponseMutation.isPending) return;

    // Check if it's the user's turn
    if (!isUserTurn()) {
      toast.error(`It's not your turn. Current turn: ${getTurnDisplayName(session.current_turn)}`);
      return;
    }

    const userMessage = input.trim();
    const userRoleString = session.user_role === 'defense' ? 'defense' : 'prosecutor';
    const speaker = `${formatCaseRole(userRoleString)} (You)`;

    try {
      // Add user message to transcript first
      const updatedSession = await trialApi.addTranscriptEntry(
        session.id,
        speaker,
        userMessage,
        { user_input: true }
      );

      // Refresh the session to show the new message
      onRefresh();

      // Clear input immediately for better UX
      setInput('');

      // Then get agent response if talking to a specific agent
      if (selectedAgent !== CaseRole.JUDGE) {
        const context: any = {
          trial_phase: session.current_phase,
          user_role: session.user_role,
        };

        // Add witness context if talking to a witness
        if (selectedAgent === CaseRole.WITNESS && selectedWitness) {
          context.witness_name = selectedWitness;
        }

        agentResponseMutation.mutate({
          sessionId: session.id,
          request: {
            prompt: userMessage,
            agent_role: selectedAgent,
            context,
          },
        });
      }
    } catch (error: any) {
      console.error('Failed to add transcript entry:', error);
      const errorMessage = error.response?.data?.detail || error.message || 'Failed to send message';
      toast.error(errorMessage);
    }
  };


  const getMessageStyle = (speaker: string, isUser: boolean) => {
    if (isUser) {
      return {
        icon: 'bg-blue-600',
        iconText: 'U',
        bubbleClass: 'bg-blue-500', // User messages get blue background
      };
    }
    
    // Different colors for different AI agents
    const agentStyles: Record<string, { icon: string; iconText: string; bubbleClass: string }> = {
      judge: { icon: 'bg-purple-500', iconText: 'J', bubbleClass: 'bg-gray-100' },
      prosecutor: { icon: 'bg-red-500', iconText: 'P', bubbleClass: 'bg-gray-100' },
      defense: { icon: 'bg-blue-500', iconText: 'D', bubbleClass: 'bg-gray-100' },
      jury: { icon: 'bg-green-500', iconText: 'J', bubbleClass: 'bg-gray-100' },
      witness: { icon: 'bg-yellow-500', iconText: 'W', bubbleClass: 'bg-gray-100' },
    };

    const agentKey = speaker.toLowerCase();
    for (const [key, style] of Object.entries(agentStyles)) {
      if (agentKey.includes(key)) {
        return style;
      }
    }
    
    return { icon: 'bg-gray-500', iconText: 'A', bubbleClass: 'bg-gray-100' };
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
      <div 
        ref={messagesContainerRef}
        className="trial-chat-messages flex-1 overflow-y-auto"
        onScroll={handleScroll}
      >
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
                  <div className={cn("trial-message-bubble", messageStyle.bubbleClass)}>
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

      {/* Turn Indicator */}
      <div className="turn-indicator">
        <span className={`turn-status ${isUserTurn() ? 'user-turn' : 'agent-turn'}`}>
          {isUserTurn() ? 'Your Turn' : `Turn: ${getTurnDisplayName(session.current_turn) || 'None'}`}
        </span>
      </div>

      {/* Input Form */}
      <div className="trial-chat-input">
        {/* Scroll to Bottom Button - Overlay */}
        {showScrollToBottom && (
          <div style={{
            position: 'absolute',
            top: '-3rem',
            right: '0',
            zIndex: 1000
          }}>
            <button
              onClick={scrollToBottom}
              style={{
                backgroundColor: '#0284c7',
                color: 'white',
                border: 'none',
                borderRadius: '9999px',
                padding: '0.5rem 1rem',
                fontSize: '0.875rem',
                fontWeight: '500',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#0369a1';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#0284c7';
              }}
              title="Scroll to bottom"
            >
              Scroll Down
            </button>
          </div>
        )}
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
