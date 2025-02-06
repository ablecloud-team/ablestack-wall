import { Stack, Text } from '@grafana/ui';
import { t } from 'app/core/internationalization';

export const MetricsHeader = () => (
  <Stack direction="column" gap={1}>
    <Text variant="h1">{t('ablestack-wall.common.metrics', 'Metrics')}</Text>
    <Text color="secondary">
      {t(
        'ablestack-wall.explore.explore-metrics-info',
        'Explore your Prometheus-compatible metrics without writing a query'
      )}
    </Text>
  </Stack>
);
