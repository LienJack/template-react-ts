import React, { Component } from "react";

export default class Count extends Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0
    };
  }

  handleClick() {
    this.setState({
      count: ++this.state.count
    });
  }

  render() {
    return (
      <div>
      <h1>11</h1>
      </div>
    );
  }
}
