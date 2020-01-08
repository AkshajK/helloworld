import _ from "lodash";
import React, { Component } from "react";
import { Search, Grid, Header, Segment } from "semantic-ui-react";
import source from "./classes"

var i;
const initialState = { isLoading: false, results: [], value: "" };
var classes = [];
for(i =0; i<source.length; i++) {
  classes.push(source[i].title)
}

export default class SearchExampleStandard extends Component {
  state = initialState;

  handleResultSelect = (e, { result }) =>
    this.setState({ value: result.title });

  handleKeyPress = (e) => {
    if(e.charCode === 13) {
        if (classes.includes(this.state.value)) {
          this.props.updateclass(this.state.value)
        }
        this.setState({
         value: ""
        })
    }
    
  };

  handleSearchChange = (e, { value }) => {
    this.setState({ isLoading: true, value });

    setTimeout(() => {
      if (this.state.value.length < 1) return this.setState(initialState);

      const re = new RegExp(_.escapeRegExp(this.state.value), "i");
      const isMatch = result => re.test(result.title);

      this.setState({
        isLoading: false,
        results: _.filter(source, isMatch)
      });
    }, 300);
  };

  render() {
    const { isLoading, value, results } = this.state;

    return (
      <Grid>
        <Grid.Column width={6}>
          <Search
            loading={isLoading}
            onResultSelect={this.handleResultSelect}
            onSearchChange={_.debounce(this.handleSearchChange, 500, {
              leading: true
            })}
            results={results}
            value={value}
            onKeyPress={this.handleKeyPress}
            {...this.props}
          />
        </Grid.Column>
      
      </Grid>
    );
  }
}
