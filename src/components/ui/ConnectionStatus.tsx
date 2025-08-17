import React, { useState, useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { signalRService } from '@/services';
import { useTranslation } from '@/hooks/useTranslation';

const pulse = keyframes`
  0% { opacity: 1; }
  50% { opacity: 0.5; }
  100% { opacity: 1; }
`;

const StatusContainer = styled.div`
  position: reltive;
  top: 120px;
  right: 20px;
  z-index: 1000;
  display: flex;
  align-items: center;
  gap: 8px;
  background: white;
  padding: 8px 12px;
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
  font-size: 12px;
  font-weight: 500;

  @media (max-width: 768px) {
    top: 80px;
    right: 16px;
    font-size: 11px;
    padding: 6px 10px;
  }
`;

const StatusDot = styled.div<{ status: 'Connected' | 'Disconnected' | 'Connecting' }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  
  ${({ status }) => {
    switch (status) {
      case 'Connected':
        return css`
          background-color: #38a169;
        `;
      case 'Disconnected':
        return css`
          background-color: #e53e3e;
        `;
      case 'Connecting':
        return css`
          background-color: #d69e2e;
          animation: ${pulse} 1s infinite;
        `;
    }
  }}
`;

const StatusText = styled.span<{ status: 'Connected' | 'Disconnected' | 'Connecting' }>`
  color: ${({ status }) => {
    switch (status) {
      case 'Connected': return '#38a169';
      case 'Disconnected': return '#e53e3e';
      case 'Connecting': return '#d69e2e';
    }
  }};
`;

const ReconnectButton = styled.button`
  background: #3182ce;
  color: white;
  border: none;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 11px;
  cursor: pointer;
  margin-left: 8px;
  
  &:hover {
    background: #2c5aa0;
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;


export const ConnectionStatus: React.FC = () => {
  const { t } = useTranslation();
  const [connectionState, setConnectionState] = useState<'Connected' | 'Disconnected' | 'Connecting'>('Disconnected');
  const [isReconnecting, setIsReconnecting] = useState(false);
  const [needsManualReconnect, setNeedsManualReconnect] = useState(false);

  useEffect(() => {
    // Initial state
    setConnectionState(signalRService.getConnectionState());

    // Listen for connection state changes
    if ('onConnectionStateChanged' in signalRService) {
      (signalRService as unknown as { onConnectionStateChanged: (callback: (state: 'Connected' | 'Disconnected' | 'Connecting') => void) => void }).onConnectionStateChanged(setConnectionState);
    }

    // Poll connection state and manual reconnect status
    const pollInterval = setInterval(() => {
      setConnectionState(signalRService.getConnectionState());
      
      // Check if manual reconnect is needed (for real SignalR service)
      if ('isManualReconnectNeeded' in signalRService) {
        setNeedsManualReconnect((signalRService as any).isManualReconnectNeeded());
      }
    }, 2000);

    return () => {
      clearInterval(pollInterval);
      if ('offConnectionStateChanged' in signalRService) {
        (signalRService as unknown as { offConnectionStateChanged: () => void }).offConnectionStateChanged();
      }
    };
  }, []);

  const handleReconnect = async () => {
    if (isReconnecting) return;
    
    setIsReconnecting(true);
    try {
      // Use manual reconnect if available (real SignalR service)
      if ('manualReconnect' in signalRService) {
        await (signalRService as any).manualReconnect();
      } else {
        // Fallback for mock service
        await signalRService.stop();
        await signalRService.start();
      }
    } catch (error) {
      console.error('Manual reconnection failed:', error);
    } finally {
      setIsReconnecting(false);
    }
  };

  const getStatusText = () => {
    if (needsManualReconnect && connectionState === 'Disconnected') {
      return 'Connection failed - Manual reconnect required';
    }
    
    switch (connectionState) {
      case 'Connected': return t('connectionStatus.connected');
      case 'Disconnected': return t('connectionStatus.disconnected');
      case 'Connecting': return t('connectionStatus.connecting');
    }
  };

  const showReconnectButton = connectionState === 'Disconnected' && 
    (needsManualReconnect || import.meta.env.VITE_API_MODE !== 'real');

  return (
    <StatusContainer data-testid="connection-status">
      <StatusDot status={connectionState} />
      <StatusText status={connectionState}>
        {getStatusText()}
      </StatusText>
      
      {showReconnectButton && (
        <ReconnectButton 
          onClick={handleReconnect}
          disabled={isReconnecting}
          data-testid="reconnect-button"
        >
          {isReconnecting ? t('common.connecting') : t('common.reconnect')}
        </ReconnectButton>
      )}
    </StatusContainer>
  );
};