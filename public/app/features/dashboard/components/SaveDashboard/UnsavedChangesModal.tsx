import { css } from '@emotion/css';

import { Button, Modal } from '@grafana/ui';
import { t } from 'app/core/internationalization';

import { DashboardModel } from '../../state';

import { SaveDashboardButton } from './SaveDashboardButton';

interface UnsavedChangesModalProps {
  dashboard: DashboardModel;
  onDiscard: () => void;
  onDismiss: () => void;
  onSaveSuccess?: () => void;
}

export const UnsavedChangesModal = ({ dashboard, onSaveSuccess, onDiscard, onDismiss }: UnsavedChangesModalProps) => {
  return (
    <Modal
      isOpen={true}
      title={t('ablestack-wall.dashboard.unsaved-changes', 'Unsaved changes')}
      onDismiss={onDismiss}
      icon="exclamation-triangle"
      className={css({
        width: '500px',
      })}
    >
      <h5>{t('ablestack-wall.dashboard.save-changes', 'Do you want to save your changes?')}</h5>
      <Modal.ButtonRow>
        <Button variant="secondary" onClick={onDismiss} fill="outline">
          {t('ablestack-wall.common.cancel', 'Cancel')}
        </Button>
        <Button variant="destructive" onClick={onDiscard}>
          {t('ablestack-wall.common.discard', 'Discard')}
        </Button>
        <SaveDashboardButton dashboard={dashboard} onSaveSuccess={onSaveSuccess} />
      </Modal.ButtonRow>
    </Modal>
  );
};
