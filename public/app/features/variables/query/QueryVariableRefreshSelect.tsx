import { PropsWithChildren, useMemo, useState } from 'react';

import { VariableRefresh } from '@grafana/data';
import { Field, RadioButtonGroup, useTheme2 } from '@grafana/ui';
import { useMediaQueryChange } from 'app/core/hooks/useMediaQueryChange';
import { t } from 'app/core/internationalization';

interface Props {
  onChange: (option: VariableRefresh) => void;
  refresh: VariableRefresh;
  testId?: string;
}

export function QueryVariableRefreshSelect({ onChange, refresh, testId }: PropsWithChildren<Props>) {
  const theme = useTheme2();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const REFRESH_OPTIONS = [
    {
      label: t('ablestack-wall.dashboard.on-dashboard-load', 'On dashboard load'),
      value: VariableRefresh.onDashboardLoad,
    },
    {
      label: t('ablestack-wall.dashboard.on-time-range-change', 'On time range change'),
      value: VariableRefresh.onTimeRangeChanged,
    },
  ];

  const [isSmallScreen, setIsSmallScreen] = useState(false);
  useMediaQueryChange({
    breakpoint: theme.breakpoints.values.sm,
    onChange: (e) => {
      setIsSmallScreen(!e.matches);
    },
  });

  const value = useMemo(
    () => REFRESH_OPTIONS.find((o) => o.value === refresh)?.value ?? REFRESH_OPTIONS[0].value,
    [refresh, REFRESH_OPTIONS]
  );

  return (
    <Field
      label={t('ablestack-wall.dashboard.refresh', 'Refresh')}
      description={t('ablestack-wall.dashboard.refresh-description', 'When to update the values of this variable')}
      data-testid={testId}
    >
      <RadioButtonGroup
        options={REFRESH_OPTIONS}
        onChange={onChange}
        value={value}
        size={isSmallScreen ? 'sm' : 'md'}
      />
    </Field>
  );
}
