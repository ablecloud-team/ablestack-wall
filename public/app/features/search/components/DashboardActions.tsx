import React, { FC } from 'react';
import { HorizontalGroup, LinkButton } from '@grafana/ui';

export interface Props {
  folderId?: number;
  isEditor: boolean;
  canEdit?: boolean;
}

export const DashboardActions: FC<Props> = ({ folderId, isEditor, canEdit }) => {
  const actionUrl = (type: string) => {
    let url = `dashboard/${type}`;

    if (folderId) {
      url += `?folderId=${folderId}`;
    }

    return url;
  };

  return (
    <div>
      <HorizontalGroup spacing="md" align="center">
        {canEdit && <LinkButton href={actionUrl('new')}>새 대시보드</LinkButton>}
        {!folderId && isEditor && <LinkButton href="dashboards/folder/new">새 폴더</LinkButton>}
        {canEdit && <LinkButton href={actionUrl('import')}>임포트</LinkButton>}
      </HorizontalGroup>
    </div>
  );
};
