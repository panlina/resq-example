import React from "react";
import ReactDOM from "react-dom";
import ReactJsonTree from "react-json-tree";
import q from "q";
import Memory from "resq/Memory";
import data from "resq/test/data";
class Body extends React.Component {
	constructor(props) {
		super(props);
		this.r = Memory(data);
		this.state = {
			input: 1,
			schema: 'post',
			output: undefined
		};
	}
	render() {
		return <div>
			<ReactJsonTree data={this.state.input}></ReactJsonTree>
			<ReactJsonTree data={this.state.schema}></ReactJsonTree>
			<button onClick={() => {
				q.resolve(this.state.input)
					.then(this.r.join(this.state.schema))
					.then(output => { this.setState({ output }); });
			}}>go</button>
			<ReactJsonTree data={this.state.output}></ReactJsonTree>
		</div>;
	}
}
ReactDOM.render(<Body />, document.getElementById('body'));
