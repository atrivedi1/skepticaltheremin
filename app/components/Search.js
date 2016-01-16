var React = require('react');

var Search = React.createClass({

  getInitialState() {
    return { value: '' };
  },

  handleChange(event) {
    var location = $('#autocomplete').val();
    this.setState({value: location});
  },

  handleSubmit(event){
    
    event.preventDefault();
    
    // When the form is submitted, call the onSearch callback that is passed to the component

    this.props.onSearch(this.state.value, null, true);

    // Unfocus the text input field
    this.getDOMNode().querySelector('input').blur();
  },

  render() {

    return (
      <form id="geocoding_form" className="form-horizontal" onSubmit={this.handleSubmit}>
        <div className="form-group">
          <div className="col-xs-12 col-md-6 col-md-offset-3">
            <div className="input-group">
              <div id="locationField">
                <input id="autocomplete" type="text" className="form-control" placeholder="Place a pin..." 
                value={this.state.value} onChange={this.handleChange} />
              </div>
              <span className="input-group-btn">
                <span data-toggle="modal" data-target="#myModal" className="glyphicon glyphicon-search" aria-hidden="true"></span>
              </span>
            </div>
          </div>
        </div>
      </form>
    );

  }
});

module.exports = Search;
