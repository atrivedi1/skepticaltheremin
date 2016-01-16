var React = require('react');
var UserStoryListItem = require('./UserStoryListItem');

var NavBar = React.createClass({

  // handleClick: function() {
  //   this.setState({open: !this.state.open});

  // },

  // getInitialState: function() {
  //   return { open : false };
  // },

  // handleItemClick: function(item) {
  //   this.setState({
  //     open: false,
  //     itemTitle: item
  //   });
  // },



  render() {

    var storyList;
    if (this.props.options.storyNames) {
      storyList = this.props.options.storyNames.map(function(storyName) {
        return <UserStoryListItem story={storyName.name} storyid={storyName.id} storyClick={this.props.getUserStory}/>
      }.bind(this));      
    } else {
      storyList = [];
    }

    return (
      <div>
        <nav className="navbar navbar-default navbar-inverse navbar-fixed-top">
          <div className="container-fluid">
            <div className="navbar-header" >
              <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
                <span className="sr-only">Toggle navigation</span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
              </button>
              <a className="navbar-brand" href="#">StoryMap</a>
            </div>

            <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
              <ul className="nav navbar-nav navbar-right">
                <li><a href="#" data-toggle="modal" data-target="#myModal">+ Add a Story</a></li>
                <li className="dropdown">
                  <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">View A Story<span className="caret"></span></a>
                  {/*** Adds UserStoryList Dropdown ***/}
                  <ul className="dropdown-menu">
                    {storyList}
                  </ul>
                </li>
                <li><a href='#'>Logout</a></li>
              </ul>
            </div>
          </div>
        </nav>

        <div id="myModal" className="modal fade" role="dialog">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <button type="button" className="close" data-dismiss="modal">&times;</button>
                <h4 className="modal-title">New Story</h4>
              </div>
              <div className="modal-body">
                <form className="form-group list-group">
                  <input type="text" className="form-control" id="location" placeholder="Add a new story here!" />
                </form>
              </div>
              <div className="modal-footer">
                <input type='button' className='btn btn-success' value='Add New Story'/>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = NavBar;
