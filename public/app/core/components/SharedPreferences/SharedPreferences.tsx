import React, { PureComponent } from 'react';
import { css } from '@emotion/css';

import {
  Button,
  Field,
  FieldSet,
  Form,
  Icon,
  Label,
  RadioButtonGroup,
  Select,
  stylesFactory,
  TimeZonePicker,
  WeekStartPicker,
  Tooltip,
} from '@grafana/ui';
import { SelectableValue } from '@grafana/data';
import { selectors } from '@grafana/e2e-selectors';

import { DashboardSearchHit, DashboardSearchItemType } from 'app/features/search/types';
import { backendSrv } from 'app/core/services/backend_srv';
import { PreferencesService } from 'app/core/services/PreferencesService';

export interface Props {
  resourceUri: string;
}

export interface State {
  homeDashboardId: number;
  theme: string;
  timezone: string;
  weekStart: string;
  dashboards: DashboardSearchHit[];
}

const themes: SelectableValue[] = [
  { value: '', label: 'Default' },
  { value: 'dark', label: 'Dark' },
  { value: 'light', label: 'Light' },
];

export class SharedPreferences extends PureComponent<Props, State> {
  service: PreferencesService;

  constructor(props: Props) {
    super(props);

    this.service = new PreferencesService(props.resourceUri);
    this.state = {
      homeDashboardId: 0,
      theme: '',
      timezone: '',
      weekStart: '',
      dashboards: [],
    };
  }

  async componentDidMount() {
    const prefs = await this.service.load();
    const dashboards = await backendSrv.search({ starred: true });
    const defaultDashboardHit: DashboardSearchHit = {
      id: 0,
      title: 'Default',
      tags: [],
      type: '' as DashboardSearchItemType,
      uid: '',
      uri: '',
      url: '',
      folderId: 0,
      folderTitle: '',
      folderUid: '',
      folderUrl: '',
      isStarred: false,
      slug: '',
      items: [],
    };

    if (prefs.homeDashboardId > 0 && !dashboards.find((d) => d.id === prefs.homeDashboardId)) {
      const missing = await backendSrv.search({ dashboardIds: [prefs.homeDashboardId] });
      if (missing && missing.length > 0) {
        dashboards.push(missing[0]);
      }
    }

    this.setState({
      homeDashboardId: prefs.homeDashboardId,
      theme: prefs.theme,
      timezone: prefs.timezone,
      weekStart: prefs.weekStart,
      dashboards: [defaultDashboardHit, ...dashboards],
    });
  }

  onSubmitForm = async () => {
    const { homeDashboardId, theme, timezone, weekStart } = this.state;
    await this.service.update({ homeDashboardId, theme, timezone, weekStart });
    window.location.reload();
  };

  onThemeChanged = (value: string) => {
    this.setState({ theme: value });
  };

  onTimeZoneChanged = (timezone?: string) => {
    if (!timezone) {
      return;
    }
    this.setState({ timezone: timezone });
  };

  onWeekStartChanged = (weekStart: string) => {
    this.setState({ weekStart: weekStart });
  };

  onHomeDashboardChanged = (dashboardId: number) => {
    this.setState({ homeDashboardId: dashboardId });
  };

  getFullDashName = (dashboard: SelectableValue<DashboardSearchHit>) => {
    if (typeof dashboard.folderTitle === 'undefined' || dashboard.folderTitle === '') {
      return dashboard.title;
    }
    return dashboard.folderTitle + ' / ' + dashboard.title;
  };

  render() {
    const { theme, timezone, weekStart, homeDashboardId, dashboards } = this.state;
    const styles = getStyles();

    return (
      <Form onSubmit={this.onSubmitForm}>
        {() => {
          return (
            <FieldSet label="기본 설정">
              <Field label="UI 테마">
                <RadioButtonGroup
                  options={themes}
                  value={themes.find((item) => item.value === theme)?.value}
                  onChange={this.onThemeChanged}
                />
              </Field>

              <Field
                label={
                  <Label htmlFor="home-dashboard-select">
                    <span className={styles.labelText}>Home Dashboard</span>
                    <Tooltip content="원하는 대시보드를 찾지 못하셨습니까? 먼저 별표 표시를 하면 이 선택 상자에 표시됩니다.">
                      <Icon name="info-circle" />
                    </Tooltip>
                  </Label>
                }
                aria-label="User preferences home dashboard drop down"
              >
                <Select
                  menuShouldPortal
                  value={dashboards.find((dashboard) => dashboard.id === homeDashboardId)}
                  getOptionValue={(i) => i.id}
                  getOptionLabel={this.getFullDashName}
                  onChange={(dashboard: SelectableValue<DashboardSearchHit>) =>
                    this.onHomeDashboardChanged(dashboard.id)
                  }
                  options={dashboards}
                  placeholder="Choose default dashboard"
                  inputId="home-dashboard-select"
                />
              </Field>

              <Field label="시간대" aria-label={selectors.components.TimeZonePicker.container}>
                <TimeZonePicker includeInternal={true} value={timezone} onChange={this.onTimeZoneChanged} />
              </Field>

              <Field label="Week start" aria-label={selectors.components.WeekStartPicker.container}>
                <WeekStartPicker value={weekStart} onChange={this.onWeekStartChanged} />
              </Field>
              <div className="gf-form-button-row">
                <Button variant="primary" aria-label="User preferences save button">
                  저장
                </Button>
              </div>
            </FieldSet>
          );
        }}
      </Form>
    );
  }
}

export default SharedPreferences;

const getStyles = stylesFactory(() => {
  return {
    labelText: css`
      margin-right: 6px;
    `,
  };
});
