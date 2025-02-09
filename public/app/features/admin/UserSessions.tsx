import React, { PureComponent } from 'react';
import { css } from '@emotion/css';
import { ConfirmButton, ConfirmModal, Button } from '@grafana/ui';
import { AccessControlAction, UserSession } from 'app/types';
import { contextSrv } from 'app/core/core';

interface Props {
  sessions: UserSession[];

  onSessionRevoke: (id: number) => void;
  onAllSessionsRevoke: () => void;
}

interface State {
  showLogoutModal: boolean;
}

export class UserSessions extends PureComponent<Props, State> {
  state: State = {
    showLogoutModal: false,
  };

  showLogoutConfirmationModal = (show: boolean) => () => {
    this.setState({ showLogoutModal: show });
  };

  onSessionRevoke = (id: number) => {
    return () => {
      this.props.onSessionRevoke(id);
    };
  };

  onAllSessionsRevoke = () => {
    this.setState({ showLogoutModal: false });
    this.props.onAllSessionsRevoke();
  };

  render() {
    const { sessions } = this.props;
    const { showLogoutModal } = this.state;

    const logoutFromAllDevicesClass = css`
      margin-top: 0.8rem;
    `;

    const canLogout = contextSrv.hasPermission(AccessControlAction.UsersLogout);

    return (
      <>
        <h3 className="page-heading">세션</h3>
        <div className="gf-form-group">
          <div className="gf-form">
            <table className="filter-table form-inline">
              <thead>
                <tr>
                  <th>Last seen</th>
                  <th>Logged on</th>
                  <th>IP address</th>
                  <th colSpan={2}>Browser and OS</th>
                </tr>
              </thead>
              <tbody>
                {sessions &&
                  sessions.map((session, index) => (
                    <tr key={`${session.id}-${index}`}>
                      <td>{session.isActive ? 'Now' : session.seenAt}</td>
                      <td>{session.createdAt}</td>
                      <td>{session.clientIp}</td>
                      <td>{`${session.browser} on ${session.os} ${session.osVersion}`}</td>
                      <td>
                        <div className="pull-right">
                          {canLogout && (
                            <ConfirmButton
                              confirmText="Confirm logout"
                              confirmVariant="destructive"
                              onConfirm={this.onSessionRevoke(session.id)}
                            >
                              Force logout
                            </ConfirmButton>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          <div className={logoutFromAllDevicesClass}>
            {canLogout && sessions.length > 0 && (
              <Button variant="secondary" onClick={this.showLogoutConfirmationModal(true)}>
                모든 장치에서 강제 로그아웃
              </Button>
            )}
            <ConfirmModal
              isOpen={showLogoutModal}
              title="모든 장치에서 강제 로그아웃"
              body="모든 장치에서 강제로 로그아웃하시겠습니까?"
              confirmText="강제 로그아웃"
              onConfirm={this.onAllSessionsRevoke}
              onDismiss={this.showLogoutConfirmationModal(false)}
            />
          </div>
        </div>
      </>
    );
  }
}
