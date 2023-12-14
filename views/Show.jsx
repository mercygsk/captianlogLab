const React = require('react')
class Show extends React.Component {
  render () {
   const log = this.props.log
    return (
      <div>
      <h1> Show Page </h1>
      <h2>   <a href={'/logs'}>Back to Index page</a> </h2>
       <h3> The {log.title}  {log.entry} </h3>
        {log.shipIsBroken? 'Its is ready to Break' : 'It is not ready to break... Cant touch this' }
     
      </div>
      );
     }
   }
  module.exports  = Show;