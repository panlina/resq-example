import React from "react";
import ReactDOM from "react-dom";
import ReactJsonTree from "react-json-tree";
import resq from "resq";
import Memory from "resq/Access.Memory";
import Delimited from 'resq/Reference.Delimited';
import data from "resq/test/data";
import "./index.css";
class Body extends React.Component {
	constructor(props) {
		super(props);
		var access = Memory(data, { clone: true });
		access.get = Delayed(access.get);
		this.r = resq({ access, reference: Delimited('.') });
		this.state = {
			example: Object.keys(example)[0],
			$output: undefined
		};
		function Delayed(get) {
			return (id, type, relation) =>
				get(id, type, relation).delay(1000);
		}
	}
	get input() { return example[this.state.example].input; }
	get schema() { return example[this.state.example].schema; }
	render() {
		return <div>
			<select value={this.state.example} onChange={event => { this.setState({ example: event.target.value }); }}>
				{Object.keys(example).map(name => <option key={name}>{name}</option>)}
			</select>
			<button onClick={() => {
				var input = clone(this.input);
				var $output = this.r.join(this.schema)(input);
				$output.progress(() => { this.forceUpdate(); });
				this.setState({ $output });
			}}>go</button>
			<div name="example">
				<ReactJsonTree data={this.input} getItemString={() => undefined} shouldExpandNode={() => true}></ReactJsonTree>
				<ReactJsonTree data={this.schema} getItemString={() => undefined} shouldExpandNode={() => true}></ReactJsonTree>
			</div>
			{
				this.state.$output &&
					<ReactJsonTree data={this.state.$output.$} getItemString={() => undefined} shouldExpandNode={() => true}></ReactJsonTree>
			}
		</div>;
		function clone(object) { return JSON.parse(JSON.stringify(object)); }
	}
}
var example = {
	"join singular": {
		input: 1,
		schema: 'post'
	},
	"join complex": {
		input: { a: 1, b: [1, 2] },
		schema: {
			a: ['post', {
				userId: "user as user",
				x: "/x",
				y: "/y"
			}],
			b: [['user', {
				x: "/x",
				post: ["/post", ['post']]
			}]]
		}
	},
	"parse reference": {
		input: ["post.1", "user.1"],
		schema: []
	}
};
ReactDOM.render(<Body />, document.getElementById('body'));
