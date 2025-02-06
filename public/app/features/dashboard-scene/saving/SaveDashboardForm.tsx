import { useState } from 'react';

import { selectors } from '@grafana/e2e-selectors';
import { Button, Checkbox, TextArea, Stack, Alert, Box, Field } from '@grafana/ui';
import { t } from 'app/core/internationalization';
import { SaveDashboardOptions } from 'app/features/dashboard/components/SaveDashboard/types';

import { DashboardScene } from '../scene/DashboardScene';

import { SaveDashboardDrawer } from './SaveDashboardDrawer';
import {
  DashboardChangeInfo,
  NameAlreadyExistsError,
  SaveButton,
  isNameExistsError,
  isPluginDashboardError,
  isVersionMismatchError,
} from './shared';
import { useSaveDashboard } from './useSaveDashboard';

export interface Props {
  dashboard: DashboardScene;
  drawer: SaveDashboardDrawer;
  changeInfo: DashboardChangeInfo;
}

export function SaveDashboardForm({ dashboard, drawer, changeInfo }: Props) {
  const { changedSaveModel, hasChanges } = changeInfo;

  const { state, onSaveDashboard } = useSaveDashboard(false);
  const [options, setOptions] = useState<SaveDashboardOptions>({
    folderUid: dashboard.state.meta.folderUid,
  });

  const onSave = async (overwrite: boolean) => {
    const result = await onSaveDashboard(dashboard, changedSaveModel, { ...options, overwrite });
    if (result.status === 'success') {
      dashboard.closeModal();
      drawer.state.onSaveSuccess?.();
    }
  };

  const cancelButton = (
    <Button variant="secondary" onClick={() => dashboard.closeModal()} fill="outline">
      {t('ablestack-wall.common.cancel', 'Cancel')}
    </Button>
  );

  const saveButton = (overwrite: boolean) => (
    <SaveButton isValid={hasChanges} isLoading={state.loading} onSave={onSave} overwrite={overwrite} />
  );

  function renderFooter(error?: Error) {
    if (isVersionMismatchError(error)) {
      return (
        <Alert title="Someone else has updated this dashboard" severity="error">
          <p>Would you still like to save this dashboard?</p>
          <Box paddingTop={2}>
            <Stack alignItems="center">
              {cancelButton}
              {saveButton(true)}
            </Stack>
          </Box>
        </Alert>
      );
    }

    if (isNameExistsError(error)) {
      return <NameAlreadyExistsError cancelButton={cancelButton} saveButton={saveButton} />;
    }

    if (isPluginDashboardError(error)) {
      return (
        <Alert title="Plugin dashboard" severity="error">
          <p>
            Your changes will be lost when you update the plugin. Use <strong>Save As</strong> to create custom version.
          </p>
          <Box paddingTop={2}>
            <Stack alignItems="center">
              {cancelButton}
              {saveButton(true)}
            </Stack>
          </Box>
        </Alert>
      );
    }

    return (
      <>
        {error && (
          <Alert title="Failed to save dashboard" severity="error">
            <p>{error.message}</p>
          </Alert>
        )}
        <Stack alignItems="center">
          {cancelButton}
          {saveButton(false)}
          {!hasChanges && <div>{t('ablestack-wall.dashboard.save-no-changes', 'No changes to save')}</div>}
        </Stack>
      </>
    );
  }

  return (
    <Stack gap={2} direction="column">
      <SaveDashboardFormCommonOptions drawer={drawer} changeInfo={changeInfo} />
      <Field label={t('ablestack-wall.common.message', 'Message')}>
        <TextArea
          aria-label="message"
          value={options.message ?? ''}
          onChange={(e) => {
            setOptions({
              ...options,
              message: e.currentTarget.value,
            });
          }}
          placeholder={t('ablestack-wall.dashboard.save-message-placeholder', 'Message')}
          autoFocus
          rows={5}
        />
      </Field>
      {renderFooter(state.error)}
    </Stack>
  );
}

export interface SaveDashboardFormCommonOptionsProps {
  drawer: SaveDashboardDrawer;
  changeInfo: DashboardChangeInfo;
}

export function SaveDashboardFormCommonOptions({ drawer, changeInfo }: SaveDashboardFormCommonOptionsProps) {
  const { saveVariables = false, saveTimeRange = false, saveRefresh = false } = drawer.useState();
  const { hasTimeChanges, hasVariableValueChanges, hasRefreshChange } = changeInfo;

  return (
    <Stack direction={'column'} alignItems={'flex-start'}>
      {hasTimeChanges && (
        <Checkbox
          id="save-timerange"
          checked={saveTimeRange}
          onChange={drawer.onToggleSaveTimeRange}
          label={t('ablestack-wall.dashboard.update-default-time-range', 'Update default time range')}
          description={t(
            'ablestack-wall.dashboard.will-make-current-time-range-the-new-default',
            'Will make current time range the new default'
          )}
          data-testid={selectors.pages.SaveDashboardModal.saveTimerange}
        />
      )}
      {hasRefreshChange && (
        <Checkbox
          id="save-refresh"
          label={t('ablestack-wall.dashboard.update-default-refresh-value', 'Update default refresh value')}
          description={t(
            'ablestack-wall.dashboard.will-make-current-refresh-the-new-default',
            'Will make the current refresh the new default'
          )}
          checked={saveRefresh}
          onChange={drawer.onToggleSaveRefresh}
          data-testid={selectors.pages.SaveDashboardModal.saveRefresh}
        />
      )}
      {hasVariableValueChanges && (
        <Checkbox
          id="save-variables"
          label={t('ablestack-wall.dashboard.update-default-variable', 'Update default variable values')}
          description={t(
            'ablestack-wall.dashboard.update-default-variable-description',
            'Will make the current values the new default'
          )}
          checked={saveVariables}
          onChange={drawer.onToggleSaveVariables}
          data-testid={selectors.pages.SaveDashboardModal.saveVariables}
        />
      )}
    </Stack>
  );
}
