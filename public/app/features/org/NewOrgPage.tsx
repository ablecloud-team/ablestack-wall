import { connect, ConnectedProps } from 'react-redux';

import { Button, Input, Field, FieldSet } from '@grafana/ui';
import { Form } from 'app/core/components/Form/Form';
import { Page } from 'app/core/components/Page/Page';
import { getConfig } from 'app/core/config';
import { Trans } from 'app/core/internationalization';

import { createOrganization } from './state/actions';

const mapDispatchToProps = {
  createOrganization,
};

const connector = connect(undefined, mapDispatchToProps);

type Props = ConnectedProps<typeof connector>;

interface CreateOrgFormDTO {
  name: string;
}

const pageNav: { icon: string; id: string; text: JSX.Element } = {
  icon: 'building',
  id: 'org-new',
  text: <Trans i18nKey="ablestack-wall.administration.general.new-organization">New organization</Trans>,
};

export const NewOrgPage = ({ createOrganization }: Props) => {
  const createOrg = async (newOrg: { name: string }) => {
    await createOrganization(newOrg);
    window.location.href = getConfig().appSubUrl + '/org';
  };

  return (
    <Page navId="global-orgs" pageNav={pageNav}>
      <Page.Contents>
        <p className="muted">
          <Trans i18nKey="ablestack-wall.administration.general.new-organization-description">
            Each organization contains their own dashboards, data sources, and configuration, which cannot be shared
            shared between organizations. While users might belong to more than one organization, multiple organizations
            are most frequently used in multi-tenant deployments.
          </Trans>
        </p>

        <Form<CreateOrgFormDTO> onSubmit={createOrg}>
          {({ register, errors }) => {
            return (
              <>
                <FieldSet>
                  <Field
                    label={
                      <Trans i18nKey="ablestack-wall.administration.general.new-organization-name">
                        Organization name
                      </Trans>
                    }
                    invalid={!!errors.name}
                    error={errors.name && errors.name.message}
                  >
                    <Input
                      placeholder="Org name"
                      {...register('name', {
                        required: 'Organization name is required',
                      })}
                    />
                  </Field>
                </FieldSet>
                <Button type="submit">
                  <Trans i18nKey="ablestack-wall.administration.general.new-organization-name-create">Create</Trans>
                </Button>
              </>
            );
          }}
        </Form>
      </Page.Contents>
    </Page>
  );
};

export default connector(NewOrgPage);
