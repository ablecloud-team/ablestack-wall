import { useEffect, useState } from 'react';
import { useMatch } from 'react-router-dom-v5-compat';

import { NavModelItem } from '@grafana/data';
import { t } from 'app/core/internationalization';

const defaultPageNav: Partial<NavModelItem> = {
  icon: 'bell-slash',
};

export function useSilenceNavData() {
  const [pageNav, setPageNav] = useState<NavModelItem | undefined>();
  const isNewPath = useMatch('/alerting/silence/new');
  const isEditPath = useMatch('/alerting/silence/:id/edit');

  useEffect(() => {
    if (isNewPath) {
      setPageNav({
        ...defaultPageNav,
        id: 'silence-new',
        text: t('ablestack-wall.alert.silence-alert-rule', 'Silence alert rule'),
        subTitle: t(
          'ablestack-wall.alert.silence-alert-rule-subtitle',
          'Configure silences to stop notifications from a particular alert rule.'
        ),
      });
    } else if (isEditPath) {
      setPageNav({
        ...defaultPageNav,
        id: 'silence-edit',
        text: t('ablestack-wall.alert.edit-silence', 'Edit silence'),
        subTitle: t(
          'ablestack-wall.alert.recreate-existing-silence-description',
          'Recreate existing silence to stop notifications from a particular alert rule'
        ),
      });
    }
  }, [isEditPath, isNewPath]);

  return pageNav;
}
