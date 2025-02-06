import { withErrorBoundary } from '@grafana/ui';
import { t } from 'app/core/internationalization';

import { AlertmanagerPageWrapper } from '../AlertingPageWrapper';

import MuteTimingForm from './MuteTimingForm';

const NewMuteTimingPage = () => (
  <AlertmanagerPageWrapper
    navId="am-routes"
    pageNav={{
      id: 'alert-policy-new',
      text: t('ablestack-wall.alert.mute-timings-add', 'Add mute timing'),
    }}
    accessType="notification"
  >
    <MuteTimingForm />
  </AlertmanagerPageWrapper>
);

export default withErrorBoundary(NewMuteTimingPage, { style: 'page' });
