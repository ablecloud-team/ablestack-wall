// Libraries
import { PureComponent } from 'react';

import { PanelProps } from '@grafana/data';
import { reportInteraction } from '@grafana/runtime';
import { contextSrv } from 'app/core/core';
import { backendSrv } from 'app/core/services/backend_srv';
import { getDashboardSrv } from 'app/features/dashboard/services/DashboardSrv';

import { getSteps } from './steps';
import { SetupStep } from './types';

interface State {
  checksDone: boolean;
  currentStep: number;
  steps: SetupStep[];
}

export class GettingStarted extends PureComponent<PanelProps, State> {
  state = {
    checksDone: false,
    currentStep: 0,
    steps: getSteps(),
  };

  async componentDidMount() {
    this.setState({ checksDone: true, steps: [], currentStep: 0 });
  }

  onForwardClick = () => {
    reportInteraction('grafana_getting_started_button_to_advanced_tutorials');
    this.setState((prevState) => ({
      currentStep: prevState.currentStep + 1,
    }));
  };

  onPreviousClick = () => {
    reportInteraction('grafana_getting_started_button_to_basic_tutorials');
    this.setState((prevState) => ({
      currentStep: prevState.currentStep - 1,
    }));
  };

  dismiss = () => {
    const { id } = this.props;
    const dashboard = getDashboardSrv().getCurrent();
    const panel = dashboard?.getPanelById(id);

    reportInteraction('grafana_getting_started_remove_panel');

    dashboard?.removePanel(panel!);

    backendSrv.put('/api/user/helpflags/1', undefined, { showSuccessAlert: false }).then((res) => {
      contextSrv.user.helpFlags1 = res.helpFlags1;
    });
  };

  render() {
    return null;
  }
}
