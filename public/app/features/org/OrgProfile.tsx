import { Input, Field, FieldSet, Button } from '@grafana/ui';
import { Form } from 'app/core/components/Form/Form';
import { contextSrv } from 'app/core/core';
import { AccessControlAction } from 'app/types';

import { Trans } from '../../core/internationalization';

export interface Props {
  orgName: string;
  onSubmit: (orgName: string) => void;
}

interface FormDTO {
  orgName: string;
}

const OrgProfile = ({ onSubmit, orgName }: Props) => {
  const canWriteOrg = contextSrv.hasPermission(AccessControlAction.OrgsWrite);

  return (
    <Form defaultValues={{ orgName }} onSubmit={({ orgName }: FormDTO) => onSubmit(orgName)}>
      {({ register }) => (
        <FieldSet
          label={<Trans i18nKey="shared-preferences.fields.organization-profile-label">Organization profile</Trans>}
          disabled={!canWriteOrg}
        >
          <Field label={<Trans i18nKey="shared-preferences.fields.organization-name-label">Organization name</Trans>}>
            <Input id="org-name-input" type="text" {...register('orgName', { required: true })} />
          </Field>

          <Button type="submit" variant="primary">
            <Trans i18nKey="shared-preferences.fields.update-organization-name-button">Update organization name</Trans>
          </Button>
        </FieldSet>
      )}
    </Form>
  );
};

export default OrgProfile;
