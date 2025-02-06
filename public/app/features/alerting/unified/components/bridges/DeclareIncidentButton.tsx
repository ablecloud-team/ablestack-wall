import { Button, LinkButton, Menu, Tooltip } from '@grafana/ui';
import { t } from 'app/core/internationalization';

import { usePluginBridge } from '../../hooks/usePluginBridge';
import { SupportedPlugin } from '../../types/pluginBridges';
import { createBridgeURL } from '../PluginBridge';

interface Props {
  title?: string;
  severity?: 'minor' | 'major' | 'critical' | '';
  url?: string;
}

export const DeclareIncidentButton = ({ title = '', severity = '', url = '' }: Props) => {
  const bridgeURL = createBridgeURL(SupportedPlugin.Incident, '/incidents/declare', { title, severity, url });

  const { loading, installed, settings } = usePluginBridge(SupportedPlugin.Incident);

  return (
    <>
      {loading === true && (
        <Button icon="fire" size="sm" type="button" disabled>
          {t('ablestack-wall.alert.declare-incident', 'Declare incident')}
        </Button>
      )}
      {installed === false && (
        <Tooltip content={'Grafana Incident is not installed or is not configured correctly'}>
          <Button icon="fire" size="sm" type="button" disabled>
            {t('ablestack-wall.alert.declare-incident', 'Declare incident')}
          </Button>
        </Tooltip>
      )}
      {settings && (
        <LinkButton icon="fire" size="sm" type="button" href={bridgeURL}>
          {t('ablestack-wall.alert.declare-incident', 'Declare incident')}
        </LinkButton>
      )}
    </>
  );
};

export const DeclareIncidentMenuItem = ({ title = '', severity = '', url = '' }: Props) => {
  const bridgeURL = createBridgeURL(SupportedPlugin.Incident, '/incidents/declare', { title, severity, url });

  const { loading, installed, settings } = usePluginBridge(SupportedPlugin.Incident);

  return (
    <>
      {loading === true && (
        <Menu.Item label={t('ablestack-wall.alert.declare-incident', 'Declare incident')} icon="fire" disabled />
      )}
      {installed === false && (
        <Tooltip content={'Grafana Incident is not installed or is not configured correctly'}>
          <Menu.Item label={t('ablestack-wall.alert.declare-incident', 'Declare incident')} icon="fire" disabled />
        </Tooltip>
      )}
      {settings && (
        <Menu.Item label={t('ablestack-wall.alert.declare-incident', 'Declare incident')} url={bridgeURL} icon="fire" />
      )}
    </>
  );
};
