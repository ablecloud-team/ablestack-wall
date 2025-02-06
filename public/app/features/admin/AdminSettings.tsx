import { useAsync } from 'react-use';

import { getBackendSrv } from '@grafana/runtime';
import { Alert } from '@grafana/ui';
import { Page } from 'app/core/components/Page/Page';
import { Trans } from 'app/core/internationalization';

import { AdminSettingsTable } from './AdminSettingsTable';

export type Settings = { [key: string]: { [key: string]: string } };

function AdminSettings() {
  const { loading, value: settings } = useAsync(() => getBackendSrv().get<Settings>('/api/admin/settings'), []);

  return (
    <Page navId="server-settings">
      <Page.Contents>
        <Alert severity="info" title="">
          <Trans i18nKey="ablestack-wall.administration.general.setting-alert">
            These system settings are defined in grafana.ini or custom.ini (or overridden in ENV variables). To change
            these you currently need to restart Wall.
          </Trans>
        </Alert>

        {loading && <AdminSettingsTable.Skeleton />}

        {settings && <AdminSettingsTable settings={settings} />}
      </Page.Contents>
    </Page>
  );
}

export default AdminSettings;
