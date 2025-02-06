import { useState } from 'react';

import { config } from '@grafana/runtime';
import { Box, Stack, Tab, TabContent, TabsBar } from '@grafana/ui';
import { t, Trans } from 'app/core/internationalization';

import { AlertingPageWrapper } from '../components/AlertingPageWrapper';
import { isLocalDevEnv } from '../utils/misc';

// import GettingStarted, { WelcomeHeader } from './GettingStarted';
import { getInsightsScenes, insightsIsAvailable } from './Insights';
import { PluginIntegrations } from './PluginIntegrations';

export default function Home() {
  const insightsEnabled = (insightsIsAvailable() || isLocalDevEnv()) && Boolean(config.featureToggles.alertingInsights);

  const [activeTab, setActiveTab] = useState<'insights' | 'overview'>(insightsEnabled ? 'insights' : 'overview');
  const insightsScene = getInsightsScenes();

  return (
    <AlertingPageWrapper
      title="Alerting"
      subTitle={
        <Trans i18nKey="nav.alerting.subtitle">Learn about problems in your systems moments after they occur</Trans>
      }
      navId="alerting"
    >
      <Stack gap={2} direction="column">
        {/*<WelcomeHeader />*/}
        <PluginIntegrations />
      </Stack>
      <Box marginTop={{ lg: 2, md: 0, xs: 0 }}>
        <TabsBar>
          {insightsEnabled && (
            <Tab
              key="insights"
              label={t('ablestack-wall.alert.insight-tab', 'Insights')}
              active={activeTab === 'insights'}
              onChangeTab={() => setActiveTab('insights')}
            />
          )}
          {/*<Tab*/}
          {/*  key="overview"*/}
          {/*  label="Get started"*/}
          {/*  active={activeTab === 'overview'}*/}
          {/*  onChangeTab={() => setActiveTab('overview')}*/}
          {/*/>*/}
        </TabsBar>
        <TabContent>
          {activeTab === 'insights' && <insightsScene.Component model={insightsScene} />}
          {/*{activeTab === 'overview' && <GettingStarted />}*/}
        </TabContent>
      </Box>
    </AlertingPageWrapper>
  );
}
