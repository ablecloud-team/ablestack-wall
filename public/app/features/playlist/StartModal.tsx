import { useState } from 'react';

import { SelectableValue, UrlQueryMap, urlUtil } from '@grafana/data';
import { config, locationService } from '@grafana/runtime';
import { Box, Button, Checkbox, Field, FieldSet, Modal, RadioButtonGroup, Stack } from '@grafana/ui';
import { t } from 'app/core/internationalization';

import { Playlist, PlaylistMode } from './types';

export interface Props {
  playlist: Playlist;
  onDismiss: () => void;
}

export const StartModal = ({ playlist, onDismiss }: Props) => {
  const [mode, setMode] = useState<PlaylistMode>(false);
  const [autoFit, setAutofit] = useState(false);
  const [displayTimePicker, setDisplayTimePicker] = useState(true);
  const [displayVariables, setDisplayVariables] = useState(true);
  const [displayLinks, setDisplayLinks] = useState(true);

  const modes: Array<SelectableValue<PlaylistMode>> = [
    { label: 'Normal', value: false },
    { label: 'TV', value: 'tv' },
    { label: 'Kiosk', value: true },
  ];

  const onStart = () => {
    const params: UrlQueryMap = {};
    if (mode) {
      params.kiosk = mode;
    }
    if (autoFit) {
      params.autofitpanels = true;
    }

    if (!displayTimePicker) {
      params['_dash.hideTimePicker'] = true;
    }
    if (!displayVariables) {
      params['_dash.hideVariables'] = true;
    }
    if (!displayLinks) {
      params['_dash.hideLinks'] = true;
    }

    locationService.push(urlUtil.renderUrl(`/playlists/play/${playlist.uid}`, params));
  };

  return (
    <Modal isOpen={true} icon="play" title="Start playlist" onDismiss={onDismiss}>
      <FieldSet>
        <Field label="Mode">
          <RadioButtonGroup value={mode} options={modes} onChange={setMode} />
        </Field>
        <Field>
          <Checkbox
            label={t('ablestack-wall.alert.autofit', 'Autofit')}
            description={t(
              'ablestack-wall.alert.panel-heights-will-be-adjusted-to-fit-screen-size',
              'Panel heights will be adjusted to fit screen size'
            )}
            name="autofix"
            value={autoFit}
            onChange={(e) => setAutofit(e.currentTarget.checked)}
          />
        </Field>
        {config.featureToggles.dashboardScene && (
          <Field
            label={t('ablestack-wall.alert.display-dashboard-controls', 'Display dashboard controls')}
            description={t(
              'ablestack-wall.alert.customize-dashboard-elements-visibility',
              'Customize dashboard elements visibility'
            )}
          >
            <Box marginTop={2} marginBottom={2}>
              <Stack direction="column" alignItems="start" justifyContent="left" gap={2}>
                <Checkbox
                  label={t('ablestack-wall.alert.time-and-refresh', 'Time and refresh')}
                  name="displayTimePicker"
                  value={displayTimePicker}
                  onChange={(e) => setDisplayTimePicker(e.currentTarget.checked)}
                />
                <Checkbox
                  label={t('ablestack-wall.alert.variables', 'Variables')}
                  name="displayVariableControls"
                  value={displayVariables}
                  onChange={(e) => setDisplayVariables(e.currentTarget.checked)}
                />
                <Checkbox
                  label={t('ablestack-wall.alert.dashboard-links', 'Dashboard links')}
                  name="displayLinks"
                  value={displayLinks}
                  onChange={(e) => setDisplayLinks(e.currentTarget.checked)}
                />
              </Stack>
            </Box>
          </Field>
        )}
      </FieldSet>
      <Modal.ButtonRow>
        <Button variant="primary" onClick={onStart}>
          {t('ablestack-wall.alert.start', 'Start')} {playlist.name}
        </Button>
      </Modal.ButtonRow>
    </Modal>
  );
};
