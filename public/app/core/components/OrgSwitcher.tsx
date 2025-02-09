import React from 'react';

import { getBackendSrv } from '@grafana/runtime';
import { UserOrgDTO } from '@grafana/data';
import { Modal, Button, CustomScrollbar } from '@grafana/ui';

import { contextSrv } from 'app/core/services/context_srv';
import config from 'app/core/config';
import { css } from '@emotion/css';

interface Props {
  onDismiss: () => void;
}

interface State {
  orgs: UserOrgDTO[];
}

export class OrgSwitcher extends React.PureComponent<Props, State> {
  state: State = {
    orgs: [],
  };

  componentDidMount() {
    this.getUserOrgs();
  }

  getUserOrgs = async () => {
    const orgs: UserOrgDTO[] = await getBackendSrv().get('/api/user/orgs');
    this.setState({ orgs });
  };

  setCurrentOrg = async (org: UserOrgDTO) => {
    await getBackendSrv().post(`/api/user/using/${org.orgId}`);
    this.setWindowLocation(`${config.appSubUrl}${config.appSubUrl.endsWith('/') ? '' : '/'}?orgId=${org.orgId}`);
  };

  setWindowLocation(href: string) {
    window.location.href = href;
  }

  render() {
    const { onDismiss } = this.props;
    const { orgs } = this.state;

    const currentOrgId = contextSrv.user.orgId;
    const contentClassName = css({
      display: 'flex',
      maxHeight: 'calc(85vh - 42px)',
    });

    return (
      <Modal
        title="조직 스위치"
        icon="arrow-random"
        onDismiss={onDismiss}
        isOpen={true}
        contentClassName={contentClassName}
      >
        <CustomScrollbar autoHeightMin="100%">
          <table className="filter-table form-inline">
            <thead>
              <tr>
                <th>이름</th>
                <th>권한</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {orgs.map((org) => (
                <tr key={org.orgId}>
                  <td>{org.name}</td>
                  <td>{org.role}</td>
                  <td className="text-right">
                    {org.orgId === currentOrgId ? (
                      <Button size="sm">현재</Button>
                    ) : (
                      <Button variant="secondary" size="sm" onClick={() => this.setCurrentOrg(org)}>
                        변경
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CustomScrollbar>
      </Modal>
    );
  }
}
