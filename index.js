import React from "react";
import ReactDOM from "react-dom";
import ReactJsonTree from "react-json-tree";
import Json from "resq/Json";
import data from "resq/test/data";
class Body extends React.Component {
	constructor(props) {
		super(props);
		this.r = Json(data);
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
			<ReactJsonTree data={this.state.input} getItemString={() => undefined} shouldExpandNode={() => true}></ReactJsonTree>
			<ReactJsonTree data={this.state.schema} getItemString={() => undefined} shouldExpandNode={() => true}></ReactJsonTree>
			<button onClick={() => {
				var input = clone(this.state.input);
				var $output = this.r.join(this.state.schema)(input);
				$output.progress(() => { this.forceUpdate(); });
				this.setState({ $output });
			}}>go</button>
			{
				this.state.$output &&
					<ReactJsonTree data={this.state.$output.$} getItemString={() => undefined} shouldExpandNode={() => true}></ReactJsonTree>
			}
		</div>;
		function clone(object) { return JSON.parse(JSON.stringify(object)); }
	}
}
ReactDOM.render(<Body />, document.getElementById('body'));
