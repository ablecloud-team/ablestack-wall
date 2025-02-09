import React, { PureComponent } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { SlideDown } from 'app/core/components/Animations/SlideDown';
import { UserPicker } from 'app/core/components/Select/UserPicker';
import { TagBadge } from 'app/core/components/TagFilter/TagBadge';
import { TeamMember, OrgUser } from 'app/types';
import { addTeamMember } from './state/actions';
import { getSearchMemberQuery, isSignedInUserTeamAdmin } from './state/selectors';
import { WithFeatureToggle } from 'app/core/components/WithFeatureToggle';
import { config } from 'app/core/config';
import { contextSrv } from 'app/core/services/context_srv';
import TeamMemberRow from './TeamMemberRow';
import { setSearchMemberQuery } from './state/reducers';
import { CloseButton } from 'app/core/components/CloseButton/CloseButton';
import { Button, FilterInput, Label } from '@grafana/ui';
import { SelectableValue } from '@grafana/data';

function mapStateToProps(state: any) {
  return {
    searchMemberQuery: getSearchMemberQuery(state.team),
    editorsCanAdmin: config.editorsCanAdmin, // this makes the feature toggle mockable/controllable from tests,
    signedInUser: contextSrv.user, // this makes the feature toggle mockable/controllable from tests,
  };
}

const mapDispatchToProps = {
  addTeamMember,
  setSearchMemberQuery,
};

const connector = connect(mapStateToProps, mapDispatchToProps);

interface OwnProps {
  members: TeamMember[];
  syncEnabled: boolean;
}

export type Props = ConnectedProps<typeof connector> & OwnProps;

export interface State {
  isAdding: boolean;
  newTeamMember?: SelectableValue<OrgUser['userId']> | null;
}

export class TeamMembers extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { isAdding: false, newTeamMember: null };
  }

  onSearchQueryChange = (value: string) => {
    this.props.setSearchMemberQuery(value);
  };

  onToggleAdding = () => {
    this.setState({ isAdding: !this.state.isAdding });
  };

  onUserSelected = (user: SelectableValue<OrgUser['userId']>) => {
    this.setState({ newTeamMember: user });
  };

  onAddUserToTeam = async () => {
    this.props.addTeamMember(this.state.newTeamMember!.id);
    this.setState({ newTeamMember: null });
  };

  renderLabels(labels: string[]) {
    if (!labels) {
      return <td />;
    }

    return (
      <td>
        {labels.map((label) => (
          <TagBadge key={label} label={label} removeIcon={false} count={0} onClick={() => {}} />
        ))}
      </td>
    );
  }

  render() {
    const { isAdding } = this.state;
    const { searchMemberQuery, members, syncEnabled, editorsCanAdmin, signedInUser } = this.props;
    const isTeamAdmin = isSignedInUserTeamAdmin({ members, editorsCanAdmin, signedInUser });

    return (
      <div>
        <div className="page-action-bar">
          <div className="gf-form gf-form--grow">
            <FilterInput placeholder="회원 검색" value={searchMemberQuery} onChange={this.onSearchQueryChange} />
          </div>
          <Button className="pull-right" onClick={this.onToggleAdding} disabled={isAdding || !isTeamAdmin}>
            맴버 추가
          </Button>
        </div>

        <SlideDown in={isAdding}>
          <div className="cta-form">
            <CloseButton aria-label="Close 'Add team member' dialogue" onClick={this.onToggleAdding} />
            <Label htmlFor="user-picker">팀원 추가</Label>
            <div className="gf-form-inline">
              <UserPicker inputId="user-picker" onSelected={this.onUserSelected} className="min-width-30" />
              {this.state.newTeamMember && (
                <Button type="submit" onClick={this.onAddUserToTeam}>
                  팀에 추가
                </Button>
              )}
            </div>
          </div>
        </SlideDown>

        <div className="admin-list-table">
          <table className="filter-table filter-table--hover form-inline">
            <thead>
              <tr>
                <th />
                <th>사용자 이름</th>
                <th>이메일</th>
                <th>이름</th>
                <WithFeatureToggle featureToggle={editorsCanAdmin}>
                  <th>권한</th>
                </WithFeatureToggle>
                {syncEnabled && <th />}
                <th style={{ width: '1%' }} />
              </tr>
            </thead>
            <tbody>
              {members &&
                members.map((member) => (
                  <TeamMemberRow
                    key={member.userId}
                    member={member}
                    syncEnabled={syncEnabled}
                    editorsCanAdmin={editorsCanAdmin}
                    signedInUserIsTeamAdmin={isTeamAdmin}
                  />
                ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default connector(TeamMembers);
