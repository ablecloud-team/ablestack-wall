import { Permissions } from 'app/core/components/AccessControl';
import { t } from 'app/core/internationalization';
import { contextSrv } from 'app/core/services/context_srv';

import { AccessControlAction, Team } from '../../types';

type TeamPermissionsProps = {
  team: Team;
};

// TeamPermissions component replaces TeamMembers component when the accesscontrol feature flag is set
const TeamPermissions = (props: TeamPermissionsProps) => {
  const canSetPermissions = contextSrv.hasPermissionInMetadata(
    AccessControlAction.ActionTeamsPermissionsWrite,
    props.team
  );

  return (
    <Permissions
      title=""
      addPermissionTitle={t('ablestack-wall.administration.service-and-access.add-member', 'Add member')}
      buttonLabel={t('ablestack-wall.administration.service-and-access.add-member', 'Add member')}
      emptyLabel={t(
        'ablestack-wall.administration.service-and-access.no-members',
        'There are no members in this team or you do not have the permissions to list the current members.'
      )}
      resource="teams"
      resourceId={props.team.id}
      canSetPermissions={canSetPermissions}
    />
  );
};

export default TeamPermissions;
