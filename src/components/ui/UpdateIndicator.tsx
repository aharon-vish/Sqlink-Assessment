import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeInOut = keyframes`
  0% { opacity: 0; transform: translateY(-10px); }
  50% { opacity: 1; transform: translateY(0); }
  100% { opacity: 0; transform: translateY(-10px); }
`;

const IndicatorContainer = styled.div`
  position: fixed;
  top: 80px;
  right: 20px;
  z-index: 999;
  background: #3182ce;
  color: white;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  animation: ${fadeInOut} 2s ease-in-out;
  box-shadow: 0 2px 8px rgba(49, 130, 206, 0.3);
`;

interface UpdateIndicatorProps {
  message: string;
  onComplete?: () => void;
}

export const UpdateIndicator: React.FC<UpdateIndicatorProps> = ({ 
  message, 
  onComplete 
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete?.();
    }, 2000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <IndicatorContainer data-testid="update-indicator">
      {message}
    </IndicatorContainer>
  );
};

// Hook for managing update notifications
export const useUpdateNotifications = () => {
  const [notifications, setNotifications] = useState<Array<{ id: string; message: string }>>([]);

  const showNotification = (message: string) => {
    const id = Date.now().toString();
    setNotifications(prev => [...prev, { id, message }]);
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const NotificationContainer: React.FC = () => (
    <>
      {notifications.map(notification => (
        <UpdateIndicator
          key={notification.id}
          message={notification.message}
          onComplete={() => removeNotification(notification.id)}
        />
      ))}
    </>
  );

  return {
    showNotification,
    NotificationContainer,
  };
};