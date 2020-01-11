import _ from "lodash";
import React, { Component } from "react";
import { Search, Grid, Header, Segment } from "semantic-ui-react";
import source from "./classes"
import './searchbar.css';
var i;
const initialState = { isLoading: false, results: [], value: "" };
var classes = [];
for(i =0; i<source.length; i++) {
  classes.push(source[i].title)
}

export default class SearchExampleStandard extends Component {
  state = initialState;

  handleResultSelect = (e, { result }) => {
    //this.setState({ value: result.title })
    this.props.updateclass(result.title)
    this.setState({
      value: "",
      results: []
     })
  };

  handleKeyPress = (e) => {
    if(e.charCode === 13) {
        if (classes.includes(this.state.value)) {
          this.props.updateclass(this.state.value)
        }
        else {
          const re = new RegExp(_.escapeRegExp(this.state.value), "i");
          const isMatch = result => re.test(result.title);
          const results = _.filter(source, isMatch)
          //console.log(results)
          if(results.length > 0) {
            if (classes.includes(results[0].title)) {
              this.props.updateclass(results[0].title)
            }
          }
        }
        this.setState({
         value: "",
         results: []
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
      //<div style={{textAlign: 'center'}}>
          <Grid>
            <Grid.Column width={16}>
              <div id="searchbar">
                <Search id="actualsearchbar" icon="search"
                  loading={isLoading}
                  onResultSelect={this.handleResultSelect}
                  onSearchChange={_.debounce(this.handleSearchChange, 500, {
                    leading: true
                  })}
                  results={results}
                  value={value}
                  onKeyPress={this.handleKeyPress}
                  {...this.props}
                  size="massive"
                  fluid="true"
                />
              </div>
              
            </Grid.Column>
          
          </Grid>
      //</div>
      
    );
  }
}
