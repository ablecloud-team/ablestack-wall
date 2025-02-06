import { useEffect } from 'react';

import { ConfirmModal } from '@grafana/ui';
import { t } from 'app/core/internationalization';

import { useDashboardRestore } from './useDashboardRestore';
export interface RevertDashboardModalProps {
  hideModal: () => void;
  version: number;
}

export const RevertDashboardModal = ({ hideModal, version }: RevertDashboardModalProps) => {
  // TODO: how should state.error be handled?
  const { state, onRestoreDashboard } = useDashboardRestore(version);

  useEffect(() => {
    if (!state.loading && state.value) {
      hideModal();
    }
  }, [state, hideModal]);

  return (
    <ConfirmModal
      isOpen={true}
      title={t('ablestack-wall.dashboard.restore-version', 'Restore Version')}
      icon="history"
      onDismiss={hideModal}
      onConfirm={onRestoreDashboard}
      body={
        <p>
          {t(
            'ablestack-wall.dashboard.restore-confirmation',
            'Are you sure you want to restore the dashboard to version {version}? All unsaved changes will be lost.'
          )}
        </p>
      }
      confirmText={t('ablestack-wall.dashboard.restore-confirmation-yes', `Yes, restore to version ${version}`)}
    />
  );
};
