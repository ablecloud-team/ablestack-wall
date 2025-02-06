import { PropsWithChildren, useMemo } from 'react';

import { VariableType, VariableHide } from '@grafana/data';
import { Field, RadioButtonGroup } from '@grafana/ui';
import { t } from 'app/core/internationalization';

interface Props {
  onChange: (option: VariableHide) => void;
  hide: VariableHide;
  type: VariableType;
}

// const HIDE_OPTIONS = [
//   { label: t("ablestack-wall.dashboard.label-and-value", "Label and value"), value: VariableHide.dontHide },
//   { label: t("ablestack-wall.dashboard.value", "Value"), value: VariableHide.hideLabel },
//   { label: t("ablestack-wall.dashboard.nothing", "Nothing"), value: VariableHide.hideVariable },
// ];

export function VariableHideSelect({ onChange, hide, type }: PropsWithChildren<Props>) {
  const HIDE_OPTIONS = [
    { label: t('ablestack-wall.dashboard.label-and-value', 'Label and value'), value: VariableHide.dontHide },
    { label: t('ablestack-wall.dashboard.value', 'Value'), value: VariableHide.hideLabel },
    { label: t('ablestack-wall.dashboard.nothing', 'Nothing'), value: VariableHide.hideVariable },
  ];
  const value = useMemo(() => HIDE_OPTIONS.find((o) => o.value === hide)?.value ?? HIDE_OPTIONS[0].value, [hide]);

  if (type === 'constant') {
    return null;
  }

  return (
    <Field label={t('ablestack-wall.dashboard.show-on-dashboard', 'Show on dashboard')}>
      <RadioButtonGroup options={HIDE_OPTIONS} onChange={onChange} value={value} />
    </Field>
  );
}
