import React from 'react';
import Issue from '../components/Issue/Issue';
import SideNav from '../components/SideNav/SideNav';

export default function IssuePage() {
  // const changePage = (page, params, source) => {
  //     this.setState({ currentPage: page, data: params, source: source });
  //   };

  //   async checkSession() {
  //     try {
  //       await axios.post(`${API_ENDPOINT}/session`);
  //     } catch (err) {
  //       this.setState({ toHomepage: true });
  //       displaySessionExpired();
  //     }
  //   }

  //   returnPage = page => {
  //     switch (page) {
  //       case 0:
  //         return <TeamDashboard changePage={this.changePage} checkSession={this.checkSession} />;
  //       case 1:
  //         return <UserDashboard changePage={this.changePage} checkSession={this.checkSession} />;
  //       case 2:
  //         return <Schedule />;
  //       case 3:
  //         return <Schedule />;
  //       case 4:
  //         return <MembersView />;
  //       case 5:
  //         return <WrappedCreateIssueForm changePage={this.changePage} />;
  //       case 6:
  //         return <Active changePage={this.changePage} />;
  //       case 7:
  //         return <Backlog changePage={this.changePage} />;
  //       case 8:
  //         return <Schedule />;
  //       case 9:
  //         return <Schedule />;
  //       case 10:
  //         return <Settings />;
  //       case 11:
  //         return <Issue changePage={this.changePage} data={this.state.data} source={this.state.source} />; // issue information
  //       case 12:
  //         return <Help />;
  //       default:
  //         return <TeamDashboard />;
  //     }
  //   };

  return (
    <>
      <SideNav />
      <div style={{ display: 'flex', width: '100%' }}>
        <Issue changePage={this.changePage} data={this.state.data} source={this.state.source} />
      </div>
    </>
  );
}
