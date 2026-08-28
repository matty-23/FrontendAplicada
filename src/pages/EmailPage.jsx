import React from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { VentanaCorreo } from '../components/email/VentanaCorreo';
import { EnviarButton } from '../components/email/EnviarButton';
import { useEmailForm } from '../hooks/useEmailForm';
import '../styles/EmailPage.css';

export function EmailPage() {
  const { states, setters, handleSend } = useEmailForm();

  const rightActions = <EnviarButton onClick={handleSend} loading={states.loading} />;

  return (
    <DashboardLayout breadcrumb="Sistema / Correo" title="Nuevo Mensaje" rightActions={rightActions}>
      <div className="email-view-wrapper">
        <VentanaCorreo
          isMinimized={states.isMinimized}
          setIsMinimized={setters.setIsMinimized}
          recipients={states.recipients}
          setRecipients={setters.setRecipients}
          subject={states.subject}
          setSubject={setters.setSubject}
          setBody={setters.setBody}
          setFinalAttachments={setters.setFinalAttachments}
        />
      </div>
    </DashboardLayout>
  );
}