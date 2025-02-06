import { css } from '@emotion/css';
import { useRef, useEffect } from 'react';

import { GrafanaTheme2 } from '@grafana/data';
import { Button, Icon, Modal, useStyles2 } from '@grafana/ui';

import { t } from '../../../../public/app/core/internationalization';

type ConfirmModalProps = {
  isOpen: boolean;
  onCancel?: () => void;
  onDiscard?: () => void;
  onCopy?: () => void;
};
export function ConfirmModal({ isOpen, onCancel, onDiscard, onCopy }: ConfirmModalProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const styles = useStyles2(getStyles);

  // Moved from grafana/ui
  useEffect(() => {
    // for some reason autoFocus property did no work on this button, but this does
    if (isOpen) {
      buttonRef.current?.focus();
    }
  }, [isOpen]);

  return (
    <Modal
      title={
        <div className={styles.modalHeaderTitle}>
          <Icon name="exclamation-triangle" size="lg" />
          <span className={styles.titleText}>{t('ablestack-wall.common.warning', 'Warning')}</span>
        </div>
      }
      onDismiss={onCancel}
      isOpen={isOpen}
    >
      <p>
        {t(
          'ablestack-wall.dashboard.builder-mode-message',
          'Builder mode does not display changes made in code. The query builder will display the last changes you made in builder mode.'
        )}
      </p>
      <p>{t('ablestack-wall.dashboard.copy-code-to-clipboard', 'Do you want to copy your code to the clipboard?')}</p>
      <Modal.ButtonRow>
        <Button type="button" variant="secondary" onClick={onCancel} fill="outline">
          {t('ablestack-wall.common.cancel', 'Cancel')}
        </Button>
        <Button variant="destructive" type="button" onClick={onDiscard} ref={buttonRef}>
          {t('ablestack-wall.dashboard.discard-code-switch', 'Discard code and switch')}
        </Button>
        <Button variant="primary" onClick={onCopy}>
          {t('ablestack-wall.dashboard.copy-code-switch', 'Copy code and switch')}
        </Button>
      </Modal.ButtonRow>
    </Modal>
  );
}

const getStyles = (theme: GrafanaTheme2) => ({
  titleText: css({
    paddingLeft: theme.spacing(2),
  }),
  modalHeaderTitle: css({
    fontSize: theme.typography.size.lg,
    float: 'left',
    paddingTop: theme.spacing(1),
    margin: theme.spacing(0, 2),
  }),
});
