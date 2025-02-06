import { LinkButton, Stack, Text } from '@grafana/ui';
import { Trans } from 'app/core/internationalization';

import { AlertingPageWrapper } from './components/AlertingPageWrapper';
import { WithReturnButton } from './components/WithReturnButton';
import { useEditConfigurationDrawer } from './components/settings/ConfigurationDrawer';
import { ExternalAlertmanagers } from './components/settings/ExternalAlertmanagers';
import InternalAlertmanager from './components/settings/InternalAlertmanager';
import { SettingsProvider, useSettings } from './components/settings/SettingsContext';

export default function SettingsPage() {
  return (
    <SettingsProvider>
      <SettingsContent />
    </SettingsProvider>
  );
}

function SettingsContent() {
  const [configurationDrawer, showConfiguration] = useEditConfigurationDrawer();
  const { isLoading } = useSettings();

  return (
    <AlertingPageWrapper
      navId="alerting-admin"
      isLoading={isLoading}
      actions={[
        <WithReturnButton
          key="add-alertmanager"
          title="Alerting settings"
          component={
            <LinkButton href="/connections/datasources/alertmanager" icon="plus" variant="primary">
              <Trans i18nKey="ablestack-wall.alert.add-alertmanager">Add new Alertmanager</Trans>
            </LinkButton>
          }
        />,
      ]}
    >
      <Stack direction="column" gap={2}>
        {/* Grafana built-in Alertmanager */}
        <Text variant="h5">
          <Trans i18nKey="ablestack-wall.alert.built-in-alertmanager">Built-in Alertmanager</Trans>
        </Text>
        <InternalAlertmanager onEditConfiguration={showConfiguration} />
        {/* other (external Alertmanager data sources we have added to Grafana such as vanilla, Mimir, Cortex) */}
        <Text variant="h5">
          <Trans i18nKey="ablestack-wall.alert.other-alertmanagers">Other Alertmanagers</Trans>
        </Text>
        <ExternalAlertmanagers onEditConfiguration={showConfiguration} />
      </Stack>
      {configurationDrawer}
    </AlertingPageWrapper>
  );
}
