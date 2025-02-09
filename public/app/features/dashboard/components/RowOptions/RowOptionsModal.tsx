import React, { FC } from 'react';
import { Modal, stylesFactory } from '@grafana/ui';
import { css } from '@emotion/css';

import { OnRowOptionsUpdate, RowOptionsForm } from './RowOptionsForm';

export interface RowOptionsModalProps {
  title: string;
  repeat?: string | null;
  onDismiss: () => void;
  onUpdate: OnRowOptionsUpdate;
}

export const RowOptionsModal: FC<RowOptionsModalProps> = ({ repeat, title, onDismiss, onUpdate }) => {
  const styles = getStyles();
  return (
    <Modal isOpen={true} title="행 옵션" icon="copy" onDismiss={onDismiss} className={styles.modal}>
      <RowOptionsForm repeat={repeat} title={title} onCancel={onDismiss} onUpdate={onUpdate} />
    </Modal>
  );
};

const getStyles = stylesFactory(() => {
  return {
    modal: css`
      label: RowOptionsModal;
      width: 500px;
    `,
  };
});
