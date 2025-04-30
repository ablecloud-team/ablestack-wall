import { Permissions } from 'app/core/components/AccessControl';
import { t } from 'app/core/internationalization';
import { contextSrv } from 'app/core/services/context_srv';

import { AccessControlAction, ServiceAccountDTO } from '../../types';

type ServiceAccountPermissionsProps = {
  serviceAccount: ServiceAccountDTO;
};

export const ServiceAccountPermissions = (props: ServiceAccountPermissionsProps) => {
  const canSetPermissions = contextSrv.hasPermissionInMetadata(
    AccessControlAction.ServiceAccountsPermissionsWrite,
    props.serviceAccount
  );

  return (
    <Permissions
      title="Permissions"
      addPermissionTitle={t('ablestack-wall.administration.service-and-access.add-permission', 'Add permission')}
      buttonLabel={t('ablestack-wall.administration.service-and-access.add-permission', 'Add permission')}
      resource="serviceaccounts"
      resourceId={props.serviceAccount.id}
      canSetPermissions={canSetPermissions}
    />
  );
};
