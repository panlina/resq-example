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
		this.r.config.get = Delayed(this.r.config.get);
		this.state = {
			input: 1,
			schema: 'post',
			$output: undefined
		};
		function Delayed(get) {
			return (id, type, relation) =>
				get(id, type, relation).delay(1000);
		}
	}
	render() {
		return <div>
			<ReactJsonTree data={this.state.input} shouldExpandNode={() => true}></ReactJsonTree>
			<ReactJsonTree data={this.state.schema} shouldExpandNode={() => true}></ReactJsonTree>
			<button onClick={() => {
				var $output = q.resolve(this.state.input)
					.then(this.r.join(this.state.schema));
				$output.then(() => { this.forceUpdate(); });
				this.setState({ $output });
			}}>go</button>
			{
				this.state.$output && (
					this.state.$output.isFulfilled() ?
						<ReactJsonTree data={this.state.$output.inspect().value} shouldExpandNode={() => true}></ReactJsonTree> :
						<div>loading..</div>
				)
			}
		</div>;
	}
}
ReactDOM.render(<Body />, document.getElementById('body'));
