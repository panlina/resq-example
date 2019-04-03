import React from "react";
import ReactDOM from "react-dom";
import ReactJsonTree from "react-json-tree";
import solarized from 'react-json-tree/src/themes/solarized';
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
				var id = 0;
				$output.progress(() => {
					for (var promise of $output.pending) {
						if (!(ID in promise))
							promise[ID] = id++;
						if (!(PROMISE in promise.batch))
							promise.batch[PROMISE] = promise;
					}
				});
				$output.progress(() => { this.forceUpdate(); });
				this.setState({ $output });
			}}>go</button>
			<div name="example">
				<ReactJsonTree data={this.input} getItemString={() => undefined} shouldExpandNode={() => true}></ReactJsonTree>
				<ReactJsonTree data={this.schema} postprocessValue={
					value => value instanceof Array && value.length == 2 ?
						(value[1][ORIGIN] || (value[1][ORIGIN] = []), value[1][ORIGIN].push(value), value[1]) :
						value instanceof Array && value.length == 1 ?
							(value[0][ORIGIN] || (value[0][ORIGIN] = []), value[0][ORIGIN].push(value), value[0]) :
							value
				} getItemString={
					(type, data) =>
						data[ORIGIN] ?
							data[ORIGIN].reduceRight(
								(b, a) => a instanceof Array && a.length == 2 ?
									a[0] :
									a instanceof Array && a.length == 1 ?
										`[${b}]` :
										0,
								0
							) : undefined
				} shouldExpandNode={() => true}></ReactJsonTree>
			</div>
			{
				this.state.$output &&
				<div name="output">
					<ReactJsonTree data={this.state.$output.$} isCustomNode={isPromise} valueRenderer={valueRenderer} getItemString={() => undefined} shouldExpandNode={() => true}></ReactJsonTree>
					<ReactJsonTree hideRoot data={
						{
							pending: this.state.$output.pending
						}
					} postprocessValue={value => isPromise(value) ? value.batch : value} getItemString={(type, data) => <span>{this.state.$output.pending.has(data[PROMISE]) ? <sup style={{ color: solarized.base06 }}>{data[PROMISE][ID]}</sup> : undefined}</span>} shouldExpandNode={() => true}>
					</ReactJsonTree>
				</div>
			}
		</div>;
		function clone(object) { return JSON.parse(JSON.stringify(object)); }
	}
}
function isPromise(value) {
	return typeof value == 'object' && typeof value.then == 'function';
}
function valueRenderer(displayValue, value) {
	if (isPromise(value))
		return <em style={{ color: solarized.base06 }}>loading..<sup>{value[ID]}</sup></em>;
	return value;
}
var ORIGIN = Symbol();
var ID = Symbol();
var PROMISE = Symbol();
var example = {
	"join singular": {
		input: 1,
		schema: 'post'
	},
	"join complex": {
		input: { a: 1, b: [1, 2] },
		schema: {
			a: ['post', {
				user: $this => `/user/${$this.userId}`,
				x: "./x",
				y: "./y"
			}],
			b: [['user', {
				x: "./x",
				post: ["./post", ['post']]
			}]]
		}
	},
	"parse reference": {
		input: ["post.1", "user.1"],
		schema: []
	}
};
ReactDOM.render(<Body />, document.getElementById('body'));
