const React = require('react');

class Edit extends React.Component {
    render() {
        return (
            <div>
                <h1> Edit the Logs</h1>
                <form action={`/logs/${this.props.log._id}?_method=PUT`} method="POST">
                title: <input type="text"  title=" title" defaultValue={this.props.log.title} /><br />
                entry: <input type="text"entry="entry" defaultValue={this.props.log.entry} /><br />
                {/* timestamps: <input type="text"timestamps="timestamps" defaultValue={this.props.log.timestamps} /><br /> */}
                    Is Ready To Break:
                    {this.props.log.shipIsBroken ? <input type="checkbox" title="shipIsBroken" defaultChecked /> : <input type="checkbox" title="shipIsBroken" />}
                    <br />
                    <input type="submit" value="Submit Changes" />
                </form>
            </div>

        )
    }
}
module.exports = Edit;